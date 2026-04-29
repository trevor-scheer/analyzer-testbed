#!/usr/bin/env bash
# demo-failing-pr.sh — Create a demo branch with a broken fixture and open a draft PR.
#
# Usage:
#   scripts/demo-failing-pr.sh <fixture-name>
#
# Creates branch demo/<fixture-name>-<timestamp>, copies the fixture's schema
# and operations into apps/web/graphql/ (where CI runs graphql-cli check),
# commits, pushes, and opens a draft PR via gh. CI goes red — that is expected.
# Idempotent: each run creates a new branch with a new timestamp.
#
# Exit codes:
#   0  — PR created (URL printed to stdout)
#   1  — usage error or gh not authenticated
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

VALID_FIXTURES=(
  missing-fragment
  unknown-directive
  deprecated-field-usage
  selection-type-mismatch
  schema-cycle
)

usage() {
  cat <<EOF
Usage: $(basename "$0") <fixture-name>

Creates a demo branch with a broken fixture, pushes it, and opens a draft PR.
CI will go red — that is the point.

WARNING: This script pushes a branch to the remote repository and creates a
GitHub PR on your account. Run scripts/cleanup-demos.sh to remove them afterwards.

Available fixtures:
$(printf '  %s\n' "${VALID_FIXTURES[@]}")

Options:
  --help    Show this help message
EOF
}

if [[ "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ $# -ne 1 ]]; then
  echo "Error: expected exactly one argument" >&2
  usage >&2
  exit 1
fi

FIXTURE_NAME="$1"
FIXTURE_DIR="$REPO_ROOT/fixtures/intentional-errors/$FIXTURE_NAME"

if [[ ! -d "$FIXTURE_DIR" ]]; then
  echo "Error: unknown fixture '$FIXTURE_NAME'" >&2
  echo "Valid fixtures: ${VALID_FIXTURES[*]}" >&2
  exit 1
fi

# Check gh authentication before doing any git work
if ! gh auth status --hostname github.com &>/dev/null; then
  echo "Error: gh is not authenticated. Run 'gh auth login' first." >&2
  exit 1
fi

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BRANCH="demo/${FIXTURE_NAME}-${TIMESTAMP}"
DEST_DIR="$REPO_ROOT/apps/web/graphql"

echo ""
echo "WARNING: This will push branch '$BRANCH' and open a draft PR on GitHub."
read -r -p "Continue? [y/N] " answer
if [[ ! "$answer" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "Creating branch: $BRANCH"
git -C "$REPO_ROOT" checkout -b "$BRANCH"

echo "Copying fixture files into apps/web/graphql/..."
cp "$FIXTURE_DIR"/*.graphql "$DEST_DIR/"

echo "Committing..."
git -C "$REPO_ROOT" add "$DEST_DIR/"
git -C "$REPO_ROOT" commit -m "demo: add $FIXTURE_NAME fixture (CI should fail)"

echo "Pushing..."
git -C "$REPO_ROOT" push -u origin "$BRANCH"

echo "Opening draft PR..."
PR_URL="$(gh pr create \
  --repo trevor-scheer/analyzer-testbed \
  --head "$BRANCH" \
  --base main \
  --draft \
  --title "Demo: $FIXTURE_NAME repro ($(date +%Y-%m-%d))" \
  --body "$(cat <<EOF
Automated demo PR created by \`scripts/demo-failing-pr.sh\`.

**Fixture:** \`fixtures/intentional-errors/$FIXTURE_NAME/\`

CI is expected to fail — this PR demonstrates the analyzer catching the
error described in [fixtures/intentional-errors/$FIXTURE_NAME/README.md](../blob/main/fixtures/intentional-errors/$FIXTURE_NAME/README.md).

To clean up this branch and PR, run:
\`\`\`
scripts/cleanup-demos.sh
\`\`\`
EOF
)")"

echo ""
echo "Draft PR created: $PR_URL"
echo "CI will report errors — that is expected."
echo ""
echo "To clean up later, run: scripts/cleanup-demos.sh"

# Return to main
git -C "$REPO_ROOT" checkout main
