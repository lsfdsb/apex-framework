# Recipe: Social Feed / Community

> Design DNA page: `docs/design-dna/social.html`

## Foundation

| Setting | Value |
|---------|-------|
| **Palette** | `saas-blue.css` |
| **Background** | none |
| **Display font** | Instrument Serif |
| **Body font** | Inter |
| **Mood** | Connected, dynamic, content-rich |

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
| Navigation | `Sidebar` (left) + right panel | 3-column: sidebar, feed, trending |
| Mobile | Feed only + `MobileNav` (bottom tabs) | Panels hidden |

## Pages & Components

### /feed
| Section | Components | Details |
|---------|-----------|---------|
| Compose | `Card` + `Input` (textarea) | "What's on your mind?" + Button |
| Posts | `Card` list | Avatar, name, time, content, like/comment/share |
| Comments | Nested under posts | Avatar, text, reply button |

### /trending
| Section | Components | Details |
|---------|-----------|---------|
| Topics | `Badge` list | Trending hashtags |
| Suggested | `Card` + `Avatar` | Profile suggestions with follow Button |

### /profile
| Section | Components | Details |
|---------|-----------|---------|
| Header | `Avatar` (large) + cover image | Name, bio, stats (posts, followers, following) |
| Tabs | Tab group | Posts, Replies, Media, Likes |
| Content | `Card` list | Same as feed post cards |
