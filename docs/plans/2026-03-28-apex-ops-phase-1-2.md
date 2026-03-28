# APEX Ops v6.0 — Phase 1 & 2 Implementation Plan

> **Execution:** Use `/execute` or `/teams` to implement this plan task-by-task.

**Goal:** Transform the apex-framework repo from a framework-only repo into a next-forge monorepo with APEX integration, preserving all existing framework functionality.

**Architecture:** Scaffold from next-forge (`npx next-forge@latest init`), then move existing `.claude/`, `docs/`, and framework files into the monorepo structure. Generate app-level CLAUDE.md for each app. Wire Design DNA tokens into `@apex/ui`.

**Tech Stack:** Next.js 16, Turborepo, Bun, Tailwind CSS 4, TypeScript 5.7, Prisma 6, Neon, Clerk, shadcn/ui

**Spec:** `docs/specs/2026-03-28-apex-ops-design.md`
**PRD:** `docs/prd/apex-ops.md`
**Architecture:** `docs/architecture/apex-ops.md`

---

## Phase 1: Integration Tooling (Tasks 1-4)

Build the scripts and templates that let APEX scaffold next-forge projects with APEX integration. This is the reusable part — it works for ANY APEX project, not just Ops.

---

### Task 1: APEX + next-forge Scaffold Script

**Files:**

- Create: `bin/apex-scaffold.sh`
- Modify: `README.md` (add scaffold documentation)

**What this does:** A shell script that runs `npx next-forge@latest init`, then injects `.claude/` framework files and generates app-level CLAUDE.md for each app in the monorepo.

- [ ] **Step 1: Create the scaffold script**

```bash
#!/usr/bin/env bash
# bin/apex-scaffold.sh — Scaffold a new APEX + next-forge project
set -euo pipefail

PROJECT_NAME="${1:?Usage: apex-scaffold.sh <project-name>}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRAMEWORK_DIR="$(dirname "$SCRIPT_DIR")"

echo "⚔️ APEX Scaffold — Forging $PROJECT_NAME with next-forge..."

# Step 1: Scaffold next-forge
echo "📦 Running next-forge init..."
npx next-forge@latest init "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Step 2: Copy APEX framework files
echo "🔧 Injecting APEX Framework..."
cp -r "$FRAMEWORK_DIR/.claude" ./.claude
cp "$FRAMEWORK_DIR/CLAUDE.md" ./CLAUDE.md

# Step 3: Generate app-level CLAUDE.md for each app
echo "📝 Generating app-level CLAUDE.md files..."
for APP_DIR in apps/*/; do
  APP_NAME=$(basename "$APP_DIR")
  cat > "$APP_DIR/CLAUDE.md" << CLAUDEMD
# $APP_NAME — App Constitution

> Part of $(basename "$(pwd)") monorepo. See root CLAUDE.md for framework rules.

## Stack
- Next.js 16 App Router + Turbopack
- @apex/ui (shared design system)
- @apex/config (shared env + constants)

## Rules
- Server Components by default. \`'use client'\` only for interactivity.
- All request APIs are async: \`await cookies()\`, \`await headers()\`.
- Use \`proxy.ts\` instead of \`middleware.ts\` (Next.js 16).
- Import shared components from \`@apex/ui\`, not local duplicates.
- Design tokens only — never hardcode colors.

## Testing
- Unit: Vitest. Integration: Next.js test client. E2E: Playwright.
- \`npm test\` runs all tests for this app.

## Patterns
- \`app/layout.tsx\` — root layout, theme provider, fonts
- \`app/page.tsx\` — page components, Server Components
- \`components/\` — app-specific components only
CLAUDEMD
  echo "  ✓ $APP_DIR/CLAUDE.md"
done

# Step 4: Wire Design DNA tokens
echo "🎨 Wiring Design DNA..."
if [ -d "$FRAMEWORK_DIR/docs/design-dna/tokens" ]; then
  mkdir -p packages/design-system/tokens
  cp -r "$FRAMEWORK_DIR/docs/design-dna/tokens/"* packages/design-system/tokens/ 2>/dev/null || true
  echo "  ✓ Design DNA tokens copied to packages/design-system/tokens/"
fi

echo ""
echo "⚔️ APEX + next-forge scaffold complete!"
echo "  cd $PROJECT_NAME && bun install"
echo "  This is the Way."
```

