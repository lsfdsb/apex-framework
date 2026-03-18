#!/bin/bash
# test-integration.sh — APEX Framework Integration Proof
# Verifies every wire, connection, and setting is correctly configured.
# Unlike test-framework.sh (structural) and test-hooks.sh (behavioral),
# this tests the CONNECTIONS between components.
#
# Usage: bash tests/test-integration.sh
#
# by L.B. & Claude · São Paulo, 2026

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR"

PASS=0; FAIL=0; WARN=0

# ── Colors ──
if [ -t 1 ] && command -v tput &>/dev/null; then
  OK="\033[38;5;78m"; ERR="\033[38;5;196m"; WRN="\033[38;5;220m"; RST="\033[0m"; BOLD="\033[1m"
else
  OK=""; ERR=""; WRN=""; RST=""; BOLD=""
fi

ok()   { PASS=$((PASS+1)); printf "    ${OK}✓${RST} %s\n" "$1"; }
fail() { FAIL=$((FAIL+1)); printf "    ${ERR}✗${RST} %s\n" "$1"; }
warn() { WARN=$((WARN+1)); printf "    ${WRN}⚠${RST} %s\n" "$1"; }
section() { printf "\n  ${BOLD}${WRN}━━━ %s ━━━${RST}\n\n" "$1"; }

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║  ⚔️  APEX Integration Proof                   ║"
echo "  ║  Every wire, every connection verified        ║"
echo "  ╚══════════════════════════════════════════════╝"

# ═══════════════════════════════════════════════════
section "1. Settings.json Validation"

if command -v jq &>/dev/null; then
  jq empty .claude/settings.json 2>/dev/null && ok "settings.json is valid JSON" || fail "settings.json is INVALID JSON"
else
  warn "jq not installed — skipping JSON validation"
fi

# ═══════════════════════════════════════════════════
section "2. Hook → Script Wiring"

if command -v jq &>/dev/null; then
  jq -r '.. | .command? // empty' .claude/settings.json 2>/dev/null | grep -v '^echo' | sed 's|\$CLAUDE_PROJECT_DIR|.|g' | while IFS= read -r script_cmd; do
    script_path=$(echo "$script_cmd" | awk '{print $1}')
    if [ -f "$script_path" ]; then
      if [ -x "$script_path" ]; then
        ok "$(basename "$script_path") — exists + executable"
      else
        fail "$(basename "$script_path") — NOT executable"
      fi
    else
      fail "$script_path — MISSING"
    fi
  done

  # Inline hooks output valid JSON
  jq -r '.. | .command? // empty' .claude/settings.json 2>/dev/null | grep '^echo' | while IFS= read -r cmd; do
    OUTPUT=$(eval "$cmd" 2>/dev/null)
    if echo "$OUTPUT" | jq empty 2>/dev/null; then
      LABEL=$(echo "$OUTPUT" | jq -r 'keys[0]' 2>/dev/null)
      ok "Inline hook → valid JSON ($LABEL)"
    else
      fail "Inline hook → INVALID JSON"
    fi
  done
fi

# ═══════════════════════════════════════════════════
section "3. Hook Events vs Official Docs"

VALID_EVENTS="PreToolUse PostToolUse PostToolUseFailure UserPromptSubmit SessionStart SessionEnd Stop StopFailure SubagentStart SubagentStop PreCompact PostCompact PermissionRequest Notification TeammateIdle TaskCompleted ConfigChange WorktreeCreate WorktreeRemove InstructionsLoaded Setup Elicitation ElicitationResult"

if command -v jq &>/dev/null; then
  jq -r '.hooks | keys[]' .claude/settings.json 2>/dev/null | while IFS= read -r event; do
    if echo "$VALID_EVENTS" | grep -qw "$event"; then
      ok "Event '$event' is valid"
    else
      fail "Event '$event' NOT in official docs"
    fi
  done
fi

# ═══════════════════════════════════════════════════
section "4. Agent Frontmatter Validation"

VALID_MODELS="sonnet opus haiku inherit"
VALID_PERMS="default acceptEdits dontAsk bypassPermissions plan"
VALID_MEMORY="user project local"

