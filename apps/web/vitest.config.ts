import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.ts", "**/*.test.ts"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
  resolve: {
    alias: {
      // Specific sub-paths first so they take priority over the catch-all below
      "@/graphql": path.resolve(import.meta.dirname, "graphql"),
      "@/lib": path.resolve(import.meta.dirname, "lib"),
      "@/components": path.resolve(import.meta.dirname, "components"),
      "@/generated": path.resolve(import.meta.dirname, "generated"),
      // Catch-all for any other @/ imports (e.g. @/app, @/prisma)
      "@": path.resolve(import.meta.dirname, "."),
      // Force a single graphql instance across all ESM/CJS boundaries in tests
      graphql: path.resolve(import.meta.dirname, "node_modules/graphql/index.js"),
    },
  },
});
