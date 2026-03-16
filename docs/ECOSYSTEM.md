# APEX — Recommended Ecosystem Integrations

These community skills and MCP servers complement APEX. All verified as official, maintained, and MIT/Apache licensed.

## Skills (install via Claude Code plugin system)

### vercel-react-best-practices (176K+ installs)
Official Vercel React optimization patterns. 40+ rules across 8 categories.
Complements: our `code-standards` skill
```bash
/plugin marketplace add vercel-labs/react-best-practices
```

### frontend-design by Anthropic (124K+ installs)
Anthropic's official design skill. Bold aesthetics, distinctive typography.
Complements: our `design-system` skill
```bash
# Already bundled with Claude Code — activate via /frontend-design
```

## MCP Servers (optional)

### Context7
Live, version-specific documentation for libraries. Prevents hallucinated APIs.
Complements: our `/research` skill
```bash
claude mcp add context7 -- npx -y @context7/mcp
```

### Supabase MCP
Direct database access from Claude Code. Query, migrate, manage RLS.
Complements: our `sql-practices` skill
```bash
claude mcp add supabase -- npx -y @supabase/mcp-server
```

## Notes

- APEX skills take precedence over community skills with the same name
- Community skills are additive — they don't conflict with APEX
- Always verify any new skill with our `verify-lib` philosophy before installing
