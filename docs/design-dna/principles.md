# Design Principles — The Taste Bible

> "Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs

These 10 principles are **mandatory reading** for every builder agent before writing any user-facing code. They are the difference between "AI made this" and "a designer made this." Patterns tell you WHAT to build. Principles tell you WHY it looks that way.

**Rule**: If your output violates any of these principles, it will be blocked at QA agent design validation. No exceptions.

---

## 1. The 40% Whitespace Rule

**Rule**: Every card, section, and page must have at least 40% whitespace. Measure visually — if content fills more than 60% of a container, it's cramped.

**Why**: Whitespace is not empty space — it's breathing room. It creates hierarchy, guides the eye, and signals quality. Cramped layouts signal "we had too much to say and not enough design skill to organize it."

**How to apply**:

- Cards: `p-6` minimum (24px). Never `p-2` or `p-3` for content cards
- Sections: `py-12` to `py-16` between major sections (48-64px)
- Page margins: `px-4` mobile, `px-8` desktop minimum
- Between elements: use `gap-4` (16px) minimum in flex/grid layouts
- Lists: `space-y-3` minimum between items

**Anti-pattern**: A card with icon, title, description, 3 tags, 2 buttons, a progress bar, and a timestamp — all in 180px height. This is a spreadsheet cell wearing a card costume.

---

## 2. The Three Font Sizes Rule

**Rule**: Any single view (what the user sees without scrolling) should use a maximum of 3-4 distinct font sizes. More sizes = visual noise.

**Why**: Typography hierarchy guides the eye. When everything is a different size, nothing stands out. The brain can process 3 levels of hierarchy instantly; beyond that, it scans randomly.

**How to apply**:

- **Display** (24-48px): Page title, hero headline. ONE per view
- **Body** (14-16px): Content text, descriptions, form labels
- **Caption** (11-12px): Metadata, timestamps, badges, labels
- **Optional 4th — KPI** (20-28px): For data-heavy dashboards, stat values

**Anti-pattern**: A sidebar with 8px nav labels, 11px section headers, 13px menu items, 14px descriptions, 16px active item, and 18px title. Six sizes in one column = visual cacophony.

---

## 3. The One Accent Rule

**Rule**: Your accent color should appear in a maximum of 3-5 elements per viewport. Everything else is neutral (background shades, text shades, borders).

**Why**: Accent color creates focal points. When everything is accented, nothing is. The power of accent comes from scarcity. A single amber button on a neutral page screams "click me." Ten amber elements on the same page scream "carnival."

**How to apply**:

- Primary CTA button: accent
- Active nav item: accent
- Important badge or indicator: accent
- Everything else: neutrals (--text, --text-secondary, --text-muted, --border)
- Status colors (success/warning/destructive) are NOT accent — they're semantic

**Anti-pattern**: Accent-colored sidebar items + accent card headers + accent badges + accent borders + accent icons = the entire page is one color at different opacities.

---

## 4. The Motion Budget

**Rule**: Maximum 2 simultaneous animations per viewport. Page entrance animations (apex-enter, stagger) don't count — they fire once and stop.

**Why**: Motion guides attention. When everything moves, the eye doesn't know where to look. Continuous animations (pulse, spin, shimmer) are attention thieves — use them only for truly important state changes (loading, new notification).

**How to apply**:

- **Page load**: apex-enter + stagger delays. Fires once. This is free
- **Hover**: Subtle transform (translateY -2px, scale 1.02). This is free — it's user-initiated
- **Continuous**: Maximum 1 per viewport (e.g., a loading spinner OR a pulse notification dot, not both)
- **Transitions**: 200-300ms duration. Ease-out for entrances, ease-in for exits
- **Scroll reveals**: Stagger children by 50-100ms. Maximum 4-5 stagger levels

**Anti-pattern**: A dashboard where 3 charts animate in, 2 stat cards pulse, the sidebar has a shimmer loading state, a notification dot pulses, and the header has a gradient animation. The user's eyes are having a seizure.

---

## 5. Information Density by Context

**Rule**: Different app types need different content-to-whitespace ratios. Match the density to the user's task, not the developer's instinct to "fill the space."

**Why**: A CRM agent scanning 60 contacts needs density. A landing page visitor needs breathing room to read a value proposition. Mismatched density = wrong UX for the job.

**Density targets**:
| App Type | Data Density | Whitespace | Key Pattern |
|----------|-------------|------------|-------------|
| **CRM / Backoffice** | 60-70% | 30-40% | Compact rows, dense tables, small type |
| **Dashboard** | 50-60% | 40-50% | KPI cards with space, charts with margins |
| **SaaS App** | 45-55% | 45-55% | Balanced content panels, clear sections |
| **Landing Page** | 30-40% | 60-70% | Large type, hero sections, generous margins |
| **Blog / Editorial** | 40-50% | 50-60% | Readable line width (max 720px), vertical space |
| **Portfolio** | 25-35% | 65-75% | Image-forward, minimal text, dramatic space |

**Anti-pattern**: A CRM table with `py-6` row padding and `text-lg` cell text — wastes precious vertical space that agents need to scan quickly. Or a landing page with 5 features crammed into one fold — no room to breathe or persuade.

---

## 6. Empty States Are Marketing

**Rule**: Empty states are not error messages. They're opportunities to guide, teach, and delight. Every empty state must have: an illustration or icon, a clear headline, a helpful description, and a primary CTA.

**Why**: Empty states are the first thing new users see. "No data found" tells the user nothing. "You haven't added any contacts yet — import your first batch to get started" tells them what to do and makes the product feel alive.