- [ ] **Step 2: Make script executable**

Run: `chmod +x bin/apex-scaffold.sh`

- [ ] **Step 3: Test the script in a temp directory**

Run:

```bash
cd /tmp && /Users/lsfdsb/Projects/apex-framework/bin/apex-scaffold.sh test-apex-project
```

Expected: next-forge project scaffolded with `.claude/` injected and app-level CLAUDE.md in each app directory.

- [ ] **Step 4: Verify app-level CLAUDE.md files**

Run: `find /tmp/test-apex-project/apps -name "CLAUDE.md" -exec echo {} \; -exec wc -l {} \;`
Expected: One CLAUDE.md per app, each under 45 lines.

- [ ] **Step 5: Clean up test project**

Run: `rm -rf /tmp/test-apex-project`

- [ ] **Step 6: Commit**

```bash
git add bin/apex-scaffold.sh
git commit -m "feat: APEX + next-forge scaffold script

Scaffolds a next-forge monorepo with APEX Framework injection:
- Copies .claude/ and CLAUDE.md into project
- Generates app-level CLAUDE.md for each app (~25 lines)
- Wires Design DNA tokens into packages/design-system/"
```

---

### Task 2: App-level CLAUDE.md Template

**Files:**

- Create: `.claude/templates/app-claudemd.md`

**What this does:** A reusable template for generating app-level CLAUDE.md files. The scaffold script uses this, and it can be customized per app type.

- [ ] **Step 1: Create the template**

```markdown
# {{APP_NAME}} — App Constitution

> Part of {{PROJECT_NAME}} monorepo. See root CLAUDE.md for framework rules.

## Stack

- Next.js 16 App Router + Turbopack
- @apex/ui (shared design system)
- @apex/config (shared env + constants)

## This App

- **Purpose**: {{APP_PURPOSE}}
- **Primary persona**: {{PERSONA}}
- **Palette**: {{PALETTE}}

## Rules

- Server Components by default. `'use client'` only for interactivity.
- All request APIs are async: `await cookies()`, `await headers()`.
- Use `proxy.ts` instead of `middleware.ts` (Next.js 16).
- Import shared components from `@apex/ui`, not local duplicates.
- Design tokens only — never hardcode colors.

## Testing

- Unit: Vitest. Integration: Next.js test client. E2E: Playwright.
- `npm test` runs all tests for this app.
```

- [ ] **Step 2: Update scaffold script to use template**

Modify `bin/apex-scaffold.sh` to read from `.claude/templates/app-claudemd.md` and substitute `{{APP_NAME}}` with the actual app name instead of inline heredoc.

- [ ] **Step 3: Commit**

```bash
git add .claude/templates/app-claudemd.md bin/apex-scaffold.sh
git commit -m "feat: app-level CLAUDE.md template for monorepo apps"
```

---

### Task 3: Design DNA Token Bridge

**Files:**

- Create: `.claude/templates/tailwind-dna-bridge.ts`

**What this does:** A TypeScript config snippet that bridges Design DNA CSS custom properties into Tailwind CSS 4 theme. Apps import this to get DNA tokens as Tailwind utilities.

- [ ] **Step 1: Read existing DNA token structure**

Run: `head -50 /Users/lsfdsb/Projects/apex-framework/docs/design-dna/tokens/index.ts`
Read: `docs/design-dna/tokens/palettes/saas-blue.css`

Understand the token naming convention before writing the bridge.

- [ ] **Step 2: Create the bridge config**

