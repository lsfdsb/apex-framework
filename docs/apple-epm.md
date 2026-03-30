# Apple EPM Alignment

APEX adapts Apple's Engineering Program Management for AI agent teams. We are honest about what we implement fully, what we adapt, and what we aspire to.

## What We Implement Faithfully

| Apple Concept                             | APEX Implementation                                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| **Functional Organization**               | Agents organized by function (Builder, QA, Designer, PM, Writer) — experts lead experts |
| **DRI (Directly Responsible Individual)** | Every task has ONE named DRI who owns the decision, not just execution                  |
| **ANPP (Development Plan)**               | PM generates milestone plan (M0→M1→M2→M3) with DRI registry and critical path           |
| **Rules of the Road (Launch Plan)**       | Tech Writer generates launch checklist in Phase 7 — separate from ANPP                  |
| **Quality Gates**                         | Binary gates at milestones — ship or don't, no "maybe" states                           |
| **Seven Elements**                        | Mapped to agents AND enforced as exit criteria (not just labels)                        |
| **"The last 10% is the other 90%"**       | QA Delight Check, polish phase, zero tolerance for "good enough"                        |

## What We Adapt (Simplified but Honest)

| Apple Original                            | Our Adaptation                                             | Why                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **10→3→1 design exploration**             | **3→1**: Designer explores 3 directions, Lead picks 1      | We're AI agents, not a 200-person design team. 3 directions is meaningful; 10 is theater. |
| **Weekly ET Reviews across all products** | ET Review at milestone gates per project                   | We work on one project at a time, not Apple's portfolio                                   |
| **EVT/DVT/PVT hardware validation**       | M0 (Foundation) → M1 (Core) → M2 (Quality) → M3 (Ship)     | Software analog of Apple's hardware validation phases                                     |
| **Paired design meetings**                | Designer does brainstorm pass + production pass in Phase 6 | Same divergent/convergent cycle, compressed into one review                               |

## What We Aspire To (Not Yet Implemented)

| Apple Concept                          | Status                                               | Path Forward                                                   |
| -------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------- |
| **Demo-driven development**            | Builder has demo-first protocol for complex features | Need structured demo→iterate→demo loop                         |
| **Living on the product (dogfooding)** | Not modeled                                          | Future: auto-deploy previews, team eats own cooking            |
| **Quality built in from start**        | Builder self-verifies during build, not just at end  | Ongoing improvement — quality in every phase, not just Phase 6 |
