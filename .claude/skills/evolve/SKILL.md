---
name: evolve
description: Evolve the APEX Framework based on real session usage. Spawns the framework-evolver agent to analyze the current session for gaps, friction, and improvements — then asks for authorization before applying changes. Use when the user says "evolve", "improve framework", "session review", "what could be better", "framework gaps", or proactively at the end of productive sessions.
context: fork
---

# APEX Evolve — Framework Self-Improvement

ultrathink

You are about to run the APEX self-improvement cycle. This is one of the most powerful features of the framework: **it gets better every time you use it.**

## Process

### Step 1: Spawn the Framework Evolver Agent

Use the Agent tool to spawn the `framework-evolver` agent with this prompt:

```
Analyze the current session and the APEX framework for improvement opportunities.

CRITICAL FIRST STEP — Read the full session transcript:
1. Run `bash .claude/scripts/extract-session.sh 1000` to get the complete conversation
   (user prompts, Claude responses, tool calls, errors, thinking)
2. Analyze the transcript for: repeated questions, errors, course corrections,
   manual work that could be automated, slow loops, friction points

THEN cross-reference against the framework:
3. Run `git log --oneline -20` to see what was done this session
4. Run `git diff --stat HEAD~5` to see scope of recent changes
5. Read all hook scripts in .claude/scripts/
6. Read all skills in .claude/skills/ (SKILL.md files)
7. Read all agents in .claude/agents/
8. Read .claude/settings.json
9. Read .claude/rules/ files
10. Check for patterns of gaps, false positives, or missing coverage

Produce a full APEX Evolution Report following your output format.
Focus on EVIDENCE from the transcript, not hypothetical improvements.
```

### Step 2: Present Findings to the User

After the agent returns its report, present it to the user in a clear, educational format:

1. Show the **Framework Health Score** first (the headline)
2. List each finding with its risk level, explanation, and proposed fix
3. Group by priority: High-risk first, then quick wins, then backlog
4. Be transparent about trade-offs for each proposal

### Step 3: Ask for Authorization

For each proposed change, explicitly ask the user:

```
Proposed changes:

1. [Change description] — [file] — Risk: [Low/Med/High]
2. [Change description] — [file] — Risk: [Low/Med/High]
3. ...

Which changes should I apply? (all / numbers / none)
```

**NEVER apply changes without explicit user approval.**

### Step 4: Apply Approved Changes

For each approved change:
1. Read the target file first (never blind-edit)
2. Make the change
3. Explain what was changed and why
4. Verify the change doesn't break anything (run tests if applicable)

### Step 5: Update the Framework

After all changes are applied:

1. Bump the patch version in the `VERSION` file (e.g., 5.6.0 → 5.6.1)
2. Commit with message: `feat(evolve): [brief description of improvements]`
3. Ask the user if they want to push to GitHub (so auto-update propagates to other projects)

### Step 6: Log the Evolution

Add an entry to the evolution log so we can track framework growth over time:

```bash
# Append to ~/.apex-framework/evolution.log
echo "[date] v[old] → v[new] | [count] changes | [brief summary]" >> ~/.apex-framework/evolution.log
```

## Autonomous Mode — Periodic Evolution

The user can set `/evolve` to run autonomously at intervals using `/loop`:

```
/loop 30m /evolve
```

This triggers a background evolution check every 30 minutes during active sessions. When running autonomously:

1. **Silent analysis** — The agent runs in the background, reads the session transcript
2. **Threshold filter** — Only surface findings that are **Medium or High risk**. Don't interrupt for cosmetic/Low issues.
3. **Batch presentation** — Accumulate findings and present them at natural breakpoints (after a commit, after a task completes), never mid-task
4. **Smart timing** — If the user is actively typing/working, queue findings. Present when there's a pause.
5. **Deduplication** — Check memory for previously proposed/rejected findings. Don't re-propose rejected items.

### Rationale for Autonomous Evolution

The best time to catch framework gaps is **during the session that exposes them**, not after. Running periodically means:
- Friction points are caught while context is fresh
- The framework adapts to the user's evolving workflow in real-time
- Small improvements compound — 3 micro-fixes per session = massive improvement over weeks
- The user builds muscle memory for approving/rejecting improvements

### When NOT to run autonomously
- During time-critical deployments (check if `/deploy` is active)
- If the session has < 10 interactions (not enough data)
- If the user has explicitly said "no more evolve" or "stop improving"

## Rules

- **User is always in control** — Propose, explain, get approval, then act
- **Explain like a teacher** — Every change should make the user understand the framework better
- **Small, safe changes** — Prefer many small improvements over one big refactor
- **Evidence over opinion** — Only propose changes backed by session evidence
- **Preserve philosophy** — Changes must align with APEX principles (Ive, Torvalds, Ionescu, Amodei)
- **No regressions** — Verify that changes don't break existing hooks, skills, or workflows
- **Respect flow state** — Never interrupt the user mid-task. Queue and present at breakpoints.
