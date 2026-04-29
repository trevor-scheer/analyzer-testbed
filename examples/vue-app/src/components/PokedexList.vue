<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

// This gql tagged template inside a .vue SFC is the primary LSP/lint target.
const POKEMON_LIST_QUERY = gql`
  query PokemonList($first: Int) {
    pokemons(first: $first) {
      edges {
        node {
          id
          name
          pokedexNumber
          types
        }
      }
    }
  }
`;

const { result, loading, error } = useQuery<{
  pokemons: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        pokedexNumber: number;
        types: string[];
      };
    }>;
  };
}>(POKEMON_LIST_QUERY, { first: 20 });
</script>

<template>
  <div>
    <h1>Pokédex</h1>
    <p style="color: #888; font-size: 14px">
      Powered by Vue 3 + @vue/apollo-composable — .vue SFC extraction
    </p>
    <p v-if="loading">Loading…</p>
    <p v-else-if="error" style="color: red">{{ error.message }}</p>
    <div
      v-else
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px"
    >
      <div
        v-for="edge in result?.pokemons.edges"
        :key="edge.node.id"
        style="border: 1px solid #ccc; border-radius: 8px; padding: 12px; text-align: center"
      >
        <p style="margin: 4px 0; font-weight: bold">
          #{{ String(edge.node.pokedexNumber).padStart(3, "0") }} {{ edge.node.name }}
        </p>
        <p style="margin: 0; font-size: 12px; color: #666">{{ edge.node.types.join(" / ") }}</p>
      </div>
    </div>
  </div>
</template>
