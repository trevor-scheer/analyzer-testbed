import { gql } from "@apollo/client";
import { POKEMON_CARD_FRAGMENT } from "./PokemonCard.fragment";

export const POKEMON_DETAIL_FRAGMENT = gql`
  fragment PokemonDetail on Pokemon {
    ...PokemonCard
    flavorText
    height
    weight
    # captureRate is deprecated in favor of encounterRate — intentional usage
    # so the GraphQL Analyzer flags it as a deprecation warning.
    captureRate
    encounterRate
    abilities {
      name
      isHidden
      description
    }
    moves {
      ... on PhysicalMove {
        id
        name
        power
        accuracy
        pp
      }
      ... on SpecialMove {
        id
        name
        power
        accuracy
        pp
      }
      ... on StatusMove {
        id
        name
        accuracy
        pp
        inflicts
      }
    }
    evolutionChain {
      minLevel
      pokemon {
        id
        name
        pokedexNumber
      }
    }
    baseStats {
      hp
      attack
      defense
      specialAttack
      specialDefense
      speed
    }
  }
  ${POKEMON_CARD_FRAGMENT}
`;
