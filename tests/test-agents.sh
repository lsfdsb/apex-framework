#!/bin/bash
# test-agents.sh — Golden Script: Validate all APEX agent configurations
# Ensures every agent is properly wired, tools don't conflict,
# skills exist, and models are valid.
#
# by L.B. & Claude · São Paulo, 2026

set -u

AGENTS_DIR=".claude/agents"
SKILLS_DIR=".claude/skills"
PASS=0
FAIL=0
TOTAL=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

pass() { TOTAL=$((TOTAL + 1)); PASS=$((PASS + 1)); echo -e "  ${GREEN}✅ PASS${NC}: $1"; }
fail() { TOTAL=$((TOTAL + 1)); FAIL=$((FAIL + 1)); echo -e "  ${RED}❌ FAIL${NC}: $1"; }
warn() { echo -e "  ${YELLOW}⚠️  WARN${NC}: $1"; }

echo "🤖 APEX Agent Golden Script"
echo "======================================"
echo ""

# ── Check agents directory exists ──
if [ ! -d "$AGENTS_DIR" ]; then
  fail "Agents directory $AGENTS_DIR not found"
  exit 1
fi

AGENT_FILES=$(find "$AGENTS_DIR" -maxdepth 1 -name "*.md" -type f | sort)
AGENT_COUNT=$(echo "$AGENT_FILES" | wc -l | tr -d ' ')

echo "📋 Found $AGENT_COUNT agent definitions"
echo ""

VALID_MODELS="sonnet|opus|haiku"
VALID_PERMISSIONS="default|acceptEdits|dontAsk|bypassPermissions|plan|auto"
VALID_TOOLS="Read|Glob|Grep|Bash|Edit|Write|MultiEdit|WebFetch|WebSearch|TaskCreate|TaskUpdate|TaskList|TaskGet|TaskStop|TaskOutput|SendMessage|Agent|NotebookEdit|EnterPlanMode|ExitPlanMode|EnterWorktree|ExitWorktree|TeamCreate|TeamDelete|CronCreate|CronDelete|CronList"

# ── Per-agent validation ──
for agent_file in $AGENT_FILES; do
  AGENT_NAME=$(basename "$agent_file" .md)
  echo "🔍 $AGENT_NAME"

  # 1. File exists and is readable
  if [ -r "$agent_file" ]; then
    pass "$AGENT_NAME.md exists and is readable"
  else
    fail "$AGENT_NAME.md is not readable"
    continue
  fi

  # 2. Has YAML frontmatter
  if head -1 "$agent_file" | grep -q '^---'; then
    pass "$AGENT_NAME has YAML frontmatter"
  else
    fail "$AGENT_NAME missing YAML frontmatter"
    continue
  fi

  # Extract frontmatter (between first and second ---)
  FRONTMATTER=$(sed -n '2,/^---$/p' "$agent_file" | sed '$d')

  # 3. Has required fields: name, description
  if echo "$FRONTMATTER" | grep -q '^name:'; then
    pass "$AGENT_NAME has name field"
  else
    fail "$AGENT_NAME missing required name field"
  fi

  if echo "$FRONTMATTER" | grep -q '^description:'; then
    pass "$AGENT_NAME has description field"
  else
    fail "$AGENT_NAME missing required description field"
  fi

  # 4. Has tools field
  TOOLS_LINE=$(echo "$FRONTMATTER" | grep '^tools:' | sed 's/^tools: *//')
  if [ -n "$TOOLS_LINE" ]; then
    pass "$AGENT_NAME has tools configured"
  else
    fail "$AGENT_NAME missing tools field"
  fi

  # 5. Model is valid
  MODEL=$(echo "$FRONTMATTER" | grep '^model:' | sed 's/^model: *//')
  if [ -n "$MODEL" ]; then
    if echo "$MODEL" | grep -qE "^($VALID_MODELS)$"; then
      pass "$AGENT_NAME model '$MODEL' is valid"
    else
      fail "$AGENT_NAME model '$MODEL' is not recognized (expected: sonnet, opus, or haiku)"
    fi
  else
    warn "$AGENT_NAME has no model field (will inherit from parent)"
  fi

  # 6. Permission mode is valid
  PERM=$(echo "$FRONTMATTER" | grep '^permissionMode:' | sed 's/^permissionMode: *//')
  if [ -n "$PERM" ]; then
    if echo "$PERM" | grep -qE "^($VALID_PERMISSIONS)$"; then
      pass "$AGENT_NAME permissionMode '$PERM' is valid"
    else
      fail "$AGENT_NAME permissionMode '$PERM' is not recognized"
    fi
  fi

  # 7. No tool conflicts (tool in both tools and disallowedTools)
  DISALLOWED=$(echo "$FRONTMATTER" | grep '^disallowedTools:' | sed 's/^disallowedTools: *//')
  if [ -n "$DISALLOWED" ] && [ -n "$TOOLS_LINE" ]; then
    CONFLICT_FOUND=false
    for dt in $(echo "$DISALLOWED" | tr ',' ' '); do
      dt=$(echo "$dt" | tr -d ' ')
      [ -z "$dt" ] && continue
      if echo ",$TOOLS_LINE," | grep -q ",$dt,\|, $dt,\| $dt,"; then
        fail "$AGENT_NAME has '$dt' in BOTH tools and disallowedTools"
        CONFLICT_FOUND=true
      fi
    done
    if [ "$CONFLICT_FOUND" = false ]; then
      pass "$AGENT_NAME has no tool conflicts"
    fi
  fi

  # 8. Skills exist
  SKILLS=$(echo "$FRONTMATTER" | grep '^skills:' | sed 's/^skills: *//')
  if [ -n "$SKILLS" ]; then
    IFS=',' read -ra SKILL_LIST <<< "$SKILLS"
    ALL_SKILLS_EXIST=true
    for skill in "${SKILL_LIST[@]}"; do
      skill=$(echo "$skill" | tr -d ' ')
      if [ -d "$SKILLS_DIR/$skill" ]; then
        : # exists
      else
        fail "$AGENT_NAME references skill '$skill' which doesn't exist in $SKILLS_DIR/"
        ALL_SKILLS_EXIST=false
      fi
    done
    if [ "$ALL_SKILLS_EXIST" = true ]; then
      pass "$AGENT_NAME all skills exist (${#SKILL_LIST[@]} skills)"
    fi
  fi

  # 9. Isolation is valid
  ISOLATION=$(echo "$FRONTMATTER" | grep '^isolation:' | sed 's/^isolation: *//')
  if [ -n "$ISOLATION" ]; then
    if echo "$ISOLATION" | grep -qE '^(worktree|none)$'; then
      pass "$AGENT_NAME isolation '$ISOLATION' is valid"
    else
      fail "$AGENT_NAME isolation '$ISOLATION' is not recognized (expected: worktree or none)"
    fi
  fi

  # 10. Writers have Edit/Write tools
  if echo "$AGENT_NAME" | grep -qE 'builder|debugger|technical-writer'; then
    if echo "$TOOLS_LINE" | grep -q 'Edit' && echo "$TOOLS_LINE" | grep -q 'Write'; then
      pass "$AGENT_NAME (writer role) has Edit and Write tools"
    else
      fail "$AGENT_NAME (writer role) MISSING Edit/Write tools — cannot do its job"
    fi
  fi

  # 11. Read-only agents don't have Write tools
    if echo "$DISALLOWED" | grep -q 'Write' || ! echo "$TOOLS_LINE" | grep -q 'Write'; then
      pass "$AGENT_NAME (read-only role) correctly cannot write"
    else
      warn "$AGENT_NAME (read-only role) has Write tool — intentional?"
    fi
  fi

  # 12. Haiku agents have explicit instructions (> 50 lines)
  if [ "$MODEL" = "haiku" ]; then
    LINE_COUNT=$(wc -l < "$agent_file" | tr -d ' ')
    if [ "$LINE_COUNT" -ge 50 ]; then
      pass "$AGENT_NAME (haiku) has detailed instructions (${LINE_COUNT} lines)"
    else
      warn "$AGENT_NAME (haiku) has only ${LINE_COUNT} lines — haiku needs explicit instructions"
    fi
  fi

  # 13. Technical Writer has the CRITICAL edit assertion
  if [ "$AGENT_NAME" = "technical-writer" ]; then
    if grep -q "MUST Edit Files" "$agent_file"; then
      pass "$AGENT_NAME has CRITICAL 'MUST Edit Files' section"
    else
      fail "$AGENT_NAME MISSING 'MUST Edit Files' section — will hallucinate permission issues"
    fi
  fi

  echo ""
