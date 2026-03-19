# APEX Observatory — Architecture Document

## Stack Decision
- **Server**: Node.js http module (zero dependencies)
- **Frontend**: Vanilla HTML + CSS + JavaScript (no frameworks)
- **Data**: Reads framework files at runtime (no database)
- **Why**: The Observatory must prove the framework works, not prove npm works. Zero dependencies = zero supply chain risk = maximum portability.

## File Structure
```
dashboard/
├── server.js      # HTTP server + JSON API (≤300 lines)
└── index.html     # Single-page app with embedded CSS + JS
```

## Server Architecture (server.js)

### Core Design
- Single `http.createServer` with request routing
- Each `/api/*` endpoint is a pure function: read files → transform → return JSON
- Static file serving for `/` → `index.html`
- CORS disabled (localhost only)
- Graceful error handling on all file reads

### Data Collection Pattern
Each API endpoint follows the same pattern:
1. Read framework files (`.claude/agents/*.md`, `.claude/skills/*/SKILL.md`, etc.)
2. Parse YAML frontmatter where needed
3. Run validation checks
4. Return structured JSON

### API Response Format
All endpoints return:
```json
{
  "timestamp": "ISO-8601",
  "data": { ... }
}
```

Error responses:
```json
{
  "timestamp": "ISO-8601",
  "error": "description"
}
```

## Frontend Architecture (index.html)

### Layout
- Fixed header with title + version + health bar
- Responsive grid of dashboard cards
- Each card = one section (agents, skills, hooks, workflow, tests, crossref)
- Cards are collapsible for mobile

### Design Tokens (CSS Custom Properties)
```css
:root {
  --bg-dark: #0a0a0f;
  --bg-card: #12121a;
  --bg-surface: #16161f;
  --border: #1e1e2e;
  --text-primary: #e0e0e8;
  --text-secondary: #8888a0;
  --accent-gold: #c8a84e;
  --green: #34d399;
  --red: #f87171;
  --yellow: #fbbf24;
  --blue: #60a5fa;
}
```

### Data Fetching
- On page load: fetch `/api/overview`, `/api/agents`, `/api/skills`, `/api/hooks`, `/api/workflow`, `/api/crossref`
- Test runner: fetch `/api/test?suite={name}` on button click
- No polling (manual refresh via button)

### Accessibility Architecture
- Semantic: `<header>`, `<main>`, `<section>`, `<table>`, `<button>`
- Every table has `<caption>` and `<thead>`
- Interactive elements have `aria-label`
- Status indicators: icon + text + color (triple encoding)
- Skip navigation link as first focusable element
- Focus-visible styling on all interactive elements

## Persona → Page Alignment
**Primary persona**: APEX Framework Developer
**Single page**: Dashboard (all sections visible, scrollable)
This is a single-persona, single-page app. No mixing of concerns.

## Security Considerations
- Server reads only from project root directory
- Path traversal blocked: all file reads use `path.join(ROOT, ...)` with no user-controlled segments
- No `eval()`, no dynamic code execution
- Test runner uses `execSync` with hardcoded commands only (no user input in shell)
- API query params validated against allowlist (suite names)
