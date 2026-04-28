import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";
import {
  Pokemon as PrismaPokemons,
  Trainer as PrismaTrainer,
  Team as PrismaTeam,
  TeamSlot as PrismaTeamSlot,
  Battle as PrismaBattle,
  BattleTurn as PrismaBattleTurn,
} from "@prisma/client";
import { Context } from "../graphql/context";
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
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  BattleAction:
    | (Omit<ForfeitAction, "trainer"> & { trainer: _RefType["Trainer"] })
    | (Omit<MoveAction, "move" | "sourcePokemon" | "targetPokemon" | "trainer"> & {
        move: _RefType["Move"];
        sourcePokemon: _RefType["Pokemon"];
        targetPokemon: _RefType["Pokemon"];
        trainer: _RefType["Trainer"];
      })
    | (Omit<SwitchAction, "inPokemon" | "outPokemon" | "trainer"> & {
        inPokemon: _RefType["Pokemon"];
        outPokemon: _RefType["Pokemon"];
        trainer: _RefType["Trainer"];
      });
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Move: PhysicalMove | SpecialMove | StatusMove;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Ability: ResolverTypeWrapper<Ability>;
  AuthPayload: ResolverTypeWrapper<
    Omit<AuthPayload, "trainer"> & { trainer: ResolversTypes["Trainer"] }
  >;
  Battle: ResolverTypeWrapper<PrismaBattle>;
  BattleAction: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>["BattleAction"]>;
  BattlePayload: ResolverTypeWrapper<
    Omit<BattlePayload, "battle"> & { battle: ResolversTypes["Battle"] }
  >;
  BattleStatus: BattleStatus;
  BattleTurn: ResolverTypeWrapper<PrismaBattleTurn>;
  BattleUpdate: ResolverTypeWrapper<
    Omit<BattleUpdate, "battle" | "latestTurn"> & {
      battle: ResolversTypes["Battle"];
      latestTurn?: Maybe<ResolversTypes["BattleTurn"]>;
    }
  >;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  CreateTeamInput: CreateTeamInput;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]["output"]>;
  EvolutionStage: ResolverTypeWrapper<
    Omit<EvolutionStage, "pokemon"> & { pokemon: ResolversTypes["Pokemon"] }
  >;
  FavoritePokemonInput: FavoritePokemonInput;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  ForfeitAction: ResolverTypeWrapper<
    Omit<ForfeitAction, "trainer"> & { trainer: ResolversTypes["Trainer"] }
  >;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Move: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>["Move"]>;
  MoveAction: ResolverTypeWrapper<
    Omit<MoveAction, "move" | "sourcePokemon" | "targetPokemon" | "trainer"> & {
      move: ResolversTypes["Move"];
      sourcePokemon: ResolversTypes["Pokemon"];
      targetPokemon: ResolversTypes["Pokemon"];
      trainer: ResolversTypes["Trainer"];
    }
  >;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PhysicalMove: ResolverTypeWrapper<PhysicalMove>;
  Pokemon: ResolverTypeWrapper<PrismaPokemons>;
  PokemonConnection: ResolverTypeWrapper<
    Omit<PokemonConnection, "edges"> & { edges: Array<ResolversTypes["PokemonEdge"]> }
  >;
  PokemonEdge: ResolverTypeWrapper<Omit<PokemonEdge, "node"> & { node: ResolversTypes["Pokemon"] }>;
  PokemonFilter: PokemonFilter;
  PokemonType: PokemonType;
  Query: ResolverTypeWrapper<{}>;
  Region: ResolverTypeWrapper<Region>;
  SignInInput: SignInInput;
  SpecialMove: ResolverTypeWrapper<SpecialMove>;
  StartBattleInput: StartBattleInput;
  Stats: ResolverTypeWrapper<Stats>;
  StatusMove: ResolverTypeWrapper<StatusMove>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  SubmitBattleActionInput: SubmitBattleActionInput;
  Subscription: ResolverTypeWrapper<{}>;
  SwitchAction: ResolverTypeWrapper<
    Omit<SwitchAction, "inPokemon" | "outPokemon" | "trainer"> & {
      inPokemon: ResolversTypes["Pokemon"];
      outPokemon: ResolversTypes["Pokemon"];
      trainer: ResolversTypes["Trainer"];
    }
  >;
  Team: ResolverTypeWrapper<PrismaTeam>;
  TeamPayload: ResolverTypeWrapper<Omit<TeamPayload, "team"> & { team: ResolversTypes["Team"] }>;
  TeamSlot: ResolverTypeWrapper<PrismaTeamSlot>;
  TeamSlotInput: TeamSlotInput;
  Trainer: ResolverTypeWrapper<PrismaTrainer>;
  TypeEffectiveness: ResolverTypeWrapper<TypeEffectiveness>;
  UpdateTeamInput: UpdateTeamInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Ability: Ability;
  AuthPayload: Omit<AuthPayload, "trainer"> & { trainer: ResolversParentTypes["Trainer"] };
  Battle: PrismaBattle;
  BattleAction: ResolversUnionTypes<ResolversParentTypes>["BattleAction"];
  BattlePayload: Omit<BattlePayload, "battle"> & { battle: ResolversParentTypes["Battle"] };
  BattleTurn: PrismaBattleTurn;
  BattleUpdate: Omit<BattleUpdate, "battle" | "latestTurn"> & {
    battle: ResolversParentTypes["Battle"];
    latestTurn?: Maybe<ResolversParentTypes["BattleTurn"]>;
  };
  Boolean: Scalars["Boolean"]["output"];
  CreateTeamInput: CreateTeamInput;
  DateTime: Scalars["DateTime"]["output"];
  EvolutionStage: Omit<EvolutionStage, "pokemon"> & { pokemon: ResolversParentTypes["Pokemon"] };
  FavoritePokemonInput: FavoritePokemonInput;
  Float: Scalars["Float"]["output"];
  ForfeitAction: Omit<ForfeitAction, "trainer"> & { trainer: ResolversParentTypes["Trainer"] };
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  Move: ResolversInterfaceTypes<ResolversParentTypes>["Move"];
  MoveAction: Omit<MoveAction, "move" | "sourcePokemon" | "targetPokemon" | "trainer"> & {
    move: ResolversParentTypes["Move"];
    sourcePokemon: ResolversParentTypes["Pokemon"];
    targetPokemon: ResolversParentTypes["Pokemon"];
    trainer: ResolversParentTypes["Trainer"];
  };
  Mutation: {};
  PageInfo: PageInfo;
  PhysicalMove: PhysicalMove;
  Pokemon: PrismaPokemons;
  PokemonConnection: Omit<PokemonConnection, "edges"> & {
    edges: Array<ResolversParentTypes["PokemonEdge"]>;
  };
  PokemonEdge: Omit<PokemonEdge, "node"> & { node: ResolversParentTypes["Pokemon"] };
  PokemonFilter: PokemonFilter;
  Query: {};
  Region: Region;
  SignInInput: SignInInput;
  SpecialMove: SpecialMove;
  StartBattleInput: StartBattleInput;
  Stats: Stats;
  StatusMove: StatusMove;
  String: Scalars["String"]["output"];
  SubmitBattleActionInput: SubmitBattleActionInput;
  Subscription: {};
  SwitchAction: Omit<SwitchAction, "inPokemon" | "outPokemon" | "trainer"> & {
    inPokemon: ResolversParentTypes["Pokemon"];
    outPokemon: ResolversParentTypes["Pokemon"];
    trainer: ResolversParentTypes["Trainer"];
  };
  Team: PrismaTeam;
  TeamPayload: Omit<TeamPayload, "team"> & { team: ResolversParentTypes["Team"] };
  TeamSlot: PrismaTeamSlot;
  TeamSlotInput: TeamSlotInput;
  Trainer: PrismaTrainer;
  TypeEffectiveness: TypeEffectiveness;
  UpdateTeamInput: UpdateTeamInput;
}>;

