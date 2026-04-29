import { describe, it, expect } from "vitest";

// Verifies relay-compiler produced the artifact and TypeScript resolves it.
// If relay-compiler hasn't run, the import path won't exist and the test file
// itself will fail to load.
describe("relay compiler artifacts", () => {
  it("resolves PokemonCard fragment types", async () => {
    const mod = await import("./__generated__/PokemonCard_pokemon.graphql.js");
    // Relay artifacts export a `node` object with `kind: "Fragment"`
    expect((mod as { default?: { kind: string } }).default?.kind).toBe("Fragment");
  });

  it("resolves PokemonListQuery types", async () => {
    const mod = await import("./__generated__/PokemonListQuery.graphql.js");
    // Relay 17 uses "Request" as the top-level kind for query artifacts
    expect((mod as { default?: { kind: string } }).default?.kind).toBe("Request");
  });
});
