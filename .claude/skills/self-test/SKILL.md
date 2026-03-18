---
name: self-test
description: Summons the Sentinel (Batman) to run a complete framework verification. Quick mode validates structure. Full mode builds the APEX Observatory app from scratch — exercising every framework phase with a full agent team. Use when the user says "self-test", "verify framework", "check everything", "is everything working", "prove it", "batman", or "/batman". The Bat-Signal goes up.
argument-hint: "[mode: quick (default), full]"
allowed-tools: Read, Write, Grep, Glob, Bash, Agent, TeamCreate, TeamDelete, TaskCreate, TaskUpdate, TaskList, SendMessage
---

# The Bat-Signal

```
                    .                    .
                  .o8                  .o8
                .o888oo .oooo.o     .o888oo
                  888  d88(  "8       888
                  888  `"Y88b.        888
                  888  o.  )88b       888 .
                  "888" 8""888P'      "888"

       ████████████████████████████████████████
      ██                                      ██
     ██    ██████  ████  ████████  ██    ██    ██
     ██    ██   █ ██  ██    ██    ███   ███    ██
     ██    ██████ ██████    ██    ████████     ██
     ██    ██   █ ██  ██    ██    ██ ██ ██     ██
     ██    ██████ ██  ██    ██    ██   ███     ██
      ██                                      ██
       ████████████████████████████████████████
