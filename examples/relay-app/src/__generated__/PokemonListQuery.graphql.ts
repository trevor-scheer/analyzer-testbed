/**
 * @generated SignedSource<<7b72a4fb1741add28f0a14af37448b38>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PokemonListQuery$variables = {
  after?: string | null | undefined;
  first?: number | null | undefined;
};
export type PokemonListQuery$data = {
  readonly pokemons: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"PokemonCard_pokemon">;
      };
    }>;
  };
};
export type PokemonListQuery = {
  response: PokemonListQuery$data;
  variables: PokemonListQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "after",
    },
    v1 = {
      defaultValue: null,
      kind: "LocalArgument",
      name: "first",
    },
    v2 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "id",
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "__typename",
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "cursor",
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      concreteType: "PageInfo",
      kind: "LinkedField",
      name: "pageInfo",
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "endCursor",
          storageKey: null,
        },
        {
          alias: null,
          args: null,
          kind: "ScalarField",
          name: "hasNextPage",
          storageKey: null,
        },
      ],
      storageKey: null,
    },
    v6 = [
      {
        kind: "Variable",
        name: "after",
        variableName: "after",
      },
      {
        kind: "Variable",
        name: "first",
        variableName: "first",
      },
    ];
  return {
    fragment: {
      argumentDefinitions: [v0 /*: any*/, v1 /*: any*/],
      kind: "Fragment",
      metadata: null,
      name: "PokemonListQuery",
      selections: [
        {
          alias: "pokemons",
          args: null,
          concreteType: "PokemonConnection",
          kind: "LinkedField",
          name: "__PokemonList_pokemons_connection",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "PokemonEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "Pokemon",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v2 /*: any*/,
                    {
                      args: null,
                      kind: "FragmentSpread",
                      name: "PokemonCard_pokemon",
                    },
                    v3 /*: any*/,
                  ],
                  storageKey: null,
                },
                v4 /*: any*/,
              ],
              storageKey: null,
            },
            v5 /*: any*/,
          ],
          storageKey: null,
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [v1 /*: any*/, v0 /*: any*/],
      kind: "Operation",
      name: "PokemonListQuery",
      selections: [
        {
          alias: null,
          args: v6 /*: any*/,
          concreteType: "PokemonConnection",
          kind: "LinkedField",
          name: "pokemons",
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: "PokemonEdge",
              kind: "LinkedField",
              name: "edges",
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: "Pokemon",
                  kind: "LinkedField",
                  name: "node",
                  plural: false,
                  selections: [
                    v2 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "name",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "pokedexNumber",
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: "ScalarField",
                      name: "types",
                      storageKey: null,
                    },
                    v3 /*: any*/,
                  ],
                  storageKey: null,
                },
                v4 /*: any*/,
              ],
              storageKey: null,
            },
            v5 /*: any*/,
          ],
          storageKey: null,
        },
        {
          alias: null,
          args: v6 /*: any*/,
          filters: null,
          handle: "connection",
          key: "PokemonList_pokemons",
          kind: "LinkedHandle",
          name: "pokemons",
        },
      ],
    },
    params: {
      cacheID: "7fda5b754c5d6c69774c9dd8d277b825",
      id: null,
      metadata: {
        connection: [
          {
            count: "first",
            cursor: "after",
            direction: "forward",
            path: ["pokemons"],
          },
        ],
      },
      name: "PokemonListQuery",
      operationKind: "query",
      text: "query PokemonListQuery(\n  $first: Int\n  $after: String\n) {\n  pokemons(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        ...PokemonCard_pokemon\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment PokemonCard_pokemon on Pokemon {\n  id\n  name\n  pokedexNumber\n  types\n}\n",
    },
  };
})();

(node as any).hash = "cb60de255ec885f964848c55bc6cab3c";

export default node;