**How to apply**:

```tsx
// GOOD
<EmptyState
  icon={<Users className="w-12 h-12 text-muted" />}
  title="No contacts yet"
  description="Import your first contacts or add them manually to start building your pipeline."
  action={<Button>Import Contacts</Button>}
/>

// BAD
<p className="text-gray-400 text-center">No data</p>
```

**Anti-pattern**: A blank white page with "No results" in gray text. Or worse — a completely empty container with no indication that something should be there.

---

## 7. The Consistent Radius Rule

**Rule**: Use a maximum of 3 border-radius values across the entire application. Define them as tokens and never use arbitrary values.

**Why**: Inconsistent border-radius is the #1 tell that multiple people (or multiple AI sessions) built the UI. Some cards with 4px, others with 8px, buttons with 12px, badges with 999px — it looks assembled, not designed.

**How to apply**:

- **Small** (`--radius-sm`: 8px): Badges, inputs, small interactive elements
- **Default** (`--radius`: 12px): Cards, panels, modals, dropdowns
- **Full** (`--radius-full`: 9999px): Pills, avatar circles, toggle switches
- That's it. Three values. No 4px, no 6px, no 16px, no 20px

**Anti-pattern**: A page where cards have `rounded-lg` (8px), modals have `rounded-2xl` (16px), buttons have `rounded-md` (6px), and badges have `rounded` (4px). Four different radius values = visual chaos.

---

## 8. The Single Persona Rule

**Rule**: Each page/view serves ONE primary persona. Never mix management views (dashboards, KPIs, reports) with operational views (queues, kanban, forms) on the same page.

**Why**: A CEO looking at revenue metrics has a fundamentally different mental model than an agent working through a contact queue. Mixing these creates cognitive overload — the CEO sees clutter they don't need, and the agent can't find their tools.

**How to apply**:

- Check the architecture's Persona → Page Map before building
- Dashboard page → Leadership persona → KPIs, charts, trends
- Pipeline page → Agent persona → Kanban, queue, contact cards
- Settings page → Admin persona → Configuration, permissions, integrations
- If stakeholders ask "can we add KPIs to the agent view?" → create a small, collapsible summary — don't merge two views

**Anti-pattern**: A page with a revenue chart (for the CEO), a kanban board (for agents), a team performance table (for supervisors), and a settings panel (for admins). It serves everyone and satisfies no one.

---

## 9. The Loading State Contract

**Rule**: Every async operation must have a loading state that maintains the layout. Skeleton screens for content areas, spinner for actions, disabled state for buttons. No layout shifts.

**Why**: Layout shifts during loading destroy perceived performance. When content "jumps" as it loads, users feel the app is broken even if it's fast. Skeleton screens preserve the layout and signal "content is coming" without jarring shifts.

**How to apply**:

- **Content areas**: Skeleton shimmer that matches the shape of what will load
- **Buttons**: Disable + show spinner inside the button (same dimensions)
- **Tables**: Skeleton rows with the same column widths as real data
- **Cards**: Skeleton with same height/padding as loaded card
- **Never**: Show a blank container, then jump to content. No CLS (Cumulative Layout Shift)

```tsx
// GOOD — skeleton matches final layout
{
  isLoading ? (
    <div className="space-y-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ) : (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p>{description}</p>
      <p>{details}</p>
    </div>
  );
}
```

**Anti-pattern**: A full-page spinner that disappears and the entire layout renders at once, causing the page to "flash." Or a table that shows "Loading..." text, then replaces it with 20 rows, shifting everything below it.

---

## 10. The Dark Mode Parity Rule

**Rule**: Dark mode is not a filter applied over light mode. Both themes must be designed simultaneously, with equal care. If a component looks great in dark and broken in light (or vice versa), it's not done.

**Why**: 60%+ of developers and power users prefer dark mode. If it's an afterthought, they'll notice immediately — washed-out text, invisible borders, blinding white surfaces that survived the theme switch.

**How to apply**:

- Use semantic tokens exclusively (`--bg`, `--text`, `--accent`, `--border`)
- Never hardcode hex colors — they won't adapt to theme changes
- Test BOTH themes at every checkpoint, not just at the end
- Borders that are invisible in dark mode need adjusted opacity: `border-border/50` in dark, `border-border` in light
- Shadows behave differently: dark surfaces need less shadow (they're already receding), light surfaces need more

**Anti-pattern**: Building entirely in dark mode, switching to light at the end, and discovering that half the text is invisible, cards have no visual separation, and the accent color has insufficient contrast on white backgrounds.

---

## Quick Reference Card

Print this. Tape it to your monitor. Read it before every UI task.

```
┌─────────────────────────────────────────────────────────┐
│  APEX Design Principles — Quick Reference               │
│                                                         │
│  1. 40% whitespace minimum per card/section             │
│  2. Max 3-4 font sizes per viewport                     │
│  3. Accent color in max 3-5 elements per viewport       │
│  4. Max 2 simultaneous animations per viewport          │
│  5. Match density to app type (30-70%)                  │
│  6. Empty states = marketing (icon + title + CTA)       │
│  7. Max 3 border-radius values (sm, default, full)      │
│  8. One persona per page — never mix views              │
│  9. Skeleton loading — zero layout shifts               │
│  10. Dark + light designed together, not sequentially   │
│                                                         │
│  If it violates a principle, it doesn't ship.           │
│  This is the Way.                                       │
└─────────────────────────────────────────────────────────┘
```
