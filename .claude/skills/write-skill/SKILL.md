---
name: write-skill
description: Use when creating new APEX skills, editing existing skills, or verifying skills work before deployment. Also use when the user says "new skill", "create skill", "write a skill", "add a command", or when extending the framework.
argument-hint: "[skill-name]"
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Writing APEX Skills — TDD for Process Documentation

> "Weapons are part of my religion." — and skills are the weapons we forge.

Writing skills IS Test-Driven Development applied to process documentation. You write test cases (pressure scenarios), watch them fail (baseline behavior), write the skill, watch tests pass (agents comply), and refactor (close loopholes).

## When to Create a Skill

**Create when:**
- Technique wasn't intuitively obvious
- You'd reference this again across projects
- Pattern applies broadly (not project-specific)
- Others would benefit

**Don't create for:**
- One-off solutions
- Standard practices well-documented elsewhere
- Project-specific conventions (put in CLAUDE.md)
- Mechanical constraints enforceable with automation

## Skill Types

| Type | Description | Example |
|------|-------------|---------|
| **Technique** | Concrete method with steps | `/debug`, `/tdd` |
| **Pattern** | Way of thinking about problems | `/brainstorm` |
| **Reference** | API docs, tool documentation | `/supabase` |
| **Gate** | Quality enforcement checkpoint | `/qa`, `/verify` |

## SKILL.md Structure

```markdown
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions]. Do NOT summarize the workflow here.
argument-hint: "[example args]"
allowed-tools: Read, Grep, Glob, Bash
---

# Skill Name

## Overview
What is this? Core principle in 1-2 sentences.

## When to Use
Bullet list with symptoms and use cases.

## Core Pattern
Before/after code comparison or process steps.

## Quick Reference
Table for scanning.

## Common Mistakes
What goes wrong + fixes.

## Integration
What other skills this connects to.
```

## Critical: Description Field

**Description = WHEN to use, NOT what the skill does.**

Testing revealed: when a description summarizes workflow, Claude follows the description instead of reading the full skill. Keep descriptions to triggering conditions only.

```yaml
# BAD: Summarizes workflow
description: Use for TDD - write test first, watch it fail, write minimal code

# GOOD: Just triggering conditions
description: Use when implementing any feature or bugfix, before writing implementation code
```

## Keyword Coverage (CSO)

Use words Claude would search for:
- Error messages: "Hook timed out", "race condition"
- Symptoms: "flaky", "hanging", "broken"
- Synonyms: "timeout/hang/freeze"
- Tools: actual commands, library names

## Naming Convention

**Active voice, verb-first or gerund:**
- `debug` not `debugging-helper`
- `verify` not `verification-system`
- `write-skill` not `skill-creation`

## Token Efficiency

Skills load into context. Every token counts.

- Target: < 500 words for most skills
- Move details to tool `--help`, not skill docs
- Cross-reference other skills instead of repeating
- One excellent example beats many mediocre ones

## Bulletproofing Against Rationalization

For discipline-enforcing skills (like `/tdd`, `/verify`):

1. **Close every loophole explicitly** — Don't just state the rule, forbid specific workarounds
2. **Add "Spirit vs Letter" guard** — "Violating the letter of the rules is violating the spirit"
3. **Build rationalization table** — Every excuse agents make → reality column
4. **Create red flags list** — Self-check triggers for when you're rationalizing

## File Organization

```
skills/
  skill-name/
    SKILL.md              # Main reference (required)
    supporting-file.*     # Only if needed (heavy reference, templates)
```

Separate files only for: heavy reference (100+ lines), reusable tools/templates.

## Skill Creation Checklist

- [ ] Name uses letters, numbers, hyphens only
- [ ] YAML frontmatter with `name` and `description`
- [ ] Description starts with "Use when..." (no workflow summary)
- [ ] Clear overview with core principle
- [ ] Code inline OR link to separate file
- [ ] One excellent example
- [ ] Quick reference table
- [ ] Common mistakes section
- [ ] Integration section (what other skills connect)
- [ ] Commit skill to git

## Integration

- **Follows** APEX skill format in `.claude/skills/<name>/SKILL.md`
- **Uses** `/verify` to confirm skill was saved correctly
- **References** Anthropic best practices for skill authoring
