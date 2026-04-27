---
mode: 'agent'
description: 'Merge changes using the abstract Merge Branch Skill'
---

Use the abstract Merge Branch Skill defined in `.github/skills/merge-branch-skill.md` to perform the merge flow.

Recommended (automated) workflow:

1. Prepare the pull request for merging:
   - Ensure the feature branch is up to date with the base branch (default `main`). The skill will run the equivalent of:
     - `git fetch origin main`
     - `git checkout <branch>`
     - `git pull origin main`
   - If merge conflicts occur, the skill will stop and list conflicted files for manual resolution.
2. Create the pull request on GitHub:
   - The skill prefers the `gh` CLI; if `gh` is not available it will use the GitHub API when `GITHUB_TOKEN` is set, otherwise it opens the compare URL for manual creation.
3. Merge the pull request:
   - The skill supports `merge`, `squash`, and `rebase` strategies. By default it will perform a `merge` and optionally delete the source branch.

How to run (examples):

Run the bundled helper script which implements the skill:

```bash
cd /home/polakovs/PhpstormProjects/pp-mcp-dev-panel
./server/tools/merge_branch.sh            # merge current branch into main (default)
./server/tools/merge_branch.sh -b feature/foo -m squash --no-delete
```

See `.github/skills/merge-branch-skill.md` for the abstract specification and `server/tools/merge_branch.sh` for a runnable implementation.
