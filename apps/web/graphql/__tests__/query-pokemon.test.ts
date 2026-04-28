import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execute } from "graphql";
import { parse } from "graphql";
import { PrismaClient } from "@prisma/client";
import { makeSchema } from "../schema";

const prisma = new PrismaClient();
let schema: ReturnType<typeof makeSchema>;

beforeAll(async () => {
  schema = makeSchema();

  // Seed one Pokémon for tests
  const region = await prisma.region.upsert({
    where: { name: "TestRegion" },
    create: { name: "TestRegion", generation: 1 },
    update: {},
  });
  await prisma.pokemon.upsert({
    where: { pokedexNumber: 9999 },
    create: {
      id: "test_pokemon_9999",
      pokedexNumber: 9999,
      name: "Testmon",
      flavorText: "A test Pokémon.",
      types: JSON.stringify(["FIRE"]),
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
      abilities: JSON.stringify([]),
      moves: JSON.stringify([]),
      regionId: region.id,
      height: 0.7,
      weight: 6.9,
      evolutionChain: JSON.stringify([]),
      encounterRate: 45,
      syncedAt: new Date(),
    },
    update: {},
  });
});

afterAll(async () => {
  await prisma.pokemon.deleteMany({ where: { pokedexNumber: 9999 } });
  await prisma.region.deleteMany({ where: { name: "TestRegion" } });
  await prisma.$disconnect();
});

describe("Query.pokemon", () => {
  it("returns a Pokémon by ID", async () => {
    const result = await execute({
      schema,
      document: parse(`
        query {
          pokemon(id: "test_pokemon_9999") {
            id
            name
            encounterRate
            types
          }
        }
      `),
      contextValue: {
        prisma,
        viewer: null,
        request: new Request("http://localhost"),
      },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.pokemon).toMatchObject({
      id: "test_pokemon_9999",
      name: "Testmon",
      encounterRate: 45,
      types: ["FIRE"],
    });
  });

  it("returns null for an unknown ID", async () => {
    const result = await execute({
      schema,
      document: parse(`query { pokemon(id: "does-not-exist") { id name } }`),
      contextValue: {
        prisma,
        viewer: null,
        request: new Request("http://localhost"),
      },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.pokemon).toBeNull();
  });

  it("returns a paginated connection via Query.pokemons", async () => {
    const result = await execute({
      schema,
      document: parse(`
        query {
          pokemons(first: 1) {
            edges { node { id name } cursor }
            pageInfo { hasNextPage endCursor }
            totalCount
          }
        }
      `),
      contextValue: {
        prisma,
        viewer: null,
        request: new Request("http://localhost"),
      },
    });
    expect(result.errors).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = result.data as any;
    expect(data?.pokemons.edges.length).toBeGreaterThan(0);
    expect(typeof data?.pokemons.totalCount).toBe("number");
  });
});
