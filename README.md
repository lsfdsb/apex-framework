# APEX Framework

> **A**gent-**P**owered **EX**cellence — A complete Claude Code framework for building world-class applications.

*"Simplicity is the ultimate sophistication."* — Da Vinci

---

## What Is This?

APEX is a carefully designed system of **Skills**, **Subagents**, **Hooks**, and **Output Styles** for Claude Code. It turns Claude Code from a coding assistant into a complete development partner that follows best practices by default.

Every piece serves a purpose. Nothing is decoration.

## Philosophy

We build with the masters as our guides:

| Discipline | Inspiration | Principle |
|-----------|-------------|-----------|
| Design | Jony Ive | Radical simplicity — every element earns its place |
| Code | Linus Torvalds & Jeff Dean | Clean, performant, zero waste |
| Security | Alex Ionescu & Joanna Rutkowska | Defense in depth, trust nothing |
| Business | Dario Amodei | Long-term thinking, build what matters |
| Experience | Our CX Philosophy | Understand users holistically, service as economic asset |

## Architecture

APEX uses each Claude Code feature for what it does best:

```
┌─────────────────────────────────────────────────────┐
│  CLAUDE.md (Always Loaded — ~80 lines)              │
│  Core rules, tech stack, git workflow, file org      │
│  "What Claude should ALWAYS know"                    │
├─────────────────────────────────────────────────────┤
│  OUTPUT STYLE: APEX Educational                      │
│  Modifies system prompt for teaching-first output    │
│  "HOW Claude communicates"                           │
├─────────────────────────────────────────────────────┤
│  SKILLS (On-Demand — loaded when relevant)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐        │
│  │ /prd     │ │ /qa      │ │ /security    │        │
│  │ (fork)   │ │ (inline) │ │ (inline)     │        │
│  └──────────┘ └──────────┘ └──────────────┘        │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐        │
│  │/research │ │/deploy   │ │ /cx-review   │        │
│  │ (fork)   │ │ (fork)   │ │ (inline)     │        │
│  └──────────┘ └──────────┘ └──────────────┘        │
│  ┌──────────────┐ ┌───────────┐ ┌───────────┐      │
│  │ design-system│ │code-stds  │ │performance│      │
│  │ (auto-load)  │ │(auto-load)│ │(auto-load)│      │
│  └──────────────┘ └───────────┘ └───────────┘      │
├─────────────────────────────────────────────────────┤
│  SUBAGENTS (Isolated Context)                        │
│  ┌──────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │code-reviewer │ │ researcher │ │design-reviewer│  │
│  │ (read-only)  │ │ (read-only)│ │ (read-only)  │  │
│  │ +memory      │ │ +memory    │ │              │  │
│  └──────────────┘ └────────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────┤
│  HOOKS (Deterministic — fire EVERY time)             │
│  SessionStart → inject date, git context, reminders  │
│  PreToolUse   → block dangerous commands & files     │
│  PostToolUse  → auto-format edited files             │
│  Notification → desktop alerts                       │
└─────────────────────────────────────────────────────┘
```

## Understanding the Layers

### Layer 1: CLAUDE.md — The Constitution

**What**: A markdown file loaded at every session start.
**Why**: Gives Claude persistent context about your project without consuming on-demand tokens.
**Rule of thumb**: Keep under 200 lines. If it's growing, move content to skills.

### Layer 2: Output Style — The Voice

**What**: Modifies Claude's system prompt to change how it communicates.
**Why**: We need every interaction to be educational — teaching what's being built and why.
**Key detail**: Uses `keep-coding-instructions: true` so we don't lose coding capabilities.

### Layer 3: Skills — The Knowledge

**What**: On-demand knowledge and workflows. Loaded when relevant, or triggered with `/name`.
**Why**: Keeps context clean. Claude loads design system knowledge only when doing UI work.

Two types in our framework:

| Skill | Type | Trigger | Why This Type |
|-------|------|---------|---------------|
| `/prd` | Task (forked) | User only | Creates files, heavy planning — isolated context |
| `/qa` | Reference (inline) | User + Claude | Needs conversation context to review what was just built |
| `/security` | Reference (inline) | User + Claude | Needs to see current code in conversation |
| `/research` | Task (forked) | User only | Heavy doc reading — isolated to save main context |
| `/deploy` | Task (forked) | User only | Side effects — never auto-triggered |
| `/cx-review` | Reference (inline) | User + Claude | Needs conversation context for UX review |
| `design-system` | Reference (auto) | Claude only | Background knowledge when doing UI work |
| `code-standards` | Reference (auto) | Claude only | Background knowledge when writing code |
| `performance` | Reference (inline) | User + Claude | Needs current context for optimization review |

### Layer 4: Subagents — The Specialists

**What**: Isolated workers with their own context window and tool restrictions.
**Why**: Heavy tasks (code review, research, design review) consume lots of tokens. Subagents keep your main context clean by doing the work in isolation and returning only a summary.

**Key insight**: Subagent files are **system prompts**, not user prompts. They configure behavior. This is the #1 mistake people make.

| Agent | Tools | Memory | Skills Preloaded |
|-------|-------|--------|-----------------|
| `code-reviewer` | Read, Grep, Glob, Bash (no Write) | Project | code-standards, security |
| `researcher` | Read, Grep, Glob, Bash, WebSearch | User | — |
| `design-reviewer` | Read, Glob, Grep (no Bash) | — | design-system, cx-review |

### Layer 5: Hooks — The Guardrails

