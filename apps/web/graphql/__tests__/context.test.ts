import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildContext } from "../context.js";
import { PrismaClient } from "@prisma/client";

describe("buildContext", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(() => prisma.$disconnect());

  it("returns null viewer for a request with no auth cookie", async () => {
    const request = new Request("http://localhost/api/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
    });
    const ctx = await buildContext({ request, prisma });
    expect(ctx.viewer).toBeNull();
  });

  it("returns the trainer for a valid session cookie", async () => {
    // Seed a trainer directly for this test
    const trainer = await prisma.trainer.upsert({
      where: { name: "__ctx_test__" },
      create: { name: "__ctx_test__" },
      update: {},
    });

    const { signSession, SESSION_COOKIE } = await import("../../lib/auth.js");
    const token = signSession(trainer.id);
    const request = new Request("http://localhost/api/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `${SESSION_COOKIE}=${token}`,
      },
    });
    const ctx = await buildContext({ request, prisma });
    expect(ctx.viewer?.id).toBe(trainer.id);

    await prisma.trainer.delete({ where: { id: trainer.id } });
  });
});
