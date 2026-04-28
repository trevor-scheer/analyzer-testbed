import type { PokemonDetailFragment } from "@/graphql/generated/operations";
import { TypeBadge } from "./TypeBadge";
import { StatBar } from "./StatBar";
import { Card } from "@/components/ui/Card";

export function PokemonDetail({ pokemon }: { pokemon: PokemonDetailFragment }) {
  const stats = pokemon.baseStats;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div>
          <div className="text-sm text-[var(--text-muted)]">
            #{String(pokemon.pokedexNumber).padStart(3, "0")}
          </div>
          <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
          <div className="flex gap-2 mt-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
          <p className="mt-2 text-sm text-[var(--text-muted)] max-w-md">
            {pokemon.flavorText}
          </p>
        </div>
      </div>

      {/* Base stats */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-3">
          Base Stats
        </h2>
        <div className="flex flex-col gap-2">
          <StatBar stat="hp" value={stats.hp} />
          <StatBar stat="attack" value={stats.attack} />
          <StatBar stat="defense" value={stats.defense} />
          <StatBar stat="specialAttack" value={stats.specialAttack} />
          <StatBar stat="specialDefense" value={stats.specialDefense} />
          <StatBar stat="speed" value={stats.speed} />
        </div>
      </Card>

      {/* Physical info */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-3">
          Details
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-[var(--text-muted)]">Height</span>
            <span className="ml-2">{pokemon.height / 10} m</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Weight</span>
            <span className="ml-2">{pokemon.weight / 10} kg</span>
          </div>
          <div>
            <span className="text-[var(--text-muted)]">Encounter Rate</span>
            <span className="ml-2">{pokemon.encounterRate}</span>
          </div>
        </div>
      </Card>

      {/* Legacy stat card — intentional deprecated field usage so analyzer flags it */}
      <Card className="border-yellow-700">
        <h2 className="text-sm font-semibold text-yellow-500 uppercase mb-1">
          Legacy Stat (Gen I)
        </h2>
        <p className="text-xs text-[var(--text-muted)] mb-2">
          Capture rate is deprecated — use encounter rate instead.
        </p>
        <div className="text-2xl font-bold tabular-nums">{pokemon.captureRate}</div>
      </Card>

      {/* Abilities */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-3">
          Abilities
        </h2>
        <div className="flex flex-col gap-2">
          {pokemon.abilities.map((a) => (
            <div key={a.name}>
              <span className="font-medium capitalize">{a.name}</span>
              {a.isHidden && (
                <span className="ml-2 text-xs text-[var(--accent)]">Hidden</span>
              )}
              <p className="text-sm text-[var(--text-muted)]">{a.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Evolution chain */}
      {pokemon.evolutionChain.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-3">
            Evolution Chain
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            {pokemon.evolutionChain.map((evo, i) => (
              <div key={evo.pokemon.id} className="flex items-center gap-3">
                {i > 0 && <span className="text-[var(--text-muted)]">→</span>}
                <div className="text-center">
                  <div className="text-xs capitalize">{evo.pokemon.name}</div>
                  {evo.minLevel != null && (
                    <div className="text-xs text-[var(--text-muted)]">
                      Lv. {evo.minLevel}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
