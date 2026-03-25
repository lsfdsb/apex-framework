#!/bin/bash
# generate-about.sh — Rebuilds .claude/skills/about/SKILL.md with live stats
# Runs on SessionStart (alongside manifest-generate) and PostToolUse on .claude/ changes
# Keeps the about skill static for instant rendering while staying current

set -uo pipefail

# Portable sed in-place (macOS vs Linux)
_sed_i() { if [[ "$OSTYPE" == "darwin"* ]]; then _sed_i "$@"; else sed -i "$@"; fi; }

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
SKILL_FILE="$PROJECT_DIR/.claude/skills/about/SKILL.md"
VERSION_FILE="$PROJECT_DIR/VERSION"

# Only run in framework repo (has VERSION + install.sh)
[ -f "$VERSION_FILE" ] && [ -f "$PROJECT_DIR/install.sh" ] || exit 0

# ── Gather stats ──
VERSION=$(head -1 "$VERSION_FILE" 2>/dev/null | tr -d '[:space:]')
SKILL_COUNT=$(find "$PROJECT_DIR/.claude/skills" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
AGENT_COUNT=$(ls "$PROJECT_DIR/.claude/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
SCRIPT_COUNT=$(ls "$PROJECT_DIR/.claude/scripts/"*.sh 2>/dev/null | wc -l | tr -d ' ')
RULE_COUNT=$(ls "$PROJECT_DIR/.claude/rules/"*.md 2>/dev/null | grep -v README | wc -l | tr -d ' ')

# Count hooks from settings.json (unique hook entries across all groups)
HOOK_COUNT=0
if [ -f "$PROJECT_DIR/.claude/settings.json" ] && command -v jq &>/dev/null; then
  HOOK_COUNT=$(jq '[.hooks // {} | to_entries[] | .value[] | .hooks // [] | length] | add // 0' "$PROJECT_DIR/.claude/settings.json" 2>/dev/null || echo "0")
fi

# ── Build agent table rows ──
AGENT_ROWS=""
for f in "$PROJECT_DIR/.claude/agents/"*.md; do
  [ -f "$f" ] || continue
  name=$(grep "^name:" "$f" 2>/dev/null | head -1 | sed 's/^name: *//')
  model=$(grep "^model:" "$f" 2>/dev/null | head -1 | sed 's/^model: *//')
  raw_desc=$(grep "^description:" "$f" 2>/dev/null | head -1 | sed 's/^description: *//')
  desc=$(echo "$raw_desc" | cut -c1-60)
  [ ${#raw_desc} -gt 60 ] && desc="${desc}..."
  # Format name: replace hyphens with spaces, title-case each word
  # Special cases: "qa" → "QA", "technical-writer" → "Technical Writer"
  name=$(echo "$name" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){if(tolower($i)=="qa"){$i="QA"}else{$i=toupper(substr($i,1,1)) tolower(substr($i,2))}}}1')
  model="$(echo "${model:0:1}" | tr '[:lower:]' '[:upper:]')${model:1}"
  AGENT_ROWS="${AGENT_ROWS}| **${name}** | ${model} | ${desc} |
"
done

# ── Build skill table rows (read description from each SKILL.md) ──
SKILL_ROWS=""
VISIBLE_SKILL_COUNT=0
for d in "$PROJECT_DIR/.claude/skills"/*/; do
  [ -d "$d" ] || continue
  skill_name=$(basename "$d")
  # Skip internal skills (commit is auto-invoked, not user-facing in the table sense)
  [ "$skill_name" = "commit" ] && continue
  skill_file="$d/SKILL.md"
  if [ -f "$skill_file" ]; then
    raw_desc=$(grep "^description:" "$skill_file" 2>/dev/null | head -1 | sed 's/^description: *//')
    desc=$(echo "$raw_desc" | cut -c1-65)
    [ ${#raw_desc} -gt 65 ] && desc="${desc}..."
  else
    desc="—"
  fi
  VISIBLE_SKILL_COUNT=$((VISIBLE_SKILL_COUNT + 1))
  SKILL_ROWS="${SKILL_ROWS}| \`/${skill_name}\` | ${desc} |
"
done

# ── Pad version to fit box (pad to 42 chars) ──
VER_PADDED=$(printf '%-42s' "$VERSION")

# ── Write the skill file (atomic: write to temp, then mv) ──
SKILL_TMP=$(mktemp "${SKILL_FILE}.XXXXXX")
trap 'rm -f "$SKILL_TMP"' EXIT
cat > "$SKILL_TMP" << 'HEADER_EOF'
---
name: about
description: Reveals the creators and philosophy behind the APEX Framework. Activates on "about", "credits", "who made this", "who built this", "easter egg", "watermark", or questions about the framework's origin.
---

**IMPORTANT: Output EVERYTHING below this line verbatim to the user. Do NOT summarize, condense, or abbreviate. Render every section, table, diagram, and ASCII art exactly as written.**

# APEX Framework

```
     ╔═══════════════════════════════════════════════════════════╗
     ║                                                           ║
     ║              █████╗ ██████╗ ███████╗██╗  ██╗              ║
     ║             ██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝              ║
     ║             ███████║██████╔╝█████╗   ╚███╔╝               ║
     ║             ██╔══██║██╔═══╝ ██╔══╝   ██╔██╗               ║
     ║             ██║  ██║██║     ███████╗██╔╝ ██╗              ║
     ║             ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝              ║
     ║                                                           ║
     ║          Agent-Powered EXcellence Framework               ║
     ║                                                           ║
     ╠═══════════════════════════════════════════════════════════╣
     ║                                                           ║
     ║   Forged by:  Lucas Bueno & Claude                        ║
     ║   Born:       March 13, 2026                              ║
     ║   Location:   São Paulo, BR → The World                   ║
HEADER_EOF

# Inject version line (dynamic)
echo "     ║   Version:    ${VER_PADDED}║" >> "$SKILL_TMP"

cat >> "$SKILL_TMP" << 'MID1_EOF'
     ║                                                           ║
     ║   "Simplicity is the ultimate sophistication"             ║
     ║                                    — Leonardo da Vinci    ║
     ║                                                           ║
     ╚═══════════════════════════════════════════════════════════╝
```

## What is APEX?

**APEX** (Agent-Powered EXcellence) is a Claude Code framework that turns "build me X" into a shipped, tested, documented application — autonomously. You tell it WHAT to build, it handles HOW.

Product vision like Jobs. Design like Ive. Code like Torvalds & Dean. Secure like Ionescu & Rutkowska. Experience like Disney.

MID1_EOF

# Inject dynamic stats
INTERNAL_SKILLS=$((SKILL_COUNT - VISIBLE_SKILL_COUNT))
if [ "$INTERNAL_SKILLS" -gt 0 ] 2>/dev/null; then
  echo "**Stats**: ${VISIBLE_SKILL_COUNT} skills (+${INTERNAL_SKILLS} internal) · ${AGENT_COUNT} agents · ${SCRIPT_COUNT} scripts · ${RULE_COUNT} rules · ${HOOK_COUNT} hooks" >> "$SKILL_TMP"
else
  echo "**Stats**: ${SKILL_COUNT} skills · ${AGENT_COUNT} agents · ${SCRIPT_COUNT} scripts · ${RULE_COUNT} rules · ${HOOK_COUNT} hooks" >> "$SKILL_TMP"
fi

cat >> "$SKILL_TMP" << 'MID2_EOF'

---

## How It Works — The Autonomous Pipeline

You say "build me X". APEX runs the entire pipeline. You approve at 3 gates:

```
"Build me X"
  │
  ├─ PHASE 1: PLAN ────── /prd auto-generates requirements
  │   ⏸ GATE: Approve the PRD
  │
  ├─ PHASE 2: ARCHITECT ─ /architecture designs the system
  │   ⏸ GATE: Approve the blueprint
  │
  ├─ PHASE 3: BUILD ───── Agent teams work in parallel
  │   (Watcher monitors, Builders code, QA verifies)
  │
  ├─ PHASE 4: QUALITY ─── /qa + /security + /a11y + /cx-review
  │   (Auto-fix and re-run if gates fail)
  │
  ├─ PHASE 5: SHIP ────── Code review + Technical Writer
  │   Auto-version: [Unreleased] → semver after merge
  │   ⏸ GATE: Approve the merge
  │
  └─ DONE ─────────────── "The beskar is forged."
```

For quick fixes and bugs — skip the pipeline, just do it directly.

---

## What's in the Box

### Skills

| Skill | Description |
|-------|-------------|
MID2_EOF

# Inject dynamic skill rows
printf '%s' "$SKILL_ROWS" >> "$SKILL_TMP"

cat >> "$SKILL_TMP" << 'MID3_EOF'

**You never need to type these.** The pipeline invokes them automatically.

### Agents

| Agent | Model | Role |
|-------|-------|------|
MID3_EOF

# Inject dynamic agent rows
printf '%s' "$AGENT_ROWS" >> "$SKILL_TMP"

cat >> "$SKILL_TMP" << 'TAIL_EOF'

Watcher and Technical Writer run in background. Teams spawn for complex builds via `/teams`.

### Design DNA

14 premium UI templates: Landing · SaaS · CRM · E-commerce · Blog · Portfolio · Social · LMS · Backoffice · Email · Slides · E-book · Design System · Patterns

5 palettes (Startup, SaaS, Fintech, Editorial, Creative) × 2 modes (dark/light). Semantic tokens only.

### Quality Gates

Nothing ships without passing:
1. No `any` in TypeScript, no `console.log` in production
2. Functions ≤ 30 lines, files ≤ 300 lines, components ≤ 200 lines
3. Conventional commits (72-char subject)
4. Design tokens only — no hardcoded colors
5. Mobile-first + dark/light from day one
6. Lazy routes, virtualized lists, no N+1 queries
7. Bundle size < 250KB, no component duplication

---

## Version History

- **v1** (Mar 13): Foundation — CLAUDE.md + 10 skills + 3 agents + 5 hooks
- **v2**: Workflow enforcement, stack recommendation, library verification
- **v3**: First self-review — honest 7.2/10 rating
- **v4**: SQL practices, testing enforcement, CI/CD — 8.6/10
- **v5.0**: Path-based rules, E2E, accessibility, Mandalorian output style — 9.4/10
- **v5.2–5.4**: Zero defects, full Claude Code integration, 16 hooks, sandbox
- **v5.5–5.7**: Supabase, auto-update, bug fixes, gold standard audit
- **v5.9**: Agent teams — Breathing Loop, auto-spawn
- **v5.10–5.11**: Design DNA — 14 templates, SVG library, Ive audit
- **v5.12–5.14**: Self-assessment, agent wiring, autonomous pipeline
- **v5.15**: Showcase Phase 2 — 30+ components, CRM pipeline, Phoenix V3 P0
- **v5.16**: Auto-versioning, code-review plugin, responsive nav
- **v5.17**: Onboarding guide, worktree safety (isolation: none default)
- **v5.18**: Self-awareness, Kanban task chaining, Supabase RAG, CI/CD pipeline
- **v5.19**: Reliability — 47 tests, statusline v3, tech writer sharpened
- **v5.20**: Production readiness — 16 hooks, Oscar animations, E2E suite
- **v5.21**: Quality gates — design principles, Prettier, icon strategy, safe processes

---

## The Mascot

Grogu — the foundling — watches over every session.

```
⠀⢀⣠⣄⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣴⣶⡾⠿⠿⠿⠿⢷⣶⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢰⣿⡟⠛⠛⠛⠻⠿⠿⢿⣶⣶⣦⣤⣤⣀⣀⡀⣀⣴⣾⡿⠟⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠻⢿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⡀
⠀⠻⣿⣦⡀⠀⠉⠓⠶⢦⣄⣀⠉⠉⠛⠛⠻⠿⠟⠋⠁⠀⠀⠀⣤⡀⠀⠀⢠⠀⠀⠀⣠⠀⠀⠀⠀⠈⠙⠻⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠟⠛⠛⢻⣿
⠀⠀⠈⠻⣿⣦⠀⠀⠀⠀⠈⠙⠻⢷⣶⣤⡀⠀⠀⠀⠀⢀⣀⡀⠀⠙⢷⡀⠸⡇⠀⣰⠇⠀⢀⣀⣀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣤⣶⡶⠶⠶⠒⠂⠀⠀⣠⣾⠟
⠀⠀⠀⠀⠈⢿⣷⡀⠀⠀⠀⠀⠀⠀⠈⢻⣿⡄⣠⣴⣿⣯⣭⣽⣷⣆⠀⠁⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣦⡀⠀⣠⣾⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⣠⣾⡟⠁⠀
⠀⠀⠀⠀⠀⠈⢻⣷⣄⠀⠀⠀⠀⠀⠀⠀⣿⡗⢻⣿⣧⣽⣿⣿⣿⣧⠀⠀⣀⣀⠀⢠⣿⣧⣼⣿⣿⣿⣿⠗⠰⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⡿⠋⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⢿⣶⣄⡀⠀⠀⠀⠀⠸⠃⠈⠻⣿⣿⣿⣿⣿⡿⠃⠾⣥⡬⠗⠸⣿⣿⣿⣿⣿⡿⠛⠀⢀⡟⠀⠀⠀⠀⠀⠀⣀⣠⣾⡿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⣷⣶⣤⣤⣄⣰⣄⠀⠀⠉⠉⠉⠁⠀⢀⣀⣠⣄⣀⡀⠀⠉⠉⠉⠀⠀⢀⣠⣾⣥⣤⣤⣤⣶⣶⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⢻⣿⠛⢿⣷⣦⣤⣴⣶⣶⣦⣤⣤⣤⣤⣬⣥⡴⠶⠾⠿⠿⠿⠿⠛⢛⣿⣿⣿⣯⡉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣧⡀⠈⠉⠀⠈⠁⣾⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⠟⠉⣹⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠟⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
```

"Patu!" — appears at session start, pre-commit success, Fridays, and his birthday (March 13).

## The Creed

_I am APEX. Building is my purpose. Quality is my armor. The user experience is my beskar. I shall protect the codebase as I protect the foundling. I shall not ship untested code. I shall not skip the PRD. I shall not break the build._

**This is the way.**

— Lucas Bueno & Claude, São Paulo, March 2026
TAIL_EOF

# Atomically replace the skill file
mv "$SKILL_TMP" "$SKILL_FILE"
trap - EXIT

# ── Patch hardcoded counts in docs (prevents drift) ──
README="$PROJECT_DIR/README.md"
if [ -f "$README" ]; then
  _sed_i "s/The Championship Roster ([0-9]* agents[^)]*)/The Championship Roster (${AGENT_COUNT} agents + Lead)/" "$README" 2>/dev/null || true
fi

INSTALL_GUIDE="$PROJECT_DIR/docs/guides/install-guide-en-us.md"
if [ -f "$INSTALL_GUIDE" ]; then
  _sed_i "s/Copies all [0-9]* skills, [0-9]* agents, [0-9]* hook scripts, [0-9]* rules/Copies all ${SKILL_COUNT} skills, ${AGENT_COUNT} agents, ${SCRIPT_COUNT} hook scripts, ${RULE_COUNT} rules/" "$INSTALL_GUIDE" 2>/dev/null || true
fi

TEAMS_SKILL="$PROJECT_DIR/.claude/skills/teams/SKILL.md"
if [ -f "$TEAMS_SKILL" ]; then
  _sed_i "s/All [0-9]* agents (championship roster)/All ${AGENT_COUNT} agents (championship roster)/" "$TEAMS_SKILL" 2>/dev/null || true
fi

exit 0
