#!/usr/bin/env bash
# demo-mcp.sh — Print the claude invocation and suggested prompts for this repo.
#
# Usage:
#   scripts/demo-mcp.sh
#
# Prints the exact command to open this repo in Claude Code with the MCP
# server active, plus a list of suggested natural-language prompts that
# exercise the graphql-mcp tools.
#
# Exit codes:
#   0  — always
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

BOLD='\033[1m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RESET='\033[0m'

if [[ "${1:-}" == "--help" ]]; then
  cat <<EOF
Usage: $(basename "$0")

Print the Claude Code invocation and suggested prompts for this repo.
No side effects.
EOF
  exit 0
fi

echo ""
echo -e "${BOLD}GraphQL Analyzer MCP Demo${RESET}"
echo -e "${BOLD}═══════════════════════════════════════════${RESET}"
echo ""
echo -e "${CYAN}1. Open this repo in Claude Code:${RESET}"
echo ""
echo "   claude $REPO_ROOT"
echo ""
echo -e "   (The \`.mcp.json\` at the repo root registers the \`graphql\` MCP server"
echo -e "   automatically. Claude Code picks it up on startup.)"
echo ""
echo -e "${CYAN}2. Verify the MCP server is loaded:${RESET}"
echo ""
echo '   In your Claude Code session, run:'
echo '   > /mcp'
echo '   You should see "graphql" listed as a connected server.'
echo ""
echo -e "${CYAN}3. Try these prompts:${RESET}"
echo ""

PROMPTS=(
  "List all the GraphQL types defined in this project and give me a brief description of each"
  "Find every place in the codebase where the Pokemon.captureRate field is queried"
  "What operations does this project define, and which fragments does each one use?"
  "Show me all the fields on the Battle type and explain what they're for based on the schema description"
  "Are there any deprecated fields being used in the operation documents?"
  "What lint rules are enabled for the apps/web project in .graphqlrc.yaml?"
  "Find all fragment definitions and tell me which ones are unused"
  "What arguments does the pokemons query accept, and what type does it return?"
)

for prompt in "${PROMPTS[@]}"; do
  echo -e "   ${YELLOW}▸${RESET} \"$prompt\""
done

echo ""
echo -e "${BOLD}Prerequisites:${RESET}"
echo "  - graphql-mcp binary on PATH (see README for install instructions)"
echo "  - .graphqlrc.yaml at repo root (already present)"
echo ""
