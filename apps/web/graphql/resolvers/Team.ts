import type { TeamResolvers, TeamSlotResolvers } from "../../generated/types";
import type { Context } from "../context";

export const TeamResolvers_: TeamResolvers<Context> = {
  owner: async (team, _args, { prisma }) => {
    return prisma.trainer.findUniqueOrThrow({ where: { id: team.ownerId } });
  },

  slots: async (team, _args, { prisma }) => {
    return prisma.teamSlot.findMany({
      where: { teamId: team.id },
      orderBy: { position: "asc" },
    });
  },
};

export const TeamSlotResolvers_: TeamSlotResolvers<Context> = {
  pokemon: async (slot, _args, { prisma }) => {
    const p = await prisma.pokemon.findUniqueOrThrow({
      where: { id: slot.pokemonId },
      include: { region: true },
    });
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

  moves: async (slot, _args, { prisma }) => {
    const pokemon = await prisma.pokemon.findUniqueOrThrow({
      where: { id: slot.pokemonId },
    });
    const allMoves: Array<{ id: string }> = JSON.parse(pokemon.moves);
    const selectedIds: string[] = JSON.parse(slot.moveIds);
    return allMoves.filter((m) => selectedIds.includes(m.id)) as never;
  },
};
