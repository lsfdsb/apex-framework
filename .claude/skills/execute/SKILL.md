---
name: execute
description: Use when you have a written implementation plan to execute task-by-task with review checkpoints. Also use when the user says "execute plan", "run the plan", "implement this plan", "start building", or after /plan creates a plan document.
argument-hint: '[plan file path]'
allowed-tools: Read, Grep, Glob, Bash, Agent, TaskCreate, TaskUpdate, TaskList, SendMessage
---

# Executing Plans

> "I have spoken." — and the plan has been written. Now we execute.

Load plan, review critically, execute all tasks, verify each, report when complete.

## The Process

### Step 1: Load and Review Plan

1. Read plan file
2. Review critically — identify questions or concerns
3. If concerns: raise with user before starting
4. If no concerns: create tasks and proceed

### Step 2: Execute Tasks

For each task:

1. Mark as `in_progress`
2. Follow each step exactly (plan has bite-sized steps)
3. Use `/tdd` — write failing test, watch it fail, implement, verify green
4. Use `/verify` — run verifications, read output, confirm pass
5. Commit after each task
6. Mark as `completed`

### Step 3: Review Checkpoints

After every 3 completed tasks (or at natural boundaries):

1. Run full test suite — `/verify` that everything still passes
2. Review what was built against the spec
3. If anything drifted from plan, note it and correct
4. Continue to next batch

### Step 4: Complete Development

After all tasks complete and verified:

1. Run full test suite one final time
2. Use `/request-review` for code review if significant changes
3. Use `/ship` to handle branch completion, PR, and merge

## When to Stop and Ask

**STOP immediately when:**

- Hit a blocker (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing progress
- You don't understand an instruction
- Verification fails repeatedly (use `/debug` to investigate)

**Ask for clarification rather than guessing.**

## When 3+ Tasks Fail

If the same kind of failure keeps happening:

- STOP — this is a plan problem, not an execution problem
- Return to `/plan` and revise the approach
- Or use `/debug` to investigate the root cause

## Integration

- **Preceded by** `/plan` (creates the plan this skill executes)
- **Uses** `/tdd` for every implementation step
- **Uses** `/verify` before every completion claim
- **Uses** `/debug` when things break
- **Followed by** `/request-review` and `/ship`
- **Alternative** `/teams` for parallel execution with multiple agents
