import graphqlAnalyzer from "@graphql-analyzer/eslint-plugin";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/__generated__/**",
      "**/generated/**",
      "**/prisma/migrations/**",
      "**/next-env.d.ts",
    ],
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    files: ["**/*.graphql"],
    plugins: {
      "@graphql-analyzer": graphqlAnalyzer,
    },
    languageOptions: {
      parser: graphqlAnalyzer.parser,
    },
    rules: {
      ...graphqlAnalyzer.configs["flat/operations-recommended"].rules,
      ...graphqlAnalyzer.configs["flat/schema-recommended"].rules,
    },
  },

  // Embedded GraphQL inside JS/TS via the plugin's processor — picks up
  // `gql\`...\`` tagged templates and reports diagnostics at their original
  // source position. Don't set `parser` here; the processor extracts before
  // the host language's default parser runs.
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: {
      "@graphql-analyzer": graphqlAnalyzer,
    },
    processor: graphqlAnalyzer.processor,
    rules: {
      ...graphqlAnalyzer.configs["flat/operations-recommended"].rules,
    },
  },
];

export default config;
