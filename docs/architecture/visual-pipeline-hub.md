# Architecture: APEX Visual Pipeline HUB

**Date**: 2026-03-25 | **Status**: Approved | **PRD**: docs/prd/visual-pipeline-hub.md

## Decision: Extend Existing Showcase

Single app on port 3001. Zero new dependencies. 27 new components, 5 modified files.

## Route Architecture

- `#/` → HUB Home (new root)
- `#/pipeline` → Pipeline Overview
- `#/tasks` → Task Board (Apple EPM Kanban)
- `#/agents` → Agent Team + Breathing Loop
- `#/quality` → Quality Gates Theater
- `#/dna` → DNA Home (moved from `#/`)
- `#/landing` ... `#/animations` → DNA Templates (unchanged)

## Live Sync: Polling over WebSocket

ADR: Use 1s polling against `.apex/state/*.json` files. Zero deps. Avg 500ms latency. Fallback to demo data when no session active.

## Nav: Two Sections

```
[APEX HUB] | Pipeline Tasks Agents Quality | DNA | Landing SaaS CRM Blog ...
```

## Component Reuse

Existing starters: KanbanColumn (extend), StatCard (extend), Badge, Card, ProgressBar (extend), Tooltip (extend), Accordion, Tabs, Avatar, SectionHeader.

## State Files (.apex/state/)

- session.json — Session presence (written by SessionStart/End hooks)
- pipeline.json — Current phase (written by lead orchestrator)
- tasks.json — Task board (written by TaskCreate/Update hooks)
- agents.json — Agent status + thought stream (written by SubagentStart hook)
- quality.json — Gate results (written by QA agent)

## Phases

1. Foundation (P0): Routes + Nav + HUB Home + Pipeline — 8 new, 4 modified
2. War Room (P0): Task Board + Agents — 9 new
3. Live Bridge (P1): useApexState + Vite plugin + hook wiring — 2 new, 6 modified
4. Quality Theater + Teaching (P1): Quality page + tooltips/sidebars — 7 new, 4 modified
5. Polish + Ship (P2): Animations + simulation + responsive + QA — 2 new, 5+ modified

## Zero New Dependencies

React 19, Vite 6, Tailwind 4, TypeScript 5 — all already installed.
