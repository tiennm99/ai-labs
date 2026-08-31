/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ai-labs/superpowers/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",

  },
});
