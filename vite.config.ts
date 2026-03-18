import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [],
  },
  staged: {
    "*.{ts,tsx,js,jsx,mjs,cjs,sh,md,json,toml}": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
