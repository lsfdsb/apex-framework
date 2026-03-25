---
name: teams
description: Spawn and manage agent teams for parallel work. Auto-selects team composition based on the task. Use when the user says "team", "spawn team", "parallel", "agents work together", "swarm", or when a task is complex enough to benefit from multiple agents working simultaneously.
argument-hint: "[task description or team preset: build, review, fix, full]"
allowed-tools: Read, Grep, Glob, Bash, Agent, TeamCreate, TeamDelete, TaskCreate, TaskUpdate, TaskList, SendMessage
---

# Agent Teams — The Championship Roster

> "Talent wins games, but teamwork and intelligence win championships." — Michael Jordan

## Quick Start (TL;DR)

```
/teams build   → PM + Watcher + Builder + QA + Tech Writer
/teams fix     → Watcher + Builder + QA + Tech Writer
/teams review  → QA + Tech Writer
/teams full    → All 5 agents (championship roster)
```

**How it works**: Lead spawns team → agents auto-claim tasks from TaskList → Breathing Loop runs:
`Builder creates → Watcher monitors → Builder fixes → QA verifies → loop`

**3 rules**: (1) Watcher always first, (2) Default isolation: none, (3) Technical Writer before every PR.

---

## Current Context

Branch: !`git branch --show-current 2>/dev/null`
Status: !`git status --short 2>/dev/null | head -10`
Recent work: !`git log --oneline -5 2>/dev/null`

## What This Skill Does

Spawns a coordinated team of specialist agents that work in parallel — like a championship roster where every player has a defined role, and the team is greater than the sum of its parts.

## The Roster

Every agent is elite at one thing. No redundancy. Clear separation of concerns.

| Role | Agent | Model | Mode | Purpose |
|------|-------|-------|------|---------|
| **Lead** | main session | opus | — | Orchestrates, delegates, makes final decisions |
| **PM** | project-manager | sonnet | none | Decomposes PRD+Arch into phased task board |
| **Builder** | builder | sonnet | **none** | Implements features — writes directly to project |
| **Watcher** | watcher | haiku | background | Continuous monitoring — catches every error |
| **QA** | qa | sonnet | none | Runs full quality gate, blocks bad code |
| **Technical Writer** | technical-writer | haiku | background | Keeps CHANGELOG, README, docs in sync |

> **Worktree policy (v5.16+):** Default isolation is `none` — agents write directly to the project. Only use `isolation: worktree` when spawning 2+ builders that modify the SAME files in parallel. Worktrees have caused data loss in 6+ sessions. `isolation: none` eliminates this risk entirely.

## Team Presets

### `build` — Implementation Team
Best for: New features, refactoring, migrations
- **PM** (sonnet, none) — Decomposes PRD+Arch into phased task board
- **Watcher** (haiku, background) — Monitors continuously
- **Builder** (sonnet, none) — Implements the feature directly
- **QA** (sonnet, none) — Tests when Builder finishes
- **Technical Writer** (haiku, background) — Updates CHANGELOG, README when done

### `fix` — Bug Fix Team
Best for: Bug reports, error resolution, production issues
- **Watcher** (haiku, background) — Reproduces and monitors the issue
- **Builder** (sonnet, none) — Root cause analysis and fix
- **QA** (sonnet, none) — Verifies the fix is definitive
- **Technical Writer** (haiku, background) — Documents the fix

### `review` — Review Team
Best for: PR review, pre-merge checks, code audit
- **QA** (sonnet, none) — Runs full quality gate
- **Technical Writer** (haiku, background) — Verifies docs are current

### `full` — Championship Team
Best for: Major features, end-to-end delivery, critical paths
- **PM** (sonnet, none) — Decomposes PRD+Arch into phased task board
- **Watcher** (haiku, background) — Continuous monitoring from first second
- **Builder** (sonnet, none) — Implements the feature
- **QA** (sonnet, none) — Full quality gate on everything
- **Technical Writer** (haiku, background) — Updates CHANGELOG, README, docs

## The Breathing Loop — Self-Maintaining Autonomy

The framework *breathes* when the team operates as a continuous cycle without human intervention:

