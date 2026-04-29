# Fixture: schema-cycle

## What is broken

The schema defines a non-trivial type cycle: `Region → Location → Area →
Encounter → (back through Area) → Location → Region`. This is valid per the
GraphQL spec (object types may reference each other cyclically), but it can
cause infinite recursion in naive schema traversal tools and is worth a
lint warning when the `no-type-cycles` rule (or equivalent) is enabled.

## What tool catches it

- **CLI**: `graphql-cli check fixtures/intentional-errors/schema-cycle/`
  (requires a cycle-detection lint rule to be enabled in config)
- **LSP**: The LSP should handle this schema without hanging or crashing

> **Note:** If the analyzer does not yet have a cycle-detection lint rule,
> this fixture instead validates that the toolchain handles cyclic schemas
> **without crashing** — a robustness test. The `expect-failure` CI job only
> expects a non-zero exit for fixtures with hard errors. Update this README
> and the CI config when a cycle rule ships.

## How to use as a repro

1. Copy this directory to a fresh location
2. Add a `.graphqlrc.yaml` with the cycle lint rule enabled (if available)
3. Run `graphql-cli check .`
4. If reporting a hang or crash bug, run with `RUST_LOG=debug graphql-cli check .`
   and attach the output to your issue
