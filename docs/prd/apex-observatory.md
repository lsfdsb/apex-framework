# APEX Observatory — Product Requirements Document

**Status:** ✅ Complete (v5.11.0)

## Vision
A visual dashboard that proves the APEX Framework works by displaying its own health — agents, skills, hooks, workflow chain, test results — all from a single localhost page. The app itself is the integration proof: if every APEX phase can build this successfully, the framework works.

## Problem
Framework integrity is invisible. Tests run in terminals, output scrolls past. There is no visual, interactive proof that every component is wired correctly and operational.

## Target User
**APEX Framework Developer** — uses Claude Code daily, needs instant visibility into framework health, wants to verify the framework works after updates or changes.

## Functional Requirements

### FR-1: Framework Health Overview
- Total agent count with validation status (valid/invalid)
- Total skill count with validation status
- Total hook script count with executable + syntax status
- Settings.json validity indicator
- Agent teams enablement status
- Framework version display

### FR-2: Agent Roster
- Table showing all agents: name, model, tools, skills, permission mode
- Validation status per agent (frontmatter correct, tools valid, skills exist)
- Visual indicator for read-only vs write-capable agents

### FR-3: Skill Directory
- Table showing all skills: name, description, allowed-tools, team-aware flag
- Validation status (frontmatter correct, tool references match body)
- Trigger keywords for each skill

### FR-4: Hook Scripts Status
- Table showing all scripts: filename, executable flag, syntax check result
- Settings.json wiring status (is it referenced in a hook?)

### FR-5: Workflow Chain Visualization
- Visual pipeline: PRD → Architecture → Research → Build → QA → Security → A11y → CX Review → Commit
- Each step shows: skill exists (✅/❌), skill directory path
- Visual flow with arrows or connected cards

### FR-6: Live Test Runner
- Buttons to run each test suite: framework, hooks, integration
- "Run All" button
- Real-time display of pass/fail counts
- Test output viewable in expandable sections

### FR-7: Cross-Reference Matrix
- Agent ↔ CLAUDE.md presence
- Agent ↔ teams skill reference
- Agent ↔ test coverage
- Visual matrix with ✅/❌ cells

## Non-Functional Requirements

### NFR-1: Zero Dependencies
- Vanilla HTML, CSS, JavaScript (no frameworks, no npm)
- Node.js http module only (no Express, no libraries)
- Single server.js + single index.html

### NFR-2: Performance
- Dashboard loads in < 1 second on localhost
- API responses in < 500ms (except test runner which streams)
- No external network requests

### NFR-3: Design
- Dark Gotham theme (CSS custom properties)
- Monospace font for code/data, sans-serif for headings
- Responsive layout (works on mobile)
- Consistent color system: green=pass, red=fail, yellow=warn, blue=info

### NFR-4: Accessibility
- Semantic HTML (header, main, nav, section, table)
- ARIA labels on interactive elements
- Keyboard navigable (tab through all controls)
- Color is never the only indicator (icons + text accompany colors)
- Minimum 4.5:1 contrast ratio

### NFR-5: Security
- No eval(), no exec() with user input
- API validates query parameters
- Server only reads from project directory (no path traversal)
- No secrets exposed in API responses

## API Design

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Serve index.html |
| GET | /api/overview | Framework health summary (counts, version, validity) |
| GET | /api/agents | All agents with validation details |
| GET | /api/skills | All skills with validation details |
| GET | /api/hooks | All hook scripts with status |
| GET | /api/workflow | Workflow chain with skill existence checks |
| GET | /api/crossref | Cross-reference matrix |
| GET | /api/test?suite={name} | Run a specific test suite, return results |
| GET | /api/test/all | Run all test suites |

## Success Metrics
- All API endpoints return valid JSON
- Dashboard renders all 7 sections correctly
- Test runner executes and displays results
- Passes QA, security, a11y, and CX review phases
- The app itself is the proof: framework works end-to-end
