import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /**
   * ISO-8601 date-time string, e.g. "2024-01-15T09:30:00.000Z".
   * Serialized as a string over the wire.
   */
  DateTime: { input: Date | string; output: Date | string };
};

/** A learnable ability. */
export type Ability = {
  __typename?: "Ability";
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  /** Whether this is a hidden ability. */
  isHidden: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
};

export type AuthPayload = {
  __typename?: "AuthPayload";
  trainer: Trainer;
};

/** A head-to-head battle between two trainers. */
export type Battle = {
  __typename?: "Battle";
  completedAt?: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  startedAt: Scalars["DateTime"]["output"];
  status: BattleStatus;
  teamA: Team;
  teamB: Team;
  trainerA: Trainer;
  trainerB: Trainer;
  turns: Array<BattleTurn>;
  winner?: Maybe<Trainer>;
};

/** The action taken by one trainer during a turn. */
export type BattleAction = ForfeitAction | MoveAction | SwitchAction;

export type BattlePayload = {
  __typename?: "BattlePayload";
  battle: Battle;
};

/** Lifecycle state of a battle. */
export enum BattleStatus {
  Completed = "COMPLETED",
  Forfeited = "FORFEITED",
  InProgress = "IN_PROGRESS",
  Waiting = "WAITING",
}

/** One turn of a battle, consisting of two actions (one per trainer). */
export type BattleTurn = {
  __typename?: "BattleTurn";
  actionA: BattleAction;
  actionB: BattleAction;
  /** Snapshot of remaining HP for each slot after this turn resolves. */
  hpSnapshot: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  turnNumber: Scalars["Int"]["output"];
};

/** A battle state event pushed via subscription. */
export type BattleUpdate = {
  __typename?: "BattleUpdate";
  battle: Battle;
  /** The turn that just completed, if any. */
  latestTurn?: Maybe<BattleTurn>;
  /** Human-readable description of what just happened. */
  message: Scalars["String"]["output"];
};

export type CreateTeamInput = {
  name: Scalars["String"]["input"];
};

/** One step in a Pokémon's evolution chain. */
export type EvolutionStage = {
  __typename?: "EvolutionStage";
  /** Minimum level required to reach this stage, if applicable. */
  minLevel?: Maybe<Scalars["Int"]["output"]>;
  pokemon: Pokemon;
  /** Item consumed or used to trigger this evolution, if applicable. */
  triggerItem?: Maybe<Scalars["String"]["output"]>;
};

export type FavoritePokemonInput = {
  pokemonId: Scalars["ID"]["input"];
};

/** A trainer surrendered the battle. */
export type ForfeitAction = {
  __typename?: "ForfeitAction";
  trainer: Trainer;
};

/**
 * Category of a move. All moves implement this interface.
 * Use `__typename` or an inline fragment to access category-specific fields.
 */
export type Move = {
  /** Accuracy percentage (5–100), or null for moves that never miss. */
  accuracy?: Maybe<Scalars["Int"]["output"]>;
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  /** Base power, or null for moves with no direct damage. */
  power?: Maybe<Scalars["Int"]["output"]>;
  pp: Scalars["Int"]["output"];
  type: PokemonType;
};

