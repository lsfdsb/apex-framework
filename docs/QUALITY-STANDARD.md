# APEX Quality Standard

> "Details aren't details. They make the product." — Charles Eames

## The Bar

S+ quality means the work is complete — not just functional. The feature runs, the edge cases are handled, the error messages are helpful, the version numbers agree, the cross-references are valid, and a new user can follow the documentation without asking anyone. Nothing is half-finished. Nothing is placeholder. Nothing is left for "later."

The bar is not perfectionism. It is respect — for the user who will depend on this, and for the codebase that will carry it forward.

## The Checklist

Every PR that ships must pass these ten points:

1. **First try** — the happy path works without a workaround, a restart, or a prerequisite hidden in someone's head.
2. **No placeholders** — zero lorem ipsum, zero "TODO", zero hardcoded test data in production paths.
3. **Helpful errors** — every failure message says what went wrong, why, and how to fix it. "Something went wrong" is not an error message.
4. **Version consistency** — VERSION, README, CHANGELOG, and package.json all report the same version number.
5. **No dead references** — every file path, agent name, skill name, and API endpoint cited in documentation actually exists.
6. **No truncation** — no string ends mid-word, no table column overflows its container, no label is cut off at a breakpoint.
7. **Counts match reality** — if the README says "14 skills", there are 14 skill directories. Count the files; do not trust the prose.
8. **Dependencies declared** — every tool a script requires is checked at the top of the script with a clear error if missing.
9. **New-user path** — a developer who has never seen this project can follow the README from clone to running app without external help.
10. **Self-review** — the author re-read every file they created before marking the task done.

## The Anti-Patterns

These five patterns instantly fail the quality bar:

1. **Silent failure** — a script encounters a missing dependency or a failed network call and exits with no message. The user sees nothing; the system is broken. Always fail loudly with a clear diagnosis.

2. **Stale version numbers** — VERSION says 5.21.0, README says 5.20.0, CHANGELOG has no 5.21 entry. This is not a minor inconsistency; it is a broken contract with every user who reads documentation.

3. **Dead cross-references** — documentation that points to `docs/old-file.md` or an agent named `code-reviewer` that was renamed two versions ago. Every dead link erodes trust in the entire documentation system.

4. **Hardcoded counts** — "The framework ships 9 agents" written in prose, while the agents directory has 11. These drift invisibly. Either derive counts dynamically or verify them in QA.

5. **Tribal knowledge prerequisites** — installation instructions that work only if you already know to install `jq` first, or scripts that assume `~/.apex-framework/` exists without checking. Every hidden assumption is a failure waiting to happen for the next person.

## The Philosophy

We hold this standard because quality compounds. One stale version number becomes two. One dead reference becomes a broken documentation tree. One silent failure becomes an hour of debugging for a user who trusted the tool.

The cost of catching these issues at PR time is minutes. The cost of shipping them is measured in trust — and trust, once broken in a developer tool, is rarely rebuilt.

APEX ships to developers who depend on the framework to ship their own products. The quality we hold here propagates outward. When APEX is tight, every project built on it is tighter. When APEX is sloppy, the sloppiness scales.

This is not perfectionism. It is the discipline that separates a professional tool from a prototype.
