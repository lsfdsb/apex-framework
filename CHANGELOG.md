# Changelog

All notable changes to the APEX Framework will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Block `git commit` on main/master — catches mistakes at commit time, not push time
- Branch pre-flight check in `/commit` skill — Step 0 verifies branch before staging
- Push-to-main error now includes exact recovery recipe (branch, reset, push)
- Stop-gate exempts `.sh`/`.json`/`.md` files — no false "run tests" nudge on scripts
- Session-context warns about uncommitted changes on main at startup
- Chore version bumps (`v*`, `polish`, `release`) now logged to changelog as "Changed"
- PR link: universal terminal support — OSC 8 for iTerm2/Kitty/WezTerm, raw URL for Terminal.app
- PR cache: 60s per-branch cache + "no PR" sentinel to eliminate redundant `gh pr view` calls
- PR cache cleanup on session start

## [5.9.0] — 2026-03-18 — UX Writing, Statusline PR Link, Extended Patterns

### Added
- Statusline: clickable PR link with merge status (🟢 open, 🟣 merged, 🔴 closed) via OSC 8 hyperlinks
- Statusline: agent tracking shows types — "🤖 3 (Explore, Plan, reviewer) 45.2K"
- Agent tracking: `types` array in /tmp/apex-agents.json
- UX Writing guidelines — button labels, error messages, empty states, confirmations, loading, success, tooltips, tone of voice (design-system)
- Content Quality review dimension (#10) — microcopy checklist, locale formatting (cx-review)
- Squash-merge reminder added to /changelog skill
- i18n patterns — next-intl, path-based URLs, RTL support (nextjs rule)
- PWA patterns — @serwist/next, service worker, offline page (nextjs rule)
- Payments patterns — Stripe Checkout/Elements, webhook verification (architecture)
- Transactional email patterns — Resend, React Email, CAN-SPAM compliance (architecture)
- Analytics & privacy patterns — Plausible, Vercel Analytics, Do Not Track (architecture)
- SEO patterns — meta tags, Open Graph, sitemap, structured data, canonical URLs, robots.txt (#35)
- Form patterns — react-hook-form + zod, inline validation on blur, loading states (#35)
- State management decision tree — zustand + TanStack Query + nuqs (#35)
- Animation implementation — framer-motion patterns with reduced-motion check (#35)
- Production observability — Sentry, Vercel Analytics, health endpoint pattern (#35)
- Interaction patterns — forms, navigation, data display, notifications, modals, search (#34)
- Page templates — landing, dashboard, settings, auth, list/table (#34)
- Dark mode implementation guide with CSS custom properties (#34)
- CX review dimensions 6-9: resilience, destructive actions, first-time experience, mobile excellence (#34)
- E2E testing — axe-core/playwright integration for automated a11y (#34)
- Self-learning loop — session-learner.sh, extract-session.sh, lessons on startup (#33)
- Deterministic security — scan-security-patterns.sh blocks hardcoded keys, eval(), SQL injection (#33)
- Docs-first API integration — /research and /verify-lib mandate WebFetch to official docs (#33)
- `/claude-api` skill for Claude API and Anthropic SDK integration (#33)
- Bootstrap flow — fresh projects auto-detect missing .claude/ and guide through /init (#33)
- `auto-changelog.sh` — PostToolUse hook that auto-documents every commit to CHANGELOG.md
- auto-changelog hook + statusline Beskar Edition (cd6774d)

### Changed
- StatusLine upgraded to Beskar Edition — gradient bar (`█▓▒░`), health indicator (`🟢🟡🔴`), correct context math (`PCT% USED/TOTAL`), net lines, smart duration (`8s/30m/1h30m`), Mandalorian sign-off
- StatusLine output switched from echo to printf for OSC 8 escape sequence support
- Supabase skill refactored — split 623-line SKILL.md into 49-line SKILL.md + 574-line reference.md (#34)
- Stack updated to March 2026 — Next.js 16, Tailwind v4, Zod v4, Biome 2, Drizzle 0.45, Prisma 7 (#33)
- NEVER Ship list expanded with "Submit" buttons, stack traces, blank pages (cx-review)
- Cost column removed from statusline (redundant for MAX plan users)
- audit cleanup — remove redundant skills, fix refs (28422e5)

### Fixed
- outputStyle uses frontmatter `name` field, not file path (#32)
- auto-detect TTY for git hook animations (77e76be)

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
