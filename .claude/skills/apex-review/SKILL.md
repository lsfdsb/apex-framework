---
name: apex-review
description: Runs a critical quality review of the APEX Framework itself. This skill should be used when the user says "review framework", "audit APEX", "improve framework", "framework quality", "rate our framework", or periodically to ensure the framework stays current. Checks all skills, agents, hooks, and settings against official Claude Code documentation.
context: fork
agent: Plan
---

# APEX Framework — Self-Review Audit

ultrathink

You are a senior framework architect performing a comprehensive quality audit of the APEX Framework. Be brutally honest. Rate everything 1-10.

## Audit Process

### Phase 1: Structural Verification
Read every file in `.claude/` and verify against official Claude Code documentation:

1. **SKILL.md files**: Valid frontmatter? name + description present? Under 500 lines? Reference files linked?
2. **Agent files**: name + description present? Tools list valid? Model specified? Skills preloaded correctly?
3. **Hook scripts**: Executable bit set? jq dependency handled? Exit codes correct (0=allow, 2=block)?
4. **settings.json**: Valid JSON? Hook events match official event names? Matchers are correct regex?
5. **Output style**: frontmatter valid? keep-coding-instructions set?

### Phase 2: Philosophy Compliance
Check that every skill enforces our philosophy:
- Does design-system reference Jony Ive's principles?
- Does code-standards follow Torvalds/Dean patterns?
- Does security-audit follow Ionescu/Rutkowska defense-in-depth?
- Does cx-review follow our Head of CX philosophy?
- Is the educational output style active and teaching in every interaction?

### Phase 3: Gap Analysis
Compare our skills against the fast-shipping requirements:
- [ ] PRD generation before code
- [ ] Architecture design
- [ ] Research before integration
- [ ] Code standards enforcement
- [ ] Design system
- [ ] QA gate
- [ ] Security audit
- [ ] Performance optimization
- [ ] SQL/database best practices
- [ ] CX review
- [ ] Deploy checklist
- [ ] Testing enforcement (deterministic hook?)
- [ ] Changelog generation
- [ ] Auto-documentation
- [ ] Error debugging workflow
- [ ] Commit standards
- [ ] Library verification
- [ ] Workflow enforcement
- [ ] Multilingual support
- [ ] Terminal teaching

### Phase 4: Documentation Freshness
- Is the README current?
- Is the INSTALL guide accurate?
- Does CLAUDE.md reference all active skills?
- Are PRDs updated with recent changes?

### Phase 5: Future-Proofing
- Are we using deprecated Claude Code features?
- Are there new Claude Code features we should adopt?
- Is the tech stack still current?
- Are any dependencies approaching EOL?

## Output

Create `docs/reviews/apex-review-[date].md`:

```markdown
# APEX Framework Review — [Date]

## Overall Score: [X.X]/10

### Category Scores
| Category | Score | Trend | Notes |
|----------|-------|-------|-------|

### Critical Issues (fix now)
### Improvements (fix soon)
### Suggestions (consider)
### What's Working Well (keep)

### Comparison to Last Review
[Delta from previous review if one exists]

### Recommended Next Actions (prioritized)
1. [Action] — [effort] — [impact]
```
