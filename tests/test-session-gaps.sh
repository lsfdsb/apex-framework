#!/bin/bash
# test-session-gaps.sh — APEX Framework Session Gap Validation
# Simulates building an app from the ground up and validates that
# every gap identified in the Phoenix Renewals CRM post-mortem is fixed.
#
# Tests the framework's INSTRUCTIONS (skills, agents, rules, CLAUDE.md)
# to ensure they contain the required checks, gates, and enforcement.
#
# Usage: bash tests/test-session-gaps.sh
# Exit 0 = all tests pass. Exit 1 = failures found.
#
# by L.B. & Claude · São Paulo, 2026

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS="$SCRIPT_DIR/.claude/skills"
AGENTS="$SCRIPT_DIR/.claude/agents"
RULES="$SCRIPT_DIR/.claude/rules"
CLAUDE_MD="$SCRIPT_DIR/CLAUDE.md"
PASS=0
FAIL=0
TOTAL=0

# ── Source color library ──
if [ -f "$SCRIPT_DIR/.claude/scripts/apex-colors.sh" ]; then
  FORCE_COLOR=1 source "$SCRIPT_DIR/.claude/scripts/apex-colors.sh"
fi

# ── Test helpers ──
assert_true() {
  local test_name="$1"
  local condition="$2"
  TOTAL=$((TOTAL + 1))
  if eval "$condition"; then
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${OK}✓${RST} %s\n" "$test_name"
    else
      echo "    ✅ $test_name"
    fi
    PASS=$((PASS + 1))
  else
    if [ "$APEX_COLORS" = true ]; then
      printf "    ${ERR}✗${RST} %s\n" "$test_name"
    else
      echo "    ❌ $test_name"
    fi
    FAIL=$((FAIL + 1))
  fi
}

assert_file_contains() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  assert_true "$label" "grep -qEi '$pattern' '$file' 2>/dev/null"
}

section() {
  local title="$1"
  if [ "$APEX_COLORS" = true ]; then
    echo ""
    printf "  ${GOLD_BOLD}━━━ %s ━━━${RST}\n" "$title"
    echo ""
  else
    echo ""
    echo "  ━━━ $title ━━━"
    echo ""
  fi
}

# ══════════════════════════════════════════════════
# HEADER
# ══════════════════════════════════════════════════
echo ""
if [ "$APEX_COLORS" = true ]; then
  printf "  ${GOLD_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
  printf "  ${GOLD_BOLD}║${RST}   ${EMBER}⚔️  Session Gap Validation Suite${RST}          ${GOLD_BOLD}║${RST}\n"
  printf "  ${GOLD_BOLD}║${RST}   ${STEEL}Phoenix Renewals CRM Post-Mortem${RST}         ${GOLD_BOLD}║${RST}\n"
  printf "  ${GOLD_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
else
  echo "  ╔══════════════════════════════════════════════╗"
  echo "  ║   ⚔️  Session Gap Validation Suite            ║"
  echo "  ║   Phoenix Renewals CRM Post-Mortem           ║"
  echo "  ╚══════════════════════════════════════════════╝"
fi

# ══════════════════════════════════════════════════
# GAP 1: BRANDING SWEEP
# The framework had no check for template branding cleanup.
# Fix: Added branding checks to builder agent, QA agent, design-reviewer, CLAUDE.md
# ══════════════════════════════════════════════════
section "Gap 1: Branding Sweep"

assert_file_contains "$CLAUDE_MD" \
  "branding sweep|template branding" \
  "CLAUDE.md has branding sweep rule"

assert_file_contains "$AGENTS/builder.md" \
  "branding|template.*brand|ACME|Doppel" \
  "Builder agent checks for template branding"

assert_file_contains "$AGENTS/qa.md" \
  "branding|ACME|Doppel|My App" \
  "QA agent scans for template branding"

assert_file_contains "$AGENTS/design-reviewer.md" \
  "branding|template.*brand|ACME|Doppel" \
  "Design reviewer checks branding compliance"

