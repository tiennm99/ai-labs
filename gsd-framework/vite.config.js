import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  base: '/ai-labs/gsd-framework/',
  plugins: [preact()],
});
