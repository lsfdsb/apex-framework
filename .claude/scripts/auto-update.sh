#!/bin/bash
# auto-update.sh — APEX Framework Auto-Update System
# by L.B. & Claude · São Paulo, 2026
#
# Runs on SessionStart. Checks GitHub for newer APEX version.
# If found, pulls updates and re-installs silently.
#
# Design principles:
#   - Non-blocking: network failure = skip silently
#   - Fast: uses GitHub API (no full clone needed)
#   - Safe: backs up before updating, validates before applying
#   - Respectful: user can opt-out via preferences
#   - Minimal output: only reports when something actually updates

set -euo pipefail

# ── Configuration (defaults, overridable via preferences) ──
PREF_FILE="$HOME/.claude/apex-preferences.json"
USER_CLAUDE="$HOME/.claude"
APEX_CACHE="$HOME/.apex-framework"
APEX_LOCK="$APEX_CACHE/.update-lock"
UPDATE_LOG="$APEX_CACHE/update.log"
TIMEOUT_SECONDS=10

# Read repo/branch from preferences (allows forks)
APEX_REPO="lsfdsb/apex-framework"
APEX_BRANCH="main"
if [ -f "$PREF_FILE" ] && command -v jq &>/dev/null; then
  CUSTOM_REPO=$(jq -r '.update_repo // ""' "$PREF_FILE" 2>/dev/null)
  CUSTOM_BRANCH=$(jq -r '.update_branch // ""' "$PREF_FILE" 2>/dev/null)
  [ -n "$CUSTOM_REPO" ] && APEX_REPO="$CUSTOM_REPO"
  [ -n "$CUSTOM_BRANCH" ] && APEX_BRANCH="$CUSTOM_BRANCH"
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

# ── Check if auto-update is enabled ──
if [ -f "$PREF_FILE" ] && command -v jq &>/dev/null; then
  AUTO_UPDATE=$(jq -r '.auto_update // true' "$PREF_FILE" 2>/dev/null)
  if [ "$AUTO_UPDATE" = "false" ]; then
    exit 0
  fi
fi

# ── Prevent concurrent updates ──
if [ -f "$APEX_LOCK" ]; then
  LOCK_AGE=$(( $(date +%s) - $(stat -c %Y "$APEX_LOCK" 2>/dev/null || echo "0") ))
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

# Priority 1: VERSION file in the cached repo
if [ -f "$APEX_CACHE/VERSION" ]; then
  LOCAL_VERSION=$(cat "$APEX_CACHE/VERSION" 2>/dev/null | tr -d '[:space:]')
fi

# Priority 2: VERSION file in project dir (if running from APEX repo)
if [ -z "$LOCAL_VERSION" ] && [ -n "${CLAUDE_PROJECT_DIR:-}" ] && [ -f "$CLAUDE_PROJECT_DIR/VERSION" ]; then
  LOCAL_VERSION=$(cat "$CLAUDE_PROJECT_DIR/VERSION" 2>/dev/null | tr -d '[:space:]')
fi

# Priority 3: Installed version marker
if [ -z "$LOCAL_VERSION" ] && [ -f "$APEX_CACHE/.installed-version" ]; then
  LOCAL_VERSION=$(cat "$APEX_CACHE/.installed-version" 2>/dev/null | tr -d '[:space:]')
fi

# If no version found, this is a first install — set to 0.0.0 to force update
if [ -z "$LOCAL_VERSION" ]; then
  LOCAL_VERSION="0.0.0"
fi

# ── Get remote version from GitHub ──
REMOTE_VERSION=""

# Try GitHub raw content (fastest — single file, no API rate limit)
if command -v curl &>/dev/null; then
  REMOTE_VERSION=$(curl -sf --connect-timeout "$TIMEOUT_SECONDS" --max-time "$TIMEOUT_SECONDS" \
    "https://raw.githubusercontent.com/${APEX_REPO}/${APEX_BRANCH}/VERSION" 2>/dev/null | tr -d '[:space:]' || true)
fi

# Fallback: try wget if curl failed
if [ -z "$REMOTE_VERSION" ] && command -v wget &>/dev/null; then
  REMOTE_VERSION=$(wget -qO- --timeout="$TIMEOUT_SECONDS" \
    "https://raw.githubusercontent.com/${APEX_REPO}/${APEX_BRANCH}/VERSION" 2>/dev/null | tr -d '[:space:]' || true)
fi

# If we can't reach GitHub, skip silently
if [ -z "$REMOTE_VERSION" ]; then
  log "Skipped: could not reach GitHub (network issue or rate limit)"
  date +%s > "$LAST_CHECK_FILE"
  exit 0
fi

# ── Compare versions ──
# Semantic version comparison: returns 0 if $1 > $2
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

