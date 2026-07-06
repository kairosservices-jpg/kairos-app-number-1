import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

const appFallbackPlugin = () => ({
  name: 'app-fallback',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // If the request is for an /app route and doesn't look like a file request
      if (req.url.startsWith('/app') && !req.url.match(/\.[a-zA-Z0-9]+$/)) {
        req.url = '/app/index.html';
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), appFallbackPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        apply: resolve(__dirname, 'apply.html'),
        premium: resolve(__dirname, 'premium.html'),
        standard: resolve(__dirname, 'standard.html'),
        outOfRange: resolve(__dirname, 'out-of-range.html'),
        notQualified: resolve(__dirname, 'not-qualified.html'),
        finallyFit: resolve(__dirname, 'finally-fit.html'),
        localUnqualified: resolve(__dirname, 'local-unqualified.html'),
        nonLocal: resolve(__dirname, 'non-local.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        links: resolve(__dirname, 'links.html'),
        mealQuiz: resolve(__dirname, 'meal-quiz.html'),
        mealPlanDashboard: resolve(__dirname, 'meal-plan-dashboard.html'),
        app: resolve(__dirname, 'app/index.html')
      }
    }
  }
});