**What**: Shell scripts that fire automatically at lifecycle events.
**Why**: Skills are probabilistic (Claude uses judgment). Hooks are deterministic (fire every time). Use hooks for rules that CANNOT be broken.

| Event | Hook | What It Does |
|-------|------|-------------|
| `SessionStart` | session-context.sh | Injects date, git status, reminders after compaction |
| `PreToolUse` (Bash) | block-dangerous-commands.sh | Blocks rm -rf, force push, DROP TABLE |
| `PreToolUse` (Edit/Write) | protect-files.sh | Blocks edits to .env, lock files, .git/ |
| `PostToolUse` (Edit/Write) | auto-format.sh | Runs Prettier/Black on edited files |
| `Notification` | notify.sh | Desktop alerts when Claude needs attention |

### Layer 6: Agent Teams (Experimental)

**What**: Multiple Claude Code instances working together, communicating directly.
**Why**: For complex tasks where workers need to share findings and coordinate.
**When**: Cross-layer changes (frontend + backend + tests), adversarial debugging, large refactors.
**Enabled**: Via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.

## The Development Workflow

```
1. Idea → /prd (creates PRD in docs/prd/)
2. PRD approved → /architecture (designs system in docs/architecture/)
3. Architecture approved → /research (for any new APIs/libraries → docs/research/)
4. Implementation (code-standards auto-loads, design-system auto-loads)
5. Review → Claude spawns code-reviewer and design-reviewer subagents
6. QA → /qa (5-phase quality gate)
7. Security → /security (on auth/payment/PII code)
8. CX Review → /cx-review (emotional + functional + accessibility)
9. Deploy → /deploy (pre-deployment checklist)
```

Every step is:
- **Traceable**: outputs saved to docs/
- **Educational**: explained to the user
- **Quality-gated**: must pass before proceeding
- **Context-aware**: reads existing code before changing anything

## Installation

### As a Project Configuration

Copy the `.claude/` directory into your project root:

```bash
cp -r apex-framework/.claude /your-project/
cp apex-framework/CLAUDE.md /your-project/
```

### As a Plugin

```bash
claude plugin install /path/to/apex-framework
```

### Activate the Output Style

```bash
# In Claude Code:
/output-style apex-educational
```

Or set it in `.claude/settings.local.json`:
```json
{
  "outputStyle": ".claude/output-styles/apex-educational.md"
}
```

## File Structure

```
.claude/
├── settings.json           # Shared team config (hooks, permissions)
├── settings.local.json     # Personal overrides (gitignored)
├── output-styles/
│   └── apex-educational.md # Educational output style
├── skills/
│   ├── prd/SKILL.md        # Product Requirements Document generator
│   ├── design-system/SKILL.md  # UI/UX design system
│   ├── qa-gate/SKILL.md    # Quality assurance gate
│   ├── security-audit/SKILL.md # Security audit
│   ├── performance/SKILL.md    # Performance optimization
│   ├── architecture/SKILL.md   # System architecture
│   ├── cx-review/SKILL.md      # Customer experience review
│   ├── code-standards/SKILL.md # Coding standards (auto-load)
│   ├── deploy/SKILL.md         # Deployment checklist
│   └── research/SKILL.md       # Documentation research
├── agents/
│   ├── code-reviewer.md    # Code review specialist (read-only)
│   ├── researcher.md       # Research specialist (read-only)
│   └── design-reviewer.md  # Design review specialist (read-only)
├── scripts/
│   ├── session-context.sh  # SessionStart: inject project context
│   ├── block-dangerous-commands.sh  # PreToolUse: safety gate
│   ├── protect-files.sh    # PreToolUse: file protection
│   ├── auto-format.sh      # PostToolUse: auto-formatting
│   └── notify.sh           # Notification: desktop alerts
├── hooks/                   # (placeholder for future hook configs)
└── templates/               # (placeholder for project templates)

CLAUDE.md                    # Project constitution (always loaded)
docs/
├── prd/                     # PRD outputs
├── architecture/            # Architecture docs
└── research/                # Research findings
```

## Key Concepts for Our Head of CX

### Deterministic vs Probabilistic

This is the most important concept in the framework:

- **Hooks** = deterministic. They fire every single time. "Format this file after every edit." 100% reliability.
- **Skills** = probabilistic. Claude uses judgment about when to load them. "Apply design system when doing UI work." ~90% reliability.
- **CLAUDE.md** = deterministic context. Always loaded. Always available. But Claude still uses judgment about whether to follow the instructions.

**Rule**: If a rule CANNOT be broken (security, formatting, git workflow), put it in a hook. If it's guidance that requires judgment, put it in a skill or CLAUDE.md.

### Context Window Management

Claude has a limited context window. Think of it as short-term memory:

- **CLAUDE.md**: Always in memory. Keep it small (~80 lines).
- **Skills**: Loaded on-demand. Only in memory when needed.
- **Subagents**: Get their own memory. Don't consume yours.
- **Agent Teams**: Each teammate has independent memory. Best for parallel work.

When context fills up, Claude "compacts" (summarizes). Our SessionStart hook re-injects key reminders after compaction.

### The Fork Decision

`context: fork` in a skill means "run this in a separate subagent." Use it when:
- The task produces lots of output (research, PRD writing)
- The task is self-contained (deployment checks)
- You don't need the conversation history

Don't use it when:
- The skill needs to see what you've been discussing (QA review, CX review)
- The skill adds knowledge to the current conversation (design system, code standards)

---

*This is the way.*
