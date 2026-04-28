"use client";

import { useState } from "react";
import { gql, type DocumentNode } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

interface TeamsData {
  viewer?: {
    id: string;
    teams: { id: string; name: string }[];
  };
}

interface StartBattleData {
  startBattle: { battle: { id: string } };
}

interface StartBattleVars {
  input: {
    myTeamId: string;
    opponentTeamId: string;
    opponentId: string;
  };
}

const MY_TEAMS_FOR_BATTLE = gql`
  query MyTeamsForBattle {
    viewer {
      id
      teams {
        id
        name
      }
    }
  }
` as DocumentNode;

const START_BATTLE = gql`
  mutation StartBattle($input: StartBattleInput!) {
    startBattle(input: $input) {
      battle {
        id
      }
    }
  }
` as DocumentNode;

export default function NewBattlePage() {
  const router = useRouter();
  const [myTeamId, setMyTeamId] = useState("");
  const [opponentTeamId, setOpponentTeamId] = useState("");

  const { data, loading } = useQuery<TeamsData>(MY_TEAMS_FOR_BATTLE);
  const teams = data?.viewer?.teams ?? [];

  const [startBattle, { loading: starting }] = useMutation<StartBattleData, StartBattleVars>(
    START_BATTLE,
    {
      onCompleted(data) {
        router.push(`/battle/${data.startBattle.battle.id}`);
      },
    },
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Start Battle</h1>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="my-team" className="block text-sm text-[var(--text-muted)] mb-1">
            Your Team
          </label>
          <select
            id="my-team"
            value={myTeamId}
            onChange={(e) => setMyTeamId(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="">Select a team…</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="opponent-team" className="block text-sm text-[var(--text-muted)] mb-1">
            Opponent Team
          </label>
          <select
            id="opponent-team"
            value={opponentTeamId}
            onChange={(e) => setOpponentTeamId(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
          >
            <option value="">Select opponent…</option>
            {teams
              .filter((t) => t.id !== myTeamId)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </div>
        <Button
          onClick={() =>
            startBattle({
              variables: {
                input: { myTeamId, opponentTeamId, opponentId: opponentTeamId },
              },
            })
          }
          loading={starting}
          disabled={!myTeamId || !opponentTeamId}
        >
          Start Battle
        </Button>
      </div>
    </div>
  );
}
