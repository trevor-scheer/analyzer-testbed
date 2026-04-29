import { buildSchema, parse, validate } from "graphql";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadSchema(glob: string): ReturnType<typeof buildSchema> {
  // For this script, we load the files explicitly (no glob at runtime).
  const paths = glob.split(",").map((p) => p.trim());
  const sdl = paths.map((p) => readFileSync(p, "utf8")).join("\n");
  return buildSchema(sdl);
}

const pokedexSchema = loadSchema(
  [
    join(root, "../../apps/web/graphql/schema.graphql"),
    join(root, "../../apps/web/graphql/schema.team.graphql"),
    join(root, "../../apps/web/graphql/schema.battle.graphql"),
  ].join(","),
);

const shopSchema = loadSchema(join(root, "schema/shop.graphql"));

interface Case {
  label: string;
  schema: ReturnType<typeof buildSchema>;
  source: string;
}

const cases: Case[] = [
  {
    label: "pokedex/POKEMON_LIST",
    schema: pokedexSchema,
    source: `query PokedexPokemonList($first: Int) {
      pokemons(first: $first) {
        edges { node { id name pokedexNumber types } }
      }
    }`,
  },
  {
    label: "pokedex/POKEMON_DETAIL",
    schema: pokedexSchema,
    source: `query PokedexPokemonDetail($id: ID!) {
      pokemon(id: $id) {
        id name pokedexNumber types
        baseStats { hp attack defense speed }
      }
    }`,
  },
  {
    label: "shop/PRODUCT_LIST",
    schema: shopSchema,
    source: `query ShopProductList {
      products { id name price cost inStock }
    }`,
  },
  {
    label: "shop/PLACE_ORDER",
    schema: shopSchema,
    source: `mutation ShopPlaceOrder($cartId: ID!) {
      placeOrder(cartId: $cartId) { id status placedAt }
    }`,
  },
];

let failures = 0;
for (const { label, schema, source } of cases) {
  const doc = parse(source);
  const errors = validate(schema, doc);
  if (errors.length > 0) {
    console.error(`FAIL ${label}`);
    for (const e of errors) console.error(`  ${e.message}`);
    failures++;
  } else {
    console.log(`PASS ${label}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} validation(s) failed`);
  process.exit(1);
} else {
  console.log(`\nAll ${cases.length} validations passed`);
}
