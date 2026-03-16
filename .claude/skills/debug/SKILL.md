---
name: debug
description: Structured debugging workflow for any error. Auto-loads when Claude encounters an error, build failure, test failure, runtime exception, or when the user says "error", "bug", "broken", "not working", "fix this", "debug", "crash", "fails", "undefined", "null", "TypeError", "500 error". Teaches the user to debug like a senior engineer.
allowed-tools: Read, Grep, Glob, Bash
---

# Debug — Think Like a Detective

> "Debugging is twice as hard as writing the code in the first place." — Brian Kernighan

## The APEX Debug Protocol

Every bug follows the same investigation process. Teaching the user this protocol makes them a better engineer.

### Step 1: READ the error (don't guess)
```
📺 ERROR: [paste the full error message]
📖 WHAT IT SAYS: [translate to plain language]
🧠 WHAT IT MEANS: [the underlying cause]
📍 WHERE TO LOOK: [file:line from the stack trace]
```

📚 *Teaching*: Always read the FULL error message. The answer is usually in the last 3 lines of a stack trace. Look for the FIRST file that's YOUR code (not node_modules).

### Step 2: REPRODUCE (confirm you can trigger it)
- Can you trigger this error consistently?
- What's the minimal input that causes it?
- Does it happen in dev, prod, or both?

### Step 3: ISOLATE (narrow down the cause)
- When did this last work? (`git log --oneline -10`)
- What changed since then? (`git diff HEAD~5`)
- Is it a data issue, logic issue, or environment issue?

### Step 4: FIX (smallest change that solves it)
- Fix the root cause, not the symptom
- Add a test that would have caught this
- Check if the same pattern exists elsewhere (Grep for similar code)

### Step 5: VERIFY (prove it's fixed)
- Run the specific test
- Run the full test suite
- Manual check in the browser/app

### Step 6: PREVENT (make it impossible to recur)
- Add the test (if not added in Step 4)
- Add TypeScript types that prevent this class of error
- Add validation at the input boundary
- Update the PRD if this revealed a missing requirement

## Common Error Patterns

| Error | Usually Means | Fix Pattern |
|-------|--------------|-------------|
| `TypeError: Cannot read property of undefined` | Missing null check | Optional chaining `?.` or guard clause |
| `404 Not Found` | Wrong URL or missing route | Check API route path matches frontend fetch |
| `CORS error` | Backend doesn't allow frontend origin | Add origin to CORS config |
| `Hydration mismatch` | Server/client render different HTML | Check for browser-only code in server components |
| `Module not found` | Wrong import path or missing dependency | Check path, run `npm install` |
| `ECONNREFUSED` | Service not running | Start the database/API server |
| `JWT expired` | Auth token timed out | Implement token refresh flow |

## Checkpointing (Save/Restore State)

When debugging complex issues across long sessions, use git checkpoints to save and restore state:

```bash
# Save a checkpoint before trying a risky fix
git stash push -m "debug-checkpoint: before fix attempt 1"

# Try your fix...

# If it didn't work, restore the checkpoint
git stash pop

# Or save as a named branch for later reference
git checkout -b debug/issue-description
git commit -am "debug: checkpoint before approach 2"
git checkout -  # go back to original branch
```

**When to checkpoint**:
- Before trying a fix you're unsure about
- When switching between multiple debugging approaches
- Before reverting changes to test in isolation
- When the session is getting long and you want to preserve progress

## Output Format

```markdown
## 🔍 Debug Report

**Error**: [one-line description]
**Cause**: [root cause explanation]
**Fix**: [what was changed and why]
**Test**: [test added to prevent recurrence]
**Lesson**: [what the user can learn from this]
```
