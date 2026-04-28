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
      "**/prisma/migrations/**",
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
];

export default config;
