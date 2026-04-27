---
---
mode: 'agent'
description: 'Commit changes'
---

Execute the following Git workflow to stage and commit changes.

1. Preferred: use the repository helper which stages changes and suggests a conventional commit message:

   - Interactive (suggested message, edit/accept):

				 ```bash
				 bash .github/skill-scripts/commit_changes.sh
				 ```

   - Auto-accept generated message:

				 ```bash
				 bash .github/skill-scripts/commit_changes.sh -y
				 ```

   - Provide an explicit message (skip suggestion):

				 ```bash
				 bash .github/skill-scripts/commit_changes.sh -m "feat(scope): short summary"
				 ```

   - Amend last commit:

				 ```bash
				 bash .github/skill-scripts/commit_changes.sh --amend -y
				 ```

2. Fallback: if the helper is unavailable, run the manual steps:

   ```bash
   git add .
   git commit -m "A descriptive commit message"
   ```

Notes:
- `.github/skill-scripts/commit_changes.sh` will stage all changes, analyze the staged files to suggest a short conventional-style message, and optionally open your `$EDITOR` to edit the message.
- Use `-y` to assume yes and avoid interactive prompts.
