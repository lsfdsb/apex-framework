# PRD: APEX Visual Pipeline HUB

**Version**: 2.0 | **Date**: 2026-03-25 | **Status**: Approved | **Author**: Bueno & Claude
**Methodology**: Apple Product Development (Software)

---

## 1. Product Vision

> "The best interface is the one you never have to read a manual for." — Steve Jobs

The APEX Framework is the most complete vibe-coding framework ever built. 22 skills, 5 agents, 14 hooks, a 7-phase autonomous pipeline, Apple EPM task management, and quality gates that would make Jony Ive nod. But right now, it's invisible. It lives in the terminal. The user types, things happen, and they trust the output.

**The HUB changes everything.**

The APEX Visual Pipeline HUB is a web-based command center that makes the entire framework visible, interactive, and educational. It's not a dashboard — it's a **teaching machine**. Every screen answers a question. Every animation explains a concept. Every interaction teaches the user something they didn't know about building software the right way.

When a user opens the HUB, they should feel what we felt building it: *"This is how software should be made."*

### The Three Promises

1. **See It** — Watch the 7-phase pipeline run. See agents spawn, tasks move, gates light up green. Not a diagram — the real thing, live.
2. **Learn It** — Every element teaches. Hover a phase? Learn what happens inside. Click an agent? Understand why it exists. Watch a quality gate? Learn what it checks and why it matters.
3. **Feel It** — The HUB doesn't just display data. It breathes. Phases pulse when active. Agents glow when working. The pipeline flows like energy through a circuit. This is emotional software.

---

## 2. Apple Product Development Standard

Every feature in this PRD is evaluated against Apple's software criteria:

| Criterion | Question | Standard |
|-----------|----------|----------|
| **Clarity** | Does the user instantly understand what they're looking at? | Zero confusion. Labels, icons, and layout communicate intent without documentation. |
| **Deference** | Does the UI get out of the way of the content? | Content is the interface. Chrome is minimal. Data speaks. |
| **Depth** | Does interaction reveal more? | Every element has a deeper layer. Click to learn more. Hover for context. Expand for details. |
| **Craft** | Would we be proud to demo this at WWDC? | Pixel-perfect alignment. Smooth 60fps animations. No placeholder text. No "lorem ipsum". Every string is real. |
| **Teaching** | Does using this make the user better? | Every screen teaches a software engineering concept. Users leave knowing more than when they arrived. |

---

## 3. Problem Statement

### For New Users (The Explorer)
APEX has a 475-line README. 22 skills they've never heard of. 5 agents they don't understand. A 7-phase pipeline they can't visualize. The learning curve is not technical — it's conceptual. They need to *see* the system to believe in it.

**The HUB is their first session.** Before they ever type a command, they open localhost:3001 and understand — visually — what APEX does, why it matters, and how it's different from every other AI coding tool.

### For Active Builders (The Builder)
Mid-session, a builder has 5 agents running, 16 tasks across 3 phases, and quality gates executing. All of this is happening in the terminal — text scrolling by. They lose context. They can't see the big picture.

**The HUB is their mission control.** One browser tab, always open. Tasks moving across the Kanban. Agents showing active/idle. Quality gates lighting up. The terminal is for doing. The HUB is for seeing.

### For the Framework (Marketing)
Every competitor has screenshots. Cursor has the IDE. Windsurf has the flow view. Devin has the plan viewer. APEX has... a README. The HUB gives APEX its visual identity — the screenshot that makes someone say "I want that."

---

## 4. Competitive Analysis

| Tool | What They Show | What They Don't | APEX HUB Advantage |
|------|---------------|-----------------|---------------------|
| **Cursor** | AI suggestions inline | No pipeline, no quality gates, no multi-agent | Full pipeline visualization + quality enforcement |
| **Windsurf** | Step-by-step flow preview | Single agent, no decomposition, no testing | Multi-agent war room + Apple EPM task board |
| **Devin** | Plan + execution log | Opaque (you see output, not thinking) | **Agent Thought Stream** — see WHY agents make decisions |
| **v0** | Component preview | No backend, no testing, no pipeline | Full-stack pipeline from PRD to PR |
| **bolt.new** | Fast scaffold preview | No quality enforcement whatsoever | Quality gates as visual spectacle |
| **GitHub Copilot Workspace** | Plan → implement → review | No live multi-agent, no design system | Live team coordination + Design DNA integration |

**Our unique features no competitor has:**
1. Agent Thought Stream (see agent reasoning live)
2. Apple EPM Kanban with real DRI assignments
3. Quality Gate Theater (watch 7 phases execute visually)
4. Teaching Moments (every element educates)
5. The Breathing Loop (animated multi-agent lifecycle)
6. Design DNA integration (design system + pipeline in one tool)

