# Changelog

All notable changes to the APEX Framework will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [6.0.1] — 2026-03-30

## [5.24.0] — 2026-03-28 — Superpowers Integration + Mastery Guide Audit

### Added

- **10 new skills from Superpowers v5.0.6** — `/brainstorm`, `/plan`, `/execute`, `/debug`, `/tdd`, `/verify`, `/code-review`, `/request-review`, `/worktree`, `/write-skill` — all forked and adapted to APEX methodology (#238)
- **Skill Discipline system** — output style merged with Superpowers skill-discovery methodology: decision flow, rationalization red flags, instruction priority, cross-cutting skills (#238)
- **Companion files for /write-skill** — `persuasion-principles.md`, `testing-skills.md`, `anthropic-best-practices.md` (skill authoring references) (#240)
- **find-polluter.sh** — bisection script for /debug to find which test creates state pollution (#240)
- **Boxed APEX logo** — session intro now uses the framed logo from /about (#241)

### Changed

- **CLAUDE.md rewritten** — 193 → 59 lines (-69%), added @import directives, compaction instruction, removed duplicated pipeline/EPM/agents sections (#242)
- **Output style pipeline** — 7-phase state machine updated: Discover→Architect→Plan→Verify→Build→Quality→Ship with cross-cutting `/debug`, `/tdd`, `/verify`, `/code-review` (#238)
- **Builder model** — `sonnet` → `inherit` (uses session model, typically Opus) (#242)
- **Builder output format** — added structured completion template (Status/Files/Tests/Commit/Concerns) (#242)
- **auto-update.sh** — now runs via nohup (non-blocking, 5s timeout instead of 30s) (#242)
- **PostToolUse state writers** — consolidated 3 overlapping matchers into 1 (#242)
- **4 existing skills enhanced** — `/prd`, `/qa`, `/ship`, `/teams` updated with integration sections referencing new skills (#238)
- **About page** — 32 skills, 7-phase pipeline, categorized skill table, v5.22-5.24 history (#239)
- **Skill count** — 22 → 32 skills. Framework fully self-sufficient from Superpowers plugin.
- **teach skill description** — sharpened from 63 → 25 words (#242)

### Fixed

- **Agent Canvas all 7 agents visible** — Fixed derivedAgents key mismatch and defaultViewport conflict (#237)
- **TypeScript build errors (11 fixed)** — Resolved type mismatches for strict mode (#237)
- **Canvas MiniMap CSS vars** — proper background, smoothstep edges (#236)

### Removed

- **OPS showcase components** — removed Canvas, Hub, Pipeline, and 20+ unused components to focus on tokens page (#238)

## [5.23.0] — 2026-03-25 — Apple EPM Honest Audit + Builder Quality Protocol

### Added

- **7-State Pipeline Engine** — Output style rewritten as executable state machine with imperative actions, 3 user gates, autonomous phase transitions (#204)
- **Design Reviewer Agent** — New agent (Phase 4 Verify + Phase 6 Quality). 10→3→1 design exploration, DNA compliance, screenshot test. The Jony Ive of the team (#206)
- **Apple EPM Agent Headers** — All 6 agents now have: Pipeline Phase, Apple EPM Role, Seven Elements (Craft/Taste/Diligence/Empathy/Inspiration/Decisiveness/Collaboration), Exit Criteria, DRI Protocol (#208)
- **Rules of the Road (ANPP) Template** — PM agent generates milestones + DRI registry + ET Review schedule + risk register before creating tasks (#208)
- **ET Review Protocol** — Mandatory periodic checkpoint at each milestone: PM status + QA data + Designer verdict → Lead decides (#208)
- **Delight Check** — QA agent runs human-quality evaluation beyond automated gates: "Would a user screenshot this?" (#208)
- **10→3→1 Design Exploration** — Design Reviewer explores 10 variations, presents 3 directions, Lead picks 1 — before Build starts (#208)
- **DRI Instance Naming** — Teams skill spawns agents as `builder-1`, `qa-1` (not "builder", "qa") for accountability (#208)
- **Task DRI Badges** — Every task in HUB kanban shows its owner as a colored badge (#206)
- **Task Expandable Drawers** — Click any kanban task to see status, DRI, stage detail (#206)
- **Phase Team Roster in Timeline** — All 7 phases show their agents (always visible) and skills (on click) (#206)
- **Phase Exit Criteria** — PM agent enforces P0/P1/P2 gates with explicit checklists (#206)
- **Shared Component Analysis** — PM detects components used by 2+ tasks and documents blast radius (#206)
- **Phase Regression Detection** — `detect-phase-regression.sh` analyzes git diff to find which phases need re-verification (#206)
- **QA + Watcher Regression Monitoring** — QA runs regression detector before approving; Watcher monitors continuously (#206)
- **HUB 7-Phase Pipeline Timeline** — Horizontal timeline with gate indicators, replacing arbitrary 4-phase layout (#204)
- **HUB Team Kanban per SubProject** — Design Review → Build → Quality → Security columns (#204)
- **HUB Layout Expansion** — Projects page maxWidth 960→1200 with center alignment (#204)

### Changed

- **CLAUDE.md Pipeline Table** — Now shows Team column with agents per phase, 6 agents + Lead (#204, #207)
- **CLAUDE.md Rule #16** — Design DNA routes to React templates (single source of truth), not HTML files (#204)
- **Builder Agent** — Added verify-api + verify-lib skills, DRI protocol, craft standard (#204, #208)
- **QA Agent** — Added cx-review skill, regression detection phase, Delight Check (#204, #206, #208)
- **Watcher Agent** — Added qa skill, regression monitoring, quality trend reporting (#204, #206, #208)
- **Technical Writer Agent** — Added ship skill, ET Review participation (#204, #208)
- **Design System Skill** — Routing table updated to React templates, removed stale JS module references (#204, #206)
- **PRD + Architecture Skills** — Auto-transition to next phase on approval (#204)
- **Teams Skill** — DRI naming convention, React DNA reference (#204, #208)
- **README** — 6 agents (was 5), 15 hooks (was 14), 14 templates (was 39), 57 files (was 65), Design Reviewer in roster (#205, #207)
- **About Skill Stats** — 22 skills, 6 agents, 21 scripts, 15 hooks (all verified) (#207)
- **HUB Metrics** — PRs 203, Agents 6 (was 5) (#204, #207)

### Removed

- **15 HTML DNA files** — landing.html, saas.html, crm.html, etc. React templates are now the only source (#206)
- **2 JS modules** — palette.js, svg-backgrounds.js (superseded by React components) (#206)
- **14 Recipe stubs** — docs/design-dna/recipes/ folder (superseded by React templates) (#206)
- **3 Orphaned HUB pages** — AgentsPage, PipelinePage, QualityPage (unrouted) (#206)
- **12 Orphaned components** — agents/, pipeline/, quality/, teaching/ folders (#206)
- **1 Data file** — hub-quality.ts (only consumer deleted) (#206)
- **4 Unused scripts** — apex-launch.sh, apex-colors.sh, health-check.sh, hook-health-check.sh (#206)
- **EbookPage.tsx** — Merged into LMSDashboard (#204)
- **11 Stale memory files** — Session logs v5.14–v5.21, shipped features, fixed bugs (#204)

## [5.22.0] — 2026-03-25

### Added

- **Visual Pipeline HUB** — Web-based command center at localhost:3001 with interactive dashboard, pipeline visualization, and team management (#203)
- **HUB Home page** — APEX OPS and APEX DNA cards with dynamic metrics and feature showcase
- **Pipeline Overview** — Interactive 7-phase flow visualization with phase details and timeline
- **Apple EPM Task Board** — 5-column Kanban with 14 demo tasks, WIP limits, and phase filtering
- **Agent Team page** — Championship roster display with Breathing Loop SVG animation and responsibility matrix
- **Quality Gates page** — 7-phase QA visualization with gate status and acceptance criteria
- **Projects page** — Project selector landing as OPS integration point
- **Changelog page** — Versioned release history with interactive timeline
- **About page** — Framework story, values, and mission statement with "The Two Apps" OPS+DNA explanation
- **Collapsible OPS sidebar** — Glass sidebar with icons-only mode for navigation and theme selector in top-right
- **SubProject Cards** — Expandable sub-project cards with P0/P1/P2 phase progress bars and completion percentages
- **Phase Progress Visualization** — CompletionRing SVG component showing overall project completion percentage
- **GitHub PR Integration** — Recent 5 PRs section on project headers with status badges (merged/open/closed) and direct GitHub links
- **Task Board Columns** — Scrollable Kanban columns with thin scrollbars, viewport fill (calc(100vh - 56px)), and review gate badges
- **Review Gates** — Quality, Performance, Security, and Accessibility gate badges on task cards
- **Live Data Fallback** — Task Board falls back to mock data when live .apex/state/ has zero tasks
- **Real-Time Task Sync Hook** — task-state-writer.sh auto-writes .apex/state/tasks.json on TaskCreate/TaskUpdate events (PostToolUse hook)
- **LucideIcon component** — Mapping of 20+ Lucide React icons for consistent iconography throughout HUB
- **useApexState hook** — Live sync with .apex/state/ files via 2s polling for real-time metrics and fallback to demo data
- **Teaching components** — TeachingTooltip, WhyButton, ConceptLink for interactive learning and explanations
- **Sign In button** — Placeholder authentication UI in navbar
- **Dropdown navigation** — OPS and DNA section dropdowns in navbar
- **DNA Starters Upgrade** — Card, Badge, StatCard, ProgressBar, SectionHeader components now accept style prop for customization
- **Full Viewport Layouts** — All pages use minHeight calc(100vh - 120px) for proper space utilization
- **Visual Pipeline HUB PRD and Architecture** — Complete product requirements and system design documentation
- **Project Manager Agent** — New agent (project-manager.md) with Apple EPM methodology, phased task decomposition, DRI assignments, and acceptance criteria (#202)
- **Pipeline Phase 3: Decompose** — PM auto-decomposes PRD+Architecture into phased task board with P0/P1/P2 phases (#202)
- **SubagentStart Hook** — Auto-injects Design DNA context into builder agents for consistent UI quality (#202)
- **PreCompact/PostCompact Hooks** — Logs session compaction events for auditing and performance tracking (#202)
- **Builder API Verification Protocol** — New section in builder.md: verify auth patterns, SDK versions, and rate limits before external API integration (#202)
- **Technical Writer Change Detection Fallback** — Falls back to `git diff --stat` when lead message is vague (#202)
- **Session Log Rotation** — session-cleanup.sh now keeps last 10 session logs, deletes older ones (#202)

### Changed

- **PaletteSwitcher** — Moved from bottom-left to top-right in navbar
- **ShowcaseNav restructured** — Now includes About, Changelog, OPS dropdown, DNA dropdown, and Sign In button
- **DNA Home navigation** — Moved from #/ to #/dna; HUB Home now serves as #/ landing
- **lucide-react dependency** — Updated to v1.6.0 as primary icon library
- **Page titles styling** — All page titles use Instrument Serif italic (DNA design standard)
- **Link component** — Extended with style prop support for custom styling
- **OPS Layout** — Simplified to Projects + Tasks focus; Pipeline, Agents, Quality moved to About page
- **Kanban Card Styling** — Equal-height cards with collapsible sub-projects and consistent padding
- **Sign In Button Color** — Updated to use var(--bg) CSS variable for proper theme support
- **AgentCard Badge** — Opus badge color changed to var(--warning) for theme consistency
- **OpsLayout Navigation** — Links now marked with aria-current="page" for active state accessibility
- **Builder maxTurns** — Increased from 40 to 50 for longer implementation sessions (#202)
- **Watcher Status Labels** — Changed from emoji to text labels ([CLEAN], [WARNINGS], [CRITICAL]) for better accessibility (#202)
- **Technical Writer Ownership** — Strengthened CHANGELOG ownership model (single owner, auto-changelog hook deleted in PR #201) (#201)
- **CLAUDE.md Rule Organization** — Reorganized 23 rules: Principles (1-11), Practices (12-19), Lessons from the Forge (20-23) (#202)
- **Pipeline Architecture** — Expanded from 6 phases to 7 phases (added Decompose phase for PM) (#202)
- **Agent Teams Roster** — Updated from 4 agents to 5 agents (added Project Manager) (#202)
- **README Agent Roster** — Updated agent list and model strategy table (#202)
- **Rebranding** — "L.B." → "Bueno" across 36 files (scripts, agents, docs, tokens, templates) (#202)
- **GitHub Actions** — Upgraded actions/checkout v4 → v6, actions/setup-node v4 → v6 (#202)
- **Node.js LTS** — Updated CI from Node.js 20 (maintenance) to 22 (Jod) LTS (#202)
- **README Hook Counts** — Corrected to 14 hooks across 12 groups (was stale) (#202)
- **README Component Counts** — Updated to 33 starters, 39 templates (accurate to current state) (#202)

### Fixed

- **APEX Logo Alignment** — Consistent column padding in output style (#202)
- **health-check.sh** — Removed erroneous `set -e` that caused CI failure; script manages own exit code (#202)
- **CountUp Animation** — Now respects prefers-reduced-motion for accessibility
- **Metric Icons** — Marked aria-hidden to prevent screen reader noise
- **ProjectsPage Heading Hierarchy** — h4 → h3 for proper WCAG structure
- **PipelinePage Colors** — Removed hex fallbacks, now uses var(--success) exclusively
- **ProjectsPage Search** — Added aria-label for WCAG critical search input accessibility

## [5.21.0] — 2026-03-24 — Quality Gates & Safe Processes

### Added

- **Design Principles (Taste Bible)** — 10 codified rules in `docs/design-dna/principles.md` preventing generic AI output: whitespace ratios, typography hierarchy, color discipline, motion budget, information density, empty state quality, consistent radius, persona alignment, loading states, dark mode parity (#191)
- **Prettier Config** — `.prettierrc` + `.prettierignore` for consistent formatting across all APEX projects (#191)
- **Icon Strategy** — Lucide React as standard icon library with sizing scale and usage rules (#191)
- **QA Phase 5 Enhanced** — Bundle size gate (250KB limit) + component duplication check (#191)
- **New Hook Events** — TaskCompleted, TeammateIdle, ConfigChange hooks in settings.json (#190)

### Changed

- **Builder Agent Enhanced** — Mandatory `principles.md` read before UI work, component search before create, expanded pre-completion checklist (#191)
- **Architecture Skill** — Explicit component audit with `[exists/extend/promote/new]` classification (#191)
- **Component Source-of-Truth Rule** — `src/components/` is truth after promotion; starters are scaffolding only (#191)

### Fixed

- **Safe Hook Process Management** — session-cleanup now verifies PIDs are actual node/vite processes before killing; prevents disrupting Claude Code's process group (#190)
- **Dev Server Detach** — Background processes fully detached with `< /dev/null` so hook stdin pipe closes cleanly (#190)
- **Hook Health-Check** — Added `# safe-kill` annotation support for self-spawned subprocesses (#190)
- **CLAUDE.md Rule #21** — Codified safe hook process patterns: `nohup cmd > log 2>&1 < /dev/null &` and `ps -o comm=` verification before kill (#190)

## [5.20.0] — 2026-03-24 — Production Readiness: Hooks, Oscar, Tests

### Added

- **Complete Hook System** — 16 hooks across 6 groups (SessionStart, PreToolUse, PostToolUse, Stop, PostToolUseFailure, SessionEnd); all 20 scripts wired or confirmed as utilities (#187)
- **Design DNA Oscar Push** — 10 new animation keyframes (ripple, focus-glow, pop-in, shake, checkmark, stroke-draw, pulse-ring, slides, counter-roll) with `prefers-reduced-motion` support (#187)
- **5 New Primitives** — Toggle (spring physics), Tooltip (pop-in), AnimatedCheckmark (SVG stroke), NotificationDot (pulse ring), LoadingSpinner (SVG orbit) (#187)
- **DnaBackground Component** — React-compatible 14 static SVG patterns + 6 animated backgrounds, wired into 11 page templates with personality-matched combos (#187)
- **Animations Showcase Page** — 10 interactive sections: button ripple, input glow/shake, toggle spring, tooltip positions, animated checkmark, notification dots, spinners, CSS classes, background picker (#187)
- **E2E Test Suite** — `tests/e2e-framework.sh` with 27 tests covering install → verify → workflow → cleanup (#187)
- **Performance Profiler** — `tests/perf-hooks.sh` measuring all 16 hooks with budget thresholds (#187)

### Changed

- **Button Enhanced** — Ripple effect on click via DOM span injection (#187)
- **Input Enhanced** — Focus glow animation + error shake with `prefers-reduced-motion` (#187)
- **Design System Page Redesigned** — Forms and Layout sections elevated with accent gradient bars, descriptions, and glass cards; genericized from CRM-specific Portuguese to universal English (#187)
- **LMS + E-Book Merged** — E-Book components (cover, TOC, chapter reader) folded into LMS page (#187)
- **Bundle Optimization** — Lazy-load HomePage (52KB CHANGELOG) and template sources (200KB+ raw TSX); main chunk stays at 210KB (#185)

### Fixed

- **CI CHANGELOG Duplication** — `sed` now matches first occurrence only when stamping version sections (#187)
- **Installer Skills Copy** — `cp -r` was flattening skill directories; now creates proper named subdirectories (#187)
- **Nav Layout Shift** — Removed scroll-dependent transitions, forced `overflow-y: scroll`, constant glass styles (#187)
- **session-learner.sh** — Integer comparison error on HOOK_BLOCKS variable (#187)
- **DatePicker** — Translated from Portuguese to English (#187)
- **PatternShowcase** — Boosted SVG pattern opacity for dark mode visibility (#187)

### Security

- **settings.local.json Cleanup** — Removed hardcoded Supabase secret key and 60 accumulated cruft entries that were causing Claude Code to hang (#187)

## [5.19.0] — 2026-03-24 — Reliability: The Framework Tests Itself

### Added

- **Showcase Test Infrastructure** — Vitest + React Testing Library with 12 tests covering Router, PaletteContext, and build smoke validation (#182)
- **Showcase ESLint + Prettier** — ESLint 9 flat config with typescript-eslint, react-hooks, react-refresh plugins; Prettier with project conventions (#182)
- **CI Showcase Pipeline** — GitHub Actions now runs typecheck → lint → test → build for the Design DNA React app (#182)
- **Statusline v3 (Σ Token Sum)** — Shows session-wide token total (main + all agents), USD cost, and 5-hour rate limit with color-coded health (#182)
- **Starter Component Tests** — Card (11 tests), Tabs (13 tests), PageShell (9 tests) with full ARIA role coverage and slot composition testing (#182)

### Changed

- **Technical Writer Agent** — Stripped CHANGELOG responsibility (owned by /commit + auto-changelog hook); now only owns README, PRD, and docs consistency (#182)

### Fixed

- **Broken Showcase Build** — tsconfig `typeRoots` + `baseUrl` fix for React type resolution across sibling directories; `useRef` strict mode fixes in Toast/Tooltip (#182)
- **ShowcaseNav setState-in-effect** — React 19 lint error replaced with derived state pattern (no effect, no ref-during-render) (#182)
- **PaletteSwitcher Unused Import** — Removed dead `PaletteName` type import (#182)
- **Supabase Sync 409 Bug** — Added `on_conflict` query parameter to PostgREST upserts; `Prefer: resolution=merge-duplicates` alone is insufficient (#182)
- **Supabase Query Key Fallback** — query.sh now falls back to secret key when publishable key unavailable (#182)
- **Changelog Version Parsing** — Showcase app now parses version headings without titles (v5.18.0 was invisible) (#182)

## [5.18.0] — 2026-03-24 — Self-Awareness, Kanban, Supabase RAG

### Added

- **Supabase RAG Setup Script** — One-command `setup.sh` validates keys, tests connection, runs migration, syncs manifest, verifies data (#181)
- **Memory Autonomy Protocol** — Output style now mandates when to save memories: on correction, after merge, before session end. No lesson gets lost (#181)
- **Dynamic About Roster** — About skill reads agents from `.claude/agents/` dynamically instead of hardcoded table (#181)

### Changed

- **Ship Skill Docs Check** — Step 5 replaced Technical Writer spawn with inline docs consistency check (VERSION↔README, CHANGELOG entries, manifest freshness) (#181)
- **/commit Skill** — CHANGELOG update moved to Step 3 (before commit), eliminating the recurring docs-gap failure (#181)

### Added (carried from v5.18.0)

- **LICENSE** — MIT license for open-source distribution of the APEX Framework (#180)
- **SECURITY.md** — Vulnerability disclosure process and patch timeline for responsible reporting (#180)
- **CONTRIBUTING.md** — Contribution guidelines, code standards, and community review process (#180)
- **.editorconfig** — Cross-IDE formatting standards for consistent development experience (#180)
- **GitHub Actions CI/CD Pipeline** — 6-step automated validation: script syntax, JSON validation, hook verification, frontmatter parsing, skill inventory, and framework health checks (#180)
- **Design Tokens Code Export** — Importable TypeScript/JavaScript/CSS token files with 5 color palettes, spacing scale, typography system, shadow definitions, and responsive breakpoints (#180)
- **Architecture Dependency Graph** — `/architecture` skill outputs complete dependency manifest; `/qa` Phase 0 verifies graph integrity; `/ship` blocks on failures (#180)
- **MCP Elicitation Gates** — Documentation and .mcp.json.template for structured approval workflows (requires v2.1.76+) (#180)
- **Framework Manifest** — `.manifest.json` generated automatically at SessionStart with full component map, cross-references, and skill inventory (#180)
- **Framework Validation Hook** — PostToolUse hook verifies cross-references whenever `.claude/` files are modified (#180)
- **Stop Gate Hook Enforcement** — Validation gate blocks merges if CHANGELOG.md not updated after framework changes (#180)
- **Supabase RAG Knowledge Base** — Optional persistent vector database layer with migration, sync, query, and edge function support; modernized to `sb_secret_` and `sb_publishable_` key format (#180)
- **Agent Memory + Effort Frontmatter** — All 4 agents now include `memory: project` and `effort` fields for persistent context and parallel execution (#180)
- **CronCreate Guidance** — Watcher agent documents periodic health checks via native CronCreate scheduling mechanism (#180)
- **`/verify-api` Skill** — Auto-triggers on external API references (Supabase, Stripe, OpenAI, etc.), WebSearches official docs for current auth patterns and deprecated keys, blocks stale integrations. 7 APIs verified with code templates (#180)
- **CI/CD Auto-Release** — GitHub Actions `release` job auto-tags and publishes GitHub Releases from VERSION + CHANGELOG on merge to main. Idempotent, stamps CHANGELOG with version+date (#180)
- **Production Edge Function** — Supabase RAG edge function upgraded from scaffold to 571-line production reference: Deno.serve(), CORS, Bearer auth with constant-time comparison, rate limiting, structured logging, input validation, health check (#180)
- **Kanban Task Chaining** — Teams skill auto-creates QA verification tasks when builder completes; WIP limits (builder:2, QA:1, writer:1); backpressure blocks builders when review queue full (#180)
- **Inline CHANGELOG in /commit** — CHANGELOG updates now happen BEFORE the commit (Step 3), not after. Eliminates the #1 recurring failure across 3+ APEX versions (#180)

### Changed

- **Context-Aware Agents** — Watcher and QA agents now detect repository type (framework vs project) and adapt commands, output, and validation rules accordingly (#180)
- **Teams Skill** — Streamlined roster to 4 core agents (Builder, Watcher, QA, Technical Writer) plus Lead; removed ALL references to dead agents across roster, breathing loop, scan matrix, spawn order, status table, and communication rules (#180)
- **README.md** — Updated agent roster (8→4 agents), removed Observatory section, removed Researcher row, updated model strategy table (#180)
- **Output Style** — Added Session Depth guidance (use 1M context fully), Memory vs Framework taxonomy, and honest enforcement docs replacing false "MANDATORY" claims (#180)
- **CLAUDE.md Rule #2** — Now references `/verify-api` skill directly; must check deprecated patterns; official docs > memory (#180)
- **CLAUDE.md Rule #16** — Updated: QA (not Design Reviewer) blocks pages that don't match DNA quality (#180)
- **CLAUDE.md Rule #20** — New constitutional rule: "Rules in framework, stories in memory" (#180)
- **Supabase Skill Reference** — Updated all key references from deprecated `anon`/`service_role` to modern `sb_publishable_`/`sb_secret_` format (#180)
- **QA Skill** — Added repo type detection and Phase 0 dependency verification (#180)
- **QA Agent** — All "Debugger" references updated to "Builder" (Builder handles both building and bug fixes) (#180)
- **Technical Writer Agent** — Updated workflow references from Debugger to Builder (#180)
- **Ship Skill** — Updated verdict reference from "Code Reviewer" to "QA" (#180)
- **Design System Reference** — Updated enforcer from "Design Reviewer" to "QA agent" (#180)
- **About Skill** — Agent roster updated to actual 4-agent lineup (#180)
- **Pre-commit Hook** — Exempt `docs/` from console.log check (reference code like edge functions use console.log for Supabase structured logging) (#180)
- **Builder Agent** — Added rule: builders must NEVER create git branches; branch management is lead's responsibility (#180)
- **.gitignore** — Added `.claude/.manifest.json` and `.claude/agent-memory/` (runtime-generated, not source) (#180)

### Removed

- **3 Dead Agent Implementations** — Removed `code-reviewer.md`, `debugger.md`, `design-reviewer.md` (never spawned in practice, functionality migrated to plugins) (#180)
- **Orphaned Agent Memory Directories** — Cleaned up unused memory folders: `framework-evolver/`, `sentinel/`, `code-reviewer/`, `design-reviewer/` (#180)
- **claude-web/ Directory** — Removed 17 obsolete custom skill copies and 2 custom instruction files; Claude Code now handles skill discovery natively (#180)
- **Observatory Section** — Removed from README (dashboard was never built; monitoring via GitHub Actions) (#180)
- **3 Stale Memory Records** — Removed `batman_session`, `changelog_every_pr`, `agent_teams` (superseded by CLAUDE.md rules and active policies) (#180)

### Removed

- **docs/QUALITY-REVIEW.md** — Outdated v5.13 quality review referencing deleted agents and Framework Evolver (#180)
- **docs/design-dna/showcase/.claude/** — Orphaned runtime directory from a dev session (#180)
- **Root .DS_Store** — OS cruft removed from tracking (#180)

### Fixed

- **health-check.sh** — Updated agent list reference from dead agents to current roster (#180)
- **Stale Agent References** — Purged ALL remaining Debugger/Code Reviewer/Design Reviewer/Researcher/Sentinel references from 8 active files: about, teams, ship, design-system, qa agent, technical-writer agent, README, CLAUDE.md (#180)
- **Builder Branch Bug** — Builders with `isolation: none` were creating orphan branches causing cherry-pick failures; added explicit "never create branches" rule (#180)

## [5.17.0] — 2026-03-24 — Onboarding Guide + Worktree Safety

About skill rewritten as full onboarding guide, agent isolation defaulted to none (eliminating worktree file loss), Technical Writer perfected with showcase sync awareness.

### Added

- **About Onboarding Guide** — Rewrote `/about` as full onboarding guide: pipeline diagram, skills table, agent roster, Design DNA overview, how-to section (#174)

### Changed

- **Agent Isolation Default** — All agents now use `isolation: none` by default; worktrees only for 2+ parallel builders on conflicting files — eliminates 6+ sessions of file loss (#176)
- **Technical Writer** — Added README↔VERSION sync check, showcase CHANGELOG awareness (Step 3.5), entry format rules for showcase parsing (#177)
- **Teams Presets** — Updated all spawn examples and presets to reflect `isolation: none` default (#177)

### Fixed

- **About Skill Output** — Added verbatim output instruction so `/about` renders the full guide instead of summarizing (#175)
- **Stale Worktree References** — Cleaned 7 outdated worktree references from about, teams, and spawn examples (#177)

## [5.16.0] — 2026-03-24 — Auto-Versioning + Pipeline Improvements

Ship pipeline overhaul: official code-review plugin as single gate, auto-versioning after merge, responsive showcase nav, and Vite dev server.

### Added

- **Auto-Versioning** — `/ship` now auto-promotes `[Unreleased]` to semver after merge: feat→MINOR, fix→PATCH, BREAKING→MAJOR (#173)
- **Changelog Showcase Sync** — Showcase homepage now displays `[Unreleased]` entries with "next" badge (#171)

### Changed

- **Statusline** — Removed custom PR/git tracking calls, added framework version display; relies on native Claude Code git indicator (#168)
- **Dev Server** — Replaced static HTML server with Vite React showcase app from `docs/design-dna/showcase/` (#168)
- **Ship Skill** — Single review gate via official `code-review` plugin; removed duplicate APEX code-reviewer, scoped to `/teams` only (#170)
- **Technical Writer** — Added versioning rules: new changes go under `[Unreleased]`, released versions are frozen (#171)

### Fixed

- **ShowcaseNav** — Responsive hamburger menu on screens below 640px with glass morphism dropdown, outside-click dismiss, Escape key, and slide-out animation (#172)

## [5.15.0] — 2026-03-23 — Design DNA Showcase Phase 2

Pixel-perfect template matching, component extraction, and self-contained showcase pages with 20+ commits completing the Design DNA showcase overhaul.

### Added

- **React Page Templates** — 14 full-featured templates (Landing, SaaS, CRM, E-commerce, Blog, Portfolio, Social, LMS, Backoffice, Design System, Email, Presentation, E-book, Pattern Showcase) ready to copy into projects (#115)
- **5 New Starter Components** — StatCard, ChartCard, ThemeToggle, EmptyState, KanbanColumn for richer dashboards and data flows (#115)
- **RGB Tokens** — All 5 design palettes now include RGB values for dynamic theming and programmatic color manipulation (#115)
- **CRM Pipeline Showcase** — Full rewrite with hero, orbiting SVG animation, 5-column kanban pipeline, animated contact cards with ring effects, timeline+chat integration, helpdesk tickets (#138)
- **6 Individual CRM Components** — DealDrawer, ContactProfile, LeadScoreCards, DataTable, PipelineAnalytics, TaskList extracted as reusable showcase-mode components (#147, #148)
- **Presentation Slide Template** — 10 slide types: title, section divider, stats, content grid, quote, split layout, timeline, team roster, pricing cards, and CTA sections (#138)
- **LMS + E-book Unified Page** — Single reading experience page with course catalog, lesson viewer, progress tracking, and e-book chapter navigation (#150)
- **LMS Dashboard Showcase** — Added hero section, certificate showcase, reveal animations, and layout matching design DNA (#138, #140)
- **Social Feed Showcase** — Added hero section with reveal animations, removed Avatar import crashing issues (#138)
- **Email Template Showcase** — Added hero section, improved containment/centering, fixed sidenote layout bleeding; 8 email types in pt-BR (#138, #144, #145)
- **Portfolio Showcase** — Hero section, contact form integration, numbered services grid, about stats, reveal animations, removed duplicate Header nav (#139)
- **E-commerce Showcase** — Hero with animated SVG bag, product detail view, cart layout, checkout flow with steps, reveal animations (#139)
- **Backoffice Showcase** — Complete rewrite from sidebar layout to showcase format with hero, KPI cards grid, activity log, invoice table, permissions matrix (#139)
- **E-book Showcase** — Cover section, 7 chapter layouts, callout boxes, table of contents with sidenote structure, reveal animations (#139)
- **Dynamic Changelog** — Showcase homepage now reads CHANGELOG.md at build time and renders latest version with all entries dynamically (#143)
- **Premium Loading State** — Orbital animation with rotating rings, premium visual treatment for async states (#149)
- **Source Button** — Floating bottom-right button linking to HTML source template for each showcase page (#133)
- **AppShell Component** — Floating sidebar layout with 56px icon-only design, glass morphism, position fixed with 12px offset and 16px radius for helpdesk integration
- **TopBar Component** — Floating top bar with search, notifications, user avatar, and glass morphism styling matching AppShell design
- **ChatWidget Component** — Live helpdesk chat with agent/customer bubbles, typing indicator, auto-reply, and Portuguese language support
- **TicketDetail Component** — Full ticket view with priority bar, status badges, activity timeline, and action buttons for CRM workflows
- **EmailComposer Component** — In-CRM email composition with recipients, subject, body, and toolbar featuring attach/image/link buttons in Portuguese
- **NotesPanel Component** — Activity notes interface with input and note cards showing author, tags, and timestamps in Portuguese
- **FilterBar Component** — Advanced filtering with dropdowns and active filter pills with remove functionality
- **EmptyState Component** — Configurable empty state display with icon, title, description, and CTA button for consistent UX
- **Phoenix V3 Phase 1 Foundation** — 9 P0 form primitives with full keyboard nav, glass morphism panels, and accessible interactions (#160):
  - **Select/Combobox** — Searchable dropdown with keyboard navigation, glass morphism panel, supports custom filtering
  - **DatePicker** — Styled native date and datetime-local input with dark/light theme support
  - **SearchInput** — Magnifying glass icon, clear button, focus ring, optimized for data discovery
  - **Toast** — useToast() hook + ToastProvider; 4 variants (success, error, info, warning) with auto-dismiss and progress bar
  - **ConfirmDialog** — Modal with backdrop blur, destructive variant, escape and click-outside dismiss handling
  - **DropdownMenu** — Trigger + panel with hover highlight, destructive item support, glass morphism styling
  - **Tooltip** — Hover delay, 4 directional positions, smooth fade-in animation
  - **Toggle** — 40x22 switch with spring animation, fully accessible with ARIA labels
  - **Textarea** — Auto-resize, maxLength counter display, error state styling
- **Tokens/Design System Showcase Page** — Live demo page showcasing all P0 form primitives with interactive examples and design token documentation (#160)

### Changed

- **ShowcaseNav** — Raised base opacity to 80%, border transparency to 15%, enhanced inset highlight for better visual hierarchy; floating glass design with scroll transparency (#139, #136, #134, #131)
- **Code Reviewer Agent** — Expanded from 91 to 130 lines with enhanced security scanning, OWASP rules integration, and better error categorization (#115)
- **Design Reviewer Agent** — Added task auto-claim for continuous design compliance, expanded DNA path scanning to catch hardcoded colors (#115)
- **Rules Refactored** — Narrowed API/SQL/Supabase/Testing/Error-Handling paths with code examples, deduplicated constraints, improved clarity (#115)
- **DNA Starters Fixed** — DataTable, Input, Button, Header, MobileNav corrected for proper semantic structure and responsive behavior (#115)
- **PaletteSwitcher.tsx** — Replaced flat dot bar with apex-widget design: gear button with rotate animation, expandable panel with palette dots and dark/light mode toggle; useCallback fix for palette switching (#133)
- **Global Animated Background** — All templates now feature unified animated SVG orb background with dynamic accent colors (#135, #132)
- **Patterns Page** — Full rewrite with nav scroll transparency and proper DOM structure (#136)
- **Gitignore** — Added `.dna-server.pid` to ignore runtime server PID files (#114)
- **CHANGELOG Generation** — Documented all contributions through v5.13.2, properly formatted entries, no gaps (#113)

### Fixed

- **Self-Contained Templates** — All 14 showcase pages now zero-import starters, every component inline or from src/components; removed PageShell/Sidebar wrappers (#141, #140)
- **LandingPage.tsx** — Rewritten to match landing.html design: added Pricing, Dashboard, Auth sections; fixed Features to 3-column grid; added reveal animations with IntersectionObserver, glow-pulse, and lift hover effects; corrected CTA with bg-surface + gradient; rewrote footer with multi-column layout and 3 link columns
- **BlogLayout.tsx** — Rewritten to match blog.html design: added hero section; removed sidebar (aligned with template); fixed article grid to 3-column layout; added reading experience section with blockquote styling; added standalone newsletter box
- **SaaSDashboard.tsx** — Rewritten to match saas.html design: added hero section and 4 app-frame sections (Dashboard with sidebar/stats/sparklines/chart, Data Table, Settings with toggles, Empty State); integrated macOS window chrome
- **ShowcaseNav.tsx** — Rewritten to match DNA palette.js nav: fixed position, pill-shaped links with hover translateY(-1px) + accent-glow animation, active state with accent background, 52px height
- **App.tsx** — Added spacer div for fixed nav layout
- **Portfolio** — Removed duplicate Header nav that was creating double navigation (#139, #146)
- **E-book Hero** — Added proper hero section and self-contained structure (#146)
- **Email Templates** — Fixed containment issues, centered layout, and added Portuguese (pt-BR) versions (#144, #145)
- **Social Feed** — Removed crashing Avatar import, converted to self-contained component (#140)
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
- **Security regex hardened** — GitHub tokens (ghp*30+ chars), OpenAI keys (sk-*-\_ with hyphens) now detected (#105)
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

- Custom agent tracking in statusline (abbrev_agent, /tmp/apex-agents\*.json reading)
- StatusLine "This is the way." branding suffix
- `auto-approve-safe.sh` — redundant with settings.json allow list
- `enforce-commit-msg.sh` — redundant with git's native commit-msg hook
- `notify.sh` — redundant with Claude Code's native Notification hook
- `log-subagent.sh` — dead code (was empty)
- `pre-compact.sh` / `post-compact.sh` — redundant with native compaction + auto-memory

## [5.10.0] — 2026-03-18 — Agent Teams: The Championship Roster

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

## [5.9.2] — 2026-03-18 — Update Skill, Pre-Commit Fix, Agent Teams Prep

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
- simplify — English only, one output style (9b84b41)

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
