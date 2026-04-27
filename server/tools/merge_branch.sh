#!/usr/bin/env bash
set -euo pipefail

# merge_branch.sh
# Helper script implementing the "Merge Branch Skill" described in
# .github/skills/merge-branch-skill.md
#
# Usage:
#   merge_branch.sh [-b branch] [-B base] [-m method] [-t title] [-d|--no-delete] [-y]
#
# Examples:
#   ./server/tools/merge_branch.sh -b feature/foo
#   ./server/tools/merge_branch.sh --no-delete -m squash

REPO_PATH="$(pwd)"
BRANCH=""
BASE=main
MERGE_METHOD=merge
DELETE_BRANCH=true
PR_TITLE=""
PR_BODY="Auto-created PR by merge_branch.sh"
ASSUME_YES=false

usage() {
  cat <<EOF
Usage: $0 [options]
Options:
  -b <branch>        Source branch (defaults to current branch)
  -B <base>          Base branch (default: main)
  -m <method>        Merge method: merge|squash|rebase (default: merge)
  --no-delete        Don't delete the source branch after merging
  -t <title>         PR title (default: "Merge <branch> into <base>")
  -c <body>          PR body
  -y                 Assume yes for destructive actions
  -h                 Show this help
EOF
  exit 1
}

while [[ ${#} -gt 0 ]]; do
  case "$1" in
    -b) BRANCH=$2; shift 2;;
    -B) BASE=$2; shift 2;;
    -m) MERGE_METHOD=$2; shift 2;;
    --no-delete) DELETE_BRANCH=false; shift;;
    -t) PR_TITLE=$2; shift 2;;
    -c) PR_BODY=$2; shift 2;;
    -y) ASSUME_YES=true; shift;;
    -h) usage;;
    *) echo "Unknown arg: $1"; usage;;
  esac
done

cd "$REPO_PATH"

if [[ -z "$BRANCH" ]]; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
fi

if [[ -z "$PR_TITLE" ]]; then
  PR_TITLE="Merge $BRANCH into $BASE"
fi

echo "Repository: $REPO_PATH"
echo "Branch: $BRANCH"
echo "Base: $BASE"
echo "Merge method: $MERGE_METHOD"
echo "Delete branch after merge: $DELETE_BRANCH"

# Fetch base and ensure branch exists locally
git fetch origin "$BASE"
if ! git rev-parse --verify --quiet "$BRANCH" >/dev/null; then
  echo "Branch $BRANCH not found locally. Attempting to fetch from origin..."
  git fetch origin "$BRANCH":"$BRANCH"
fi

git checkout "$BRANCH"

echo "Pulling $BASE into $BRANCH to ensure branch is up to date..."
if ! git pull origin "$BASE"; then
  echo "Merge/pull reported non-zero exit — possible conflicts."
  CONFLICTS=$(git diff --name-only --diff-filter=U || true)
  if [[ -n "$CONFLICTS" ]]; then
    echo "Merge conflicts detected in the following files:";
    echo "$CONFLICTS";
    echo "Resolve conflicts, git add the files and run 'git commit' (or 'git rebase --continue' if using rebase)."
    exit 2
  else
    echo "Pull failed for unknown reason. Inspect git status.";
    git status
    exit 3
  fi
fi

echo "No conflicts detected. Pushing branch to origin..."
git push origin HEAD

# Determine owner/repo
REMOTE_URL=$(git remote get-url origin)
OWNER_REPO="$(echo "$REMOTE_URL" | sed -E 's#(git@github.com:|https://github.com/)([^/]+/[^/.]+)(.git)?#\2#')"
OWNER="$(echo "$OWNER_REPO" | cut -d/ -f1)"
REPO="$(echo "$OWNER_REPO" | cut -d/ -f2)"

echo "Detected remote: $OWNER/$REPO"

# Helper: create PR using gh or API
create_pr() {
  if command -v gh >/dev/null 2>&1; then
    echo "Creating PR with gh..."
    # older gh may print URL only; capture output
    OUT=$(gh pr create --base "$BASE" --head "$BRANCH" --title "$PR_TITLE" --body "$PR_BODY" 2>&1) || true
    echo "$OUT"
    PR_URL=$(echo "$OUT" | grep -Eo 'https://github.com/[^ ]+' | head -n1 || true)
    if [[ -z "$PR_URL" ]]; then
      echo "Failed to parse PR URL from gh output. Attempting to list PRs to find matching head..."
      PR_URL=$(gh pr list --head "$OWNER:$BRANCH" --base "$BASE" --limit 1 --json url -q '.[0].url' 2>/dev/null || true)
    fi
    echo "PR URL: $PR_URL"
  elif [[ -n "${GITHUB_TOKEN:-}" ]]; then
    echo "Creating PR via GitHub API..."
    RESP=$(curl -s -H "Authorization: token $GITHUB_TOKEN" -X POST "https://api.github.com/repos/$OWNER/$REPO/pulls" -d @- <<EOF
{"title":"$PR_TITLE","head":"$BRANCH","base":"$BASE","body":"$PR_BODY"}
EOF
)
    PR_URL=$(echo "$RESP" | sed -n 's/.*"html_url": *"\([^"]*\)".*/\1/p' || true)
    PR_NUMBER=$(echo "$RESP" | sed -n 's/.*"number": *\([0-9]*\).*/\1/p' || true)
    echo "API response PR URL: $PR_URL (number: $PR_NUMBER)"
  else
    echo "No gh and no GITHUB_TOKEN — opening browser for manual PR creation..."
    COMPARE_URL="https://github.com/$OWNER/$REPO/compare/$BASE...$BRANCH?expand=1"
    echo "Open this URL to create PR: $COMPARE_URL"
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "$COMPARE_URL" || true
    fi
    return 1
  fi
  return 0
}

