#!/bin/bash
# rag-post-edit.sh — PostToolUse hook for Edit/Write
# Detects if a framework file was edited and triggers incremental RAG sync.
# Runs in background to avoid blocking the edit flow.
#
# by Bueno & Claude · São Paulo, 2026

set -uo pipefail

# Skip if Supabase not configured
[[ -z "${SUPABASE_URL:-}" ]] && exit 0
[[ -z "${SUPABASE_SECRET_KEY:-}" ]] && exit 0

INPUT=$(cat 2>/dev/null || true)
[[ -z "$INPUT" ]] && exit 0

# Extract the file path from the hook payload
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty' 2>/dev/null)
[[ -z "$FILE_PATH" ]] && exit 0

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
RAG_SYNC="$PROJECT_DIR/docs/supabase-rag/rag-sync.sh"

# Only trigger for framework files
case "$FILE_PATH" in
  *.claude/agents/*.md|*.claude/skills/*/SKILL.md|*.claude/scripts/*.sh|*.claude/rules/*.md|*/CLAUDE.md|*/docs/design-dna/principles.md)
    # Make path relative if absolute
    REL_PATH="${FILE_PATH#$PROJECT_DIR/}"

    if [[ -f "$RAG_SYNC" ]]; then
      # Fire-and-forget background sync for this one file
      nohup bash "$RAG_SYNC" --file "$REL_PATH" --quiet > /dev/null 2>&1 < /dev/null &
    fi
    ;;
esac

exit 0
