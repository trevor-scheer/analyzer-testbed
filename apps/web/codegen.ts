import type { CodegenConfig } from "@graphql-codegen/cli";

const sharedScalars = {
  DateTime: "Date | string",
};

const config: CodegenConfig = {
  schema: "./graphql/*.graphql",
  documents: ["app/**/*.{ts,tsx}", "graphql/fragments/*.ts", "graphql/operations/*.graphql"],
  generates: {
    // Shared base types (scalars, enums, input types, object types)
    "./graphql/generated/types.ts": {
      plugins: ["typescript"],
      config: {
        scalars: sharedScalars,
        enumsAsTypes: false,
        avoidOptionals: false,
      },
    },
    // Client-side operation types + TypedDocumentNode instances
    // Includes typescript plugin so the file is self-contained.
    "./graphql/generated/operations.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        documentMode: "documentNode",
        useTypeImports: true,
        scalars: sharedScalars,
        enumsAsTypes: false,
        avoidOptionals: false,
      },
    },
    // Server-side resolver types
    // Includes typescript plugin so the file is self-contained.
    "./graphql/generated/resolvers.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../../graphql/context#Context",
        useIndexSignature: true,
        useTypeImports: true,
        scalars: sharedScalars,
        enumsAsTypes: false,
        avoidOptionals: false,
        mappers: {
          Pokemon: "@prisma/client#Pokemon as PrismaPokemons",
          Trainer: "@prisma/client#Trainer as PrismaTrainer",
          Team: "@prisma/client#Team as PrismaTeam",
          TeamSlot: "@prisma/client#TeamSlot as PrismaTeamSlot",
          Battle: "@prisma/client#Battle as PrismaBattle",
          BattleTurn: "@prisma/client#BattleTurn as PrismaBattleTurn",
        },
      },
    },
  },
};

export default config;
