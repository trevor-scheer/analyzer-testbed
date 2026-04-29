import { graphql, useFragment } from "react-relay";
import type { PokemonCard_pokemon$key } from "./__generated__/PokemonCard_pokemon.graphql.js";

const pokemonFragment = graphql`
  fragment PokemonCard_pokemon on Pokemon {
    id
    name
    pokedexNumber
    types
  }
`;

interface Props {
  pokemon: PokemonCard_pokemon$key;
}

export function PokemonCard({ pokemon }: Props) {
  const data = useFragment(pokemonFragment, pokemon);
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, textAlign: "center" }}>
      <p style={{ margin: "4px 0", fontWeight: "bold" }}>
        #{String(data.pokedexNumber).padStart(3, "0")} {data.name}
      </p>
      <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{data.types.join(" / ")}</p>
    </div>
  );
}
