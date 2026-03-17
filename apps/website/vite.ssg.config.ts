import { defineConfig } from "vite-plus";
import ssg from "@hono/vite-ssg";

export default defineConfig({
  plugins: [ssg()],
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