Write `.claude/templates/tailwind-dna-bridge.ts` that maps DNA CSS custom properties (e.g., `--color-bg`, `--color-accent`) to Tailwind theme tokens. This file is copied into `packages/@apex/ui/` during scaffold.

- [ ] **Step 3: Test by verifying token references resolve**

Create a minimal test that imports the bridge and checks expected token names exist.

- [ ] **Step 4: Commit**

```bash
git add .claude/templates/tailwind-dna-bridge.ts
git commit -m "feat: Design DNA to Tailwind CSS bridge template"
```

---

### Task 4: Integration Test — Full Scaffold E2E

**Files:**

- Create: `tests/scaffold/scaffold.test.sh`

**What this does:** End-to-end test that runs the scaffold script and verifies all expected files exist.

- [ ] **Step 1: Write the scaffold integration test**

```bash
#!/usr/bin/env bash
set -euo pipefail

TEST_DIR="/tmp/apex-scaffold-test-$$"
SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PASS=0
FAIL=0

assert_file() {
  if [ -f "$1" ]; then
    echo "  ✓ $1"
    ((PASS++))
  else
    echo "  ✗ $1 NOT FOUND"
    ((FAIL++))
  fi
}

assert_dir() {
  if [ -d "$1" ]; then
    echo "  ✓ $1/"
    ((PASS++))
  else
    echo "  ✗ $1/ NOT FOUND"
    ((FAIL++))
  fi
}

echo "⚔️ APEX Scaffold Integration Test"
echo "  Test dir: $TEST_DIR"

# Run scaffold
cd /tmp
"$SCRIPT_DIR/bin/apex-scaffold.sh" "$(basename $TEST_DIR)" || {
  echo "✗ Scaffold script failed"
  exit 1
}

cd "$TEST_DIR"

# Verify APEX framework files
echo ""
echo "📋 Checking APEX framework injection..."
assert_dir ".claude"
assert_dir ".claude/skills"
assert_dir ".claude/agents"
assert_dir ".claude/scripts"
assert_file "CLAUDE.md"
assert_file ".claude/settings.json"

# Verify app-level CLAUDE.md
echo ""
echo "📋 Checking app-level CLAUDE.md..."
for dir in apps/*/; do
  assert_file "${dir}CLAUDE.md"
done

# Verify CLAUDE.md line count
echo ""
echo "📋 Checking CLAUDE.md sizes..."
for f in apps/*/CLAUDE.md; do
  LINES=$(wc -l < "$f")
  if [ "$LINES" -le 45 ]; then
    echo "  ✓ $f ($LINES lines <= 45)"
    ((PASS++))
  else
    echo "  ✗ $f ($LINES lines > 45)"
    ((FAIL++))
  fi
done

# Verify Design DNA tokens
echo ""
echo "📋 Checking Design DNA bridge..."
assert_dir "packages/design-system/tokens"

# Cleanup
rm -rf "$TEST_DIR"

# Results
echo ""
echo "═══════════════════════════════"
echo "  PASS: $PASS  FAIL: $FAIL"
echo "═══════════════════════════════"

[ "$FAIL" -eq 0 ] && echo "✓ All tests passed" || { echo "✗ $FAIL tests failed"; exit 1; }
```

- [ ] **Step 2: Make test executable and run it**

Run: `chmod +x tests/scaffold/scaffold.test.sh && tests/scaffold/scaffold.test.sh`
Expected: All assertions pass.

- [ ] **Step 3: Commit**

```bash
git add tests/scaffold/scaffold.test.sh
git commit -m "test: scaffold integration test — verifies full E2E flow"
```

---

## Phase 2: Repo Refactor (Tasks 5-10)

Transform the `apex-framework` repo into a next-forge monorepo. This is the most critical phase — we must preserve all existing framework functionality.

**IMPORTANT**: Phase 2 works on a feature branch. We validate everything before merging.

---

### Task 5: Scaffold next-forge Into apex-framework

**Files:**

