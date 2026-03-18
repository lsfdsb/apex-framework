#!/bin/bash
# auto-changelog.sh — PostToolUse hook on Bash
# Automatically appends conventional commits to CHANGELOG.md under [Unreleased].
# Idempotent: uses commit hash to prevent duplicates.
# by L.B. & Claude · São Paulo, 2026
#
# Mapping: feat→Added, fix→Fixed, security→Security,
#          refactor/perf/docs→Changed, chore/test→skipped

if ! command -v jq &> /dev/null; then
  exit 0
fi

# Portable sed in-place (macOS vs Linux)
_sed_i() { if [[ "$OSTYPE" == "darwin"* ]]; then sed -i '' "$@"; else sed -i "$@"; fi; }

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Gate: only act on git commit commands
if ! echo "$COMMAND" | grep -qE '^git\s+commit'; then
  exit 0
fi

# Find the project root (CHANGELOG.md location)
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
if [ -z "$PROJECT_DIR" ]; then
  exit 0
fi

CHANGELOG="${PROJECT_DIR}/CHANGELOG.md"
if [ ! -f "$CHANGELOG" ]; then
  exit 0
fi

# Get the actual committed message and hash from git (authoritative source)
SUBJECT=$(git log -1 --format='%s' 2>/dev/null)
SHORT_HASH=$(git log -1 --format='%h' 2>/dev/null)

if [ -z "$SUBJECT" ] || [ -z "$SHORT_HASH" ]; then
  exit 0
fi

# Deduplication: skip if this commit hash is already in the changelog
if grep -qF "(${SHORT_HASH})" "$CHANGELOG" 2>/dev/null; then
  exit 0
fi

# Extract conventional commit type
TYPE=$(echo "$SUBJECT" | sed -n 's/^\([a-z]*\).*/\1/p')

# Map to Keep a Changelog category
case "$TYPE" in
  feat)     CATEGORY="Added" ;;
  fix)      CATEGORY="Fixed" ;;
  security) CATEGORY="Security" ;;
  refactor) CATEGORY="Changed" ;;
  perf)     CATEGORY="Changed" ;;
  docs)     CATEGORY="Changed" ;;
  *)        exit 0 ;;  # chore, test, merge commits — skip
esac

# Clean description: strip "type(scope): " or "type: " prefix
DESC=$(echo "$SUBJECT" | sed 's/^[a-z]*\(([^)]*)\)*: //')

# Final entry line
ENTRY="- ${DESC} (${SHORT_HASH})"

# ── Insert into CHANGELOG.md ──
# Strategy: find [Unreleased] section, find or create ### Category, append entry

UNRELEASED_LINE=$(grep -n '## \[Unreleased\]' "$CHANGELOG" | head -1 | cut -d: -f1)

if [ -z "$UNRELEASED_LINE" ]; then
  # No [Unreleased] section — create it after the header (line 3)
  # Find the first ## line (version header) or end of file
  FIRST_VERSION=$(grep -n '^## \[' "$CHANGELOG" | head -1 | cut -d: -f1)
  if [ -n "$FIRST_VERSION" ]; then
    INSERT_AT=$((FIRST_VERSION - 1))
  else
    INSERT_AT=$(wc -l < "$CHANGELOG" | tr -d ' ')
  fi

  # Build the new section
  SECTION="\n## [Unreleased]\n\n### ${CATEGORY}\n${ENTRY}\n"

  # Insert using portable sed
  _sed_i "${INSERT_AT}a\\
\\
## [Unreleased]\\
\\
### ${CATEGORY}\\
${ENTRY}\\
" "$CHANGELOG"
  exit 0
fi

# [Unreleased] exists — look for ### Category within it
# Find the range: from [Unreleased] to the next ## [version] or EOF
NEXT_VERSION=$(tail -n +"$((UNRELEASED_LINE + 1))" "$CHANGELOG" | grep -n '^## \[' | head -1 | cut -d: -f1)
if [ -n "$NEXT_VERSION" ]; then
  SECTION_END=$((UNRELEASED_LINE + NEXT_VERSION - 1))
