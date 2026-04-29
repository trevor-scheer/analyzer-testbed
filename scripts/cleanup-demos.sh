#!/usr/bin/env bash
# cleanup-demos.sh — List and optionally delete demo/* branches and their PRs.
#
# Usage:
#   scripts/cleanup-demos.sh [--yes]
#
# Without --yes: lists demo/* branches and open PRs, prompts before each deletion.
# With --yes: deletes all without prompting (useful in CI cleanup).
#
# Exit codes:
#   0  — completed (even if nothing to clean up)
#   1  — usage error or gh not authenticated
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

YES=false

usage() {
  cat <<EOF
Usage: $(basename "$0") [--yes]

List and optionally close/delete all demo/* branches and their open PRs.

Without --yes, you are prompted before each deletion.

Options:
  --yes     Delete all without prompting
  --help    Show this help message
EOF
}

for arg in "$@"; do
  case "$arg" in
    --yes) YES=true ;;
    --help) usage; exit 0 ;;
    *) echo "Error: unknown argument '$arg'" >&2; usage >&2; exit 1 ;;
  esac
done

# Check gh authentication
if ! gh auth status --hostname github.com &>/dev/null; then
  echo "Error: gh is not authenticated. Run 'gh auth login' first." >&2
  exit 1
fi

echo "Fetching demo/* branches from remote..."
git -C "$REPO_ROOT" fetch --prune origin 2>/dev/null || true

DEMO_BRANCHES="$(git -C "$REPO_ROOT" branch -r --list 'origin/demo/*' | sed 's|origin/||' | tr -d ' ')"

if [[ -z "$DEMO_BRANCHES" ]]; then
  echo "No demo/* branches found."
  exit 0
fi

echo ""
echo "Found demo/* branches:"
echo "$DEMO_BRANCHES" | while IFS= read -r branch; do
  echo "  $branch"
done
echo ""

confirm() {
  local prompt="$1"
  if [[ "$YES" == "true" ]]; then
    return 0
  fi
  read -r -p "$prompt [y/N] " answer
  [[ "$answer" =~ ^[Yy]$ ]]
}

echo "$DEMO_BRANCHES" | while IFS= read -r branch; do
  [[ -z "$branch" ]] && continue

  # Find open PR for this branch
  PR_NUM="$(gh pr list \
    --repo trevor-scheer/analyzer-testbed \
    --head "$branch" \
    --state open \
    --json number \
    --jq '.[0].number // empty' 2>/dev/null || true)"

  echo "Branch: $branch"
  if [[ -n "$PR_NUM" ]]; then
    echo "  Open PR: #$PR_NUM"
    if confirm "  Close PR #$PR_NUM and delete branch $branch?"; then
      gh pr close "$PR_NUM" \
        --repo trevor-scheer/analyzer-testbed \
        --delete-branch 2>/dev/null || true
      # Also delete the remote branch in case --delete-branch didn't work
      git -C "$REPO_ROOT" push origin --delete "$branch" 2>/dev/null || true
      # Delete local branch if it exists
      git -C "$REPO_ROOT" branch -D "$branch" 2>/dev/null || true
      echo "  Cleaned up."
    else
      echo "  Skipped."
    fi
  else
    if confirm "  Delete branch $branch (no open PR)?"; then
      git -C "$REPO_ROOT" push origin --delete "$branch" 2>/dev/null || true
      git -C "$REPO_ROOT" branch -D "$branch" 2>/dev/null || true
      echo "  Deleted."
    else
      echo "  Skipped."
    fi
  fi
  echo ""
done
