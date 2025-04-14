import { Context, Next } from 'hono';
import winston from 'winston';

type LogMetadata = Record<string, unknown>;

const { combine, timestamp, printf, colorize } = winston.format;

class Logger {
  private static instance: Logger;

  private logger!: winston.Logger;

  private serviceId: string = 'delivery-api';

  private initialized: boolean = false;

  private enabledLevels: { [key: string]: boolean } = {
    error: true,
    warn: true,
    info: true,
    http: true,
    debug: true,
  };

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public initialize(
    serviceId: string,
    logLevel: string = 'info',
    colored: boolean = false,
  ): void {
    if (this.initialized) {
      throw new Error('Logger has already been initialized');
    }

    const formats: winston.Logform.Format[] = [];

    const levels = {
      http: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4,
    };

    if (colored) {
      const colors = {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
      };

      winston.addColors(colors);
      formats.push(colorize({ all: true }));
    }

    const customFormat = combine(
      ...formats,
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      printf(
        info =>
          `[${info.timestamp}] [${this.serviceId}] ${info.level}: ${info.message}`,
      ),
    );

    this.logger = winston.createLogger({
      level: logLevel,
      levels,
      format: customFormat,
      transports: [new winston.transports.Console()],
    });

    this.serviceId = serviceId;
    this.initialized = true;
  }

  private log(
    level: 'error' | 'warn' | 'info' | 'http' | 'debug',
    message: string,
    meta?: LogMetadata,
  ): void {
    if (this.enabledLevels[level]) {
      const formattedMessage = this.formatMessage(message, meta);
      this.logger[level](formattedMessage, { serviceId: this.serviceId });
    }
  }

  error(message: string, meta?: LogMetadata, error?: Error): void {
    if (this.enabledLevels.error) {
      const formattedMessage = this.formatMessage(message, meta);
      this.logger.error(formattedMessage, {
        serviceId: this.serviceId,
        error: error?.stack,
      });
    }
  }

  warn(message: string, meta?: LogMetadata): void {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: LogMetadata): void {
    this.log('info', message, meta);
  }

  http(message: string, meta?: LogMetadata): void {
    this.log('http', message, meta);
  }

  debug(message: string, meta?: LogMetadata): void {
    this.log('debug', message, meta);
  }

  private formatMessage(message: string, meta?: LogMetadata): string {
    return meta ? `${message} ${JSON.stringify(meta)}` : message;
  }

  middleware(options?: { skip?: (ctx: Context) => boolean }) {
    return async (ctx: Context, next: Next) => {
      const start = Date.now();
      const { method, path } = ctx.req;

      if (options?.skip?.(ctx)) {
        return await next();
      }

      this.http(`[${method} ${path}] message="Request received"`);

      await next();

      const responseTime = Date.now() - start;

      this.http(
        `[${method} ${path}] message="Response sent" status=${ctx.res.status} duration=${responseTime}ms`,
      );
    };
  }
}

export { Logger };
export const logger = Logger.getInstance();
