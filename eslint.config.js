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
      // The PokéForge schema is intentionally idiomatic-but-not-pristine.
      // `require-description` and `strict-id-in-types` are demonstrated in the
      // dedicated lint-examples workspace (added in plan 04). Keeping them off
      // here lets the primary app schema feel like a real-world codebase.
      "@graphql-analyzer/require-description": "off",
      "@graphql-analyzer/strict-id-in-types": "off",
      // `TypeEffectiveness` legitimately describes type matchups; the prefix
      // is meaningful, not a Type/TypeWrapper anti-pattern.
      "@graphql-analyzer/naming-convention": "off",
      // The Move interface implementations (PhysicalMove/SpecialMove/StatusMove)
      // are reachable via interface dispatch (`Move` is selected in queries
      // and resolved to its concrete subtype). The linter doesn't currently
      // model interface reachability.
      "@graphql-analyzer/no-unreachable-types": "off",
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
