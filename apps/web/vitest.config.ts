import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.ts"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
  resolve: {
    alias: {
      "@/graphql": path.resolve(import.meta.dirname, "graphql"),
      "@/lib": path.resolve(import.meta.dirname, "lib"),
      "@/generated": path.resolve(import.meta.dirname, "generated"),
      // Force a single graphql instance across all ESM/CJS boundaries in tests
      graphql: path.resolve(import.meta.dirname, "node_modules/graphql/index.js"),
    },
  },
});