assert_file_contains "$AGENTS/builder.md" \
  "sidebar.*title|page.*title|meta.*tag|logo|footer" \
  "Builder checks common branding locations"

# ══════════════════════════════════════════════════
# GAP 2: DESIGN SYSTEM COMPLIANCE
# Components used random colors instead of design tokens.
# Fix: Added design token enforcement to builder, QA, design-reviewer, components rule
# ══════════════════════════════════════════════════
section "Gap 2: Design System Compliance"

assert_file_contains "$CLAUDE_MD" \
  "design tokens|hardcode.*Tailwind|palette colors" \
  "CLAUDE.md has design token rule"

assert_file_contains "$AGENTS/builder.md" \
  "design token|hardcoded.*Tailwind|blue-500|purple-500" \
  "Builder agent enforces design tokens"

assert_file_contains "$AGENTS/builder.md" \
  "bg-primary|text-accent|border-muted|semantic" \
  "Builder shows correct token examples"

assert_file_contains "$AGENTS/qa.md" \
  "design token|hardcoded.*Tailwind|palette color" \
  "QA agent scans for hardcoded colors"

assert_file_contains "$AGENTS/qa.md" \
  "grep.*bg|text|border.*red|blue|green|purple" \
  "QA has grep command for color violations"

assert_file_contains "$AGENTS/design-reviewer.md" \
  "design token|hardcoded.*Tailwind|palette color" \
  "Design reviewer checks token compliance"

assert_file_contains "$RULES/components.md" \
  "design token|hardcoded.*Tailwind|semantic token" \
  "Components rule requires design tokens"

# ══════════════════════════════════════════════════
# GAP 3: ARCHITECTURE CONFUSION (PERSONA→PAGE)
# Mixed management and operational views on same page.
# Fix: Added persona→page mapping to architecture skill and PRD
# ══════════════════════════════════════════════════
section "Gap 3: Persona → Page Mapping"

assert_file_contains "$SKILLS/architecture/SKILL.md" \
  "persona.*page|page.*persona" \
  "Architecture skill has persona→page mapping"

assert_file_contains "$SKILLS/architecture/SKILL.md" \
  "management.*view|operational.*view|dashboard.*NOT.*workspace" \
  "Architecture warns against mixing view types"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "persona.*page|page.*persona" \
  "PRD skill has persona→page mapping table"

assert_file_contains "$CLAUDE_MD" \
  "persona.*page|page.*persona" \
  "CLAUDE.md has persona→page alignment rule"

assert_file_contains "$AGENTS/design-reviewer.md" \
  "persona.*alignment|persona.*page|architecture.*persona" \
  "Design reviewer checks persona alignment"

# ══════════════════════════════════════════════════
# GAP 4: WORKTREE RELIABILITY
# Builder agents in worktrees reported success but files weren't persisted.
# Fix: Added post-builder file verification to builder agent and teams skill
# ══════════════════════════════════════════════════
section "Gap 4: Worktree File Verification"

assert_file_contains "$AGENTS/builder.md" \
  "worktree.*verif|verify.*file|file.*persist|file.*exist" \
  "Builder agent has worktree verification step"

assert_file_contains "$AGENTS/builder.md" \
  "list all files|report file path|completion message" \
  "Builder reports all created/modified files"

assert_file_contains "$SKILLS/teams/SKILL.md" \
  "post.*builder.*verif|verify.*file.*exist|worktree.*file.*loss" \
  "Teams skill has post-builder verification"

assert_file_contains "$CLAUDE_MD" \
  "verify worktree|worktree.*cleanup|worktree.*output" \
  "CLAUDE.md has worktree verification rule"

# ══════════════════════════════════════════════════
# GAP 5: AGENT TEAM ORCHESTRATION
# Teams were never properly orchestrated despite 25+ file task.
# Fix: Strengthened auto-spawn rules and enforcement section in CLAUDE.md
# ══════════════════════════════════════════════════
section "Gap 5: Team Orchestration Enforcement"