done

# ── Cross-agent checks ──
echo "🔗 Cross-Agent Validation"
echo ""

# 14. Check CLAUDE.md roster matches agent files
CLAUDE_MD="CLAUDE.md"
if [ -f "$CLAUDE_MD" ]; then
  for agent_file in $AGENT_FILES; do
    AGENT_NAME=$(basename "$agent_file" .md)
    if grep -q "$AGENT_NAME" "$CLAUDE_MD"; then
      pass "$AGENT_NAME referenced in CLAUDE.md roster"
    else
      fail "$AGENT_NAME NOT in CLAUDE.md roster — undocumented agent"
    fi
  done
else
  warn "CLAUDE.md not found — skipping roster check"
fi

# 15. Check no orphan agents in CLAUDE.md
for roster_agent in $ROSTER_AGENTS; do
  if [ -f "$AGENTS_DIR/${roster_agent}.md" ]; then
    : # exists
  else
    fail "CLAUDE.md references '$roster_agent' but $AGENTS_DIR/${roster_agent}.md doesn't exist"
  fi
done

echo ""

# ── Settings.json hook validation ──
echo "⚙️  Hook Wiring Validation"
echo ""

SETTINGS=".claude/settings.json"
if [ -f "$SETTINGS" ] && command -v jq &>/dev/null; then
  # Check all script references in hooks actually exist
  HOOK_SCRIPTS=$(jq -r '.. | .command? // empty' "$SETTINGS" 2>/dev/null | grep '\.sh' | sed 's|\$CLAUDE_PROJECT_DIR/||')
  for script in $HOOK_SCRIPTS; do
    if [ -f "$script" ]; then
      pass "Hook script $script exists"
    else
      fail "Hook references $script but file doesn't exist"
    fi
  done
else
  warn "settings.json or jq not available — skipping hook validation"
fi

echo ""
echo "======================================"
echo "Total: $TOTAL | ${GREEN}Pass: $PASS${NC} | ${RED}Fail: $FAIL${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}⚔️ Some checks failed. Fix issues above.${NC}"
  exit 1
else
  echo -e "${GREEN}⚔️ All agent checks passed. This is the way.${NC}"
  exit 0
fi
