---
name: spec-create
description: Create a lean feature spec before implementation. Use for features that don't need a full PRD — smaller than an app, larger than a one-file change. Also use when the user says "spec", "spec-create", "write a spec", "feature spec", "define this first", or before any multi-file feature.
argument-hint: '[feature name or description]'
allowed-tools: Read, Grep, Glob, Bash, Agent, Write
---

# Spec-Driven Design — Think Before You Build

> "Specs define WHAT. Tests define WHEN IT'S DONE. Code is just the artifact that satisfies both."

## When to Use This vs /prd

| Scope                                                                  | Use                                |
| ---------------------------------------------------------------------- | ---------------------------------- |
| **New app or major feature** (10+ files, new pages, new data model)    | `/prd` → `/architecture` → `/plan` |
| **Medium feature** (3-10 files, new API endpoint, new component group) | `/spec-create` (this skill)        |
| **Small change** (1-2 files, bug fix, tweak)                           | Direct implementation with `/tdd`  |

## The Spec-Create Workflow

### Phase 1: Research (Parallel Subagents)

Spawn 2-3 Explore agents in parallel to research before writing anything:

**Codebase Pattern Agent:**

- Find existing patterns for similar features
- Identify conventions: file structure, naming, imports, testing patterns
- Find reusable components, utilities, and types

**Schema/Data Agent:**

- Review existing database schema and models
- Find naming conventions, migration patterns, relationship patterns
- Identify existing validation patterns (Zod schemas, etc.)

**Integration Agent** (if the feature involves external APIs):

- Check existing integration patterns in the codebase
- Verify API docs are current (`/verify-api`)
- Document auth method, rate limits, error handling patterns

### Phase 2: Write the Spec

After research completes, write a spec to `docs/specs/<feature-name>.md`:

```markdown
# Spec: [Feature Name]

## Requirements

- [Bullet points — what the feature does, not how]
- [Each requirement is testable — you can write a failing test for it]
- [Include who benefits and why]

## Data Model

- [Tables, columns, types, relationships]
- [Validation rules]
- [RLS/auth policies if applicable]

## API Endpoints (if applicable)

- [Method, path, request body, response, auth]
- [Error responses]
- [Rate limits]

## Component Tree (if UI)

- [Parent → child hierarchy]
- [Which components are new vs reuse existing]
- [State management approach]

## Edge Cases

- [What could go wrong?]
- [What happens with empty/null/invalid input?]
- [Concurrent access? Race conditions?]

## Out of Scope (MVP)

- [What we're NOT building — prevents scope creep]

## Tasks

1. [Task 1: specific files, what to test, what to build]
2. [Task 2: ...]
3. [Task 3: ...]

- Each task = one TDD cycle (@tdd-red → @tdd-green → @tdd-refactor)
- Each task = one commit
```

### Phase 3: Present for Approval

**STOP HERE.** Present the spec to the user:

```
📋 Spec ready: docs/specs/<feature-name>.md

Requirements: [count] items
Tasks: [count] TDD cycles
Files affected: [list]

Review the spec. Approve to proceed with /tdd, or give feedback to revise.
```

**Do NOT implement anything.** Wait for explicit approval.

### Phase 4: After Approval

Once approved, the spec becomes the persistent contract:

- `/tdd task-1` references the spec for requirements
- `@tdd-red` reads the spec to write tests (not the implementation)
- `/clear` between tasks — the spec file on disk survives context resets
- `/verify` checks completion against the spec's requirements

## Why Specs Matter

**Specs survive context.** When you `/compact` or `/clear`, the conversation is lost. But spec files on disk persist forever:

```
Session 1: /spec-create → docs/specs/message-templates.md
Session 2: "Read docs/specs/message-templates.md and implement Task 1"
Session 3: "Read the spec and implement Task 2"
```

**Specs prevent wrong-direction builds.** Without a spec, Claude makes 30 architectural decisions without your input. With a spec, you review those decisions in 5 minutes before any code is written.

**Specs are documentation.** The spec IS the feature documentation. No separate docs needed for MVP.

## Spec Quality Checklist

Before presenting the spec:

- [ ] Every requirement is testable (you could write a failing test for it)
- [ ] Edge cases cover invalid input, empty states, and error paths
- [ ] Out of scope section prevents scope creep
- [ ] Tasks are ordered — earlier tasks provide foundation for later ones
- [ ] Each task lists specific file paths (not "add a component")
- [ ] Data model includes validation rules, not just column types
- [ ] No "TBD" or "TODO" — if you don't know, research more

## Integration

- **Preceded by** user request for a new feature
- **Followed by** `/tdd` for each task in the spec
- **Complemented by** `/prd` for larger scope (full apps, major features)
- **Persists across** `/clear` and `/compact` — the spec file is on disk
- **Referenced by** `@tdd-red` — tests are written against the spec, not implementation
