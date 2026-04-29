#!/usr/bin/env bash
# demo-lsp.sh — Open VS Code at the LSP demo target for a given feature.
#
# Usage:
#   scripts/demo-lsp.sh <feature>
#
# Features: hover, goto-def, find-refs, diagnostic, completion
#
# Each target is a file:line where a comment explains what to click/invoke.
# Requires VS Code (code) to be on PATH.
#
# Exit codes:
#   0  — VS Code opened successfully
#   1  — usage error or VS Code not found
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

VALID_FEATURES=("hover" "goto-def" "find-refs" "diagnostic" "completion")

# Resolve feature → "relative/path/to/file:line"
# Each target file has a nearby comment explaining the demo action.
get_target() {
  case "$1" in
    # Hover over captureRate (a @deprecated field) to see the deprecation reason
    hover)      echo "apps/web/graphql/fragments/PokemonDetail.graphql:10" ;;
    # Spread of PokemonDetail defined in a separate file — goto-def jumps to it
    goto-def)   echo "apps/web/graphql/operations/PokemonDetail.graphql:4" ;;
    # PokemonCard fragment definition spread in multiple files — find-refs shows all usages
    find-refs)  echo "apps/web/graphql/fragments/PokemonCard.graphql:2" ;;
    # captureRate is deprecated — this field is underlined; hover to see the warning
    diagnostic) echo "apps/web/graphql/fragments/PokemonDetail.graphql:10" ;;
    # Incomplete selection — place cursor inside the braces and press Ctrl+Space
    completion) echo "apps/web/graphql/operations/PokemonDetail.graphql:2" ;;
    *) echo "" ;;
  esac
}

usage() {
  cat <<EOF
Usage: $(basename "$0") <feature>

Open VS Code at a demo target for the given LSP feature.
Each target file has a comment explaining what to click or invoke.

Available features:
$(printf '  %s\n' "${VALID_FEATURES[@]}")

Options:
  --help    Show this help message

Prerequisites:
  - VS Code with the GraphQL Analyzer extension installed
  - graphql-lsp binary on PATH (see README for install instructions)
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

FEATURE="$1"

TARGET="$(get_target "$FEATURE")"

if [[ -z "$TARGET" ]]; then
  echo "Error: unknown feature '$FEATURE'" >&2
  echo "Valid features: ${VALID_FEATURES[*]}" >&2
  exit 1
fi

if ! command -v code &>/dev/null; then
  echo "Error: 'code' not found on PATH." >&2
  echo "Install VS Code and enable the shell command via:" >&2
  echo "  Command Palette → Shell Command: Install 'code' command in PATH" >&2
  exit 1
fi

FILE="${TARGET%%:*}"
LINE="${TARGET##*:}"
FULL_PATH="$REPO_ROOT/$FILE"

if [[ ! -f "$FULL_PATH" ]]; then
  echo "Error: target file not found: $FULL_PATH" >&2
  exit 1
fi

echo "Opening VS Code at $FILE:$LINE for feature: $FEATURE"
echo ""

case "$FEATURE" in
  hover)
    echo "Hover your cursor over 'captureRate' to see the deprecation reason and type info."
    ;;
  goto-def)
    echo "Place cursor on '...PokemonDetail' and press F12 (or right-click → Go to Definition)."
    ;;
  find-refs)
    echo "Place cursor on 'PokemonCard' and press Shift+F12 (or right-click → Find All References)."
    ;;
  diagnostic)
    echo "Observe the underlined 'captureRate' field. Hover to see the deprecation warning."
    echo "Also check the Problems panel (View → Problems) to see all diagnostics."
    ;;
  completion)
    echo "Place cursor inside the 'pokemon(id: \$id) {' block and press Ctrl+Space to trigger field completion."
    ;;
esac

code --goto "$FULL_PATH:$LINE" "$REPO_ROOT"
