import { describe, it, expect } from "vitest";
import { canAddToTeam, getTeamPokemonIds } from "@/components/teams/TeamBuilder";

describe("canAddToTeam", () => {
  it("allows adding when team has fewer than 6 slots", () => {
    expect(canAddToTeam([], "1")).toBe(true);
    expect(canAddToTeam([{ pokemonId: "1" }, { pokemonId: "2" }], "3")).toBe(true);
  });

  it("blocks adding when team is full (6 slots)", () => {
    const slots = [1, 2, 3, 4, 5, 6].map((n) => ({ pokemonId: String(n) }));
    expect(canAddToTeam(slots, "7")).toBe(false);
  });

  it("blocks adding duplicate pokemon", () => {
    expect(canAddToTeam([{ pokemonId: "25" }], "25")).toBe(false);
  });
});

describe("getTeamPokemonIds", () => {
  it("returns the list of pokemon IDs from slots", () => {
    const slots = [{ pokemonId: "1" }, { pokemonId: "4" }];
    expect(getTeamPokemonIds(slots)).toEqual(["1", "4"]);
  });

  it("returns empty array for empty team", () => {
    expect(getTeamPokemonIds([])).toEqual([]);
  });
});
