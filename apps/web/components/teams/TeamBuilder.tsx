"use client";

import { useState } from "react";
import { gql, type DocumentNode } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { POKEMON_CARD_FRAGMENT } from "@/graphql/fragments/PokemonCard.fragment";
import type { PokemonCardFragment } from "@/graphql/generated/operations";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export interface SlotDraft {
  pokemonId: string;
}

export function canAddToTeam(slots: SlotDraft[], pokemonId: string): boolean {
  if (slots.length >= 6) return false;
  return !slots.some((s) => s.pokemonId === pokemonId);
}

export function getTeamPokemonIds(slots: SlotDraft[]): string[] {
  return slots.map((s) => s.pokemonId);
}

interface TeamSlotResult {
  __typename: "TeamSlot";
  id: string;
  pokemon: { __typename: "Pokemon"; id: string; name: string };
}

interface TeamResult {
  __typename: "Team";
  id: string;
  name: string;
  slots: TeamSlotResult[];
}

interface CreateTeamData {
  createTeam: TeamResult;
}

interface CreateTeamVars {
  name: string;
  pokemonIds: string[];
}

interface UpdateTeamData {
  updateTeam: TeamResult;
}

interface UpdateTeamVars {
  id: string;
  name?: string;
  pokemonIds?: string[];
}

interface PokemonsBrowseData {
  pokemons?: {
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    edges: Array<{ cursor: string; node: PokemonCardFragment }>;
  };
}

const POKEMONS_BROWSE = gql`
  query PokemonsBrowse($after: String, $first: Int) {
    pokemons(after: $after, first: $first) @connection(key: "pokedex") {
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
` as DocumentNode;

const CREATE_TEAM = gql`
  mutation CreateTeam($name: String!, $pokemonIds: [ID!]!) {
    createTeam(name: $name, pokemonIds: $pokemonIds) {
      id
      name
      slots {
        id
        pokemon {
          id
          name
        }
      }
    }
  }
` as DocumentNode;

const UPDATE_TEAM = gql`
  mutation UpdateTeam($id: ID!, $name: String, $pokemonIds: [ID!]) {
    updateTeam(id: $id, name: $name, pokemonIds: $pokemonIds) {
      id
      name
      slots {
        id
        pokemon {
          id
          name
        }
      }
    }
  }
` as DocumentNode;

export function TeamBuilder({
  teamId,
  initialName = "",
  initialSlots = [],
  onSaved,
}: {
  teamId?: string;
  initialName?: string;
  initialSlots?: SlotDraft[];
  onSaved?: (id: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [slots, setSlots] = useState<SlotDraft[]>(initialSlots);

  const { data, loading: browsing } = useQuery<PokemonsBrowseData>(POKEMONS_BROWSE, {
    variables: { first: 24 },
  });

  const makeOptimisticSlots = (): TeamSlotResult[] =>
    slots.map((s) => ({
      __typename: "TeamSlot" as const,
      id: `temp-slot-${s.pokemonId}`,
      pokemon: { __typename: "Pokemon" as const, id: s.pokemonId, name: "" },
    }));

  const [createTeam, { loading: creating }] = useMutation<CreateTeamData, CreateTeamVars>(
    CREATE_TEAM,
    {
      update(cache, { data: result }) {
        if (!result) return;
        cache.modify({
          fields: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            viewer(existing: any) {
              if (!existing) return existing;
              return {
                ...existing,
                teams: [...(existing.teams ?? []), result.createTeam],
              };
            },
          },
        });
      },
      optimisticResponse: {
        createTeam: {
          __typename: "Team",
          id: `temp-${Date.now()}`,
          name,
          slots: makeOptimisticSlots(),
        },
      },
      onCompleted(data) {
        onSaved?.(data.createTeam.id);
      },
    },
  );

  const [updateTeam, { loading: updating }] = useMutation<UpdateTeamData, UpdateTeamVars>(
    UPDATE_TEAM,
    {
      optimisticResponse: {
        updateTeam: {
          __typename: "Team",
          id: teamId!,
          name,
          slots: makeOptimisticSlots(),
        },
      },
      onCompleted(data) {
        onSaved?.(data.updateTeam.id);
      },
    },
  );

  const saving = creating || updating;

  function togglePokemon(p: PokemonCardFragment) {
    const exists = slots.some((s) => s.pokemonId === p.id);
    if (exists) {
      setSlots((prev) => prev.filter((s) => s.pokemonId !== p.id));
    } else if (canAddToTeam(slots, p.id)) {
      setSlots((prev) => [...prev, { pokemonId: p.id }]);
    }
  }

  function handleSave() {
    const pokemonIds = getTeamPokemonIds(slots);
    if (teamId) {
      updateTeam({ variables: { id: teamId, name, pokemonIds } });
    } else {
      createTeam({ variables: { name, pokemonIds } });
    }
  }

  const pokemonList: PokemonCardFragment[] = data?.pokemons?.edges?.map((e) => e.node) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team name"
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
        <Button onClick={handleSave} loading={saving} disabled={!name.trim() || slots.length === 0}>
          {teamId ? "Save Team" : "Create Team"}
        </Button>
      </div>

      <div>
        <p className="text-sm text-[var(--text-muted)] mb-2">Slots: {slots.length}/6</p>
        <div className="flex flex-wrap gap-2 min-h-10">
          {slots.map((s) => {
            const p = pokemonList.find((p) => p.id === s.pokemonId);
            return (
              <button
                key={s.pokemonId}
                onClick={() => setSlots((prev) => prev.filter((x) => x.pokemonId !== s.pokemonId))}
                className="rounded-full bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1 text-xs hover:border-red-500 hover:text-red-400 transition-colors"
              >
                {p?.name ?? s.pokemonId} ×
              </button>
            );
          })}
        </div>
      </div>

      {browsing ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {pokemonList.map((p) => {
            const selected = slots.some((s) => s.pokemonId === p.id);
            const disabled = !selected && !canAddToTeam(slots, p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePokemon(p)}
                disabled={disabled}
                className={`rounded-lg border p-2 text-left transition-colors ${
                  selected
                    ? "border-[var(--accent)] bg-[var(--surface-2)]"
                    : disabled
                      ? "opacity-40 cursor-not-allowed border-[var(--border)]"
                      : "border-[var(--border)] hover:border-[var(--accent-hover)]"
                }`}
              >
                <PokemonCard pokemon={p} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
