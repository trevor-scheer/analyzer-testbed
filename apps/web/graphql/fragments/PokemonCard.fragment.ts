import { gql } from "@apollo/client";

export const POKEMON_CARD_FRAGMENT = gql`
  fragment PokemonCard on Pokemon {
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
`;