---

## 5. User Personas

### Persona 1: The Explorer — "Show Me Why I Should Care"

- **Profile**: Technical PM, indie dev, or engineer evaluating AI coding tools
- **Context**: Has tried Cursor, maybe Devin. Skeptical of "another AI tool." Wants to see, not read.
- **Goal**: Understand APEX's pipeline in under 2 minutes. See what makes it different.
- **Success**: Opens HUB, watches pipeline simulation, says "This is how I want to build software."
- **Teaching opportunity**: They leave understanding autonomous pipelines, quality gates, and multi-agent coordination — concepts they'll carry to any tool.

### Persona 2: The Builder — "Show Me What's Happening"

- **Profile**: Developer using APEX daily for real projects
- **Context**: Mid-session with agents running. Needs situational awareness without leaving the terminal.
- **Goal**: See task progress, agent status, quality gate results — at a glance.
- **Success**: Glances at HUB tab, sees 3 tasks done, 2 in progress, QA running. Returns to terminal confident.
- **Teaching opportunity**: They learn Apple EPM methodology by experiencing it — phases, DRIs, WIP limits become intuitive.

---

## 6. Feature Specification

### 6.1 HUB Home — The Entry Point

**Route**: `#/` | **Primary Persona**: Explorer | **Teaching Theme**: "What is APEX?"

The first screen. Two paths diverge: the Framework (pipeline, agents, quality) and the DNA (design system showcase). This page answers one question: *"What can I do here?"*

#### Elements

| Element | Description | Teaching Moment |
|---------|-------------|-----------------|
| **Hero Banner** | APEX logo with tagline: "Agent-Powered EXcellence — Watch AI build software the right way" | Sets the vision |
| **Framework Card** | Large card: "APEX Pipeline" — "See the 7-phase autonomous pipeline that turns ideas into production code" with miniature pipeline preview | Introduces the pipeline concept |
| **DNA Card** | Large card: "Design DNA" — "14 premium UI templates, 33 starters, 39 components — the visual quality bar" with template thumbnail grid | Introduces the design system |
| **Stats Bar** | Animated counters: 5 Agents, 22 Skills, 14 Hooks, 7 Phases, 14 Templates | Shows framework scale |
| **Live Indicator** | Green pulse dot if Claude Code session detected, gray if demo mode | Connects HUB to terminal |
| **The Creed** | Footer: "Never ship untested code. Never skip the PRD. Never break the build. This is the Way." | Sets the standard |

#### Acceptance Criteria
- [ ] Two cards render with hover animations (scale + glow)
- [ ] Stats bar counts animate up on page load (CountUp effect)
- [ ] Live indicator checks `.apex/state/session.json` via polling
- [ ] Mobile: cards stack vertically, stats become 2x3 grid
- [ ] Lighthouse > 95, LCP < 1s

---

### 6.2 Pipeline Overview — The Spectacle

**Route**: `#/pipeline` | **Primary Persona**: Explorer + Builder | **Teaching Theme**: "How does APEX build software?"

This is the flagship page. The 7-phase pipeline rendered as a living, breathing flow. Not a static diagram — an interactive experience that teaches the entire APEX methodology.

#### The Pipeline Flow

```
[PLAN] --gate--> [ARCHITECT] --gate--> [DECOMPOSE] --> [VERIFY] --> [BUILD] --> [QUALITY] --gate--> [SHIP]
  |                  |                      |              |            |            |               |
  PRD              System               PM Agent       API Check    Agents      7-Phase QA      PR + Merge
  Skill            Design               Task Board     DNA Load     Builders    Security         Tech Writer
                                        DRI Assign                  Watcher     A11Y + CX
```

#### Elements

| Element | Description | Teaching Moment |
|---------|-------------|-----------------|
| **Phase Nodes** | 7 connected rounded cards, horizontal (desktop) / vertical (mobile) | Each phase name teaches the step |
| **Connection Lines** | Animated dashed lines between phases, energy flowing left-to-right | Shows progression and flow |
| **Gate Indicators** | Phases 1, 2, 7 have a lock/shield icon — "User Approval Required" | Teaches the 3-gate model |
| **Phase Detail Panel** | Click any phase to expand: what happens, which agents activate, which skills invoke, estimated time | Deep learning about each phase |
| **Agent Avatars** | Small agent icons appear on phases where they're active | Teaches which agents do what |
| **Simulate Button** | "Run Pipeline" — animates all 7 phases sequentially with realistic timing | The wow moment — watch it flow |
| **Live Mode** | When session active, shows REAL current phase with progress indicator | Builder sees where they are |
| **Teaching Sidebar** | Collapsible panel: "Why 7 phases?" explaining autonomous pipeline vs. manual coding | Deep educational content |

