/**
 * In-memory battle state map, keyed by battleId.
 * Tracks the pending action for each trainer so the server can resolve a turn
 * once both trainers have submitted.
 */

export interface PendingAction {
  type: "MOVE" | "SWITCH" | "FORFEIT";
  trainerId: string;
  moveId?: string;
  switchToPokemonId?: string;
}

export interface BattleState {
  battleId: string;
  pendingActions: Map<string, PendingAction>; // trainerId → action
}

/** Lives for the lifetime of the server process. */
const battleStateMap = new Map<string, BattleState>();

export function getOrCreateBattleState(battleId: string): BattleState {
  if (!battleStateMap.has(battleId)) {
    battleStateMap.set(battleId, {
      battleId,
      pendingActions: new Map(),
    });
  }
  return battleStateMap.get(battleId)!;
}

export function clearBattleState(battleId: string): void {
  battleStateMap.delete(battleId);
}
