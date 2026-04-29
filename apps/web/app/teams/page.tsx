import { getClient } from "@/lib/apollo/rsc-client";
import { gql } from "@apollo/client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TeamCard } from "@/components/teams/TeamCard";
import type { TeamDetailQuery } from "@/graphql/generated/operations";

const MY_TEAMS = gql`
  query MyTeams {
    viewer {
      id
      teams {
        id
        name
        createdAt
        updatedAt
        owner {
          id
          name
        }
        slots {
          id
          nickname
          level
          pokemon {
            id
            name
            pokedexNumber
            types
            baseStats {
              hp
              attack
              defense
              speed
            }
          }
        }
      }
    }
  }
`;

type Team = NonNullable<TeamDetailQuery["team"]>;

export default async function TeamsPage() {
  const { data } = await getClient().query<{ viewer?: { teams?: Team[] } }>({
    query: MY_TEAMS,
  });
  const teams: Team[] = data?.viewer?.teams ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Teams</h1>
        <Link href="/teams/new">
          <Button>New Team</Button>
        </Link>
      </div>
      {teams.length === 0 ? (
        <p className="text-[var(--text-muted)]">
          No teams yet.{" "}
          <Link href="/teams/new" className="text-[var(--accent)] hover:underline">
            Create one
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {teams.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      )}
    </div>
  );
}
