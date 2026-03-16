---
name: a11y
description: Runs an accessibility audit against WCAG 2.2 AA standards. This skill should be used when the user says "accessibility", "a11y", "WCAG", "screen reader", "keyboard navigation", "contrast", "aria", or before shipping any user-facing feature. Accessibility is not optional — it's a legal and ethical requirement.
allowed-tools: Read, Grep, Glob, Bash
---

# Accessibility Audit — WCAG 2.2 AA

## Automated Checks

Run these in the codebase:

```bash
# Find images without alt text
grep -rn '<img' --include="*.tsx" --include="*.jsx" | grep -v 'alt=' | grep -v 'role="presentation"'

# Find buttons without accessible names
grep -rn '<button' --include="*.tsx" --include="*.jsx" | grep -v 'aria-label' | grep -v '>'

# Find inputs without labels
grep -rn '<input' --include="*.tsx" --include="*.jsx" | grep -v 'aria-label' | grep -v 'id=.*label'

# Find click handlers on non-interactive elements
grep -rn 'onClick' --include="*.tsx" | grep -E '<(div|span|p|section)' | grep -v 'role=' | grep -v 'tabIndex'

# Find color-only indicators
grep -rn 'text-red\|text-green\|text-yellow' --include="*.tsx" | grep -v 'sr-only\|aria-'
```

## Manual Review Checklist

### Perceivable
- [ ] All images have meaningful alt text (or role="presentation" for decorative)
- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)
- [ ] Information not conveyed by color alone (add icons, text, or patterns)
- [ ] Video/audio has captions or transcripts
- [ ] Text resizes to 200% without breaking layout

### Operable
- [ ] All interactive elements reachable via keyboard (Tab, Shift+Tab)
- [ ] Visible focus indicator on all focused elements (2px+ ring, high contrast)
- [ ] Logical tab order (follows visual reading order)
- [ ] No keyboard traps (can Tab out of any component)
- [ ] Skip navigation link as first focusable element
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] No content that flashes more than 3 times per second

### Understandable
- [ ] Page language declared (`<html lang="en">`)
- [ ] Form fields have visible labels (not just placeholder)
- [ ] Error messages identify the field and explain the fix
- [ ] Consistent navigation across pages
- [ ] No unexpected context changes on input

### Robust
- [ ] Valid semantic HTML (headings in order: h1 → h2 → h3)
- [ ] ARIA used correctly (aria-label, aria-describedby, aria-live)
- [ ] Dynamic content announced to screen readers (aria-live="polite")
- [ ] Works with assistive technology (VoiceOver on macOS: Cmd+F5)

## Testing Tools
```bash
# Install axe for automated testing
npm install -D @axe-core/playwright

# In Playwright tests
import AxeBuilder from '@axe-core/playwright';

test('page should have no a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Output

```markdown
## Accessibility Audit: [Page/Component]
**WCAG Level**: AA | **Status**: ✅ PASS / ⚠️ ISSUES / ❌ FAIL

### Violations
- [WCAG criterion] [Level] [Impact]: [description] → [fix]

### Warnings
- [Item]: [description] → [recommendation]

### Score
- Perceivable: [X]/5
- Operable: [X]/5
- Understandable: [X]/5
- Robust: [X]/5
```
