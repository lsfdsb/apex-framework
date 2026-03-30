# email — Email Templates

> Part of APEX Ops monorepo. See root CLAUDE.md for framework rules.

## Stack

- React Email
- @apex/design-system (shared tokens)
- Resend (delivery)

## This App

- **Purpose**: Transactional email templates (welcome, alerts, reports)
- **Port**: 3003

## Rules

- Each template is a React component in `emails/`.
- Preview with `npm run dev`.
- Inline styles only — no external CSS in emails.
- Test rendering in multiple clients before shipping.