for agent in .claude/agents/*.md; do
  NAME=$(basename "$agent" .md)

  grep -q '^name:' "$agent" && ok "$NAME: name field" || fail "$NAME: MISSING name"
  grep -q '^description:' "$agent" && ok "$NAME: description field" || fail "$NAME: MISSING description"

  MODEL=$(grep '^model:' "$agent" 2>/dev/null | awk '{print $2}')
  [ -n "$MODEL" ] && echo "$VALID_MODELS" | grep -qw "$MODEL" && ok "$NAME: model '$MODEL'" || { [ -z "$MODEL" ] && ok "$NAME: model inherits"; }

  PERM=$(grep '^permissionMode:' "$agent" 2>/dev/null | awk '{print $2}')
  [ -n "$PERM" ] && echo "$VALID_PERMS" | grep -qw "$PERM" && ok "$NAME: permissionMode '$PERM'" || { [ -z "$PERM" ] && ok "$NAME: permissionMode defaults"; }

  MEM=$(grep '^memory:' "$agent" 2>/dev/null | awk '{print $2}')
  [ -n "$MEM" ] && echo "$VALID_MEMORY" | grep -qw "$MEM" && ok "$NAME: memory '$MEM'" || { [ -z "$MEM" ] && ok "$NAME: no memory scope"; }
done

# ═══════════════════════════════════════════════════
section "5. Agent Skills → Skill Dirs Exist"

for agent in .claude/agents/*.md; do
  NAME=$(basename "$agent" .md)
  SKILLS_LINE=$(grep '^skills:' "$agent" 2>/dev/null | sed 's/^skills: *//')
  [ -z "$SKILLS_LINE" ] && continue
  for skill in $(echo "$SKILLS_LINE" | tr ',' ' '); do
    skill=$(echo "$skill" | tr -d ' ')
    [ -z "$skill" ] && continue
    [ -d ".claude/skills/$skill" ] && ok "$NAME → skill '$skill' exists" || fail "$NAME → skill '$skill' MISSING"
  done
done

# ═══════════════════════════════════════════════════
section "6. Team-Awareness (all 8 team agents)"

TEAM_AGENTS=("watcher" "builder" "debugger" "qa" "code-reviewer" "design-reviewer" "technical-writer" "researcher")
for agent in "${TEAM_AGENTS[@]}"; do
  FILE=".claude/agents/${agent}.md"
  grep -q 'SendMessage' "$FILE" 2>/dev/null && ok "$agent: SendMessage ✓" || fail "$agent: NO SendMessage"
  grep -qE 'TaskCreate|TaskUpdate|TaskList' "$FILE" 2>/dev/null && ok "$agent: Task tools ✓" || fail "$agent: NO Task tools"
done

# ═══════════════════════════════════════════════════
section "7. Statusline Output"

STATUSLINE_OUTPUT=$(echo '{"model":{"display_name":"Opus","id":"claude-opus-4-6[1m]"},"context_window":{"used_percentage":10,"context_window_size":200000,"total_input_tokens":50000,"total_output_tokens":20000},"cost":{"total_cost_usd":1.00,"total_lines_added":100,"total_lines_removed":10,"total_duration_ms":600000}}' | bash .claude/scripts/apex-statusline.sh 2>/dev/null)

[ -n "$STATUSLINE_OUTPUT" ] && ok "Statusline produces output" || fail "Statusline NO output"
echo "$STATUSLINE_OUTPUT" | grep -q "APEX" && ok "Has APEX branding" || fail "No APEX branding"
echo "$STATUSLINE_OUTPUT" | grep -q "This is the way" && ok "Has creed" || fail "No creed"
echo "$STATUSLINE_OUTPUT" | grep -qE '[0-9]+\.[0-9]+[KM]' && ok "Locale fix working (dots not commas)" || warn "Could not verify locale"

# ═══════════════════════════════════════════════════
section "8. Environment & Config"

if command -v jq &>/dev/null; then
  jq -e '.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS == "1"' .claude/settings.json >/dev/null 2>&1 && ok "Agent Teams ENABLED" || fail "Agent Teams NOT enabled"
  jq -e '.statusLine.command' .claude/settings.json >/dev/null 2>&1 && ok "Custom statusLine configured" || fail "No statusLine"
  jq -e '.outputStyle == "APEX Educational"' .claude/settings.json >/dev/null 2>&1 && ok "Output style correct" || fail "Wrong output style"
fi

# ═══════════════════════════════════════════════════
section "9. Install Path"

[ -f "install.sh" ] && [ -x "install.sh" ] && ok "install.sh ready" || fail "install.sh missing/not executable"
[ -f "apex-init-project.sh" ] && [ -x "apex-init-project.sh" ] && ok "apex-init-project.sh ready" || fail "apex-init-project.sh missing"
AGENT_COUNT=$(ls .claude/agents/*.md 2>/dev/null | wc -l | tr -d ' ')
SKILL_COUNT=$(ls -d .claude/skills/*/ 2>/dev/null | wc -l | tr -d ' ')
ok "Will install $AGENT_COUNT agents + $SKILL_COUNT skills"

# ═══════════════════════════════════════════════════
echo ""
echo "  ══════════════════════════════════════════════"
if [ "$FAIL" -eq 0 ]; then
  printf "  ${BOLD}${OK}✅ %d passed${RST} · ${WRN}%d warnings${RST}\n" "$PASS" "$WARN"
  echo ""
  echo "  ⚔️  INTEGRATION PROOF: ALL WIRES CONNECTED"
else
  printf "  ${OK}%d passed${RST} · ${ERR}%d failed${RST} · ${WRN}%d warnings${RST}\n" "$PASS" "$FAIL" "$WARN"
  echo ""
  echo "  ⚠️  FIX $FAIL issues before shipping."
fi
echo ""
