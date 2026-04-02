import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        apply: resolve(__dirname, 'apply.html'),
        premium: resolve(__dirname, 'premium.html'),
        standard: resolve(__dirname, 'standard.html'),
        outOfRange: resolve(__dirname, 'out-of-range.html'),
        notQualified: resolve(__dirname, 'not-qualified.html'),
        qualified: resolve(__dirname, 'qualified.html'),
        localUnqualified: resolve(__dirname, 'local-unqualified.html'),
        nonLocal: resolve(__dirname, 'non-local.html')
      }
    }
  }
});
