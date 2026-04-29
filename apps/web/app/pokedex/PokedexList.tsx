"use client";

import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { POKEMON_CARD_FRAGMENT } from "@/graphql/fragments/PokemonCard.fragment";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useState } from "react";
import { PokemonType } from "@/graphql/generated/types";
import type { PokemonCardFragment } from "@/graphql/generated/operations";
import type { PageInfo } from "@/graphql/generated/types";

const POKEMONS_QUERY = gql`
  query Pokemons($after: String, $first: Int, $filter: PokemonFilter) {
    pokemons(after: $after, first: $first, filter: $filter) @connection(key: "pokedex") {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          ...PokemonCard
        }
      }
    }
  }
  ${POKEMON_CARD_FRAGMENT}
`;

const ALL_TYPES: PokemonType[] = [
  PokemonType.Fire,
  PokemonType.Water,
  PokemonType.Grass,
  PokemonType.Electric,
  PokemonType.Psychic,
  PokemonType.Ice,
  PokemonType.Dragon,
  PokemonType.Dark,
  PokemonType.Normal,
  PokemonType.Fighting,
  PokemonType.Poison,
  PokemonType.Ground,
  PokemonType.Flying,
  PokemonType.Bug,
  PokemonType.Rock,
  PokemonType.Ghost,
  PokemonType.Steel,
  PokemonType.Fairy,
];

export function PokedexList({
  initialType,
  initialSearch,
}: {
  initialType?: PokemonType;
  initialSearch?: string;
}) {
  const [typeFilter, setTypeFilter] = useState<PokemonType | undefined>(initialType);
  const [search, setSearch] = useState(initialSearch ?? "");

  const filter = {
    ...(typeFilter ? { types: [typeFilter] } : {}),
    ...(search.trim() ? { nameContains: search.trim() } : {}),
  };

  type PokemonsData = {
    pokemons: {
      pageInfo: PageInfo;
      edges: Array<{ cursor: string; node: PokemonCardFragment }>;
    };
  };

  const { data, loading, fetchMore } = useQuery<PokemonsData>(POKEMONS_QUERY, {
    variables: {
      first: 20,
      filter: Object.keys(filter).length ? filter : null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const connection = data?.pokemons;
  const pokemon = connection?.edges?.map((e) => e.node) ?? [];

  function loadMore() {
    fetchMore({
      variables: { after: connection?.pageInfo?.endCursor, first: 20 },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search Pokémon…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        <select
          value={typeFilter ?? ""}
          onChange={(e) => setTypeFilter((e.target.value as PokemonType) || undefined)}
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
        >
          <option value="">All types</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading && pokemon.length === 0 ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
          {connection?.pageInfo?.hasNextPage && (
            <Button
              variant="secondary"
              loading={loading}
              onClick={loadMore}
              className="self-center"
            >
              Load more
            </Button>
          )}
        </>
      )}
    </div>
  );
}
