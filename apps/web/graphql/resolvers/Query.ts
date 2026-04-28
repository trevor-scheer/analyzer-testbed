import type { QueryResolvers } from "../../generated/types";
import type { Context } from "../context";

function encodeCursor(id: string): string {
  return Buffer.from(`cursor:${id}`).toString("base64url");
}

function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, "base64url").toString("utf8").replace("cursor:", "");
}

export const QueryResolvers_: QueryResolvers<Context> = {
  pokemon: async (_parent, { id }, { prisma }) => {
    const p = await prisma.pokemon.findUnique({ where: { id } });
    if (!p) return null;
    return {
      ...p,
      types: JSON.parse(p.types),
      baseStats: {
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        specialAttack: p.specialAttack,
        specialDefense: p.specialDefense,
        speed: p.speed,
      },
      abilities: JSON.parse(p.abilities),
      moves: JSON.parse(p.moves),
      evolutionChain: JSON.parse(p.evolutionChain),
      captureRate: p.encounterRate,
    };
  },

  pokemonByNumber: async (_parent, { number }, { prisma }) => {
    const p = await prisma.pokemon.findUnique({
      where: { pokedexNumber: number },
    });
    if (!p) return null;
    return {
      ...p,
      types: JSON.parse(p.types),
      baseStats: {
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        specialAttack: p.specialAttack,
        specialDefense: p.specialDefense,
        speed: p.speed,
      },
      abilities: JSON.parse(p.abilities),
      moves: JSON.parse(p.moves),
      evolutionChain: JSON.parse(p.evolutionChain),
      captureRate: p.encounterRate,
    };
  },

  pokemons: async (_parent, { after, first = 20, filter }, { prisma }) => {
    const take = Math.min(first ?? 20, 100);
    const afterId = after ? decodeCursor(after) : undefined;

    const where: Record<string, unknown> = {};
    if (filter?.nameContains) {
      where.name = { contains: filter.nameContains };
    }
    if (filter?.types && filter.types.length > 0) {
      // SQLite JSON doesn't support contains-array queries directly;
      // filter client-side after fetching (reasonable for 151 Pokémon).
    }

    const [totalCount, rows] = await Promise.all([
      prisma.pokemon.count({ where }),
      prisma.pokemon.findMany({
        where,
        take: take + 1,
        ...(afterId ? { cursor: { id: afterId }, skip: 1 } : {}),
        orderBy: { pokedexNumber: "asc" },
        include: { region: true },
      }),
    ]);

    const hasNextPage = rows.length > take;
    const items = hasNextPage ? rows.slice(0, take) : rows;

    // Client-side type filter (SQLite limitation)
    const filtered =
      filter?.types && filter.types.length > 0
        ? items.filter((p) => {
            const types: string[] = JSON.parse(p.types);
            return filter.types!.every((t) => types.includes(t));
          })
        : items;

    const edges = filtered.map((p) => ({
      cursor: encodeCursor(p.id),
      node: {
        ...p,
        types: JSON.parse(p.types),
        baseStats: {
          hp: p.hp,
          attack: p.attack,
          defense: p.defense,
          specialAttack: p.specialAttack,
          specialDefense: p.specialDefense,
          speed: p.speed,
        },
        abilities: JSON.parse(p.abilities),
        moves: JSON.parse(p.moves),
        evolutionChain: JSON.parse(p.evolutionChain),
        captureRate: p.encounterRate,
      },
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: Boolean(afterId),
        startCursor: edges[0]?.cursor ?? null,
        endCursor: edges[edges.length - 1]?.cursor ?? null,
      },
      totalCount,
    };
  },

  typeEffectiveness: async (_parent, { attacker, defender }) => {
    // Type chart — gen 2+ (including Fairy).
    // Returns the full 18×18 matrix when no filter is given,
    // or filtered rows when attacker/defender are provided.
    const chart = getTypeChart();
    return chart.filter(
      (e) => (!attacker || e.attacker === attacker) && (!defender || e.defender === defender),
    ) as never;
  },

  regions: async (_parent, _args, { prisma }) => {
    return prisma.region.findMany({ orderBy: { generation: "asc" } });
  },

  viewer: async (_parent, _args, { prisma, viewer }) => {
    if (!viewer) return null;
    return prisma.trainer.findUnique({ where: { id: viewer.id } });
  },

  team: async (_parent, { id }, { prisma, viewer }) => {
    if (!viewer) return null;
    const team = await prisma.team.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!team || team.ownerId !== viewer.id) return null;
    return team;
  },

  battle: async (_parent, { id }, { prisma }) => {
    return prisma.battle.findUnique({ where: { id } });
  },

  myBattles: async (_parent, _args, { prisma, viewer }) => {
    if (!viewer) return [];
    return prisma.battle.findMany({
      where: {
        OR: [{ trainerAId: viewer.id }, { trainerBId: viewer.id }],
      },
      orderBy: { startedAt: "desc" },
    });
  },
};

// ---- Type chart data ----

