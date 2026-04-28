import { gql } from "@apollo/client";
import { POKEMON_CARD_FRAGMENT } from "./PokemonCard.fragment";

export const TEAM_SLOT_FRAGMENT = gql`
  fragment TeamSlot on TeamSlot {
    id
    pokemon {
      ...PokemonCard
    }
    nickname
    level
    moves {
      ... on PhysicalMove {
        id
        name
        power
        pp
      }
      ... on SpecialMove {
        id
        name
        power
        pp
      }
      ... on StatusMove {
        id
        name
        pp
        inflicts
      }
    }
  }
  ${POKEMON_CARD_FRAGMENT}
`;
