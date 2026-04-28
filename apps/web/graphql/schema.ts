import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { parse as parseSDL } from "graphql";
import fs from "fs";
import path from "path";
import { scalarResolvers } from "./resolvers/scalars";
import { QueryResolvers_ } from "./resolvers/Query";
import { MutationResolvers_ } from "./resolvers/Mutation";
import { TrainerResolvers_ } from "./resolvers/Trainer";
import { TeamResolvers_ } from "./resolvers/Team";
import { BattleResolvers_ } from "./resolvers/Battle";
import { SubscriptionResolvers_ } from "./resolvers/Subscription";

// Explicitly list SDL files so webpack can bundle them statically.
// Using fs.readFileSync with path.join(process.cwd(), ...) works in both
// Next.js server bundles and tsx (Vitest) because Next.js runs with CWD=apps/web.
function readSDL(filename: string): string {
  return fs.readFileSync(path.join(process.cwd(), "graphql", filename), "utf8");
}

const typeDefs = mergeTypeDefs([
  parseSDL(readSDL("schema.graphql")),
  parseSDL(readSDL("schema.team.graphql")),
  parseSDL(readSDL("schema.battle.graphql")),
]);

const resolvers = [
  scalarResolvers,
  { Query: QueryResolvers_ },
  { Mutation: MutationResolvers_ },
  { Trainer: TrainerResolvers_ },
  { Team: TeamResolvers_ },
  { Battle: BattleResolvers_ },
  { Subscription: SubscriptionResolvers_ },
  {
    Move: {
      __resolveType(obj: { __typename?: string }) {
        return obj.__typename ?? "PhysicalMove";
      },
    },
    BattleAction: {
      __resolveType(obj: { __typename?: string }) {
        return obj.__typename ?? "MoveAction";
      },
    },
  },
];

let cachedSchema: ReturnType<typeof makeExecutableSchema> | null = null;

export function makeSchema() {
  if (cachedSchema) return cachedSchema;
  cachedSchema = makeExecutableSchema({ typeDefs, resolvers });
  return cachedSchema;
}
