# Fixture: missing-fragment

## What is broken

`operations.graphql` spreads `...PokemonCardFragment`, but that fragment is never
defined anywhere in the project. The analyzer should report an unknown fragment
spread.

## What tool catches it

- **CLI**: `graphql-cli check fixtures/intentional-errors/missing-fragment/`
- **LSP**: Open `operations.graphql` — a diagnostic underlines `...PokemonCardFragment`
- **ESLint**: The `@graphql-analyzer/eslint-plugin` reports this in the lint pass

## Expected CLI output (approximate)

```
error[unknown-fragment]: Unknown fragment `PokemonCardFragment`
  --> fixtures/intentional-errors/missing-fragment/operations.graphql:3:5
   |
 3 |     ...PokemonCardFragment
   |     ^^^^^^^^^^^^^^^^^^^^^^ fragment not defined
```

## How to use as a repro

1. Copy this directory to a fresh location
2. Add a `.graphqlrc.yaml` pointing `schema` at `schema.graphql` and `documents` at `operations.graphql`
3. Run `graphql-cli check .`
