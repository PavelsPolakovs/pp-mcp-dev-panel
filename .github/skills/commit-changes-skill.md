---
title: "Commit Changes Skill"
id: commit-changes-skill
summary: "Abstract, reusable skill to stage and commit repository changes with a descriptive, structured commit message."
---

Description
-----------
This skill describes a safe, repeatable process for staging and committing changes with a descriptive commit message. It is intended to replace generic messages like `chore: commit all local changes` with a message that summarizes the intent, scope and affected areas.

Inputs / variables
------------------
- REPO_PATH: repository root (defaults to current working directory)
- COMMIT_MESSAGE: optional full commit message to use (if provided, skill will use it)
- AMEND: whether to amend the last commit instead of creating a new one (true/false)
- AUTO_YES: assume yes for confirmations and use generated message without prompting

Behavior / Steps (abstract)
---------------------------
1. Move to `REPO_PATH`.
2. Stage changes: `git add .` (skill may optionally allow selective staging).
3. Build a suggested commit message using heuristics:
   - Inspect changed files to determine primary areas (e.g. `prompts`, `skills`, `server/tools`, `src`).
   - Choose a conventional commit type (`feat`, `fix`, `docs`, `chore`, `test`, etc.) based on file areas.
   - Compose a short summary and an optional body that lists key files or counts.
4. Show the suggested message for review (or open in editor). If `AUTO_YES` is true, proceed without prompting.
5. Commit using `git commit -m "<message>"` or `git commit --amend -m "<message>"` when `AMEND` is true.

Outputs / Artifacts
-------------------
- A git commit with a descriptive message. The skill may also write a small log entry under `.github/commit-records/` if desired.

Safety
------
- The skill will not perform force-pushes. If the amended commit has already been pushed, the user must handle remote force-pushes.

Examples
--------
Stage all changes and commit with an auto-generated message (prompt to edit):

```bash
server/tools/commit_changes.sh
```

Automatically generate and amend the last commit without prompting (use with care):

```bash
server/tools/commit_changes.sh --amend -y
```

Notes
-----
- This is an abstract skill. The companion helper script `server/tools/commit_changes.sh` implements the heuristics and interactive flow.

