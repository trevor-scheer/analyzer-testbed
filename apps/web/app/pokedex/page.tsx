import { getClient } from "@/lib/apollo/rsc-client";
import { gql } from "@apollo/client";
import { POKEMON_CARD_FRAGMENT } from "@/graphql/fragments/PokemonCard.fragment";
import { PokedexList } from "./PokedexList";

// Prefetch first page server-side so there's no loading flash on initial render.
const PREFETCH_POKEMONS = gql`
  query PokemonsPrefetch($first: Int) {
    pokemons(first: $first) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...PokemonCard
        }
      }
    }
  }
  ${POKEMON_CARD_FRAGMENT}
`;

export default async function PokedexPage() {
  // Fire initial query from the server — data lands in RSC HTML.
  await getClient().query({
    query: PREFETCH_POKEMONS,
    variables: { first: 20 },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pokédex</h1>
      <PokedexList />
    </div>
  );
}
