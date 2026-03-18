---
name: cost-management
description: Context window management for efficient sessions. Auto-loads when context is filling up (>50%), when the user mentions tokens, context, compact, or slow responses. Teaches the user to work efficiently within context limits.
user-invocable: false
---

# Context Management — Work Smart, Not Big

## When to Act on Context

Our status line shows context usage. Here's what to do:

| Context % | Status | Action |
|-----------|--------|--------|
| 0-30% | 🟢 Healthy | Work freely |
| 30-50% | 🟢 Fine | Start batching instructions |
| 50-60% | 🟡 Compact soon | Run `/compact` to free space |
| 60-80% | 🟡 Getting full | Compact immediately, split tasks |
| 80%+ | 🔴 Critical | Compact NOW or start a new session |

## Context-Saving Habits

1. **Use `/compact` at 50-60%** — don't wait for 80%. Our PreCompact hook saves state.
2. **Use `/clear` between unrelated tasks** — carry zero irrelevant context.
3. **Batch your instructions** — one detailed prompt beats 10 rounds of refinement.
4. **Forked skills for heavy research** — context stays in the subagent, not yours.
5. **Use agents for deep exploration** — their context is separate from yours.
