# Fixture: unknown-directive

## What is broken

`operations.graphql` uses `@conection` (note the missing 'n') — a typo for the
Apollo Client `@connection` directive. The analyzer should report an unknown
directive.

## What tool catches it

- **CLI**: `graphql-cli check fixtures/intentional-errors/unknown-directive/`
- **LSP**: Open `operations.graphql` — a diagnostic underlines `@conection`

## Expected CLI output (approximate)

```
error[unknown-directive]: Unknown directive `@conection`
  --> fixtures/intentional-errors/unknown-directive/operations.graphql:2:35
   |
 2 |   pokemons(first: $first) @conection(key: "pokedex") {
   |                           ^^^^^^^^^^ did you mean `@connection`?
```

## How to use as a repro

1. Copy this directory to a fresh location
2. Add a `.graphqlrc.yaml` pointing at the schema and operations files
3. Run `graphql-cli check .`
