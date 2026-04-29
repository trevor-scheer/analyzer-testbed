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
    }
  }
  ${POKEMON_DETAIL_FRAGMENT}
`;

const GET_TYPE_EFFECTIVENESS = gql`
  query TypeEffectivenessAll {
    typeEffectiveness {
      attacker
      multiplier
    }
  }
`;

type GetPokemonData = {
  pokemon: PokemonDetailFragment | null;
};

type GetTypeEffectivenessData = {
  typeEffectiveness: TypeEffectiveness[];
};

export default async function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [pokemonResult, effectivenessResult] = await Promise.all([
    getClient().query<GetPokemonData>({
      query: GET_POKEMON,
      variables: { id },
    }),
    getClient().query<GetTypeEffectivenessData>({
      query: GET_TYPE_EFFECTIVENESS,
    }),
  ]);

  if (!pokemonResult.data?.pokemon) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PokemonDetail pokemon={pokemonResult.data.pokemon} />
      <div>
        <h2 className="text-lg font-semibold mb-4">Type Effectiveness</h2>
        <TypeEffectivenessChart effectiveness={effectivenessResult.data?.typeEffectiveness ?? []} />
      </div>
    </div>
  );
}
