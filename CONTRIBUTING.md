# Contributing to APEX Framework

Thank you for your interest in contributing to APEX. This document explains how to participate.

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
