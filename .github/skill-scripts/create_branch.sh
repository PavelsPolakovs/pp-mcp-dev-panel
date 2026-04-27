#!/usr/bin/env bash
set -euo pipefail

# create_branch.sh
# Helper script implementing the Create Branch Skill described in
# .github/skills/create-branch-skill.md

REPO_PATH="$(pwd)"
NEW_BRANCH=""
BASE=main
START_POINT=""
PUSH=true
SET_UPSTREAM=true
ASSUME_YES=false
DESCRIPTION=""

usage() {
  cat <<EOF
Usage: $0 -b <new-branch> [options]
Options:
  -b <new-branch>     Name of the branch to create (required)
  -B <base>           Base branch to branch from (default: main)
  -s <start-point>    Start point (commit/branch/tag) to create branch from (overrides base)
  --no-push           Don't push the new branch to origin
  --no-upstream       Don't set upstream when pushing
  -d <description>    Optional description for the branch record
  -y                  Assume yes for confirmations
  -h                  Show this help
EOF
  exit 1
}

while [[ ${#} -gt 0 ]]; do
  case "$1" in
    -b) NEW_BRANCH=$2; shift 2;;
    -B) BASE=$2; shift 2;;
    -s) START_POINT=$2; shift 2;;
    --no-push) PUSH=false; shift;;
    --no-upstream) SET_UPSTREAM=false; shift;;
    -d) DESCRIPTION=$2; shift 2;;
    -y) ASSUME_YES=true; shift;;
    -h) usage;;
    *) echo "Unknown arg: $1"; usage;;
  esac
done

if [[ -z "$NEW_BRANCH" ]]; then
  echo "Error: -b <new-branch> is required"
  usage
fi

cd "$REPO_PATH"

echo "Repository: $REPO_PATH"
echo "New branch: $NEW_BRANCH"
echo "Base: $BASE"
echo "Start point: ${START_POINT:-(none)}"
echo "Push: $PUSH"
echo "Set upstream: $SET_UPSTREAM"

# Fetch base
git fetch origin "$BASE"

# Decide start ref
if [[ -n "$START_POINT" ]]; then
  START_REF="$START_POINT"
else
  START_REF="origin/$BASE"
fi

# Check for existing local branch
if git rev-parse --verify --quiet "$NEW_BRANCH" >/dev/null; then
  echo "Local branch '$NEW_BRANCH' already exists."
  if [[ "$ASSUME_YES" != true ]]; then
    read -r -p "Use existing branch? [y/N] " resp
    if [[ "$resp" != "y" && "$resp" != "Y" ]]; then
      echo "Aborting to avoid overwriting existing branch."; exit 2
    fi
  fi
  git checkout "$NEW_BRANCH"
else
  echo "Creating branch '$NEW_BRANCH' from '$START_REF'..."
  git checkout -b "$NEW_BRANCH" "$START_REF"
fi

if [[ "$PUSH" == true ]]; then
  if [[ "$SET_UPSTREAM" == true ]]; then
    echo "Pushing and setting upstream: origin/$NEW_BRANCH"
    git push -u origin "$NEW_BRANCH"
  else
    echo "Pushing branch to origin (no upstream set)"
    git push origin "$NEW_BRANCH"
  fi
fi

# Create branch record
mkdir -p .github/branch-records
SAFE_BRANCH=$(echo "$NEW_BRANCH" | sed 's#/#-#g')
RECORD_FILE=".github/branch-records/$(date +%F)-$SAFE_BRANCH-created.md"
cat > "$RECORD_FILE" <<EOF
---
title: "Branch record: $NEW_BRANCH created"
date: "$(date --iso-8601=seconds)"
repo: "$(git remote get-url origin | sed -E 's#(git@github.com:|https://github.com/)([^/]+/[^/.]+)(.git)?#\2#')"
branch: "$NEW_BRANCH"
base: "$BASE"
start_point: "$START_REF"
pushed: $PUSH
description: "${DESCRIPTION}"
---

Branch $NEW_BRANCH created from $START_REF on $(date).

Commands executed:
```
git fetch origin $BASE
git checkout -b $NEW_BRANCH $START_REF
git push ${SET_UPSTREAM:+-u} origin $NEW_BRANCH
```

EOF

echo "Created branch record: $RECORD_FILE"
echo "Done."


