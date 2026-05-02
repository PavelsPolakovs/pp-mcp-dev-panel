# Create Issue

Creates a new GitLab issue from a plan file path stored in the session.
Uses the **trev-task-creation** skill to structure the issue content and the **trev-gitlab-workflow** skill for all GitLab API operations. This file contains only UCS-specific inputs and overrides.

---

## UCS Overrides (always apply, take precedence over the skills)

| Concern             | UCS rule                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Authentication**  | Follow [authentication.md](./authentication.md) — use `curl` with `PRIVATE-TOKEN`. **Never use `glab`.**                                                                             |
| **Project**         | `oaf%2Fucs` (URL-encoded). Do not auto-detect from git remote.                                                                                                                       |
| **Issue type**      | Infer from plan content using `trev-task-creation` type labels (`type::feature`, `type::bug`, `type::docs`, `type::refactor`, `type::chore`). Default to `type::feature` if unclear. |
| **Required labels** | Always append `ai-development,sdlc,ucs` — full label string: `workflow::new,<ISSUE_TYPE>,ai-development,sdlc,ucs`                                                                    |
| **Agent signature** | Use `Claude` as the agent name: `Created by AI coding agent (Claude via <PAT owner>)`                                                                                                |
| **Duplicate check** | Before creating, search for an open issue with the same title. If a match is found, print `"Issue already exists: <web_url>. Skipping creation."` and go to Step 3.                  |

---

## Step 1 — Read the plan file or folder from the session

a. Read the plan path from the session:

```bash
PLAN_PATH=$(node .a-local-workflow/workflow/scripts/session/session.js get planFile)
```

b. Detect if `PLAN_PATH` is a file or a directory:

```bash
if [ -d "$PLAN_PATH" ]; then
  IS_DIR=1
else
  IS_DIR=0
fi
```

c. If `PLAN_PATH` is a **file**:

- Open the file and read its full contents.
- Extract:
  - **Title**: the text of the first line that starts with `# ` (strip the `# ` prefix). Store as `PLAN_TITLE`.
  - **Body**: all content **after** the first `# ` heading line. Store as `PLAN_BODY`.
  - **Plan filename**: the last path segment of `PLAN_PATH`. Store as `PLAN_FILENAME`.
- Compose the message:
  ```bash
  MSG="Creating issue from plan \`$PLAN_FILENAME\`."
  ```

d. If `PLAN_PATH` is a **directory**:

- List all files in the directory (non-recursive):
  ```bash
  PLAN_FILES=("$PLAN_PATH"/*)
  ```
- For each file in `PLAN_FILES`, read its contents and extract:
  - The file name (for section headers)
  - The title (first `# ` line, if present)
  - The body (content after the first `# ` line)
- Synthesize a combined title, e.g.:
  - If all files have a `# ` title, use "Summary of <foldername> plans" or concatenate the most relevant titles.
- Synthesize a combined body:
  - For each file, add a section header with the file name or title, then include its body.
  - Optionally, add a table of contents listing all files/titles.
- Store as `PLAN_TITLE` and `PLAN_BODY`.
- Compose the message:
  ```bash
  MSG="Creating issue from folder \`$(basename "$PLAN_PATH")\` with $((${#PLAN_FILES[@]})) files."
  ```

e. Print the message:

> _"`$MSG`"_

f. Log the message:

```bash
node .a-local-workflow/workflow/scripts/logger.js log "$MSG"
```

---

## Step 2 — Prepare the issue content

Use the **trev-task-creation** skill:

- Apply the **GitLab description template** (Objective, Acceptance Criteria, Routing sections) to structure `PLAN_BODY`. If `PLAN_BODY` already contains `## Acceptance Criteria`, use it verbatim.
- Infer `ISSUE_TYPE` from plan content (see UCS Overrides above).
- Store the final description as `ISSUE_DESCRIPTION`.

---

## Step 3 — Create the issue in GitLab

Use the **trev-gitlab-workflow** skill for all API operations, applying all UCS overrides from the table above:

- Authenticate via [authentication.md](./authentication.md)
- Check for duplicates (UCS override)
- Create the issue with title `PLAN_TITLE`, description `ISSUE_DESCRIPTION`, labels `workflow::new,<ISSUE_TYPE>,ai-development,sdlc,ucs`
- Post the AI agent signature comment (UCS override: use `Claude` agent name)
- Store the response `web_url` as `ISSUE_URL` and `iid` as `ISSUE_IID`

---

## Step 4 — Save the task to the session

a. Save the task details to the session:

```bash
node .a-local-workflow/workflow/scripts/session/session.js set task "$(python3 -c "
import json, sys
print(json.dumps({
    'link': sys.argv[1],
    'iid': sys.argv[2],
    'title': sys.argv[3],
    'description': sys.argv[4]
}))
" "$ISSUE_URL" "$ISSUE_IID" "$PLAN_TITLE" "$ISSUE_DESCRIPTION")"
```

b. Compose the message:

```bash
MSG="Issue \`$PLAN_TITLE\` ($ISSUE_URL) created successfully (\`#$ISSUE_IID\`, \`$ISSUE_TYPE\`, \`workflow::new\`)."
```

c. Print the message:

> _"`$MSG`"_

d. Log the message:

```bash
node .a-local-workflow/workflow/scripts/logger.js log "$MSG"
```

---

## Step 5 — Clean up and return control

a. Unset the `action` key from the session:

```bash
node .a-local-workflow/workflow/scripts/session/session.js unset action
```

b. Load `.a-local-workflow/workflow/menu/task-lifecycle.md` and transfer control to the **Task Lifecycle Orchestrator**.
