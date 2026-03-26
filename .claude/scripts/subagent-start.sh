#!/bin/bash
# subagent-start.sh — SubagentStart hook
# Injects framework intelligence into ALL agents before they start work.
#
# What each agent gets:
#   - RAG knowledge base access instructions (query.sh)
#   - Builder: Design DNA context
#   - All agents: framework search capability
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

# Read hook input from stdin
INPUT=$(cat)

AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty' 2>/dev/null)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
DNA_DIR="$PROJECT_DIR/docs/design-dna"
RAG_QUERY="$PROJECT_DIR/docs/supabase-rag/query.sh"

# ── RAG Knowledge Base Context (all agents) ──────────────────────────────────

RAG_CONTEXT=""
if [ -f "$RAG_QUERY" ]; then
  RAG_CONTEXT="FRAMEWORK KNOWLEDGE BASE: You can search the entire APEX framework using: bash docs/supabase-rag/query.sh search 'your question'. This searches all agent definitions, skills, scripts, rules, and past learnings. Use it BEFORE reading files directly — it's faster and more precise. Commands: search (hybrid keyword+semantic), refs (cross-references), learnings (past session knowledge), list (all components)."
fi

# ── Agent-Specific Context ────────────────────────────────────────────────────

AGENT_CONTEXT=""
case "$AGENT_TYPE" in
  builder)
    if [ -d "$DNA_DIR" ]; then
      AGENT_CONTEXT="DESIGN DNA: Read the matching template from docs/design-dna/templates/ before writing ANY UI component. Use 'bash docs/supabase-rag/query.sh search \"dashboard design tokens\" --type rule' to find relevant design rules."
    elif [ -d "$HOME/.apex-framework/docs/design-dna" ]; then
      AGENT_CONTEXT="DESIGN DNA at ~/.apex-framework/docs/design-dna/. Read the matching template before writing ANY UI component."
    fi
    ;;
  qa)
    AGENT_CONTEXT="QUALITY KNOWLEDGE: Use 'bash docs/supabase-rag/query.sh search \"quality gate checklist\"' to retrieve the full 7-phase gate. Use 'bash docs/supabase-rag/query.sh learnings \"regression\"' to check past quality issues."
    ;;
  design-reviewer)
    AGENT_CONTEXT="DESIGN KNOWLEDGE: Use 'bash docs/supabase-rag/query.sh search \"design principles\" --type rule' to retrieve the 10 design principles. Use refs to check DNA template routing."
    ;;
  project-manager)
    AGENT_CONTEXT="PM KNOWLEDGE: Use 'bash docs/supabase-rag/query.sh search \"ANPP milestone\"' to retrieve the Apple EPM template. Use refs to understand agent-skill dependencies."
    ;;
  watcher)
    AGENT_CONTEXT="WATCHER KNOWLEDGE: Use 'bash docs/supabase-rag/query.sh search \"convention scan\"' to retrieve monitoring patterns. Use learnings to check for recurring issues."
    ;;
  technical-writer)
    AGENT_CONTEXT="WRITER KNOWLEDGE: Use 'bash docs/supabase-rag/query.sh search \"changelog rules\"' to retrieve documentation standards. Use 'bash docs/supabase-rag/query.sh search \"Rules of the Road\"' for launch checklist template."
    ;;
esac

# ── Combine and Output ────────────────────────────────────────────────────────

FULL_CONTEXT=""
[ -n "$RAG_CONTEXT" ] && FULL_CONTEXT="$RAG_CONTEXT"
[ -n "$AGENT_CONTEXT" ] && FULL_CONTEXT="${FULL_CONTEXT:+$FULL_CONTEXT }$AGENT_CONTEXT"

if [ -n "$FULL_CONTEXT" ]; then
  # Escape for JSON
  ESCAPED=$(printf '%s' "$FULL_CONTEXT" | jq -Rs '.')
  echo "{\"hookSpecificOutput\":{\"additionalContext\":$ESCAPED}}"
fi

exit 0
