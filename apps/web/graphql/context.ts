import { PrismaClient, Trainer } from "@prisma/client";
import { getSessionToken, verifySession } from "../lib/auth";

export interface Context {
  prisma: PrismaClient;
  viewer: Trainer | null;
  /** Raw Request — needed by Mutation resolvers to set/clear cookies via response headers. */
  request: Request;
}

interface BuildContextOptions {
  request: Request;
  prisma: PrismaClient;
}

export async function buildContext({ request, prisma }: BuildContextOptions): Promise<Context> {
  const cookieHeader = request.headers.get("cookie");
  const token = getSessionToken(cookieHeader);
  const trainerId = token ? verifySession(token) : null;

  let viewer: Trainer | null = null;
  if (trainerId) {
    viewer = await prisma.trainer.findUnique({ where: { id: trainerId } });
  }

  return { prisma, viewer, request };
}