/** A trainer used their active Pokémon's move. */
export type MoveAction = {
  __typename?: "MoveAction";
  /** Damage dealt (0 for status moves). */
  damage: Scalars["Int"]["output"];
  /** Type-effectiveness multiplier applied. */
  effectiveness: Scalars["Float"]["output"];
  /** Whether the move landed a critical hit. */
  isCritical: Scalars["Boolean"]["output"];
  move: Move;
  /** The Pokémon that used the move. */
  sourcePokemon: Pokemon;
  /** The Pokémon that was targeted. */
  targetPokemon: Pokemon;
  trainer: Trainer;
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type Mutation = {
  __typename?: "Mutation";
  _?: Maybe<Scalars["Boolean"]["output"]>;
  createTeam: TeamPayload;
  deleteTeam: Scalars["Boolean"]["output"];
  favoritePokemon: Trainer;
  /**
   * Sign in with a display name. Creates the trainer account on first use.
   * Sets a session cookie.
   */
  signIn: AuthPayload;
  /** Clear the session cookie. */
  signOut: Scalars["Boolean"]["output"];
  startBattle: BattlePayload;
  submitBattleAction: BattlePayload;
  unfavoritePokemon: Trainer;
  updateTeam: TeamPayload;
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type MutationDeleteTeamArgs = {
  id: Scalars["ID"]["input"];
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type MutationFavoritePokemonArgs = {
  input: FavoritePokemonInput;
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type MutationSignInArgs = {
  input: SignInInput;
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type MutationStartBattleArgs = {
  input: StartBattleInput;
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type MutationSubmitBattleActionArgs = {
  input: SubmitBattleActionInput;
};

/**
 * Root Mutation type. Concrete fields are added by `extend type Mutation`
 * in `schema.team.graphql` and `schema.battle.graphql`.
 */
export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor?: Maybe<Scalars["String"]["output"]>;
};

/** A move that uses the user's Attack stat against the target's Defense stat. */
export type PhysicalMove = Move & {
  __typename?: "PhysicalMove";
  accuracy?: Maybe<Scalars["Int"]["output"]>;
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  /** Whether this move makes contact (triggers contact-based abilities). */
  makesContact: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  power?: Maybe<Scalars["Int"]["output"]>;
  pp: Scalars["Int"]["output"];
  type: PokemonType;
};

/** A Pokémon species entry in the Pokédex. */
export type Pokemon = {
  __typename?: "Pokemon";
  abilities: Array<Ability>;
  baseStats: Stats;
  /**
   * Legacy field: use `encounterRate` instead.
   * @deprecated(reason: "Use `encounterRate` — same value, cleaner name.")
   * @deprecated Use `encounterRate` — same value, cleaner name.
   */
  captureRate?: Maybe<Scalars["Int"]["output"]>;
  /** Catch rate (0–255). Higher values mean easier to catch. */
  encounterRate: Scalars["Int"]["output"];
  /** Evolution chain stages, ordered from base form. */
  evolutionChain: Array<EvolutionStage>;
  /** Flavor text from the most recent main-series game. */
  flavorText: Scalars["String"]["output"];
  /** Height in meters. */
  height: Scalars["Float"]["output"];
  id: Scalars["ID"]["output"];
  /** Moves this Pokémon can learn. */
  moves: Array<Move>;
  name: Scalars["String"]["output"];
  /** National Pokédex number. */
  pokedexNumber: Scalars["Int"]["output"];
  region: Region;
  /** Timestamp this record was last synced from PokéAPI. */
  syncedAt: Scalars["DateTime"]["output"];
  types: Array<PokemonType>;
  /** Weight in kilograms. */
  weight: Scalars["Float"]["output"];
};

/** A page of Pokémon results. */
export type PokemonConnection = {
  __typename?: "PokemonConnection";
  edges: Array<PokemonEdge>;
  pageInfo: PageInfo;
  /** Total count of Pokémon matching the applied filter. */
  totalCount: Scalars["Int"]["output"];
};

export type PokemonEdge = {
  __typename?: "PokemonEdge";
  cursor: Scalars["String"]["output"];
  node: Pokemon;
};

/** Filter options for the Pokémon list. */
export type PokemonFilter = {
  /** Only return Pokémon from this generation (1–9). */
  generation?: InputMaybe<Scalars["Int"]["input"]>;
  /** Case-insensitive name search. */
  nameContains?: InputMaybe<Scalars["String"]["input"]>;
  types?: InputMaybe<Array<PokemonType>>;
};

/** The 18 elemental types in the Pokémon universe. */
export enum PokemonType {
  Bug = "BUG",
  Dark = "DARK",
  Dragon = "DRAGON",
  Electric = "ELECTRIC",
  Fairy = "FAIRY",
  Fighting = "FIGHTING",
  Fire = "FIRE",
  Flying = "FLYING",
  Ghost = "GHOST",
  Grass = "GRASS",
  Ground = "GROUND",
  Ice = "ICE",
  Normal = "NORMAL",
  Poison = "POISON",
  Psychic = "PSYCHIC",
  Rock = "ROCK",
  Steel = "STEEL",
  Water = "WATER",
}

export type Query = {
  __typename?: "Query";
  /** Fetch a battle by ID. */
  battle?: Maybe<Battle>;
  /** All battles for the current viewer. */
  myBattles: Array<Battle>;
  /** Fetch a single Pokémon by its national Pokédex ID. */
  pokemon?: Maybe<Pokemon>;
  /** Fetch a single Pokémon by its Pokédex number. */
  pokemonByNumber?: Maybe<Pokemon>;
  /**
   * Relay-style cursor-paginated Pokémon list.
   * Default page size is 20; maximum is 100.
   */
  pokemons: PokemonConnection;
  /** All regions. */
  regions: Array<Region>;
  /** Fetch a team by ID (only the owner can view their own teams). */
  team?: Maybe<Team>;
  /** All type-effectiveness multipliers (18×18 matrix). */
  typeEffectiveness: Array<TypeEffectiveness>;
  /** The currently authenticated trainer, or null if not signed in. */
  viewer?: Maybe<Trainer>;
};

export type QueryBattleArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPokemonArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPokemonByNumberArgs = {
  number: Scalars["Int"]["input"];
};

export type QueryPokemonsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<PokemonFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryTeamArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTypeEffectivenessArgs = {
  attacker?: InputMaybe<PokemonType>;
  defender?: InputMaybe<PokemonType>;
};

/** A geographic region in the Pokémon world. */
export type Region = {
  __typename?: "Region";
  /** Generation this region was introduced in (1–9). */
  generation: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type SignInInput = {
  /** Display name for the session. Creates an account if it does not exist. */
  name: Scalars["String"]["input"];
};

/** A move that uses the user's Special Attack stat against the target's Special Defense stat. */
export type SpecialMove = Move & {
  __typename?: "SpecialMove";
  accuracy?: Maybe<Scalars["Int"]["output"]>;
  description: Scalars["String"]["output"];
  /** Whether this move has a secondary effect chance. */
  effectChance?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  power?: Maybe<Scalars["Int"]["output"]>;
  pp: Scalars["Int"]["output"];
  type: PokemonType;
};

export type StartBattleInput = {
  myTeamId: Scalars["ID"]["input"];
  opponentId: Scalars["ID"]["input"];
  opponentTeamId: Scalars["ID"]["input"];
};

/** A single base stat value. */
export type Stats = {
  __typename?: "Stats";
  attack: Scalars["Int"]["output"];
  defense: Scalars["Int"]["output"];
  hp: Scalars["Int"]["output"];
  specialAttack: Scalars["Int"]["output"];
  specialDefense: Scalars["Int"]["output"];
  speed: Scalars["Int"]["output"];
};

/** A move that inflicts no direct damage — status conditions, stat changes, etc. */
export type StatusMove = Move & {
  __typename?: "StatusMove";
  accuracy?: Maybe<Scalars["Int"]["output"]>;
  description: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  /** Status condition this move can inflict, e.g. "PARALYSIS", "SLEEP". */
  inflicts?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  power?: Maybe<Scalars["Int"]["output"]>;
  pp: Scalars["Int"]["output"];
  type: PokemonType;
};

export type SubmitBattleActionInput = {
  battleId: Scalars["ID"]["input"];
  /** Set to true to forfeit the battle. */
  forfeit?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** For move actions: the move ID. */
  moveId?: InputMaybe<Scalars["ID"]["input"]>;
  /** For switch actions: the Pokémon ID to switch in. */
  switchToPokemonId?: InputMaybe<Scalars["ID"]["input"]>;
};

/**
 * Root Subscription type. Concrete fields are added by `extend type Subscription`
 * in `schema.battle.graphql`.
 */
export type Subscription = {
  __typename?: "Subscription";
  _?: Maybe<Scalars["Boolean"]["output"]>;
  /** Stream battle state updates in real time (via SSE). */
  battleUpdates: BattleUpdate;
};

/**
 * Root Subscription type. Concrete fields are added by `extend type Subscription`
 * in `schema.battle.graphql`.
 */
export type SubscriptionBattleUpdatesArgs = {
  battleId: Scalars["ID"]["input"];
};

/** A trainer switched their active Pokémon. */
export type SwitchAction = {
  __typename?: "SwitchAction";
  /** Pokémon being sent in. */
  inPokemon: Pokemon;
  /** Pokémon being recalled. */
  outPokemon: Pokemon;
  trainer: Trainer;
};

/** A named team of up to 6 Pokémon. */
export type Team = {
  __typename?: "Team";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  owner: Trainer;
  slots: Array<TeamSlot>;
  updatedAt: Scalars["DateTime"]["output"];
};

export type TeamPayload = {
  __typename?: "TeamPayload";
  team: Team;
};

/** One slot in a Team (max 6 slots per team). */
export type TeamSlot = {
  __typename?: "TeamSlot";
  id: Scalars["ID"]["output"];
  /** Level of this Pokémon (1–100). */
  level: Scalars["Int"]["output"];
  /** Up to 4 moves selected for this slot. */
  moves: Array<Move>;
  /** Optional nickname set by the trainer. */
  nickname?: Maybe<Scalars["String"]["output"]>;
  pokemon: Pokemon;
  position: Scalars["Int"]["output"];
};

export type TeamSlotInput = {
  /** Defaults to 50 if omitted. */
  level?: InputMaybe<Scalars["Int"]["input"]>;
  /** Up to 4 move IDs. */
  moveIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  nickname?: InputMaybe<Scalars["String"]["input"]>;
  pokemonId: Scalars["ID"]["input"];
};

/** A registered trainer (user account). */
export type Trainer = {
  __typename?: "Trainer";
  /** Battles this trainer has participated in. */
  battleHistory: Array<Battle>;
  /** The trainer's favorite Pokémon, if set. */
  favoritePokemon?: Maybe<Pokemon>;
  id: Scalars["ID"]["output"];
  joinedAt: Scalars["DateTime"]["output"];
  name: Scalars["String"]["output"];
  /** All teams owned by this trainer. */
  teams: Array<Team>;
};

/** Multiplier applied when one type attacks another. */
export type TypeEffectiveness = {
  __typename?: "TypeEffectiveness";
  attacker: PokemonType;
  defender: PokemonType;
  /** 0, 0.25, 0.5, 1, 2, or 4. */
  multiplier: Scalars["Float"]["output"];
};

export type UpdateTeamInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** Full replacement of the slot list. Omit to leave slots unchanged. */
  slots?: InputMaybe<Array<TeamSlotInput>>;
  teamId: Scalars["ID"]["input"];
};

export type PokemonCardFragment = {
  __typename?: "Pokemon";
  id: string;
  name: string;
  pokedexNumber: number;
  types: Array<PokemonType>;
  baseStats: { __typename?: "Stats"; hp: number; attack: number; defense: number; speed: number };
};

export type PokemonDetailFragment = {
  __typename?: "Pokemon";
  flavorText: string;
  height: number;
  weight: number;
  captureRate?: number | null;
  encounterRate: number;
  id: string;
  name: string;
  pokedexNumber: number;
  types: Array<PokemonType>;
  abilities: Array<{
    __typename?: "Ability";
    name: string;
    isHidden: boolean;
    description: string;
  }>;
  moves: Array<
    | {
        __typename?: "PhysicalMove";
        id: string;
        name: string;
        power?: number | null;
        accuracy?: number | null;
        pp: number;
      }
    | {
        __typename?: "SpecialMove";
        id: string;
        name: string;
        power?: number | null;
        accuracy?: number | null;
        pp: number;
      }
    | {
        __typename?: "StatusMove";
        id: string;
        name: string;
        accuracy?: number | null;
        pp: number;
        inflicts?: string | null;
      }
  >;
  evolutionChain: Array<{
    __typename?: "EvolutionStage";
    minLevel?: number | null;
    pokemon: { __typename?: "Pokemon"; id: string; name: string; pokedexNumber: number };
  }>;
  baseStats: {
    __typename?: "Stats";
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
};

export type TeamSlotFragment = {
  __typename?: "TeamSlot";
  id: string;
  nickname?: string | null;
  level: number;
  pokemon: {
    __typename?: "Pokemon";
    id: string;
    name: string;
    pokedexNumber: number;
    types: Array<PokemonType>;
    baseStats: { __typename?: "Stats"; hp: number; attack: number; defense: number; speed: number };
  };
  moves: Array<
    | { __typename?: "PhysicalMove"; id: string; name: string; power?: number | null; pp: number }
    | { __typename?: "SpecialMove"; id: string; name: string; power?: number | null; pp: number }
    | { __typename?: "StatusMove"; id: string; name: string; pp: number; inflicts?: string | null }
  >;
};

export type BattleUpdatesSubscriptionVariables = Exact<{
  battleId: Scalars["ID"]["input"];
}>;

export type BattleUpdatesSubscription = {
  __typename?: "Subscription";
  battleUpdates: {
    __typename?: "BattleUpdate";
    message: string;
    battle: {
      __typename?: "Battle";
      id: string;
      status: BattleStatus;
      winner?: { __typename?: "Trainer"; id: string; name: string } | null;
    };
    latestTurn?: {
      __typename?: "BattleTurn";
      id: string;
      turnNumber: number;
      actionA:
        | {
            __typename?: "ForfeitAction";
            trainer: { __typename?: "Trainer"; id: string; name: string };
          }
        | {
            __typename?: "MoveAction";
            damage: number;
            sourcePokemon: { __typename?: "Pokemon"; id: string; name: string };
            move:
              | { __typename?: "PhysicalMove"; id: string; name: string; power?: number | null }
              | { __typename?: "SpecialMove"; id: string; name: string; power?: number | null }
              | { __typename?: "StatusMove"; id: string; name: string; inflicts?: string | null };
          }
        | {
            __typename?: "SwitchAction";
            trainer: { __typename?: "Trainer"; id: string; name: string };
            inPokemon: { __typename?: "Pokemon"; id: string; name: string };
          };
    } | null;
  };
};

export type PokemonDetailQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type PokemonDetailQuery = {
  __typename?: "Query";
  pokemon?: {
    __typename?: "Pokemon";
    flavorText: string;
    height: number;
    weight: number;
    captureRate?: number | null;
    encounterRate: number;
    id: string;
    name: string;
    pokedexNumber: number;
    types: Array<PokemonType>;
    abilities: Array<{
      __typename?: "Ability";
      name: string;
      isHidden: boolean;
      description: string;
    }>;
    moves: Array<
      | {
          __typename?: "PhysicalMove";
          id: string;
          name: string;
          power?: number | null;
          accuracy?: number | null;
          pp: number;
        }
      | {
          __typename?: "SpecialMove";
          id: string;
          name: string;
          power?: number | null;
          accuracy?: number | null;
          pp: number;
        }
      | {
          __typename?: "StatusMove";
          id: string;
          name: string;
          accuracy?: number | null;
          pp: number;
          inflicts?: string | null;
        }
    >;
    evolutionChain: Array<{
      __typename?: "EvolutionStage";
      minLevel?: number | null;
      pokemon: { __typename?: "Pokemon"; id: string; name: string; pokedexNumber: number };
    }>;
    baseStats: {
      __typename?: "Stats";
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
    };
  } | null;
};

export type TeamDetailQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type TeamDetailQuery = {
  __typename?: "Query";
  team?: {
    __typename?: "Team";
    id: string;
    name: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    owner: { __typename?: "Trainer"; id: string; name: string };
    slots: Array<{
      __typename?: "TeamSlot";
      id: string;
      nickname?: string | null;
      level: number;
      pokemon: {
        __typename?: "Pokemon";
        id: string;
        name: string;
        pokedexNumber: number;
        types: Array<PokemonType>;
        baseStats: {
          __typename?: "Stats";
          hp: number;
          attack: number;
          defense: number;
          speed: number;
        };
      };
      moves: Array<
        | {
            __typename?: "PhysicalMove";
            id: string;
            name: string;
            power?: number | null;
            pp: number;
          }
        | {
            __typename?: "SpecialMove";
            id: string;
            name: string;
            power?: number | null;
            pp: number;
          }
        | {
            __typename?: "StatusMove";
            id: string;
            name: string;
            pp: number;
            inflicts?: string | null;
          }
      >;
    }>;
  } | null;
};

export const PokemonCardFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PokemonCard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Pokemon" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "pokedexNumber" } },
          { kind: "Field", name: { kind: "Name", value: "types" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "baseStats" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hp" } },
                { kind: "Field", name: { kind: "Name", value: "attack" } },
                { kind: "Field", name: { kind: "Name", value: "defense" } },
                { kind: "Field", name: { kind: "Name", value: "speed" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PokemonCardFragment, unknown>;
export const PokemonDetailFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PokemonDetail" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Pokemon" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "FragmentSpread", name: { kind: "Name", value: "PokemonCard" } },
          { kind: "Field", name: { kind: "Name", value: "flavorText" } },
          { kind: "Field", name: { kind: "Name", value: "height" } },
          { kind: "Field", name: { kind: "Name", value: "weight" } },
          { kind: "Field", name: { kind: "Name", value: "captureRate" } },
          { kind: "Field", name: { kind: "Name", value: "encounterRate" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "abilities" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "isHidden" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moves" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "PhysicalMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "accuracy" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "SpecialMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "accuracy" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StatusMove" } },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "accuracy" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                      { kind: "Field", name: { kind: "Name", value: "inflicts" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "evolutionChain" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "minLevel" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pokemon" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "pokedexNumber" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "baseStats" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hp" } },
                { kind: "Field", name: { kind: "Name", value: "attack" } },
                { kind: "Field", name: { kind: "Name", value: "defense" } },
                { kind: "Field", name: { kind: "Name", value: "specialAttack" } },
                { kind: "Field", name: { kind: "Name", value: "specialDefense" } },
                { kind: "Field", name: { kind: "Name", value: "speed" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PokemonCard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Pokemon" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "pokedexNumber" } },
          { kind: "Field", name: { kind: "Name", value: "types" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "baseStats" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hp" } },
                { kind: "Field", name: { kind: "Name", value: "attack" } },
                { kind: "Field", name: { kind: "Name", value: "defense" } },
                { kind: "Field", name: { kind: "Name", value: "speed" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PokemonDetailFragment, unknown>;
export const TeamSlotFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TeamSlot" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "TeamSlot" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "pokemon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "FragmentSpread", name: { kind: "Name", value: "PokemonCard" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "nickname" } },
          { kind: "Field", name: { kind: "Name", value: "level" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "moves" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "PhysicalMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "SpecialMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StatusMove" } },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                      { kind: "Field", name: { kind: "Name", value: "inflicts" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PokemonCard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Pokemon" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "pokedexNumber" } },
          { kind: "Field", name: { kind: "Name", value: "types" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "baseStats" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hp" } },
                { kind: "Field", name: { kind: "Name", value: "attack" } },
                { kind: "Field", name: { kind: "Name", value: "defense" } },
                { kind: "Field", name: { kind: "Name", value: "speed" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamSlotFragment, unknown>;
export const BattleUpdatesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "subscription",
      name: { kind: "Name", value: "BattleUpdates" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "battleId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "battleUpdates" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "battleId" },
                value: { kind: "Variable", name: { kind: "Name", value: "battleId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "message" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "battle" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "winner" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "latestTurn" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "turnNumber" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "actionA" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "MoveAction" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "sourcePokemon" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "move" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "InlineFragment",
                                          typeCondition: {
                                            kind: "NamedType",
                                            name: { kind: "Name", value: "PhysicalMove" },
                                          },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "power" },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "InlineFragment",
                                          typeCondition: {
                                            kind: "NamedType",
                                            name: { kind: "Name", value: "SpecialMove" },
                                          },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "power" },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "InlineFragment",
                                          typeCondition: {
                                            kind: "NamedType",
                                            name: { kind: "Name", value: "StatusMove" },
                                          },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "inflicts" },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  { kind: "Field", name: { kind: "Name", value: "damage" } },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "SwitchAction" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "trainer" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "inPokemon" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "InlineFragment",
                              typeCondition: {
                                kind: "NamedType",
                                name: { kind: "Name", value: "ForfeitAction" },
                              },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "trainer" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<BattleUpdatesSubscription, BattleUpdatesSubscriptionVariables>;
export const PokemonDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PokemonDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "pokemon" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "FragmentSpread", name: { kind: "Name", value: "PokemonDetail" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PokemonCard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Pokemon" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "pokedexNumber" } },
          { kind: "Field", name: { kind: "Name", value: "types" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "baseStats" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hp" } },
                { kind: "Field", name: { kind: "Name", value: "attack" } },
                { kind: "Field", name: { kind: "Name", value: "defense" } },
                { kind: "Field", name: { kind: "Name", value: "speed" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PokemonDetail" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Pokemon" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "FragmentSpread", name: { kind: "Name", value: "PokemonCard" } },
          { kind: "Field", name: { kind: "Name", value: "flavorText" } },
          { kind: "Field", name: { kind: "Name", value: "height" } },
          { kind: "Field", name: { kind: "Name", value: "weight" } },
          { kind: "Field", name: { kind: "Name", value: "captureRate" } },
          { kind: "Field", name: { kind: "Name", value: "encounterRate" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "abilities" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "isHidden" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "moves" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "PhysicalMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "accuracy" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "SpecialMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "accuracy" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StatusMove" } },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "accuracy" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                      { kind: "Field", name: { kind: "Name", value: "inflicts" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "evolutionChain" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "minLevel" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pokemon" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "pokedexNumber" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "baseStats" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hp" } },
                { kind: "Field", name: { kind: "Name", value: "attack" } },
                { kind: "Field", name: { kind: "Name", value: "defense" } },
                { kind: "Field", name: { kind: "Name", value: "specialAttack" } },
                { kind: "Field", name: { kind: "Name", value: "specialDefense" } },
                { kind: "Field", name: { kind: "Name", value: "speed" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PokemonDetailQuery, PokemonDetailQueryVariables>;
export const TeamDetailDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TeamDetail" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "team" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "owner" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "slots" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "FragmentSpread", name: { kind: "Name", value: "TeamSlot" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PokemonCard" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Pokemon" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "pokedexNumber" } },
          { kind: "Field", name: { kind: "Name", value: "types" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "baseStats" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hp" } },
                { kind: "Field", name: { kind: "Name", value: "attack" } },
                { kind: "Field", name: { kind: "Name", value: "defense" } },
                { kind: "Field", name: { kind: "Name", value: "speed" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TeamSlot" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "TeamSlot" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "pokemon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "FragmentSpread", name: { kind: "Name", value: "PokemonCard" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "nickname" } },
          { kind: "Field", name: { kind: "Name", value: "level" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "moves" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "PhysicalMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "SpecialMove" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "power" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                    ],
                  },
                },
                {
                  kind: "InlineFragment",
                  typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StatusMove" } },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "pp" } },
                      { kind: "Field", name: { kind: "Name", value: "inflicts" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamDetailQuery, TeamDetailQueryVariables>;
