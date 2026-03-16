# Installing APEX Skills on Claude.ai

> Skills work identically across Claude.ai, Claude Code, and API.
> — Official Anthropic Documentation

## Step 1: Enable Skills

1. Open **claude.ai**
2. Click your **profile icon** (bottom left)
3. Go to **Settings** → **Customize**
4. Find the **Skills** section
5. Enable **Code execution and file creation**
6. Enable **Skills**

## Step 2: Upload Skills (29 files)

In **Settings > Customize > Skills**, click **Upload skill** for each `.md` file.

Extract `apex-skills-claude-web.tar.gz` first. Upload all 29 files.

### Essential (upload first):

| File | Purpose |
|------|---------|
| `workflow-enforcer.md` | Blocks code without PRD |
| `prd.md` | Generates complete PRD |
| `code-standards.md` | TypeScript/React patterns |
| `design-system.md` | UI/UX Jony Ive style |
| `security.md` | OWASP security audit |
| `sql-practices.md` | PostgreSQL/Supabase patterns |
| `qa.md` | 5-phase quality gate |
| `teach.md` | Teaches programming |
| `about.md` | Easter egg ⚔️ |
| `debug.md` | Debugging protocol |

### Workflow skills:

`architecture.md`, `research.md`, `performance.md`, `cx-review.md`, `a11y.md`, `deploy.md`, `commit.md`, `changelog.md`, `e2e.md`, `cicd.md`

### Support skills:

`apex-stack.md`, `verify-lib.md`, `cost-management.md`, `set-language.md`, `init.md`, `apex-review.md`

### Reference files:

`design-system-reference.md`, `security-reference.md`, `sql-practices-reference.md`

## Step 3: Create a Project

1. **Projects** → **Create project**
2. Name it (e.g., "My Task Manager")
3. In **Custom instructions**, paste the contents of `custom-instructions-en-us.txt`

## Step 4: Test

Open a conversation in your project:

- "Build me an app" → Should BLOCK and ask for PRD
- "Create a PRD for a task app" → Should generate complete PRD
- "Who made this?" → Should show APEX credits

## Why Individual Skills > Single File

```
Single file: 200+ lines ALWAYS in memory = wasted tokens
Individual skills: ~100 tokens each for frontmatter, full content only when needed
```

This is progressive disclosure — same as Claude Code.

---

*Forged by Lucas Bueno & Claude*

**This is the way.** ⚔️
