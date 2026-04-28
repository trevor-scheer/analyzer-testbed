"use client";

import { useEffect, useState } from "react";
import { gql, type DocumentNode } from "@apollo/client";
import { useSubscription, useMutation } from "@apollo/client/react";
import {
  BattleUpdatesDocument,
  type BattleUpdatesSubscription,
} from "@/graphql/generated/operations";
import { BattleStatus } from "@/graphql/generated/types";
import { BattleTurnLog } from "./BattleTurnLog";
import { BattleMoveList } from "./BattleMoveList";
import { Spinner } from "@/components/ui/Spinner";

type LatestTurn = NonNullable<BattleUpdatesSubscription["battleUpdates"]["latestTurn"]>;

const SUBMIT_ACTION = gql`
  mutation SubmitBattleAction($battleId: ID!, $moveId: ID!) {
    submitBattleAction(battleId: $battleId, moveId: $moveId) {
      id
      status
    }
  }
` as DocumentNode;

export function BattleField({
  battleId,
  activePokemonMoves,
}: {
  battleId: string;
  activePokemonMoves: { id: string; name: string }[];
}) {
  const [turns, setTurns] = useState<LatestTurn[]>([]);

  const { data, loading } = useSubscription<BattleUpdatesSubscription>(BattleUpdatesDocument, {
    variables: { battleId },
  });

  useEffect(() => {
    const turn = data?.battleUpdates?.latestTurn;
    if (!turn) return;
    setTurns((prev) => {
      if (prev.some((t) => t.id === turn.id)) return prev;
      return [...prev, turn];
    });
  }, [data?.battleUpdates?.latestTurn]);

  const [submitAction, { loading: submitting }] = useMutation(SUBMIT_ACTION);

  const battle = data?.battleUpdates?.battle;

  function handleMove(moveId: string) {
    submitAction({ variables: { battleId, moveId } });
  }

  if (loading && !battle) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={40} />
      </div>
    );
  }

  const isFinished =
    battle?.status === BattleStatus.Completed || battle?.status === BattleStatus.Forfeited;

  return (
    <div className="flex flex-col gap-6">
      {isFinished && (
        <div className="rounded-md bg-[var(--accent)] text-white p-4 text-center font-bold text-lg">
          {battle?.winner ? `${battle.winner.name} wins!` : "Draw!"}
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-3">
          Choose a move
        </h2>
        <BattleMoveList
          moves={activePokemonMoves}
          onSelect={handleMove}
          disabled={submitting || isFinished}
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase mb-3">Turn Log</h2>
        <BattleTurnLog turns={turns} />
      </div>
    </div>
  );
}
