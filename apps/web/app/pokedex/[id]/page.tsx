import { getClient } from "@/lib/apollo/rsc-client";
import { gql } from "@apollo/client";
import { POKEMON_DETAIL_FRAGMENT } from "@/graphql/fragments/PokemonDetail.fragment";
import { PokemonDetail } from "@/components/pokemon/PokemonDetail";
import { TypeEffectivenessChart } from "@/components/pokemon/TypeEffectivenessChart";
import type { PokemonDetailFragment, TypeEffectiveness } from "@/graphql/generated/operations";
import { notFound } from "next/navigation";

// Inline gql operation — analyzer sees this AND the standalone PokemonDetail.graphql.
// Both reference the same fragment; codegen deduplicates.
const GET_POKEMON = gql`
  query GetPokemon($id: ID!) {
    pokemon(id: $id) {
      ...PokemonDetail
      typeEffectiveness {
        attacker
        multiplier
      }
    }
  }
  ${POKEMON_DETAIL_FRAGMENT}
`;

type GetPokemonData = {
  pokemon: (PokemonDetailFragment & { typeEffectiveness: TypeEffectiveness[] }) | null;
};

export default async function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await getClient().query<GetPokemonData>({
    query: GET_POKEMON,
    variables: { id },
  });

  if (!data?.pokemon) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PokemonDetail pokemon={data.pokemon} />
      <div>
        <h2 className="text-lg font-semibold mb-4">Type Effectiveness</h2>
        <TypeEffectivenessChart effectiveness={data.pokemon.typeEffectiveness} />
      </div>
    </div>
  );
}
