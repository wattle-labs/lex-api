import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/server.ts'),
    },
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      output: [
        {
          format: 'es',
          dir: 'dist',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        },
      ],
      external: id =>
        !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0'),
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
