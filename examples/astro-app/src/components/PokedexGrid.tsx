import gql from "graphql-tag";

// Fragment defined in a .tsx island — demonstrates the analyzer seeing
// embedded GraphQL in both .astro and .tsx files within one project.
const _pokemonFields = gql`
  fragment PokedexGridFields on Pokemon {
    id
    name
    pokedexNumber
    types
  }
`;

interface Pokemon {
  id: string;
  name: string;
  pokedexNumber: number;
  types: string[];
}

interface Props {
  pokemon: Pokemon[];
}

export default function PokedexGrid({ pokemon }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 16,
      }}
    >
      {pokemon.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, textAlign: "center" }}
        >
          <p style={{ margin: "4px 0", fontWeight: "bold" }}>
            #{String(p.pokedexNumber).padStart(3, "0")} {p.name}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{p.types.join(" / ")}</p>
        </div>
      ))}
    </div>
  );
}
