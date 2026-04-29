import { InMemoryCache } from "@apollo/client";

export function makeCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          pokemons: {
            // @connection(key: "pokedex") maps here
            keyArgs: ["filter"],
            merge(existing, incoming, { args }) {
              if (!args?.after) {
                // fresh query or filter change — replace
                return incoming;
              }
              return {
                ...incoming,
                edges: [...(existing?.edges ?? []), ...(incoming.edges ?? [])],
              };
            },
          },
        },
      },
      Pokemon: {
        keyFields: ["id"],
      },
      Team: {
        keyFields: ["id"],
      },
      Trainer: {
        keyFields: ["id"],
      },
      Battle: {
        keyFields: ["id"],
      },
    },
  });
}