else
  SECTION_END=$(wc -l < "$CHANGELOG" | tr -d ' ')
fi

# Look for ### Category within the [Unreleased] section
CATEGORY_LINE=$(sed -n "${UNRELEASED_LINE},${SECTION_END}p" "$CHANGELOG" | grep -n "^### ${CATEGORY}$" | head -1 | cut -d: -f1)

if [ -n "$CATEGORY_LINE" ]; then
  # Category exists — find the insertion point (after the last entry in this category)
  ABS_CATEGORY=$((UNRELEASED_LINE + CATEGORY_LINE - 1))

  # Find the next ### or ## or blank-line-followed-by-### after the category header
  INSERT_AT=""
  LINE_NUM=$((ABS_CATEGORY + 1))
  while [ "$LINE_NUM" -le "$SECTION_END" ]; do
    LINE_CONTENT=$(sed -n "${LINE_NUM}p" "$CHANGELOG")
    # Stop at next section header
    if echo "$LINE_CONTENT" | grep -qE '^###? '; then
      INSERT_AT=$((LINE_NUM - 1))
      break
    fi
    # Stop at empty line that's followed by a header or end of section
    if [ -z "$LINE_CONTENT" ]; then
      NEXT_LINE=$(sed -n "$((LINE_NUM + 1))p" "$CHANGELOG")
      if [ -z "$NEXT_LINE" ] || echo "$NEXT_LINE" | grep -qE '^###? '; then
        INSERT_AT=$((LINE_NUM - 1))
        break
      fi
    fi
    LINE_NUM=$((LINE_NUM + 1))
  done

  # If we reached the end without finding a stop point
  if [ -z "$INSERT_AT" ]; then
    INSERT_AT=$((LINE_NUM - 1))
  fi

  _sed_i "${INSERT_AT}a\\
${ENTRY}" "$CHANGELOG"
else
  # Category doesn't exist — insert it after [Unreleased] header
  # Canonical order: Added, Changed, Fixed, Security, Removed
  # Find the right position based on order
  INSERT_AFTER=$((UNRELEASED_LINE))

  # Check if there's a blank line after [Unreleased], skip it
  NEXT_LINE_CONTENT=$(sed -n "$((UNRELEASED_LINE + 1))p" "$CHANGELOG")
  if [ -z "$NEXT_LINE_CONTENT" ]; then
    INSERT_AFTER=$((UNRELEASED_LINE + 1))
  fi

  # Find where to insert based on canonical order
  declare -a ORDER=("Added" "Changed" "Fixed" "Security" "Removed")
  TARGET_IDX=0
  for i in "${!ORDER[@]}"; do
    if [ "${ORDER[$i]}" = "$CATEGORY" ]; then
      TARGET_IDX=$i
      break
    fi
  done

  # Look for existing categories that should come AFTER ours
  BEST_INSERT=$INSERT_AFTER
  for ((i=TARGET_IDX+1; i<${#ORDER[@]}; i++)); do
    FOUND=$(sed -n "${UNRELEASED_LINE},${SECTION_END}p" "$CHANGELOG" | grep -n "^### ${ORDER[$i]}$" | head -1 | cut -d: -f1)
    if [ -n "$FOUND" ]; then
      # Insert before this category (which comes after ours alphabetically)
      BEST_INSERT=$((UNRELEASED_LINE + FOUND - 2))
      break
    fi
  done

  if [ "$BEST_INSERT" -eq "$INSERT_AFTER" ]; then
    # No later category found — insert right after [Unreleased] (+ blank line)
    _sed_i "${INSERT_AFTER}a\\
\\
### ${CATEGORY}\\
${ENTRY}" "$CHANGELOG"
  else
    # Insert before a later category
    _sed_i "${BEST_INSERT}a\\
\\
### ${CATEGORY}\\
${ENTRY}\\
" "$CHANGELOG"
  fi
fi

exit 0
