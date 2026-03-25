# APEX — Recommended Ecosystem Integrations

These community skills and MCP servers complement APEX. All verified as official, maintained, and MIT/Apache licensed.

## Skills

APEX ships 29 built-in skills in `.claude/skills/`. These community resources add complementary coverage.

### vercel-react-best-practices
Official Vercel React optimization patterns. 40+ rules across 8 categories.
Complements: our `.claude/rules/` path-based rules

Install by adding the skill files to `.claude/skills/` following the APEX skill format (frontmatter + SKILL.md).

### frontend-design by Anthropic
Anthropic's official design skill. Bold aesthetics, distinctive typography.
Complements: our `design-system` skill and Design DNA pages

## Icon Library

### Lucide React (official)
APEX standard icon library. Consistent, tree-shakeable, MIT licensed.

```bash
npm install lucide-react
```

Usage:
```tsx
import { Search, ChevronDown, Settings } from 'lucide-react'

// Sizing scale: 16px (inline), 20px (default), 24px (prominent)
<Search size={20} className="text-muted-foreground" />
```

Rules:
- Always use Lucide icons — never emoji as icons, never inline SVG when a Lucide equivalent exists
- Use `size` prop for consistent sizing, not Tailwind `w-/h-` classes
- Color via `className` with semantic tokens only

## MCP Servers (optional)

### Context7
Live, version-specific documentation for libraries. Prevents hallucinated APIs.
Complements: native WebSearch + WebFetch
```bash
claude mcp add context7 -- npx -y @context7/mcp
```

### Supabase MCP
Direct database access from Claude Code. Query, migrate, manage RLS.
Complements: our `.claude/rules/sql.md`
```bash
claude mcp add supabase -- npx -y @supabase/mcp-server
```

## Notes

- APEX skills take precedence over community skills with the same name
- Community skills are additive — they don't conflict with APEX
- Always verify any new dependency with our `verify-lib` philosophy before installing
