---
name: git-ops
description: Work with GitHub (gh CLI) or GitLab (glab CLI) repos using .claude/credentials.json
allowed-tools:
  - Bash
  - Read
---

# Git Repository Operations

## Setup (run before every operation)

```bash
# 1. Check credentials file
[ ! -f .claude/credentials.json ] && echo "ERROR: .claude/credentials.json not found." && exit 1

# 2. jq is always required
MISSING=""
command -v jq &>/dev/null || MISSING="$MISSING\n  - jq       https://stedolan.github.io/jq/"

if [ -n "$MISSING" ]; then
  echo -e "ERROR: Required tools are not installed:$MISSING"
  exit 1
fi

# 3. Detect platform, then check platform CLI
REPO_URL=$(jq -r '.git.url' .claude/credentials.json)
TOKEN=$(jq -r '.git.token' .claude/credentials.json)
REPO_PATH=$(echo "$REPO_URL" | sed 's|https://[^/]*/||')

if echo "$REPO_URL" | grep -q "github.com"; then
  PLATFORM="github"
  command -v gh &>/dev/null || { echo "ERROR: Required tool is not installed:\n  - gh       https://cli.github.com/"; exit 1; }
  export GH_TOKEN="$TOKEN"
else
  PLATFORM="gitlab"
  command -v glab &>/dev/null || { echo "ERROR: Required tool is not installed:\n  - glab     https://gitlab.com/gitlab-org/cli"; exit 1; }
  HOST=$(echo "$REPO_URL" | sed 's|https://||' | cut -d'/' -f1)
  export GITLAB_TOKEN="$TOKEN"
  export GITLAB_HOST="$HOST"
fi
```

## Operations

| Action        | GitHub (`gh`)                                                                         | GitLab (`glab`)                              |
| ------------- | ------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Issues**    |                                                                                       |                                              |
| Create        | `gh issue create`                                                                     | `glab issue create`                          |
| List          | `gh issue list`                                                                       | `glab issue list`                            |
| View          | `gh issue view <n>`                                                                   | `glab issue view <n>`                        |
| Add label     | `gh issue edit <n> --add-label <label>`                                               | `glab issue update <n> --label <label>`      |
| Assign        | `gh issue edit <n> --add-assignee <user>`                                             | `glab issue update <n> --assignee <user>`    |
| Set milestone | `gh issue edit <n> --milestone <name>`                                                | `glab issue update <n> --milestone <id>`     |
| Comment       | `gh issue comment <n> -b "<text>"`                                                    | `glab issue note <n> -m "<text>"`            |
| Close         | `gh issue close <n>`                                                                  | `glab issue close <n>`                       |
| Reopen        | `gh issue reopen <n>`                                                                 | `glab issue reopen <n>`                      |
| **PR / MR**   |                                                                                       |                                              |
| Create        | `gh pr create`                                                                        | `glab mr create`                             |
| List          | `gh pr list`                                                                          | `glab mr list`                               |
| View          | `gh pr view <n>`                                                                      | `glab mr view <n>`                           |
| Comment       | `gh pr comment <n> -b "<text>"`                                                       | `glab mr note <n> -m "<text>"`               |
| Approve       | `gh pr review <n> --approve`                                                          | `glab mr approve <n>`                        |
| Merge         | `gh pr merge <n>`                                                                     | `glab mr merge <n>`                          |
| Close         | `gh pr close <n>`                                                                     | `glab mr close <n>`                          |
| **Branches**  |                                                                                       |                                              |
| Create        | `gh api -X POST /repos/$REPO_PATH/git/refs -f ref="refs/heads/<name>" -f sha="<sha>"` | `glab repo branch create <name> --ref <ref>` |
| List          | `gh api /repos/$REPO_PATH/branches`                                                   | `glab repo branch list`                      |
| Delete        | `gh api -X DELETE /repos/$REPO_PATH/git/refs/heads/<name>`                            | `glab repo branch delete <name>`             |

## Notes

- Always run Setup block first.
- Stop and notify the user if `credentials.json` is missing or the token is invalid.
- `credentials.json` must be listed in `.gitignore`.
