import type { TrainerResolvers } from "../../generated/types";
import type { Context } from "../context";

export const TrainerResolvers_: TrainerResolvers<Context> = {
  favoritePokemon: async (trainer, _args, { prisma }) => {
    if (!trainer.favoritePokemonId) return null;
    const p = await prisma.pokemon.findUnique({
      where: { id: trainer.favoritePokemonId },
      include: { region: true },
    });
    if (!p) return null;
    return {
      ...p,
      types: JSON.parse(p.types),
      baseStats: {
        hp: p.hp,
        attack: p.attack,
        defense: p.defense,
        specialAttack: p.specialAttack,
        specialDefense: p.specialDefense,
        speed: p.speed,
      },
      abilities: JSON.parse(p.abilities),
      moves: JSON.parse(p.moves),
      evolutionChain: JSON.parse(p.evolutionChain),
      captureRate: p.encounterRate,
    };
  },

  teams: async (trainer, _args, { prisma }) => {
    return prisma.team.findMany({
      where: { ownerId: trainer.id },
      orderBy: { createdAt: "desc" },
    });
  },

  battleHistory: async (trainer, _args, { prisma }) => {
    return prisma.battle.findMany({
      where: {
        OR: [{ trainerAId: trainer.id }, { trainerBId: trainer.id }],
      },
      orderBy: { startedAt: "desc" },
    });
  },
};
