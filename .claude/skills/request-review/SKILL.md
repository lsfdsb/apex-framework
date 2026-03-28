---
name: request-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements. Also use when the user says "review this", "code review", "check my work", "is this ready to merge", or after completing a significant implementation.
argument-hint: '[what to review]'
allowed-tools: Read, Grep, Glob, Bash, Agent, TaskCreate, TaskUpdate, TaskList
---

# Requesting Code Review

> "The Creed is the Way." — review early, review often.

Dispatch the code-reviewer agent to catch issues before they cascade. The reviewer gets precisely crafted context — never your session's history.

## When to Request

**Mandatory:**

- After completing a major feature or task batch
- Before merge to main
- After all tasks in a plan complete

**Optional but valuable:**

- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing a complex bug

## How to Request

### 1. Get Git Range

```bash
BASE_SHA=$(git merge-base HEAD main 2>/dev/null || git rev-parse HEAD~3)
HEAD_SHA=$(git rev-parse HEAD)
```

### 2. Dispatch Code-Reviewer Agent

```
Agent({
  subagent_type: "code-reviewer",
  description: "Review [feature] implementation",
  prompt: "Review the implementation of [WHAT].

Requirements: [PLAN OR SPEC REFERENCE]

Git range: $BASE_SHA..$HEAD_SHA

Review checklist:
- Code quality: separation of concerns, error handling, type safety, DRY
- Architecture: sound design, scalability, security
- Testing: tests verify real behavior (not mocks), edge cases covered
- Requirements: all plan requirements met, no scope creep

Categorize issues:
- Critical (must fix): bugs, security, data loss
- Important (should fix): architecture, missing features, test gaps
- Minor (nice to have): style, optimization, docs

Return: Strengths, Issues by severity, Assessment (ready to merge / with fixes / not ready)"
})
```

### 3. Act on Feedback

Use `/code-review` to handle feedback properly:

| Severity      | Action                             |
| ------------- | ---------------------------------- |
| **Critical**  | Fix immediately, re-request review |
| **Important** | Fix before proceeding              |
| **Minor**     | Note for later or fix if quick     |
| **Wrong**     | Push back with technical reasoning |

## Integration with Workflows

**After `/execute`:**

- Review after all tasks complete
- Catch issues before ship

**After `/teams` build:**

- QA agent handles continuous review
- Final review before PR

**Ad-hoc development:**

- Review before merge
- Review when stuck

## Integration

- **Uses** `/code-review` for handling feedback received
- **Uses** `/verify` to confirm fixes work
- **Preceded by** `/execute` or `/teams` build completion
- **Followed by** `/ship` when review passes
