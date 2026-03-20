# Recipe: SaaS Dashboard

> Design DNA page: `docs/design-dna/saas.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `saas-blue.css` |
| **Background** | dots (static) |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Clean, professional, data-focused |

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
| Navigation | `Sidebar` + `MobileNav` | Sections: Overview, Analytics, Settings |
| Content | `PageShell` | Standard sidebar layout |

## Pages & Components

### /dashboard
| Section | Components | Details |
|---------|-----------|---------|
| Stats row | `Card` (stat) | 4 KPIs with delta indicators (+/-%) |
| Charts | `Card` | Line chart (revenue), bar chart (users) |
| Recent activity | `DataTable` | User, action, time, status Badge |
| Quick actions | `Button` group | Common tasks |

### /users
| Section | Components | Details |
|---------|-----------|---------|
| Header | `SectionHeader` + `Input` (search) | "Users" with filters |
| Table | `DataTable` | Avatar, name, email, role Badge, status, last active |
| User detail | Drawer or page | Profile, activity log, settings |

### /analytics
| Section | Components | Details |
|---------|-----------|---------|
| Date range | Tab group | 7d, 30d, 90d, 1y |
| Metrics | `Card` (stat) | MRR, churn, LTV, CAC |
| Charts | `Card` | Area chart, cohort table |

### /settings
| Section | Components | Details |
|---------|-----------|---------|
| Profile | `Avatar` + `Input` fields | Name, email, avatar |
| Preferences | Toggle switches | Notifications, theme, language |
| Billing | `Card` | Plan info, usage, upgrade button |
| Team | `DataTable` | Members, roles, invite button |
