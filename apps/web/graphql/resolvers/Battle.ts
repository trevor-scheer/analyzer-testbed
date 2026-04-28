import type { BattleResolvers, BattleTurnResolvers } from "../../generated/types";
import type { Context } from "../context";

export const BattleResolvers_: BattleResolvers<Context> = {
  trainerA: async (battle, _args, { prisma }) =>
    prisma.trainer.findUniqueOrThrow({ where: { id: battle.trainerAId } }),

  trainerB: async (battle, _args, { prisma }) =>
    prisma.trainer.findUniqueOrThrow({ where: { id: battle.trainerBId } }),

  teamA: async (battle, _args, { prisma }) =>
    prisma.team.findUniqueOrThrow({ where: { id: battle.teamAId } }),

  teamB: async (battle, _args, { prisma }) =>
    prisma.team.findUniqueOrThrow({ where: { id: battle.teamBId } }),

  turns: async (battle, _args, { prisma }) =>
    prisma.battleTurn.findMany({
      where: { battleId: battle.id },
      orderBy: { turnNumber: "asc" },
    }),

  winner: async (battle, _args, { prisma }) => {
    if (!battle.winnerId) return null;
    return prisma.trainer.findUnique({ where: { id: battle.winnerId } });
  },
};

export const BattleTurnResolvers_: BattleTurnResolvers<Context> = {
  actionA: (turn) => JSON.parse(turn.actionA),
  actionB: (turn) => JSON.parse(turn.actionB),
};
