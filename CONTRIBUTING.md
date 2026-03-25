# Contributing to APEX Framework

Thank you for your interest in contributing to APEX. This document explains how to participate.

## Framework Rules

All contributors must read [`CLAUDE.md`](CLAUDE.md) before submitting code. It is the authoritative source for framework rules, code standards, and the autonomous pipeline workflow. Key rules that affect contributions:

- **Rule #3**: Verify all dependencies before installing
- **Rule #4**: QA gate is mandatory before any task is marked complete
- **Rule #16**: Design DNA must be read before building any UI
- **Rule #17**: Search for existing components before creating new ones

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/apex-framework.git`
3. Install into a test project: `./install.sh`
4. Run the health check: `bash .claude/scripts/health-check.sh`

## Development Workflow

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes following our standards
3. Validate scripts: `bash -n .claude/scripts/*.sh`
4. Commit with conventional format: `feat(scope): description`
5. Push and open a PR against `main`

## Code Standards

- **Shell scripts**: Must pass `bash -n` syntax validation
- **Commit messages**: Conventional format, 72-char subject line max
- **Skills**: Must include `SKILL.md` with proper frontmatter
- **Agents**: Must include proper YAML frontmatter (name, description, tools, model)
- **No hardcoded secrets**: Security scanning hooks enforce this

## PR Quality Criteria

### What makes a good skill?

- Fills a genuine gap — not duplicating an existing skill (`ls .claude/skills/` first)
- Includes `SKILL.md` with: purpose, when to use it, usage examples, output format
- Self-contained: no external dependencies that aren't already in the framework
- Testable: includes validation commands or expected outputs
- 300 lines or fewer

### What makes a good agent?

- Clear separation of concerns — one role, one responsibility
- Proper YAML frontmatter: `name`, `description`, `tools`, `model`, `maxTurns`
- Does not duplicate what another agent already handles
- Includes escalation rules (what to do when stuck)
- Works within the team communication protocol (`SendMessage`, task format)

### What makes a good hook?

- Must pass `bash -n` syntax validation
- Uses `< /dev/null` for any background processes (see CLAUDE.md Rule #21)
- Emits `systemMessage` JSON when `jq` is missing — no silent failures
- Stays under 50ms execution time (hooks run on every tool call)
- Includes a comment header with purpose and trigger event

## Design DNA Testing

When contributing UI components or Design DNA templates:

1. **Read the matching DNA page** from `docs/design-dna/` for your page type
2. **Run the DNA test suite** to verify new pages integrate correctly:
   ```bash
   bash tests/test-design-dna.sh
   ```
3. **Verify these requirements** before submitting:
   - Page loads `palette.js` and `svg-backgrounds.js`
   - Persistent nav/footer are injected
   - At least one SVG background or pattern is applied
   - All DNA pages pass the palette integrity check
4. **Side-by-side comparison**: Open your component next to the DNA reference page. Font sizes within ±1px, padding within ±2px, same border radius, same transition timing.

## What We Accept

- Bug fixes with clear reproduction steps
- New skills that fill genuine gaps (not duplicating existing ones)
- Design DNA templates and patterns
- Documentation improvements
- Performance optimizations with benchmarks

## What We Don't Accept

- Changes that duplicate native Claude Code features
- Agent definitions without clear separation of concerns
- Skills without proper documentation
- Breaking changes without migration path

## Review Process

All PRs go through:
1. Automated script validation
2. Code review by maintainers
3. Quality gate (`/qa`)
4. CHANGELOG update required

## Questions?

Open a GitHub Discussion or issue for questions about contributing.
