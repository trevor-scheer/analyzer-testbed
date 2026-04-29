import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execute, parse } from "graphql";
import { PrismaClient } from "@prisma/client";
import { makeSchema } from "../schema";

const prisma = new PrismaClient();
let schema: ReturnType<typeof makeSchema>;
let trainerId: string;

beforeAll(async () => {
  schema = makeSchema();
  const trainer = await prisma.trainer.upsert({
    where: { name: "__mutation_test__" },
    create: { name: "__mutation_test__" },
    update: {},
  });
  trainerId = trainer.id;
});

afterAll(async () => {
  await prisma.team.deleteMany({
    where: { owner: { name: "__mutation_test__" } },
  });
  await prisma.trainer.deleteMany({ where: { name: "__mutation_test__" } });
  await prisma.$disconnect();
});

describe("Mutation.createTeam", () => {
  it("creates a team owned by the viewer", async () => {
    const trainer = await prisma.trainer.findUniqueOrThrow({
      where: { id: trainerId },
    });

    const result = await execute({
      schema,
      document: parse(`
        mutation {
          createTeam(input: { name: "Dream Team" }) {
            team { id name owner { id name } slots { position } }
          }
        }
      `),
      contextValue: {
        prisma,
        viewer: trainer,
        request: new Request("http://localhost"),
      },
    });

    expect(result.errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result.data as any)?.createTeam.team).toMatchObject({
      name: "Dream Team",
      owner: { id: trainerId, name: "__mutation_test__" },
      slots: [],
    });
  });

  it("throws when called without a viewer", async () => {
    const result = await execute({
      schema,
      document: parse(`mutation { createTeam(input: { name: "Fails" }) { team { id } } }`),
      contextValue: {
        prisma,
        viewer: null,
        request: new Request("http://localhost"),
      },
    });

    expect(result.errors).toBeDefined();
    expect(result.errors?.at(0)?.message).toMatch(/not authenticated/i);
  });
});