```
    ┌──────────────────────────────────────────────┐
    │                                              │
    │   ┌──────────┐    ┌───────────┐              │
    │   │ WATCHER  │───▶│  BUILDER  │              │
    │   │ (detect) │    │  (fix)    │              │
    │   └──────────┘    └─────┬─────┘              │
    │        ▲                │                    │
    │        │                ▼                    │
    │        │           ┌───────────┐  ┌────────┐ │
    │        └───────────│    QA     │  │ WRITER │ │
    │                    │ (verify)  │─▶│ (docs) │ │
    │                    └───────────┘  └────────┘ │
    │                                              │
    │           THE BREATHING LOOP                 │
    └──────────────────────────────────────────────┘
```

### How it works (Kanban Flow):

**Columns**: `todo` → `in-progress` → `needs-review` → `approved` → `done`

1. **Lead creates tasks** in `todo` with dependencies (addBlockedBy)
2. **Builder claims** from `todo`, moves to `in-progress`
3. **Builder completes** → auto-creates QA task in `needs-review` (task chaining)
4. **QA claims** from `needs-review` → verifies → moves to `approved` or back to `todo`
5. **Technical Writer** updates CHANGELOG inline (not a separate step — embedded in commit flow)
6. **Watcher** monitors continuously, creates bug tasks in `todo` when issues detected
7. **Lead** makes the ship decision when all tasks reach `done`

### Task Chaining (Automatic)

When a builder marks a task complete, the lead MUST auto-create the next pipeline task:

```
Builder completes "[build] Add auth page"
  → Lead creates "[qa] Verify auth page" (addBlockedBy: [build-task-id])
  → QA auto-claims the verification task

QA approves "[qa] Verify auth page"
  → Task moves to done
  → If more build tasks remain, loop continues
```

This eliminates the gap where builders finish but QA never picks up.

### WIP Limits (Enforced by Lead)

| Role | Max In-Progress | Why |
|------|----------------|-----|
| Builder | 2 | Prevents builder sprawl — finish before starting new work |
| QA | 1 | QA must focus — one verification at a time |
| Writer | 1 | Docs are sequential |

**Before creating a new builder task**: Check TaskList. If 2+ builder tasks are `in_progress`, do NOT create another. Wait for one to complete.

**Backpressure**: If `needs-review` has 2+ unverified tasks, builders MUST stop creating new work and help clear the review queue (fix QA-blocked issues first).

### Auto-Retry

If a builder task fails (BLOCKED by QA):
1. First failure: Re-assign to same builder with QA feedback
2. Second failure: Re-assign to a different builder (or lead writes directly)
3. Track retry count in task metadata: `{ "retries": 1 }`

### Post-Builder Verification (CRITICAL)

After ANY builder agent completes:

1. **Check the builder's completion message** — it MUST include a branch name and commit hash
2. **If no commit hash**: Files are LOST. Re-spawn builder with `isolation: none`
3. **Merge files** (use checkout, NOT git merge — avoids untracked file conflicts):
   ```bash
   git checkout <builder-branch> -- src/ # checkout specific dirs from builder's branch
   git add src/                          # stage the new files
   ```
4. **Verify files exist**: `ls -la` on every file the builder listed
5. **If files are missing but branch exists**: `git show <branch>:<path> > <path>` to recover

### When Builders Fail — Recovery Protocol

**Do NOT rewrite files yourself.** The lead is Opus — too expensive for Sonnet work. Instead:

1. Re-spawn a new builder with **no worktree isolation**:
   ```
   Agent({
     subagent_type: "builder",
     isolation: none,  // ← NO WORKTREE — writes directly to main project
     prompt: "... same task ..."
   })
   ```
2. Only use `isolation: worktree` when multiple builders work in parallel on conflicting files
3. For single-builder tasks, `isolation: none` is safer and faster

### Stale Worktree Cleanup

Run periodically (or at session end):
```bash
git worktree prune
rm -rf .claude/worktrees/agent-*
```

### Branch Management — Lead Only

**Builders NEVER create branches.** With `isolation: none`, the builder writes directly to whatever branch the lead has checked out. Branch creation, switching, and merging are the lead's responsibility.

If a builder creates a branch anyway (bug or bad prompt), the lead must:
1. `git checkout <builder-branch> -- <files>` to pull the files
2. `git branch -D <builder-branch>` to clean up
3. Commit on the correct branch

This prevents the cherry-pick-on-dirty-tree problem that occurs when builders create orphan branches.

### Key principle: No human intervention needed in the loop

