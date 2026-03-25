---
name: prd
description: Generates a comprehensive Product Requirements Document before building any new application or major feature. This skill should be used when the user says "new app", "new feature", "build me", "create an app", "let's build", "start a project", or explicitly asks for a PRD, spec, or requirements document. Must be invoked before implementation begins — no code without a PRD. Also activates for "plan", "scope", "requirements", "spec".
argument-hint: "[feature-name]"
context: fork
agent: Plan
---

# Product Requirements Document Generator

ultrathink

You are a senior product manager following Marty Cagan's "Inspired" methodology. Create a PRD that serves as the single source of truth for what we build and why. This runs in an isolated Plan agent to keep the main conversation clean.

**Quality bar**: Every PRD must be comprehensive enough that a new engineer joining the project can understand the full system from this document alone. If you'd be embarrassed by a section, rewrite it before shipping.

## Process

### Step 1: Discovery
If $ARGUMENTS is provided, use it as the project brief. Otherwise, summarize what you know and note gaps.

Gather or infer answers for:
1. **Problem** — What pain are we solving? One sentence.
2. **User** — Primary persona (role, goals, tech level).
3. **Success** — Measurable outcomes.
4. **Constraints** — Timeline, stack, integrations.
5. **Feeling** — How should users *feel*? (Our CX philosophy demands this.)
6. **Communication channels** — Does the business use phone, email, WhatsApp, chat, SMS? If ANY communication channel is mentioned (call center, régua de comunicação, outbound, inbound, support, helpdesk), extract explicit requirements for a messaging/helpdesk module. Don't wait for the user to ask — CX-intensive businesses ALWAYS need this.
7. **External integrations** — List every API, service, or platform mentioned (Twilio, Resend, WhatsApp, Stripe, etc.). Flag each for API verification via WebSearch before implementation.
8. **Real business data** — If the user provides product names, prices, revenue figures, team sizes, or customer counts, record them exactly. Mock data MUST reflect these real values, not generic placeholders.

### Step 2: Research
Search the codebase for existing patterns, schemas, and conventions that inform this PRD.

### Step 3: Write the PRD
Create `docs/prd/$ARGUMENTS-prd.md` (slugified) with this structure:

```markdown
# PRD: [Project Name]
**Version**: 1.0 | **Date**: [date] | **Status**: Draft

## 1. Vision & Purpose
One paragraph. Why this exists.

## 2. Problem Statement
Pain points, impact, who's affected. Include quantified cost of inaction (revenue lost, time wasted, churn rate).

## 3. Competitive Landscape
| Competitor | Strengths | Weaknesses | Our Differentiator |
|------------|-----------|------------|-------------------|
Analyze 3-5 existing solutions. What do they get right? Where do they fail? Why build instead of buy?

## 4. User Personas
For each persona include:
- Name, role, goals, frustrations, tech comfort level
- A day-in-the-life scenario showing their current workflow pain
- Key metrics they care about

## 5. User Stories & Acceptance Criteria
As a [persona], I want [action] so that [outcome].
Priority: P0 (must) / P1 (should) / P2 (nice).
Acceptance criteria for each (Given/When/Then format).

## 5.5. User Journey Maps
For each primary persona, document the step-by-step flow:
```
[Entry Point] → [Step 1] → [Decision Point] → [Step 2] → [Success State]
                                    ↓
                             [Error Recovery]
