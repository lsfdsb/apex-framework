# Mastery Guide Audit — Evidence-Based Review

> Date: 2026-03-28 | Branch: `feat/mastery-guide-audit`
> Source: `~/Downloads/claude-code-mastery-guide-unified.md`
> Method: Read guide section, read APEX file, compare, produce verdict

---

## Claim 1: CLAUDE.md should be ~45 lines

**Guide says**: "~150-200 instruction budget before compliance drops. System prompt uses ~50. That gives ~100-150 effective lines." The example CLAUDE.md is ~45 lines.

**APEX current**: 61 lines. Uses `@imports` to defer rules (`@.claude/rules/README.md`) and EPM docs (`@docs/apple-epm.md`). Core content is 13 rules + 8 practices + code standards + git conventions + lessons.

**Verdict: AGREE (already compliant)**

61 lines is well within the 150-line budget. The `@imports` pattern keeps the main file lean while providing depth. No action needed.

---

## Claim 2: Skills should load on demand, not every session

**Guide says**: "Unlike CLAUDE.md which loads every session, skills load only when the task matches the skill's description. At startup, only the name and description from all skills are pre-loaded (tiny footprint)."

**APEX current**: 33 skills load by description match — on-demand, as recommended. BUT the output style (`apex-educational.md`, 411 lines) loads every session. It contains the full pipeline state machine, skill decision flow, tone guidance, and memory protocol.

**Verdict: ADAPT**

Skills are already on-demand. The output style is the framework's operational brain — it MUST load every session because it drives all behavior (pipeline phases, skill invocation discipline, Mandalorian tone). However, 411 lines is significant context.

**Action**: Audit output style for sections that could move to on-demand skills:

- The full skill map table (lines ~120-170) could be derived from skill descriptions at runtime
- The "Knowledge Persistence" section could become a memory-management skill
- The ET Review Protocol is only relevant during pipeline Phase 5-6

**Decision**: Keep output style as-is for now. The guide's concern is about skills loading every session (which we don't do). The output style serves a different purpose — it's the personality and process engine, not a skill.

---

## Claim 3: Hooks > Rules for enforcement (100% vs ~80%)

**Guide says**: "Hooks are deterministic code that runs 100% of the time. Unlike CLAUDE.md instructions which are advisory (~80% compliance), hooks are deterministic."

**APEX current**: 26 hooks across 11 events. But only 1 CLAUDE.md rule is hard-enforced by hook:

- Rule 1 "PRD before code" → `enforce-workflow.sh` (PreToolUse on Write)

Other hooks are lifecycle (session start/end, dev server) or quality (auto-test, stop-gate, security scan) — not CLAUDE.md rule enforcement.

**Rules that are convention-only (no hook)**:

- Rule 7: Read before editing
- Rule 9: TDD for implementation
- Rule 10: Spec before multi-file features
- Rule 13: Only verified libraries

**Verdict: AGREE**

We should convert more critical rules to hooks where mechanically enforceable.

**Action — candidates for new hooks**:

| Rule                                | Hook Type                                                    | Feasibility                           |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| Rule 7: Read before edit            | PreToolUse on Edit — check if file_path was Read in session  | Medium — needs session state tracking |
| Rule 13: Verify libs before install | PreToolUse on Bash — match `npm install\|pnpm add\|yarn add` | High — pattern match on command       |
| Rule 9: TDD for implementation      | Hard to enforce mechanically                                 | Low — rely on skill/agent discipline  |

**Priority**: Add verify-lib-before-install hook (Rule 13) — highest impact, easiest to implement.

---

## Claim 4: Subagents should be constrained

**Guide says**: "unconstrained subagent = slower main session." Recommends: security-reviewer (read-only), TDD agents (isolated). Warns against "6+ parallel agents" and "elaborate multi-step orchestration."

**APEX current**:

