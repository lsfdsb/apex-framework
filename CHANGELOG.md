# Changelog

All notable changes to the APEX Framework will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [5.14.0] — 2026-03-20 — Native Alignment Audit

Comprehensive audit against Claude Code's native capabilities. Every feature must earn its place — if Claude Code does it natively, APEX doesn't duplicate it.

### Removed
- **`/evolve` skill** — Removed self-evolution feature. Skill, agent (`framework-evolver`), scripts (`extract-session.sh`, `apex-sync.sh`) deleted
- **`/debug` skill** — Claude Code has native `/debug` bundled skill
- **`/research` skill** — Claude Code has native WebSearch + WebFetch tools
- **`/code-standards` skill** — Redundant with `.claude/rules/` path-based rules
- **`/sql-practices` skill** — Redundant with `.claude/rules/sql.md`
- **`/cost-management` skill** — Claude Code handles auto-compaction natively
- **`/init` skill** — Claude Code has native `/init` command
- **`/apex-stack` skill** — Stack recommendations go stale; WebSearch provides current data
- **`researcher` agent** — Claude Code's native WebSearch + WebFetch + Explore subagent replace this
- **`guard-workflow-skip.sh`** — Advisory nudge, redundant with `enforce-workflow.sh`
- **`auto-format.sh`** — Redundant with Prettier pre-commit hook
- **`verify-install.sh`** — Redundant with session-context.sh bootstrap detection
- **`track-agent-start.sh`** — Claude Code natively tracks subagents
- **Test infrastructure** — Entire `tests/` directory removed for redesign
- **31 stale local branches** — Accumulated feature/fix branches cleaned

### Changed
- **Agent roster** — 10 → 7 agents (Framework Evolver, Researcher removed; code-reviewer replaced by official plugin)
- **Agent skills** — Removed `code-standards`, `sql-practices`, `debug` from all agent frontmatter. Agents now reference only skills that still exist
- **settings.json** — Removed 4 hook entries pointing to deleted scripts (UserPromptSubmit, PreToolUse verify-install, PostToolUse auto-format, SubagentStart track-agent-start)
- **session-context.sh** — Hook verification loop updated to match actual scripts
- **health-check.sh** — Removed auto-format.sh from critical scripts check
- **CLAUDE.md** — `/research` references → WebSearch; Researcher agent removed from roster
- **README.md** — Updated agent counts, replaced `/debug` and `/research` with native equivalents
- **Installed `code-review` plugin** — Official Anthropic plugin replaces custom code-reviewer agent

### Fixed
- **Builder/Debugger worktree file loss** — Root cause fix: `permissionMode: default` → `dontAsk` so worktree agents can commit. This was the actual cause of 6+ file loss incidents — not missing docs, not merge strategy.
- **CLAUDE.md bloat** — Slimmed from 220 → 116 lines (-47%). Moved Agent Teams details to `/teams` skill. Under official 200-line recommendation.
- **106 stale remote branches** deleted — only `main` remains

### Stats
- Skills: 28 → 21 (-7)
- Agents: 9 → 7 (-2)
- Scripts: 22 → 18 (-4)
- CLAUDE.md: 220 → 116 lines (-47%)
- Remote branches: 108 → 1
- Lines deleted: ~6,200

## [Unreleased]

