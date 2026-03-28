# APEX Framework — Project Constitution

> "Simplicity is the ultimate sophistication." — Da Vinci

**APEX** (Agent-Powered EXcellence) — Claude Code framework for building world-class apps.

## Imports

See @.claude/rules/README.md for path-matched rules (components, API, SQL, testing, etc.)
See @docs/apple-epm.md for Apple EPM alignment details

## When Compacting

Preserve: current pipeline phase, active task IDs, pending quality gates, last 3 user decisions, and list of modified files.

## Core Rules

1. PRD before code — `/prd` before any new app or major feature
2. Verify APIs before integration — `/verify-api` checks against live docs
3. Verify libraries before installing — `/verify-lib` checks safety
4. QA before shipping — `/qa` is a gate, not optional
5. Security on sensitive code — `/security` on auth, payments, PII
6. CX review before users see it — `/cx-review` on user-facing changes
7. Read before editing — always read existing files first
8. Root cause only — `/debug` for systematic investigation, never band-aid
9. TDD for all implementation — `/tdd` RED-GREEN-REFACTOR, no code without failing test
10. Verify before claiming — `/verify` evidence before assertions
11. Technical rigor on reviews — `/code-review` verify, don't agree blindly
12. Only verified libraries — official publisher, maintained, no critical CVEs

## Practices

13. Design tokens only — never hardcode Tailwind palette colors, read design system first
14. Branding sweep — grep for template branding after scaffolding, replace ALL instances
15. Persona→page alignment — every page serves ONE primary persona
16. Default isolation: none — worktrees only for 2+ parallel builders on SAME files
17. Design DNA before UI — read matching template from `docs/design-dna/templates/`
18. Reuse before create — search for existing components, 3 similar files = failure
19. Mobile-first + dual theme — 320px up, dark AND light from day one
20. Performance by default — lazy routes, virtualize 100+ lists, no N+1, paginate 20+

## Code Standards

- TypeScript strict. No `any`. No `console.log` in production.
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `security:`
- Functions ≤ 30 lines. Files ≤ 300 lines. Components ≤ 200 lines.

## Git

- Never push to `main`/`master` directly. Feature branches: `feat/`, `fix/`, `docs/`
- Squash merge. Subject ≤ 72 chars. Never merge without explicit user approval.
- Commit body for details via HEREDOC. Use `gh api` if `gh pr edit` GraphQL fails.

## Lessons from the Forge

- Rules in framework, stories in memory — behavioral rules → CLAUDE.md/skills; context → memory
- Safe hook processes — `nohup cmd > log 2>&1 < /dev/null &`; verify PIDs before killing
- Graceful degradation — handle missing deps explicitly; silent failures are bugs
- The last 10% is the other 90% — truncated text, stale versions, dead refs = quality failures