- Watcher monitors continuously — no assignment needed
- Builder auto-claims bugs from the task list
- QA auto-verifies when Builder reports "fix ready" — no manual /qa
- If QA rejects, a new task is created and Builder picks it up automatically
- The loop keeps breathing until everything is green

## Scan Responsibility Matrix (No Duplication)

Each check has ONE owner. No two agents scan the same thing.

| Check | Owner | Others |
|-------|-------|--------|
| Build/compile errors | **Watcher** (continuous) | QA (final gate) |
| Test failures | **Watcher** (continuous) | QA (final gate) |
| console.log in production | **Watcher** | — |
| Type `any` usage | **Watcher** | — |
| File size > 300 lines | **Watcher** | — |
| Function size > 30 lines | **Watcher** | — |
| Hardcoded secrets | **Watcher** | Security hook (PreToolUse) |
| Hardcoded Tailwind colors | **QA** (phase 1) | — |
| Design DNA compliance | **QA** (phase 4) | — |
| Branding sweep | **QA** (phase 1) | — |
| Responsive/mobile-first | **QA** (phase 4) | — |
| Accessibility (WCAG) | **QA** (phase 4) | — |
| Performance (N+1, bundle) | **QA** (phase 5) | — |
| Security (OWASP) | **QA** (phase 6) | — |
| Logic correctness | **QA** (phase 2) | — |
| Code quality/patterns | **QA** (phase 1) | — |

**Rule**: Watcher does continuous delta monitoring. QA does the comprehensive final gate covering all dimensions. No overlap.

## Auto-Spawn Logic

If no preset is specified, analyze the task and auto-select:

| Signal | Preset | Why |
|--------|--------|-----|
| "build", "implement", "create", "add", "feature" | `build` | Construction work |
| "fix", "bug", "error", "broken", "debug" | `fix` | Defensive work |
| "review", "PR", "check", "audit" | `review` | Verification work |
| Multi-file, multi-concern, major feature | `full` | Championship game |
| Simple, single-file, quick change | none | Don't over-staff |

## Orchestration Workflow

**CRITICAL: You MUST use TeamCreate to create a team. Do NOT use regular Agent() calls — those are subagents, not teammates. Only TeamCreate teammates get split panes and inter-agent messaging.**

### Step 1: Create the Team (REQUIRED)

Call the TeamCreate tool FIRST. This is not optional:

```
TeamCreate({ team_name: "feat-landing-page", description: "Build landing page" })
```

### Step 2: Create Tasks

Break the work into discrete tasks using TaskCreate:
- Each task should be completable by one agent
- Set dependencies with addBlockedBy where needed
- Include enough context for the agent to work independently

### Step 3: Spawn Teammates (order matters)

**IMPORTANT: Use the Agent tool with `team_name` parameter to spawn TEAMMATES (not subagents).**

Spawn in this order:

1. **Watcher FIRST** — monitoring must start before any changes
2. **Builder** — the primary worker
3. **QA** — ready to verify as work completes
4. **Technical Writer** — documents as work ships

Each teammate MUST have `team_name` set:

```
Agent({
  team_name: "feat-landing-page",
  name: "watcher",
  subagent_type: "watcher",
  prompt: "Monitor the project for errors. Run build, tests, lint.",
  run_in_background: true
})

Agent({
  team_name: "feat-landing-page",
  name: "builder",
  subagent_type: "builder",
  prompt: "Implement the landing page with hero, features grid, and CTA.
    DESIGN DNA: Read docs/design-dna/landing.html FIRST.
    Extract the palette, fonts, and patterns before writing ANY code.
    globals.css must match the DNA palette exactly."
})

Agent({
  team_name: "feat-landing-page",
  name: "qa",
  subagent_type: "qa",
  prompt: "Run QA gate on all completed tasks."
})
```

**Without `team_name`, agents spawn as subagents (no split panes, no messaging).**

### Step 4: The Handoff Chain

The autonomous handoff chain ensures work flows without manual intervention:

```
Builder completes task
  → Lead sends message to QA: "Task #{id} ready for verification"
  → QA runs quality gate
  → If APPROVED: Lead proceeds to ship
  → If BLOCKED: Lead creates bug task → Builder auto-claims it
```