- Builder: 11 tools, `permissionMode: dontAsk`, maxTurns: 50
- TDD agents: Properly isolated (red can't write src/, green can't write tests, refactor can't modify tests)
- QA, Designer, PM, Writer: Each has role-appropriate tool sets

**Verdict: ADAPT (no change needed)**

The guide's concern is about generic "do everything" agents. APEX Builder is NOT unconstrained — it has:

- 24-item pre-completion checklist
- TDD isolation protocol (must dispatch @tdd-red/@tdd-green/@tdd-refactor)
- Design DNA requirement for UI work
- Role-specific skills (design-system, verify-api, verify-lib, performance, security)

Builder's high tool count is intentional — it's a DRI (Directly Responsible Individual), not a helper. The constraint is in its protocol, not its tool list.

**Decision**: No change to Builder. The real safeguard is TDD isolation + pre-completion checklist, not tool count reduction.

---

## Claim 5: 80/20 rule — too many agents/skills bloat past compliance

**Guide says**: "28 agents + 116 skills will bloat past the compliance threshold. Start minimal." Recommends: "3 skills + 3 hooks" as the core 80/20.

**APEX current**: 9 agents, 33 skills.

**Verdict: DISAGREE**

The guide targets day-1 over-configuration — installing a massive framework before understanding what you need. APEX is different:

- Evolved organically over 5 versions (v5.19 → v5.24)
- Skills load on-demand (only name+description at startup, ~1 line each)
- Agent definitions only load when spawned
- The real context cost is the 411-line output style, not skill count

33 skills at ~1 line startup cost = ~33 lines. 9 agent definitions at ~0 lines (not loaded until spawned) = 0 lines. Total startup overhead from skills/agents: ~33 lines. The output style at 411 lines is 12x more expensive.

**Decision**: No skill/agent reduction. If optimization is needed, focus on output style, not skill count.

---

## Claim 6: Specs survive context — specs on disk > agent memory

**Guide says**: "The spec is Claude's persistent memory across sessions. Cheaper than agent memory, more reliable than CLAUDE.md, human-reviewable."

**APEX current**: `docs/specs/` convention. `/spec-create` skill writes specs there. Referenced by TDD agents. No enforcement hook (convention-based).

**Verdict: AGREE (already implemented)**

This is working as designed. The `/spec-create` skill produces disk specs. TDD agents reference them. They survive `/clear` and `/compact`. Adding a hook to enforce "spec before code" would be redundant with the pipeline flow.

**Decision**: No change. Convention is sufficient — the pipeline drives compliance.

---

## Claim 7: /clear between features — one feature per session

**Guide says**: "One feature = one session. /clear between features." Also: "With SDD+TDD, never exceed 40% context per session."

**APEX current**: No guidance on session discipline. The output style mentions "Session Depth" but focuses on using the full 1M context, not conserving it.

**Verdict: ADAPT**

Session discipline is valuable but shouldn't be a hard rule. Some features span multiple sessions. Some sessions handle multiple small fixes. The principle is right: don't let context pollution from Feature A affect Feature B.

**Action**: Add session discipline guidance to CLAUDE.md:

```
## Session Discipline
- One major feature per session. `/clear` between unrelated tasks.
- When compacting: preserve current phase, active tasks, pending gates, last 3 decisions, modified files.
```

Note: The "When compacting" line already exists in CLAUDE.md. Add the `/clear` guidance alongside it.

---

## Claim 8: Auto-format hook (PostToolUse Prettier)

**Guide says**: Recommends PostToolUse Prettier hook as one of 3 essential hooks. "Every file Claude touches gets Prettier'd. Zero CI failures from formatting."

**APEX current**: No auto-format hook. Prettier available manually (`pnpm format`, `npx prettier`). Builder's pre-completion checklist includes "Linter passes" but that's self-verification, not enforcement.

**Verdict: AGREE**

Auto-formatting is low-risk, high-reward. It prevents formatting drift without any developer effort. The only concern is conflict with existing PostToolUse hooks (validate-framework, rag-post-edit, auto-test).

**Action**: Add PostToolUse auto-format hook to settings.json. Must run BEFORE validate-framework (format first, then validate). Test for conflicts.

```json
{
  "matcher": "Write|Edit|MultiEdit",
  "hooks": [
    {
      "type": "command",
      "command": "npx prettier --write \"$TOOL_INPUT_FILE_PATH\" 2>/dev/null; exit 0",
      "timeout": 10
    }
  ]
}
```

**Risk mitigation**: The `2>/dev/null; exit 0` ensures Prettier failures (unsupported file types, missing config) never block Claude's work.

---

## Summary

| #   | Claim                   | Verdict                 | Action                                      |
| --- | ----------------------- | ----------------------- | ------------------------------------------- |
| 1   | CLAUDE.md ~45 lines     | AGREE (compliant at 61) | None                                        |
| 2   | Skills load on demand   | ADAPT                   | Output style is intentional; no change      |
| 3   | Hooks > Rules           | AGREE                   | Add verify-lib hook (Rule 13)               |
| 4   | Constrained subagents   | ADAPT                   | No change — Builder is protocol-constrained |
| 5   | 80/20 skill/agent count | DISAGREE                | Focus on output style, not count            |
| 6   | Specs on disk           | AGREE (implemented)     | None                                        |
| 7   | /clear between features | ADAPT                   | Add session discipline to CLAUDE.md         |
| 8   | Auto-format hook        | AGREE                   | Add PostToolUse Prettier hook               |

**Actions to implement**:

1. Add PostToolUse Prettier hook to settings.json
2. Add session discipline guidance to CLAUDE.md
3. Add verify-lib-before-install hook (future — needs script)
