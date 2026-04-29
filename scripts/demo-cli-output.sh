#!/usr/bin/env bash
# demo-cli-output.sh — Run `graphql validate` against one or all fixtures with colored headers.
#
# Usage:
#   scripts/demo-cli-output.sh [fixture-name]
#
# If fixture-name is omitted, runs against all five fixtures.
# No git side effects. Exits 0 always (this is a demo, not a CI assertion).
#
# Exit codes:
#   0  — script completed (individual fixture runs may fail; that is expected)
#   1  — bad usage
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

ALL_FIXTURES=(
  fixture-missing-fragment
  fixture-unknown-directive
  fixture-deprecated-field-usage
  fixture-selection-type-mismatch
  fixture-schema-cycle
)

usage() {
  cat <<EOF
Usage: $(basename "$0") [fixture-name]

Run graphql validate against one or all intentional-error fixtures.

Available fixtures:
$(printf '  %s\n' "${ALL_FIXTURES[@]}")

Options:
  --help    Show this help message
EOF
}

if [[ "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

run_fixture() {
  local fixture="$1"
  echo ""
  echo -e "${CYAN}${BOLD}═══════════════════════════════════════════${RESET}"
  echo -e "${CYAN}${BOLD}  Fixture: ${fixture}${RESET}"
  echo -e "${CYAN}${BOLD}═══════════════════════════════════════════${RESET}"
  echo ""
  cd "$REPO_ROOT"
  if graphql validate --project "$fixture"; then
    echo -e "${GREEN}(no errors reported — fixture may need updating)${RESET}"
  else
    echo -e "${RED}(errors above — this is expected)${RESET}"
  fi
}

if [[ $# -eq 0 ]]; then
  for fixture in "${ALL_FIXTURES[@]}"; do
    run_fixture "$fixture"
  done
elif [[ $# -eq 1 ]]; then
  run_fixture "$1"
else
  echo "Error: too many arguments" >&2
  usage >&2
  exit 1
fi

echo ""
echo -e "${BOLD}Done.${RESET}"
