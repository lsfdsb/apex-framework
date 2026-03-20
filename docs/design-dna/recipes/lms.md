# Recipe: LMS / Learning Platform

> Design DNA page: `docs/design-dna/lms.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `creative-warm.css` |
| **Background** | nebula (animated) |
| **Display font** | Instrument Serif (italic for emphasis) |
| **Body font** | Inter |
| **Mood** | Warm, inspiring, creative |

## Setup Commands

```bash
# 1. Copy foundation + palette
cp docs/design-dna/tokens/foundation.css src/app/tokens/
cp docs/design-dna/tokens/animations.css src/app/tokens/
cp docs/design-dna/tokens/palettes/creative-warm.css src/app/tokens/palette.css

# 2. Copy layout components
cp docs/design-dna/starters/layout/*.tsx src/components/layout/

# 3. Copy primitive components
cp docs/design-dna/starters/primitives/*.tsx src/components/ui/

# 4. globals.css should import:
# @import './tokens/foundation.css';
# @import './tokens/animations.css';
# @import './tokens/palette.css';
```

## Layout

| Pattern | Component | Notes |
|---------|-----------|-------|
| Navigation | `Sidebar` + `MobileNav` | Sidebar on desktop, bottom tabs on mobile |
| Content area | `PageShell` | Sidebar + content + mobile nav |
| Section headers | `SectionHeader` | Serif display font, uppercase label |

## Pages & Components

### /dashboard
| Section | Components | Details |
|---------|-----------|---------|
| Greeting | `SectionHeader` | "Bom dia, *Name.*" — italic accent on name |
| Quick resume | `Card` + `ProgressBar` | Last course with continue button |
| Today's lessons | `Card` (list) | 3-4 lesson cards with time estimates |
| Learning path | `ProgressRing` + `Card` | Vertical timeline with progress |
| Stats | `Card` (stat variant) | Streak, hours, certificates count |

### /courses (catalog)
| Section | Components | Details |
|---------|-----------|---------|
| Header | `SectionHeader` (centered) | "Explore cursos." |
| Filters | `Badge` (as filter chips) | Category filters, active = accent |
| Course grid | `Card` with `Card.Thumbnail` | 2-3 column grid, emoji thumbnails, progress bars |

### /courses/[slug] (detail)
| Section | Components | Details |
|---------|-----------|---------|
| Hero | `Badge` + heading | Difficulty badge, course title in display font |
| Progress | `ProgressBar` | Overall completion |
| Modules | Accordion pattern | Expandable module list with lesson items |
| Instructor | `Avatar` + text | Small card at bottom |

### /player
| Section | Components | Details |
|---------|-----------|---------|
| Video | Full-width container | 16:9 aspect ratio, dark bg |
| Lesson sidebar | Scrollable list | Current lesson highlighted with accent |
| Notes | Text area | Below video on mobile, side panel on desktop |

### /path
| Section | Components | Details |
|---------|-----------|---------|
| Timeline | Vertical line + `Card` | Steps with completed/current/locked states |
| AI reasons | Text below each step | Why this course is recommended |

### /certificates
| Section | Components | Details |
|---------|-----------|---------|
| Grid | `Card` with cert-glow | Radial gradient glow effect, serif title |
| Award | `Badge` (accent) | Completion date, course name |

### /onboarding
| Section | Components | Details |
|---------|-----------|---------|
| Steps | Full-screen cards | 5 steps: welcome, goals, experience, preferences, start |
| Progress | `ProgressBar` | Top of screen, step counter |
| Navigation | `Button` (cta) | Next/Back at bottom |

### /profile
| Section | Components | Details |
|---------|-----------|---------|
| Avatar | `Avatar` (large) | Profile photo or initials |
| Stats | `Card` (stat variant) | Courses, hours, streak, certificates |
| Settings | `Input` fields | Name, email, preferences |
