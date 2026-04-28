# `analyzer-testbed` — Public Demo & Repro Repository

**Date**: 2026-04-28
**Status**: Design (not yet implemented)

## Overview

Create a new public GitHub repository at `trevor-scheer/analyzer-testbed` that serves three roles:

1. **Demo** — a polished, real-feeling project showcasing every feature the GraphQL Analyzer toolchain offers.
2. **Dogfood** — exercises the LSP, CLI, ESLint plugin, MCP server, VS Code extension, and Claude Code LSP plugin end-to-end so we catch regressions before users do.
3. **Repro substrate** — provides ready-made fixtures and scripts users can run to reproduce reported issues, plus a starting point for new bug reports.

The repo replaces the dev-oriented role of `test-workspace/` for *external* purposes only; `test-workspace/` continues to exist for internal development.

The primary app uses a **Pokémon theme** — Pokédex browsing, team building, and turn-based battle simulation — chosen because the domain has enough natural complexity (interfaces, unions, pagination, mutations, subscriptions) to exercise the analyzer without feeling contrived.

## Architecture

### Repo layout

```
analyzer-testbed/
  apps/web/                      # Next.js (codename: PokéForge)
  examples/
    relay-app/
    svelte-app/
    vue-app/
    astro-app/
    remote-schema/
    multi-project/
  fixtures/intentional-errors/   # repro / broken-on-purpose
  scripts/                       # demo automation
  .claude/
    plugins/graphql-analyzer-lsp/
    settings.json
  .vscode/
    extensions.json
    settings.json
  .mcp.json                      # graphql-mcp wired for Claude Code
  .graphqlrc.yaml                # one root config, one project per workspace
  eslint.config.js               # uses @graphql-analyzer/eslint-plugin
  .github/workflows/ci.yml
  pnpm-workspace.yaml
  package.json
  README.md
```

### Tooling baseline

- **Package manager**: pnpm workspaces (no Turborepo)
- **Node**: 22 LTS
- **TypeScript**: strict everywhere
- **License**: MIT
- **Formatter**: Prettier (zero-config)

## Primary App: PokéForge (`apps/web/`)

### Stack

- Next.js 15 (App Router), React 19
- **Server**: GraphQL Yoga mounted at `app/api/graphql/route.ts`, schema-first via `makeExecutableSchema`
- **Client**: Apollo Client (RSC integration for server-side fetches, client-side for interactivity)
- **Persistence**: Prisma + SQLite (`dev.db`, gitignored, populated by `pnpm db:seed`)
- **Codegen**: `graphql-codegen` for `Resolvers<Context>` types and typed client documents
- **Styling**: TailwindCSS

The deliberate pairing of **GraphQL Yoga (server)** with **Apollo Client (client)** demonstrates that the analyzer is server-implementation-agnostic.

### Layout

```
apps/web/
  app/
    api/graphql/route.ts         # Yoga handler
    pokedex/                     # list + detail (RSC + client)
    teams/                       # team builder (mutations, optimistic)
    battle/[id]/                 # battle UI (subscriptions via SSE)
    layout.tsx
    page.tsx
  graphql/
    schema.graphql               # core types
    schema.team.graphql          # Trainer, Team
    schema.battle.graphql        # Battle, Turn, Action
    resolvers/                   # split by type
    context.ts                   # Prisma + viewer
  lib/apollo/                    # client + server Apollo setup
  components/
    pokemon/, teams/, battle/
  prisma/
    schema.prisma
    seed.ts
  codegen.ts
```

### Data flow

