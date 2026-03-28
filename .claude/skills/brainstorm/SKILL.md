---
name: brainstorm
description: Use BEFORE any creative work — creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation. Also use when the user says "brainstorm", "let's think about", "explore ideas", "what should we build", "design this", or before any /prd.
argument-hint: "[idea or feature to explore]"
allowed-tools: Read, Grep, Glob, Bash
---

# Brainstorming Ideas Into Designs

> "Bounty hunting is a complicated profession." — so is turning ideas into specs.

Help turn ideas into fully formed designs through natural collaborative dialogue. Understand the project context, ask questions one at a time, present the design, get approval.

## The Hard Gate

```
DO NOT invoke any implementation skill, write any code, scaffold any project,
or take any implementation action until you have presented a design and the
user has approved it. This applies to EVERY project regardless of perceived simplicity.
```

**Anti-pattern: "This is too simple to need a design."** Every project goes through this process. A todo list, a single-function utility, a config change — all of them. The design can be short, but you MUST present it and get approval.

## Checklist

Complete these in order:

1. **Explore project context** — check files, docs, recent commits
2. **Assess scope** — if request describes multiple independent subsystems, flag immediately. Decompose into sub-projects before diving into details.
3. **Ask clarifying questions** — one at a time, understand purpose/constraints/success criteria
4. **Propose 2-3 approaches** — with trade-offs and your recommendation
5. **Present design** — sections scaled to complexity, get approval after each section
6. **Write spec document** — save to `docs/specs/YYYY-MM-DD-<topic>-design.md`
7. **Spec self-review** — check for placeholders, contradictions, ambiguity, scope
8. **User reviews written spec** — ask user to review before proceeding
9. **Transition** — invoke `/plan` to create implementation plan, OR `/prd` for full product scope

## The Process

### Understanding the Idea

- Check the current project state first (files, docs, recent commits)
- Ask questions **one at a time** — don't overwhelm with multiple questions
- Prefer **multiple choice** when possible, open-ended is fine too
- Focus on: purpose, constraints, success criteria
- For appropriately-scoped projects, refine through questions
- If too large for a single spec, help decompose into sub-projects first

### Exploring Approaches

- Propose **2-3 different approaches** with trade-offs
- Lead with your recommended option and explain why
- Present options conversationally

### Presenting the Design

- Scale each section to its complexity: a few sentences if straightforward, up to 200-300 words if nuanced
- Ask after each section whether it looks right so far
- Cover: architecture, components, data flow, error handling, testing
- Be ready to go back and clarify

### Design for Isolation and Clarity

- Break the system into smaller units with one clear purpose each
- Well-defined interfaces between units
- Each unit testable independently
- Can someone understand what a unit does without reading its internals?
- Smaller, well-bounded units are also easier for agents to work with

### Working in Existing Codebases

- Explore current structure before proposing changes. Follow existing patterns.
- Where existing code has problems that affect the work, include targeted improvements
- Don't propose unrelated refactoring. Stay focused.

## After the Design

### Documentation

Write the validated design to `docs/specs/YYYY-MM-DD-<topic>-design.md` and commit.

### Spec Self-Review

After writing, review with fresh eyes:

1. **Placeholder scan** — Any "TBD", "TODO", incomplete sections? Fix them.
2. **Internal consistency** — Do sections contradict each other?
3. **Scope check** — Focused enough for a single implementation plan?
4. **Ambiguity check** — Could any requirement be interpreted two ways? Pick one.

Fix issues inline. No re-review needed.

### User Review Gate

> "Spec written and committed to `<path>`. Please review it and let me know if you want changes before we proceed."

Wait for user response. If changes requested, make them and re-review.

### Transition to Implementation

- **For new apps/major features**: Invoke `/prd` to create the full Product Requirements Document
- **For scoped features/changes**: Invoke `/plan` to create the implementation plan directly
- Do NOT invoke any other skill. The next step is always `/prd` or `/plan`.

## Key Principles

- **One question at a time** — Don't overwhelm
- **Multiple choice preferred** — Easier to answer
- **YAGNI ruthlessly** — Remove unnecessary features
- **Explore alternatives** — Always 2-3 approaches before settling
- **Incremental validation** — Present, get approval, move on
- **Be flexible** — Go back and clarify when something doesn't make sense

## Integration

- **Precedes** `/prd` (full product scope) or `/plan` (scoped implementation)
- **Invoked by** the output style when user asks to build something new
- **Works with** `/architecture` for system design decisions
