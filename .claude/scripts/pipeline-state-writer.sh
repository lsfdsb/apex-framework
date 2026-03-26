#!/bin/bash
# pipeline-state-writer.sh — Writes pipeline state to .apex/state/pipeline.json
# Triggered by PostToolUse hooks, infers current phase from tool patterns
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
STATE_DIR="$PROJECT_DIR/.apex/state"
PIPELINE_FILE="$STATE_DIR/pipeline.json"

mkdir -p "$STATE_DIR"

TOOL_NAME="${CLAUDE_TOOL_NAME:-}"

# Require jq — nothing to do without it
if ! command -v jq &>/dev/null; then
  exit 0
fi

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

# Infer phase from tool name
PHASE=0
case "$TOOL_NAME" in
  Skill)
    SKILL_NAME=$(echo "${CLAUDE_TOOL_INPUT:-}" | jq -r '.skill // ""' 2>/dev/null || true)
    case "$SKILL_NAME" in
      prd)                          PHASE=1 ;;
      architecture)                 PHASE=2 ;;
      teams)                        PHASE=3 ;;
      verify-api|verify-lib)        PHASE=4 ;;
      qa|security|a11y|cx-review)   PHASE=6 ;;
      ship|changelog)               PHASE=7 ;;
    esac
    ;;
  Agent)
    AGENT_TYPE=$(echo "${CLAUDE_TOOL_INPUT:-}" | jq -r '.subagent_type // ""' 2>/dev/null || true)
    case "$AGENT_TYPE" in
      project-manager)   PHASE=3 ;;
      builder)           PHASE=5 ;;
      qa)                PHASE=6 ;;
      design-reviewer)   PHASE=4 ;;
      watcher)           PHASE=5 ;;
      technical-writer)  PHASE=7 ;;
    esac
    ;;
  TaskCreate|TaskUpdate)
    # Build phase — tasks are being managed
    PHASE=5
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
fi

exit 0
