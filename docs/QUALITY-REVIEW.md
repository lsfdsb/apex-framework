# APEX Framework — Critical Quality Review

**Reviewer**: Senior Engineer & Researcher
**Date**: March 13, 2026
**Version Reviewed**: v2 (32 files)

---

## OVERALL RATING: 7.2 / 10

**Summary**: Strong foundation with excellent philosophy and skill architecture. Several critical gaps in enforcement, testing, data layer, cross-project portability, and internationalization. The framework works well for a single project but fails its own stated goal of being "standard in every project." Multiple subtle errors against the official Claude Code documentation.

---

## CATEGORY SCORES

| Category | Score | Notes |
|----------|-------|-------|
| Philosophy & Vision | 9/10 | Exceptional. Clear, inspiring, actionable. |
| Skill Architecture | 8/10 | Good fork/inline decisions. Missing reference files on some skills. |
| Subagent Design | 6/10 | Incorrect tool references. Missing hooks in agents. No commit agent. |
| Hook Configuration | 6/10 | Only 4 events covered out of 18. No testing enforcement. No Stop hook. |
| Settings & Permissions | 5/10 | Weak permissions. No sandbox config. No model optimization. |
| Cross-Project Portability | 3/10 | Project-only. Not installed at user-level (~/.claude/). Fails stated goal. |
| Testing & QA Enforcement | 4/10 | QA skill exists but tests are NOT deterministically enforced. No hook. |
| Data Layer / SQL | 0/10 | Completely missing. No SQL best practices, no migration patterns. |
| Internationalization | 0/10 | No language selection. Stated requirement not implemented. |
| Documentation | 8/10 | Good README and INSTALL. Missing CONTRIBUTING guide. |

---

## CRITICAL ISSUES (Must Fix)

### ISSUE 1: Framework is NOT standard across projects (Score impact: -3)

**Problem**: Everything lives in `.claude/` (project level). The user asked for APEX to be "standard in every project." Per the official docs, user-level config at `~/.claude/` applies to ALL projects automatically.

**Evidence from docs**: "User scope is best for: Personal preferences you want everywhere. User settings are defined in `~/.claude/settings.json` and apply to all projects."

**Fix**: Split APEX into two layers:
- `~/.claude/` (user-level): Core skills, agents, hooks, output style, CLAUDE.md → applies everywhere
- `.claude/` (project-level): Project-specific settings, stack overrides → per project

**Why this matters**: Right now, every new project requires manually copying APEX files. That defeats the purpose.

### ISSUE 2: No testing enforcement hook (Score impact: -2)

**Problem**: The QA skill is probabilistic — Claude can skip it. Our philosophy says "we always test every code we're building." But there's no deterministic hook that BLOCKS untested code.

**Fix**: Add a `Stop` hook (prompt-based) that evaluates whether tests were run before Claude finishes:
```json
{
  "Stop": [{
    "hooks": [{
      "type": "prompt",
      "prompt": "Review the assistant's response. Did it write or modify code? If yes, did it also run tests (npm test, vitest, playwright) or explicitly state why tests weren't needed? Respond with JSON: {\"decision\": \"block\", \"reason\": \"...\"} to force test execution, or {} to allow."
    }]
  }]
}
```

**Why this matters**: "Hooks are deterministic. Skills are probabilistic." Testing is a rule that cannot be broken.

### ISSUE 3: No SQL best practices (Score impact: -2)

**Problem**: We build web apps with PostgreSQL/Supabase. We have ZERO guidance on query optimization, indexing, migrations, or common SQL pitfalls. The architecture skill mentions DB briefly but has no operational detail.

**Fix**: Create `sql-practices` skill with reference file covering: indexing strategy, query optimization (EXPLAIN ANALYZE), migration patterns, N+1 prevention, connection pooling, RLS patterns for Supabase.

### ISSUE 4: No multilingual output support (Score impact: -1.5)

**Problem**: User explicitly requested en-us/pt-br language selection at session start. Not implemented.

**Fix**: Add language selection to the output style and a SessionStart hook that asks the language preference.

### ISSUE 5: Subagent `researcher` lists invalid tools (Score impact: -1)

**Problem**: The researcher agent lists `WebSearch, WebFetch` in its tools field. Per the official docs, subagent tools are internal Claude Code tools: Read, Grep, Glob, Bash, Write, Edit, MultiEdit, Task, WebSearch, WebFetch. WebSearch and WebFetch are actually valid BUT only available with specific model access. The risk is these tools silently fail if the model doesn't support them.

**Fix**: Add Bash as fallback for web research (curl-based). Document that WebSearch requires Opus/Sonnet.

### ISSUE 6: `research` skill uses lowercase `explore` agent (Score impact: -0.5)

**Problem**: `agent: explore` in the research skill frontmatter. The official docs consistently show `agent: Explore` with a capital E for the built-in Explore agent.

**Evidence**: "Options include built-in agents (Explore, Plan, general-purpose) or any custom subagent from .claude/agents/."

**Fix**: Change to `agent: Explore` (capital E).

---

## HIGH-PRIORITY IMPROVEMENTS (Should Fix)

### IMPROVEMENT 1: No Stop hook for quality gates

The `Stop` event fires "whenever Claude finishes responding." This is the perfect place for a prompt-based hook that checks:
- Did Claude explain what it built and why? (educational requirement)
- Did Claude run tests after writing code?
- Did Claude check the PRD before implementing?

Per docs: "Prompt hooks send input to a Claude model (Haiku by default) which returns a yes/no JSON decision."

### IMPROVEMENT 2: No sandbox configuration

Per docs: "Sandboxing provides OS-level enforcement that restricts the Bash tool's filesystem and network access." We're missing this entirely. Should add:
```json
"sandbox": {
  "filesystem": {
    "allowWrite": ["$PWD/**", "/tmp/**"]
  }
}
```

