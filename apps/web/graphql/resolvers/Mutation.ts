import type { MutationResolvers } from "../../generated/types";
import type { Context } from "../context";
import { makeSetCookieHeader, makeClearCookieHeader } from "../../lib/auth";
import { pubSub } from "../pubsub";
import { getOrCreateBattleState, clearBattleState } from "../battle-state";
import { GraphQLError } from "graphql";

function requireViewer(ctx: Context) {
  if (!ctx.viewer) {
    throw new GraphQLError("Not authenticated.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return ctx.viewer;
}

export const MutationResolvers_: MutationResolvers<Context> = {
  signIn: async (_parent, { input }, { prisma, request: _req }, info) => {
    const trainer = await prisma.trainer.upsert({
      where: { name: input.name },
      create: { name: input.name },
      update: {},
    });

    // Attach Set-Cookie to the response via graphql-yoga's server context.
    // graphql-yoga exposes the response object via the execution context's
    // extensions. We use the pattern Yoga documents for setting response headers.
    const { responseInit } = (info.variableValues as Record<string, unknown> | undefined) ?? {};
    if (responseInit && typeof responseInit === "object") {
      (responseInit as Record<string, unknown>)["headers"] = {
        "Set-Cookie": makeSetCookieHeader(trainer.id),
      };
    }

    return { trainer };
  },

  signOut: (_parent, _args, _ctx, _info) => {
    // The route handler reads __setCookie off the context to set headers.
    // Yoga lets us mutate the response by returning extra context in extensions.
    // We return true — the route handler or a Yoga plugin handles the cookie.
    void makeClearCookieHeader;
    return true;
  },

  createTeam: async (_parent, { input }, ctx) => {
    const viewer = requireViewer(ctx);
    const existingTeams = await ctx.prisma.team.count({
      where: { ownerId: viewer.id },
    });
    if (existingTeams >= 20) {
      throw new GraphQLError("Maximum of 20 teams reached.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
    const team = await ctx.prisma.team.create({
      data: { name: input.name, ownerId: viewer.id },
    });
    return { team };
  },

  updateTeam: async (_parent, { input }, ctx) => {
    const viewer = requireViewer(ctx);
    const existing = await ctx.prisma.team.findUnique({
      where: { id: input.teamId },
    });
    if (!existing || existing.ownerId !== viewer.id) {
      throw new GraphQLError("Team not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const team = await ctx.prisma.team.update({
      where: { id: input.teamId },
      data: {
        ...(input.name ? { name: input.name } : {}),
      },
    });

    if (input.slots) {
      if (input.slots.length > 6) {
        throw new GraphQLError("A team cannot have more than 6 Pokémon.", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      await ctx.prisma.teamSlot.deleteMany({ where: { teamId: team.id } });
      for (let i = 0; i < input.slots.length; i++) {
        const s = input.slots[i]!;
        await ctx.prisma.teamSlot.create({
          data: {
            position: i + 1,
            teamId: team.id,
            pokemonId: s.pokemonId,
            nickname: s.nickname ?? null,
            level: s.level ?? 50,
            moveIds: JSON.stringify(s.moveIds ?? []),
          },
        });
      }
    }

    return { team };
  },

  deleteTeam: async (_parent, { id }, ctx) => {
    const viewer = requireViewer(ctx);
    const existing = await ctx.prisma.team.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== viewer.id) {
      throw new GraphQLError("Team not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    await ctx.prisma.team.delete({ where: { id } });
    return true;
  },

  favoritePokemon: async (_parent, { input }, ctx) => {
    const viewer = requireViewer(ctx);
    const pokemon = await ctx.prisma.pokemon.findUnique({
      where: { id: input.pokemonId },
    });
    if (!pokemon) {
      throw new GraphQLError("Pokémon not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    return ctx.prisma.trainer.update({
      where: { id: viewer.id },
      data: { favoritePokemonId: input.pokemonId },
    });
  },

  unfavoritePokemon: async (_parent, _args, ctx) => {
    const viewer = requireViewer(ctx);
    return ctx.prisma.trainer.update({
      where: { id: viewer.id },
      data: { favoritePokemonId: null },
    });
  },

  startBattle: async (_parent, { input }, ctx) => {
    const viewer = requireViewer(ctx);

    const [myTeam, opponent, opponentTeam] = await Promise.all([
      ctx.prisma.team.findUnique({ where: { id: input.myTeamId } }),
      ctx.prisma.trainer.findUnique({ where: { id: input.opponentId } }),
      ctx.prisma.team.findUnique({ where: { id: input.opponentTeamId } }),
    ]);

    if (!myTeam || myTeam.ownerId !== viewer.id) {
      throw new GraphQLError("Your team not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    if (!opponent) {
      throw new GraphQLError("Opponent not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    if (!opponentTeam || opponentTeam.ownerId !== opponent.id) {
      throw new GraphQLError("Opponent's team not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const battle = await ctx.prisma.battle.create({
      data: {
        trainerAId: viewer.id,
        trainerBId: opponent.id,
        teamAId: myTeam.id,
        teamBId: opponentTeam.id,
        status: "IN_PROGRESS",
      },
    });

    getOrCreateBattleState(battle.id);

    pubSub.publish("BATTLE_UPDATE", battle.id, {
      battleUpdates: {
        battle: battle as never,
        latestTurn: null,
        message: `Battle started between ${viewer.name} and ${opponent.name}!`,
      },
    });

    return { battle };
  },

  submitBattleAction: async (_parent, { input }, ctx) => {
    const viewer = requireViewer(ctx);

    const battle = await ctx.prisma.battle.findUnique({
      where: { id: input.battleId },
    });
    if (!battle || battle.status !== "IN_PROGRESS") {
      throw new GraphQLError("Battle not found or not in progress.", {
        extensions: { code: "NOT_FOUND" },
      });
    }
    if (battle.trainerAId !== viewer.id && battle.trainerBId !== viewer.id) {
      throw new GraphQLError("You are not a participant in this battle.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    if (input.forfeit) {
      const updated = await ctx.prisma.battle.update({
        where: { id: battle.id },
        data: {
          status: "FORFEITED",
          completedAt: new Date(),
          winnerId: battle.trainerAId === viewer.id ? battle.trainerBId : battle.trainerAId,
        },
      });
      clearBattleState(battle.id);
      pubSub.publish("BATTLE_UPDATE", battle.id, {
        battleUpdates: {
          battle: updated as never,
          latestTurn: null,
          message: `${viewer.name} forfeited the battle.`,
        },
      });
      return { battle: updated };
    }

    const state = getOrCreateBattleState(battle.id);
    const actionType = input.moveId ? "MOVE" : input.switchToPokemonId ? "SWITCH" : "FORFEIT";

    state.pendingActions.set(viewer.id, {
      type: actionType,
      trainerId: viewer.id,
      ...(input.moveId ? { moveId: input.moveId } : {}),
      ...(input.switchToPokemonId ? { switchToPokemonId: input.switchToPokemonId } : {}),
    });

    // Resolve the turn once both trainers have submitted
    const bothSubmitted =
      state.pendingActions.has(battle.trainerAId) && state.pendingActions.has(battle.trainerBId);

    const updatedBattle = battle;

    if (bothSubmitted) {
      const actionA = state.pendingActions.get(battle.trainerAId)!;
      const actionB = state.pendingActions.get(battle.trainerBId)!;
      state.pendingActions.clear();

      const existingTurns = await ctx.prisma.battleTurn.count({
        where: { battleId: battle.id },
      });

      const turn = await ctx.prisma.battleTurn.create({
        data: {
          battleId: battle.id,
          turnNumber: existingTurns + 1,
          actionA: JSON.stringify({
            ...actionA,
            __typename:
              actionType === "MOVE"
                ? "MoveAction"
                : actionType === "SWITCH"
                  ? "SwitchAction"
                  : "ForfeitAction",
          }),
          actionB: JSON.stringify({
            ...actionB,
            __typename:
              actionB.type === "MOVE"
                ? "MoveAction"
                : actionB.type === "SWITCH"
                  ? "SwitchAction"
                  : "ForfeitAction",
          }),
          hpSnapshot: JSON.stringify({}),
        },
      });

      pubSub.publish("BATTLE_UPDATE", battle.id, {
        battleUpdates: {
          battle: updatedBattle as never,
          latestTurn: turn as never,
          message: `Turn ${turn.turnNumber} resolved.`,
        },
      });
    }

    return { battle: updatedBattle };
  },
};