create_pr
if [[ $? -ne 0 ]]; then
  echo "PR creation deferred to manual step. Exiting."
  exit 4
fi

# If we don't have PR_NUMBER but have PR_URL, try to extract PR_NUMBER
if [[ -z "${PR_NUMBER:-}" && -n "${PR_URL:-}" ]]; then
  PR_NUMBER=$(echo "$PR_URL" | sed -E 's#.*/pull/([0-9]+).*#\1#' || true)
fi

echo "PR number: ${PR_NUMBER:-unknown}"

# Merge PR
merge_pr() {
  if command -v gh >/dev/null 2>&1 && [[ -n "${PR_URL:-}" ]]; then
    echo "Merging PR with gh..."
    # choose method flag
    case "$MERGE_METHOD" in
      merge) METHOD_FLAG="--merge";;
      squash) METHOD_FLAG="--squash";;
      rebase) METHOD_FLAG="--rebase";;
      *) METHOD_FLAG="--merge";;
    esac
    # gh versions differ in flags; try the flag, fallback to explicit command
    gh pr merge "$PR_URL" $METHOD_FLAG --delete-branch 2>&1 || gh pr merge "$PR_URL" $METHOD_FLAG 2>&1
    return $?
  elif [[ -n "${GITHUB_TOKEN:-}" && -n "${PR_NUMBER:-}" ]]; then
    echo "Merging PR via GitHub API..."
    MERGE_RESP=$(curl -s -o /dev/stderr -w "%{http_code}" -H "Authorization: token $GITHUB_TOKEN" -X PUT "https://api.github.com/repos/$OWNER/$REPO/pulls/$PR_NUMBER/merge" -d "{\"commit_title\":\"Merge PR $PR_NUMBER\",\"merge_method\":\"$MERGE_METHOD\"}")
    if [[ "$MERGE_RESP" == "200" || "$MERGE_RESP" == "201" ]]; then
      echo "PR merged via API."
      return 0
    else
      echo "API merge failed (HTTP $MERGE_RESP)."
      return 2
    fi
  else
    echo "No method available to merge PR programmatically. Please merge it manually: $PR_URL"
    return 3
  fi
}

merge_pr
RET=$?
if [[ $RET -ne 0 ]]; then
  echo "Merge failed or deferred (code $RET). Exiting with non-zero status."
  exit $RET
fi

echo "PR merged successfully. Fetching merge commit and creating merge-record..."
git fetch origin "$BASE"
git checkout "$BASE"
git pull origin "$BASE"

# Find the most recent merge commit referencing the PR (best-effort)
MERGE_COMMIT_FULL=$(git log --grep="Merge pull request #${PR_NUMBER:-}" -n 1 --pretty=format:%H 2>/dev/null || true)
if [[ -z "$MERGE_COMMIT_FULL" ]]; then
  MERGE_COMMIT_FULL=$(git rev-parse --short=40 HEAD || true)
fi
MERGE_COMMIT_SHORT=$(echo "$MERGE_COMMIT_FULL" | cut -c1-7)

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SAFE_BRANCH=$(echo "$BRANCH" | sed 's#/#-#g')
RECORD_DIR=".github/merge-records"
mkdir -p "$RECORD_DIR"
RECORD_FILE="$RECORD_DIR/$(date +%F)-$SAFE_BRANCH-merged.md"

cat > "$RECORD_FILE" <<EOF
---
title: "Merge record: $BRANCH → $BASE"
date: "$(date --iso-8601=seconds)"
repo: "$OWNER/$REPO"
branch: "$BRANCH"
pr_number: ${PR_NUMBER:-null}
pr_url: "${PR_URL:-}"
merged_by: "programmatic"
merge_method: "$MERGE_METHOD"
merge_commit_full: "$MERGE_COMMIT_FULL"
merge_commit_short: "$MERGE_COMMIT_SHORT"
---

# Merge record

Summary: programmatic merge performed by server/tools/merge_branch.sh

Commands executed:
```
git fetch origin $BASE
git checkout $BRANCH
git pull origin $BASE
git push origin HEAD
# PR creation: $PR_URL
# PR merge: method=$MERGE_METHOD
```

EOF

echo "Created merge record: $RECORD_FILE"

if [[ "$DELETE_BRANCH" == true && -n "${PR_NUMBER:-}" ]]; then
  echo "Deleting branch on remote and locally..."
  git push origin --delete "$BRANCH" || true
  git branch -D "$BRANCH" || true
fi

echo "Done."

