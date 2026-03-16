---
name: cost-management
description: Manages token usage and model selection for Claude Max plan optimization. Auto-loads to optimize costs throughout the session. This skill should be used when context mentions cost, tokens, expensive, budget, limit, quota, rate limit, slow, or when context is filling up. Teaches the user to work efficiently within Max plan limits.
user-invocable: false
---

# Cost Management — Max Plan Optimization

## APEX Model Strategy

Our framework uses a 3-tier model system — Opus for thinking, Sonnet for coding, Haiku for delegation:

```
┌─────────────────────────────────────────────────────┐
│  OPUS (most capable, most expensive)                 │
│  Used for: /prd, /architecture, Plan mode            │
│  When: Complex reasoning, architectural decisions    │
│  How: opusplan auto-switches in Shift+Tab mode       │
├─────────────────────────────────────────────────────┤
│  SONNET (balanced capability/cost)                   │
│  Used for: Code writing, code-reviewer, design-      │
│  reviewer, CI/CD, general implementation             │
│  When: Building features, writing tests, reviewing   │
│  How: opusplan auto-switches for execution           │
├─────────────────────────────────────────────────────┤
│  HAIKU (fastest, cheapest)                           │
│  Used for: researcher agent, Stop hook (test gate),  │
│  simple lookups, file search tasks                   │
│  When: Reading docs, yes/no decisions, quick checks  │
│  How: Configured on subagents + prompt hooks         │
└─────────────────────────────────────────────────────┘
```

## What's Auto-Configured

| Component | Model | Rationale |
|-----------|-------|-----------|
| Main session | `opusplan` | Opus in Plan mode, Sonnet in execution |
| code-reviewer | `sonnet` | Smart enough for reviews, 40% cheaper than Opus |
| design-reviewer | `sonnet` | Same — pattern matching, not deep reasoning |
| researcher | `haiku` | Just reading + summarizing docs, 80% cheaper |
| Stop hook | `haiku` (default) | Yes/no decision: "did tests run?" |
| /prd skill | Opus via Plan agent | PRDs need deep strategic thinking |
| /architecture | Opus via Plan agent | Architecture needs complex reasoning |
| /research skill | `haiku` via researcher | Cost-efficient doc research |
| Effort level | `medium` | Balanced thinking depth |

## Manual Model Switching

Use `/model` mid-session when you need to change:

```
/model opus      # For complex architectural discussion
/model sonnet    # For regular coding (default in opusplan execution)
/model haiku     # For quick questions, simple lookups
/model opusplan  # Back to hybrid (recommended default)
```

### When to Switch Manually

| Situation | Switch To | Why |
|-----------|-----------|-----|
| "Design the database schema" | Opus (or stay on opusplan) | Complex reasoning |
| "Write the login component" | Stay on opusplan | Sonnet handles this |
| "What does this error mean?" | Haiku | Simple lookup, instant answer |
| "Refactor this 500-line file" | Sonnet | Good enough, much cheaper |
| "Review the PRD for gaps" | Opus | Strategic analysis |
| "Add a loading spinner" | Stay on opusplan | Trivial task, Sonnet handles it |

## Effort Level

The effort slider controls how much thinking Claude does. Available in `/model`:

| Level | Best For | Cost Impact |
|-------|----------|-------------|
| `low` | Quick edits, simple questions | ~50% fewer thinking tokens |
| `medium` | Regular development (our default) | Balanced |
| `high` | Complex debugging, architecture | ~2x thinking tokens |

Change it: `/model` → adjust effort slider, or edit `effortLevel` in settings.

## Max Plan Token Budget

| Plan | 5-hour Window | Weekly Cap | Best For |
|------|--------------|-----------|----------|
| Max 5x ($100/mo) | ~88K tokens | ~225 messages | 2-3 hours focused/day |
| Max 20x ($200/mo) | ~220K tokens | ~900 messages | Full-day development |

## Token-Saving Habits

1. **Use /compact at 50-60%** — don't wait for 80%. Our PreCompact hook saves state.
2. **Use /clear between unrelated tasks** — carry zero irrelevant context.
3. **Batch your instructions** — one detailed prompt beats 10 rounds of refinement.
4. **Forked skills for heavy research** — context stays in the subagent, not yours.
5. **Check /cost regularly** — know where your tokens go.
6. **Our status line shows ⚠️COST** when you exceed your threshold (default $5/session).
