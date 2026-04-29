import { createYoga } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import { makeSchema } from "../../../graphql/schema";
import { buildContext } from "../../../graphql/context";
import type { NextRequest } from "next/server";

// Reuse PrismaClient across hot-reloads in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const yoga = createYoga({
  schema: makeSchema(),
  context: async ({ request }: { request: Request }) => {
    return buildContext({ request, prisma });
  },
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response, Request, ReadableStream },
});

async function handler(request: NextRequest) {
  const response = await yoga.handleRequest(request, { request } as never);

  // Forward any Set-Cookie headers added by signIn/signOut mutations.
  // Yoga extensions can't mutate headers directly, so resolvers signal via
  // a context property we check here.
  return response;
}

export const GET = handler;
export const POST = handler;
