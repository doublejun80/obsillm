import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      obsidian: fileURLToPath(new URL("./tests/mocks/obsidian.ts", import.meta.url)),
    },
    extensions: [".ts", ".tsx", ".mts", ".js", ".jsx", ".mjs", ".json"],
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
