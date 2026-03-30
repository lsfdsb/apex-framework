# Next Session Agenda: Mastery Guide Audit + APEX Ops Build

> Created: 2026-03-28 | Branch: `feat/tdd-sdd-mastery-guide-audit` (uncommitted items below)
> Start with: `/clear` then reference this file

---

## 1. Mastery Guide Real Audit (Evidence-Based)

We added TDD/SDD enforcement but skipped an honest comparison. The Mastery Guide makes specific claims we need to verify against APEX — not assume.

### Claims to Verify

| #   | Mastery Guide Claim                                                              | APEX Current                                                                                 | Verdict Needed                                                    |
| --- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | CLAUDE.md should be ~45 lines (compliance drops after ~150 instructions)         | Framework CLAUDE.md is 60 lines. But apps built with APEX have NO CLAUDE.md yet              | **Decision**: Add app-level CLAUDE.md generation to pipeline      |
| 2   | Skills should load on demand, not every session                                  | Output style loads every session (~400 lines). 33 skills load by description match           | **Measure**: Is 400-line output style past the compliance budget? |
| 3   | Hooks > Rules for enforcement (100% vs ~80%)                                     | We added auto-test hook + hard stop gate. But CLAUDE.md still has rules that should be hooks | **Audit**: Which CLAUDE.md rules should become hooks?             |
| 4   | Subagents should be constrained — "unconstrained subagent = slower main session" | Builder has ALL tools + `permissionMode: dontAsk`                                            | **Evaluate**: Should builder be more constrained?                 |
| 5   | 80/20 rule — too many agents/skills bloat past compliance                        | 9 agents, 33 skills. Is this past the threshold?                                             | **Test**: Does Claude follow all rules? Spot-check compliance     |
| 6   | Specs survive context — specs on disk > agent memory                             | We have `docs/specs/` convention but no enforcement                                          | **Verify**: Does the pipeline actually write specs there?         |
| 7   | `/clear` between features — one feature per session                              | APEX doesn't enforce this                                                                    | **Decide**: Should we add session discipline guidance?            |
| 8   | Auto-format hook (PostToolUse Prettier)                                          | We said "not doing it" without testing                                                       | **Test**: Would it conflict with our existing hooks?              |

### How to Audit

For each claim:

1. Read the Mastery Guide section (file: `~/Downloads/claude-code-mastery-guide-unified.md`)
2. Read the corresponding APEX file
3. Run a real test if applicable (e.g., does Claude actually follow the rule?)
4. Document: **AGREE** (adopt) / **DISAGREE** (keep APEX approach, with evidence) / **ADAPT** (take the spirit, not the letter)

---

## 2. next-forge Research (Before Architecture Decisions)

next-forge is a production SaaS monorepo starter by Hayden Bleasel. We need to understand it before deciding APEX Ops architecture.

### What to Fetch

- **Docs**: https://next-forge.com/docs
- **GitHub**: https://github.com/haydenbleasel/next-forge
- **Key questions**:
  - What's the monorepo structure? (apps/, packages/)
  - What shared packages does it provide? (@repo/ui, @repo/auth, @repo/db, etc.)
  - How does it handle the design system?
  - What's pre-wired? (Clerk, Prisma/Neon, Stripe, Resend, shadcn/ui, Sentry, PostHog)
  - How does Turborepo orchestrate builds?
  - Can we use it as a starting point or just as reference?

### Decision to Make

| Option                                                      | Pros                                             | Cons                                                         |
| ----------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| **Scaffold from next-forge** (`npx next-forge@latest init`) | Pre-wired monorepo, battle-tested, maintained    | May include things we don't need, learning their conventions |
| **Custom Turborepo monorepo**                               | Full control, APEX conventions from start        | More setup work, reinventing solved problems                 |
| **Hybrid**: next-forge scaffold + APEX customization        | Best of both, fast start, our conventions on top | Must understand next-forge deeply to customize well          |

---

## 3. APEX Ops — The Build

### What Is APEX Ops?

A monorepo that serves as the **home for all APEX apps**. Starting with:

- **Design System** — shared UI components, tokens, patterns (the DNA made real)
- **Hub/Dashboard** — central place to see all apps, their status, the framework

### Key Architecture Questions (for /brainstorm)

1. **Monorepo structure**: How many apps to start? Just the design system + one app? Or scaffold for many?
2. **Design system package**: `@apex/ui`? Based on shadcn/ui? How does it relate to Design DNA templates?
3. **Shared packages**: What's shared across all apps? Auth? DB? Config? Types?
4. **App-level CLAUDE.md**: Each app in the monorepo needs its own ~45-line CLAUDE.md (per Mastery Guide)
5. **Deployment**: Vercel multi-app from monorepo? Turborepo + Vercel integration?
6. **Stack choices**: Next.js 16, Turbopack, shadcn/ui, Geist — confirm or adjust

### Pipeline Execution

```
STATE 1: DISCOVER
  → /brainstorm (explore concept, next-forge research, architecture options)
  → /prd (full product requirements for APEX Ops)
  → Gate: User approves PRD

STATE 2: ARCHITECT
  → /architecture (monorepo structure, packages, deployment)
  → Generate app-level CLAUDE.md for APEX Ops
  → /verify-api for any external integrations
  → /verify-lib for all dependencies
  → Gate: User approves architecture

STATE 3-7: PLAN → VERIFY → BUILD → QUALITY → SHIP
  → Full pipeline with isolated TDD agents
  → /spec-create for each feature within the app
```

---

## 4. Pending Work

### On branch `feat/tdd-sdd-mastery-guide-audit` (committed)

- 3 new TDD agents (tdd-red, tdd-green, tdd-refactor)
- /tdd skill upgraded to orchestrator
- /spec-create skill created
- auto-test.sh PostToolUse hook
- stop-gate.sh hardened to exit 2
- builder.md, output style, CLAUDE.md updated

**Action needed**: PR and merge before starting APEX Ops build (or build on top of this branch)

### Still on main (not staged)

- `.claude/skills/about/SKILL.md` — modified (staged earlier, check status)
- `docs/guides/install-guide-en-us.md` — modified (unrelated change)

---

## Session Start Checklist

```
1. /clear
2. Read this file: docs/specs/next-session-agenda.md
3. Merge or PR the TDD/SDD branch first
4. Start audit (section 1)
5. Fetch next-forge docs (section 2)
6. Enter pipeline for APEX Ops (section 3)
```
