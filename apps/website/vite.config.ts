import { defineConfig } from "vite-plus";

export default defineConfig({
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
