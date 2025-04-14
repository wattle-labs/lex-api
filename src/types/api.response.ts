export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
  validationErrors?: Array<{ path: string; message: string; code: string }>;
};
