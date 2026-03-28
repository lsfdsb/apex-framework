# Persuasion Principles for Skill Design

LLMs respond to the same persuasion principles as humans. Understanding this helps design effective skills — not to manipulate, but to ensure critical practices are followed under pressure.

**Research:** Meincke et al. (2025) tested 7 principles with N=28,000 AI conversations. Persuasion techniques doubled compliance (33% → 72%, p < .001).

## The Principles That Matter for Skills

### Authority

Imperative language: "YOU MUST", "Never", "No exceptions". Eliminates decision fatigue.

```
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

### Commitment

Require announcements and explicit choices. Use tracking (tasks/checklists).

```
✅ When you find a skill, you MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

### Scarcity

Time-bound requirements: "Before proceeding", "IMMEDIATELY after". Prevents "I'll do it later."

### Social Proof

Universal patterns: "Every time", "Always". Failure modes: "X without Y = failure."

### Unity

Collaborative language: "our codebase", "we're colleagues." For collaborative workflows.

### Avoid: Reciprocity & Liking

Rarely useful. Liking conflicts with honest feedback and creates sycophancy.

## By Skill Type

| Type                     | Use                                   | Avoid           |
| ------------------------ | ------------------------------------- | --------------- |
| Discipline (TDD, verify) | Authority + Commitment + Social Proof | Liking          |
| Guidance (patterns)      | Moderate Authority + Unity            | Heavy authority |
| Reference (docs)         | Clarity only                          | All persuasion  |

## Why It Works

- Bright-line rules reduce rationalization — "YOU MUST" removes decision fatigue
- "When X, do Y" is more effective than "generally do Y"
- Authority language precedes compliance in LLM training data

**Citations:** Cialdini (2021) _Influence_; Meincke et al. (2025) _Call Me A Jerk_, U. of Pennsylvania.
