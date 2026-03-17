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

1. Run `git log --oneline -20` to see what was done this session
2. Run `git diff --stat HEAD~5` to see scope of recent changes
3. Read all hook scripts in .claude/scripts/
4. Read all skills in .claude/skills/ (SKILL.md files)
5. Read all agents in .claude/agents/
6. Read .claude/settings.json
7. Read .claude/rules/ files
8. Check for patterns of friction, gaps, false positives, or missing coverage

Produce a full APEX Evolution Report following your output format.
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

1. Bump the patch version in the `VERSION` file (e.g., 5.5.0 → 5.5.1)
2. Commit with message: `feat(evolve): [brief description of improvements]`
3. Ask the user if they want to push to GitHub (so auto-update propagates to other projects)

### Step 6: Log the Evolution

Add an entry to the evolution log so we can track framework growth over time:

```bash
# Append to ~/.apex-framework/evolution.log
echo "[date] v[old] → v[new] | [count] changes | [brief summary]" >> ~/.apex-framework/evolution.log
```

## Rules

- **User is always in control** — Propose, explain, get approval, then act
- **Explain like a teacher** — Every change should make the user understand the framework better
- **Small, safe changes** — Prefer many small improvements over one big refactor
- **Evidence over opinion** — Only propose changes backed by session evidence
- **Preserve philosophy** — Changes must align with APEX principles (Ive, Torvalds, Ionescu, Amodei)
- **No regressions** — Verify that changes don't break existing hooks, skills, or workflows
