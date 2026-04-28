import Link from "next/link";
import type { TeamDetailQuery } from "@/graphql/generated/operations";
import { Card } from "@/components/ui/Card";

type Team = NonNullable<TeamDetailQuery["team"]>;

export function TeamCard({ team }: { team: Team }) {
  return (
    <Card>
      <Link href={`/teams/${team.id}`} className="block">
        <div className="font-semibold mb-2">{team.name}</div>
        <div className="flex gap-2 flex-wrap">
          {team.slots.map((slot) => (
            <span
              key={slot.id}
              className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-full px-2 py-0.5 capitalize"
            >
              {slot.pokemon.name}
            </span>
          ))}
        </div>
      </Link>
    </Card>
  );
}