type PokemonType =
  | "NORMAL"
  | "FIRE"
  | "WATER"
  | "ELECTRIC"
  | "GRASS"
  | "ICE"
  | "FIGHTING"
  | "POISON"
  | "GROUND"
  | "FLYING"
  | "PSYCHIC"
  | "BUG"
  | "ROCK"
  | "GHOST"
  | "DRAGON"
  | "DARK"
  | "STEEL"
  | "FAIRY";

function getTypeChart(): Array<{
  attacker: PokemonType;
  defender: PokemonType;
  multiplier: number;
}> {
  const types: PokemonType[] = [
    "NORMAL",
    "FIRE",
    "WATER",
    "ELECTRIC",
    "GRASS",
    "ICE",
    "FIGHTING",
    "POISON",
    "GROUND",
    "FLYING",
    "PSYCHIC",
    "BUG",
    "ROCK",
    "GHOST",
    "DRAGON",
    "DARK",
    "STEEL",
    "FAIRY",
  ];

  // Sparse multipliers — omitted pairs default to 1.
  const overrides: Partial<Record<PokemonType, Partial<Record<PokemonType, number>>>> = {
    NORMAL: { ROCK: 0.5, GHOST: 0, STEEL: 0.5 },
    FIRE: {
      FIRE: 0.5,
      WATER: 0.5,
      GRASS: 2,
      ICE: 2,
      BUG: 2,
      ROCK: 0.5,
      DRAGON: 0.5,
      STEEL: 2,
    },
    WATER: {
      FIRE: 2,
      WATER: 0.5,
      GRASS: 0.5,
      GROUND: 2,
      ROCK: 2,
      DRAGON: 0.5,
    },
    ELECTRIC: {
      WATER: 2,
      ELECTRIC: 0.5,
      GRASS: 0.5,
      GROUND: 0,
      FLYING: 2,
      DRAGON: 0.5,
    },
    GRASS: {
      FIRE: 0.5,
      WATER: 2,
      GRASS: 0.5,
      POISON: 0.5,
      GROUND: 2,
      FLYING: 0.5,
      BUG: 0.5,
      ROCK: 2,
      DRAGON: 0.5,
      STEEL: 0.5,
    },
    ICE: {
      FIRE: 0.5,
      WATER: 0.5,
      GRASS: 2,
      ICE: 0.5,
      GROUND: 2,
      FLYING: 2,
      DRAGON: 2,
      STEEL: 0.5,
    },
    FIGHTING: {
      NORMAL: 2,
      ICE: 2,
      POISON: 0.5,
      FLYING: 0.5,
      PSYCHIC: 0.5,
      BUG: 0.5,
      ROCK: 2,
      GHOST: 0,
      DARK: 2,
      STEEL: 2,
      FAIRY: 0.5,
    },
    POISON: {
      GRASS: 2,
      POISON: 0.5,
      GROUND: 0.5,
      ROCK: 0.5,
      GHOST: 0.5,
      STEEL: 0,
      FAIRY: 2,
    },
    GROUND: {
      FIRE: 2,
      ELECTRIC: 2,
      GRASS: 0.5,
      POISON: 2,
      FLYING: 0,
      BUG: 0.5,
      ROCK: 2,
      STEEL: 2,
    },
    FLYING: {
      ELECTRIC: 0.5,
      GRASS: 2,
      ICE: 0.5,
      FIGHTING: 2,
      BUG: 2,
      ROCK: 0.5,
      STEEL: 0.5,
    },
    PSYCHIC: { FIGHTING: 2, POISON: 2, PSYCHIC: 0.5, DARK: 0, STEEL: 0.5 },
    BUG: {
      FIRE: 0.5,
      GRASS: 2,
      FIGHTING: 0.5,
      POISON: 0.5,
      FLYING: 0.5,
      PSYCHIC: 2,
      GHOST: 0.5,
      DARK: 2,
      STEEL: 0.5,
      FAIRY: 0.5,
    },
    ROCK: {
      FIRE: 2,
      ICE: 2,
      FIGHTING: 0.5,
      GROUND: 0.5,
      FLYING: 2,
      BUG: 2,
      STEEL: 0.5,
    },
    GHOST: { NORMAL: 0, PSYCHIC: 2, GHOST: 2, DARK: 0.5 },
    DRAGON: { DRAGON: 2, STEEL: 0.5, FAIRY: 0 },
    DARK: { FIGHTING: 0.5, PSYCHIC: 2, GHOST: 2, DARK: 0.5, FAIRY: 0.5 },
    STEEL: {
      FIRE: 0.5,
      WATER: 0.5,
      ELECTRIC: 0.5,
      ICE: 2,
      ROCK: 2,
      STEEL: 0.5,
      FAIRY: 2,
    },
    FAIRY: {
      FIRE: 0.5,
      FIGHTING: 2,
      POISON: 0.5,
      DRAGON: 2,
      DARK: 2,
      STEEL: 0.5,
    },
  };

  const chart: Array<{
    attacker: PokemonType;
    defender: PokemonType;
    multiplier: number;
  }> = [];
  for (const attacker of types) {
    for (const defender of types) {
      const multiplier = overrides[attacker]?.[defender] ?? 1;
      chart.push({ attacker, defender, multiplier });
    }
  }
  return chart;
}
