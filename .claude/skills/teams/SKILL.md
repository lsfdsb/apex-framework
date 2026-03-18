---
name: teams
description: Spawn and manage agent teams for parallel work. Auto-selects team composition based on the task. Use when the user says "team", "spawn team", "parallel", "agents work together", "swarm", or when a task is complex enough to benefit from multiple agents working simultaneously.
argument-hint: "[task description or team preset: build, review, fix, full]"
allowed-tools: Read, Grep, Glob, Bash, Agent, TeamCreate, TeamDelete, TaskCreate, TaskUpdate, TaskList, SendMessage
---

# Agent Teams — The Championship Roster

> "Talent wins games, but teamwork and intelligence win championships." — Michael Jordan

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
| **Builder** | builder | sonnet | worktree | Implements features and writes code |
| **Watcher** | watcher | haiku | background | Continuous monitoring — catches every error |
| **Debugger** | debugger | sonnet | worktree | Hunts bugs to root cause, fixes permanently |
| **QA** | qa | sonnet | worktree | Runs full quality gate, blocks bad code |
| **Code Reviewer** | code-reviewer | sonnet | worktree | Deep code review for quality and security |
| **Design Reviewer** | design-reviewer | sonnet | plan | UI/UX and accessibility review |
| **Technical Writer** | technical-writer | haiku | default | Keeps CHANGELOG, README, docs in sync |
| **Researcher** | researcher | haiku | background | API/docs investigation |
| **Sentinel** | sentinel | sonnet | worktree | The Dark Knight — /self-test, /batman |

## Team Presets

### `build` — Implementation Team
Best for: New features, refactoring, migrations
- **Watcher** (haiku, background) — Monitors continuously
- **Builder** (sonnet, worktree) — Implements the feature
- **QA** (sonnet, worktree) — Tests when Builder finishes

### `fix` — Bug Fix Team
Best for: Bug reports, error resolution, production issues
- **Watcher** (haiku, background) — Reproduces and monitors the issue
- **Debugger** (sonnet, worktree) — Root cause analysis and fix
- **QA** (sonnet, worktree) — Verifies the fix is definitive

### `review` — Review Team
Best for: PR review, pre-merge checks, code audit
- **Code Reviewer** (sonnet, worktree) — Deep code review
- **Design Reviewer** (sonnet) — UI/UX review (if frontend changes)
- **QA** (sonnet, worktree) — Runs tests in parallel

### `full` — Championship Team
Best for: Major features, end-to-end delivery, critical paths
- **Watcher** (haiku, background) — Continuous monitoring from first second
- **Researcher** (haiku, background) — Investigates APIs/docs in parallel
- **Builder** (sonnet, worktree) — Implements the feature
- **Debugger** (sonnet, worktree) — Fixes issues caught by Watcher
- **QA** (sonnet, worktree) — Full quality gate on everything
- **Code Reviewer** (sonnet, worktree) — Final code review
- **Technical Writer** (haiku) — Updates CHANGELOG, README, docs

## The Breathing Loop — Self-Maintaining Autonomy

The framework *breathes* when the team operates as a continuous cycle without human intervention:

```
    ┌──────────────────────────────────────────────┐
    │                                              │
    │   ┌──────────┐    ┌───────────┐              │
    │   │ WATCHER  │───▶│ DEBUGGER  │              │
    │   │ (detect) │    │  (fix)    │              │
    │   └──────────┘    └─────┬─────┘              │
    │        ▲                │                    │
    │        │                ▼                    │
    │   ┌────┴─────┐    ┌───────────┐  ┌────────┐ │
    │   │  BUILDER │    │    QA     │  │ WRITER │ │
    │   │ (create) │◀───│ (verify)  │─▶│ (docs) │ │
    │   └──────────┘    └───────────┘  └────────┘ │
    │                                              │
    │           THE BREATHING LOOP                 │
    └──────────────────────────────────────────────┘
```

### How it works:

1. **Builder** creates code → marks task complete
2. **Watcher** continuously monitors → detects issues → creates bug tasks
3. **Debugger** claims bug tasks → fixes root cause → notifies QA
4. **QA** verifies the fix → if APPROVED, marks complete. If BLOCKED, creates new task → loops back
5. **Code Reviewer** does final review when all QA passes
6. **Lead** makes the ship decision

### Key principle: No human intervention needed in the loop