#### Phase Detail Content (expandable)

| Phase | Agents Active | Skills Used | Gate? | What Happens |
|-------|--------------|-------------|-------|-------------|
| 1. Plan | Lead | /prd | YES | PRD generated from user's description. Contract presented for approval. |
| 2. Architect | Lead | /architecture | YES | System design: stack, schema, API contracts, component tree. Blueprint presented. |
| 3. Decompose | PM | /teams | No | PM reads PRD+Arch, creates phased task board (P0/P1/P2). DRIs assigned. Dependencies wired. |
| 4. Verify | Lead | /verify-api, /verify-lib | No | External APIs verified against live docs. Design DNA recipe loaded. Dependencies checked. |
| 5. Build | Builder, Watcher | /teams | No | Builders implement tasks. Watcher monitors continuously. Breathing Loop runs. |
| 6. Quality | QA, Lead | /qa, /security, /a11y, /cx-review | No (auto-fix) | 7-phase QA gate. Security scan. Accessibility audit. CX review. Auto-fix and re-run on failure. |
| 7. Ship | Tech Writer, Lead | /ship, /changelog | YES | Docs updated. Commit + PR created. User approves merge. Release. |

#### Simulation Timing
- Phase 1 (Plan): 2s active → gate pause 1s → complete
- Phase 2 (Architect): 2s active → gate pause 1s → complete
- Phase 3 (Decompose): 1.5s active → complete (no gate)
- Phase 4 (Verify): 1s active → complete
- Phase 5 (Build): 3s active (longest — show Breathing Loop mini-animation) → complete
- Phase 6 (Quality): 2s active (show gate checks appearing one by one) → complete
- Phase 7 (Ship): 1.5s active → gate pause 1s → complete with confetti/glow effect

#### Acceptance Criteria
- [ ] All 7 phases render as connected nodes with labels and icons
- [ ] 3 gates visually distinct (lock icon, different border treatment)
- [ ] Click any phase opens detail panel with agents, skills, description
- [ ] "Run Pipeline" animates all phases sequentially with proper timing
- [ ] Live mode shows current phase when `.apex/state/pipeline.json` exists
- [ ] Reduced motion: instant transitions, no animation
- [ ] Mobile: vertical flow, swipe-friendly
- [ ] Teaching sidebar expandable with educational content

---

### 6.3 Task Board — The War Room

**Route**: `#/tasks` | **Primary Persona**: Builder | **Teaching Theme**: "How does Apple EPM work?"

This is the Apple EPM Kanban. Not a toy Kanban — a real project management view that teaches the methodology by showing it in action. When the PM agent decomposes work, these tasks appear here. Live.

#### Columns (Apple EPM)

| Column | Meaning | Visual | WIP Limit |
|--------|---------|--------|-----------|
| **Backlog** | PM decomposed, not yet started | Gray cards, dimmed | Unlimited |
| **To Do** | Assigned to DRI, ready to start | White cards, phase badge | Per phase |
| **In Progress** | Builder actively working | Accent glow, pulse animation | 2 per builder |
| **Review** | QA verifying, or PR in review | Yellow border, review icon | 1 per QA |
| **Done** | Accepted, shipped | Green checkmark, success state | Unlimited |

#### Task Card Content

Each card shows:
- **Title**: Brief description (e.g., "Build Pipeline Flow component")
- **Phase Badge**: P0 (red), P1 (amber), P2 (blue) — color-coded priority
- **DRI Avatar**: Builder/QA/Writer icon with name
- **Acceptance Criteria Count**: "4/6 criteria met" progress bar
- **File Count**: "Touches 3 files" — scope indicator
- **Dependencies**: "Blocked by #4" or "Blocks #7, #8"
- **Expand**: Click to see full acceptance criteria, test plan, file list

#### Teaching Elements

