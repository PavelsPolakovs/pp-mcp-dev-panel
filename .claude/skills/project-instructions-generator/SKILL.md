---
name: project-instructions-generator
description: Use this skill whenever the user wants to generate, create, or update claude.ai Project Instructions based on an existing codebase. Triggers when the user mentions "project instructions", "generate context for Claude", "create project prompt", "update project instructions", or asks Claude to analyze a repository and produce a context snapshot for a claude.ai Project. This skill is designed to run inside Claude Code with full local access to the repository files.
---

# Project Instructions Generator

This skill generates `.claude/project-instructions.md` — a context snapshot to be pasted into the **Project Instructions** field of a claude.ai Project. It is based on real analysis of the codebase and is intended exclusively for claude.ai. Claude Code always works directly with the actual source files and does not use this file as instructions.

---

## When to use

- User wants to set up a claude.ai Project for a specific repository
- User wants to generate or update Project Instructions after changes in the project
- Always run from Claude Code with local access to the codebase

---

## Storage

Project Instructions are stored in the repository under `.claude/`:

```
.claude/
  project-instructions.md   ← snapshot for claude.ai only, NOT for Claude Code
```

On first run, create the folder if it doesn't exist:

```bash
mkdir -p .claude
```

**Important:** `.claude/project-instructions.md` is a metadata file for claude.ai only. Claude Code ignores it and always works directly with the real source files.

If the repository has a `CLAUDE.md` — check whether it already has a section about `.claude/`. If not, append this block:

```markdown
## .claude/ folder

The `.claude/` folder stores metadata for claude.ai Projects — it is NOT instructions for Claude Code.

- `.claude/project-instructions.md` — context snapshot for pasting into claude.ai Project Instructions. Claude Code ignores this file and always works directly with the real source files.
```

---

## Process

### Step 1 — Scan repository structure

```bash
# Project file tree
find . -type f \
  | grep -v node_modules | grep -v .git | grep -v dist \
  | grep -v .next | grep -v build \
  | head -80

# Dependencies and scripts
cat package.json 2>/dev/null \
  || cat pyproject.toml 2>/dev/null \
  || cat Cargo.toml 2>/dev/null \
  || cat go.mod 2>/dev/null

# README
cat README.md 2>/dev/null || cat readme.md 2>/dev/null

# Root-level config files
ls -la | head -30
```

### Step 2 — Read key files

Read only files that reveal architecture — not everything. Focus on:

1. **Entry points** — `index.ts`, `main.py`, `app.tsx`, `server.ts`, etc.
2. **Configuration** — `.env.example`, `.env.template`, `config/`, `settings.py`
3. **Architecture files** — routers, models, core modules
4. **Infrastructure** — `Dockerfile`, `docker-compose.yml`, `.github/workflows/`
5. **Existing docs** — `docs/`, `CLAUDE.md` if present

### Step 3 — Extract key information

From the analysis, identify:

- **Project type** — web app, API, CLI tool, library, monorepo, etc.
- **Tech stack** — languages, frameworks, databases, external services
- **Module structure** — what each directory/module is responsible for
- **Key commands** — how to run, test, build
- **Environment variables** — what is required to run the project
- **Architectural patterns** — how the code is organized, conventions
- **Module relationships** — what depends on what
- **Active TODOs** — unfinished features or open tasks found in code or docs
- **Important notes** — non-obvious technical decisions that affect how you write code. Actively look for:
  - Unusual runtime or build setup (e.g. native TS support instead of ts-node, custom bundler config)
  - Import conventions that differ from the framework default (e.g. explicit `.ts` extensions on server)
  - Constraints implied by the stack combination (e.g. ESM-only with specific import rules)
  - Things a developer would waste time on without knowing upfront
  - Intentional omissions (e.g. no test runner, no auth, no persistence) that affect assumptions

### Step 4 — Generate project-instructions.md

Use the template below. Only include what you actually found in the code — do not invent.

---

## Template

```markdown
# [Project Name] — Project Instructions

## About

[1–3 sentences: what the project does, who it's for, what problem it solves]

## Tech Stack

- **Language:** [language + version if known]
- **Framework:** [main framework]
- **Database:** [if any]
- **External services:** [APIs, services]
- **Infrastructure:** [Docker, CI/CD, hosting]

## Project Structure

[Brief description of key directories and their responsibilities]

/src
/module-a — [responsibility]
/module-b — [responsibility]
/config — [configuration]

## Key Commands

# Install dependencies

[command]

# Run in dev mode

[command]

# Tests

[command]

# Build

[command]

## Environment Variables

[List of required ENV vars with descriptions, no values]

## Architecture & Patterns

[How the code is organized, key patterns, important conventions]

## Module Relationships

[How modules interact, what depends on what]

## Active Context / Open Tasks

[TODOs, unfinished features, or open issues found in code or docs — if any]

## Code Conventions

[Naming, file structure, import style — if consistent patterns are visible]

## Important Notes

[Non-obvious decisions, gotchas, anything a developer needs to know upfront]
```

---

## Generation rules

**Only include what you found in the code.** If a section has no data — skip it or write "not configured".

**Be specific.** Not "a modern web framework" — write "Next.js 14 with App Router".

**Focus on what claude.ai needs to understand the project without reading the code.** The goal is architectural awareness, not a full spec.

**Length:** 300–600 words is ideal. Keep it concise — this context is loaded on every conversation.

**Language:** match the language the user is speaking (EN or RU).

---

## Final step

1. Save the result to `.claude/project-instructions.md`
2. Append the `.claude/ folder` section to `CLAUDE.md` if not already present (see Storage section above)
3. Print the contents of `project-instructions.md` in the chat for quick copying
4. Tell the user: _"Copy the content above and paste it into the Project Instructions field in your claude.ai Project settings."_

---

## Updating instructions

If `.claude/project-instructions.md` already exists:

1. Read the current version from `.claude/project-instructions.md`
2. Analyze the codebase (Steps 1–3)
3. Generate a new version
4. Show the user **what changed** in a readable diff format:
   - Sections added
   - Sections changed or removed
5. Overwrite `.claude/project-instructions.md` with the new version

---

## Auto-detection of stale instructions

**Run this check at the start of every new Claude Code session** if `.claude/project-instructions.md` exists.

### How to check

```bash
# Files modified more recently than project-instructions.md
find . \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/.next/*" \
  -not -path "*/build/*" \
  -not -path "*/.claude/*" \
  -newer .claude/project-instructions.md \
  -type f | sort
```

### Trigger conditions

Notify the user if **at least one** of the following appears in the list of newer files:

| Signal                  | Files                                                    |
| ----------------------- | -------------------------------------------------------- |
| New module or directory | New folder in `/src`, `/lib`, `/modules`, `/packages`    |
| Dependency changes      | `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod` |
| New ENV variables       | `.env.example`, `.env.template`                          |
| Infrastructure changes  | `Dockerfile`, `docker-compose.yml`                       |
| New entry point         | `index.*`, `main.*`, `app.*` at root level               |
| Config changes          | `config/`, `settings.*`, `*.config.*`                    |

### What to say

If triggers are found — show a short message at the start of the session:

> ⚠️ **Project Instructions may be outdated**
> Changed since last update: [list of files]
> Say _"update project instructions"_ and I'll compare with the current codebase and show you what changed.

If no triggers — say nothing, continue normally.

### Rules

- Do not block work waiting for a response — just show the warning and continue
- Keep the check fast — only compare file timestamps, do not read file contents