assert_file_contains "$CLAUDE_MD" \
  "enforcement|what failed|past sessions" \
  "CLAUDE.md has enforcement section from past failures"

assert_file_contains "$CLAUDE_MD" \
  "team orchestration.*NOT optional|MUST use.*teams" \
  "CLAUDE.md explicitly says teams are NOT optional for multi-file work"

assert_file_contains "$CLAUDE_MD" \
  "5\+ files|multi-file" \
  "CLAUDE.md specifies file count threshold for mandatory teams"

assert_file_contains "$CLAUDE_MD" \
  "ad.hoc.*builder|without.*watcher.*QA" \
  "CLAUDE.md warns against ad-hoc builders without Watcher/QA"

# ══════════════════════════════════════════════════
# GAP 6: QA NEVER AUTO-INVOKED
# QA was never run after any implementation phase.
# Fix: Made QA a gate in CLAUDE.md, added to breathing loop
# ══════════════════════════════════════════════════
section "Gap 6: QA Gate Enforcement"

assert_file_contains "$CLAUDE_MD" \
  "QA.*gate|QA.*GATE|QA.*not optional|QA is a GATE" \
  "CLAUDE.md declares QA as a gate, not optional"

assert_file_contains "$SKILLS/teams/SKILL.md" \
  "QA is a gate|QA.*not optional|no task.*complete.*without QA" \
  "Teams skill enforces QA as gate"

assert_file_contains "$CLAUDE_MD" \
  "QA must run|QA.*after.*build|QA verif" \
  "CLAUDE.md requires QA after every build phase"

# ══════════════════════════════════════════════════
# GAP 7: DESIGN REVIEWER AUTO-INVOCATION
# Design reviewer was never invoked despite building UI.
# Fix: Added Design Reviewer to build preset
# ══════════════════════════════════════════════════
section "Gap 7: Design Reviewer in Build Preset"

assert_file_contains "$SKILLS/teams/SKILL.md" \
  "Design Reviewer.*sonnet.*plan.*Reviews UI|build.*Implementation.*Team" \
  "Teams skill includes Design Reviewer in build preset"

assert_file_contains "$CLAUDE_MD" \
  "build.*design reviewer|Design Reviewer.*auto-included" \
  "CLAUDE.md build preset includes Design Reviewer"

assert_file_contains "$CLAUDE_MD" \
  "\.tsx.*design reviewer|design reviewer.*\.tsx" \
  "Design reviewer auto-triggers on .tsx file creation"

assert_file_contains "$SKILLS/teams/SKILL.md" \
  "design review.*UI|\.tsx.*design review" \
  "Teams rules require design review for UI tasks"

# ══════════════════════════════════════════════════
# GAP 8: PRD MISSES CX/HELPDESK REQUIREMENTS
# PRD didn't extract helpdesk requirements from call transcript.
# Fix: Added communication channel extraction to PRD skill
# ══════════════════════════════════════════════════
section "Gap 8: PRD CX/Communication Extraction"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "communication channel|call center|helpdesk|WhatsApp" \
  "PRD skill extracts communication channels"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "régua|outbound|inbound|messaging.*module" \
  "PRD skill recognizes CX terminology"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "CX.intensive|don.*wait.*user.*ask" \
  "PRD proactively extracts CX requirements"

# ══════════════════════════════════════════════════
# GAP 9: MOCK DATA IGNORES REAL BUSINESS METRICS
# Mock used random products/prices instead of user-provided data.
# Fix: Added mock data validation step to PRD skill
# ══════════════════════════════════════════════════
section "Gap 9: Mock Data Validation"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "mock data.*valid|real business data|mock.*reflect" \
  "PRD skill validates mock data against real business data"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "generic.*mock|random.*name|placeholder.*data|red flag" \
  "PRD skill flags generic placeholder data"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "mock-data-reference|real.*value.*mock" \
  "PRD creates mock data reference doc"

