# Fixture: selection-type-mismatch

## What is broken

`operations.graphql` queries `move(id: $id)` which returns a `Move` type, but
the selection set includes `number` and `types` — fields that exist on
`Pokemon`, not `Move`. These are "field does not exist" errors.

## What tool catches it

- **CLI**: `graphql-cli check fixtures/intentional-errors/selection-type-mismatch/`
- **LSP**: Open `operations.graphql` — `number` and `types` are underlined

## Expected CLI output (approximate)

```
error[unknown-field]: Field `number` does not exist on type `Move`
  --> fixtures/intentional-errors/selection-type-mismatch/operations.graphql:5:5

error[unknown-field]: Field `types` does not exist on type `Move`
  --> fixtures/intentional-errors/selection-type-mismatch/operations.graphql:6:5
```

## How to use as a repro

1. Copy this directory to a fresh location
2. Add a `.graphqlrc.yaml` pointing at the schema and operations files
3. Run `graphql-cli check .`
