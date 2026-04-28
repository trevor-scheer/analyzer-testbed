import { gql } from "@apollo/client";

export const POKEMON_CARD_FRAGMENT = gql`
  fragment PokemonCardFragment on Pokemon {
    id
    name
    nationalDexNumber
    types
    sprite
    isFavorite
    stats {
      hp
      attack
      defense
      speed
    }
  }
`;
