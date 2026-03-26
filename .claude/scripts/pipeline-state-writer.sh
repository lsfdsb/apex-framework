#!/bin/bash
# pipeline-state-writer.sh — Writes pipeline state to .apex/state/pipeline.json
# Triggered by PostToolUse hooks, infers current phase from tool patterns
# Dual-write: local JSON first, then Supabase (non-blocking background curl).
#
# Hook input: JSON via stdin with tool_name, tool_input fields.
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
PIPELINE_FILE="$STATE_DIR/pipeline.json"
SESSION_FILE="$STATE_DIR/session.json"

mkdir -p "$STATE_DIR"

# Require jq — nothing to do without it
if ! command -v jq &>/dev/null; then
  exit 0
fi

# Read hook input from stdin (Claude Code passes JSON via stdin)
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null || true)
TOOL_INPUT_RAW=$(echo "$INPUT" | jq -c '.tool_input // {}' 2>/dev/null || true)

# Initialize pipeline file if missing
if [ ! -f "$PIPELINE_FILE" ]; then
  jq -n '{
    currentPhase: 0,
    phases: [
      {id:1,name:"Plan",status:"idle"},
      {id:2,name:"Architect",status:"idle"},
      {id:3,name:"Decompose",status:"idle"},
      {id:4,name:"Verify",status:"idle"},
      {id:5,name:"Build",status:"idle"},
      {id:6,name:"Quality",status:"idle"},
      {id:7,name:"Ship",status:"idle"}
    ]
  }' > "$PIPELINE_FILE"
fi

# Read session_id for Supabase dual-write
SESSION_ID=""
if [ -f "$SESSION_FILE" ]; then
  SESSION_ID=$(jq -r '.sessionId // empty' "$SESSION_FILE" 2>/dev/null || true)
fi

# Infer phase from tool name
PHASE=0
PHASE_NAME=""
case "$TOOL_NAME" in
  Skill)
    SKILL_NAME=$(echo "$TOOL_INPUT_RAW" | jq -r '.skill // ""' 2>/dev/null || true)
    case "$SKILL_NAME" in
      prd)                          PHASE=1; PHASE_NAME="Plan" ;;
      architecture)                 PHASE=2; PHASE_NAME="Architect" ;;
      teams)                        PHASE=3; PHASE_NAME="Decompose" ;;
      verify-api|verify-lib)        PHASE=4; PHASE_NAME="Verify" ;;
      qa|security|a11y|cx-review)   PHASE=6; PHASE_NAME="Quality" ;;
      ship|changelog)               PHASE=7; PHASE_NAME="Ship" ;;
    esac
    ;;
  Agent)
    AGENT_TYPE=$(echo "$TOOL_INPUT_RAW" | jq -r '.subagent_type // ""' 2>/dev/null || true)
    case "$AGENT_TYPE" in
      project-manager)   PHASE=3; PHASE_NAME="Decompose" ;;
      builder)           PHASE=5; PHASE_NAME="Build" ;;
      qa)                PHASE=6; PHASE_NAME="Quality" ;;
      design-reviewer)   PHASE=4; PHASE_NAME="Verify" ;;
      watcher)           PHASE=5; PHASE_NAME="Build" ;;
      technical-writer)  PHASE=7; PHASE_NAME="Ship" ;;
    esac
    ;;
  TaskCreate|TaskUpdate)
    # Build phase — tasks are being managed
    PHASE=5; PHASE_NAME="Build"
    ;;
esac

# Only update if we detected a phase
if [ "$PHASE" -gt 0 ]; then
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  jq --argjson phase "$PHASE" --arg ts "$TIMESTAMP" \
    '.currentPhase = $phase |
     (.phases[] | select(.id == $phase)) |= (.status = "active" | .startedAt = (if .startedAt then .startedAt else $ts end)) |
     (.phases[] | select(.id < $phase and .status == "active")) |= (.status = "complete" | .completedAt = $ts)' \
    "$PIPELINE_FILE" > "${PIPELINE_FILE}.tmp" && mv "${PIPELINE_FILE}.tmp" "$PIPELINE_FILE" 2>/dev/null || true

  # ── Supabase dual-write (non-blocking) ──────────────────────────────────────
  # Uses sb_secret_ key (new Supabase API keys, post-Nov 2025).
  # apikey header only — Authorization: Bearer does NOT work with sb_secret_ keys.
  SB_KEY="${SUPABASE_SB_SECRET_KEY:-${SUPABASE_SECRET_KEY:-}}"
  if [ -n "$SESSION_ID" ] && [ -n "${SUPABASE_URL:-}" ] && [ -n "$SB_KEY" ]; then
    SB_PAYLOAD=$(jq -n \
      --arg session_id "$SESSION_ID" \
      --argjson phase_id "$PHASE" \
      --arg name "$PHASE_NAME" \
      --arg ts "$TIMESTAMP" \
      '{
        session_id: $session_id,
        phase_id: $phase_id,
        name: $name,
        status: "active",
        started_at: $ts
      }' 2>/dev/null)

    if [ -n "$SB_PAYLOAD" ]; then
      curl -sf -X POST "${SUPABASE_URL}/rest/v1/pipeline_phases" \
        -H "apikey: ${SB_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: resolution=merge-duplicates" \
        -d "$SB_PAYLOAD" --max-time 3 &>/dev/null &
    fi

    # Mark earlier phases as complete
    PREV_PHASE=$((PHASE - 1))
    if [ "$PREV_PHASE" -gt 0 ]; then
      for P in $(seq 1 "$PREV_PHASE"); do
        curl -sf -X PATCH "${SUPABASE_URL}/rest/v1/pipeline_phases?session_id=eq.${SESSION_ID}&phase_id=eq.${P}&status=eq.active" \
          -H "apikey: ${SB_KEY}" \
          -H "Content-Type: application/json" \
          -d '{"status":"complete","completed_at":"'"$TIMESTAMP"'"}' --max-time 3 &>/dev/null &
      done
    fi
  fi
fi

exit 0
