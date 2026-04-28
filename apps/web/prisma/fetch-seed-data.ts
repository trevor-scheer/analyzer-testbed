/**
 * Fetches gen-1 Pokémon from PokeAPI and writes seed-data/pokemon.json.
 * Idempotent: exits without fetching if the file already exists.
 *
 * Run: pnpm db:seed:fetch
 */
import fs from "fs";
import path from "path";

const OUT_PATH = path.join(__dirname, "seed-data", "pokemon.json");
const GEN1_COUNT = 151;

interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ slot: number; type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  abilities: Array<{
    ability: { name: string; url: string };
    is_hidden: boolean;
  }>;
  moves: Array<{ move: { name: string; url: string } }>;
  species: { url: string };
}

interface PokeApiSpecies {
  capture_rate: number;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }>;
  generation: { name: string };
  evolution_chain: { url: string };
}

interface PokeApiAbility {
  effect_entries: Array<{ effect: string; language: { name: string } }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
}

interface PokeApiMove {
  id: number;
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  type: { name: string };
  damage_class: { name: string };
  effect_entries: Array<{ effect: string; language: { name: string } }>;
  meta: { ailment: { name: string } } | null;
  effect_chance: number | null;
}

const TYPE_MAP: Record<string, string> = {
  normal: "NORMAL",
  fire: "FIRE",
  water: "WATER",
  electric: "ELECTRIC",
  grass: "GRASS",
  ice: "ICE",
  fighting: "FIGHTING",
  poison: "POISON",
  ground: "GROUND",
  flying: "FLYING",
  psychic: "PSYCHIC",
  bug: "BUG",
  rock: "ROCK",
  ghost: "GHOST",
  dragon: "DRAGON",
  dark: "DARK",
  steel: "STEEL",
  fairy: "FAIRY",
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

function statValue(stats: PokeApiPokemon["stats"], name: string): number {
  return stats.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function main() {
  if (fs.existsSync(OUT_PATH)) {
    console.log(`seed-data/pokemon.json already exists — skipping fetch.`);
    console.log(`Delete it and re-run to refresh.`);
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

  console.log(`Fetching ${GEN1_COUNT} gen-1 Pokémon from PokeAPI...`);
  const results: unknown[] = [];

  // Batch in groups of 20 to be polite to the API
  for (let i = 1; i <= GEN1_COUNT; i += 20) {
    const batch = Array.from({ length: Math.min(20, GEN1_COUNT - i + 1) }, (_, j) => i + j);
    console.log(`  fetching #${batch[0]}–#${batch[batch.length - 1]}...`);

    const batchData = await Promise.all(
      batch.map(async (num) => {
        const pokemon = await fetchJson<PokeApiPokemon>(`https://pokeapi.co/api/v2/pokemon/${num}`);
        const species = await fetchJson<PokeApiSpecies>(pokemon.species.url);

        const flavorText =
          species.flavor_text_entries.find(
            (e) => e.language.name === "en" && e.version.name === "red",
          )?.flavor_text ??
          species.flavor_text_entries.find((e) => e.language.name === "en")?.flavor_text ??
          "";

        const generation =
          parseInt(species.generation.name.replace("generation-", "").replace(/[^0-9]/g, ""), 10) ||
          1;

        // Fetch abilities (first 2 to keep seed fast)
        const abilityData = await Promise.all(
          pokemon.abilities.slice(0, 2).map(async (a) => {
            const ab = await fetchJson<PokeApiAbility>(a.ability.url);
            return {
              id: a.ability.url.split("/").filter(Boolean).pop() ?? a.ability.name,
              name: capitalize(a.ability.name.replace(/-/g, " ")),
              description:
                ab.flavor_text_entries.find((e) => e.language.name === "en")?.flavor_text ??
                ab.effect_entries.find((e) => e.language.name === "en")?.effect ??
                "",
              isHidden: a.is_hidden,
            };
          }),
        );

        // Fetch first 4 learnable moves
        const moveData = await Promise.all(
          pokemon.moves.slice(0, 4).map(async (m) => {
            const mv = await fetchJson<PokeApiMove>(m.move.url);
            const description =
              mv.effect_entries.find((e) => e.language.name === "en")?.effect ?? "";
            const base = {
              id: String(mv.id),
              name: capitalize(mv.name.replace(/-/g, " ")),
              type: TYPE_MAP[mv.type.name] ?? "NORMAL",
              power: mv.power,
              accuracy: mv.accuracy,
              pp: mv.pp,
              description,
            };
            if (mv.damage_class.name === "physical") {
              return { ...base, __typename: "PhysicalMove", makesContact: true };
            } else if (mv.damage_class.name === "special") {
              return {
                ...base,
                __typename: "SpecialMove",
                effectChance: mv.effect_chance,
              };
            } else {
              return {
                ...base,
                __typename: "StatusMove",
                inflicts:
                  mv.meta?.ailment?.name === "none" ? null : (mv.meta?.ailment?.name ?? null),
              };
            }
          }),
        );

        return {
          id: `pokemon_${num}`,
          pokedexNumber: num,
          name: capitalize(pokemon.name),
          flavorText: flavorText.replace(/\f/g, " ").replace(/\n/g, " "),
          types: pokemon.types
            .sort((a, b) => a.slot - b.slot)
            .map((t) => TYPE_MAP[t.type.name] ?? "NORMAL"),
          baseStats: {
            hp: statValue(pokemon.stats, "hp"),
            attack: statValue(pokemon.stats, "attack"),
            defense: statValue(pokemon.stats, "defense"),
            specialAttack: statValue(pokemon.stats, "special-attack"),
            specialDefense: statValue(pokemon.stats, "special-defense"),
            speed: statValue(pokemon.stats, "speed"),
          },
          abilities: abilityData,
          moves: moveData,
          region: { name: "Kanto", generation },
          height: pokemon.height / 10,
          weight: pokemon.weight / 10,
          evolutionChain: [],
          encounterRate: species.capture_rate,
          syncedAt: new Date().toISOString(),
        };
      }),
    );
    results.push(...batchData);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} Pokémon to ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