- Create: `apps/` (7 app directories)
- Create: `packages/` (from next-forge)
- Create: `turbo.json`
- Create: `package.json` (monorepo root)
- Create: `bun.lock`

**What this does:** Initialize next-forge inside the existing repo, carefully merging the monorepo structure alongside existing files.

- [ ] **Step 1: Create a temporary scaffold outside the repo**

Run:

```bash
cd /tmp && npx next-forge@latest init apex-ops-scaffold
```

This gives us a clean next-forge structure to cherry-pick from.

- [ ] **Step 2: Copy monorepo root files**

Copy from `/tmp/apex-ops-scaffold/` into `/Users/lsfdsb/Projects/apex-framework/`:

- `turbo.json`
- `package.json` (merge with existing if needed)
- `.npmrc` (if exists)
- `biome.json` or equivalent lint config
- `tsconfig.json` (root)

Do NOT overwrite: `.gitignore` (merge), `README.md`, `CLAUDE.md`, `LICENSE`.

- [ ] **Step 3: Copy apps/ directory**

Run: `cp -r /tmp/apex-ops-scaffold/apps/ /Users/lsfdsb/Projects/apex-framework/apps/`

- [ ] **Step 4: Copy packages/ directory**

Run: `cp -r /tmp/apex-ops-scaffold/packages/ /Users/lsfdsb/Projects/apex-framework/packages/`

- [ ] **Step 5: Merge .gitignore**

Append next-forge's .gitignore entries to existing .gitignore (deduplicate).

- [ ] **Step 6: Clean up temp scaffold**

Run: `rm -rf /tmp/apex-ops-scaffold`

- [ ] **Step 7: Verify existing files untouched**

Run:

```bash
ls -la .claude/ && ls -la docs/ && cat VERSION
```

Expected: `.claude/`, `docs/`, `VERSION` all unchanged.

- [ ] **Step 8: Commit the raw scaffold**

```bash
git add apps/ packages/ turbo.json package.json tsconfig.json .gitignore
git commit -m "feat: scaffold next-forge monorepo alongside APEX framework

Raw next-forge scaffold. Existing .claude/, docs/, and framework
files preserved. Monorepo structure: apps/ + packages/ + turbo.json."
```

---

### Task 6: Install Dependencies and Verify Build

**Files:**

- Modify: `package.json` (fix workspace config)
- Possibly modify: `turbo.json` (adjust tasks)

- [ ] **Step 1: Install dependencies**