- **Read paths**: RSC + server-side Apollo for initial render, hydrated to client Apollo for interactivity (pagination, mutations).
- **Mutations**: optimistic updates against the Apollo cache for `createTeam`, `favoritePokemon`, etc.
- **Subscriptions**: battle updates over SSE (Yoga's built-in transport — no extra infrastructure).
- **Embedded GraphQL**: a mix of `gql\`...\`` tagged templates inside `.tsx` files and standalone `.graphql` operation files, so the LSP/extractor sees both file shapes.

## Schema Design

Schema-first SDL, ~30–40 types, split across three files in `apps/web/graphql/`. No code-first frameworks — the analyzer is built for SDL static analysis, and supporting code-first would mean static analysis only sees printed SDL artifacts (a weak experience).

### `schema.graphql` — core domain

- `Pokemon`, `Stats`, `Ability`
- `Move` **interface** with concrete `PhysicalMove`, `SpecialMove`, `StatusMove`
- `Type` enum + `TypeEffectiveness`
- `Region`, `EvolutionStage`
- One **custom scalar** (`DateTime` via `graphql-scalars`) so codegen + lint rules see one in the wild
- One `@deprecated` field (e.g., `Pokemon.captureRate` deprecated in favor of `Pokemon.encounterRate`) so deprecation lint rules trigger
- `Query.pokemons(after, first, filter)` Relay-style cursor pagination, with `@connection(key: "pokedex")` applied client-side

### `schema.team.graphql` — user/team domain

- `Trainer` — id, name, joinedAt, favoritePokemon, teams, battleHistory
- `Team` — id, owner, name, slots: `[TeamSlot!]!` (max 6), createdAt, updatedAt
- `TeamSlot` — pokemon, nickname, level, moves
- Mock auth: `signIn(name)` / `signOut` mutations, `Query.viewer` field

### `schema.battle.graphql` — battle domain

- `Battle` — id, trainerA/trainerB, teamA/teamB, turns, status, winner
- `BattleTurn` with `BattleAction` **union** (`MoveAction | SwitchAction | ForfeitAction`)
- `BattleStatus` enum
- `Subscription.battleUpdates(battleId)`

### Operations exercised

- Queries: `viewer`, `pokemon(id)`, `pokemons` (paginated), `team(id)`, `battle(id)`, `typeEffectiveness`
- Mutations: `signIn`, `signOut`, `createTeam`, `updateTeam`, `deleteTeam`, `favoritePokemon`, `unfavoritePokemon`, `startBattle`, `submitBattleAction`
- Subscription: `battleUpdates(battleId)`
- No fully-custom client directives — they invariably feel contrived in demos. `@connection` (built-in Apollo cache directive) earns its place on the paginated list.

## `examples/` Directory

All Pokémon-themed examples point their `graphql-config` schema at `apps/web/graphql/` (relative path) — they don't run their own server. This keeps maintenance light: one schema, many client demos.

| Example | Stack | Demonstrates |
|---|---|---|
| `examples/relay-app` | Vite + React + Relay 17 | `@refetchable`, `@connection`, fragment composition, Relay-compiler artifacts |
| `examples/svelte-app` | SvelteKit + houdini | `.svelte` SFC extraction, embedded GraphQL inside `<script lang="ts">` |
| `examples/vue-app` | Vue 3 + `@vue/apollo-composable` | `.vue` SFC extraction, Composition API patterns |
| `examples/astro-app` | Astro + urql | `.astro` files with frontmatter GraphQL, urql instead of Apollo |
| `examples/remote-schema` | Plain TS script | graphql-config pointed at a public introspection endpoint (e.g., `countries.trevorblades.com`); no local SDL. **Non-Pokémon** — we don't host a Pokémon API. |
| `examples/multi-project` | Plain TS | One workspace with two `projects:` in its own `.graphqlrc.yaml` (Pokédex + tiny shop schema), demonstrating per-project lint config overrides |

The `remote-schema` and `multi-project` entries are intentionally the odd ones out — they exist to demonstrate config patterns, not framework integrations.

## Dogfooding Integration

### `.graphqlrc.yaml` (root)

One `projects:` entry per workspace, each with its own lint config so the testbed shows per-project tuning.

### ESLint

Root `eslint.config.js` loading `@graphql-analyzer/eslint-plugin`, `eslint-plugin-react-hooks`, and `@typescript-eslint`. Plugin runs against embedded GraphQL in `.ts`/`.tsx`/`.svelte`/`.vue`/`.astro`. Recommended preset enabled.

### VS Code

- `.vscode/extensions.json` recommends the GraphQL Analyzer extension
- `.vscode/settings.json` enables eslint validate for all GraphQL host languages

### MCP

`.mcp.json` with `graphql-mcp` configured against the root `graphql-config`. README documents the experience so users opening the repo with Claude Code get tools immediately.

### Claude Code LSP plugin

- `.claude/plugins/graphql-analyzer-lsp/.claude-plugin/plugin.json` — declares the plugin, points `lspServers` at `./.lsp.json`
- `.claude/plugins/graphql-analyzer-lsp/.lsp.json` — registers the `graphql-lsp` server, invoked via the published binary distribution channel (e.g., `npx @graphql-analyzer/lsp`); exact mechanism verified at implementation time
- `.claude/settings.json` lists the plugin under `enabledPlugins`

This means a fresh clone + Claude Code session has the full `LSP` tool (goto-def, hover, find-references) wired up against the testbed itself. VS Code users get the same server via the marketplace extension.

### CI (`.github/workflows/ci.yml`)

Single workflow, two jobs:

**`validate`** (runs on every push/PR):
- `pnpm install --frozen-lockfile`
- `pnpm graphql-cli check` against every project
- `pnpm eslint .` (whole repo)
- `pnpm tsc --noEmit` per workspace
- `pnpm --filter @analyzer-testbed/web prisma generate && pnpm --filter @analyzer-testbed/web test`

**`expect-failure`** (runs on every push/PR):
- `pnpm graphql-cli check fixtures/intentional-errors/` and **expects non-zero exit** — proves the CLI reports problems correctly.

### `fixtures/intentional-errors/`

Curated repro cases, each in its own named directory:

- `missing-fragment/`
- `unknown-directive/`
- `deprecated-field-usage/`
- `selection-type-mismatch/`
- `schema-cycle/`

Each has a `README.md` explaining what should fire and what the expected output looks like. This is the "drop your bug repro here" landing zone.

### Demo scripts (`scripts/`)

Each script is idempotent and self-documenting via `--help`.

| Script | What it does |
|---|---|
| `scripts/demo-failing-pr.sh <fixture-name>` | Creates branch `demo/<fixture>-<timestamp>`, copies the fixture into `apps/web/graphql/`, commits, pushes, opens a draft PR via `gh`. Prints the PR URL. CI goes red — expected. |
| `scripts/demo-cli-output.sh [fixture-name]` | Runs `graphql-cli check` against one or all fixtures locally with colored output, headers per case. No git side effects. |
| `scripts/demo-lsp.sh <feature>` | Opens VS Code at a specific file/line for a chosen feature (`hover`, `goto-def`, `find-refs`, `diagnostic`, `completion`). Each target line has a comment explaining what to do. |
| `scripts/demo-mcp.sh` | Prints the exact `claude` invocation to use in this directory plus suggested prompts (e.g., "ask Claude to find all uses of `Pokemon.captureRate`"). |
| `scripts/cleanup-demos.sh` | Lists and optionally closes/deletes any `demo/*` branches and PRs created by the scripts. |

### README structure

- **Quickstart** — clone, install, run dev server
- **Demos** — each script with one-line description and expected outcome
- **Reproducing a bug** — `scripts/demo-failing-pr.sh` flow + how to attach output to an issue
- **Open in VS Code** — the extension recommendation flow
- **Open in Claude Code** — the MCP + LSP plugin flow
- **CI status** badges

## Validating the Testbed Itself

The testbed is itself software that needs to keep working:

- **Testbed CI** — already covered above.
- **Cross-repo CI from `graphql-analyzer`** — a workflow in this repo triggered on **release publish** (knope completing a release) rather than on a cron, since releases are the meaningful trigger and avoid weekend/holiday noise:
  1. Clones `analyzer-testbed`
  2. Bumps the testbed's `@graphql-analyzer/*` dependencies to the just-published versions
  3. Runs the testbed's full CI matrix against the freshly-released artifacts
  4. On failure: opens an issue on `graphql-analyzer` tagging the offending release; on success: optionally opens a PR on the testbed bumping the lockfile
- **Snapshot tests** — `apps/web/__snapshots__/` for codegen output (`generated/types.ts`, `generated/resolvers.ts`). Codegen output diffs flag changes for review.
- **Dependabot** — `.github/dependabot.yml` keeps `@graphql-analyzer/*` packages updated automatically so the testbed reflects the latest published surface.

## Out of Scope

Explicitly **not** included:

- Code-first GraphQL frameworks (Pothos, Nexus, TypeGraphQL) — analyzer support is too thin to demo well
- Real authentication (NextAuth, OAuth) — mock auth covers the schema-shape needs
- Federation / subgraph composition — separate concern, separate demo if/when relevant
- Persisted queries — possible follow-up
- Pre-commit hooks (lefthook/husky) — adds friction for contributors trying to repro
- Custom (project-local) lint rules — only worth adding once the public extensibility API exists
- Project-local custom client directives — invariably feel contrived in demos

## Open Questions

- **App codename**: `PokéForge` is a placeholder; alternatives welcome at implementation time.
- **Pokémon dataset**: snapshot from PokeAPI (gen 1–3 only? all 9 gens?) — pick a reasonable scope at implementation time. Bigger dataset = better pagination demo, more seed data to ship.
- **LSP plugin distribution channel**: exact `npx`/binary invocation depends on what `@graphql-analyzer/lsp` ships at the time of implementation.
