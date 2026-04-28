export function buildOptimisticFavorite(id: string) {
  return {
    favoritePokemon: {
      __typename: "Pokemon" as const,
      id,
      isFavorite: true,
    },
  };
}

export function buildOptimisticUnfavorite(id: string) {
  return {
    unfavoritePokemon: {
      __typename: "Pokemon" as const,
      id,
      isFavorite: false,
    },
  };
}
