import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: '/ai-coding-workflow-labs/gsd-framework/',
  plugins: [preact()],
});
