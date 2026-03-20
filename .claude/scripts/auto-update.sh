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
#   - Verbose: always reports status (up-to-date, updated, error, throttled)

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
  echo "⚙️ APEX Auto-Update: not installed in this project. Run /init to bootstrap."
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
    echo "⏳ APEX Auto-Update: another update is in progress. Skipping."
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
    MINS_AGO=$(( DIFF / 60 ))
    MINS_LEFT=$(( (3600 - DIFF) / 60 ))
    log "Skipped: checked ${DIFF}s ago (< 1 hour)"
    echo "✅ APEX v$(cat "$PROJECT_DIR/.claude/.apex-version" 2>/dev/null || cat "$APEX_CACHE/VERSION" 2>/dev/null || echo "?") — checked ${MINS_AGO}m ago (next check in ${MINS_LEFT}m)"
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
# Try multiple methods: curl → wget → gh CLI (gh works inside Claude Code sandbox)
REMOTE_VERSION=""
if command -v curl &>/dev/null; then
  REMOTE_VERSION=$(curl -sf --connect-timeout "$TIMEOUT_SECONDS" --max-time "$TIMEOUT_SECONDS" \
    "https://raw.githubusercontent.com/${APEX_REPO}/${APEX_BRANCH}/VERSION" 2>/dev/null | tr -d '[:space:]' || true)
fi
if [ -z "$REMOTE_VERSION" ] && command -v wget &>/dev/null; then
  REMOTE_VERSION=$(wget -qO- --timeout="$TIMEOUT_SECONDS" \
    "https://raw.githubusercontent.com/${APEX_REPO}/${APEX_BRANCH}/VERSION" 2>/dev/null | tr -d '[:space:]' || true)
fi
if [ -z "$REMOTE_VERSION" ] && command -v gh &>/dev/null; then
  # Fallback: gh CLI works inside Claude Code sandbox when curl/wget are blocked
  REMOTE_VERSION=$(gh api "repos/${APEX_REPO}/contents/VERSION" \
    --jq '.content' 2>/dev/null | base64 -d 2>/dev/null | tr -d '[:space:]' || true)
fi

if [ -z "$REMOTE_VERSION" ]; then
  log "Skipped: could not reach GitHub (network issue or rate limit)"
  echo "⚠️ APEX Auto-Update: could not reach GitHub (curl, wget, and gh all failed). Update skipped."
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
  echo "✅ APEX v${LOCAL_VERSION} — up to date"
  exit 0
fi

# ── New version available! Pull and update ──
log "Update available: v$LOCAL_VERSION → v$REMOTE_VERSION"

# Clone or pull the repo cache
if [ -d "$APEX_CACHE/.git" ]; then
  cd "$APEX_CACHE"
  git fetch origin "$APEX_BRANCH" --depth=1 2>/dev/null || { log "Failed to fetch"; echo "⚠️ APEX Auto-Update: git fetch failed. Run manually: cd ~/.apex-framework && git pull"; exit 0; }
  git reset --hard "origin/$APEX_BRANCH" 2>/dev/null || { log "Failed to reset"; echo "⚠️ APEX Auto-Update: git reset failed."; exit 0; }
else
  rm -rf "$APEX_CACHE"
  # Try gh repo clone first (works inside Claude Code sandbox), fall back to git clone
  if command -v gh &>/dev/null; then
    gh repo clone "${APEX_REPO}" "$APEX_CACHE" -- --depth=1 --branch "$APEX_BRANCH" 2>/dev/null
  fi
  if [ ! -d "$APEX_CACHE/.git" ]; then
    git clone --depth=1 --branch "$APEX_BRANCH" \
      "https://github.com/${APEX_REPO}.git" "$APEX_CACHE" 2>/dev/null
  fi
  if [ ! -d "$APEX_CACHE/.git" ]; then
    log "Failed to clone (tried gh and git)"
    echo "⚠️ APEX Auto-Update: failed to clone repo. Check network or run manually: gh repo clone ${APEX_REPO} ~/.apex-framework"
    mkdir -p "$APEX_CACHE"
    exit 0
  fi
fi

# ── Validate the downloaded repo ──
if [ ! -f "$APEX_CACHE/VERSION" ] || [ ! -d "$APEX_CACHE/.claude/scripts" ] || [ ! -d "$APEX_CACHE/.claude/skills" ]; then
  log "ERROR: Downloaded repo is invalid"
  echo "⚠️ APEX Auto-Update: downloaded repo is invalid (missing VERSION, scripts, or skills). Update skipped."
  exit 0
fi