```

> "It's not who I am underneath, but what I do that defines me."

## The Sentinel has been summoned.

Detect mode from `$ARGUMENTS`:
- If argument contains **"full"**, **"integration"**, **"prove"**, or **"observatory"** → **Mode 2: Full Integration Proof**
- Otherwise → **Mode 1: Quick Audit** (default)

---

# Mode 1: Quick Audit

Fast structural verification. The Sentinel checks every wire, every agent, every hook. No app build.

### Step 1: Create the team

```
TeamCreate({ team_name: "self-test", description: "Quick structural audit — The Dark Knight rises" })
```

### Step 2: Create the audit task

```
TaskCreate({
  title: "[SENTINEL] Full structural framework audit",
  description: "Run phases 1-7: automated suites, agent verification, skill verification, hook scripts, settings coherence, cross-component wiring, workflow completeness."
})
```

### Step 3: Spawn Watcher + Sentinel

**Watcher** (background monitoring):
```
Agent({
  team_name: "self-test",
  subagent_type: "watcher",
  name: "watcher",
  model: "haiku",
  prompt: "Monitor the APEX framework during a self-test audit. Watch for script syntax errors, settings.json corruption, missing files, permission issues. Run an initial scan and report issues to lead via SendMessage.",
  run_in_background: true
})
```

**Sentinel** (the tester):
```
Agent({
  team_name: "self-test",
  subagent_type: "sentinel",
  name: "sentinel",
  prompt: "Run a FULL structural self-test of the APEX Framework. Execute ALL 7 phases from your agent definition:\n- Phase 1: Run automated test suites (test-framework.sh, test-hooks.sh, test-integration.sh)\n- Phase 2: Parse and validate every agent's YAML frontmatter\n- Phase 3: Parse and validate every skill's frontmatter\n- Phase 4: Syntax-check every hook script with bash -n\n- Phase 5: Parse settings.json — verify hook→script paths, env vars\n- Phase 6: Cross-reference CLAUDE.md ↔ agents ↔ teams ↔ tests\n- Phase 7: Verify the full workflow chain\n\nDo NOT run Phase 8 (Observatory) — this is quick mode.\n\nFor every FAIL, create a TaskCreate with title '[SENTINEL] {description}'.\nAfter all phases, send your full Sentinel Report to the lead via SendMessage.",
  run_in_background: false
})
```

### Step 4: If issues found — spawn Debugger

```
Agent({
  team_name: "self-test",
  subagent_type: "debugger",
  name: "debugger",
  prompt: "Check TaskList for [SENTINEL] tasks. Fix each issue: read the task, find root cause, fix properly, update task. Message lead when done.",
  run_in_background: false
})
```

### Step 5: If fixes made — spawn QA

```
Agent({
  team_name: "self-test",
  subagent_type: "qa",
  name: "qa",
  prompt: "Debugger fixed issues found by Sentinel. Verify every fix:\n1. Check TaskList for completed [SENTINEL] tasks\n2. Re-run relevant test suites\n3. Verify no regressions\n4. Report APPROVED or BLOCKED to lead via SendMessage",
  run_in_background: false
})
```

### Step 6: Clean up

```
TeamDelete({ team_name: "self-test" })
```

### Quick Verdict

If ALL pass: `🦇 The Dark Knight confirms: Gotham is safe. All systems operational.`
If fixed: `🦇 The Dark Knight found {N} threats. All neutralized. Gotham is safe.`
If remaining: `🦇 The Dark Knight found {N} threats. {M} remain. Review needed.`

---

# Mode 2: Full Integration Proof

> "Why do we fall? So we can learn to pick ourselves up."

This is the ultimate test. Batman orchestrates building a **real application** — the APEX Observatory — through EVERY framework phase. If every phase works, you get a working visual dashboard on localhost. If any phase breaks, that's the test failing.

**10 phases. 7+ agents. Zero shortcuts. Every phase visible.**

---

## PHASE 1: STRUCTURAL AUDIT (Gate)

Before building anything, verify the framework itself is healthy.

### Step 1.1: Create the team

```
TeamCreate({ team_name: "integration-proof", description: "Full integration proof — building the APEX Observatory" })
```

### Step 1.2: Create phase tracking task

```
TaskCreate({
  title: "[OBSERVATORY] Phase tracking",
  description: "Phase 1: ⏳ Structural Audit\nPhase 2: ⏳ PRD\nPhase 3: ⏳ Architecture\nPhase 4: ⏳ Research\nPhase 5: ⏳ Build\nPhase 6: ⏳ Design Review\nPhase 7: ⏳ QA\nPhase 8: ⏳ Security\nPhase 9: ⏳ A11y + CX\nPhase 10: ⏳ Runtime Validation"
})
```

### Step 1.3: Spawn Sentinel for structural audit

```
Agent({
  team_name: "integration-proof",
  subagent_type: "sentinel",
  name: "sentinel",
  prompt: "Run phases 1-7 of your structural self-test (NOT Phase 8). This is the gate before building the APEX Observatory.\n\nIf you find CRITICAL failures (settings.json corrupt, scripts not executable, agents missing), create tasks and message the lead: 'GATE BLOCKED — critical issues must be fixed first.'\n\nIf only warnings or minor issues, message the lead: 'GATE PASSED — framework healthy enough to build.' Include your full Sentinel Report.",
  run_in_background: false
})
```

### Step 1.4: Evaluate gate

Display to user:
```
═══════════════════════════════════════════════════
  PHASE 1: STRUCTURAL AUDIT — [PASSED ✅ / BLOCKED 🔴]
═══════════════════════════════════════════════════
```

If BLOCKED: Spawn Debugger to fix critical issues, re-run Sentinel. Do NOT proceed until the gate passes.

Update phase tracking task: `Phase 1: ✅ Structural Audit`

---

## GATE: Phase 1 must pass before continuing. Verify Sentinel reported GATE PASSED.

---

## PHASE 2: PRD

Write the APEX Observatory Product Requirements Document.

### Step 2.1: Write the PRD

Use the Write tool to create `docs/prd/apex-observatory.md` with this content:

```markdown
# APEX Observatory — Product Requirements Document

## Vision
A visual dashboard that proves the APEX Framework works by displaying its own health — agents, skills, hooks, workflow chain, test results — all from a single localhost page. The app itself is the integration proof: if every APEX phase can build this successfully, the framework works.

