---
mode: 'agent'
description: 'Create a new branch using the Create Branch Skill'
---

Use the Create Branch Skill defined in `.github/skills/create-branch-skill.md` to create and prepare a new feature branch.

Recommended (automated) workflow:

1. Create and switch to the new branch:
   - The skill/script will run the equivalent of:
	 - `git fetch origin <base>`
	 - `git checkout -b <new-branch> <start-point|origin/<base>>`
2. Optionally push the new branch to `origin` and set upstream:
   - `git push -u origin <new-branch>`

How to run (examples):

```bash
cd /home/polakovs/PhpstormProjects/pp-mcp-dev-panel
./.github/skill-scripts/create_branch.sh -b feature/update-branch-name
./.github/skill-scripts/create_branch.sh -b feature/experiment -B main -s release/v1.2 --no-push
```

See `.github/skills/create-branch-skill.md` for the abstract specification and `.github/skill-scripts/create_branch.sh` for a runnable implementation.