```
Include: happy path, error paths, edge cases. Every screen referenced must exist in the persona→page mapping.

## 6. Persona → Page Mapping
| Page/View | Route | Primary Persona | View Type | Key Actions |
|-----------|-------|----------------|-----------|-------------|
Map every page to its primary persona. A dashboard for managers is NOT the same as an operational view for agents. Never mix management views (KPIs, reports) with operational views (queues, tasks, forms) on the same page unless the PRD explicitly calls for it.

## 7. Functional Requirements
By feature area: description, inputs/outputs, validations, error handling.

## 8. Integration Requirements
For EVERY external API or service mentioned:
| Integration | Purpose | Auth Method | Rate Limits | Priority |
|-------------|---------|-------------|-------------|----------|
**RULE**: Each integration listed here MUST have its API docs verified via WebSearch before implementation begins. Never design integration architecture without checking actual documentation first.

## 9. Non-Functional Requirements
- **Performance**: Page load < 2s, API response < 200ms, Lighthouse > 90
- **Security**: Auth model, data encryption, RBAC, audit logging
- **Accessibility**: WCAG 2.2 AA compliance, keyboard navigation, screen readers
- **Scalability**: Expected user count at 6/12/24 months
- **Reliability**: Uptime target, error budget, graceful degradation strategy
- **Internationalization**: Languages, date/currency formats, RTL support (if needed)

## 10. Data Model
Entity relationship overview. For each core entity:
| Entity | Key Fields | Relationships | Indexes |
|--------|-----------|---------------|---------|
Include: primary keys (UUID), timestamps (created_at, updated_at), soft deletes, audit fields.

## 11. API Contract Specs
For each major API endpoint:
| Method | Endpoint | Request | Response | Auth |
|--------|----------|---------|----------|------|
Include: pagination strategy, error format, rate limiting, versioning.

## 12. Design Direction
- Aesthetic tone, color palette, typography
- Key screens (list every screen with wireframe description)
- Interaction patterns, animation philosophy
- Breakpoints: mobile (320-768px), tablet (768-1024px), desktop (1024px+)
- Dark mode strategy

## 13. Technical Architecture
- System overview diagram (ASCII is fine)
- Stack selection with justification for EACH choice
- Deployment architecture (hosting, CDN, edge functions)
- Service layer abstraction (for mock→real data swap)

## 14. Success Metrics & SLAs
| Metric | Baseline (Current) | Target (V1) | Measurement Method |
|--------|-------------------|-------------|-------------------|
Include both business KPIs and technical SLAs (uptime, response time, error rate).

## 15. Risks & Mitigations
| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|

## 16. Rollback & Recovery Plan
- How to roll back each phase if it fails
- Data migration reversibility
- Feature flags for gradual rollout

## 17. Testing Strategy
- Unit test coverage targets
- Integration test plan
- E2E critical user flows to test
- Performance testing approach
- Accessibility audit plan

## 18. Milestones
Phase 1 (MVP): scope, deliverables, definition of done
Phase 2 (enhance): scope, deliverables
Phase 3 (scale): scope, deliverables

## 19. Open Questions
Unresolved items requiring stakeholder input.
```

### Step 4: Update README.md

After writing the PRD, update the project's `README.md` to reflect the actual project:

1. **Read** the existing README.md (if any)
2. **Replace** template/boilerplate content with project-specific information from the PRD:
   - Project name and one-line description (from Vision & Purpose)
   - What it does (from Problem Statement)
   - Tech stack (from Technical Architecture)
   - Setup instructions (`git clone`, `npm install`, `npm run dev`)
   - Key features (from Functional Requirements, P0 items)
   - Project structure overview
3. **Keep** any existing content that's still relevant (contributing guidelines, license, etc.)
4. If no README.md exists, create one from scratch using the PRD content.

The README is the first thing users and contributors see — it must describe THIS project, not a template.

### Step 5: Mock Data Validation
If the user provided real business data (product names, prices, metrics, team structure):
1. List all real data points extracted from user input
2. Verify mock data in the PRD reflects these values exactly
3. Flag any placeholder data that should be replaced with real values
4. Create a `docs/prd/mock-data-reference.md` mapping real values to mock usage

**RULE**: Generic mock data (random names, round prices, lorem ipsum) is a red flag. If the user said "Adapta Gold at R$1,188", the mock must use "Adapta Gold at R$1,188" — not "Premium Plan at R$999".

### Step 6: Research Triggers
List all external integrations identified and output a checklist:
```
⬜ WebSearch [integration] API docs — before implementation
```
The lead MUST verify API docs via WebSearch for each item before any builder touches integration code.

### Step 7: Summary
Return a brief summary of key decisions, open questions, research items needed, and the persona→page mapping for user review.

### Step 8: Phase Transition
After presenting the PRD, ask the user: "Approve this contract?"

When the user approves, the Lead agent MUST immediately proceed to Phase 2 (Architect) by invoking the `/architecture` skill. Do NOT wait for the user to ask — the pipeline is autonomous. Announce:
```
⚔️ Phase 2: Architecture — "I have spoken."
```
Then invoke `/architecture` with the PRD as context.
