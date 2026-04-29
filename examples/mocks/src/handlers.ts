import { graphql, HttpResponse } from "msw";

const POKEMON_LIST = [
  { id: "1", pokedexNumber: 1, name: "Bulbasaur", types: ["GRASS", "POISON"] },
  { id: "2", pokedexNumber: 2, name: "Ivysaur", types: ["GRASS", "POISON"] },
  { id: "3", pokedexNumber: 3, name: "Venusaur", types: ["GRASS", "POISON"] },
  { id: "4", pokedexNumber: 4, name: "Charmander", types: ["FIRE"] },
  { id: "5", pokedexNumber: 5, name: "Charmeleon", types: ["FIRE"] },
  { id: "6", pokedexNumber: 6, name: "Charizard", types: ["FIRE", "FLYING"] },
];

export const handlers = [
  graphql.query("PokemonList", () => {
    return HttpResponse.json({
      data: {
        pokemons: {
          __typename: "PokemonConnection",
          edges: POKEMON_LIST.map((p) => ({
            __typename: "PokemonEdge",
            cursor: btoa(p.id),
            node: { __typename: "Pokemon", ...p },
          })),
          pageInfo: {
            __typename: "PageInfo",
            hasNextPage: false,
            endCursor: btoa(POKEMON_LIST[POKEMON_LIST.length - 1]!.id),
          },
        },
      },
    });
  }),

  graphql.query("PokemonDetail", ({ variables }) => {
    const pokemon = POKEMON_LIST.find((p) => p.id === variables["id"]);
    if (!pokemon) {
      return HttpResponse.json({ data: { pokemon: null } });
    }
    return HttpResponse.json({
      data: {
        pokemon: {
          __typename: "Pokemon",
          ...pokemon,
          flavorText: "A strange seed was planted on its back at birth.",
          baseStats: {
            hp: 45,
            attack: 49,
            defense: 49,
            specialAttack: 65,
            specialDefense: 65,
            speed: 45,
          },
          abilities: [],
          evolutionChain: [],
        },
      },
    });
  }),
];
