# Anthropic Skill Authoring Best Practices

> Official guidance adapted from Anthropic's skill documentation.

## Core Principles

### Concise is Key
Context window is a public good. Only add context Claude doesn't already have.
- "Does Claude really need this explanation?"
- "Can I assume Claude knows this?"
- "Does this paragraph justify its token cost?"

### Degrees of Freedom

**High freedom** (text instructions) — when multiple approaches are valid:
```markdown
1. Analyze code structure
2. Check for edge cases
3. Suggest improvements
```

**Low freedom** (exact scripts) — when operations are fragile:
```bash
python scripts/migrate.py --verify --backup
# Do not modify this command.
```

**Rule of thumb:** Narrow bridge with cliffs = low freedom. Open field = high freedom.

### Test With All Target Models

| Model | Consideration |
|-------|--------------|
| **Haiku** | Does the skill provide enough guidance? |
| **Sonnet** | Is the skill clear and efficient? |
| **Opus** | Does the skill avoid over-explaining? |

## Structure

### Naming
Use gerund form: "Processing PDFs", "Testing code", "Managing databases"
Avoid: "Helper", "Utils", vague names.

### Description Field (Critical)
- Write in **third person** (injected into system prompt)
- Include WHAT it does AND WHEN to use it
- Max 1024 characters
- Be specific — Claude uses this to choose from 100+ skills

```yaml
# Good
description: "Processes Excel files when user mentions spreadsheets, CSV imports, or data analysis"

# Bad
description: "I can help you with Excel files"
```

### SKILL.md Body
- Lead with overview and core principle
- Quick reference tables for scanning
- Code examples: one excellent > many mediocre
- Cross-reference other skills by name, not file path
- Avoid `@` links (force-loads files, burns context)

## Token Efficiency

- Target: < 500 words for most skills
- Move details to `--help`, not skill docs
- Cross-reference instead of repeating
- Compress examples: 20 words beats 42 words
- Don't explain what's obvious from the command

## File Organization

```
skills/
  skill-name/
    SKILL.md              # Main reference (required)
    supporting-file.*     # Only if needed (heavy reference, templates)
```

Separate files for: heavy reference (100+ lines), reusable tools.