| Element | What It Teaches |
|---------|----------------|
| **Phase grouping** (P0/P1/P2 filters) | Why you ship in phases, not all at once |
| **DRI assignment** | Why every task needs ONE owner (Apple's DRI model) |
| **WIP limits** | Why limiting work-in-progress increases throughput |
| **Acceptance criteria** | Why "done" needs a definition, not a feeling |
| **Dependency arrows** | Why task ordering matters (DAG visualization) |
| **Velocity indicator** | How many tasks completed per hour — teaches estimation |

#### Live Sync — The API Bridge

When Claude Code is running:

```
Hook: TaskCreate → writes to .apex/state/tasks.json
Hook: TaskUpdate → updates .apex/state/tasks.json
                           ↓
            Vite watches .apex/state/
                           ↓
            useApexState() hook triggers re-render
                           ↓
            Task card appears / moves / updates in browser
```

**Latency target**: < 500ms from TaskUpdate to visual update.

When no session active: shows demo data — a realistic build of "Phoenix CRM" decomposed into 14 tasks across 3 phases, showing what a real APEX build looks like.

#### Acceptance Criteria
- [ ] 5-column Kanban renders using DNA KanbanColumn starter
- [ ] Task cards show all fields: title, phase, DRI, criteria progress, dependencies
- [ ] Phase filter (P0/P1/P2/All) works
- [ ] Cards animate when moving between columns (slide transition)
- [ ] Live mode: tasks update within 500ms of hook writing state file
- [ ] Demo mode: 14 realistic mock tasks based on real APEX terminology
- [ ] Click card expands to full detail view
- [ ] WIP limit indicators show on column headers
- [ ] Teaching tooltips on phase badges, DRI icons, WIP indicators
- [ ] Mobile: single-column view with column tabs

---

### 6.4 Agent Team — The Roster

**Route**: `#/agents` | **Primary Persona**: Explorer | **Teaching Theme**: "Why multi-agent? Why these roles?"

This page answers the question every developer asks: *"Why do you need 5 agents? Can't one AI do everything?"* The answer is specialization — and this page makes that viscerally clear.

#### Agent Cards (6 agents)

| Agent | Model | Icon | Tagline | Teaching Point |
|-------|-------|------|---------|---------------|
| **Lead** (You) | Opus | Crown | "The architect. Orchestrates the team, makes final calls." | Why you need a decision-maker |
| **PM** | Sonnet | Clipboard | "The Tim Cook. Turns vision into tasks." | Why planning before coding matters |
| **Builder** | Sonnet | Hammer | "The craftsman. Writes the code, respects the architecture." | Why implementation needs structure |
| **QA** | Sonnet | Shield | "The Steve Kerr. Nothing ships without approval." | Why testing is non-negotiable |
| **Watcher** | Haiku | Eye | "The sentinel. Catches errors before they compound." | Why continuous monitoring prevents debt |
| **Tech Writer** | Haiku | Pen | "The chronicler. Every change documented." | Why documentation is architecture |

#### The Breathing Loop (Animated SVG)

The signature APEX diagram — an animated cycle showing how agents coordinate:

```
    ┌──────────────────────────────────────┐
    │                                      │
    │   ┌──────────┐    ┌───────────┐      │
    │   │ WATCHER  │───>│  BUILDER  │      │
    │   │ (detect) │    │  (fix)    │      │
    │   └──────────┘    └─────┬─────┘      │
    │        ^                │            │
    │        │                v            │
    │        │           ┌───────────┐     │
    │        └───────────│    QA     │     │
    │                    │ (verify)  │─> [WRITER] -> [SHIP]
    │                    └───────────┘     │
    │                                      │
    └────── The Breathing Loop ────────────┘
```

Animated: arrows pulse in sequence showing the flow. Each node lights up when "active."

#### Agent Thought Stream (Mind-Blowing Feature)

**This is the feature no competitor has.**

When Claude Code is running, each agent card shows a real-time thought stream — a compact feed of what the agent is doing:

```
┌─ Builder ─────────────────────────────────┐
│  [12:34:02] Reading PipelineFlow.tsx...    │
│  [12:34:05] Creating phase node component  │
│  [12:34:08] Adding animation keyframes     │
│  ● Active — Task #5: Build Pipeline Flow   │
└────────────────────────────────────────────┘
```

This is not just logging. It's narrated — the agent explains WHAT it's doing and WHY:

```
[12:34:05] Creating phase node component
           → Each pipeline phase needs its own visual card
             so users can click to expand details
```

**How it works**: SubagentStart hook + agent output capture → `.apex/state/agents.json` with latest action + explanation. The teaching is built INTO the agent's stream.

#### Scan Responsibility Matrix

Interactive table showing which agent owns which quality concern:

| Concern | Builder | QA | Watcher | Writer |
|---------|---------|-----|---------|--------|
| TypeScript errors | Writes | Verifies | Detects | — |
| Test coverage | Writes tests | Runs tests | — | — |
| Security | Avoids vulns | Scans OWASP | — | — |
| Performance | Optimizes | Benchmarks | Monitors | — |
| Documentation | — | — | — | Owns |
| CHANGELOG | — | — | — | Owns |

Hover any cell to see a teaching tooltip explaining the responsibility.

#### Acceptance Criteria
- [ ] 6 agent cards render in 2x3 grid (desktop) / 1-col (mobile)
- [ ] Each card shows: name, model badge, icon, tagline, teaching tooltip
- [ ] Breathing Loop SVG animates with pulsing arrows
- [ ] Live mode: agent cards show active/idle status
- [ ] Agent Thought Stream shows last 5 actions per agent when session active
- [ ] Scan Responsibility Matrix renders as interactive table
- [ ] Reduced motion: static diagram, no animation
- [ ] Teaching tooltips accessible via keyboard (Tab + Enter)

---

### 6.5 Quality Gates — The Theater

**Route**: `#/quality` | **Primary Persona**: Explorer + Builder | **Teaching Theme**: "What makes code production-ready?"

This page makes quality gates feel like a spectacle. When QA runs, the user watches 7 phases execute one by one — each lighting up green or red. It's not a test report. It's a **quality ceremony**.

#### The 7-Phase QA Gate

| Phase | What It Checks | Icon | Teaching Point |
|-------|---------------|------|---------------|
| 1. Dependencies | Package versions, security advisories, license compliance | Package | "Your dependencies are your attack surface" |
| 2. Code Quality | TypeScript strict, no `any`, ESLint, Prettier, conventional commits | Code | "Style consistency eliminates cognitive load" |
| 3. Logic | Business logic correctness, edge cases, error handling | Brain | "Code that works is not the same as code that's correct" |
| 4. Design DNA | Matches design tokens, responsive, dark/light, no hardcoded colors | Palette | "Design is how it works, not just how it looks" |
| 5. Performance | Bundle size, lazy loading, no N+1, pagination, Lighthouse | Zap | "Speed is a feature, not an optimization" |
| 6. Security | OWASP Top 10, auth patterns, input validation, secrets scan | Lock | "Security is not a feature — it's a constraint" |
| 7. Polish | Spelling, version consistency, dead references, truncated text | Gem | "The last 10% is the other 90%" |

#### Additional Gates

| Gate | When It Runs | What It Checks |
|------|-------------|---------------|
| **Accessibility** | Always (UI components) | WCAG 2.2 AA, keyboard nav, screen readers, contrast |
| **CX Review** | Always (user-facing) | Customer journey, onboarding, error messages, delight |
| **Security Deep** | Auth/payments/PII code | Encryption, token storage, injection, CSRF |

#### Visual Execution

When QA runs (live or simulation):
1. Each phase appears as a horizontal bar
2. Bar fills left-to-right over ~1s
3. Icon at the end: green checkmark (pass) or red X (fail)
4. Failed phases expand to show what failed and how the auto-fix works
5. After all 7 phases: overall score card appears (e.g., "Quality Score: 94/100")

#### The Quality Score

A computed score that makes quality tangible:
- Each of the 7 phases contributes up to ~14 points
- Bonus points for accessibility, security, CX
- Visual: large number with color (green > 90, yellow > 70, red < 70)
- **Teaching**: "A quality score below 90 means the build has gaps that will cost 10x more to fix after shipping."

#### Acceptance Criteria
- [ ] 7 QA phases render as expandable cards with icons and descriptions
- [ ] Each phase has a teaching tooltip explaining WHY it matters
- [ ] Additional gates (A11Y, CX, Security) render as separate section
- [ ] Simulation mode: phases execute sequentially with fill animation
- [ ] Live mode: shows real results from `.apex/state/quality.json`
- [ ] Failed phases auto-expand with failure details
- [ ] Quality Score computed and displayed prominently
- [ ] Reduced motion: instant fill, no animation
- [ ] Mobile: cards stack, progress bars scale

---

### 6.6 Teaching Layer — The Framework That Teaches

**This runs across ALL pages.** Not a separate page — a system.

#### Teaching Mechanisms

| Mechanism | Where | How | Example |
|-----------|-------|-----|---------|
| **Hover Tooltips** | Every icon, badge, phase node | 200ms delay, arrow tooltip | Hover "P0" badge → "P0 means Must-Ship: without this, the product doesn't work" |
| **Expand Panels** | Phase details, task details, agent details | Click to expand | Click Pipeline Phase 3 → full explanation of PM decomposition |
| **Teaching Sidebar** | Pipeline, Quality pages | Collapsible right panel | "Why 7 phases?" essay with before/after comparison |
| **Concept Links** | Inline in descriptions | Underlined terms link to definitions | "DRI" links to explanation of Apple's Directly Responsible Individual model |
| **Progress Breadcrumb** | Top of every page | Shows where user is in learning journey | "HUB > Pipeline > Phase 3: Decompose" |
| **"Why?" Buttons** | On every major element | Opens explanation modal | "Why do we need a Watcher agent?" → 3-sentence answer |

#### Concepts the HUB Teaches

| Concept | Where Taught | Why It Matters |
|---------|-------------|----------------|
| Autonomous Pipelines | Pipeline page | Why automation beats manual coding |
| Quality Gates | Quality page | Why testing upfront saves 10x later |
| Multi-Agent Coordination | Agents page | Why specialization beats generalism |
| Apple EPM (DRI, Phases, WIP) | Task Board page | Why structure beats chaos |
| Design Systems | DNA link + HUB integration | Why tokens beat hardcoded styles |
| Conventional Commits | Quality Phase 2 detail | Why commit messages matter |
| PRD-Driven Development | Pipeline Phase 1 detail | Why specs before code |
| Architecture-First | Pipeline Phase 2 detail | Why design before implementation |

---

## 7. Live Sync API — The Bridge

### 7.1 State File Protocol

All state lives in `.apex/state/` at the project root. Files are JSON, written by hooks, read by the HUB via Vite file-watching.

#### `session.json` — Session Presence

Written by: SessionStart hook. Deleted by: SessionEnd hook.

```typescript
interface SessionState {
  active: boolean;
  startedAt: string;       // ISO timestamp
  branch: string;
  model: string;
  contextUsed: number;     // percentage
  contextMax: number;      // tokens
}
```

#### `pipeline.json` — Pipeline Phase Tracking

Written by: Lead orchestrator (output style drives this).

```typescript
interface PipelineState {
  currentPhase: number;    // 1-7, 0 = idle
  phases: {
    id: number;
    name: string;
    status: "idle" | "active" | "complete" | "failed";
    startedAt?: string;
    completedAt?: string;
    gateApproved?: boolean;
  }[];
}
```

#### `tasks.json` — Task Board State

Written by: PM agent via TaskCreate/TaskUpdate hooks.

```typescript
interface TaskBoardState {
  projectName: string;
  tasks: {
    id: string;
    title: string;
    description: string;
    column: "backlog" | "todo" | "in-progress" | "review" | "done";
    phase: "P0" | "P1" | "P2";
    dri: "builder" | "qa" | "technical-writer" | "pm";
    acceptanceCriteria: { text: string; met: boolean }[];
    files: string[];
    blockedBy: string[];
    blocks: string[];
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    p0Count: number;
    p1Count: number;
    p2Count: number;
    completedCount: number;
    velocity: number;      // tasks/hour
  };
}
```

#### `agents.json` — Agent Status

Written by: SubagentStart hook + agent output hooks.

```typescript
interface AgentState {
  agents: {
    name: string;
    status: "idle" | "active" | "completed" | "failed";
    model: string;
    currentTask?: string;
    thoughtStream: {
      timestamp: string;
      action: string;
      explanation: string;  // The teaching layer — WHY, not just WHAT
    }[];
    startedAt?: string;
    completedAt?: string;
  }[];
}
```

#### `quality.json` — Quality Gate Results

Written by: QA agent on completion.

```typescript
interface QualityState {
  score: number;           // 0-100
  phases: {
    name: string;
    status: "pending" | "running" | "passed" | "failed";
    details?: string;
    startedAt?: string;
    completedAt?: string;
  }[];
  additionalGates: {
    security: "pending" | "passed" | "failed" | "skipped";
    accessibility: "pending" | "passed" | "failed" | "skipped";
    cxReview: "pending" | "passed" | "failed" | "skipped";
  };
}
```

### 7.2 Hook Integration

| Hook Event | State File | What It Writes |
|------------|-----------|---------------|
| `SessionStart` | session.json | `{ active: true, startedAt, branch, model }` |
| `SessionEnd` | session.json | Deletes the file (session over) |
| `SubagentStart` | agents.json | Adds/updates agent entry with status: "active" |
| `TaskCompleted` | agents.json | Updates agent thought stream |
| `PostToolUse` (TaskCreate) | tasks.json | Adds new task to board |
| `PostToolUse` (TaskUpdate) | tasks.json | Updates task column/status |
| QA agent output | quality.json | Writes gate results as they complete |

### 7.3 Client-Side Hook: `useApexState()`

```typescript
function useApexState<T>(filename: string, fallback: T): {
  data: T;
  isLive: boolean;  // true if reading from real state, false if using fallback
  lastUpdated: Date | null;
}
```

Implementation: Vite's HMR for dev mode. Polling (1s interval) as fallback. The hook returns `isLive: false` when the state file doesn't exist, and the UI shows demo data with a "Demo Mode" badge.

---

## 8. Technical Architecture

### 8.1 Decision: Extend the Existing Showcase

The HUB is NOT a separate app. It extends `docs/design-dna/showcase/`. One app, one port (3001), shared infrastructure.

**Rationale**: The Showcase already has React 19, Vite 6, Tailwind 4, TypeScript 5, the hash router, palette system, and 14 template pages. Building a second app would duplicate everything.

### 8.2 Stack (Zero New Dependencies)

| Technology | Version | Already In Showcase | Purpose |
|-----------|---------|-------------------|---------|
| React | 19 | Yes | UI framework |
| Vite | 6 | Yes | Dev server + HMR + file watching |
| Tailwind | 4 | Yes | Utility classes |
| TypeScript | 5 | Yes | Type safety |
| DNA Starters | — | Yes | KanbanColumn, Card, Badge, StatCard, Tabs, SectionHeader |

### 8.3 New File Structure

```
docs/design-dna/showcase/src/
  pages/
    HomePage.tsx            MODIFY  Move DNA home content to #/dna
    HubHome.tsx             NEW     The new #/ root page
    PipelinePage.tsx         NEW     #/pipeline
    TaskBoardPage.tsx        NEW     #/tasks
    AgentsPage.tsx           NEW     #/agents
    QualityPage.tsx          NEW     #/quality
  data/
    routes.ts               MODIFY  Add HUB routes, new category "hub"
    pipeline.ts             NEW     7 phases with full metadata
    agents.ts               NEW     6 agent definitions with teaching content
    quality-gates.ts        NEW     Gate structure + mock results
    mock-tasks.ts           NEW     14 demo tasks (Phoenix CRM build)
    teaching.ts             NEW     Tooltip/sidebar educational content
  components/
    hub/
      HubCard.tsx           NEW     Hero card for HUB home
      StatsBar.tsx          NEW     Animated counter stats
      LiveIndicator.tsx     NEW     Green/gray session indicator
    pipeline/
      PipelineFlow.tsx      NEW     Connected phase visualization
      PhaseNode.tsx         NEW     Individual phase node
      PhaseDetail.tsx       NEW     Expandable phase detail panel
      SimulateButton.tsx    NEW     Pipeline simulation controller
    tasks/
      TaskCard.tsx          NEW     Kanban task card with expand
      TaskDetail.tsx        NEW     Expanded task view
      PhaseFilter.tsx       NEW     P0/P1/P2/All filter bar
      WipIndicator.tsx      NEW     WIP limit display
    agents/
      AgentCard.tsx         NEW     Agent role card
      BreathingLoop.tsx     NEW     Animated SVG lifecycle diagram
      ThoughtStream.tsx     NEW     Real-time agent action feed
      ResponsibilityMatrix.tsx NEW  Interactive scan matrix
    quality/
      GatePhase.tsx         NEW     Individual quality phase bar
      GateSimulation.tsx    NEW     Sequential gate execution
      QualityScore.tsx      NEW     Overall score display
    teaching/
      TeachingTooltip.tsx   NEW     Hover tooltip with "why" content
      TeachingSidebar.tsx   NEW     Collapsible educational panel
      ConceptLink.tsx       NEW     Inline term definition link
      WhyButton.tsx         NEW     "Why?" explanation trigger
  hooks/
    useApexState.ts         NEW     Reads .apex/state/ files via polling/HMR
  layout/
    ShowcaseNav.tsx         MODIFY  Add HUB section with separator
  App.tsx                   MODIFY  Add HUB route handling

.apex/
  state/                    NEW     State files written by hooks (gitignored)
    session.json
    pipeline.json
    tasks.json
    agents.json
    quality.json
```

### 8.4 Route Configuration

```typescript
// New route categories
type RouteCategory = "hub" | "template" | "system";

// HUB routes (new)
export const HUB_ROUTES: RouteEntry[] = [
  { path: "/pipeline", label: "Pipeline", component: lazy(() => import("../pages/PipelinePage")), palette: "saas", category: "hub" },
  { path: "/tasks", label: "Tasks", component: lazy(() => import("../pages/TaskBoardPage")), palette: "saas", category: "hub" },
  { path: "/agents", label: "Agents", component: lazy(() => import("../pages/AgentsPage")), palette: "saas", category: "hub" },
  { path: "/quality", label: "Quality", component: lazy(() => import("../pages/QualityPage")), palette: "saas", category: "hub" },
  { path: "/dna", label: "DNA Home", component: lazy(() => import("../pages/HomePage")), palette: "saas", category: "hub" },
];

// Existing TEMPLATE_ROUTES unchanged
```

### 8.5 Nav Structure

```
[APEX HUB]  |  Pipeline  Tasks  Agents  Quality  |  DNA  |  Landing  SaaS  CRM  Blog  ...
  (home)       -------- HUB section --------    (link)    -------- DNA section --------
```

Two sections separated by visual dividers. HUB section uses the SaaS blue palette. DNA section uses per-template palettes.

---

## 9. Design Direction

### Visual Language
Inherits from DNA Showcase: dark-first, glassmorphism nav, Inter + Instrument Serif, accent-glow interactions. But the HUB pages have a more **dashboard** feel — data-dense, grid-based, with live indicators.

### Color Semantics (HUB-specific)
- **Phase P0**: `var(--error)` / red — urgent, must-ship
- **Phase P1**: `var(--warning)` / amber — important, should-ship
- **Phase P2**: `var(--accent)` / blue — polish, nice-to-have
- **Active state**: Accent glow + pulse animation
- **Complete state**: Green checkmark + success background
- **Failed state**: Red X + error background
- **Live indicator**: Green pulse dot
- **Demo indicator**: Gray dot + "Demo" badge

### Animation Budget
- Page transitions: 300ms fade
- Card hover: 200ms scale(1.02) + shadow
- Pipeline simulation: 15s total (2s per phase + gate pauses)
- Breathing Loop: Continuous 4s cycle
- Thought Stream: 200ms slide-in per entry
- Quality gate fill: 1s per phase bar
- All animations: `prefers-reduced-motion` → instant

---

## 10. Milestones (Apple Product Development Phases)

### Phase 1: Foundation (P0 — Must Ship)
**Goal**: HUB exists. Users can navigate between Framework and DNA. Pipeline is visible.
- Infrastructure: routes, nav, state hook, data files
- HUB Home page with cards + stats
- Pipeline page with 7-phase flow + expandable details
- Live indicator (session detection)
- **Gate**: All 3 pages render. Nav works. Existing DNA routes unbroken. Build passes.

### Phase 2: War Room (P0 — Must Ship)
**Goal**: The killer features. Task board and agents are visible.
- Task Board with Kanban + mock data
- Agent Team with cards + Breathing Loop SVG
- Demo data: Phoenix CRM build (14 tasks)
- **Gate**: All 5 HUB pages render. Mock data realistic. Build passes.

### Phase 3: Live Bridge (P1 — Should Ship)
**Goal**: Real-time sync between Claude Code and HUB.
- `useApexState()` hook with polling
- Hook updates: SessionStart/End write session.json
- TaskCreate/Update write tasks.json
- SubagentStart writes agents.json
- Live/Demo mode indicators on all pages
- **Gate**: State file written → UI updates < 500ms. Fallback to demo works.

### Phase 4: Quality Theater + Teaching (P1 — Should Ship)
**Goal**: Quality gates as spectacle. Teaching layer complete.
- Quality Gates page with simulation
- Quality Score computation
- Teaching tooltips across all pages
- Teaching sidebar on Pipeline + Quality pages
- "Why?" buttons on major elements
- Concept links (DRI, WIP, phases)
- **Gate**: Full teaching coverage. Every icon has a tooltip. Every phase has a "why."

### Phase 5: Polish + Ship (P2 — The Beskar)
**Goal**: Apple-quality finish. Mind-blowing.
- Pipeline simulation animation (full 15s spectacle)
- Agent Thought Stream (live feed)
- CountUp animation on stats
- Confetti/glow on pipeline completion
- Mobile responsive verification at 320px
- Lighthouse > 95 on all pages
- Full QA gate (7 phases)
- A11Y audit (WCAG 2.2 AA)
- CX review
- Bundle size check (< 50KB additional gzipped)
- **Gate**: Would we demo this at WWDC? Ship it.

---

## 11. Success Metrics

| Metric | Current | Target | How We Measure |
|--------|---------|--------|---------------|
| Time to understand APEX | ~15 min (README) | < 2 min (visual) | User testing |
| Framework visual completeness | DNA only | DNA + Pipeline + Agents + Quality + Tasks | Page count |
| Lighthouse score | 95+ | 95+ with HUB | Lighthouse audit |
| Live sync latency | N/A | < 500ms | Automated test |
| Teaching coverage | 0 tooltips | Every icon + badge + phase | Count |
| Bundle size increase | 0 | < 50KB gzipped | Vite build |
| "Mind-blown" reaction | 0 | Every demo | Human judgment |

---

## 12. Open Questions (Need Your Call)

1. **Port 3001** — Single app, extend showcase. Yes?
2. **GitHub Pages** — Make HUB deployable for marketing? Requires Vite `base` config.
3. **`#/` = HUB Home** — DNA moves to `#/dna`. Yes?
4. **Agent Thought Stream** — How deep should the narration go? Just actions, or full reasoning?
5. **Demo data** — Phoenix CRM as the showcase build, or something else?

---

## 13. The Standard

Before this ships, every team member asks:

> "Would Steve Jobs approve this demo?"

If the answer is anything other than "yes" — it goes back to the forge.

This is the Way.
