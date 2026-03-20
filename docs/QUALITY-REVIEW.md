# APEX Framework — Quality Review

**Reviewer**: Code Reviewer (Opus) + Design Reviewer (Sonnet) + Lead
**Date**: March 20, 2026
**Version Reviewed**: v5.13.2 (100+ files, 659 tests)

---

## OVERALL RATING: 8.4 / 10

**Summary**: Mature, battle-tested framework with comprehensive coverage. 659/659 tests passing. All critical infrastructure (hooks, agents, skills) is functional and properly wired. The agent system and Design DNA are standout strengths. Rules were the weakest area (now improved). The framework practices what it preaches — deterministic safety via hooks, intelligent quality via agents, and the Breathing Loop ties it all together.

---

## CATEGORY SCORES

| Category | Score | Notes |
|----------|-------|-------|
| Philosophy & Vision | 9.5/10 | Exceptional. 19 core rules, each battle-tested. Jobs/Ive/Torvalds framing is motivating and actionable. |
| Skill Architecture | 9/10 | 29 skills, all healthy. No trigger conflicts, proper tool scoping, correct context isolation. |
| Agent System | 8.5/10 | 9 agents, all models aligned. Breathing Loop fully wired. Code Reviewer was thin — now overhauled. |
| Hook Configuration | 9/10 | 20 hooks across 8+ events. Zero orphans, zero dangling refs. All scripts handle missing jq gracefully. |
| Settings & Permissions | 9/10 | Comprehensive sandbox, filesystem deny, network allowlist, worktree symlinks. Well-tuned. |
| Rules | 7/10 | 7 path-based rules. Were 5/10 (generic advice, broad paths, duplication). Now improved with narrower paths, code examples, and deduplication. |
| Design DNA | 8.5/10 | 14 pattern pages + 21 starters + 5 palettes + 13 recipes. Strong visual quality bar. |
| Testing | 9.5/10 | 659 tests across 4 suites in 4 seconds. Framework, hooks, agents, and behavioral all covered. |
| Documentation | 8.5/10 | README, CHANGELOG, CLAUDE.md, ECOSYSTEM all maintained. CHANGELOG auto-updated via hooks. |
| Cross-Project Portability | 8/10 | `install.sh` handles per-project installation. `~/.apex-framework/` is the source of truth. |

---

## ISSUES FOUND AND FIXED (This Session)

### CRITICAL: Debugger `git add -A` (FIXED)

**Was**: `debugger.md` line 23 used `git add -A` — the exact command Builder's RULE ZERO warns against. Could stage `node_modules` and break commits. This bug contradicted a safety rule learned from 6+ data-loss sessions.

**Fix**: Replaced with safe exclude pattern matching Builder's RULE ZERO. Added incremental commit guidance.

### HIGH: Code Reviewer was 91 lines on Opus (FIXED)

**Was**: The most expensive agent (Opus) had the thinnest instructions. No task auto-claim, no anti-patterns, no APEX-specific checks (design tokens, duplication), no scope boundaries, no worked examples.

**Fix**: Overhauled to ~130 lines. Added task auto-claim protocol, APEX-specific checks (component duplication, design token compliance, commit quality, worktree merge verification), anti-patterns for bad reviews, scope boundaries vs QA/Design Reviewer, and fallback responsibilities.

### HIGH: Design Reviewer had no workflow or communication protocol (FIXED)

**Was**: Flat list of 12 checks with no sequencing, no message format, no task auto-claim, no escalation protocol. Only agent without a structured workflow.

**Fix**: Added numbered workflow (Step 1-4), task auto-claim protocol, structured report format with per-dimension scores, communication protocol, and explicit BLOCK triggers.

### MEDIUM-HIGH: Researcher and Design Reviewer lacked task auto-claim (FIXED)

**Was**: Builder, Debugger, QA, and Technical Writer all had auto-claim. Researcher and Design Reviewer didn't, meaning they couldn't participate autonomously in the Breathing Loop.

**Fix**: Added task auto-claim protocols with appropriate tags (`[research]`, `[investigate]` for Researcher; `[design]`, `[review]`, `[ui]` for Design Reviewer).

### MEDIUM: Memory type mismatches (FIXED)

**Was**: Framework Evolver and Researcher had `memory: user` — wrong scope. Their work is project-scoped.

**Fix**: Changed both to `memory: project`.

### MEDIUM: Builder inconsistencies (FIXED)

**Was**: "Stuck > 3 turns" on line 240 vs "Stuck > 2 turns" on line 261. Commit exclude patterns in RULE ZERO included `:!dist:!.turbo` but incremental commits on line 214 didn't.

