import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./graphql/*.graphql",
  generates: {
    "./generated/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../graphql/context#Context",
        useIndexSignature: true,
        scalars: {
          DateTime: "Date | string",
        },
        enumsAsTypes: false,
        avoidOptionals: false,
        // Use aliased imports so Prisma model names don't collide with GraphQL type names
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
