# .claude/rules/

These are **path-matched rules** applied automatically by Claude Code when files in the matched paths are opened or edited.

## How they work

Each rule file contains a YAML frontmatter block with a `paths:` list. Claude Code loads the rule automatically when any file matches those glob patterns — no slash command needed.

| File                | Applies to                                                  |
| ------------------- | ----------------------------------------------------------- |
| `nextjs.md`         | App Router files (`app/**`, `layout.tsx`, `page.tsx`, etc.) |
| `components.md`     | Any file under `**/components/**`                           |
| `api.md`            | Route handlers and API files                                |
| `sql.md`            | SQL files and database queries                              |
| `supabase.md`       | Supabase client and edge function files                     |
| `testing.md`        | Test files (`*.test.*`, `*.spec.*`)                         |
| `error-handling.md` | Files with error boundaries and async flows                 |

## Source of truth

**[`CLAUDE.md`](../../CLAUDE.md)** is the authoritative source for all framework-wide rules. The files here are context injections for specific file types — not replacements for CLAUDE.md.

When a rule here conflicts with CLAUDE.md, CLAUDE.md wins.
