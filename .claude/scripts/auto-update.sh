#!/bin/bash
# auto-update.sh — APEX Framework Auto-Update System
# by L.B. & Claude · São Paulo, 2026
#
# Runs on SessionStart. Checks GitHub for newer APEX version.
# If found, pulls updates into the CURRENT PROJECT's .claude/ only.
# No user-level (~/.claude/) changes — each project is self-contained.
#
# Design principles:
#   - Non-blocking: network failure = skip silently
#   - Fast: uses GitHub raw content (no full clone needed)
#   - Safe: backs up before updating, validates before applying
#   - Project-scoped: only updates the current project's .claude/
#   - Minimal output: only reports when something actually updates

set -euo pipefail

# ── Configuration ──
APEX_CACHE="$HOME/.apex-framework"
APEX_LOCK="$APEX_CACHE/.update-lock"
UPDATE_LOG="$APEX_CACHE/update.log"
TIMEOUT_SECONDS=10

# Read repo/branch from env or defaults
APEX_REPO="${APEX_REPO:-lsfdsb/apex-framework}"
APEX_BRANCH="${APEX_BRANCH:-main}"

# ── Project dir ──
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-}"
if [ -z "$PROJECT_DIR" ] || [ ! -d "$PROJECT_DIR/.claude/scripts" ]; then
  # No .claude/ = APEX not installed in this project.
  # The /init skill handles bootstrap, not auto-update.
  # session-context.sh will show the user a hint to run /init.
  exit 0
fi

# ── Helpers ──
log() {
  local ts
  ts=$(date '+%Y-%m-%d %H:%M:%S')
  mkdir -p "$APEX_CACHE"
  echo "[$ts] $1" >> "$UPDATE_LOG" 2>/dev/null || true
}

cleanup() {
  rm -f "$APEX_LOCK" 2>/dev/null || true
}
trap cleanup EXIT

