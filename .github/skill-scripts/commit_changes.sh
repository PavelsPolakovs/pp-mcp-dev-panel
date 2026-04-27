#!/usr/bin/env bash
set -euo pipefail

# commit_changes.sh (moved copy)
# Helper implementing the Commit Changes Skill described in
# .github/skills/commit-changes-skill.md

REPO_PATH="$(pwd)"
AMEND=false
AUTO_YES=false
COMMIT_MSG=""

usage(){
  cat <<EOF
Usage: $0 [options]
Options:
  -m <message>    Use this commit message (skip suggestion)
  --amend         Amend last commit instead of creating a new one
  -y              Assume yes (auto accept generated message)
  -h              Show help
EOF
  exit 1
}

while [[ ${#} -gt 0 ]]; do
  case "$1" in
    -m) COMMIT_MSG=$2; shift 2;;
    --amend) AMEND=true; shift;;
    -y) AUTO_YES=true; shift;;
    -h) usage;;
    *) echo "Unknown arg: $1"; usage;;
  esac
done

cd "$REPO_PATH"

echo "Staging all changes..."
git add .

# Gather change stats from staged area (index)
STAGED=$(git diff --cached --name-status)
if [[ -z "$STAGED" ]]; then
  if [[ "$AMEND" == true ]]; then
    # No staged changes but user wants to amend last commit — inspect last commit files
    echo "No staged changes found; gathering files from last commit for message generation..."
    STAGED=$(git show --name-status --pretty="" HEAD)
    if [[ -z "$STAGED" ]]; then
      echo "No changes found in last commit. Nothing to commit or amend."; exit 0
    fi
  else
    echo "No staged changes to commit."; exit 0
  fi
fi

# Parse staged changes
declare -A counts
declare -A areas
# initialize expected counters to avoid unbound variable errors under set -u
counts[added]=0
counts[modified]=0
counts[deleted]=0
counts[renamed]=0
counts[copied]=0
counts[other]=0
while IFS=$'\t' read -r status path; do
  case "$status" in
    A) ((counts[added]++));;
    M) ((counts[modified]++));;
    D) ((counts[deleted]++));;
    R) ((counts[renamed]++));;
    C) ((counts[copied]++));;
    *) ((counts[other]++));;
  esac
  # determine area: top-level or special mapping
  top=$(echo "$path" | awk -F/ '{print $1}')
  case "$top" in
    .github) # further map second-level
      second=$(echo "$path" | awk -F/ '{print $2}')
      area="$second";;
    server) area="server";;
    client) area="client";;
    src) area="src";;
    README.md|package.json|Makefile) area="repo-root";;
    *) area="$top";;
  esac
  ((areas[$area]++))
done <<< "$STAGED"

# Build scope: pick top area by count
top_area=""
top_count=0
for k in "${!areas[@]}"; do
  if (( areas[$k] > top_count )); then
    top_count=${areas[$k]}
    top_area=$k
  fi
done

# Decide type
type="chore"
if [[ ${areas[prompts]:-0} -gt 0 || ${areas[docs]:-0} -gt 0 ]]; then
  type="docs"
elif [[ ${areas[server]:-0} -gt 0 || ${areas[tools]:-0} -gt 0 ]]; then
  type="chore"
elif [[ ${areas[src]:-0} -gt 0 || ${areas[client]:-0} -gt 0 ]]; then
  type="feat"
fi

# Build short summary
summary_parts=()
if (( counts[added] > 0 )); then summary_parts+=("${counts[added]} added"); fi
if (( counts[modified] > 0 )); then summary_parts+=("${counts[modified]} modified"); fi
if (( counts[deleted] > 0 )); then summary_parts+=("${counts[deleted]} deleted"); fi

summary=$(IFS=", "; echo "${summary_parts[*]}")
if [[ -z "$summary" ]]; then summary="update"; fi

SCOPE="$top_area"
if [[ -z "$SCOPE" ]]; then SCOPE="repo"; fi

# Compose suggested message
if [[ -n "$COMMIT_MSG" ]]; then
  MSG="$COMMIT_MSG"
else
  MSG="$type($SCOPE): $summary"
  # add small body listing top changed areas
  BODY="\n\nAffected areas: \n"
  for k in "${!areas[@]}"; do
    BODY+="- $k: ${areas[$k]} files\n"
  done
  MSG_FULL="$MSG$BODY"
fi

echo "Suggested commit message:"
echo "---------------------------------"
if [[ -n "$COMMIT_MSG" ]]; then
  echo "$MSG"
else
  echo -e "$MSG_FULL"
fi
echo "---------------------------------"

if [[ "$AUTO_YES" == true ]]; then
  FINAL_MSG="${COMMIT_MSG:-$MSG_FULL}"
else
  if [[ -n "${EDITOR:-}" ]]; then
    TMPFILE=$(mktemp)
    if [[ -n "$COMMIT_MSG" ]]; then
      echo "$COMMIT_MSG" > "$TMPFILE"
    else
      echo -e "$MSG_FULL" > "$TMPFILE"
    fi
    ${EDITOR} "$TMPFILE"
    FINAL_MSG=$(cat "$TMPFILE")
    rm -f "$TMPFILE"
  else
    read -r -p "Accept suggested message? [Y/n] " resp
    if [[ "$resp" == "" || "$resp" == "y" || "$resp" == "Y" ]]; then
      FINAL_MSG="${COMMIT_MSG:-$MSG_FULL}"
    else
      echo "Enter full commit message. End with EOF on a new line."
      echo "---- start typing message ----"
      FINAL_MSG=""
      while IFS= read -r line; do
        [[ $line == "EOF" ]] && break
        FINAL_MSG+="$line\n"
      done
      echo "---- message captured ----"
    fi
  fi
fi

if [[ "$AMEND" == true ]]; then
  echo "Amending last commit with message..."
  git commit --amend -m "$FINAL_MSG"
else
  echo "Committing..."
  git commit -m "$FINAL_MSG"
fi

echo "Commit complete."


