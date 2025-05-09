import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/tree-select/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "tree-select": resolve(__dirname, "../src/tree-select.ts"),
      "tree-select.css": resolve(__dirname, "../src/tree-select.css"),
    },
  },
});