export type AbilityResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Ability"] = ResolversParentTypes["Ability"],
> = ResolversObject<{
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  isHidden?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AuthPayload"] = ResolversParentTypes["AuthPayload"],
> = ResolversObject<{
  trainer?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BattleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Battle"] = ResolversParentTypes["Battle"],
> = ResolversObject<{
  completedAt?: Resolver<Maybe<ResolversTypes["DateTime"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  startedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["BattleStatus"], ParentType, ContextType>;
  teamA?: Resolver<ResolversTypes["Team"], ParentType, ContextType>;
  teamB?: Resolver<ResolversTypes["Team"], ParentType, ContextType>;
  trainerA?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  trainerB?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  turns?: Resolver<Array<ResolversTypes["BattleTurn"]>, ParentType, ContextType>;
  winner?: Resolver<Maybe<ResolversTypes["Trainer"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BattleActionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["BattleAction"] = ResolversParentTypes["BattleAction"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "ForfeitAction" | "MoveAction" | "SwitchAction",
    ParentType,
    ContextType
  >;
}>;

export type BattlePayloadResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["BattlePayload"] = ResolversParentTypes["BattlePayload"],
> = ResolversObject<{
  battle?: Resolver<ResolversTypes["Battle"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BattleTurnResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["BattleTurn"] = ResolversParentTypes["BattleTurn"],
> = ResolversObject<{
  actionA?: Resolver<ResolversTypes["BattleAction"], ParentType, ContextType>;
  actionB?: Resolver<ResolversTypes["BattleAction"], ParentType, ContextType>;
  hpSnapshot?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  turnNumber?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BattleUpdateResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["BattleUpdate"] = ResolversParentTypes["BattleUpdate"],
> = ResolversObject<{
  battle?: Resolver<ResolversTypes["Battle"], ParentType, ContextType>;
  latestTurn?: Resolver<Maybe<ResolversTypes["BattleTurn"]>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<
  ResolversTypes["DateTime"],
  any
> {
  name: "DateTime";
}

export type EvolutionStageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["EvolutionStage"] =
    ResolversParentTypes["EvolutionStage"],
> = ResolversObject<{
  minLevel?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  pokemon?: Resolver<ResolversTypes["Pokemon"], ParentType, ContextType>;
  triggerItem?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ForfeitActionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ForfeitAction"] = ResolversParentTypes["ForfeitAction"],
> = ResolversObject<{
  trainer?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoveResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Move"] = ResolversParentTypes["Move"],
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "PhysicalMove" | "SpecialMove" | "StatusMove",
    ParentType,
    ContextType
  >;
  accuracy?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  power?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  pp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["PokemonType"], ParentType, ContextType>;
}>;

export type MoveActionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["MoveAction"] = ResolversParentTypes["MoveAction"],
> = ResolversObject<{
  damage?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  effectiveness?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  isCritical?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  move?: Resolver<ResolversTypes["Move"], ParentType, ContextType>;
  sourcePokemon?: Resolver<ResolversTypes["Pokemon"], ParentType, ContextType>;
  targetPokemon?: Resolver<ResolversTypes["Pokemon"], ParentType, ContextType>;
  trainer?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = ResolversObject<{
  _?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  createTeam?: Resolver<
    ResolversTypes["TeamPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTeamArgs, "input">
  >;
  deleteTeam?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTeamArgs, "id">
  >;
  favoritePokemon?: Resolver<
    ResolversTypes["Trainer"],
    ParentType,
    ContextType,
    RequireFields<MutationFavoritePokemonArgs, "input">
  >;
  signIn?: Resolver<
    ResolversTypes["AuthPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationSignInArgs, "input">
  >;
  signOut?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  startBattle?: Resolver<
    ResolversTypes["BattlePayload"],
    ParentType,
    ContextType,
    RequireFields<MutationStartBattleArgs, "input">
  >;
  submitBattleAction?: Resolver<
    ResolversTypes["BattlePayload"],
    ParentType,
    ContextType,
    RequireFields<MutationSubmitBattleActionArgs, "input">
  >;
  unfavoritePokemon?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  updateTeam?: Resolver<
    ResolversTypes["TeamPayload"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTeamArgs, "input">
  >;
}>;

export type PageInfoResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PageInfo"] = ResolversParentTypes["PageInfo"],
> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PhysicalMoveResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PhysicalMove"] = ResolversParentTypes["PhysicalMove"],
> = ResolversObject<{
  accuracy?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  makesContact?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  power?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  pp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["PokemonType"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PokemonResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Pokemon"] = ResolversParentTypes["Pokemon"],
> = ResolversObject<{
  abilities?: Resolver<Array<ResolversTypes["Ability"]>, ParentType, ContextType>;
  baseStats?: Resolver<ResolversTypes["Stats"], ParentType, ContextType>;
  captureRate?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  encounterRate?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  evolutionChain?: Resolver<Array<ResolversTypes["EvolutionStage"]>, ParentType, ContextType>;
  flavorText?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  moves?: Resolver<Array<ResolversTypes["Move"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  pokedexNumber?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  region?: Resolver<ResolversTypes["Region"], ParentType, ContextType>;
  syncedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes["PokemonType"]>, ParentType, ContextType>;
  weight?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PokemonConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PokemonConnection"] =
    ResolversParentTypes["PokemonConnection"],
> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes["PokemonEdge"]>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PokemonEdgeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PokemonEdge"] = ResolversParentTypes["PokemonEdge"],
> = ResolversObject<{
  cursor?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  node?: Resolver<ResolversTypes["Pokemon"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  battle?: Resolver<
    Maybe<ResolversTypes["Battle"]>,
    ParentType,
    ContextType,
    RequireFields<QueryBattleArgs, "id">
  >;
  myBattles?: Resolver<Array<ResolversTypes["Battle"]>, ParentType, ContextType>;
  pokemon?: Resolver<
    Maybe<ResolversTypes["Pokemon"]>,
    ParentType,
    ContextType,
    RequireFields<QueryPokemonArgs, "id">
  >;
  pokemonByNumber?: Resolver<
    Maybe<ResolversTypes["Pokemon"]>,
    ParentType,
    ContextType,
    RequireFields<QueryPokemonByNumberArgs, "number">
  >;
  pokemons?: Resolver<
    ResolversTypes["PokemonConnection"],
    ParentType,
    ContextType,
    Partial<QueryPokemonsArgs>
  >;
  regions?: Resolver<Array<ResolversTypes["Region"]>, ParentType, ContextType>;
  team?: Resolver<
    Maybe<ResolversTypes["Team"]>,
    ParentType,
    ContextType,
    RequireFields<QueryTeamArgs, "id">
  >;
  typeEffectiveness?: Resolver<
    Array<ResolversTypes["TypeEffectiveness"]>,
    ParentType,
    ContextType,
    Partial<QueryTypeEffectivenessArgs>
  >;
  viewer?: Resolver<Maybe<ResolversTypes["Trainer"]>, ParentType, ContextType>;
}>;

export type RegionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Region"] = ResolversParentTypes["Region"],
> = ResolversObject<{
  generation?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SpecialMoveResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SpecialMove"] = ResolversParentTypes["SpecialMove"],
> = ResolversObject<{
  accuracy?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  effectChance?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  power?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  pp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["PokemonType"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Stats"] = ResolversParentTypes["Stats"],
> = ResolversObject<{
  attack?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  defense?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  hp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  specialAttack?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  specialDefense?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  speed?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusMoveResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["StatusMove"] = ResolversParentTypes["StatusMove"],
> = ResolversObject<{
  accuracy?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  inflicts?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  power?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  pp?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["PokemonType"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"],
> = ResolversObject<{
  _?: SubscriptionResolver<Maybe<ResolversTypes["Boolean"]>, "_", ParentType, ContextType>;
  battleUpdates?: SubscriptionResolver<
    ResolversTypes["BattleUpdate"],
    "battleUpdates",
    ParentType,
    ContextType,
    RequireFields<SubscriptionBattleUpdatesArgs, "battleId">
  >;
}>;

export type SwitchActionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SwitchAction"] = ResolversParentTypes["SwitchAction"],
> = ResolversObject<{
  inPokemon?: Resolver<ResolversTypes["Pokemon"], ParentType, ContextType>;
  outPokemon?: Resolver<ResolversTypes["Pokemon"], ParentType, ContextType>;
  trainer?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeamResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Team"] = ResolversParentTypes["Team"],
> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes["Trainer"], ParentType, ContextType>;
  slots?: Resolver<Array<ResolversTypes["TeamSlot"]>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeamPayloadResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["TeamPayload"] = ResolversParentTypes["TeamPayload"],
> = ResolversObject<{
  team?: Resolver<ResolversTypes["Team"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TeamSlotResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["TeamSlot"] = ResolversParentTypes["TeamSlot"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  level?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  moves?: Resolver<Array<ResolversTypes["Move"]>, ParentType, ContextType>;
  nickname?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pokemon?: Resolver<ResolversTypes["Pokemon"], ParentType, ContextType>;
  position?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TrainerResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Trainer"] = ResolversParentTypes["Trainer"],
> = ResolversObject<{
  battleHistory?: Resolver<Array<ResolversTypes["Battle"]>, ParentType, ContextType>;
  favoritePokemon?: Resolver<Maybe<ResolversTypes["Pokemon"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  joinedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  teams?: Resolver<Array<ResolversTypes["Team"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TypeEffectivenessResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["TypeEffectiveness"] =
    ResolversParentTypes["TypeEffectiveness"],
> = ResolversObject<{
  attacker?: Resolver<ResolversTypes["PokemonType"], ParentType, ContextType>;
  defender?: Resolver<ResolversTypes["PokemonType"], ParentType, ContextType>;
  multiplier?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Ability?: AbilityResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Battle?: BattleResolvers<ContextType>;
  BattleAction?: BattleActionResolvers<ContextType>;
  BattlePayload?: BattlePayloadResolvers<ContextType>;
  BattleTurn?: BattleTurnResolvers<ContextType>;
  BattleUpdate?: BattleUpdateResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  EvolutionStage?: EvolutionStageResolvers<ContextType>;
  ForfeitAction?: ForfeitActionResolvers<ContextType>;
  Move?: MoveResolvers<ContextType>;
  MoveAction?: MoveActionResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PhysicalMove?: PhysicalMoveResolvers<ContextType>;
  Pokemon?: PokemonResolvers<ContextType>;
  PokemonConnection?: PokemonConnectionResolvers<ContextType>;
  PokemonEdge?: PokemonEdgeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  SpecialMove?: SpecialMoveResolvers<ContextType>;
  Stats?: StatsResolvers<ContextType>;
  StatusMove?: StatusMoveResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SwitchAction?: SwitchActionResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  TeamPayload?: TeamPayloadResolvers<ContextType>;
  TeamSlot?: TeamSlotResolvers<ContextType>;
  Trainer?: TrainerResolvers<ContextType>;
  TypeEffectiveness?: TypeEffectivenessResolvers<ContextType>;
}>;