### IMPROVEMENT 3: No model optimization

The docs reveal `opusplan` model alias: "In plan mode — Uses opus for complex reasoning. In execution mode — Automatically switches to sonnet for code generation." This is perfect for our use case and we're not recommending it.

### IMPROVEMENT 4: Missing `hooks` in subagent frontmatter

Per docs: "Hooks can be defined directly in skills and subagents using frontmatter. These hooks are scoped to the component's lifecycle." Our code-reviewer agent should have a PostToolUse hook that runs linting after it reads files.

### IMPROVEMENT 5: No `.claude/rules/` files

Per docs: "Rules with paths frontmatter only load when Claude works with matching files, saving context." We should have rules for specific file patterns:
- `*.test.ts` → testing conventions
- `*.sql` → SQL best practices
- `api/**` → API conventions

### IMPROVEMENT 6: No conventional commit enforcement

We state conventional commits in CLAUDE.md but don't enforce them. Need a PreToolUse hook on Bash that validates `git commit` messages match our format.

### IMPROVEMENT 7: Hook scripts don't handle missing `jq`

All hook scripts assume `jq` is installed. If it's not, they fail silently. Should check and provide a fallback or clear error.

### IMPROVEMENT 8: No PreCompact hook

When Claude compacts context, important details can be lost. Per docs, `SessionStart` with `compact` matcher helps, but a `PreCompact` hook could save critical state BEFORE compaction happens.

### IMPROVEMENT 9: VS Code terminal preference not documented

User prefers the terminal face of Claude Code in VS Code, not the web panel. This should be in the INSTALL guide and settings.

---

## MINOR ISSUES (Nice to Fix)

1. **design-system SKILL.md is 82 lines** — approaching the 100-line comfort zone. The reference.md helps but the main file could be tighter.

2. **No CONTRIBUTING.md** — If we share this framework, contributors need guidelines.

3. **output-style file doesn't mention language selection** — Currently hardcoded to English.

4. **No status line configuration** — Per docs, custom status line shows model, tokens, cost. Useful for monitoring.

5. **No `maxTurns` on subagents** — Subagents could run indefinitely. Per docs, `maxTurns` limits execution.

6. **Architecture skill says `agent: plan`** — Should verify this is `Plan` with capital P per built-in agent naming.

7. **No git hooks integration** — We have Claude Code hooks but not actual git pre-commit hooks for when commits happen outside Claude.

8. **deploy skill has `context: fork` + `allowed-tools`** — Per docs, when using context:fork, the skill runs in a subagent. The `allowed-tools` field works differently in forked context — should verify behavior.

9. **No cost monitoring** — No guidance on token usage, model selection for cost optimization, or when to use Haiku vs Sonnet vs Opus.

10. **session-context.sh doesn't handle non-git directories** — Will error in projects without git initialized.

---

## FUTURE SITUATION PREDICTIONS

### Scenario 1: User starts second project
**Problem**: They have to manually copy `.claude/` again. Without user-level config, each new project starts from zero.
**Impact**: Frustration, inconsistency, drift between projects.

### Scenario 2: Context window fills up during complex feature
**Problem**: No PreCompact hook saves state. After compaction, Claude may forget the PRD, the architecture decisions, or where it was in the workflow.
**Impact**: Rework, lost context, broken implementation.

### Scenario 3: User writes a Supabase query with N+1 pattern
**Problem**: No SQL skill catches this. Performance skill mentions N+1 but has no SQL-specific guidance.
**Impact**: Slow app in production. Violates "zero lag" philosophy.

### Scenario 4: Claude finishes a feature without running tests
**Problem**: No Stop hook verifies test execution. QA skill may not auto-trigger.
**Impact**: Untested code ships. Violates "always test every code" rule.

### Scenario 5: New developer joins and installs APEX differently
**Problem**: No CONTRIBUTING guide. No version management. Plugin manifest exists but distribution isn't tested.
**Impact**: Framework drift, inconsistent setups across team.

### Scenario 6: User tries to build at 11pm, doesn't speak English well
**Problem**: All output is English-only. No pt-br support.
**Impact**: Slower learning, frustration, reduced effectiveness.

### Scenario 7: Claude installs a compromised npm package
**Problem**: verify-lib skill is probabilistic. No PreToolUse hook on Bash that catches `npm install` and forces verification.
**Impact**: Supply chain vulnerability. Violates security philosophy.

---

## RECOMMENDED FIX PRIORITY

| Priority | Fix | Effort | Impact |
|----------|-----|--------|--------|
| P0 | User-level installation (~/.claude/) | Medium | Cross-project standard |
| P0 | SQL best practices skill + reference | Medium | Performance gap |
| P0 | Testing enforcement (Stop hook) | Low | Quality guarantee |
| P0 | Multilingual output (en-us/pt-br) | Medium | User requirement |
| P1 | Sandbox configuration | Low | Security gap |
| P1 | Model optimization (opusplan) | Low | Cost/quality |
| P1 | Fix agent names (Explore, Plan) | Trivial | Correctness |
| P1 | npm install verification hook | Low | Security gap |
| P1 | Stop hook for educational enforcement | Low | Philosophy gap |
| P2 | .claude/rules/ path-based rules | Medium | Context optimization |
| P2 | VS Code terminal preference config | Low | User preference |
| P2 | jq dependency handling in scripts | Low | Robustness |
| P2 | PreCompact hook for state preservation | Low | Context management |
| P2 | Commit message enforcement hook | Low | Git hygiene |
| P3 | Status line configuration | Low | DX improvement |
| P3 | maxTurns on subagents | Trivial | Cost control |
| P3 | CONTRIBUTING.md | Low | Team scaling |