## Problem
Framework integrity is invisible. Tests run in terminals, output scrolls past. There is no visual, interactive proof that every component is wired correctly and operational.

## Target User
**APEX Framework Developer** — uses Claude Code daily, needs instant visibility into framework health, wants to verify the framework works after updates or changes.

## Functional Requirements

### FR-1: Framework Health Overview
- Total agent count with validation status (valid/invalid)
- Total skill count with validation status
- Total hook script count with executable + syntax status
- Settings.json validity indicator
- Agent teams enablement status
- Framework version display

### FR-2: Agent Roster
- Table showing all agents: name, model, tools, skills, permission mode
- Validation status per agent (frontmatter correct, tools valid, skills exist)
- Visual indicator for read-only vs write-capable agents

### FR-3: Skill Directory
- Table showing all skills: name, description, allowed-tools, team-aware flag
- Validation status (frontmatter correct, tool references match body)
- Trigger keywords for each skill

### FR-4: Hook Scripts Status
- Table showing all scripts: filename, executable flag, syntax check result
- Settings.json wiring status (is it referenced in a hook?)

### FR-5: Workflow Chain Visualization
- Visual pipeline: PRD → Architecture → Research → Build → QA → Security → A11y → CX Review → Commit
- Each step shows: skill exists (✅/❌), skill directory path
- Visual flow with arrows or connected cards

### FR-6: Live Test Runner
- Buttons to run each test suite: framework, hooks, integration
- "Run All" button
- Real-time display of pass/fail counts
- Test output viewable in expandable sections

### FR-7: Cross-Reference Matrix
- Agent ↔ CLAUDE.md presence
- Agent ↔ teams skill reference
- Agent ↔ test coverage
- Visual matrix with ✅/❌ cells

## Non-Functional Requirements

### NFR-1: Zero Dependencies
- Vanilla HTML, CSS, JavaScript (no frameworks, no npm)
- Node.js http module only (no Express, no libraries)
- Single server.js + single index.html

### NFR-2: Performance
- Dashboard loads in < 1 second on localhost
- API responses in < 500ms (except test runner which streams)
- No external network requests

### NFR-3: Design
- Dark Gotham theme (CSS custom properties)
- Monospace font for code/data, sans-serif for headings
- Responsive layout (works on mobile)
- Consistent color system: green=pass, red=fail, yellow=warn, blue=info

### NFR-4: Accessibility
- Semantic HTML (header, main, nav, section, table)
- ARIA labels on interactive elements
- Keyboard navigable (tab through all controls)
- Color is never the only indicator (icons + text accompany colors)
- Minimum 4.5:1 contrast ratio

### NFR-5: Security
- No eval(), no exec() with user input
- API validates query parameters
- Server only reads from project directory (no path traversal)
- No secrets exposed in API responses

## API Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Serve index.html |
| GET | /api/overview | Framework health summary (counts, version, validity) |
| GET | /api/agents | All agents with validation details |
| GET | /api/skills | All skills with validation details |
| GET | /api/hooks | All hook scripts with status |
| GET | /api/workflow | Workflow chain with skill existence checks |
| GET | /api/crossref | Cross-reference matrix |
| GET | /api/test?suite={name} | Run a specific test suite, return results |
| GET | /api/test/all | Run all test suites |

## Success Metrics
- All API endpoints return valid JSON
- Dashboard renders all 7 sections correctly
- Test runner executes and displays results
- Passes QA, security, a11y, and CX review phases
- The app itself is the proof: framework works end-to-end
```

### Step 2.2: Display status

```
═══════════════════════════════════════════════════
  PHASE 2: PRD — WRITTEN ✅
  → docs/prd/apex-observatory.md
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 2: ✅ PRD`

---

## GATE: Verify `docs/prd/apex-observatory.md` exists. Read it to confirm content.

---

## PHASE 3: ARCHITECTURE

Write the architecture document.

### Step 3.1: Write the architecture doc

Use the Write tool to create `docs/architecture/apex-observatory.md` with this content:

```markdown
# APEX Observatory — Architecture Document

