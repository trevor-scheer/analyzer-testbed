import { graphql, useLazyLoadQuery } from "react-relay";
import { PokemonCard } from "./PokemonCard.js";
import type { PokemonListQuery } from "./__generated__/PokemonListQuery.graphql.js";

const listQuery = graphql`
  query PokemonListQuery($first: Int, $after: String) {
    pokemons(first: $first, after: $after) @connection(key: "PokemonList_pokemons") {
      edges {
        node {
          id
          ...PokemonCard_pokemon
        }
      }
    }
  }
`;

export function PokemonList() {
  const data = useLazyLoadQuery<PokemonListQuery>(listQuery, { first: 20 });
  const pokemon = data.pokemons.edges.map((e) => e.node).filter(Boolean);

  return (
    <div>
      <h1>Pokédex</h1>
      <p style={{ color: "#888", fontSize: 14 }}>
        Powered by Relay 17 — fragment composition + @connection
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 16,
        }}
      >
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>
    </div>
  );
}
