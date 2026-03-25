#!/bin/bash
# manifest-generate.sh — SessionStart hook
# Generates .claude/.manifest.json with framework component map
# Gives agents 360-degree framework awareness

set -uo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
MANIFEST="$PROJECT_DIR/.claude/.manifest.json"

# Detect repo type: framework vs project
REPO_TYPE="project"
if [ -f "$PROJECT_DIR/VERSION" ] && [ -f "$PROJECT_DIR/install.sh" ] && [ -d "$PROJECT_DIR/.claude/skills" ]; then
  REPO_TYPE="framework"
fi

# Count components
AGENT_COUNT=$(ls "$PROJECT_DIR/.claude/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
SKILL_COUNT=$(find "$PROJECT_DIR/.claude/skills" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
SCRIPT_COUNT=$(ls "$PROJECT_DIR/.claude/scripts/"*.sh 2>/dev/null | wc -l | tr -d ' ')
RULE_COUNT=$(ls "$PROJECT_DIR/.claude/rules/"*.md 2>/dev/null | grep -v README | wc -l | tr -d ' ')

# List agent names
AGENTS="[]"
if [ -d "$PROJECT_DIR/.claude/agents" ]; then
  AGENTS=$(ls "$PROJECT_DIR/.claude/agents/"*.md 2>/dev/null | while read -r f; do
    basename "$f" .md
  done | jq -Rs 'split("\n") | map(select(length>0))')
fi

# List skill names
SKILLS="[]"
if [ -d "$PROJECT_DIR/.claude/skills" ]; then
  SKILLS=$(find "$PROJECT_DIR/.claude/skills" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | while read -r d; do
    basename "$d"
  done | jq -Rs 'split("\n") | map(select(length>0))')
fi

# List script names
SCRIPTS="[]"
if [ -d "$PROJECT_DIR/.claude/scripts" ]; then
  SCRIPTS=$(ls "$PROJECT_DIR/.claude/scripts/"*.sh 2>/dev/null | while read -r f; do
    basename "$f"
  done | jq -Rs 'split("\n") | map(select(length>0))')
fi

# Build cross-reference map: agent → skills it uses
AGENT_SKILLS="{}"
if [ -d "$PROJECT_DIR/.claude/agents" ]; then
  AGENT_SKILLS=$(
    for f in "$PROJECT_DIR/.claude/agents/"*.md; do
      [ -f "$f" ] || continue
      name=$(basename "$f" .md)
      skills=$(grep "^skills:" "$f" 2>/dev/null | sed 's/^skills: *//' | tr -d ' ')
      if [ -n "$skills" ]; then
        echo "$name|$skills"
      fi
    done | jq -Rs '
      split("\n") | map(select(length>0)) |
      map(split("|")) |
      map({key: .[0], value: (.[1] // "" | split(",") | map(select(length>0)))}) |
      from_entries
    '
  )
fi

# Detect project stack
HAS_PACKAGE_JSON="false"
HAS_TYPESCRIPT="false"
HAS_REACT="false"
[ -f "$PROJECT_DIR/package.json" ] && HAS_PACKAGE_JSON="true"
[ -f "$PROJECT_DIR/tsconfig.json" ] && HAS_TYPESCRIPT="true"
grep -q '"react"' "$PROJECT_DIR/package.json" 2>/dev/null && HAS_REACT="true"

# Generate manifest
cat > "$MANIFEST" <<MANIFEST_EOF
{
  "generated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "repo_type": "$REPO_TYPE",
  "version": "$(cat "$PROJECT_DIR/VERSION" 2>/dev/null || echo "unknown")",
  "stack": {
    "package_json": $HAS_PACKAGE_JSON,
    "typescript": $HAS_TYPESCRIPT,
    "react": $HAS_REACT
  },
  "counts": {
    "agents": $AGENT_COUNT,
    "skills": $SKILL_COUNT,
    "scripts": $SCRIPT_COUNT,
    "rules": $RULE_COUNT
  },
  "components": {
    "agents": $AGENTS,
    "skills": $SKILLS,
    "scripts": $SCRIPTS
  },
  "cross_references": {
    "agent_skills": $AGENT_SKILLS
  }
}
MANIFEST_EOF

echo "{\"additionalContext\": \"Framework manifest generated: $REPO_TYPE repo, $AGENT_COUNT agents, $SKILL_COUNT skills, $SCRIPT_COUNT scripts\"}"
exit 0
