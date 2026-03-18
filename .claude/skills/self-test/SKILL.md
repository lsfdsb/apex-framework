---
name: self-test
description: Summons the Sentinel (Batman) to run a complete framework verification. Every test, every wire, every agent — verified. Use when the user says "self-test", "verify framework", "check everything", "is everything working", "prove it", "batman", or "/batman". The Bat-Signal goes up.
argument-hint: "[focus area: all, agents, hooks, settings]"
allowed-tools: Read, Grep, Glob, Bash, Agent
---

# The Bat-Signal

```
                    .                    .
                  .o8                  .o8
                .o888oo .oooo.o     .o888oo
                  888  d88(  "8       888
                  888  `"Y88b.        888
                  888  o.  )88b       888 .
                  "888" 8""888P'      "888"

       ████████████████████████████████████████
      ██                                      ██
     ██    ██████  ████  ████████  ██    ██    ██
     ██    ██   █ ██  ██    ██    ███   ███    ██
     ██    ██████ ██████    ██    ████████     ██
     ██    ██   █ ██  ██    ██    ██ ██ ██     ██
     ██    ██████ ██  ██    ██    ██   ███     ██
      ██                                      ██
       ████████████████████████████████████████
```

> "It's not who I am underneath, but what I do that defines me."

## The Sentinel has been summoned.

Spawn the **Sentinel** agent to run a complete framework verification:

```
Agent({
  subagent_type: "sentinel",
  name: "sentinel",
  prompt: "Run a full self-test. Execute ALL test suites and report results.",
  run_in_background: false
})
```

The Sentinel will:

1. **Run `bash tests/test-framework.sh`** — 323+ structural tests
2. **Run `bash tests/test-hooks.sh`** — 115+ hook behavioral tests
3. **Run `bash tests/test-integration.sh`** — Integration proof (every wire)
4. **Deep verify all agents** — Frontmatter, skills, tools, contradictions
5. **Verify settings coherence** — Hooks, sandbox, env, permissions
6. **Cross-reference components** — CLAUDE.md ↔ agents ↔ teams skill ↔ tests

Report format: Sentinel Report with health scores and verdict.

When finished, display the result and the Sentinel's verdict.

If ALL tests pass:
```
🦇 The Dark Knight confirms: Gotham is safe. All systems operational.
```

If issues found:
```
🦇 The Dark Knight found {N} threats. Creating tasks for each.
```
