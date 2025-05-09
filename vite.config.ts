import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, "src/tree-select.ts"),
        resolve(__dirname, "src/tree-select.css"),
      ],
      name: "treeSelect",
      fileName: "tree-select",
    },
    cssCodeSplit: true,
  },
  server: {
    open: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ["tests/**/*"],
    }),
  ],
});