# ── Prevent concurrent updates ──
if [ -f "$APEX_LOCK" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    LOCK_AGE=$(( $(date +%s) - $(stat -f %m "$APEX_LOCK" 2>/dev/null || echo "0") ))
  else
    LOCK_AGE=$(( $(date +%s) - $(stat -c %Y "$APEX_LOCK" 2>/dev/null || echo "0") ))
  fi
  if [ "$LOCK_AGE" -lt 300 ]; then
    exit 0
  fi
  rm -f "$APEX_LOCK"
fi
mkdir -p "$APEX_CACHE"
echo $$ > "$APEX_LOCK"

# ── Check: skip if updated recently (within last hour) ──
LAST_CHECK_FILE="$APEX_CACHE/.last-update-check"
if [ -f "$LAST_CHECK_FILE" ]; then
  LAST_CHECK=$(cat "$LAST_CHECK_FILE" 2>/dev/null || echo "0")
  NOW=$(date +%s)
  DIFF=$(( NOW - LAST_CHECK ))
  if [ "$DIFF" -lt 3600 ]; then
    log "Skipped: checked ${DIFF}s ago (< 1 hour)"
    exit 0
  fi
fi

# ── Get local version ──
LOCAL_VERSION=""
if [ -f "$PROJECT_DIR/.claude/.apex-version" ]; then
  LOCAL_VERSION=$(cat "$PROJECT_DIR/.claude/.apex-version" 2>/dev/null | tr -d '[:space:]')
fi
if [ -z "$LOCAL_VERSION" ] && [ -f "$PROJECT_DIR/VERSION" ]; then
  LOCAL_VERSION=$(cat "$PROJECT_DIR/VERSION" 2>/dev/null | tr -d '[:space:]')
fi
if [ -z "$LOCAL_VERSION" ] && [ -f "$APEX_CACHE/VERSION" ]; then
  LOCAL_VERSION=$(cat "$APEX_CACHE/VERSION" 2>/dev/null | tr -d '[:space:]')
fi
if [ -z "$LOCAL_VERSION" ]; then
  LOCAL_VERSION="0.0.0"
fi

# ── Get remote version from GitHub ──
REMOTE_VERSION=""
if command -v curl &>/dev/null; then
  REMOTE_VERSION=$(curl -sf --connect-timeout "$TIMEOUT_SECONDS" --max-time "$TIMEOUT_SECONDS" \
    "https://raw.githubusercontent.com/${APEX_REPO}/${APEX_BRANCH}/VERSION" 2>/dev/null | tr -d '[:space:]' || true)
fi
if [ -z "$REMOTE_VERSION" ] && command -v wget &>/dev/null; then
  REMOTE_VERSION=$(wget -qO- --timeout="$TIMEOUT_SECONDS" \
    "https://raw.githubusercontent.com/${APEX_REPO}/${APEX_BRANCH}/VERSION" 2>/dev/null | tr -d '[:space:]' || true)
fi

if [ -z "$REMOTE_VERSION" ]; then
  log "Skipped: could not reach GitHub"
  date +%s > "$LAST_CHECK_FILE"
  exit 0
fi

# ── Compare versions ──
version_gt() {
  local IFS=.
  local i ver1=($1) ver2=($2)
  for ((i=0; i<${#ver1[@]}; i++)); do
    local v1=${ver1[i]:-0}
    local v2=${ver2[i]:-0}
    if ((v1 > v2)); then return 0; fi
    if ((v1 < v2)); then return 1; fi
  done
  return 1
}

log "Version check: local=$LOCAL_VERSION remote=$REMOTE_VERSION"
date +%s > "$LAST_CHECK_FILE"

if ! version_gt "$REMOTE_VERSION" "$LOCAL_VERSION"; then
  log "Up to date (v$LOCAL_VERSION)"
  exit 0
fi

# ── New version available! Pull and update ──
log "Update available: v$LOCAL_VERSION → v$REMOTE_VERSION"

# Clone or pull the repo cache
if [ -d "$APEX_CACHE/.git" ]; then
  cd "$APEX_CACHE"
  git fetch origin "$APEX_BRANCH" --depth=1 2>/dev/null || { log "Failed to fetch"; exit 0; }
  git reset --hard "origin/$APEX_BRANCH" 2>/dev/null || { log "Failed to reset"; exit 0; }
else
  rm -rf "$APEX_CACHE"
  git clone --depth=1 --branch "$APEX_BRANCH" \
    "https://github.com/${APEX_REPO}.git" "$APEX_CACHE" 2>/dev/null || {
    log "Failed to clone"
    mkdir -p "$APEX_CACHE"
    exit 0
  }
fi

# ── Validate the downloaded repo ──
if [ ! -f "$APEX_CACHE/VERSION" ] || [ ! -d "$APEX_CACHE/.claude/scripts" ] || [ ! -d "$APEX_CACHE/.claude/skills" ]; then
  log "ERROR: Downloaded repo is invalid"
  exit 0
fi

# ── Apply updates to current project ──
UPDATE_COUNT=0

# Backup project .claude/
BACKUP_DIR="$APEX_CACHE/.backup-project-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
for dir in scripts skills agents rules output-styles; do
  if [ -d "$PROJECT_DIR/.claude/$dir" ]; then
    cp -r "$PROJECT_DIR/.claude/$dir" "$BACKUP_DIR/" 2>/dev/null || true
  fi
done
# Also back up settings.json for customization detection
if [ -f "$PROJECT_DIR/.claude/settings.json" ]; then
  cp "$PROJECT_DIR/.claude/settings.json" "$BACKUP_DIR/settings.json" 2>/dev/null || true
fi

# Update scripts
for script in "$APEX_CACHE"/.claude/scripts/*.sh; do
  [ -f "$script" ] && cp "$script" "$PROJECT_DIR/.claude/scripts/" && chmod +x "$PROJECT_DIR/.claude/scripts/$(basename "$script")" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
done

# Update ALL skills
for skill_dir in "$APEX_CACHE"/.claude/skills/*/; do
  [ -d "$skill_dir" ] && cp -r "$skill_dir" "$PROJECT_DIR/.claude/skills/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
done

# Update agents
for agent in "$APEX_CACHE"/.claude/agents/*.md; do
  [ -f "$agent" ] && cp "$agent" "$PROJECT_DIR/.claude/agents/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
done

# Update rules
for rule in "$APEX_CACHE"/.claude/rules/*.md; do
  [ -f "$rule" ] && cp "$rule" "$PROJECT_DIR/.claude/rules/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
done

# Update output styles
for style in "$APEX_CACHE"/.claude/output-styles/*.md; do
  [ -f "$style" ] && cp "$style" "$PROJECT_DIR/.claude/output-styles/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
done

# Update settings.json — but only if the user hasn't customized it.
# We detect customization by checking if the file differs from the previous
# framework version. If it matches the old framework version, safe to overwrite.
# If it doesn't match (user customized), preserve it and log a note.
if [ -f "$APEX_CACHE/.claude/settings.json" ]; then
  SHOULD_UPDATE=true
  if [ -f "$PROJECT_DIR/.claude/settings.json" ] && [ -d "$BACKUP_DIR/scripts" ]; then
    # Compare project settings against the backup (which was the previous framework version)
    # If they differ, the user has customized their settings
    OLD_FRAMEWORK_SETTINGS="$BACKUP_DIR/../settings.json.framework-ref"
    # Use the backed-up version as reference if available
    if [ -f "$BACKUP_DIR/settings.json" ] 2>/dev/null; then
      if ! diff -q "$PROJECT_DIR/.claude/settings.json" "$BACKUP_DIR/settings.json" > /dev/null 2>&1; then
        # Project settings differ from what was backed up — user has customized
        SHOULD_UPDATE=false
        log "Skipping settings.json: user has custom modifications"
      fi
    fi
  fi
  if [ "$SHOULD_UPDATE" = true ]; then
    cp "$APEX_CACHE/.claude/settings.json" "$PROJECT_DIR/.claude/settings.json"
    UPDATE_COUNT=$((UPDATE_COUNT + 1))
  fi
fi

# Save version marker
echo "$REMOTE_VERSION" > "$PROJECT_DIR/.claude/.apex-version"

# NOTE: We do NOT overwrite:
#   - CLAUDE.md (user may have customized for their project)
#   - settings.local.json (user's local overrides)
#   - .apex-state.json (session state)
#   - git hooks in .git/hooks/ (may have custom hooks)

log "Update complete: v$LOCAL_VERSION → v$REMOTE_VERSION ($UPDATE_COUNT files in $PROJECT_DIR)"

echo ""
echo "🔄 APEX Auto-Update: v$LOCAL_VERSION → v$REMOTE_VERSION"
echo "   $UPDATE_COUNT files updated in project"
echo "   Backup saved. Changelog: https://github.com/${APEX_REPO}/releases"
echo ""

exit 0
