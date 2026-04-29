"use client";

import Link from "next/link";
import type { Route } from "next";
import type { PokemonCardFragment } from "@/graphql/generated/operations";
import { TypeBadge } from "./TypeBadge";

export function PokemonCard({ pokemon }: { pokemon: PokemonCardFragment }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--accent)] transition-colors flex flex-col gap-3">
      <Link href={`/pokedex/${pokemon.id}` as Route} className="flex items-center gap-3">
        <div>
          <div className="text-xs text-[var(--text-muted)]">
            #{String(pokemon.pokedexNumber).padStart(3, "0")}
          </div>
          <div className="font-semibold capitalize">{pokemon.name}</div>
          <div className="flex gap-1 mt-1">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