```
Watcher detects issue
  → Watcher creates task with [bug] tag
  → Watcher messages Lead: "Issue detected: {summary}"
  → Builder auto-claims the bug task
  → Builder fixes → messages QA
  → QA verifies → reports to Lead
```

### Step 5: Aggressive Parallelism

The key APEX principle: **don't wait unnecessarily.**

- Builder starts implementing immediately
- Watcher monitors from the first second
- Multiple Builders can work on independent tasks simultaneously
- QA starts verification the moment any task completes
- Technical Writer updates docs in parallel with QA

### Step 6: Shutdown

When all tasks are complete and QA approved:
1. Send shutdown_request to each teammate (Watcher last — it monitors until the end)
2. Wait for confirmations
3. Call TeamDelete to clean up

## Communication Rules

- **Direct messages** for task-specific communication (SendMessage to name)
- **Broadcast** (`to: "*"`) ONLY for critical blocking issues — it's expensive
- **Tasks** are the source of truth for work status (not messages)
- **Be patient** with idle teammates — idle means waiting for input, not broken
- **Teammates can DM each other** — Builder can message QA directly

### Standardized Message Format

ALL agents must use this structure when messaging the lead:

```
[EMOJI] **[Action]** — Task #{id}

**Status**: [what happened]
**Details**: [specifics — files, commands, findings]
**Next**: [what should happen next]
```

| Agent | Emoji | Action Examples |
|-------|-------|----------------|
| Watcher | 🔍 | Watcher Report, Issue Detected, All Clear |
| Builder | ✅ | Task Complete, Bug Fix Complete, Blocked |
| QA | 📋 | QA Report, APPROVED, BLOCKED |
| Technical Writer | 📝 | Docs Updated, Breaking Change Detected |

### Timeout and Escalation Rules

Every teammate MUST follow these escalation rules:

| Condition | Action |
|-----------|--------|
| **Stuck > 3 turns** on the same issue | Message lead: "Blocked on {issue}, tried {approaches}" |
| **Stuck > 5 turns** | Stop work, message lead: "Need help, escalating" |
| **Command hangs > 60s** | Kill it, report timeout, try alternative approach |
| **Agent error / crash** | Lead detects via SubagentStop hook, respawns if needed |
| **Conflicting instructions** | Ask lead for clarification, don't guess |
| **Security issue found** | Immediately message lead, create CRITICAL task, do NOT continue |

## Example: Full Championship Team

```
User: "Build the authentication flow with OAuth"

 1. TeamCreate: team_name="feat-auth-flow"

 2. Create tasks:
    [research] "Research OAuth providers and best practices"
    [impl] "Implement OAuth login endpoint" (blocked by research)
    [impl] "Implement OAuth callback handler" (blocked by login)
    [impl] "Add session management middleware"
    [test] "Write auth integration tests"
    [review] "Security review of all auth code" (blocked by impl tasks)

 3. Spawn order:
    → watcher (background) — starts monitoring immediately
    → builder (none) — implements the feature directly
    → qa (none) — verifies each task as completed

 4. The breathing loop runs:
    watcher detects error → creates bug task → builder fixes it
    builder completes endpoint → qa verifies
    qa finds edge case → creates task → builder fixes → qa re-verifies
    all green → qa approves → lead ships
```

## Rules

1. **Watcher is always first** — Start monitoring before any changes
2. **Tasks before teammates** — Create the task list, then spawn agents
3. **One task per agent at a time** — Let agents claim work sequentially
4. **Default isolation: none** — Agents write directly to project (worktree only for 2+ parallel conflicting builders)
5. **Auto-handoff** — Builder→QA chain runs without manual triggers
6. **Builder handles bugs too** — Same agent that builds also fixes issues
7. **QA blocks ruthlessly** — If it's not ready, it doesn't ship
8. **No orphans** — Always shutdown teammates and delete team when done
9. **Right-size the team** — Don't spawn `full` for a bug fix
10. **The loop breathes** — Detect→Fix→Verify→Ship runs autonomously
11. **Verify after build** — After ANY builder completes, verify files exist in main project before proceeding
12. **Design review on UI** — If the task creates .tsx/.jsx files, QA MUST check Design DNA compliance
13. **QA is a gate, not optional** — No task is marked complete without QA verification. If QA wasn't invoked, the task is NOT done
14. **Verify APIs before integration** — If a task involves external APIs, use WebSearch to verify docs BEFORE builder starts