### Added
- **React Page Templates** — 14 full-featured templates (Landing, SaaS, CRM, E-commerce, Blog, Portfolio, Social, LMS, Backoffice, Design System, Email, Presentation, E-book, Pattern Showcase) ready to copy into projects (#115)
- **5 New Starter Components** — StatCard, ChartCard, ThemeToggle, EmptyState, KanbanColumn for richer dashboards and data flows (#115)
- **RGB Tokens** — All 5 design palettes now include RGB values for dynamic theming and programmatic color manipulation (#115)

### Changed
- **Code Reviewer Agent** — Expanded from 91 to 130 lines with enhanced security scanning, OWASP rules integration, and better error categorization (#115)
- **Design Reviewer Agent** — Added task auto-claim for continuous design compliance, expanded DNA path scanning to catch hardcoded colors (#115)
- **Rules Refactored** — Narrowed API/SQL/Supabase/Testing/Error-Handling paths with code examples, deduplicated constraints, improved clarity (#115)
- **DNA Starters Fixed** — DataTable, Input, Button, Header, MobileNav corrected for proper semantic structure and responsive behavior (#115)
- **Gitignore** — Added `.dna-server.pid` to ignore runtime server PID files (#114)
- **CHANGELOG Generation** — Documented all contributions through v5.13.2, properly formatted entries, no gaps (#113)

### Fixed
- **Session Learner Extraction** — Replaced broken regex with jq-based JSONL parsing for errors, blocks, and user corrections. Previous regex silently returned empty results (#117)
- **False Positive Hook Blocks** — BLOCKED grep now only matches real hook verdicts (`BLOCKED:`), not the word "BLOCKED" in agent documentation. Fixed 5+ sessions of inflated block counts (#117)
- **Tailwind Warning Channel** — Design token warning now outputs to stdout (was stderr), so Claude actually receives the hint (#117)
- **Detached HEAD Guard** — Commit blocker now catches detached HEAD state, preventing orphaned commits from worktree agents (#117)
- **Stale Agent Branch Pruning** — SessionStart now auto-prunes `agent-*` branches with no associated worktree (#117)
- **Settings Allow List** — Added `gh pr/api/repo/run` and `git fetch/merge/rebase/push/worktree/tag` to prevent unnecessary permission prompts (#117)
- **Debugger Git Bug** — Fixed critical `git add -A` to `git add --all -- ':!node_modules' ':!.next' ':!.cache'` that was silently staging build artifacts and breaking commits (#115)
- **Researcher Memory Types** — Corrected memory field definitions from `object` to `string` (#115)
- **Removed Stale QA Cleanup** — Removed obsolete cleanup task from QA agent that was no longer referenced (#115)
- **Worktree cleanup** — Stop orphaned dev servers properly on session end (7ab772b)
## [5.12.0] — 2026-03-20 — Brutal Self-Assessment + Championship Roster

The biggest quality improvement in APEX history. The framework audited itself, found 20+ issues, and fixed them in one session — with 659 tests proving the fixes work.

### Added
- **Behavioral Test Suite v2** — 95 real behavioral tests: security payload scanning (Stripe/AWS/GitHub/OpenAI keys), PRD enforcement with temp directories, commit-msg format validation, Breathing Loop wiring verification, model assignment checks (#105)
- **DNA Extraction Protocol** — Builders must extract palette/fonts/patterns into a checklist BEFORE writing any code. Prevents the "read DNA then ignore it" failure seen in real builds (#105)
- **Rule Zero** — Commit protocol moved to TOP of builder agent prompt. Incremental commits every 3-4 files. Prevents worktree file loss (66% failure rate in Axel LMS build) (#105)
- **Auto-update rollback** — If update fails, automatically restores from backup. Backup cleanup after 7 days (#105)
- **Scan Responsibility Matrix** — Each check has ONE owner. No agent duplication. Watcher=continuous, QA=final gate, Design Reviewer=visual (#105)
- **Task Auto-Claim Protocol** — Builder, Debugger, QA, Technical Writer auto-claim tasks tagged with `[build]`/`[bug]`/`[qa]`/`[docs]` from TaskList (#105)
- **Research→Build dependency** — Tasks with `addBlockedBy` prevent builders from starting integration code before research completes (#105)
- **Steve Jobs** — Product vision added to framework philosophy. "Say no to 1000 things" (#105)

### Changed
- **Code Reviewer → Opus** — Security gate gets the best model. Benchmark-backed: Opus catches 1-2 more vulnerabilities per 10 reviews than Sonnet (#105)
- **Framework Evolver → Sonnet** — Architectural reasoning needs Sonnet, not Haiku (#105)
- **Design Reviewer gets Bash** — Can now run automated design token compliance checks (#105)
- **Watcher delta monitoring** — Continuous loop that only re-checks changed files, not full scans (#105)
- **Merge strategy** — `git checkout <branch> -- <files>` instead of `git merge` (avoids untracked file conflicts) (#105)
- **jq → soft requirement** — Installation continues without jq; hooks degrade gracefully (#105)
- **Linux install guidance** — Platform-aware instructions (apt/dnf) (#105)
- **Teams TL;DR** — Quick-start section at top of 349-line skill (#105)
- **Cost-management expanded** — From 28 to 60 lines with model cost table and context indicators (#105)
- **Builder HTML→React translation** — 7-step guide for converting DNA HTML pages to React/Tailwind components (#105)

### Fixed
- **GitHub repo reference** — `lfrfrfl` → `lsfdsb` in install.sh (broke first-time installs) (#105)
- **Missing script warnings** — Removed `enforce-commit-msg`, `log-subagent`, `post-compact` from session-context hook check (#105)
- **Security regex hardened** — GitHub tokens (ghp_30+ chars), OpenAI keys (sk-*-* with hyphens) now detected (#105)
- **PRD detection simplified** — 2 canonical checks instead of 4 fragile fallbacks (#105)
- **CLAUDE.md rules 1-19** — Fixed numbering (was 1-12, 16-19, 13-15) (#105)
- **Stale counts everywhere** — README, about skill, init skill, install guide all now show correct numbers (29 skills, 9 agents, 23 scripts, 659 tests) (#105)
- **test-all.sh** — Now runs all 4 suites with correct count parsing for agents output format (#105)
- **test-agents.sh** — Fixed syntax error (stray `fi`) and unbound `ROSTER_AGENTS` variable (#105)
- **Log rotation** — handle-failure.sh trims to 200 lines when exceeding 500 (#105)
- **health-check.sh** — Removed reference to deleted `enforce-commit-msg.sh` (#105)
- **test-simulation.sh** — Replaced stale `enforce-commit-msg` assertion (#105)

### Removed
- **CRM Patterns Expansion** — Moved to [Unreleased] in previous version, now part of v5.11.2 scope
- remove fake testing — sentinel, self-test, observatory (#104)

## [5.11.2] — 2026-03-19 — Design DNA Distribution + Framework Tooling

### Added
- **VERSION file** — Single source of truth for framework version, read dynamically by session-context.sh (was hardcoded 5.7.0 fallback)
- **Design DNA installation** — install.sh now copies all 14 Design DNA pages (hub, design-system, landing, crm, ecommerce, saas, blog, portfolio, social, lms, presentation, ebook, email, backoffice) + 2 JS modules (palette.js, svg-backgrounds.js) to new projects at `docs/design-dna/`
- **64 Design DNA tests** — Comprehensive validation suite covering page existence, palette integrity, CRM expansion (10+ patterns), rings fullscreen coverage, pipeline wiring, navigation persistence (352 total tests, all passing)
- **Design DNA dev server** — dev-server.sh auto-detects and starts DNA server (port 3001) when running in APEX framework repo
- **/ship skill** — Fast-track PR workflow: branch → commit → push → create PR → merge in single command; supports draft mode, auto-merge on approval, and configurable commit scopes

### Changed
- README.md updated with v5.11 nomenclature

### Details
- Tests validate all 14 DNA pages load palette.js and svg-backgrounds.js
- CRM expansion verified: 18 component sections (10+ required)
- Rings animated background tested for full-viewport vmax × 1.5 scale coverage
- Pipeline wiring confirms builder.md references DNA, design-reviewer.md has compliance gate, CLAUDE.md has DNA rule
- dev-server.sh gracefully handles stale PID files, prevents port conflicts
- /ship enables single-author fast-track PRs with pre-configured merge strategy

## [5.11.1] — 2026-03-19 — Design DNA Enforcement + Agent Hardening

### Added
- **Watcher DNA Compliance** — Watcher scans new page/screen components for Design DNA references and flags hardcoded Tailwind palette colors as design token violations (#85)

### Fixed
- **Technical Writer Rewrite** — Gap detection first: audits git log + merged PRs against CHANGELOG before writing. Self-verifies all PRs are documented. Lead spawn instructions now require specific change descriptions (#84)

## [5.11.0] — 2026-03-18 — Design DNA Integration

### Added
- **CRM Patterns Expansion** — CRM page scaled from 5 to 15 components: deal detail drawer, contact profile, pipeline analytics + funnel, lead scoring with SVG progress rings, data table with search/filters/pagination, filter bar with active tags, task/follow-up list with due dates, 2 empty state variants, email composer, notes panel
- **Design DNA Wired into Build Pipeline** — CLAUDE.md rule #16 enforces DNA page lookup; design-system SKILL.md routing table for all 14 pages + 2 JS modules; builder.md agent with mandatory DNA checks; design-reviewer.md agent with DNA compliance gate (BLOCK on violations); components.md and reference.md updated
- **Design DNA Pattern Library** — 15-page premium UI showcase at `docs/design-dna/`
  - Hub (animated SVG background, constellation nodes, floating orbs)
  - Design System (tokens, typography, spacing scale, 8 motion demos, component states, radii, shadows)
  - Landing Page (hero, bento features, pricing, testimonials, CTA, footer)
  - CRM + Helpdesk (pipeline kanban, contact cards, activity timeline, live chat, ticket list)
  - E-Commerce (product grid, detail view, cart, order summary, checkout steps)
  - SaaS Dashboard (sidebar nav, stats with sparklines, charts, data table, settings, empty states)
  - Blog + Editorial (featured article, article grid, reading experience, newsletter)
  - Portfolio (project showcase, about split, services grid, contact form)
  - Social Feed (3-column layout, posts, comments, trending, profile cards)
  - LMS (course catalog, video player, lesson list, SVG progress rings, certificates)
  - Presentation (10 slide types: title, stats, quote, roadmap, team, pricing, CTA)
  - E-Book (cover, TOC, reading pages with drop caps, sidenotes, chapter nav, progress bar)
  - Email Templates (welcome, verification, receipt, shipping, password reset, invitation, payment failed, weekly digest)
  - Backoffice (user management, activity logs, invoices, permission matrix)
  - SVG Patterns (14 static patterns + 8 animated backgrounds)
- **Global Palette Switcher** (`palette.js`) — 5 palettes (SaaS, Editorial, Fintech, Startup, Creative) × 2 modes (dark/light) = 10 themes. Persists across pages via localStorage
- **SVG Background Library** (`svg-backgrounds.js`) — 14 static patterns (dots, grid, topo, circuit, hexagons, crosses, diamonds, diagonals, triangles, constellation, isometric, waves, dna, noise) + 8 animated backgrounds (orbs, aurora, particles, gradient, rings, matrix, nebula, spotlight)
- **Background Widget** — Floating pattern/animation picker on every page
- **Persistent Navigation** — Auto-injected nav + footer across all pages
- **Visual defaults** — Anti-generic-AI patterns, 5 curated token sets, 8 CSS animation patterns in `reference.md`
- **Visual Distinctiveness** dimension added to Design Reviewer agent (blocks generic AI look)
- `tests/test-behavioral.sh` — 33 behavioral tests with real Claude Code JSON payloads
- `tests/test-observatory.sh` — 20 runtime tests (starts server, hits API endpoints)
- `tests/test-all.sh` — Aggregator runs all 5 test suites
- `tests/lib/helpers.sh` — Shared test utilities with categorized assertions
- `tests/fixtures/` — 18 Claude Code hook JSON payloads matching official schema
- **Unified Design Widget** — Merged palette switcher + background selector into single icon; palette dots, dark/light mode, 14 static patterns, 9 animated backgrounds all in one panel (#81)

### Fixed
- **Rings background fills screen** — Rings animated background now uses `vmax × 1.5` + `transform: scale()` for full-viewport coverage; 5 rings staggered over 8s eliminates visible reset flash (#80)
- **Worktree commit protocol** — Builders MUST `git commit` before reporting done to prevent file loss (4+ incidents). Lead never rewrites files — re-spawns builder with `isolation: none`. Added recovery protocol and stale worktree cleanup (#82)

### Changed
- `bin/apex` — one-command launcher: auto-detects iTerm2 + tmux, launches Claude Code with split panes
- `install.sh` now symlinks `bin/` tools to `~/.local/bin` and adds to PATH
- Split pane prerequisites documented in CLAUDE.md
- **Always-On Agents** — Watcher and Technical Writer now mandatory in every coding session
- Technical Writer added to all team presets (build, fix, review), not just full
- **Sentinel Phase 8: Observatory Health Check** — Runtime validation of built APEX apps
- **Self-Test Dual Mode** — Quick mode (`/self-test`, `/batman`): 7-phase structural audit; Full mode (`/self-test full`, `/batman full`): 10-phase integration proof with full agent team
- Batman builds apps — dual-mode self-test (7f5177e)
- **APEX Observatory dashboard** — Real-time framework health monitoring (dashboard/server.js + dashboard/index.html)
- **Observatory PRD and architecture docs** — Complete documentation (docs/prd/apex-observatory.md, docs/architecture/apex-observatory.md)
- **Agent Activity section** — `/api/activity` endpoint and dashboard view showing teams, members, and task status
- **framework-evolver** added to CLAUDE.md roster and teams skill
- `tests/test-agents.sh` — Golden Script: 137-test agent validation suite (frontmatter, tools, skills, conflicts, isolation, model fitness)

### Changed
- Technical Writer agent: upgraded to `background: true` + `permissionMode: dontAsk`
- Technical Writer agent: explicit instruction to MUST edit files (fix Haiku hallucination)
- Code Reviewer and QA agents: `isolation: worktree` → `isolation: none` (need real project state)
- Output style enforces always-on agent rule — blocks commits/PRs without Technical Writer
- CLAUDE.md: "Always-On Agents" section added above team spawn rules
- Sentinel agent: maxTurns increased from 50 to 60, report format updated for Phase 8
- Self-Test skill: complete rewrite with quick mode (structural) and full mode (integration proof)
- **StatusLine v2 rewrite** — Simplified from 15 segments to 7; removed custom agent tracking (Claude Code handles natively); graceful cold start; fixed dead code and MAX heuristic
- **Ive Audit**: 6 redundant scripts deleted (auto-approve-safe, enforce-commit-msg, notify, log-subagent, pre-compact, post-compact)
- 7 hook sections removed from settings.json (PermissionRequest, PreCompact, PostCompact, SubagentStop, Notification, InstructionsLoaded, enforce-commit-msg)
- Silent failure pattern fixed: 6 safety-critical scripts now emit `systemMessage` JSON when jq missing instead of silently exiting

### Fixed
- ANSI escape code stripping in test runner API output
- Hooks test parser — `Pass: N` format now correctly matched (was showing 0)
- console.log replaced with process.stdout.write in server startup
- add activity section + update docs (0e3cf99)
- Observatory `collectActivity()` — `hasActive` flag now included in API response
- Observatory activity endpoint — tasks filtered by known teams, no stray UUIDs
- StatusLine cold start — shows "🟢 ready" instead of "0/0"
- StatusLine dead code — removed redundant health check, duplicate model ID check
- StatusLine MAX plan heuristic — now requires tokens > 0
- StatusLine PR timeout race condition — validates PR URLs must start with https://github.com/

### Removed
- Custom agent tracking in statusline (abbrev_agent, /tmp/apex-agents*.json reading)
- StatusLine "This is the way." branding suffix
- `auto-approve-safe.sh` — redundant with settings.json allow list
- `enforce-commit-msg.sh` — redundant with git's native commit-msg hook
- `notify.sh` — redundant with Claude Code's native Notification hook
- `log-subagent.sh` — dead code (was empty)
- `pre-compact.sh` / `post-compact.sh` — redundant with native compaction + auto-memory

## [5.11.0] — 2026-03-18 — Agent Teams: The Championship Roster

### Added
- **6 new agents**: watcher, builder, debugger, qa, technical-writer, sentinel (Batman)
- `/teams` skill — orchestrated agent parallelism with 4 presets (build, fix, review, full)
- `/self-test` skill (aka `/batman`) — summons the Sentinel for full framework verification
- `test-integration.sh` — 111+ wiring checks (hooks→scripts, agents→skills, settings coherence)
- `TaskCompleted` hook — notifies lead when team tasks complete
- `TeammateIdle` hook — suppresses noise from idle teammates
- Breathing Loop — autonomous Watcher→Debugger→QA→Builder cycle
- Autonomous Spawn Rules in CLAUDE.md — lead auto-selects team based on task complexity
- Standardized message format for all team agents
- Timeout/escalation rules — agents escalate after 3 turns stuck
- Framework health monitoring — Watcher checks .claude/ integrity
- Knowledge base — Claude Code docs verified and stored in memory

### Changed
- All agents upgraded to 9.5/10 championship level
- Code Reviewer + Design Reviewer now team-aware (SendMessage, Task tools)
- Builder: +3 skills (design-system, performance, security), 10-point pre-completion checklist
- Watcher: +2 skills (code-standards, performance), explicit bash scan commands
- QA: +1 skill (e2e), full automated command pipeline, 16-point checklist
- Debugger: +1 skill (performance), strict QA handoff chain
- Researcher: +2 skills (verify-lib, security), team-aware, structured output templates
- Framework Evolver: +1 skill (security)
- Design Reviewer: maxTurns 15→20
- Statusline: locale fix (commas→dots), all agents abbreviated (W,B,D,QA,CR,DR,TW,R,🦇)

### Fixed
- Statusline locale bug — numbers showed `0,0K` on pt-BR locale, now `0.0K`

## [5.10.0] — 2026-03-18 — Update Skill, Pre-Commit Fix, Agent Teams Prep

### Added
- `/update` skill — manual framework update from within any Claude session (#49)
- Update instructions in CLAUDE.md — works even on outdated APEX versions (#50)
- Auto-update appends `## Update` section to CLAUDE.md if missing (#50)
- Agent Teams architecture documented — Watcher, Builder, Reviewer roles (next: implementation)

### Fixed
- Pre-commit hook skips TS/lint/prettier when only framework files staged (#49)
- Pre-commit hook shows actual error output instead of hiding with 2>/dev/null (#49)
- PR cache: sanitize branch names with `/` for valid file paths (#47)

## [5.9.1] — 2026-03-18 — Self-Improving Loop, No Silent Skips

### Added
- Proactive `/evolve` suggestion — error counter tracks failures, suggests `/evolve` at 5/10/20 errors (#46)
- `/prd` skill auto-generates README.md from PRD content after document creation (#46)
- No silent skips — all hooks provide feedback for every exit path (#45)
- Auto-update: `gh api` fallback when curl/wget are blocked by sandbox (#41)
- Auto-update: verbose feedback for every scenario (#43)
- Session-context: hook installation status on startup (#43)
- Dev-server: skips startup when `node_modules` missing (#44)
- Block `git commit` on main/master — catches mistakes at commit time, not push time (#38)
- Branch pre-flight check in `/commit` skill — Step 0 verifies branch before staging (#38)
- Push-to-main error now includes exact recovery recipe (#38)
- Stop-gate exempts `.sh`/`.json`/`.md` files — no false "run tests" nudge (#38)
- Session-context warns about uncommitted changes on main at startup (#38)
- Chore version bumps (`v*`, `polish`, `release`) now logged to changelog as "Changed" (#38)
- PR link: universal terminal support — raw URL for Terminal.app, OSC 8 for iTerm2/Kitty/WezTerm (#39)
- PR cache: 60s per-branch cache + "no PR" sentinel (#37)
- PR cache cleanup on session start (#37)
- Auto-update: `gh api` fallback when curl/wget are blocked by Claude Code sandbox (#41)
- Auto-update: `gh repo clone` fallback for repo cloning (#41)
- Auto-update: verbose feedback for every scenario — up-to-date, throttled, updated, errors (#43)
- Session-context: hook installation status on startup — verifies all 16 hooks (#43)
- Dev-server: skips startup when `node_modules` missing (fresh/from-scratch projects)

### Fixed
- Auto-update: removed `timeout` command (not available on macOS) (#42)
- Auto-update: errors now visible in chat instead of only in log file (#41)

### Removed
- Temporary debug log from `log-subagent.sh` (#37)

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
- statusline PR link, UX writing, extended patterns (92c1336)

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
