# Recipe: Backoffice / Admin Panel

> Design DNA page: `docs/design-dna/backoffice.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `saas-blue.css` |
| **Background** | dots (static) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Structured, efficient, data-dense |

## Setup Commands

```bash
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/saas-blue.css src/app/tokens/palette.css
cp docs/design-dna/starters/layout/*.tsx src/components/layout/
cp docs/design-dna/starters/primitives/*.tsx src/components/ui/
```

## Layout

| Pattern | Component | Notes |
|---------|-----------|-------|
| Navigation | `Sidebar` + `MobileNav` | Sections: Users, Content, Finance, Settings |
| Content | `PageShell` | Dense layout, less padding |

## Pages & Components

### /users
| Section | Components | Details |
|---------|-----------|---------|
| Header | `SectionHeader` + `Input` (search) + `Button` | Add user |
| Table | `DataTable` | Avatar, name, email, role Badge, status Badge, actions |
| User detail | Drawer | Edit form, activity log, permissions |

### /activity
| Section | Components | Details |
|---------|-----------|---------|
| Filters | `Badge` chips + date `Input` | Type, user, date range |
| Log | `DataTable` | Timestamp, user Avatar, action, target, IP |

### /invoices
| Section | Components | Details |
|---------|-----------|---------|
| Table | `DataTable` | Number, client, amount, status Badge, date, download |
| Stats | `Card` (stat) row | Total revenue, pending, overdue |

### /permissions
| Section | Components | Details |
|---------|-----------|---------|
| Matrix | Custom grid | Roles × permissions with checkboxes |
| Roles | `Badge` variants | Admin (accent), Editor (info), Viewer (default) |

### /settings
| Section | Components | Details |
|---------|-----------|---------|
| Sections | `Card` groups | General, Security, Integrations, Billing |
| Forms | `Input` + toggle switches | Key-value settings |
