# analyzer-testbed

[![CI](https://github.com/trevor-scheer/analyzer-testbed/actions/workflows/ci.yml/badge.svg)](https://github.com/trevor-scheer/analyzer-testbed/actions/workflows/ci.yml)
[![Dogfood CI](https://github.com/trevor-scheer/graphql-analyzer/actions/workflows/dogfood-testbed.yml/badge.svg)](https://github.com/trevor-scheer/graphql-analyzer/actions/workflows/dogfood-testbed.yml)

Public demo, dogfood, and repro substrate for the [GraphQL Analyzer](https://github.com/trevor-scheer/graphql-analyzer) toolchain.

This repo exercises the GraphQL Analyzer LSP, CLI, ESLint plugin, MCP server, VS Code extension, and Claude Code LSP plugin end-to-end — all against a real Pokémon-themed app.

---

## Quickstart

```bash
git clone https://github.com/trevor-scheer/analyzer-testbed.git
cd analyzer-testbed
pnpm install
pnpm --filter @analyzer-testbed/web db:seed
pnpm --filter @analyzer-testbed/web dev
```

Open http://localhost:3000.

---

## Demos

| Script                                 | Description                                                                                                | Expected outcome                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `scripts/demo-cli-output.sh [fixture]` | Run `graphql-cli check` against one or all intentional-error fixtures with colored headers                 | Errors printed per fixture; exits 0        |
| `scripts/demo-failing-pr.sh <fixture>` | Create a `demo/<fixture>-<timestamp>` branch, copy the fixture into the app, commit, push, open a draft PR | Draft PR created; CI goes red              |
| `scripts/demo-lsp.sh <feature>`        | Open VS Code at the LSP demo target for `hover`, `goto-def`, `find-refs`, `diagnostic`, or `completion`    | VS Code opens at the annotated line        |
| `scripts/demo-mcp.sh`                  | Print the `claude` invocation and suggested prompts for this repo                                          | Suggested prompts printed; no side effects |
| `scripts/cleanup-demos.sh`             | List and optionally close/delete all `demo/*` branches and PRs                                             | Interactive cleanup of demo branches       |

---

## Reproducing a bug

1. Find the closest fixture in `fixtures/intentional-errors/` — or create a new one following the same pattern (schema + operations + README).
2. Run the CLI against it:
   ```bash
   scripts/demo-cli-output.sh <fixture-name>
   ```
3. To attach a failing PR to a bug report:
   ```bash
   scripts/demo-failing-pr.sh <fixture-name>
   # Prints the PR URL — paste it into the issue
   ```
4. Clean up when done:
   ```bash
   scripts/cleanup-demos.sh
   ```

---

## Open in VS Code

1. `code .` from the repo root
2. Accept the prompt to install recommended extensions — this installs **GraphQL Analyzer** (`graphql-analyzer.graphql-analyzer`)
3. Install the `graphql-lsp` binary (used by the extension):
   - Download from the [releases page](https://github.com/trevor-scheer/graphql-analyzer/releases) (look for the `graphql-analyzer-lsp` release)
   - Place the binary on your PATH: `mv graphql-lsp ~/.local/bin/`
4. Open any `.graphql` file — diagnostics, hover, and go-to-definition should work immediately

---

## Open in Claude Code

### MCP server

`.mcp.json` at the repo root registers `graphql-mcp` automatically when you open this directory in Claude Code. No setup needed beyond having `graphql-mcp` on your PATH.

Install `graphql-mcp`:

- Download from the [releases page](https://github.com/trevor-scheer/graphql-analyzer/releases) (look for the `graphql-analyzer-mcp` release)
- Place the binary on your PATH: `mv graphql-mcp ~/.local/bin/`

Then open the repo:

```bash
claude .
```

Run `scripts/demo-mcp.sh` for a list of suggested prompts.

### LSP plugin

The Claude Code LSP plugin at `.claude/plugins/graphql-analyzer-lsp/` gives Claude Code the same `LSP` tool available in the `graphql-analyzer` dev environment — goto-def, find-refs, hover, diagnostics — all powered by `graphql-lsp`.

Prerequisites:

- `graphql-lsp` binary on PATH (same binary as the VS Code extension)
- Claude Code v2.x or later

The plugin is enabled in `.claude/settings.json` and activates automatically.

---

## Prerequisites summary

| Binary          | Used by                                   | Install                                                                                                      |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `graphql-lsp`   | VS Code extension, Claude Code LSP plugin | [releases page](https://github.com/trevor-scheer/graphql-analyzer/releases) → `graphql-analyzer-lsp` release |
| `graphql-mcp`   | Claude Code MCP server                    | [releases page](https://github.com/trevor-scheer/graphql-analyzer/releases) → `graphql-analyzer-mcp` release |
| `graphql` (CLI) | `scripts/demo-cli-output.sh`, CI          | [releases page](https://github.com/trevor-scheer/graphql-analyzer/releases) → `graphql-analyzer-cli` release |

All binaries are also installable via Homebrew (see graphql-analyzer's [HOMEBREW_PLAN.md](https://github.com/trevor-scheer/graphql-analyzer/blob/main/HOMEBREW_PLAN.md) once that ships).

---

## Architecture

See [`docs/2026-04-28-analyzer-testbed-design.md`](docs/2026-04-28-analyzer-testbed-design.md) for the full design spec.

---

## License

MIT