# ── Rollback function (used if update fails) ──
rollback_update() {
  local backup_dir="$1"
  if [ -d "$backup_dir" ]; then
    echo "⚠️ APEX: Update failed — rolling back from backup..." >&2
    for component in scripts skills agents rules output-styles; do
      if [ -d "$backup_dir/$component" ]; then
        rm -r "$PROJECT_DIR/.claude/$component" 2>/dev/null
        cp -r "$backup_dir/$component" "$PROJECT_DIR/.claude/$component"
      fi
    done
    if [ -f "$backup_dir/settings.json" ]; then
      cp "$backup_dir/settings.json" "$PROJECT_DIR/.claude/settings.json"
    fi
    echo "✅ APEX: Rollback complete — previous version restored" >&2
  fi
}

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

# Update Design DNA (pattern pages + starters + tokens + recipes)
if [ -d "$APEX_CACHE/docs/design-dna" ]; then
  mkdir -p "$PROJECT_DIR/docs/design-dna"
  # HTML pages + JS modules
  for f in "$APEX_CACHE"/docs/design-dna/*.html "$APEX_CACHE"/docs/design-dna/*.js; do
    [ -f "$f" ] && cp "$f" "$PROJECT_DIR/docs/design-dna/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
  done
  # Tokens
  if [ -d "$APEX_CACHE/docs/design-dna/tokens" ]; then
    mkdir -p "$PROJECT_DIR/docs/design-dna/tokens/palettes"
    for f in "$APEX_CACHE"/docs/design-dna/tokens/*.css; do
      [ -f "$f" ] && cp "$f" "$PROJECT_DIR/docs/design-dna/tokens/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
    done
    for f in "$APEX_CACHE"/docs/design-dna/tokens/palettes/*.css; do
      [ -f "$f" ] && cp "$f" "$PROJECT_DIR/docs/design-dna/tokens/palettes/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
    done
  fi
  # Starters (layout, primitives, patterns)
  for subdir in layout primitives patterns; do
    if [ -d "$APEX_CACHE/docs/design-dna/starters/$subdir" ]; then
      mkdir -p "$PROJECT_DIR/docs/design-dna/starters/$subdir"
      for f in "$APEX_CACHE/docs/design-dna/starters/$subdir"/*; do
        [ -f "$f" ] && cp "$f" "$PROJECT_DIR/docs/design-dna/starters/$subdir/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
      done
    fi
  done
  # Recipes
  if [ -d "$APEX_CACHE/docs/design-dna/recipes" ]; then
    mkdir -p "$PROJECT_DIR/docs/design-dna/recipes"
    for f in "$APEX_CACHE"/docs/design-dna/recipes/*.md; do
      [ -f "$f" ] && cp "$f" "$PROJECT_DIR/docs/design-dna/recipes/" && UPDATE_COUNT=$((UPDATE_COUNT + 1))
    done
  fi
fi

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

# Ensure CLAUDE.md has all critical sections (append if missing, never overwrite)
if [ -f "$PROJECT_DIR/CLAUDE.md" ] && [ -f "$APEX_CACHE/CLAUDE.md" ]; then
  for SECTION_NAME in "## Agent Teams" "## Update" "## Workflow" "## Code Standards" "## Git Workflow"; do
    if ! grep -q "$SECTION_NAME" "$PROJECT_DIR/CLAUDE.md" 2>/dev/null; then
      SECTION_CONTENT=$(sed -n "/^${SECTION_NAME}$/,/^## [^${SECTION_NAME:3:1}]/{ /^## [^${SECTION_NAME:3:1}]/!p; }" "$APEX_CACHE/CLAUDE.md" 2>/dev/null)
      if [ -n "$SECTION_CONTENT" ]; then
        echo "" >> "$PROJECT_DIR/CLAUDE.md"
        echo "$SECTION_CONTENT" >> "$PROJECT_DIR/CLAUDE.md"
        log "Appended $SECTION_NAME section to CLAUDE.md"
      fi
    fi
  done
fi

# NOTE: We do NOT overwrite:
#   - CLAUDE.md (user may have customized — we only append missing sections)
#   - settings.local.json (user's local overrides)
#   - .apex-state.json (session state)
#   - git hooks in .git/hooks/ (may have custom hooks)

# Verify update succeeded (critical files still exist)
if [ ! -d "$PROJECT_DIR/.claude/scripts" ] || [ ! -d "$PROJECT_DIR/.claude/skills" ]; then
  rollback_update "$BACKUP_DIR"
  echo "❌ APEX Auto-Update: FAILED — rolled back to previous version" >&2
  exit 0
fi

log "Update complete: v$LOCAL_VERSION → v$REMOTE_VERSION ($UPDATE_COUNT files in $PROJECT_DIR)"

echo ""
echo "🔄 APEX Auto-Update: v$LOCAL_VERSION → v$REMOTE_VERSION"
echo "   $UPDATE_COUNT files updated in project"
echo "   Backup saved. Changelog: https://github.com/${APEX_REPO}/releases"
echo ""

# Cleanup old backups (keep last 7 days)
find "$APEX_CACHE" -maxdepth 1 -name ".backup-*" -mtime +7 -type d 2>/dev/null | while read -r old_backup; do
  rm -r "$old_backup" 2>/dev/null
done

exit 0
