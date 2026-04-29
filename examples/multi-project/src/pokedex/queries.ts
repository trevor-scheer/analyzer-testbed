import { gql } from "graphql-tag";

// Project A (pokedex): validated against apps/web/graphql/*.graphql
// Full recommended lint rules apply here.
export const POKEMON_LIST = gql`
  query PokedexPokemonList($first: Int) {
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
`;

export const POKEMON_DETAIL = gql`
  query PokedexPokemonDetail($id: ID!) {
    pokemon(id: $id) {
      id
      name
      pokedexNumber
      types
      baseStats {
        hp
        attack
        defense
        speed
      }
    }
  }
`;