# Clone or pull the repo
if [ -d "$APEX_CACHE/.git" ]; then
  # Existing clone — pull latest
  cd "$APEX_CACHE"
  git fetch origin "$APEX_BRANCH" --depth=1 2>/dev/null || {
    log "Failed to fetch updates"
    exit 0
  }
  git reset --hard "origin/$APEX_BRANCH" 2>/dev/null || {
    log "Failed to reset to latest"
    exit 0
  }
else
  # Fresh clone (shallow for speed)
  rm -rf "$APEX_CACHE"
  git clone --depth=1 --branch "$APEX_BRANCH" \
    "https://github.com/${APEX_REPO}.git" "$APEX_CACHE" 2>/dev/null || {
    log "Failed to clone repo"
    mkdir -p "$APEX_CACHE"
    exit 0
  }
fi

# ── Validate the downloaded repo ──
if [ ! -f "$APEX_CACHE/VERSION" ] || [ ! -d "$APEX_CACHE/.claude/scripts" ] || [ ! -d "$APEX_CACHE/.claude/skills" ]; then
  log "ERROR: Downloaded repo is invalid (missing VERSION, scripts, or skills)"
  exit 0
fi

# ── Backup current installation ──
BACKUP_DIR="$APEX_CACHE/.backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"
for dir in scripts skills agents output-styles rules; do
  if [ -d "$USER_CLAUDE/$dir" ]; then
    cp -r "$USER_CLAUDE/$dir" "$BACKUP_DIR/" 2>/dev/null || true
  fi
done
log "Backup saved to $BACKUP_DIR"

# ── Apply updates ──
UPDATE_COUNT=0

# Update scripts
if [ -d "$APEX_CACHE/.claude/scripts" ]; then
  for script in "$APEX_CACHE"/.claude/scripts/*.sh; do
    if [ -f "$script" ]; then
      BASENAME=$(basename "$script")
      cp "$script" "$USER_CLAUDE/scripts/$BASENAME"
      chmod +x "$USER_CLAUDE/scripts/$BASENAME"
      UPDATE_COUNT=$((UPDATE_COUNT + 1))
    fi
  done
fi

# Update universal skills
UNIVERSAL_SKILLS=(
  "code-standards" "design-system" "cx-review" "teach" "workflow-enforcer"
  "apex-stack" "verify-lib" "sql-practices" "debug" "apex-review" "a11y"
  "set-language" "cost-management" "about" "performance" "security"
)
for skill in "${UNIVERSAL_SKILLS[@]}"; do
  if [ -d "$APEX_CACHE/.claude/skills/$skill" ]; then
    cp -r "$APEX_CACHE/.claude/skills/$skill" "$USER_CLAUDE/skills/"
    UPDATE_COUNT=$((UPDATE_COUNT + 1))
  fi
done

# Update agents
if [ -d "$APEX_CACHE/.claude/agents" ]; then
  for agent in "$APEX_CACHE"/.claude/agents/*.md; do
    if [ -f "$agent" ]; then
      cp "$agent" "$USER_CLAUDE/agents/"
      UPDATE_COUNT=$((UPDATE_COUNT + 1))
    fi
  done
fi

# Update output styles
if [ -d "$APEX_CACHE/.claude/output-styles" ]; then
  for style in "$APEX_CACHE"/.claude/output-styles/*.md; do
    if [ -f "$style" ]; then
      cp "$style" "$USER_CLAUDE/output-styles/"
      UPDATE_COUNT=$((UPDATE_COUNT + 1))
    fi
  done
fi

# Update path-based rules
if [ -d "$APEX_CACHE/.claude/rules" ]; then
  for rule in "$APEX_CACHE"/.claude/rules/*.md; do
    if [ -f "$rule" ]; then
      cp "$rule" "$USER_CLAUDE/rules/"
      UPDATE_COUNT=$((UPDATE_COUNT + 1))
    fi
  done
fi

# Update user-level CLAUDE.md (only if repo has one)
if [ -f "$APEX_CACHE/.claude/CLAUDE.md" ]; then
  cp "$APEX_CACHE/.claude/CLAUDE.md" "$USER_CLAUDE/CLAUDE.md"
  UPDATE_COUNT=$((UPDATE_COUNT + 1))
fi

# ── Save installed version ──
echo "$REMOTE_VERSION" > "$APEX_CACHE/.installed-version"

log "Update complete: v$LOCAL_VERSION → v$REMOTE_VERSION ($UPDATE_COUNT files updated)"

# ── Output to Claude context (stdout goes to Claude) ──
echo ""
echo "🔄 APEX Auto-Update: v$LOCAL_VERSION → v$REMOTE_VERSION"
echo "   $UPDATE_COUNT files updated. Backup saved."
echo "   Changelog: https://github.com/${APEX_REPO}/releases"
echo ""

exit 0
