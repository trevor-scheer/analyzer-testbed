import type { SubscriptionResolvers } from "../../generated/types";
import type { Context } from "../context";
import { pubSub } from "../pubsub";

export const SubscriptionResolvers_: SubscriptionResolvers<Context> = {
  battleUpdates: {
    subscribe: (_parent, { battleId }) => {
      return pubSub.subscribe("BATTLE_UPDATE", battleId);
    },
    resolve: (payload: { battleUpdates: unknown }) => {
      return payload.battleUpdates as never;
    },
  },
};
