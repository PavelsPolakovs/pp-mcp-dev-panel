#!/usr/bin/env bash
set -euo pipefail

# push_changes.sh
# Helper script implementing the Push Changes Skill described in
# .github/prompts/pc.prompt.md

REPO_PATH="$(pwd)"
BRANCH=""
SET_UPSTREAM=false
FORCE=false
PUSH_TAGS=false
ASSUME_YES=false
DRY_RUN=false

usage() {
  cat <<EOF
Usage: $0 [options]
Options:
  -b <branch>       Branch to push (defaults to current branch)
  --upstream        Set upstream (-u) when pushing
  --force           Force push
  --tags            Push tags as well
  --dry-run         Do a dry-run (git push --dry-run)
  -y                Assume yes for confirmations
  -h                Show this help
EOF
  exit 1
}

while [[ ${#} -gt 0 ]]; do
  case "$1" in
    -b) BRANCH=$2; shift 2;;
    --upstream) SET_UPSTREAM=true; shift;;
    --force) FORCE=true; shift;;
    --tags) PUSH_TAGS=true; shift;;
    --dry-run) DRY_RUN=true; shift;;
    -y) ASSUME_YES=true; shift;;
    -h) usage;;
    *) echo "Unknown arg: $1"; usage;;
  esac
done

cd "$REPO_PATH"

if [[ -z "$BRANCH" ]]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

if [[ -z "$BRANCH" || "$BRANCH" == "HEAD" ]]; then
  echo "Could not determine current branch. Please supply -b <branch>"; exit 2
fi

echo "Repository: $REPO_PATH"
echo "Branch to push: $BRANCH"
echo "Set upstream: $SET_UPSTREAM"
echo "Force: $FORCE"
echo "Push tags: $PUSH_TAGS"
echo "Dry run: $DRY_RUN"

if [[ "$ASSUME_YES" != true ]]; then
  read -r -p "Proceed with push? [y/N] " resp
  if [[ "$resp" != "y" && "$resp" != "Y" ]]; then
    echo "Aborting."; exit 0
  fi
fi

# Build git push command
PUSH_CMD=(git push)
if [[ "$DRY_RUN" == true ]]; then
  PUSH_CMD+=(--dry-run)
fi

if [[ "$SET_UPSTREAM" == true ]]; then
  PUSH_CMD+=(-u)
fi

if [[ "$FORCE" == true ]]; then
  PUSH_CMD+=(--force)
fi

PUSH_CMD+=(origin "$BRANCH")

echo "Running: ${PUSH_CMD[*]}"
"${PUSH_CMD[@]}"

if [[ "$PUSH_TAGS" == true && "$DRY_RUN" != true ]]; then
  echo "Pushing tags..."
  git push origin --tags
fi

# Build a push record
REMOTE_URL=$(git remote get-url origin 2>/dev/null || true)
OWNER_REPO="$(echo "$REMOTE_URL" | sed -E 's#(git@github.com:|https://github.com/)([^/]+/[^/.]+)(.git)?#\2#' || true)"
OWNER="$(echo "$OWNER_REPO" | cut -d/ -f1 || true)"
REPO="$(echo "$OWNER_REPO" | cut -d/ -f2 || true)"

SAFE_BRANCH=$(echo "$BRANCH" | sed 's#/#-#g')
RECORD_DIR=".github/push-records"
mkdir -p "$RECORD_DIR"
RECORD_FILE="$RECORD_DIR/$(date +%F)-$SAFE_BRANCH-pushed.md"

cat > "$RECORD_FILE" <<EOF
---
title: "Push record: $BRANCH"
date: "$(date --iso-8601=seconds)"
repo: "$OWNER_REPO"
branch: "$BRANCH"
remote_url: "$REMOTE_URL"
force: $FORCE
upstream: $SET_UPSTREAM
tags_pushed: $PUSH_TAGS
dry_run: $DRY_RUN
---

Push command executed:

```
${PUSH_CMD[*]}
```

EOF

echo "Created push record: $RECORD_FILE"

if [[ -n "$OWNER_REPO" ]]; then
  COMPARE_URL="https://github.com/$OWNER_REPO/compare/$BRANCH?expand=1"
  echo "Open this URL to create a PR (if needed): $COMPARE_URL"
fi

echo "Done."


