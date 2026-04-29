/**
 * @generated SignedSource<<bb5abb71acd21fe48ba68ac4ac811ef0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type PokemonType = "BUG" | "DARK" | "DRAGON" | "ELECTRIC" | "FAIRY" | "FIGHTING" | "FIRE" | "FLYING" | "GHOST" | "GRASS" | "GROUND" | "ICE" | "NORMAL" | "POISON" | "PSYCHIC" | "ROCK" | "STEEL" | "WATER" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type PokemonCard_pokemon$data = {
  readonly id: string;
  readonly name: string;
  readonly pokedexNumber: number;
  readonly types: ReadonlyArray<PokemonType>;
  readonly " $fragmentType": "PokemonCard_pokemon";
};
export type PokemonCard_pokemon$key = {
  readonly " $data"?: PokemonCard_pokemon$data;
  readonly " $fragmentSpreads": FragmentRefs<"PokemonCard_pokemon">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PokemonCard_pokemon",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "pokedexNumber",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "types",
      "storageKey": null
    }
  ],
  "type": "Pokemon",
  "abstractKey": null
};

(node as any).hash = "00c21d7c5302b6f39c14680340f3eded";

export default node;
