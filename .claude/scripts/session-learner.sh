#!/bin/bash
# session-learner.sh — SessionEnd hook
# Automatically analyzes session for mistakes, errors, and improvement opportunities.
# Writes a lightweight report to .claude/session-logs/ for review on next startup.
#
# Captures session errors, blocks, and user corrections so the next session
# starts informed about recurring patterns.
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail  # no -e because hook must not crash Claude Code

# Drain stdin — large tool payloads on stdin can accumulate and delay shutdown
INPUT=$(cat 2>/dev/null || true)

if ! command -v jq &> /dev/null; then
  echo '{"systemMessage":"⚠️ APEX: jq not installed — session learning DISABLED. Install: brew install jq"}'
  exit 0
fi
# CLAUDE_SESSION_ID env var doesn't exist — extract from hook JSON payload
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty' 2>/dev/null)
if [ -z "$SESSION_ID" ]; then
  SESSION_ID="unknown"
fi
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LOG_DIR="${PROJECT_DIR}/.claude/session-logs"
mkdir -p "$LOG_DIR"

REPORT="${LOG_DIR}/session-${SESSION_ID}.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "unknown")

# Find session transcript
# Claude Code stores sessions in ~/.claude/projects/{sanitized-project-path}/
TRANSCRIPT_DIR="$HOME/.claude/projects"
TRANSCRIPT=""

if [ "$SESSION_ID" != "unknown" ]; then
  # Strategy 1: Sanitized project path (Claude Code convention: /path → -path)
  SANITIZED=$(echo "$PROJECT_DIR" | sed 's|/|-|g')
  CANDIDATE="${TRANSCRIPT_DIR}/${SANITIZED}/${SESSION_ID}.jsonl"
  [ -f "$CANDIDATE" ] && TRANSCRIPT="$CANDIDATE"

  # Strategy 2: Find by session ID across all project directories
  if [ -z "$TRANSCRIPT" ]; then
    TRANSCRIPT=$(find "$TRANSCRIPT_DIR" -name "${SESSION_ID}.jsonl" -type f 2>/dev/null | head -1)
  fi
fi

