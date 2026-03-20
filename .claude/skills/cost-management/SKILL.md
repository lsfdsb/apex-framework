---
name: cost-management
description: Context window management for efficient sessions. Auto-loads when context is filling up (>50%), when the user mentions tokens, context, compact, or slow responses. Teaches the user to work efficiently within context limits.
user-invocable: false
---

# Context Management — Work Smart, Not Big

> "The best code is the code you don't have to re-read." — Every context-conscious engineer

## When to Act on Context

Our status line shows context usage. Here's what to do:

| Context % | Status | Action |
|-----------|--------|--------|
| 0-30% | 🟢 Healthy | Work freely |
| 30-50% | 🟡 Watch | Plan remaining work, batch instructions |
| 50-70% | 🟠 Compact Soon | Run `/compact` with a summary of current state |
| 70-85% | 🔴 Critical | Compact NOW. Summarize progress, next steps, blockers |
| 85%+ | ⚫ Emergency | Compact immediately or start fresh session |

## Context-Saving Habits

### Do This
1. **Batch instructions** — Give 3-5 related tasks at once, not one at a time
2. **Use `/compact` at 50-60%** — Don't wait for 80%. Our PreCompact hook saves state
3. **Use `/clear` between unrelated tasks** — Carry zero irrelevant context
4. **Fork heavy skills** — Skills with `context: fork` run in subagents (PRD, architecture)
5. **Delegate to agents** — Builders run in their own context, not yours
6. **Be specific** — "Fix the auth bug in src/auth/login.ts:45" > "Fix the login bug"
7. **Reference files by path** — Don't paste file contents into chat

### Don't Do This
1. **Don't paste large files** — Use Read tool references instead
2. **Don't ask Claude to "remember" long lists** — Use memory files
3. **Don't re-read files already in context** — They're cached
4. **Don't run verbose commands** — Use `| tail -20` or `| head -20`
5. **Don't repeat yourself** — If Claude understood, move on

## Cost Optimization

### Model Usage in Teams
| Agent | Model | Cost | Why |
|-------|-------|------|-----|
| Lead | Opus | $$$ | Orchestration, decisions — needs highest reasoning |
| Code Reviewer | Opus | $$$ | Security gate — cannot miss vulnerabilities. Worth the cost |
| Builder/Debugger/QA | Sonnet | $$ | Code generation, testing — balanced |
| Design Reviewer | Sonnet | $$ | UI/UX analysis requires strong reasoning |
| Framework Evolver | Sonnet | $$ | Architectural reasoning, not just pattern matching |
| Watcher/Writer/Researcher | Haiku | $ | Monitoring, docs, reading — cost-efficient |

### When to Use Teams vs Solo
- **Solo** (cheaper): Single-file fixes, questions, small features (<5 files)
- **Team** (worth it): Multi-file features, production bugs, new apps, refactors
- **Full team** (rare): Critical launches, security-sensitive features, major migrations

### Monitoring Your Usage
- Check the status line: context %, token count, cost estimate
- If context fills fast, you're probably reading too many files — be selective
- A typical productive session: 30-60% context used over 1-2 hours
