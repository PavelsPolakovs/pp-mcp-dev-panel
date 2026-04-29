---
title: 'Merge Branch Skill'
id: merge-branch-skill
summary: 'Abstract, reusable skill to prepare, create and merge a pull request from a feature branch into main. Produces a merge-record artifact after successful merge.'
---

## Description

This skill codifies the merge workflow recorded in `.github/merge-records/*` and the `.github/prompts/mc.prompt.md` instruction set. It's an abstract, repeatable process you can run for any feature branch to:

- Ensure the feature branch is up to date with `main` (pull and detect conflicts)
- Push the updated branch to `origin`
- Create a GitHub Pull Request (via `gh` when available, or via the GitHub API)
- Merge the Pull Request with a chosen merge method (merge/squash/rebase)
- Optionally delete the branch and create a merge-record metadata file under `.github/merge-records/`

## Inputs / variables

- REPO_PATH: path to repository root (defaults to current working directory)
- BRANCH: source branch to merge (defaults to current git branch)
- BASE: target branch (defaults to `main`)
- MERGE_METHOD: one of `merge`, `squash`, or `rebase` (defaults to `merge`)
- DELETE_BRANCH: whether to delete the source branch after merge (true/false; default true)
- TITLE: pull request title (default: "Merge <BRANCH> into <BASE>")
- BODY: pull request body
- GITHUB_TOKEN: (optional) GitHub token used when `gh` is not available

## Behavior / Steps (abstract)

1. Move to `REPO_PATH` and detect the current branch if `BRANCH` is not provided.
2. Fetch latest `BASE` from `origin` and merge it into `BRANCH`:
   - git fetch origin <BASE>
   - git checkout <BRANCH>
   - git pull origin <BASE>
   - If conflicts are detected, stop and surface the conflicted files for manual resolution.
3. Push the updated branch to `origin`:
   - git push origin HEAD
4. Create a Pull Request targeting `<BASE>` from `<BRANCH>`.
   - Prefer using the `gh` CLI if available. If not, use the GitHub REST API with `GITHUB_TOKEN`.
   - If neither is available, open the compare URL in a browser for manual PR creation.
5. Merge the Pull Request using the chosen `MERGE_METHOD`.
   - With `gh`: `gh pr merge <url|number|branch> --<method>` (flags vary by `gh` version)
   - With API: call the merge endpoint for the PR number.
6. After merge success, optionally delete the branch and create a merge-record under `.github/merge-records/` with metadata (timestamp, PR number/URL, merge commit, author).

## Outputs / Artifacts

- A merge-record markdown file created at `.github/merge-records/<timestamp>-<branch>-merged.md` that includes:
  - repository, branch, PR URL/number, merge commit hash (short + full), timestamp, merge method, who merged it, and the commands executed.

## Safety and conflict handling

- The skill stops if merge conflicts are detected during `git pull`. Resolve conflicts manually and then re-run the skill.
- The skill never force-pushes. If a force-push is required, handle that manually.

## Examples

Run the skill locally (using the helper script provided in `.github/skill-scripts/merge_branch.sh`):

```bash
# merge current branch into main (default merge method, delete branch)
 .github/skill-scripts/merge_branch.sh

# merge a specific branch without deleting it, using squash
 .github/skill-scripts/merge_branch.sh -b feature/new -m squash --no-delete
```

## Notes

- This is an abstract skill — implementers can call the helper script, or integrate these steps into automation (CI job, bot account, GitHub Action) that has appropriate permissions.
- When integrated into CI or bots, prefer using a dedicated GitHub App or token with limited scope rather than a personal token.

If you want, I can also add a GitHub Action that invokes this skill with configurable inputs.
