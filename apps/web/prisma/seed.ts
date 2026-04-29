/**
 * Seeds the database from seed-data/pokemon.json.
 * Requires pnpm db:seed:fetch to have been run first.
 *
 * Run: pnpm db:seed
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface SeedPokemon {
  id: string;
  pokedexNumber: number;
  name: string;
  flavorText: string;
  types: string[];
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: unknown[];
  moves: unknown[];
  region: { name: string; generation: number };
  height: number;
  weight: number;
  evolutionChain: unknown[];
  encounterRate: number;
  syncedAt: string;
}

async function main() {
  const seedPath = path.join(__dirname, "seed-data", "pokemon.json");

  if (!fs.existsSync(seedPath)) {
    console.error("seed-data/pokemon.json not found. Run `pnpm db:seed:fetch` first.");
    process.exit(1);
  }

  const pokemon: SeedPokemon[] = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  console.log(`Seeding ${pokemon.length} Pokémon...`);

  // Upsert regions first
  const regionMap = new Map<string, string>();
  const uniqueRegions = [...new Map(pokemon.map((p) => [p.region.name, p.region])).values()];

  for (const region of uniqueRegions) {
    const r = await prisma.region.upsert({
      where: { name: region.name },
      create: { name: region.name, generation: region.generation },
      update: { generation: region.generation },
    });
    regionMap.set(region.name, r.id);
    console.log(`  region: ${r.name} (gen ${r.generation})`);
  }

  // Upsert Pokémon
  for (const p of pokemon) {
    const regionId = regionMap.get(p.region.name);
    if (!regionId) throw new Error(`Region not found: ${p.region.name}`);

    await prisma.pokemon.upsert({
      where: { pokedexNumber: p.pokedexNumber },
      create: {
        id: p.id,
        pokedexNumber: p.pokedexNumber,
        name: p.name,
        flavorText: p.flavorText,
        types: JSON.stringify(p.types),
        hp: p.baseStats.hp,
        attack: p.baseStats.attack,
        defense: p.baseStats.defense,
        specialAttack: p.baseStats.specialAttack,
        specialDefense: p.baseStats.specialDefense,
        speed: p.baseStats.speed,
        abilities: JSON.stringify(p.abilities),
        moves: JSON.stringify(p.moves),
        regionId,
        height: p.height,
        weight: p.weight,
        evolutionChain: JSON.stringify(p.evolutionChain),
        encounterRate: p.encounterRate,
        syncedAt: new Date(p.syncedAt),
      },
      update: {
        name: p.name,
        flavorText: p.flavorText,
        types: JSON.stringify(p.types),
        abilities: JSON.stringify(p.abilities),
        moves: JSON.stringify(p.moves),
        encounterRate: p.encounterRate,
      },
    });

    if (p.pokedexNumber % 25 === 0) {
      console.log(`  seeded up to #${p.pokedexNumber} (${p.name})`);
    }
  }

  // Seed a demo trainer for the battle examples
  await prisma.trainer.upsert({
    where: { name: "Ash" },
    create: { name: "Ash" },
    update: {},
  });
  await prisma.trainer.upsert({
    where: { name: "Gary" },
    create: { name: "Gary" },
    update: {},
  });

  console.log(`\nDone. ${pokemon.length} Pokémon + 2 trainers seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
