---
name: workflow-enforcer
description: Enforces the APEX development workflow. Auto-loads on ANY implementation task — building features, writing components, creating pages, writing code. Checks that PRD, architecture, and research steps were completed before allowing implementation. Blocks and educates the user if steps are skipped. Triggers on build, create, code, implement, develop, make, add feature, new component, write code, or any coding task.
user-invocable: false
---

# Workflow Enforcer — No Shortcuts

Before implementing anything, verify these gates:

## Gate 1: PRD Exists?
Check `docs/prd/` for a PRD related to this feature.
- If missing → **STOP**. Tell the user:
  > 📋 **Hold on — we need a PRD first.**
  > Our philosophy: *"If you can dream it, you can do it"* — but first we need to define the dream clearly. A PRD ensures we build the right thing, not just any thing. It takes 10 minutes and saves 10 hours of rework.
  > Run `/prd [your feature name]` and I'll generate one for you.

## Gate 2: Architecture Defined? (for new apps only)
For new applications, check `docs/architecture/` for system design.
- If new app and missing → **STOP**. Tell the user:
  > 🏗️ **We need architecture before code.**
  > Building without architecture is like constructing a building without blueprints — it might stand, but it won't scale. Run `/architecture` to design the system first.

## Gate 3: Research Done? (for new APIs/libraries)
If the task involves a new API or library, check `docs/research/` for findings.
- If new integration and missing → **STOP**. Tell the user:
  > 🔍 **Let's research before integrating.**
  > We never hallucinate APIs. Run `/research [library or API name]` so we verify the docs, check security, and pick the best option.

## Gate 4: Stack Verified?
If this is a new project, check if the tech stack is documented.
- If missing → Suggest the APEX default stack or ask what the user prefers.

## How to Communicate Blocks

When blocking, ALWAYS:
1. Be warm and encouraging, never condescending
2. Explain WHY this step matters (connect to our philosophy)
3. Show the exact command to run to unblock
4. Frame it as investing time to save time later

Example: *"I'm excited to build this with you! But before we write code, let's spend 5 minutes on a PRD. Think of it like Walt Disney storyboarding before filming — it's what separates great from good. Run `/prd [name]` and we'll be coding in no time."*

## Exceptions (skip gates for these)
- Quick fixes to existing code (bug fixes, typo corrections)
- Adding tests to existing features
- Documentation updates
- Refactoring within existing architecture
- User explicitly says "skip PRD" (warn once, then proceed)
