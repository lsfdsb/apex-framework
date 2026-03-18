#!/bin/bash
# extract-session.sh — Extracts the current Claude Code session into readable text
# Used by the framework-evolver agent to analyze the full interaction
#
# Usage: bash .claude/scripts/extract-session.sh [max_lines]
# Output: Human-readable session transcript to stdout

set -euo pipefail

if ! command -v python3 &>/dev/null; then
  echo "ERROR: python3 is required but not installed." >&2
  exit 1
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
MAX_LINES="${1:-500}"

# Claude Code stores sessions in ~/.claude/projects/{sanitized-project-path}/
# CLAUDE_PROJECT_DIR points to the actual project, not the session storage dir.
SESSIONS_BASE="$HOME/.claude/projects"
SANITIZED=$(echo "$PROJECT_DIR" | sed 's|/|-|g')
SESSION_DIR="${SESSIONS_BASE}/${SANITIZED}"

# Strategy 1: Look in the sanitized project directory
LATEST_SESSION=""
if [ -d "$SESSION_DIR" ]; then
  LATEST_SESSION=$(ls -t "$SESSION_DIR"/*.jsonl 2>/dev/null | head -1)
fi

# Strategy 2: Search across all project directories
if [ -z "$LATEST_SESSION" ] && [ -d "$SESSIONS_BASE" ]; then
  LATEST_SESSION=$(find "$SESSIONS_BASE" -name "*.jsonl" -type f -exec ls -t {} + 2>/dev/null | head -1)
fi

if [ -z "$LATEST_SESSION" ]; then
  echo "ERROR: No session logs found in $SESSION_DIR or $SESSIONS_BASE"
  echo "  (PROJECT_DIR=$PROJECT_DIR, SANITIZED=$SANITIZED)"
  exit 1
fi

SESSION_ID=$(basename "$LATEST_SESSION" .jsonl)
echo "=== APEX Session Transcript ==="
echo "Session: $SESSION_ID"
echo "Extracted: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "================================"
echo ""

# Parse JSONL and extract readable conversation
python3 -c "
import json
import sys
import os

max_lines = int(sys.argv[1])
session_file = sys.argv[2]

messages = []
with open(session_file, 'r') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            entry = json.loads(line)
            messages.append(entry)
        except json.JSONDecodeError:
            continue

line_count = 0

for entry in messages:
    if line_count >= max_lines:
        print(f'\n... (truncated at {max_lines} lines, use extract-session.sh <N> for more)')
        break

    msg_type = entry.get('type', '')
    timestamp = entry.get('timestamp', '')[:19]  # trim to seconds
    message = entry.get('message', {})

    if msg_type == 'user':
        content = message.get('content', '')
        if isinstance(content, str) and content.strip():
            # Skip system-reminder content for readability
            if '<system-reminder>' not in content:
                print(f'[{timestamp}] USER:')
                print(f'  {content[:500]}')
                print()
                line_count += 4

    elif msg_type == 'assistant':
        content = message.get('content', [])
        if isinstance(content, list):
            for block in content:
                if line_count >= max_lines:
                    break
                if isinstance(block, dict):
                    block_type = block.get('type', '')

                    if block_type == 'text':
                        text = block.get('text', '')
                        if text.strip():
                            # Truncate long text blocks
                            display = text[:300]
                            if len(text) > 300:
                                display += '...'
                            print(f'[{timestamp}] CLAUDE:')
                            print(f'  {display}')
                            print()
                            line_count += 4

                    elif block_type == 'tool_use':
                        tool = block.get('name', 'unknown')
                        tool_input = block.get('input', {})
                        # Summarize tool calls
                        if tool == 'Read':
                            target = tool_input.get('file_path', '?')
                            print(f'[{timestamp}] TOOL: Read → {target}')
                        elif tool == 'Write':
                            target = tool_input.get('file_path', '?')
                            print(f'[{timestamp}] TOOL: Write → {target}')
                        elif tool == 'Edit':
                            target = tool_input.get('file_path', '?')
                            print(f'[{timestamp}] TOOL: Edit → {target}')
                        elif tool == 'Bash':
                            cmd = tool_input.get('command', '?')[:100]
                            print(f'[{timestamp}] TOOL: Bash → {cmd}')
                        elif tool == 'Glob':
                            pat = tool_input.get('pattern', '?')
                            print(f'[{timestamp}] TOOL: Glob → {pat}')
                        elif tool == 'Grep':
                            pat = tool_input.get('pattern', '?')
                            print(f'[{timestamp}] TOOL: Grep → {pat}')
                        elif tool == 'Agent':
                            desc = tool_input.get('description', '?')
                            print(f'[{timestamp}] TOOL: Agent → {desc}')
                        elif tool == 'Skill':
                            skill = tool_input.get('skill', '?')
                            print(f'[{timestamp}] TOOL: Skill → /{skill}')
                        else:
                            print(f'[{timestamp}] TOOL: {tool}')
                        line_count += 1

                    elif block_type == 'thinking':
                        # Include thinking summaries — gold for gap analysis
                        thinking = block.get('thinking', '')
                        if thinking.strip():
                            summary = thinking[:200]
                            if len(thinking) > 200:
                                summary += '...'
                            print(f'[{timestamp}] THINKING:')
                            print(f'  {summary}')
                            print()
                            line_count += 4

    elif msg_type == 'tool_result':
        # Check for errors — key friction indicator
        content = message.get('content', '')
        is_error = entry.get('isError', False)
        if is_error:
            error_text = ''
            if isinstance(content, str):
                error_text = content[:200]
            elif isinstance(content, list):
                for c in content:
                    if isinstance(c, dict) and c.get('type') == 'text':
                        error_text = c.get('text', '')[:200]
                        break
            if error_text:
                print(f'[{timestamp}] ❌ ERROR:')
                print(f'  {error_text}')
                print()
                line_count += 4
" "$MAX_LINES" "$LATEST_SESSION"
