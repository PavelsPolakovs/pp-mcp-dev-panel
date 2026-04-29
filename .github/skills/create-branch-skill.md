---
title: 'Create Branch Skill'
id: create-branch-skill
summary: 'Abstract, reusable skill to create a new feature branch from a base branch and optionally push it to origin. Produces a branch-record artifact after creation.'
---

## Description

This skill defines a safe, repeatable process for creating a new branch from a base branch (usually `main`) and optionally pushing it to the remote. It complements the Merge Branch Skill and is intended to be used by humans or automation when preparing work branches.

## Inputs / variables

- REPO_PATH: path to repository root (defaults to current working directory)
- NEW_BRANCH: name of the branch to create (required)
- BASE: base branch to branch from (defaults to `main`)
- START_POINT: optional commit/branch/tag to start from instead of `BASE`
- PUSH: whether to push the new branch to `origin` (true/false; default true)
- SET_UPSTREAM: whether to set upstream when pushing (true/false; default true)
- DESCRIPTION: optional description for the branch record

## Behavior / Steps (abstract)

1. Move to `REPO_PATH` and validate repository state.
2. Fetch the `BASE` from `origin`.
3. Create the new branch from `START_POINT` if provided, otherwise from `BASE`:
   - `git fetch origin <BASE>`
   - `git checkout -b <NEW_BRANCH> <START_POINT|origin/BASE>`
4. If `PUSH` is true, push the branch:
   - `git push -u origin <NEW_BRANCH>` (if `SET_UPSTREAM`)
   - otherwise `git push origin <NEW_BRANCH>`
5. Create a branch-record artifact at `.github/branch-records/<date>-<new-branch>-created.md` with metadata: repo, branch, base, start point, pushed, timestamp, and commands executed.

## Outputs / Artifacts

- A branch-record markdown file created at `.github/branch-records/<timestamp>-<branch>-created.md` containing metadata for traceability.

## Safety

- The skill will refuse to overwrite an existing local branch of the same name unless the implementer confirms.
- It does not force-push or delete branches.

## Examples

Create a branch from `main` and push it to origin:

```bash
.github/skill-scripts/create_branch.sh -b feature/new-feature
```

Create a branch from a specific start point without pushing:

```bash
.github/skill-scripts/create_branch.sh -b feature/experiment -B main -s release/v1.2 --no-push
```

## Notes

- Implementers can wrap this skill into automation or call the helper script directly.
- Prefer descriptive branch names and document the purpose in the branch record.
