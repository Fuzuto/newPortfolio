import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  resolve: { tsconfigPaths: true },
  build: {
    rolldownOptions: {
      // This app renders entirely on the client.
      checks: { moduleLevelDirective: false },
      output: {
        codeSplitting: {
          groups: [{ name: 'gsap', test: /[\\/]node_modules[\\/]gsap[\\/]/ }],
        },
      },
    },
  },
});
