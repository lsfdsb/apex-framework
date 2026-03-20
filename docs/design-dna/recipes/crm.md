# Recipe: CRM / Customer Relationship Management

> Design DNA page: `docs/design-dna/crm.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `fintech-teal.css` |
| **Background** | grid (static) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Professional, structured, data-rich |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/fintech-teal.css src/app/tokens/palette.css
cp docs/design-dna/starters/layout/*.tsx src/components/layout/
cp docs/design-dna/starters/primitives/*.tsx src/components/ui/
```

## Layout

| Pattern | Component | Notes |
|---------|-----------|-------|
| Navigation | `Sidebar` + `MobileNav` | Sections: Main, Sales, Support |
| Content | `PageShell` | Wide content area for tables/kanban |

## Pages & Components

### /dashboard
| Section | Components | Details |
|---------|-----------|---------|
| KPI strip | `Card` (stat) | 4-5 metrics with sparkline trends |
| Charts | `Card` | Bar chart + donut chart side by side |
| Activity feed | `Card` + `Avatar` | Timeline of recent actions |
| Pipeline summary | `ProgressBar` | Funnel visualization |

### /contacts
| Section | Components | Details |
|---------|-----------|---------|
| Header | `SectionHeader` + search `Input` | "Contacts" with filter/search |
| Table | `DataTable` | Name (with Avatar), company, status Badge, last contact |
| Contact detail | Slide-over drawer | Fields, notes, timeline |

### /pipeline
| Section | Components | Details |
|---------|-----------|---------|
| Kanban columns | Custom grid | Lead, Qualified, Proposal, Negotiation, Won/Lost |
| Deal cards | `Card` | Company, value, contact Avatar, stage Badge |
| Deal detail | Drawer | Progress bar, field groups, tags |

### /helpdesk
| Section | Components | Details |
|---------|-----------|---------|
| SLA metrics | `Card` (stat) | Response time, resolution time, CSAT |
| Ticket queue | `DataTable` | Priority bar, subject, status Badge, assignee Avatar |
| Chat window | Custom component | Agent/user messages, input |

### /analytics
| Section | Components | Details |
|---------|-----------|---------|
| Funnel | Custom visualization | Stage bars with percentages |
| Lead scoring | `ProgressRing` + `Card` | Score ring, factors list |
| Performance | `DataTable` | Agent performance metrics |
