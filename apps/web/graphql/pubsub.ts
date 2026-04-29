import { createPubSub } from "graphql-yoga";

// Local stand-in — replaced with the codegen-produced type in Task 16.
// Shape matches `type BattleUpdate` in schema.battle.graphql.
export interface BattleUpdatePayload {
  battle: { id: string };
  latestTurn: { id: string } | null;
  message: string;
}

export type PubSubChannels = {
  BATTLE_UPDATE: [battleId: string, payload: { battleUpdates: BattleUpdatePayload }];
};

/**
 * Module-level singleton so all requests in a single server process share the
 * same pubsub instance. Next.js hot-reload destroys and recreates this, which
 * is fine — active SSE clients will reconnect.
 */
export const pubSub = createPubSub<PubSubChannels>();
