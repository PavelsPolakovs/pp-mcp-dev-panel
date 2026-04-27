---
mode: 'agent'
description: 'Push changes'
---

Execute the following Git workflow to push the current branch to origin and record the push.

1. Preferred: use the repository helper which records pushes and prints a PR/compare URL:

   - Dry-run (safe): `bash server/tools/push_changes.sh --dry-run -y`
   - Actual push (auto-confirm): `bash server/tools/push_changes.sh -y`

   Optional flags:
   - `--upstream` to set upstream (`-u`)
   - `--force` to force push
   - `--tags` to push tags

2. Fallback: if the helper is unavailable, push the current branch manually:

   - Determine branch: `git rev-parse --abbrev-ref HEAD`
   - Push: `git push origin <branch-name>`

3. After a successful push the helper (or you) may open or print a compare/PR URL:

   `https://github.com/<owner>/<repo>/compare/<branch-name>?expand=1`

Notes:
- The helper writes a record to `.github/push-records/` when a push is performed.
- Prefer a dry-run first when uncertain.
