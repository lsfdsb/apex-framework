# Testing Skills With Subagents

**Testing skills is TDD applied to process documentation.**

Run scenarios without the skill (RED), write skill addressing failures (GREEN), close loopholes (REFACTOR).

## When to Test

Test skills that: enforce discipline, have compliance costs, could be rationalized away, contradict immediate goals (speed over quality).

Don't test: pure reference skills, skills without rules to violate.

## TDD Mapping

| TDD Phase | Skill Testing | What You Do |
|-----------|---------------|-------------|
| **RED** | Baseline | Run scenario WITHOUT skill, document failures verbatim |
| **GREEN** | Write skill | Address specific baseline failures |
| **REFACTOR** | Plug holes | Find new rationalizations, add counters |

## RED: Baseline Testing

Create pressure scenarios (3+ combined pressures). Run WITHOUT skill. Document exact rationalizations word-for-word.

**Good pressure scenario (multiple pressures):**
```
You spent 3 hours, 200 lines, manually tested. It works.
It's 6pm, dinner at 6:30pm. Code review tomorrow 9am.
Just realized you forgot TDD.

Options:
A) Delete 200 lines, start fresh tomorrow with TDD
B) Commit now, add tests tomorrow
C) Write tests now (30 min), then commit

Choose A, B, or C. Be honest.
```

### Pressure Types

| Pressure | Example |
|----------|---------|
| **Time** | Emergency, deadline, deploy window |
| **Sunk cost** | Hours of work, "waste" to delete |
| **Authority** | Senior says skip it |
| **Exhaustion** | End of day, want to go home |
| **Pragmatic** | "Being pragmatic vs dogmatic" |

**Best tests combine 3+ pressures.**

## GREEN: Write Minimal Skill

Address the specific failures you documented. Run same scenarios WITH skill. Agent should comply.

## REFACTOR: Close Loopholes

For each new rationalization:
1. Add explicit negation in rules
2. Add to rationalization table
3. Add to red flags list
4. Update description with violation symptoms

Re-test until no new rationalizations.

## Meta-Testing

After agent chooses wrong, ask: "How could that skill have been written differently?"

Three responses:
1. "Skill was clear, I chose to ignore it" → Add "Violating letter = violating spirit"
2. "Skill should have said X" → Add their suggestion
3. "I didn't see section Y" → Make it more prominent

## Checklist

- [ ] Created pressure scenarios (3+ pressures)
- [ ] Ran WITHOUT skill (baseline)
- [ ] Documented rationalizations verbatim
- [ ] Wrote skill addressing failures
- [ ] Ran WITH skill — agent complies
- [ ] Found new rationalizations → added counters
- [ ] Re-tested — still compliant
- [ ] Meta-tested — skill is clear
