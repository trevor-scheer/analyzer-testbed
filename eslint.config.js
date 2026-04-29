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
      "**/.svelte-kit/**",
      "**/.astro/**",
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
      // Pokemon.captureRate is intentionally selected by `PokemonDetail` as a
      // demonstration that the analyzer surfaces deprecations. Surface it as
      // a warning (informative) rather than an error (CI-blocking).
      "@graphql-analyzer/no-deprecated": "warn",
    },
  },

  // Fragment files — both real .graphql siblings and virtual .graphql
  // extracted from .ts gql templates by the processor. Spreads happen in
  // operation files of different formats; linter can't resolve cross-file.
  {
    files: [
      "**/graphql/fragments/*.graphql",
      "**/graphql/fragments/*.ts/*.graphql",
    ],
    rules: {
      "@graphql-analyzer/no-unused-fragments": "off",
      // require-selections cannot resolve fragment spreads across files
      "@graphql-analyzer/require-selections": "off",
    },
  },

  // Standalone .graphql operation files reference fragments defined in .ts
  // files. The linter cannot resolve cross-format fragment definitions, so
  // require-selections produces false positives when id is provided by a
  // fragment spread whose definition lives in a TS gql template.
  {
    files: ["**/graphql/operations/**/*.graphql"],
    rules: {
      "@graphql-analyzer/require-selections": "off",
    },
  },

  // Embedded GraphQL inside JS/TS via the plugin's processor — picks up
  // `gql\`...\`` tagged templates and reports diagnostics at their original
  // source position. Don't set `parser` here; the processor extracts before
  // the host language's default parser runs.
  //
  // `no-unused-fragments` is disabled for TS/TSX files because fragments
  // defined here are exported constants consumed via JS import in other files.
  // The processor analyses each file in isolation and cannot see cross-file
  // usage, so the rule produces false positives for every fragment definition
  // that is only spread in a different source file.
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: {
      "@graphql-analyzer": graphqlAnalyzer,
    },
    processor: graphqlAnalyzer.processor,
    rules: {
      ...graphqlAnalyzer.configs["flat/operations-recommended"].rules,
      "@graphql-analyzer/no-unused-fragments": "off",
    },
  },
  // Relay-generated and relay-authored GraphQL fragments follow Relay naming
  // conventions (ComponentName_propName for fragments, OperationNameQuery for
  // queries) which conflict with the default naming-convention rules. Disable
  // it for relay-app sources.
  {
    files: ["examples/relay-app/src/**/*.{ts,tsx}"],
    rules: {
      "@graphql-analyzer/naming-convention": "off",
    },
  },
];

export default config;
