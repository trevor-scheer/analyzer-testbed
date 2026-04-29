# Fixture: deprecated-field-usage

## What is broken

`operations.graphql` selects `captureRate`, which is marked `@deprecated` in
the schema with the reason "Use `encounterRate` instead".

## What tool catches it

- **CLI**: `graphql-cli check fixtures/intentional-errors/deprecated-field-usage/`
  (requires the `no-deprecated` lint rule to be enabled)
- **LSP**: Open `operations.graphql` — `captureRate` is underlined with a
  deprecation warning and the reason shown on hover
- **ESLint**: `@graphql-analyzer/eslint-plugin` surfaces the deprecation warning

## Expected CLI output (approximate)

```
warning[no-deprecated]: Field `Pokemon.captureRate` is deprecated
  --> fixtures/intentional-errors/deprecated-field-usage/operations.graphql:5:5
   |
 5 |     captureRate
   |     ^^^^^^^^^^^ deprecated: Use `encounterRate` instead
```

## How to use as a repro

1. Copy this directory to a fresh location
2. Add a `.graphqlrc.yaml` with `lint: rules: no-deprecated: error`
3. Run `graphql-cli check .`
