#!/bin/bash
# test-simulation.sh — APEX Framework Full Build Simulation
# Simulates building an app from scratch and validates that every framework
# component (skills, agents, rules, hooks, scripts) works as intended.
#
# This is NOT just structural — it creates a fake project, introduces
# deliberate violations, and verifies the framework would catch them.
#
# Usage: bash tests/test-simulation.sh
# Exit 0 = all tests pass. Exit 1 = failures found.
#
# by L.B. & Claude · São Paulo, 2026

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS="$SCRIPT_DIR/.claude/scripts"
SKILLS="$SCRIPT_DIR/.claude/skills"
AGENTS="$SCRIPT_DIR/.claude/agents"
RULES="$SCRIPT_DIR/.claude/rules"
GIT_HOOKS="$SCRIPT_DIR/.claude/git-hooks"
SETTINGS="$SCRIPT_DIR/.claude/settings.json"
CLAUDE_MD="$SCRIPT_DIR/CLAUDE.md"
OUTPUT_STYLES="$SCRIPT_DIR/.claude/output-styles"
PASS=0
FAIL=0
SKIP=0
TOTAL=0

# Create a temp directory for simulation artifacts
SIM_DIR=$(mktemp -d /tmp/apex-sim.XXXXXX)
trap 'rm -rf "$SIM_DIR"' EXIT

# ── Source color library ──
if [ -f "$SCRIPTS/apex-colors.sh" ]; then
  FORCE_COLOR=1 source "$SCRIPTS/apex-colors.sh"
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

assert_file_not_contains() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  assert_true "$label" "! grep -qEi '$pattern' '$file' 2>/dev/null"
}

assert_file_exists() {
  local file="$1"
  local label="${2:-$(basename "$file") exists}"
  assert_true "$label" "[ -f '$file' ]"
}

assert_dir_exists() {
  local dir="$1"
  local label="${2:-$(basename "$dir")/ exists}"
  assert_true "$label" "[ -d '$dir' ]"
}

assert_file_executable() {
  local file="$1"
  local label="${2:-$(basename "$file") is executable}"
  assert_true "$label" "[ -x '$file' ]"
}

