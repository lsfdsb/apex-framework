#!/bin/bash
# test-behavioral.sh — Behavioral tests for APEX hook scripts
# Tests every hook-wired script with REAL Claude Code JSON payloads.
# by L.B. & Claude · São Paulo, 2026

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS="$SCRIPT_DIR/.claude/scripts"
FX="$SCRIPT_DIR/tests/fixtures"
source "$SCRIPT_DIR/tests/lib/helpers.sh"

fx() { [ -f "$FX/$1" ] && cat "$FX/$1" || echo '{}'; }

run_hook() {
  local script="$1" fixture="$2"
  fx "$fixture" | bash "$SCRIPTS/$script" 2>/dev/null
}

echo ""
echo -e "  ${BOLD}APEX Behavioral Tests${NC}"
echo -e "  ${DIM}──────────────────────────────────────${NC}"

# ── block-dangerous-commands.sh ──
section "block-dangerous-commands"

E=0; run_hook block-dangerous-commands.sh pretooluse-bash-dangerous.json || E=$?
assert_exit "blocks dangerous command" 2 "$E"

E=0; run_hook block-dangerous-commands.sh pretooluse-bash.json || E=$?
assert_exit "allows safe command" 0 "$E"

E=0; run_hook block-dangerous-commands.sh pretooluse-bash-push-main.json || E=$?
assert_exit "blocks push to main" 2 "$E"

E=0; run_hook block-dangerous-commands.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

E=0; run_hook block-dangerous-commands.sh malformed.json || E=$?
assert_exit "handles malformed JSON" 0 "$E"

# ── protect-files.sh ──
section "protect-files"

E=0; run_hook protect-files.sh pretooluse-write-env.json || E=$?
assert_exit "blocks .env write" 2 "$E"

E=0; run_hook protect-files.sh pretooluse-write.json || E=$?
assert_exit "allows safe write" 0 "$E"

E=0; run_hook protect-files.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── scan-security-patterns.sh ──
section "scan-security-patterns"

E=0; O=$(run_hook scan-security-patterns.sh pretooluse-write-secret.json); E=$?
assert_exit "blocks hardcoded secret" 2 "$E"

E=0; run_hook scan-security-patterns.sh pretooluse-write.json || E=$?
assert_exit "allows safe code" 0 "$E"

E=0; run_hook scan-security-patterns.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── verify-install.sh ──
section "verify-install"

E=0; O=$(run_hook verify-install.sh pretooluse-bash-npm-install.json); E=$?
assert_exit "processes npm install" 0 "$E"

E=0; run_hook verify-install.sh pretooluse-bash.json || E=$?
assert_exit "ignores non-install commands" 0 "$E"

E=0; run_hook verify-install.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── enforce-workflow.sh ──
section "enforce-workflow"

E=0; run_hook enforce-workflow.sh pretooluse-write.json || E=$?
assert_exit "allows safe write" 0 "$E"

E=0; run_hook enforce-workflow.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── guard-workflow-skip.sh ──
section "guard-workflow-skip"

E=0; O=$(run_hook guard-workflow-skip.sh userpromptsubmit-skip.json); E=$?
assert_exit "processes skip request" 0 "$E"
assert_output_contains "mentions PRD on skip" "PRD\|prd\|APEX\|apex" "$O"

E=0; run_hook guard-workflow-skip.sh userpromptsubmit.json || E=$?
assert_exit "allows normal prompt" 0 "$E"

E=0; run_hook guard-workflow-skip.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── handle-failure.sh ──
section "handle-failure"

E=0; O=$(run_hook handle-failure.sh posttooluse-failure.json); E=$?
assert_exit "processes failure" 0 "$E"

E=0; run_hook handle-failure.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── stop-gate.sh ──
section "stop-gate"

E=0; run_hook stop-gate.sh stop.json || E=$?
assert_exit "processes stop event" 0 "$E"

E=0; run_hook stop-gate.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── track-agent-start.sh ──
section "track-agent-start"

E=0; O=$(run_hook track-agent-start.sh subagentstart.json); E=$?
assert_exit "processes agent start" 0 "$E"
assert_output_contains "emits systemMessage" "systemMessage" "$O"

E=0; O=$(run_hook track-agent-start.sh empty.json); E=$?
assert_exit "handles empty input" 0 "$E"

# ── auto-changelog.sh ──
section "auto-changelog"

E=0; run_hook auto-changelog.sh posttooluse-bash-commit.json || E=$?
assert_exit "processes commit" 0 "$E"

E=0; run_hook auto-changelog.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── auto-format.sh ──
section "auto-format"

E=0; run_hook auto-format.sh posttooluse-edit.json || E=$?
assert_exit "processes edit" 0 "$E"

E=0; run_hook auto-format.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

# ── dev-monitor.sh ──
section "dev-monitor"

E=0; run_hook dev-monitor.sh stop.json || E=$?
assert_exit "processes stop event" 0 "$E"

E=0; run_hook dev-monitor.sh empty.json || E=$?
assert_exit "handles empty input" 0 "$E"

print_summary
[ "$FAIL" -gt 0 ] && exit 1 || exit 0
