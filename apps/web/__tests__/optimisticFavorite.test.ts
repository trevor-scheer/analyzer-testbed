import { describe, it, expect } from "vitest";
import { buildOptimisticFavorite, buildOptimisticUnfavorite } from "@/lib/apollo/optimisticHelpers";

describe("buildOptimisticFavorite", () => {
  it("returns the correct optimistic mutation shape for favorite", () => {
    const result = buildOptimisticFavorite("42");
    expect(result).toEqual({
      favoritePokemon: {
        __typename: "Pokemon",
        id: "42",
        isFavorite: true,
      },
    });
  });
});

describe("buildOptimisticUnfavorite", () => {
  it("returns the correct optimistic mutation shape for unfavorite", () => {
    const result = buildOptimisticUnfavorite("42");
    expect(result).toEqual({
      unfavoritePokemon: {
        __typename: "Pokemon",
        id: "42",
        isFavorite: false,
      },
    });
  });
});
