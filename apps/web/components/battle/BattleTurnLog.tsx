import type { BattleUpdatesSubscription } from "@/graphql/generated/operations";

type LatestTurn = NonNullable<
  BattleUpdatesSubscription["battleUpdates"]["latestTurn"]
>;

function describeTurn(turn: LatestTurn): string {
  const action = turn.actionA;
  if (!action) return `Turn ${turn.turnNumber}`;
  switch (action.__typename) {
    case "MoveAction":
      return `${action.sourcePokemon.name} used ${action.move.name} — ${action.damage} damage`;
    case "SwitchAction":
      return `${action.trainer.name} sent out ${action.inPokemon.name}`;
    case "ForfeitAction":
      return `${action.trainer.name} forfeited`;
    default:
      return `Turn ${turn.turnNumber}`;
  }
}

export function BattleTurnLog({ turns }: { turns: LatestTurn[] }) {
  if (turns.length === 0) {
    return (
      <p className="text-[var(--text-muted)] text-sm">Battle not yet started.</p>
    );
  }
  return (
    <ol className="flex flex-col gap-1">
      {[...turns].reverse().map((turn) => (
        <li key={turn.id} className="text-sm border-l-2 border-[var(--accent)] pl-3">
          <span className="text-[var(--text-muted)] mr-2">#{turn.turnNumber}</span>
          {describeTurn(turn)}
        </li>
      ))}
    </ol>
  );
}
