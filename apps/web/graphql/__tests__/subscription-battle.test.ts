import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { subscribe, parse } from "graphql";
import { PrismaClient } from "@prisma/client";
import { makeSchema } from "../schema";
import { pubSub } from "../pubsub";

const prisma = new PrismaClient();
let schema: ReturnType<typeof makeSchema>;
let trainerA: {
  id: string;
  name: string;
  joinedAt: Date;
  favoritePokemonId: string | null;
};

beforeAll(async () => {
  schema = makeSchema();
  trainerA = await prisma.trainer.upsert({
    where: { name: "__sub_test_a__" },
    create: { name: "__sub_test_a__" },
    update: {},
  });
  await prisma.trainer.upsert({
    where: { name: "__sub_test_b__" },
    create: { name: "__sub_test_b__" },
    update: {},
  });
});

afterAll(async () => {
  await prisma.battle.deleteMany({
    where: {
      OR: [{ trainerAId: trainerA.id }, { trainerBId: trainerA.id }],
    },
  });
  await prisma.trainer.deleteMany({
    where: { name: { in: ["__sub_test_a__", "__sub_test_b__"] } },
  });
  await prisma.$disconnect();
});

describe("Subscription.battleUpdates", () => {
  it("receives a published battle update", async () => {
    const battleId = "test-battle-sub-001";

    const iterator = await subscribe({
      schema,
      document: parse(`
        subscription {
          battleUpdates(battleId: "${battleId}") {
            message
            battle { id }
          }
        }
      `),
      contextValue: {
        prisma,
        viewer: trainerA,
        request: new Request("http://localhost"),
      },
    });

    if ("errors" in iterator) {
      throw new Error(iterator.errors?.map((e) => e.message).join(", "));
    }

    // Publish a test event
    setTimeout(() => {
      pubSub.publish("BATTLE_UPDATE", battleId, {
        battleUpdates: {
          battle: { id: battleId } as never,
          latestTurn: null,
          message: "Test update from vitest",
        },
      });
    }, 10);

    const result = await (iterator as AsyncGenerator<unknown>).next();
    const value = result.value as {
      data?: { battleUpdates?: { message: string } };
    };
    expect(value.data?.battleUpdates?.message).toBe("Test update from vitest");
  });
});
