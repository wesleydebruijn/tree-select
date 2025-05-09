import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "tree-select": resolve(__dirname, "../dist/tree-select.mjs"),
      "tree-select.css": resolve(__dirname, "../dist/tree-select.css"),
    },
  },
});
