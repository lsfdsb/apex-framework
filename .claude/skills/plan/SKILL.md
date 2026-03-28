---
name: plan
description: Use when you have a spec, PRD, or requirements for a multi-step task and need to create an implementation plan before touching code. Also use when the user says "plan", "implementation plan", "break this down", "task list", or after /brainstorm or /prd approval.
argument-hint: '[spec or PRD path]'
allowed-tools: Read, Grep, Glob, Bash
---

# Writing Implementation Plans

> "Weapons are part of my religion." — and plans are our weapons.

Write comprehensive implementation plans assuming the engineer has zero context and questionable taste. Document everything: which files to touch, code, testing, docs to check. Give them bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during `/brainstorm`. If it wasn't, suggest breaking into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified:

- Design units with clear boundaries and well-defined interfaces
- Each file should have one clear responsibility
- Prefer smaller, focused files over large ones
- Files that change together should live together
- In existing codebases, follow established patterns

## Plan Document Header

Every plan MUST start with:

```markdown
# [Feature Name] Implementation Plan

> **Execution:** Use `/execute` or `/teams` to implement this plan task-by-task.

**Goal:** [One sentence]
**Architecture:** [2-3 sentences about approach]
**Tech Stack:** [Key technologies]
**Spec:** [Path to design spec]

---
```

## Bite-Sized Task Granularity

Each step is ONE action (2-5 minutes):

```
- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal code" — step
- "Run tests and verify they pass" — step
- "Commit" — step
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**

- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
test('specific behavior', () => {
    const result = function(input);
    expect(result).toBe(expected);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/path/test.ts`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```typescript
function myFunction(input: string): string {
  return expected;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/path/test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.ts src/path/file.ts
git commit -m "feat: add specific feature"
```
````

## No Placeholders

Every step must contain actual content. These are **plan failures** — never write them:

- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — tasks may be read out of order)
- Steps that describe what to do without showing how
- References to types/functions not defined in any task

## Self-Review

After writing the complete plan, check against the spec:

1. **Spec coverage** — Can you point to a task for each spec requirement? List gaps.
2. **Placeholder scan** — Any "No Placeholders" violations? Fix them.
3. **Type consistency** — Do names in later tasks match definitions in earlier tasks?

Fix issues inline. If a spec requirement has no task, add the task.

## Execution Handoff

After saving the plan, offer execution choice:

```
Plan complete and saved to `docs/plans/<filename>.md`. Execution options:

1. **Team Build** (recommended for 3+ files) — /teams spawns a coordinated team
2. **Direct Execute** — /execute runs tasks sequentially with checkpoints
3. **Subagent-Driven** — /teams SDD mode dispatches fresh subagent per task

Which approach?
```

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## Integration

- **Preceded by** `/brainstorm` (design spec) or `/prd` (product requirements)
- **Followed by** `/execute` (sequential) or `/teams` (parallel/SDD)
- **References** `/tdd` — every task follows RED-GREEN-REFACTOR
- **References** `/verify` — every completion claim needs evidence