# ══════════════════════════════════════════════════
# GAP 10: /RESEARCH NOT TRIGGERED FOR INTEGRATIONS
# External APIs mentioned but /research never invoked.
# Fix: Added research triggers to PRD skill and CLAUDE.md
# ══════════════════════════════════════════════════
section "Gap 10: Research Auto-Trigger"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "external integration|API.*research|research.*before.*implementation" \
  "PRD skill identifies integration research needs"

assert_file_contains "$SKILLS/prd/SKILL.md" \
  "integration requirement|Twilio|Resend|research.*checklist" \
  "PRD outputs research checklist for integrations"

assert_file_contains "$CLAUDE_MD" \
  "research.*MANDATORY|research.*before.*builder" \
  "CLAUDE.md makes research mandatory before integration code"

assert_file_contains "$SKILLS/architecture/SKILL.md" \
  "research.*run|research.*API doc|integration.*architecture" \
  "Architecture skill requires research for integrations"

# ══════════════════════════════════════════════════
# BONUS: CROSS-CUTTING CONCERNS
# ══════════════════════════════════════════════════
section "Bonus: Cross-Cutting Validation"

# Verify QA agent has the new checklist items
assert_file_contains "$AGENTS/qa.md" \
  "Design tokens only.*NO hardcoded|design token.*hardcoded" \
  "QA checklist includes design token check"

assert_file_contains "$AGENTS/qa.md" \
  "No template branding.*grep.*ACME|branding.*ACME.*Doppel" \
  "QA checklist includes branding check"

assert_file_contains "$AGENTS/qa.md" \
  "Persona.*page alignment|persona.*architecture doc" \
  "QA checklist includes persona alignment"

# Verify builder has all three new checklist items
assert_file_contains "$AGENTS/builder.md" \
  "design token|hardcoded Tailwind" \
  "Builder pre-completion has design token check"

assert_file_contains "$AGENTS/builder.md" \
  "template branding|ACME.*Doppel|boilerplate" \
  "Builder pre-completion has branding check"

assert_file_contains "$AGENTS/builder.md" \
  "persona.*page.*alignment|architecture doc" \
  "Builder pre-completion has persona alignment check"

# ══════════════════════════════════════════════════
# RESULTS
# ══════════════════════════════════════════════════
echo ""
if [ "$APEX_COLORS" = true ]; then
  printf "  ${STEEL}══════════════════════════════════════════════${RST}\n"
else
  echo "  ══════════════════════════════════════════════"
fi
echo ""

if [ $FAIL -eq 0 ]; then
  if [ "$APEX_COLORS" = true ]; then
    printf "  ${OK_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
    printf "  ${OK_BOLD}║${RST}  Results: ${OK_BOLD}$PASS passed${RST} · ${STEEL}$FAIL failed${RST}              ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}║${RST}  Total: $TOTAL tests                            ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}║${RST}                                              ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}║${RST}  ${OK_BOLD}⚔️  All gaps fixed. Phoenix rises again.${RST}    ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
  else
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║  Results: $PASS passed · $FAIL failed                ║"
    echo "  ║  Total: $TOTAL tests                              ║"
    echo "  ║                                              ║"
    echo "  ║  ⚔️  All gaps fixed. Phoenix rises again.      ║"
    echo "  ╚══════════════════════════════════════════════╝"
  fi
  exit 0
else
  if [ "$APEX_COLORS" = true ]; then
    printf "  ${ERR_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  Results: ${OK_BOLD}$PASS passed${RST} · ${ERR_BOLD}$FAIL failed${RST}              ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  Total: $TOTAL tests                            ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}║${RST}                                              ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  ${ERR_BOLD}🔴 Gaps remain. Fix before shipping.${RST}       ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
  else
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║  Results: $PASS passed · $FAIL failed                ║"
    echo "  ║  Total: $TOTAL tests                              ║"
    echo "  ║                                              ║"
    echo "  ║  🔴 Gaps remain. Fix before shipping.         ║"
    echo "  ╚══════════════════════════════════════════════╝"
  fi
  exit 1
fi
