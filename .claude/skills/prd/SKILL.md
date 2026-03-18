---
name: prd
description: Generates a comprehensive Product Requirements Document before building any new application or major feature. This skill should be used when the user says "new app", "new feature", "build me", "create an app", "let's build", "start a project", or explicitly asks for a PRD, spec, or requirements document. Must be invoked before implementation begins — no code without a PRD. Also activates for "plan", "scope", "requirements", "spec".
argument-hint: "[feature-name]"
context: fork
agent: Plan
---

# Product Requirements Document Generator

ultrathink

You are a senior product manager. Create a PRD that serves as the single source of truth for what we build and why. This runs in an isolated Plan agent to keep the main conversation clean.

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
7. **External integrations** — List every API, service, or platform mentioned (Twilio, Resend, WhatsApp, Stripe, etc.). Flag each for `/research` before implementation.
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
Pain points, impact, who's affected.

## 3. User Personas
Name, role, goals, frustrations, tech comfort.

## 4. User Stories & Acceptance Criteria
As a [persona], I want [action] so that [outcome].
Priority: P0 (must) / P1 (should) / P2 (nice).
Acceptance criteria for each.

## 4.5. Persona → Page Mapping
| Page/View | Primary Persona | Purpose | Key Actions |
|-----------|----------------|---------|-------------|
Map every page to its primary persona. A dashboard for managers is NOT the same as an operational view for agents. Never mix management views (KPIs, reports) with operational views (queues, tasks, forms) on the same page unless the PRD explicitly calls for it.

## 5. Functional Requirements
By feature area: description, inputs/outputs, validations, error handling.

## 5.5. Integration Requirements
For EVERY external API or service mentioned:
| Integration | Purpose | API to Research | Priority |
|-------------|---------|-----------------|----------|
**RULE**: Each integration listed here MUST have `/research` invoked before implementation begins. Never design integration architecture without checking actual API documentation first.

## 6. Non-Functional Requirements
Performance targets, security model, accessibility (WCAG 2.2 AA), scalability, reliability.

## 7. Design Direction
Aesthetic tone, key screens, interaction patterns, breakpoints.

## 8. Technical Architecture
System overview, stack selection with justification, DB schema, API design.

## 9. Success Metrics
Primary KPIs with targets.

## 10. Risks & Mitigations
Risk, probability, impact, mitigation.

## 11. Milestones
Phase 1 (MVP), Phase 2 (enhance), Phase 3 (scale).

## 12. Open Questions
Unresolved items.
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
⬜ /research [integration] — before implementation
```
The lead MUST invoke `/research` for each item before any builder touches integration code.

### Step 7: Summary
Return a brief summary of key decisions, open questions, research items needed, and the persona→page mapping for user review.