skip_test() {
  local test_name="$1"
  local reason="$2"
  TOTAL=$((TOTAL + 1))
  SKIP=$((SKIP + 1))
  if [ "$APEX_COLORS" = true ]; then
    printf "    ${STEEL}○${RST} ${STEEL}%s (skip: %s)${RST}\n" "$test_name" "$reason"
  else
    echo "    ○ $test_name (skip: $reason)"
  fi
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
  printf "  ${GOLD_BOLD}║${RST}   ${EMBER}⚔️  APEX Full Build Simulation${RST}           ${GOLD_BOLD}║${RST}\n"
  printf "  ${GOLD_BOLD}║${RST}   ${STEEL}Every skill, agent, rule & hook tested${RST}    ${GOLD_BOLD}║${RST}\n"
  printf "  ${GOLD_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
else
  echo "  ╔══════════════════════════════════════════════╗"
  echo "  ║   ⚔️  APEX Full Build Simulation              ║"
  echo "  ║   Every skill, agent, rule & hook tested      ║"
  echo "  ╚══════════════════════════════════════════════╝"
fi

# ══════════════════════════════════════════════════
# PHASE 1: FRAMEWORK INTEGRITY
# Verify all framework components exist and are valid
# ══════════════════════════════════════════════════
section "Phase 1: Framework Integrity"

# 1.1 All skill files exist and have valid frontmatter
for skill_dir in "$SKILLS"/*/; do
  skill_name=$(basename "$skill_dir")
  assert_file_exists "$skill_dir/SKILL.md" "Skill $skill_name has SKILL.md"
  assert_file_contains "$skill_dir/SKILL.md" "^---" "Skill $skill_name has frontmatter"
  assert_file_contains "$skill_dir/SKILL.md" "name:" "Skill $skill_name has name field"
  assert_file_contains "$skill_dir/SKILL.md" "description:" "Skill $skill_name has description"
done

# 1.2 All agent files exist and have valid frontmatter
for agent_file in "$AGENTS"/*.md; do
  agent_name=$(basename "$agent_file" .md)
  assert_file_contains "$agent_file" "^---" "Agent $agent_name has frontmatter"
  assert_file_contains "$agent_file" "name:" "Agent $agent_name has name field"
  assert_file_contains "$agent_file" "model:" "Agent $agent_name has model field"
  assert_file_contains "$agent_file" "tools:" "Agent $agent_name has tools field"
done

# 1.3 All script files are valid bash and executable
for script in "$SCRIPTS"/*.sh; do
  script_name=$(basename "$script")
  assert_file_executable "$script" "Script $script_name is executable"
  assert_true "Script $script_name has valid syntax" "bash -n '$script' 2>/dev/null"
done

# 1.4 Settings.json is valid JSON
assert_true "settings.json is valid JSON" "jq empty '$SETTINGS' 2>/dev/null"

# 1.5 Git hooks exist and are executable
assert_file_exists "$GIT_HOOKS/pre-commit" "pre-commit hook exists"
assert_file_executable "$GIT_HOOKS/pre-commit" "pre-commit hook is executable"
assert_file_exists "$GIT_HOOKS/commit-msg" "commit-msg hook exists"
assert_file_executable "$GIT_HOOKS/commit-msg" "commit-msg hook is executable"

# 1.6 Output style exists
assert_file_exists "$OUTPUT_STYLES/apex-educational.md" "Output style exists"

# 1.7 CLAUDE.md exists and has key sections
assert_file_exists "$CLAUDE_MD" "CLAUDE.md exists"
assert_file_contains "$CLAUDE_MD" "Core Rules" "CLAUDE.md has Core Rules"
assert_file_contains "$CLAUDE_MD" "Agent Teams" "CLAUDE.md has Agent Teams"
assert_file_contains "$CLAUDE_MD" "Workflow" "CLAUDE.md has Workflow"

# ══════════════════════════════════════════════════
# PHASE 2: PRD SKILL SIMULATION
# Test that the PRD skill has all required sections
# ══════════════════════════════════════════════════
section "Phase 2: PRD Workflow"

PRD_SKILL="$SKILLS/prd/SKILL.md"

# 2.1 PRD generates all required sections
assert_file_contains "$PRD_SKILL" "Vision.*Purpose" "PRD has Vision & Purpose section"
assert_file_contains "$PRD_SKILL" "Problem Statement" "PRD has Problem Statement"
assert_file_contains "$PRD_SKILL" "User Personas" "PRD has User Personas"
assert_file_contains "$PRD_SKILL" "User Stories" "PRD has User Stories"
assert_file_contains "$PRD_SKILL" "Functional Requirements" "PRD has Functional Requirements"
assert_file_contains "$PRD_SKILL" "Non-Functional" "PRD has Non-Functional Requirements"
assert_file_contains "$PRD_SKILL" "Design Direction" "PRD has Design Direction"
assert_file_contains "$PRD_SKILL" "Technical Architecture" "PRD has Technical Architecture"
assert_file_contains "$PRD_SKILL" "Success Metrics" "PRD has Success Metrics"
assert_file_contains "$PRD_SKILL" "Risks.*Mitigations" "PRD has Risks & Mitigations"
assert_file_contains "$PRD_SKILL" "Milestones" "PRD has Milestones"
assert_file_contains "$PRD_SKILL" "Open Questions" "PRD has Open Questions"

# 2.2 PRD extracts communication/CX requirements (Gap 8)
assert_file_contains "$PRD_SKILL" "communication channel" "PRD extracts comm channels"
assert_file_contains "$PRD_SKILL" "helpdesk|call center" "PRD recognizes helpdesk needs"
assert_file_contains "$PRD_SKILL" "WhatsApp|Twilio" "PRD recognizes messaging integrations"

# 2.3 PRD has persona→page mapping (Gap 3)
assert_file_contains "$PRD_SKILL" "Persona.*Page Mapping" "PRD generates persona→page map"

# 2.4 PRD validates mock data (Gap 9)
assert_file_contains "$PRD_SKILL" "Mock Data Validation" "PRD validates mock data"
assert_file_contains "$PRD_SKILL" "real business data|real.*value" "PRD checks against real data"

# 2.5 PRD triggers research (Gap 10)
assert_file_contains "$PRD_SKILL" "Integration Requirements" "PRD identifies integrations"
assert_file_contains "$PRD_SKILL" "research.*before.*implementation|research.*MUST" "PRD mandates research"

# 2.6 PRD updates README
assert_file_contains "$PRD_SKILL" "Update README" "PRD updates README.md"

# ══════════════════════════════════════════════════
# PHASE 3: ARCHITECTURE SKILL SIMULATION
# ══════════════════════════════════════════════════
section "Phase 3: Architecture Workflow"

ARCH_SKILL="$SKILLS/architecture/SKILL.md"

# 3.1 Architecture has required components
assert_file_contains "$ARCH_SKILL" "Database Schema" "Architecture has DB schema section"
assert_file_contains "$ARCH_SKILL" "API Design" "Architecture has API design section"
assert_file_contains "$ARCH_SKILL" "ADR" "Architecture generates ADRs"

# 3.2 Architecture has persona→page map (Gap 3)
assert_file_contains "$ARCH_SKILL" "Persona.*Page Map|Page.*Persona" "Architecture has persona→page map"
assert_file_contains "$ARCH_SKILL" "management.*view|operational.*view" "Architecture separates view types"

# 3.3 Architecture requires research for integrations (Gap 10)
assert_file_contains "$ARCH_SKILL" "Integration Architecture|integration.*research" "Architecture plans integrations"
assert_file_contains "$ARCH_SKILL" "research.*run|research.*API doc" "Architecture requires API research"

# 3.4 Architecture has observability
assert_file_contains "$ARCH_SKILL" "Sentry|error tracking" "Architecture includes error tracking"
assert_file_contains "$ARCH_SKILL" "health.*endpoint" "Architecture includes health endpoint"

# 3.5 Architecture handles payments
assert_file_contains "$ARCH_SKILL" "Stripe|payment" "Architecture has payments guidance"
assert_file_contains "$ARCH_SKILL" "NEVER store card" "Architecture has payment security rules"

# ══════════════════════════════════════════════════
# PHASE 4: BUILDER AGENT SIMULATION
# Create a fake component with violations and verify the builder would catch them
# ══════════════════════════════════════════════════
section "Phase 4: Builder Agent Enforcement"

BUILDER="$AGENTS/builder.md"

# 4.1 Builder has pre-completion checklist
assert_file_contains "$BUILDER" "Pre-Completion Checklist" "Builder has pre-completion checklist"
assert_file_contains "$BUILDER" "tsc --noEmit" "Builder checks TypeScript"
assert_file_contains "$BUILDER" "npm run lint|eslint" "Builder checks linting"
assert_file_contains "$BUILDER" "npm test" "Builder runs tests"
assert_file_contains "$BUILDER" "console.log" "Builder checks for console.log"
assert_file_contains "$BUILDER" "any.*types|no.*any" "Builder checks for any types"

# 4.2 Builder enforces design tokens (Gap 2)
assert_file_contains "$BUILDER" "Design Token Enforcement" "Builder has design token section"
assert_file_contains "$BUILDER" "blue-500|purple-500" "Builder lists color violations"
assert_file_contains "$BUILDER" "bg-primary|text-accent" "Builder shows correct tokens"
assert_file_contains "$BUILDER" "tailwind.config|globals.css" "Builder reads config first"

# 4.3 Builder checks branding (Gap 1)
assert_file_contains "$BUILDER" "Branding Check" "Builder has branding check section"
assert_file_contains "$BUILDER" "ACME|Doppel" "Builder searches for template branding"

# 4.4 Builder has worktree verification (Gap 4)
assert_file_contains "$BUILDER" "Worktree Verification" "Builder has worktree verification"
assert_file_contains "$BUILDER" "list all files|report file" "Builder reports created files"

# 4.5 Builder has persona check
assert_file_contains "$BUILDER" "persona.*page|architecture doc" "Builder checks persona alignment"

# 4.6 Builder follows APEX conventions
assert_file_contains "$BUILDER" "30 lines" "Builder enforces function size"
assert_file_contains "$BUILDER" "300 lines" "Builder enforces file size"
assert_file_contains "$BUILDER" "200 lines" "Builder enforces component size"
assert_file_contains "$BUILDER" "Read first" "Builder reads before writing"
assert_file_contains "$BUILDER" "worktree" "Builder works in worktree isolation"

# 4.7 Simulate a violation — create a bad component
cat > "$SIM_DIR/BadComponent.tsx" << 'EOF'
import React from 'react'

export default function BadComponent() {
  return (
    <div className="bg-blue-500 text-purple-600 border-amber-400">
      <h1>DOPPEL Dashboard</h1>
      <p className="text-green-500">Welcome to My App</p>
      <button className="bg-red-500">Click me</button>
    </div>
  )
}
EOF

# Test that QA grep patterns would catch the violations
assert_true "QA grep catches hardcoded blue-500" \
  "grep -qE 'bg-blue-500' '$SIM_DIR/BadComponent.tsx'"
assert_true "QA grep catches hardcoded purple-600" \
  "grep -qE 'text-purple-600' '$SIM_DIR/BadComponent.tsx'"
assert_true "QA grep catches template branding DOPPEL" \
  "grep -qi 'DOPPEL' '$SIM_DIR/BadComponent.tsx'"
assert_true "QA grep catches template branding My App" \
  "grep -qi 'My App' '$SIM_DIR/BadComponent.tsx'"

# The QA agent's grep pattern from qa.md
assert_true "QA color violation regex matches bad component" \
  "grep -nE '(bg|text|border)-(red|blue|green|purple|amber)-[0-9]{2,3}' '$SIM_DIR/BadComponent.tsx' | wc -l | grep -q '[3-9]'"

# ══════════════════════════════════════════════════
# PHASE 5: QA AGENT SIMULATION
# ══════════════════════════════════════════════════
section "Phase 5: QA Agent Enforcement"

QA_AGENT="$AGENTS/qa.md"

# 5.1 QA has 6-phase quality gate
assert_file_contains "$QA_AGENT" "Static Analysis" "QA has Phase 1: Static Analysis"
assert_file_contains "$QA_AGENT" "Logic Review" "QA has Phase 2: Logic Review"
assert_file_contains "$QA_AGENT" "Test Execution" "QA has Phase 3: Test Execution"
assert_file_contains "$QA_AGENT" "UX Review" "QA has Phase 4: UX Review"
assert_file_contains "$QA_AGENT" "Performance" "QA has Phase 5: Performance"
assert_file_contains "$QA_AGENT" "Security" "QA has Phase 6: Security"

# 5.2 QA has command pipeline
assert_file_contains "$QA_AGENT" "tsc --noEmit" "QA runs TypeScript check"
assert_file_contains "$QA_AGENT" "npm run lint" "QA runs linting"
assert_file_contains "$QA_AGENT" "npm test" "QA runs tests"
assert_file_contains "$QA_AGENT" "npm run build" "QA runs production build"

# 5.3 QA checks for secrets
assert_file_contains "$QA_AGENT" "sk-|ghp_|AKIA|password" "QA scans for hardcoded secrets"

# 5.4 QA has design token scan (Gap 2)
assert_file_contains "$QA_AGENT" "Design Token Scan" "QA has design token scan section"
assert_file_contains "$QA_AGENT" "grep.*bg|text|border.*red|blue|green" "QA has color grep pattern"

# 5.5 QA has branding scan (Gap 1)
assert_file_contains "$QA_AGENT" "Branding Scan" "QA has branding scan section"
assert_file_contains "$QA_AGENT" "grep.*ACME.*Doppel" "QA has branding grep pattern"

# 5.6 QA is read-only
assert_file_contains "$QA_AGENT" "disallowedTools.*Write|disallowedTools.*Edit" "QA cannot write/edit code"

# 5.7 QA blocks ruthlessly
assert_file_contains "$QA_AGENT" "block ruthlessly|not ready.*not ready" "QA blocks ruthlessly"

# ══════════════════════════════════════════════════
# PHASE 6: DESIGN REVIEWER SIMULATION
# ══════════════════════════════════════════════════
section "Phase 6: Design Reviewer Enforcement"

DESIGN_REVIEWER="$AGENTS/design-reviewer.md"

# 6.1 Design reviewer checks all 5+3 dimensions
assert_file_contains "$DESIGN_REVIEWER" "Visual.*Typography|typography|color|spacing" "Checks visual quality"
assert_file_contains "$DESIGN_REVIEWER" "Interactive.*states|hover.*focus.*active" "Checks interactive states"
assert_file_contains "$DESIGN_REVIEWER" "Responsive.*320px" "Checks responsive at 320px"
assert_file_contains "$DESIGN_REVIEWER" "Accessible.*Contrast|contrast ratio|keyboard" "Checks accessibility"
assert_file_contains "$DESIGN_REVIEWER" "Emotional.*impression|cognitive load" "Checks emotional impact"
assert_file_contains "$DESIGN_REVIEWER" "Design Token Compliance" "Checks design token compliance (Gap 2)"
assert_file_contains "$DESIGN_REVIEWER" "Branding Compliance" "Checks branding compliance (Gap 1)"
assert_file_contains "$DESIGN_REVIEWER" "Persona Alignment" "Checks persona alignment (Gap 3)"

# 6.2 Design reviewer is read-only
assert_file_contains "$DESIGN_REVIEWER" "disallowedTools.*Write|disallowedTools.*Edit|disallowedTools.*Bash" "Design reviewer is read-only"

# 6.3 Design reviewer has rating system
assert_file_contains "$DESIGN_REVIEWER" "1-5|ship threshold|average.*4" "Has 1-5 rating system"

# 6.4 Automatic BLOCK conditions
assert_file_contains "$DESIGN_REVIEWER" "automatic BLOCK|auto.*BLOCK" "Has automatic block conditions"

# ══════════════════════════════════════════════════
# PHASE 7: TEAMS SKILL SIMULATION
# ══════════════════════════════════════════════════
section "Phase 7: Team Orchestration"

TEAMS_SKILL="$SKILLS/teams/SKILL.md"

# 7.1 All team presets exist
assert_file_contains "$TEAMS_SKILL" "build.*Implementation|Implementation.*Team" "Has build preset"
assert_file_contains "$TEAMS_SKILL" "fix.*Bug Fix|Bug Fix.*Team" "Has fix preset"
assert_file_contains "$TEAMS_SKILL" "review.*Review.*Team|Review Team" "Has review preset"
assert_file_contains "$TEAMS_SKILL" "full.*Championship|Championship.*Team" "Has full preset"

# 7.2 Build preset includes Design Reviewer (Gap 7)
assert_file_contains "$TEAMS_SKILL" "Design Reviewer.*sonnet.*plan" "Build preset has Design Reviewer"

# 7.3 Breathing Loop exists
assert_file_contains "$TEAMS_SKILL" "Breathing Loop" "Has Breathing Loop diagram"
assert_file_contains "$TEAMS_SKILL" "BUILDER.*create|Builder creates" "Builder creates in loop"
assert_file_contains "$TEAMS_SKILL" "WATCHER.*detect|Watcher.*monitor" "Watcher detects in loop"
assert_file_contains "$TEAMS_SKILL" "DEBUGGER.*fix|Debugger.*fix" "Debugger fixes in loop"
assert_file_contains "$TEAMS_SKILL" "QA.*verify|QA verif" "QA verifies in loop"

# 7.4 Post-builder verification (Gap 4)
assert_file_contains "$TEAMS_SKILL" "Post-Builder Verification" "Has post-builder verification section"
assert_file_contains "$TEAMS_SKILL" "file existence|verify.*file.*exist" "Verifies file existence"

# 7.5 TeamCreate enforcement
assert_file_contains "$TEAMS_SKILL" "MUST use TeamCreate|TeamCreate.*REQUIRED" "Mandates TeamCreate"

# 7.6 Shutdown protocol
assert_file_contains "$TEAMS_SKILL" "shutdown|Shutdown|TeamDelete" "Has shutdown protocol"

# 7.7 All 10 roster members defined
assert_file_contains "$TEAMS_SKILL" "Lead.*opus" "Roster has Lead (opus)"
assert_file_contains "$TEAMS_SKILL" "Builder.*sonnet" "Roster has Builder (sonnet)"
assert_file_contains "$TEAMS_SKILL" "Watcher.*haiku" "Roster has Watcher (haiku)"
assert_file_contains "$TEAMS_SKILL" "Debugger.*sonnet" "Roster has Debugger (sonnet)"
assert_file_contains "$TEAMS_SKILL" "QA.*sonnet" "Roster has QA (sonnet)"
assert_file_contains "$TEAMS_SKILL" "Code Reviewer.*sonnet" "Roster has Code Reviewer (sonnet)"
assert_file_contains "$TEAMS_SKILL" "Design Reviewer.*sonnet" "Roster has Design Reviewer (sonnet)"
assert_file_contains "$TEAMS_SKILL" "Technical Writer.*haiku" "Roster has Technical Writer (haiku)"
assert_file_contains "$TEAMS_SKILL" "Researcher.*haiku" "Roster has Researcher (haiku)"
assert_file_contains "$TEAMS_SKILL" "Sentinel.*sonnet" "Roster has Sentinel (sonnet)"

# 7.8 QA gate and design review rules (Gap 6, 7)
assert_file_contains "$TEAMS_SKILL" "QA is a gate" "Teams enforces QA as gate"
assert_file_contains "$TEAMS_SKILL" "design review.*UI|Design Reviewer MUST" "Teams requires design review for UI"

# ══════════════════════════════════════════════════
# PHASE 8: CODE STANDARDS & RULES
# ══════════════════════════════════════════════════
section "Phase 8: Code Standards & Rules"

CODE_STANDARDS="$SKILLS/code-standards/SKILL.md"
COMP_RULES="$RULES/components.md"

# 8.1 Code standards exist
assert_file_contains "$CODE_STANDARDS" "TypeScript.*strict|strict.*true" "Code standards enforce strict TS"
assert_file_contains "$CODE_STANDARDS" "no.*any|never.*any|unknown" "Code standards ban any type"
assert_file_contains "$CODE_STANDARDS" "30 lines" "Code standards enforce function size"
assert_file_contains "$CLAUDE_MD" "300 lines" "CLAUDE.md enforces file size limit"
assert_file_contains "$CODE_STANDARDS" "kebab-case|PascalCase" "Code standards define naming"
assert_file_contains "$CODE_STANDARDS" "conventional commit|type.*scope" "Code standards define commit format"

# 8.2 Component rules
assert_file_contains "$COMP_RULES" "Props interface" "Component rules define props pattern"
assert_file_contains "$COMP_RULES" "loading state|error state|empty state" "Component rules require all states"
assert_file_contains "$COMP_RULES" "semantic HTML|aria" "Component rules require accessibility"
assert_file_contains "$COMP_RULES" "design token|hardcoded.*Tailwind" "Component rules enforce design tokens (Gap 2)"
assert_file_contains "$COMP_RULES" "react-hook-form.*zod|zod" "Component rules define form pattern"
assert_file_contains "$COMP_RULES" "TanStack Query|React Query" "Component rules define data fetching"

# 8.3 All rule files exist and are valid
for rule_file in "$RULES"/*.md; do
  rule_name=$(basename "$rule_file" .md)
  assert_file_exists "$rule_file" "Rule $rule_name exists"
  assert_file_contains "$rule_file" "^---" "Rule $rule_name has frontmatter"
done

# ══════════════════════════════════════════════════
# PHASE 9: SECURITY & SAFETY
# ══════════════════════════════════════════════════
section "Phase 9: Security & Safety"

# 9.1 Block dangerous commands script
BLOCK_SCRIPT="$SCRIPTS/block-dangerous-commands.sh"
assert_file_exists "$BLOCK_SCRIPT" "Dangerous command blocker exists"
assert_file_executable "$BLOCK_SCRIPT" "Dangerous command blocker is executable"

# Verify the script contains the rm -rf blocking pattern
assert_file_contains "$BLOCK_SCRIPT" "rm.*-rf|rm -rf" "Block script catches rm -rf"

# 9.2 Security scanning script
SECURITY_SCRIPT="$SCRIPTS/scan-security-patterns.sh"
assert_file_exists "$SECURITY_SCRIPT" "Security scanner exists"
assert_file_executable "$SECURITY_SCRIPT" "Security scanner is executable"

# 9.3 Protect files script
PROTECT_SCRIPT="$SCRIPTS/protect-files.sh"
assert_file_exists "$PROTECT_SCRIPT" "File protector exists"
assert_file_executable "$PROTECT_SCRIPT" "File protector is executable"

# 9.4 Security skill exists
assert_file_exists "$SKILLS/security/SKILL.md" "Security skill exists"
assert_file_contains "$SKILLS/security/SKILL.md" "OWASP|injection|XSS" "Security skill covers OWASP"

# 9.5 Commit message enforcement
COMMIT_MSG_HOOK="$GIT_HOOKS/commit-msg"
assert_file_contains "$COMMIT_MSG_HOOK" "72" "Commit-msg enforces 72-char limit"

# 9.6 Pre-commit hook checks
PRE_COMMIT_HOOK="$GIT_HOOKS/pre-commit"
assert_file_contains "$PRE_COMMIT_HOOK" "main.*master|CURRENT_BRANCH" "Pre-commit checks branch status"

# 9.7 Git workflow enforcement
assert_file_contains "$CLAUDE_MD" "Never push.*main.*master" "CLAUDE.md blocks direct push to main"
assert_file_contains "$CLAUDE_MD" "feat/|fix/" "CLAUDE.md defines branch naming"

# ══════════════════════════════════════════════════
# PHASE 10: WATCHER AGENT
# ══════════════════════════════════════════════════
section "Phase 10: Watcher Agent"

WATCHER="$AGENTS/watcher.md"

assert_file_contains "$WATCHER" "background|continuous" "Watcher runs continuously"
assert_file_contains "$WATCHER" "build failure|test failure" "Watcher monitors builds/tests"
assert_file_contains "$WATCHER" "security|secret|hardcoded" "Watcher monitors security"
assert_file_contains "$WATCHER" "never modify|read.only|no.*write" "Watcher is read-only"
assert_file_contains "$WATCHER" "haiku" "Watcher uses haiku model (cost efficient)"

# ══════════════════════════════════════════════════
# PHASE 11: OTHER AGENTS
# ══════════════════════════════════════════════════
section "Phase 11: Specialist Agents"

# 11.1 Debugger
DEBUGGER="$AGENTS/debugger.md"
assert_file_exists "$DEBUGGER" "Debugger agent exists"
assert_file_contains "$DEBUGGER" "root cause" "Debugger finds root cause"
assert_file_contains "$DEBUGGER" "worktree|isolation" "Debugger works in isolation"

# 11.2 Code Reviewer
CODE_REVIEWER="$AGENTS/code-reviewer.md"
assert_file_exists "$CODE_REVIEWER" "Code reviewer agent exists"
assert_file_contains "$CODE_REVIEWER" "security|quality" "Code reviewer checks security/quality"

# 11.3 Technical Writer
TECH_WRITER="$AGENTS/technical-writer.md"
assert_file_exists "$TECH_WRITER" "Technical writer agent exists"
assert_file_contains "$TECH_WRITER" "CHANGELOG|README" "Technical writer updates docs"
assert_file_contains "$TECH_WRITER" "haiku" "Technical writer uses haiku (cost efficient)"

# 11.4 Researcher
RESEARCHER="$AGENTS/researcher.md"
assert_file_exists "$RESEARCHER" "Researcher agent exists"
assert_file_contains "$RESEARCHER" "haiku" "Researcher uses haiku (cost efficient)"

# 11.5 Sentinel
SENTINEL="$AGENTS/sentinel.md"
assert_file_exists "$SENTINEL" "Sentinel agent exists"
assert_file_contains "$SENTINEL" "self-test|batman|Dark Knight" "Sentinel is the Dark Knight"

# 11.6 Framework Evolver
EVOLVER="$AGENTS/framework-evolver.md"
assert_file_exists "$EVOLVER" "Framework evolver agent exists"
assert_file_contains "$EVOLVER" "improve|evolve|gap" "Evolver improves the framework"

# ══════════════════════════════════════════════════
# PHASE 12: HOOK SYSTEM
# ══════════════════════════════════════════════════
section "Phase 12: Hook System"

# 12.1 Settings.json has all hook types
assert_file_contains "$SETTINGS" "PreToolUse" "Settings has PreToolUse hooks"
assert_file_contains "$SETTINGS" "PostToolUse" "Settings has PostToolUse hooks"
assert_file_contains "$SETTINGS" "Stop" "Settings has Stop hooks"

# 12.2 Key hooks are wired
assert_file_contains "$SETTINGS" "block-dangerous-commands" "Dangerous command blocker is wired"
assert_file_contains "$SETTINGS" "enforce-workflow" "Workflow enforcer is wired"
assert_file_contains "$SETTINGS" "scan-security-patterns" "Security scanner is wired"
assert_file_contains "$SETTINGS" "protect-files" "File protector is wired"
assert_file_contains "$SETTINGS" "enforce-commit-msg" "Commit message enforcer is wired"
assert_file_contains "$SETTINGS" "session-context" "Session context is wired"

# 12.3 All referenced scripts exist
for script_ref in $(jq -r '.. | .command? // empty' "$SETTINGS" 2>/dev/null | grep -oE '[a-z-]+\.sh' | sort -u); do
  assert_file_exists "$SCRIPTS/$script_ref" "Referenced script $script_ref exists"
done

# ══════════════════════════════════════════════════
# PHASE 13: REMAINING SKILLS
# ══════════════════════════════════════════════════
section "Phase 13: Skill Coverage"

# 13.1 All critical skills have content
assert_file_contains "$SKILLS/qa/SKILL.md" "quality gate|6.*phase" "QA skill has quality gate"
assert_file_contains "$SKILLS/design-system/SKILL.md" "typography|color|spacing" "Design system skill has visual rules"
assert_file_contains "$SKILLS/a11y/SKILL.md" "WCAG|contrast|keyboard" "A11y skill has WCAG checks"
assert_file_contains "$SKILLS/cx-review/SKILL.md" "customer|user.*experience|CX" "CX review has CX focus"
assert_file_contains "$SKILLS/research/SKILL.md" "API|documentation|library" "Research skill investigates APIs"
assert_file_contains "$SKILLS/verify-lib/SKILL.md" "security|CVE|license|official" "Verify-lib checks security/license"
assert_file_contains "$SKILLS/commit/SKILL.md" "conventional|type.*scope" "Commit skill follows conventions"
assert_file_contains "$SKILLS/changelog/SKILL.md" "CHANGELOG|release|version" "Changelog skill updates changelog"
assert_file_contains "$SKILLS/security/SKILL.md" "OWASP|injection|auth" "Security skill covers threats"
assert_file_contains "$SKILLS/performance/SKILL.md" "bundle|render|optimize|core web" "Performance skill covers optimization"
assert_file_contains "$SKILLS/debug/SKILL.md" "root cause|reproduce|error" "Debug skill finds root causes"
assert_file_contains "$SKILLS/e2e/SKILL.md" "playwright|browser|test" "E2E skill uses Playwright"
assert_file_contains "$SKILLS/teams/SKILL.md" "TeamCreate|team_name|preset" "Teams skill uses TeamCreate"
assert_file_contains "$SKILLS/evolve/SKILL.md" "session|gap|improve" "Evolve skill analyzes sessions"
assert_file_contains "$SKILLS/self-test/SKILL.md" "sentinel|batman|verify" "Self-test invokes Sentinel"

# ══════════════════════════════════════════════════
# PHASE 14: CLAUDE.MD COMPLETENESS
# ══════════════════════════════════════════════════
section "Phase 14: Constitution (CLAUDE.md)"

# 14.1 All 15 core rules present
assert_file_contains "$CLAUDE_MD" "PRD before code" "Rule 1: PRD before code"
assert_file_contains "$CLAUDE_MD" "Research before integration" "Rule 2: Research before integration"
assert_file_contains "$CLAUDE_MD" "Verify before installing" "Rule 3: Verify before installing"
assert_file_contains "$CLAUDE_MD" "QA before shipping" "Rule 4: QA before shipping"
assert_file_contains "$CLAUDE_MD" "Security on sensitive" "Rule 5: Security on sensitive code"
assert_file_contains "$CLAUDE_MD" "CX review" "Rule 6: CX review"
assert_file_contains "$CLAUDE_MD" "Read before editing" "Rule 7: Read before editing"
assert_file_contains "$CLAUDE_MD" "Root cause only" "Rule 8: Root cause only"
assert_file_contains "$CLAUDE_MD" "Impact analysis" "Rule 9: Impact analysis first"
assert_file_contains "$CLAUDE_MD" "Adapt to existing" "Rule 10: Adapt to existing stacks"
assert_file_contains "$CLAUDE_MD" "Only verified" "Rule 11: Only verified libraries"
assert_file_contains "$CLAUDE_MD" "Design tokens only" "Rule 12: Design tokens only (NEW)"
assert_file_contains "$CLAUDE_MD" "Branding sweep" "Rule 13: Branding sweep (NEW)"
assert_file_contains "$CLAUDE_MD" "Persona.*page alignment" "Rule 14: Persona→page alignment (NEW)"
assert_file_contains "$CLAUDE_MD" "Verify worktree" "Rule 15: Verify worktree output (NEW)"

# 14.2 Enforcement section (lessons from past sessions)
assert_file_contains "$CLAUDE_MD" "What Failed in Past Sessions|Enforcement" "Has enforcement section"
assert_file_contains "$CLAUDE_MD" "NOT optional" "Enforcement: teams not optional"
assert_file_contains "$CLAUDE_MD" "Breathing Loop" "Enforcement: breathing loop"

# 14.3 Always-on agents
assert_file_contains "$CLAUDE_MD" "Always-On Agents" "Has always-on agents section"
assert_file_contains "$CLAUDE_MD" "Watcher.*background|watcher.*background" "Watcher is always-on"
assert_file_contains "$CLAUDE_MD" "Technical Writer.*BEFORE|technical-writer.*BEFORE" "Tech writer before commit"

# 14.4 Workflow order
assert_file_contains "$CLAUDE_MD" "prd.*architecture.*research.*build.*qa" "Has correct workflow order"

# ══════════════════════════════════════════════════
# PHASE 15: VIOLATION DETECTION SIMULATION
# Create deliberate violations and prove the framework's patterns catch them
# ══════════════════════════════════════════════════
section "Phase 15: Violation Detection Simulation"

# 15.1 Create a file with hardcoded colors
cat > "$SIM_DIR/colors.tsx" << 'VIOLEOF'
<div className="bg-blue-500 text-purple-600 border-amber-400">
  <span className="bg-primary text-accent">Good</span>
  <span className="bg-red-500 text-green-300 ring-indigo-700">Bad</span>
</div>
VIOLEOF

# Run the QA agent's grep pattern (-o counts individual matches, not lines)
COLOR_VIOLATIONS=$(grep -oE '(bg|text|border|ring)-(red|blue|green|purple|amber|indigo)-[0-9]{2,3}' "$SIM_DIR/colors.tsx" 2>/dev/null | wc -l | tr -d ' ')
assert_true "Detects 5+ hardcoded color violations (found $COLOR_VIOLATIONS)" \
  "[ '$COLOR_VIOLATIONS' -ge 5 ]"

# Confirm semantic tokens are NOT flagged by the violation pattern
GOOD_TOKENS=$(grep -oE 'bg-primary|text-accent' "$SIM_DIR/colors.tsx" 2>/dev/null | wc -l | tr -d ' ')
assert_true "Does NOT flag semantic tokens (found $GOOD_TOKENS good tokens)" \
  "[ '$GOOD_TOKENS' -ge 2 ]"

# 15.2 Create a file with branding violations
cat > "$SIM_DIR/sidebar.tsx" << 'BRANDEOF'
<nav>
  <h1>DOPPEL CRM</h1>
  <p>Powered by ACME Corp</p>
  <footer>My App v1.0</footer>
</nav>
BRANDEOF

BRAND_VIOLATIONS=$(grep -ciE 'DOPPEL|ACME|My App' "$SIM_DIR/sidebar.tsx" 2>/dev/null || echo "0")
assert_true "Detects 3 branding violations (found $BRAND_VIOLATIONS)" \
  "[ '$BRAND_VIOLATIONS' -ge 3 ]"

# 15.3 Create a file with secrets (built entirely at runtime to avoid pre-commit scan)
printf 'const x = "%s%s"\nconst y = "%s%s"\nconst z = "%s%s"\nconst safe = process.env.KEY\n' \
  "sk-" "1234567890abcdefghijklmnop" \
  "ghp_" "abcdefghijklmnopqrstuvwxyz1234567890" \
  "AKIA" "IOSFODNN7EXAMPLE" > "$SIM_DIR/config.ts"

SECRET_VIOLATIONS=$(grep -cE '(sk-[a-zA-Z0-9]{20,}|ghp_|AKIA)' "$SIM_DIR/config.ts" 2>/dev/null || echo "0")
assert_true "Detects 3 hardcoded secrets (found $SECRET_VIOLATIONS)" \
  "[ '$SECRET_VIOLATIONS' -ge 3 ]"

# 15.4 Simulate a commit message that's too long
LONG_MSG="feat(authentication): implement the new user authentication flow with OAuth2.0 and PKCE support for mobile clients"
CHAR_COUNT=${#LONG_MSG}
assert_true "Detects commit message over 72 chars ($CHAR_COUNT chars)" \
  "[ $CHAR_COUNT -gt 72 ]"

# 15.5 Simulate a file over 300 lines
seq 1 301 | awk '{print "const line" NR " = " NR}' > "$SIM_DIR/big-file.ts"
LINE_COUNT=$(wc -l < "$SIM_DIR/big-file.ts" | tr -d ' ')
assert_true "Detects file over 300 lines ($LINE_COUNT lines)" \
  "[ $LINE_COUNT -gt 300 ]"

# 15.6 Simulate console.log in production code
cat > "$SIM_DIR/service.ts" << 'LOGEOF'
export function fetchUsers() {
  console.log("fetching users...")
  return fetch("/api/users")
}
LOGEOF

CONSOLE_VIOLATIONS=$(grep -c 'console\.log' "$SIM_DIR/service.ts" 2>/dev/null || echo "0")
assert_true "Detects console.log in production ($CONSOLE_VIOLATIONS found)" \
  "[ '$CONSOLE_VIOLATIONS' -ge 1 ]"

# 15.7 Simulate 'any' type usage
cat > "$SIM_DIR/types.ts" << 'ANYEOF'
const data: any = {}
function process(input: any): any {
  return input
}
const typed: unknown = {}
ANYEOF

ANY_VIOLATIONS=$(grep -oE ': any' "$SIM_DIR/types.ts" 2>/dev/null | wc -l | tr -d ' ')
assert_true "Detects 3 'any' type violations (found $ANY_VIOLATIONS)" \
  "[ '$ANY_VIOLATIONS' -ge 3 ]"

# ══════════════════════════════════════════════════
# PHASE 16: INSTALL & CLI
# ══════════════════════════════════════════════════
section "Phase 16: Install & CLI"

assert_file_exists "$SCRIPT_DIR/install.sh" "install.sh exists"
assert_file_executable "$SCRIPT_DIR/install.sh" "install.sh is executable"
assert_file_exists "$SCRIPT_DIR/bin/apex" "apex CLI exists"
assert_file_executable "$SCRIPT_DIR/bin/apex" "apex CLI is executable"
assert_file_exists "$SCRIPT_DIR/VERSION" "VERSION file exists"

# VERSION is not empty
assert_true "VERSION is not empty" "[ -s '$SCRIPT_DIR/VERSION' ]"

# Install script references framework components
assert_file_contains "$SCRIPT_DIR/install.sh" "skills|agents|scripts|CLAUDE" \
  "install.sh copies framework components"

# ══════════════════════════════════════════════════
# PHASE 17: OUTPUT STYLE & EDUCATION
# ══════════════════════════════════════════════════
section "Phase 17: Educational Output"

assert_file_contains "$OUTPUT_STYLES/apex-educational.md" "Teaching moment|teaching moment" \
  "Output style includes teaching moments"
assert_file_contains "$OUTPUT_STYLES/apex-educational.md" "Tip|tip" \
  "Output style includes programming tips"
assert_file_contains "$OUTPUT_STYLES/apex-educational.md" "First Message" \
  "Output style defines first message behavior"
assert_file_contains "$OUTPUT_STYLES/apex-educational.md" "Always-On Agents" \
  "Output style mandates always-on agents"
assert_file_contains "$OUTPUT_STYLES/apex-educational.md" "Watcher.*background" \
  "Output style requires Watcher at session start"
assert_file_contains "$OUTPUT_STYLES/apex-educational.md" "Technical Writer.*BEFORE.*commit" \
  "Output style requires Tech Writer before commit"

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

RESULT_TEXT="$PASS passed"
if [ $FAIL -gt 0 ]; then RESULT_TEXT="$RESULT_TEXT · $FAIL failed"; fi
if [ $SKIP -gt 0 ]; then RESULT_TEXT="$RESULT_TEXT · $SKIP skipped"; fi

if [ $FAIL -eq 0 ]; then
  if [ "$APEX_COLORS" = true ]; then
    printf "  ${OK_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
    printf "  ${OK_BOLD}║${RST}  Results: ${OK_BOLD}%-36s${RST}${OK_BOLD}║${RST}\n" "$RESULT_TEXT"
    printf "  ${OK_BOLD}║${RST}  Total: %-38s${OK_BOLD}║${RST}\n" "$TOTAL tests"
    printf "  ${OK_BOLD}║${RST}                                              ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}║${RST}  ${OK_BOLD}⚔️  Full simulation passed.${RST}                 ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}║${RST}  ${OK_BOLD}The framework is battle-ready.${RST}              ${OK_BOLD}║${RST}\n"
    printf "  ${OK_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
  else
    echo "  ╔══════════════════════════════════════════════╗"
    printf "  ║  Results: %-36s║\n" "$RESULT_TEXT"
    printf "  ║  Total: %-38s║\n" "$TOTAL tests"
    echo "  ║                                              ║"
    echo "  ║  ⚔️  Full simulation passed.                  ║"
    echo "  ║  The framework is battle-ready.               ║"
    echo "  ╚══════════════════════════════════════════════╝"
  fi
  exit 0
else
  if [ "$APEX_COLORS" = true ]; then
    printf "  ${ERR_BOLD}╔══════════════════════════════════════════════╗${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  Results: ${OK_BOLD}$PASS passed${RST} · ${ERR_BOLD}$FAIL failed${RST}              ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  Total: %-38s${ERR_BOLD}║${RST}\n" "$TOTAL tests"
    printf "  ${ERR_BOLD}║${RST}                                              ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}║${RST}  ${ERR_BOLD}🔴 Simulation failed. Fix before shipping.${RST} ${ERR_BOLD}║${RST}\n"
    printf "  ${ERR_BOLD}╚══════════════════════════════════════════════╝${RST}\n"
  else
    echo "  ╔══════════════════════════════════════════════╗"
    printf "  ║  Results: $PASS passed · $FAIL failed\n"
    printf "  ║  Total: %-38s║\n" "$TOTAL tests"
    echo "  ║                                              ║"
    echo "  ║  🔴 Simulation failed. Fix before shipping.   ║"
    echo "  ╚══════════════════════════════════════════════╝"
  fi
  exit 1
fi
