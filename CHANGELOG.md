# Changelog

All notable changes to the APEX Framework will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]


### Fixed
- auto-detect TTY for git hook animations (77e76be)

### Added
- `auto-changelog.sh` — PostToolUse hook that auto-documents every commit to CHANGELOG.md
- Auto-changelog registered in project and global settings (PostToolUse on Bash)
- auto-changelog hook + statusline Beskar Edition (cd6774d)

### Changed
- StatusLine upgraded to Beskar Edition — gradient bar (`█▓▒░`), health indicator (`🟢🟡🔴`), correct context math (`PCT% USED/TOTAL`), net lines, smart duration (`8s/30m/1h30m`), Mandalorian sign-off
- Removed flickering pulse animation and dead `CTX_ICON` variable from statusline
- Cost column removed from statusline (redundant for MAX plan users)

### Removed
- `apex-review` skill — functionality absorbed by `/evolve` and framework-evolver agent
- `deploy` skill — deployment readiness absorbed by `/qa deploy` (Phase 6)
- `workflow-enforcer` skill — workflow enforcement handled by deterministic hooks (`enforce-workflow.sh`, `guard-workflow-skip.sh`)
- Cleaned 45+ dangling references to removed skills across scripts, docs, and guides
- Removed `.failure-log` debugging artifact

## [5.7.0] — 2026-03-17 — Animated UI, Prettier, Bug Fixes

### Added
- Real animated intro banner on session startup (45ff479)
- Braille Grogu ASCII art with animated poses and auto-intro (d60e752)
- Animations, colors, and Grogu easter eggs in session context (f68daab)
- `apex-launch.sh` tracked and git hooks installed (bf20623)
- Broader PRD detection, React SPA stack guide, pnpm support (055e7ca)
- Full hook coverage across all Claude Code lifecycle events (6096f79)

### Fixed
- APEX Educational output style enforced from first message (a3d0b01)
- `verify-install` no longer triggers false positives in quoted strings (76e1cbb)
- `apex-init-project.sh` used instead of manual file creation (5688851)
- Grogu art redesigned, borders and statusline fixed (47fcb94)

### Removed
- Claude Code CI workflow removed (missing API key) (639714a)

## [5.6.0] — 2026-03-17 — Auto-Update, Self-Evolution & Definitive Debug

### Added
- Auto-update system — APEX checks for GitHub updates on SessionStart (pulls latest skills, hooks, agents automatically)
- Project-level auto-update on SessionStart — keeps project-installed APEX files in sync with the user-level source
- `/evolve` skill — spawns framework-evolver agent to analyze session transcripts for gaps and improvements
- `framework-evolver` agent — autonomous self-improvement agent that proposes targeted framework changes
- Session transcript extraction script (`extract-session.sh`) for `/evolve` analysis
- `VERSION` file — single source of truth for version, resolved dynamically by session banner
- `/set-language` skill — persists language preference (en-us / pt-br) across sessions
- `/dev` skill — dev server management (status, logs, restart, stop)
- `dev-server.sh` — SessionStart hook that auto-starts the dev server in background and captures logs
- `dev-monitor.sh` — Stop hook that monitors dev server logs for errors, warnings, and crashes
- `claude-code.yml` — GitHub Actions workflow with `anthropics/claude-code-action@v1` for automated PR review
- Session cleanup now kills the dev server on SessionEnd
- `/debug` skill rewritten with "Definitive Solutions Only" philosophy — root cause analysis, impact mapping, fix hierarchy (type system > tests > runtime), anti-pattern detection
- `handle-failure.sh` enhanced with retry-loop detection (warns after 3+ failures in 60s) and definitive fix guidance
- Core rules "Definitive fixes only" (rule 8) and "Impact analysis before changes" (rule 9) added to CLAUDE.md

### Removed
- `.github/workflows/claude-pr-review.yml` — replaced by official Claude Code GitHub Action

## [5.5.0] — 2026-03-16 — Supabase Integration & Skill Fixes

### Added
- `/supabase` skill — comprehensive Supabase helper with subcommands: setup, auth, migration, types, realtime, storage, edge-functions
- `supabase.md` rule — auto-loads when working with Supabase-related files
- `/init` skill updated with Supabase scaffolding step
- `sql-practices` reference expanded with multi-tenant RLS, role-based RLS, storage policies, realtime setup, connection pooling, and migration templates
- `.mcp.json.template` updated with Supabase MCP server as primary option

### Fixed
- Removed `disable-model-invocation` flag from 7 skills — was blocking `/slash` command invocation
- Updated Opus context window from 200K to 1M in cost-management skill

## [5.4.0] — 2026-03-16 — Full Claude Code Integration

### Added
- `guard-workflow-skip.sh` — UserPromptSubmit hook: nudges users when they try to skip PRD/tests/security
- `handle-failure.sh` — PostToolUseFailure hook: diagnostic hints for TypeScript, test, npm, build, and permission errors
- `post-compact.sh` — PostCompact hook: verifies critical context survived compaction
- `log-subagent.sh` — SubagentStop hook: logs agent completions for visibility
- `session-cleanup.sh` — SessionEnd hook: warns about uncommitted files, cleans up state
- `.mcp.json.template` — MCP server template with GitHub, Postgres, Filesystem, Sentry configs
- `.github/workflows/claude-pr-review.yml` — GitHub Actions workflow for Claude Code automated PR reviews
- Network sandbox: `allowedDomains` restricts outbound to GitHub, npm, Anthropic, Supabase, Vercel, Sentry
- `argument-hint` on all 14 user-invocable skills
- Shell injection on qa, security, deploy, commit, changelog skills
- Debug checkpointing section (git stash save/restore for debugging sessions)

### Fixed
- `session-cleanup.sh` now warns when jq is missing
- Test suite expanded from 68 to 83 tests (all passing)

## [5.3.0] — 2026-03-16 — Quality Hardening

### Added
- `stop-gate.sh` — Stop hook that warns when code is written but tests aren't run
- `enforce-workflow.sh` — Deterministic PRD enforcement
- `install.sh` — One-command installer with language selection
- `tests/test-hooks.sh` — 68-test suite for all hook scripts

### Fixed
- All hook scripts now warn when jq is missing
- `enforce-commit-msg.sh` — replaced `grep -oP` with POSIX-compatible `sed` for macOS
- Language preference defaults to `"ask"` instead of hardcoded `pt-br`

### Removed
- `.claude-plugin/plugin.json` — decorative, Claude Code has no plugin system

## [5.2.0] — 2026-03-13 — Initial Release

- 25 skills, 3 agents, 10 hook scripts, 4 rules, 2 output styles
- Full workflow: PRD → Architecture → Research → Build → QA → Security → CX Review → Deploy
- 3-tier model strategy (Opus/Sonnet/Haiku)
- Bilingual support (en-us / pt-br)
- StatusLine with real-time metrics