## Stack Decision
- **Server**: Node.js http module (zero dependencies)
- **Frontend**: Vanilla HTML + CSS + JavaScript (no frameworks)
- **Data**: Reads framework files at runtime (no database)
- **Why**: The Observatory must prove the framework works, not prove npm works. Zero dependencies = zero supply chain risk = maximum portability.

## File Structure
```
dashboard/
├── server.js      # HTTP server + JSON API (≤300 lines)
└── index.html     # Single-page app with embedded CSS + JS
```

## Server Architecture (server.js)

### Core Design
- Single `http.createServer` with request routing
- Each `/api/*` endpoint is a pure function: read files → transform → return JSON
- Static file serving for `/` → `index.html`
- CORS disabled (localhost only)
- Graceful error handling on all file reads

### Data Collection Pattern
Each API endpoint follows the same pattern:
1. Read framework files (`.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, etc.)
2. Parse YAML frontmatter where needed
3. Run validation checks
4. Return structured JSON

### API Response Format
All endpoints return:
```json
{
  "timestamp": "ISO-8601",
  "data": { ... }
}
```

Error responses:
```json
{
  "timestamp": "ISO-8601",
  "error": "description"
}
```

## Frontend Architecture (index.html)

### Layout
- Fixed header with title + version + health bar
- Responsive grid of dashboard cards
- Each card = one section (agents, skills, hooks, workflow, tests, crossref)
- Cards are collapsible for mobile

### Design Tokens (CSS Custom Properties)
```css
:root {
  --bg-dark: #0a0a0f;
  --bg-card: #12121a;
  --bg-surface: #16161f;
  --border: #1e1e2e;
  --text-primary: #e0e0e8;
  --text-secondary: #8888a0;
  --accent-gold: #c8a84e;
  --green: #34d399;
  --red: #f87171;
  --yellow: #fbbf24;
  --blue: #60a5fa;
}
```

### Data Fetching
- On page load: fetch `/api/overview`, `/api/agents`, `/api/skills`, `/api/hooks`, `/api/workflow`, `/api/crossref`
- Test runner: fetch `/api/test?suite={name}` on button click
- No polling (manual refresh via button)

### Accessibility Architecture
- Semantic: `<header>`, `<main>`, `<section>`, `<table>`, `<button>`
- Every table has `<caption>` and `<thead>`
- Interactive elements have `aria-label`
- Status indicators: icon + text + color (triple encoding)
- Skip navigation link as first focusable element
- Focus-visible styling on all interactive elements

## Persona → Page Alignment
**Primary persona**: APEX Framework Developer
**Single page**: Dashboard (all sections visible, scrollable)
This is a single-persona, single-page app. No mixing of concerns.

## Security Considerations
- Server reads only from project root directory
- Path traversal blocked: all file reads use `path.join(ROOT, ...)` with no user-controlled segments
- No `eval()`, no dynamic code execution
- Test runner uses `execSync` with hardcoded commands only (no user input in shell)
- API query params validated against allowlist (suite names)
```

### Step 3.2: Display status

```
═══════════════════════════════════════════════════
  PHASE 3: ARCHITECTURE — WRITTEN ✅
  → docs/architecture/apex-observatory.md
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 3: ✅ Architecture`

---

## GATE: Verify `docs/architecture/apex-observatory.md` exists.

---

## PHASE 4: RESEARCH

Verify the zero-dependency constraint is achievable.

### Step 4.1: Spawn Researcher

```
Agent({
  team_name: "integration-proof",
  subagent_type: "researcher",
  name: "researcher",
  model: "haiku",
  prompt: "Research task for APEX Observatory build:\n\n1. Verify Node.js 'http' module can serve static files and JSON API endpoints without Express\n2. Verify 'child_process.execSync' can run bash scripts and capture output\n3. Verify vanilla JavaScript 'fetch()' API works for localhost API calls\n4. Check if there are any Node.js built-in module changes in recent versions that affect http.createServer or child_process\n5. Confirm the existing dashboard/server.js (which already works) uses patterns compatible with Node.js 18+\n\nThis is intentionally lightweight — the stack has zero external dependencies. Report findings to lead via SendMessage. Confirm: 'Research complete — zero-dependency approach verified.'",
  run_in_background: true
})
```

### Step 4.2: Display status (don't wait — researcher reports async)

```
═══════════════════════════════════════════════════
  PHASE 4: RESEARCH — LAUNCHED ✅ (Researcher working in background)
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 4: ✅ Research`

---

## PHASE 5: BUILD

The main event. Spawn the full build team.

### Step 5.1: Create build tasks

```
TaskCreate({ title: "[BUILD] Implement APEX Observatory server with all API endpoints", description: "Evolve dashboard/server.js to match the PRD and architecture docs. Must implement: /api/overview, /api/agents, /api/skills, /api/hooks, /api/workflow, /api/crossref, /api/test?suite={name}, /api/test/all. Zero dependencies. ≤300 lines. Read docs/prd/apex-observatory.md and docs/architecture/apex-observatory.md for full spec." })

TaskCreate({ title: "[BUILD] Implement APEX Observatory UI with all dashboard sections", description: "Evolve dashboard/index.html to match the PRD. Must show: health overview, agent roster, skill directory, hook status, workflow chain visualization, live test runner, cross-reference matrix. Gotham dark theme. Responsive. Accessible. Read docs/prd/apex-observatory.md and docs/architecture/apex-observatory.md for full spec." })
```

### Step 5.2: Spawn Watcher (if not already running)

```
Agent({
  team_name: "integration-proof",
  subagent_type: "watcher",
  name: "watcher",
  model: "haiku",
  prompt: "Monitor the APEX Observatory build. Watch for:\n1. Syntax errors in dashboard/server.js or dashboard/index.html\n2. Any hardcoded Tailwind colors (must use CSS custom properties)\n3. Console.log statements that shouldn't be in production\n4. Security issues (eval, exec with user input, path traversal)\n\nReport issues immediately to lead via SendMessage.",
  run_in_background: true
})
```

### Step 5.3: Spawn Builder

```
Agent({
  team_name: "integration-proof",
  subagent_type: "builder",
  name: "builder",
  prompt: "You are building the APEX Observatory — a visual dashboard for the APEX Framework.\n\nREAD THESE FIRST:\n1. docs/prd/apex-observatory.md — the full requirements\n2. docs/architecture/apex-observatory.md — the technical architecture\n3. dashboard/server.js — the existing server to evolve\n4. dashboard/index.html — the existing UI to evolve\n\nYour job:\n1. Evolve dashboard/server.js to implement ALL API endpoints from the PRD\n2. Evolve dashboard/index.html to show ALL dashboard sections from the PRD\n3. Follow the architecture doc exactly — zero dependencies, CSS custom properties, semantic HTML\n4. The existing code is a strong foundation — enhance it, don't rewrite from scratch\n5. Server must be ≤300 lines. If approaching limit, optimize.\n6. All API endpoints must return valid JSON with { timestamp, data } format\n7. UI must be accessible: semantic HTML, ARIA labels, keyboard nav, skip nav link, focus-visible\n8. Responsive layout that works on mobile\n\nACCEPTANCE CRITERIA:\n- `node dashboard/server.js` starts without errors\n- Every API endpoint returns valid JSON\n- Dashboard renders all 7 sections\n- Test runner buttons work\n- No external dependencies\n- No hardcoded colors (use CSS custom properties only)\n- No console.log in production code paths\n\nWhen done, list ALL files created/modified and message the lead via SendMessage.",
  run_in_background: false
})
```

### Step 5.4: CRITICAL — Verify files exist in main project

After Builder completes (it works in a worktree), **you MUST verify** the files exist:
```bash
ls -la dashboard/server.js dashboard/index.html
```
If files are missing, the worktree cleanup deleted them. Recover from the worktree branch.

### Step 5.5: Display status

```
═══════════════════════════════════════════════════
  PHASE 5: BUILD — [COMPLETE ✅ / FAILED 🔴]
  → dashboard/server.js (modified)
  → dashboard/index.html (modified)
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 5: ✅ Build`

---

## GATE: Verify `dashboard/server.js` and `dashboard/index.html` exist and have been updated. Run `node -c dashboard/server.js` to syntax-check.

---

## PHASE 6: DESIGN REVIEW

### Step 6.1: Spawn Design Reviewer

```
Agent({
  team_name: "integration-proof",
  subagent_type: "design-reviewer",
  name: "design-reviewer",
  prompt: "Review the APEX Observatory UI (dashboard/index.html) against these criteria:\n\n1. **Design Tokens**: All colors must use CSS custom properties (--bg-dark, --green, etc.). NO hardcoded hex values outside :root. NO Tailwind palette colors.\n2. **Persona Alignment**: Single persona (APEX Developer), single page. No mixed concerns.\n3. **Branding**: Must say 'APEX Observatory' or 'APEX Watchtower'. No template branding (ACME, Doppel, My App).\n4. **Layout**: Responsive grid, cards collapse on mobile, readable on all screen sizes.\n5. **Typography**: Monospace for code/data, sans-serif for headings. Consistent sizing.\n6. **Visual Hierarchy**: Health overview first, then details. Most important info above fold.\n7. **Consistency**: All tables styled the same. All buttons styled the same. All status indicators use the same pattern (icon + text + color).\n\nRead the PRD at docs/prd/apex-observatory.md and architecture at docs/architecture/apex-observatory.md for context.\n\nReport APPROVED or create tasks for issues found. Message lead via SendMessage.",
  run_in_background: false
})
```

### Step 6.2: If issues found, spawn Builder to fix, then re-review

### Step 6.3: Display status

```
═══════════════════════════════════════════════════
  PHASE 6: DESIGN REVIEW — [APPROVED ✅ / CHANGES REQUESTED 🟡]
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 6: ✅ Design Review`

---

## PHASE 7: QA

### Step 7.1: Spawn QA

```
Agent({
  team_name: "integration-proof",
  subagent_type: "qa",
  name: "qa",
  prompt: "Run the full 6-phase QA gate on the APEX Observatory app:\n\nRead the PRD at docs/prd/apex-observatory.md first.\n\n1. **Static Analysis**: Check dashboard/server.js and dashboard/index.html for: no console.log in prod, no eval(), no hardcoded secrets, functions ≤30 lines, file sizes within limits\n2. **Logic Review**: Every API endpoint returns valid JSON. Error handling on all file reads. Query parameter validation on /api/test.\n3. **Test Coverage**: Start the server (PORT=13579), hit every endpoint, verify JSON structure. Stop server.\n4. **UX Review**: Dashboard sections all render. Test runner works. Loading states present.\n5. **Performance**: Server starts in <2s. API responses in <500ms.\n6. **Branding Scan**: grep for ACME, Doppel, 'My App', lorem ipsum. Must find NONE.\n\nRun REAL tests — start the server and hit the endpoints. Don't just read code.\n\nReport APPROVED or BLOCKED with specific issues. Message lead via SendMessage.",
  run_in_background: false
})
```

### Step 7.2: If BLOCKED — fix issues and re-run QA (breathing loop)

### Step 7.3: Display status

```
═══════════════════════════════════════════════════
  PHASE 7: QA — [APPROVED ✅ / BLOCKED 🔴]
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 7: ✅ QA`

---

## GATE: QA must report APPROVED before continuing.

---

## PHASE 8: SECURITY

The Lead runs the security review on the Observatory code.

### Step 8.1: Security checks

Run these checks directly (no agent spawn needed for a 2-file app):

```bash
# Check for dangerous patterns
echo "=== Security Audit: APEX Observatory ==="

# No eval or Function constructor
grep -n 'eval(' dashboard/server.js dashboard/index.html 2>/dev/null && echo "FAIL: eval() found" || echo "OK: No eval()"
grep -n 'new Function(' dashboard/server.js dashboard/index.html 2>/dev/null && echo "FAIL: new Function() found" || echo "OK: No Function constructor"

# No exec with user input (exec should only use hardcoded commands)
grep -n 'exec(' dashboard/server.js 2>/dev/null | grep -v 'execSync' | grep -v '//' && echo "WARN: Check exec() calls for user input" || echo "OK: exec usage looks safe"

# No path traversal (all file reads should use path.join with ROOT)
grep -n 'readFile' dashboard/server.js 2>/dev/null

# No secrets in responses
grep -n 'password\|secret\|token\|apikey\|api_key' dashboard/server.js 2>/dev/null && echo "WARN: Check for secrets in responses" || echo "OK: No obvious secrets"

# No innerHTML in JS (XSS risk)
grep -n 'innerHTML' dashboard/index.html 2>/dev/null && echo "WARN: innerHTML found — verify no user input is inserted" || echo "OK: No innerHTML"

echo "=== Security audit complete ==="
```

### Step 8.2: Display status

```
═══════════════════════════════════════════════════
  PHASE 8: SECURITY — [PASSED ✅ / ISSUES FOUND 🟡]
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 8: ✅ Security`

---

## PHASE 9: ACCESSIBILITY + CX REVIEW

### Step 9.1: Accessibility checks

```bash
echo "=== A11y Audit: APEX Observatory ==="

# Semantic HTML
grep -c '<header\|<main\|<nav\|<section\|<table\|<button' dashboard/index.html
grep -q '<header' dashboard/index.html && echo "OK: <header> found" || echo "FAIL: Missing <header>"
grep -q '<main' dashboard/index.html && echo "OK: <main> found" || echo "FAIL: Missing <main>"

# ARIA labels on buttons
grep -c 'aria-label' dashboard/index.html

# Skip navigation
grep -qi 'skip' dashboard/index.html && echo "OK: Skip navigation present" || echo "WARN: No skip navigation link"

# Lang attribute
grep -q 'lang="en"' dashboard/index.html && echo "OK: lang attribute set" || echo "FAIL: Missing lang attribute"

# Alt text on images (if any)
grep '<img' dashboard/index.html | grep -v 'alt=' && echo "FAIL: Images without alt text" || echo "OK: All images have alt text (or no images)"

# Focus-visible styles
grep -q 'focus-visible\|:focus' dashboard/index.html && echo "OK: Focus styles present" || echo "WARN: No focus-visible styles"

# Color not sole indicator
grep -q 'sr-only\|visually-hidden\|screen-reader' dashboard/index.html && echo "OK: Screen reader text found" || echo "INFO: Check that color is not the only status indicator"

echo "=== A11y audit complete ==="
```

### Step 9.2: CX Review (Lead evaluates)

Evaluate the dashboard against these CX dimensions (score 1-5 each):

1. **First Impression**: Does the purpose hit you in 3 seconds?
2. **Cognitive Load**: Can you scan the health bar without thinking?
3. **Information Architecture**: Is the most important info above the fold?
4. **Interactivity**: Do the test runner buttons feel responsive?
5. **Error Resilience**: What happens if a test suite fails to run?

Ship threshold: average ≥ 4.0, no dimension below 3.

### Step 9.3: Display status

```
═══════════════════════════════════════════════════
  PHASE 9: A11Y + CX — [PASSED ✅ / NEEDS WORK 🟡]
  A11y: {N}/{T} checks passed
  CX Score: {avg}/5.0
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 9: ✅ A11y + CX`

---

## PHASE 10: RUNTIME VALIDATION

The final proof. Sentinel starts the server and verifies it works.

### Step 10.1: Spawn Sentinel for Phase 8

```
Agent({
  team_name: "integration-proof",
  subagent_type: "sentinel",
  name: "sentinel-final",
  prompt: "Run ONLY Phase 8 from your agent definition — the Observatory Health Check.\n\nStart the server on port 13579, hit every API endpoint, verify valid JSON responses, check HTML serves correctly, then stop the server.\n\nThis is the final gate. If everything returns valid JSON and the HTML serves, message the lead: 'PHASE 8 PASSED — Observatory is operational.'\n\nIf any endpoint fails, message the lead with exact failures: 'PHASE 8 FAILED — {details}'",
  run_in_background: false
})
```

### Step 10.2: Display status

```
═══════════════════════════════════════════════════
  PHASE 10: RUNTIME VALIDATION — [PASSED ✅ / FAILED 🔴]
═══════════════════════════════════════════════════
```

Update phase tracking: `Phase 10: ✅ Runtime Validation`

---

## PHASE 11: DOCUMENTATION (Technical Writer)

### Step 11.1: Spawn Technical Writer

```
Agent({
  team_name: "integration-proof",
  subagent_type: "technical-writer",
  name: "technical-writer",
  model: "haiku",
  prompt: "The APEX Observatory has been built and verified. Update documentation:\n1. Update CHANGELOG.md with the Observatory feature\n2. Update README.md if it references the dashboard or self-test\n3. Ensure docs/prd/apex-observatory.md and docs/architecture/apex-observatory.md are referenced\n\nMessage lead when done.",
  run_in_background: true
})
```

---

## CLEANUP + VERDICT

### Clean up the team

```
TeamDelete({ team_name: "integration-proof" })
```

### Display the final verdict

If ALL 10 phases passed:
```
╔══════════════════════════════════════════════════╗
║                                                  ║
║  🦇 THE DARK KNIGHT'S VERDICT                   ║
║                                                  ║
║  Integration Proof: COMPLETE                     ║
║                                                  ║
║  ✅ Phase 1:  Structural Audit — PASSED          ║
║  ✅ Phase 2:  PRD — WRITTEN                      ║
║  ✅ Phase 3:  Architecture — WRITTEN             ║
║  ✅ Phase 4:  Research — VERIFIED                ║
║  ✅ Phase 5:  Build — COMPLETE                   ║
║  ✅ Phase 6:  Design Review — APPROVED           ║
║  ✅ Phase 7:  QA — APPROVED                      ║
║  ✅ Phase 8:  Security — PASSED                  ║
║  ✅ Phase 9:  A11y + CX — PASSED                 ║
║  ✅ Phase 10: Runtime Validation — OPERATIONAL   ║
║                                                  ║
║  The APEX Observatory is live at localhost:3000   ║
║  Run: node dashboard/server.js                   ║
║                                                  ║
║  Gotham is safe. The framework works. ⚔️          ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

If issues remain:
```
╔══════════════════════════════════════════════════╗
║                                                  ║
║  🦇 THE DARK KNIGHT'S VERDICT                   ║
║                                                  ║
║  Integration Proof: INCOMPLETE                   ║
║                                                  ║
║  {phase statuses with ✅/🔴}                     ║
║                                                  ║
║  {N} phases passed. {M} need attention.          ║
║  Review tasks for details.                       ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

---

## The Breathing Loop (during Build)

```
Builder implements → Watcher catches errors → Lead creates Debugger task
     ↓                                              ↓
Design Reviewer checks UI → issues? → Builder fixes → re-review
     ↓
QA runs 6-phase gate → BLOCKED? → Builder fixes → QA re-verifies
     ↓
Security → A11y → CX → Sentinel runtime check
     ↓
All green → Gotham is safe
```

If any review phase returns issues, spawn the Builder to fix them, then re-run that phase. This is the breathing loop — it continues until every gate passes or the Lead determines the issue requires human intervention.