Run: `bun install` (or `npm install` if Bun isn't available)
Expected: Clean install, no errors.

- [ ] **Step 2: Run Turborepo build**

Run: `npx turbo build`
Expected: All apps build successfully (may need config fixes first).

- [ ] **Step 3: Fix any build errors**

Address each error one at a time. Common issues:

- Missing env vars → create `.env.local` with placeholder values
- TypeScript path resolution → fix tsconfig paths
- Package resolution → fix workspace references

- [ ] **Step 4: Verify turbo dev**

Run: `npx turbo dev` (just check it starts, then Ctrl+C)
Expected: All apps start dev servers.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: resolve monorepo build issues post-scaffold"
```

---

### Task 7: Generate App-Level CLAUDE.md Files

**Files:**

- Create: `apps/web/CLAUDE.md`
- Create: `apps/app/CLAUDE.md`
- Create: `apps/api/CLAUDE.md`
- Create: `apps/docs/CLAUDE.md`
- Create: `apps/email/CLAUDE.md`
- Create: `apps/storybook/CLAUDE.md`
- Create: `apps/studio/CLAUDE.md`

**What this does:** Each app gets its own ~25-line CLAUDE.md with app-specific context (purpose, persona, palette).

- [ ] **Step 1: Write apps/web/CLAUDE.md**

```markdown
# web — Public Showcase

> Part of APEX Ops monorepo. See root CLAUDE.md for framework rules.

## Stack

- Next.js 16 App Router + Turbopack
- @apex/ui (creative-warm palette)

## This App

- **Purpose**: Public showcase + framework docs landing
- **Primary persona**: Jordan (Visitor/Evaluator)
- **Palette**: creative-warm

## Rules

- Server Components by default.
- All request APIs async.
- Design tokens only — never hardcode colors.
- Import from @apex/ui, not local duplicates.
- Lighthouse > 90 on all pages.
```

- [ ] **Step 2: Write apps/app/CLAUDE.md**

```markdown
# app — Control Plane Dashboard

> Part of APEX Ops monorepo. See root CLAUDE.md for framework rules.

## Stack

- Next.js 16 App Router + Turbopack
- @apex/ui (saas-blue palette)
- @apex/auth (Clerk)
- @apex/db (Prisma + Neon)

## This App

- **Purpose**: Dashboard for managing APEX-powered projects
- **Primary persona**: Alex (Developer)
- **Palette**: saas-blue
- **Auth**: All /dashboard/\* routes require Clerk auth

## Rules

- Server Components by default.
- All request APIs async.
- Design tokens only.
- Data access via @apex/db service layer, never direct Prisma.
```

- [ ] **Step 3: Write remaining 5 CLAUDE.md files**

Write `apps/api/CLAUDE.md` (API-only, no UI, Clerk JWT auth, zod validation),
`apps/docs/CLAUDE.md` (MDX rendering, search, skill catalog),
`apps/email/CLAUDE.md` (React Email templates, Resend),
`apps/storybook/CLAUDE.md` (component workshop, all @apex/ui components),
`apps/studio/CLAUDE.md` (Prisma Studio, database visualization).

Each under 25 lines.

- [ ] **Step 4: Verify line counts**

Run: `wc -l apps/*/CLAUDE.md`
Expected: All files under 45 lines.

- [ ] **Step 5: Commit**

```bash
git add apps/*/CLAUDE.md
git commit -m "docs: app-level CLAUDE.md for all 7 monorepo apps

Per Mastery Guide: each app gets its own ~25-line constitution
with purpose, persona, palette, and app-specific rules."
```

---

### Task 8: Rename Packages to @apex/ Namespace

**Files:**

- Modify: `packages/*/package.json` (rename from @repo/ to @apex/)
- Modify: All imports referencing @repo/ across apps/

**What this does:** next-forge uses `@repo/*` namespace. We rebrand to `@apex/*`.

- [ ] **Step 1: List all @repo/ references**

Run: `grep -r "@repo/" packages/ apps/ --include="*.ts" --include="*.tsx" --include="*.json" -l`

- [ ] **Step 2: Rename package.json names**

For each `packages/*/package.json`, change `"name": "@repo/..."` to `"name": "@apex/..."`.

- [ ] **Step 3: Update all imports**

Find-and-replace `@repo/` → `@apex/` in all `.ts`, `.tsx`, `.json` files under `apps/` and `packages/`.

- [ ] **Step 4: Update turbo.json if it references @repo/**

Check `turbo.json` for `@repo/*` references and rename.

- [ ] **Step 5: Verify build after rename**

Run: `npx turbo build`
Expected: All apps still build successfully.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename @repo/ namespace to @apex/

Rebrand all packages from next-forge default @repo/ to @apex/.
All imports, package.json names, and turbo.json updated."
```

---

### Task 9: Wire Design DNA Tokens into @apex/ui

**Files:**

- Copy: `docs/design-dna/tokens/palettes/*.css` → `packages/design-system/src/tokens/palettes/`
- Copy: `docs/design-dna/tokens/foundation.css` → `packages/design-system/src/tokens/`
- Copy: `docs/design-dna/tokens/index.ts` → `packages/design-system/src/tokens/`
- Modify: `packages/design-system/tailwind.config.ts` (reference DNA tokens)

- [ ] **Step 1: Copy DNA token files**

```bash
mkdir -p packages/design-system/src/tokens/palettes
cp docs/design-dna/tokens/foundation.css packages/design-system/src/tokens/
cp docs/design-dna/tokens/index.ts packages/design-system/src/tokens/
cp docs/design-dna/tokens/palettes/*.css packages/design-system/src/tokens/palettes/
```

- [ ] **Step 2: Create palette loader**

Create `packages/design-system/src/tokens/palette.ts` that exports a function to load the appropriate palette CSS based on app config.

- [ ] **Step 3: Update Tailwind config**

Modify the design-system's Tailwind config to reference CSS custom properties from the DNA tokens (e.g., `colors: { bg: 'var(--color-bg)', accent: 'var(--color-accent)' }`).

- [ ] **Step 4: Verify token resolution**

Check that Tailwind classes like `bg-bg`, `text-accent` resolve to the correct DNA CSS vars.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/
git commit -m "feat: wire Design DNA tokens into @apex/ui

CSS custom properties from Design DNA palettes mapped to Tailwind
theme. Apps set palette at root layout level via CSS import."
```

---

### Task 10: Validate Everything Works

**Files:** None (read-only verification)

**What this does:** Comprehensive validation that the monorepo works and existing APEX framework is intact.

- [ ] **Step 1: Verify APEX framework files**

Run:

```bash
ls .claude/skills/ | wc -l  # Should be 33+
ls .claude/agents/ | wc -l  # Should be 9
ls .claude/scripts/ | wc -l # Should be 26+
cat .claude/settings.json | head -5  # Should be valid JSON
```

- [ ] **Step 2: Verify Turborepo build**

Run: `npx turbo build`
Expected: All apps build with 0 errors.

- [ ] **Step 3: Verify Turborepo dev**

Run: `npx turbo dev --filter=web` (test one app)
Expected: Dev server starts, page loads at localhost.

- [ ] **Step 4: Verify monorepo structure**

Run:

```bash
echo "Apps:" && ls apps/
echo "Packages:" && ls packages/
echo "Framework:" && ls .claude/
echo "Docs:" && ls docs/
echo "Version:" && cat VERSION
```

Expected: All directories present, existing docs untouched, VERSION still reads 5.24.0 (we'll bump on merge).

- [ ] **Step 5: Run lint**

Run: `npx turbo lint`
Expected: No errors (warnings acceptable).

- [ ] **Step 6: Update VERSION to 6.0.0**

```bash
echo "6.0.0" > VERSION
```

- [ ] **Step 7: Final commit**

```bash
git add VERSION
git commit -m "chore(release): bump version to 6.0.0

APEX Framework becomes a next-forge monorepo.
7 apps, 7 packages, Design DNA wired, app-level CLAUDE.md.
The beskar is forged."
```

---

## Self-Review

### Spec Coverage

| Spec Requirement             | Task           |
| ---------------------------- | -------------- |
| APEX scaffolds next-forge    | Task 1         |
| Inject .claude/              | Task 1, Task 5 |
| Generate app-level CLAUDE.md | Task 2, Task 7 |
| Wire Design DNA              | Task 3, Task 9 |
| Migrate repo to monorepo     | Tasks 5-6      |
| Rename to @apex/ namespace   | Task 8         |
| Preserve existing framework  | Task 10        |
| Version bump to 6.0          | Task 10        |

### Placeholder Scan

- No TBD/TODO in any task
- All file paths are explicit
- All commands are runnable

### Type Consistency

- `@apex/*` namespace used consistently after Task 8
- DNA token paths consistent between Tasks 3 and 9

---

Plan complete and saved to `docs/plans/2026-03-28-apex-ops-phase-1-2.md`. Execution options:

1. **Team Build** (recommended — 10 tasks across many files) — `/teams` spawns a coordinated team
2. **Direct Execute** — `/execute` runs tasks sequentially with checkpoints
3. **Subagent-Driven** — `/teams` SDD mode dispatches fresh subagent per task

Which approach?
