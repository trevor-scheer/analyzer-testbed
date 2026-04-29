import type { PageLoad } from "./$types.js";

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query PokemonList($first: Int) {
          pokemons(first: $first) {
            edges {
              node {
                id
                name
                pokedexNumber
                types
              }
            }
          }
        }
      `,
      variables: { first: 20 },
    }),
  });
  const json = (await response.json()) as {
    data: {
      pokemons: {
        edges: Array<{
          node: {
            id: string;
            name: string;
            pokedexNumber: number;
            types: string[];
          };
        }>;
      };
    };
  };
  return { pokemon: json.data.pokemons.edges.map((e) => e.node) };
};