- Watcher doesn't wait for someone to ask — it monitors continuously
- Debugger auto-claims bugs from the task list — no assignment needed
- QA auto-verifies when Debugger reports "fix ready" — no manual /qa
- If QA rejects, a new task is created and Debugger picks it up automatically
- The loop keeps breathing until everything is green

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

### Step 1: Create the Team

```
TeamCreate with team_name based on the task (e.g., "feat-auth-flow", "fix-login-bug")
```

### Step 2: Create Tasks

Break the work into discrete tasks using TaskCreate:
- Each task should be completable by one agent
- Set dependencies with addBlockedBy where needed
- Include enough context for the agent to work independently
- Tag tasks by type: `[impl]`, `[bug]`, `[test]`, `[review]`

### Step 3: Spawn Teammates (order matters)

**Always spawn in this order:**

1. **Watcher FIRST** — monitoring must start before any changes
2. **Researcher** (if needed) — background research starts early
3. **Builder or Debugger** — the primary workers
4. **QA** — ready to verify as work completes
5. **Code Reviewer** — final pass

Spawn agents using the Agent tool with:
- `team_name` — links them to the team
- `name` — their role name (e.g., "watcher", "builder", "debugger", "qa")
- `subagent_type` — matches their agent definition name
- `run_in_background: true` for Watcher and Researcher

### Step 4: The Handoff Chain

The autonomous handoff chain ensures work flows without manual intervention:

```
Builder completes task
  → Lead sends message to QA: "Task #{id} ready for verification"
  → QA runs quality gate
  → If APPROVED: Lead notifies Code Reviewer for final review
  → If BLOCKED: Lead creates bug task → Debugger auto-claims it
```

```
Watcher detects issue
  → Watcher creates task with [bug] tag
  → Watcher messages Lead: "Issue detected: {summary}"
  → Lead assigns to Debugger (or Debugger auto-claims)
  → Debugger fixes → messages QA
  → QA verifies → reports to Lead
```

### Step 5: Aggressive Parallelism

The key APEX principle: **don't wait unnecessarily.**

- Builder starts implementing immediately
- Watcher monitors from the first second
- Researcher runs alongside Builder when docs are needed
- Multiple Builders can work on independent tasks simultaneously
- QA starts verification the moment any task completes
- Debugger and Builder can work in parallel on different tasks
- Code Reviewer starts on completed+verified work while Builder continues on next task

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
- **Teammates can DM each other** — Debugger can message QA directly

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
| Builder | ✅ | Task Complete, Blocked, Starting Task |
| Debugger | 🔧 | Bug Fix Complete, Investigating, Blocked |
| QA | 📋 | QA Report, APPROVED, BLOCKED |
| Code Reviewer | 🔍 | Code Review, APPROVED, CHANGES REQUESTED |
| Design Reviewer | 🎨 | Design Review, APPROVED, CHANGES REQUESTED |
| Technical Writer | 📝 | Docs Updated, Breaking Change Detected |
| Researcher | 📚 | Research Complete, Inconclusive |

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
    → researcher (background) — starts on research task
    → builder (worktree) — waits for research, then builds
    → debugger (worktree) — standby, auto-claims any bugs
    → qa (worktree) — verifies each task as completed
    → code-reviewer (worktree) — final review when QA passes

 4. The breathing loop runs:
    researcher completes → builder starts implementing
    watcher detects type error → creates bug task → debugger fixes it
    builder completes endpoint → qa verifies → code-reviewer reviews
    qa finds edge case → creates task → debugger fixes → qa re-verifies
    all green → code-reviewer approves → lead ships
```

## Rules

1. **Watcher is always first** — Start monitoring before any changes
2. **Tasks before teammates** — Create the task list, then spawn agents
3. **One task per agent at a time** — Let agents claim work sequentially
4. **Worktree isolation for writers** — Builder, Debugger in worktrees
5. **Auto-handoff** — Builder→QA→Reviewer chain runs without manual triggers
6. **Debugger auto-claims bugs** — No assignment needed for [bug] tasks
7. **QA blocks ruthlessly** — If it's not ready, it doesn't ship
8. **No orphans** — Always shutdown teammates and delete team when done
9. **Right-size the team** — Don't spawn `full` for a bug fix
10. **The loop breathes** — Detect→Fix→Verify→Ship runs autonomously
