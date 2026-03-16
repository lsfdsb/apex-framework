---
paths:
  - "**/components/**"
  - "**/*.tsx"
---

# Component Conventions

- Props interface with JSDoc above the component. Default export.
- Hooks at the top. Derived state next (not in useEffect). Event handlers. Early returns. Single JSX return.
- Atomic design: atoms (Button, Input), molecules (SearchBar, Card), organisms (Header, ProductList).
- Every component handles: loading state, error state, empty state. No blank screens.
- Accessibility: semantic HTML, aria-labels on icon buttons, keyboard navigation, focus management.
- Responsive: mobile-first. Test at 320px, 768px, 1280px.
- No inline styles. Use Tailwind utilities or CSS modules.
- Memoize only when measured — premature React.memo hurts readability.
- Extract custom hooks for reusable logic. Name them `useXxx`.
- Co-locate: component file, test file, and styles in the same directory.