# Strategy 3: Most recent JSONL in the sanitized project dir (fallback for unknown session)
if [ -z "$TRANSCRIPT" ]; then
  SANITIZED=$(echo "$PROJECT_DIR" | sed 's|/|-|g')
  CANDIDATE_DIR="${TRANSCRIPT_DIR}/${SANITIZED}"
  if [ -d "$CANDIDATE_DIR" ]; then
    TRANSCRIPT=$(ls -t "$CANDIDATE_DIR"/*.jsonl 2>/dev/null | head -1)
  fi
fi

if [ -z "$TRANSCRIPT" ] || [ ! -f "$TRANSCRIPT" ]; then
  echo "📝 APEX Session Learner: transcript not found. Learning skipped."
  exit 0
fi

# Count metrics from transcript using jq for reliable JSONL parsing
TOOL_ERRORS=$(jq -r 'select(.is_error==true or (.content[]?.text // "" | test("^Error"))) | "x"' "$TRANSCRIPT" 2>/dev/null | wc -l | tr -d ' \n')
[ -z "$TOOL_ERRORS" ] && TOOL_ERRORS=0

# Count ONLY real hook blocks (exit 2 from PreToolUse), not "BLOCKED" in agent docs
HOOK_BLOCKS=$(jq -r 'select(.is_error==true) | .content[]?.text // empty' "$TRANSCRIPT" 2>/dev/null | grep -c '^BLOCKED:' || true)
HOOK_BLOCKS=$(echo "$HOOK_BLOCKS" | tr -d ' \n')
[ -z "$HOOK_BLOCKS" ] && HOOK_BLOCKS=0

USER_MESSAGES=$(grep -c '"role":"user"' "$TRANSCRIPT" 2>/dev/null || echo "0")
ASSISTANT_MESSAGES=$(grep -c '"role":"assistant"' "$TRANSCRIPT" 2>/dev/null || echo "0")
TOOL_USES=$(grep -c '"type":"tool_use"' "$TRANSCRIPT" 2>/dev/null || echo "0")

# Extract error messages using jq (unique, last 20)
ERRORS=$(jq -r 'select(.is_error==true) | .content[]?.text // empty' "$TRANSCRIPT" 2>/dev/null | \
  grep -v '^$' | sort -u | tail -20)

# Extract blocked actions — only real hook blocks starting with "BLOCKED:"
BLOCKS=$(jq -r 'select(.is_error==true) | .content[]?.text // empty' "$TRANSCRIPT" 2>/dev/null | \
  grep '^BLOCKED:' | sort -u | tail -10)

# Extract user corrections — messages with correction intent
CORRECTIONS=$(jq -r 'select(.role=="user") | .content[]?.text // empty' "$TRANSCRIPT" 2>/dev/null | \
  grep -iE '^(no[, —-]|don.t|stop |wrong|not that|actually[, ]|wait[, ]|those aren)' | tail -10)

# Only write report if there's something interesting
if [ "$TOOL_ERRORS" -eq 0 ] && [ "$HOOK_BLOCKS" -eq 0 ] && [ -z "$CORRECTIONS" ]; then
  # Clean session — just log a one-liner
  echo "# Session $SESSION_ID — $TIMESTAMP — Clean ✅" > "$REPORT"
  echo "Branch: $BRANCH | Messages: $USER_MESSAGES | Tools: $TOOL_USES | Errors: 0 | Blocks: 0" >> "$REPORT"
  exit 0
fi

# Write detailed report
cat > "$REPORT" << REPORT_EOF
# Session Report — $TIMESTAMP
- **Session ID:** $SESSION_ID
- **Branch:** $BRANCH
- **Messages:** $USER_MESSAGES user / $ASSISTANT_MESSAGES assistant
- **Tool uses:** $TOOL_USES
- **Errors:** $TOOL_ERRORS
- **Hook blocks:** $HOOK_BLOCKS

## Errors
$(if [ -n "$ERRORS" ]; then echo "$ERRORS" | while read -r line; do echo "- $line"; done; else echo "None"; fi)

## Blocked Actions
$(if [ -n "$BLOCKS" ]; then echo "$BLOCKS" | while read -r line; do echo "- $line"; done; else echo "None"; fi)

## User Corrections
$(if [ -n "$CORRECTIONS" ]; then echo "$CORRECTIONS" | while read -r line; do echo "- $line"; done; else echo "None"; fi)

## Improvement Signals
$([ "$TOOL_ERRORS" -gt 5 ] && echo "- HIGH: $TOOL_ERRORS tool errors — investigate root causes")
$([ "$HOOK_BLOCKS" -gt 3 ] && echo "- MEDIUM: $HOOK_BLOCKS hook blocks — check for false positives")
$([ -n "$CORRECTIONS" ] && echo "- HIGH: User corrections detected — framework missed something")
REPORT_EOF

# Keep only last 30 session logs (prevent unbounded growth)
ls -t "$LOG_DIR"/session-*.md 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null

# ── Supabase RAG Persistence ─────────────────────────────────────────────────
# If Supabase is configured, persist learnings for cross-session RAG retrieval.
# Gracefully skip if not configured — local reports are always written above.

if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SECRET_KEY:-}" ] && command -v curl &>/dev/null; then
  SUPABASE_URL="${SUPABASE_URL%/}"
  REST_URL="$SUPABASE_URL/rest/v1"

  # Determine learning type based on content
  if [ "$TOOL_ERRORS" -gt 5 ]; then
    LEARNING_TYPE="error"
  elif [ -n "$CORRECTIONS" ]; then
    LEARNING_TYPE="correction"
  elif [ -n "$BLOCKS" ]; then
    LEARNING_TYPE="pattern"
  else
    LEARNING_TYPE="success"
  fi

  # Build content summary (compact, for embedding later)
  CONTENT="Session $SESSION_ID ($TIMESTAMP) on branch $BRANCH."
  [ "$TOOL_ERRORS" -gt 0 ] && CONTENT="$CONTENT Errors: $TOOL_ERRORS."
  [ "$HOOK_BLOCKS" -gt 0 ] && CONTENT="$CONTENT Hook blocks: $HOOK_BLOCKS."
  [ -n "$CORRECTIONS" ] && CONTENT="$CONTENT User corrections: $(echo "$CORRECTIONS" | head -3 | tr '\n' '; ')"
  [ -n "$ERRORS" ] && CONTENT="$CONTENT Top errors: $(echo "$ERRORS" | head -3 | tr '\n' '; ')"

  # Escape content for JSON
  CONTENT_JSON=$(printf '%s' "$CONTENT" | jq -Rs '.')

  PAYLOAD=$(cat <<JSON
{
  "session_id": "$SESSION_ID",
  "learning_type": "$LEARNING_TYPE",
  "content": $CONTENT_JSON
}
JSON
)

  # Fire-and-forget POST — don't block session end on network
  curl -sf -o /dev/null \
    -X POST "$REST_URL/session_learnings" \
    -H "apikey: $SUPABASE_SECRET_KEY" \
    -H "Authorization: Bearer $SUPABASE_SECRET_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "$PAYLOAD" 2>/dev/null &
fi

exit 0