**Fix**: Standardized to ">2 turns" and consistent exclude patterns everywhere.

### MEDIUM: QA duplicate color scan (FIXED)

**Was**: Lines 87-90 and 139-143 both scanned for hardcoded Tailwind colors with different regex. The second was more thorough, making the first redundant.

**Fix**: Removed the less thorough duplicate from the command pipeline. The Design Token Scan section (lines 137-144) now has the single canonical pattern.

### MEDIUM: Technical Writer MultiEdit restriction (FIXED)

**Was**: `disallowedTools: MultiEdit` with no justification. Agent needs to update CHANGELOG and README in one pass.

**Fix**: Removed the restriction.

---

## RULES OVERHAUL (5/10 → 7/10)

### error-handling.md: Paths narrowed
**Was**: `**/*.ts` + `**/*.tsx` matched EVERY TypeScript file — effectively a global rule.
**Now**: Scoped to `**/lib/**`, `**/utils/**`, `**/services/**`, `**/actions/**`.

### testing.md: Rewritten with actual value
**Was**: 23 lines of generic advice Claude already knows (Arrange-Act-Assert, describe blocks).
**Now**: Specifies Vitest + Playwright + RTL, includes code examples for component and API tests, removes generic knowledge.

### api.md: Added code examples
**Was**: 13 lines of bare bullet points with no code.
**Now**: Includes full Next.js route handler example with Zod validation, structured error responses, and server action patterns. Added `**/actions/**` to paths.

### components.md: Fixed contradictions, narrowed scope
**Was**: Line 9 said "Default export" but code example on line 24 used named export. APEX-specific design patterns (lines 18-25) belonged in design-system skill. `**/*.tsx` matched all TSX files.
**Now**: Named exports standard (with explicit Next.js page/layout exception). APEX-specific patterns removed to design-system skill. Path narrowed to `**/components/**` only.

### sql.md: Deduplicated
**Was**: 22 lines that were a pure subset of the `sql-practices` skill.
**Now**: Contains only project-specific schema decisions. Removed `**/supabase/**` path overlap.

### supabase.md: Deduplicated, narrowed
**Was**: Security checklist copy-pasted from supabase skill. `**/*supabase*` matched any file with "supabase" in the name.
**Now**: Narrowed paths, removed duplicate security checklist, focused on conventions the skill doesn't cover.

---

## REMAINING OPPORTUNITIES

These are not critical but would improve the framework:

1. **Rules could go further**: Missing `middleware.md` (edge runtime guidance), `server-actions.md` (revalidation, progressive enhancement), and `styles.md` (CSS custom property naming, Tailwind v4).

2. **Agent escalation protocols**: No agent documents what happens if IT fails (runs out of turns, encounters an unrecoverable error). Builder and Debugger have RULE ZERO for commits, but nothing for mid-task failure recovery.

3. **Watcher sleep protocol**: No guidance on how long to wait between monitoring cycles. The Haiku model has no timer — should use TaskList polling as a proxy.

4. **QUALITY-REVIEW.md auto-generation**: This document is manually written. It should be auto-generated by the Framework Evolver or a dedicated audit skill.

---

## COMPARISON TO PREVIOUS REVIEW (v2 → v5.13.2)

| Issue from v2 Review | Status |
|---|---|
| No user-level installation | RESOLVED — `install.sh` + `~/.apex-framework/` pattern |
| No testing enforcement hook | RESOLVED — `stop-gate.sh` Stop hook checks for test execution |
| No SQL best practices | RESOLVED — `sql-practices` skill with reference.md |
| No multilingual output | RESOLVED — Language selection via session-context.sh |
| Subagent invalid tools | RESOLVED — All agents use valid tool names, Researcher has Bash fallback |
| No sandbox config | RESOLVED — Full filesystem + network sandbox in settings.json |
| No .claude/rules/ | RESOLVED — 7 path-based rules |
| No commit enforcement | RESOLVED — commit-msg git hook enforces conventional commits |
| No jq handling in scripts | RESOLVED — All scripts gracefully degrade with jq warning |
| No Stop hook | RESOLVED — stop-gate.sh + dev-monitor.sh |
| No status line | RESOLVED — apex-statusline.sh |
| No maxTurns on agents | RESOLVED — All 9 agents have explicit maxTurns |

**Previous score: 7.2/10 → Current score: 8.4/10** (+1.2 improvement)

Every critical and high-priority issue from the v2 review has been addressed.
