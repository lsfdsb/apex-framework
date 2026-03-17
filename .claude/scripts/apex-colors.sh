#!/bin/bash
# apex-colors.sh — APEX Framework Shared Color & Style Library
# by L.B. & Claude · São Paulo, 2026
#
# Source this file in any script that outputs to a real terminal (not Claude context).
# Usage: source "$(dirname "$0")/apex-colors.sh"
#
# For hooks whose stdout goes to Claude's context (SessionStart, Stop, etc.),
# do NOT use colors — use Unicode/emoji instead.

# ── Detect color support ──
APEX_COLORS=false
if [ -t 1 ] || [ "${FORCE_COLOR:-}" = "1" ]; then
  if command -v tput &>/dev/null && [ "$(tput colors 2>/dev/null || echo 0)" -ge 8 ]; then
    APEX_COLORS=true
  fi
fi

if [ "$APEX_COLORS" = true ]; then
  # ── Reset ──
  RST='\033[0m'

  # ── APEX Brand Colors ──
  GOLD='\033[38;5;220m'        # Primary brand — gold/amber
  GOLD_BOLD='\033[1;38;5;220m'
  EMBER='\033[38;5;208m'       # Warm accent — orange/ember
  FIRE='\033[38;5;196m'        # Danger/error — red fire
  STEEL='\033[38;5;245m'       # Muted/secondary — steel gray
  FROST='\033[38;5;75m'        # Info/cool accent — ice blue
  FROST_BOLD='\033[1;38;5;75m'
  FORGE='\033[38;5;214m'       # Warm highlight — forge orange
  BESKAR='\033[38;5;255m'      # Bright white — beskar silver
  BESKAR_BOLD='\033[1;38;5;255m'
  SHADOW='\033[38;5;240m'      # Dim — shadow gray
  CREED='\033[38;5;183m'       # Purple — the creed/philosophy

  # ── Semantic Colors ──
  OK='\033[38;5;78m'           # Success — soft green
  OK_BOLD='\033[1;38;5;78m'
  WARN='\033[38;5;220m'        # Warning — gold (matches brand)
  WARN_BOLD='\033[1;38;5;220m'
  ERR='\033[38;5;196m'         # Error — red
  ERR_BOLD='\033[1;38;5;196m'
  INFO='\033[38;5;75m'         # Info — frost blue
  DIM='\033[2m'                # Dimmed text
  BOLD='\033[1m'               # Bold

  # ── Special ──
  UNDERLINE='\033[4m'
  BLINK='\033[5m'              # Use VERY sparingly
  REVERSE='\033[7m'

  # ── Background accents ──
  BG_GOLD='\033[48;5;220m\033[38;5;232m'
  BG_OK='\033[48;5;78m\033[38;5;232m'
  BG_ERR='\033[48;5;196m\033[38;5;255m'
  BG_INFO='\033[48;5;75m\033[38;5;232m'
else
  # No color support — all variables are empty
  RST='' GOLD='' GOLD_BOLD='' EMBER='' FIRE='' STEEL='' FROST='' FROST_BOLD=''
  FORGE='' BESKAR='' BESKAR_BOLD='' SHADOW='' CREED=''
  OK='' OK_BOLD='' WARN='' WARN_BOLD='' ERR='' ERR_BOLD='' INFO='' DIM='' BOLD=''
  UNDERLINE='' BLINK='' REVERSE=''
  BG_GOLD='' BG_OK='' BG_ERR='' BG_INFO=''
fi

# ── Unicode Decorations ──
SWORD="⚔️"
SHIELD="🛡️"
FLAME="🔥"
CHECK="✅"
CROSS="❌"
WARN_ICON="⚠️"
STOP_ICON="🛑"
GEAR="⚙️"
SPARK="✦"

# ── Animated Spinner ──
# Usage: apex_spinner_start "Loading..." ; do_stuff ; apex_spinner_stop
APEX_SPINNER_PID=""
APEX_SPINNER_FRAMES=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")

apex_spinner_start() {
  local msg="${1:-Working...}"
  if [ "$APEX_COLORS" = true ]; then
    (
      local i=0
      while true; do
        printf "\r  ${GOLD}${APEX_SPINNER_FRAMES[$i]}${RST} ${STEEL}%s${RST}" "$msg"
        i=$(( (i + 1) % ${#APEX_SPINNER_FRAMES[@]} ))
        sleep 0.08
      done
    ) &
    APEX_SPINNER_PID=$!
    disown "$APEX_SPINNER_PID" 2>/dev/null
  else
    printf "  %s" "$msg"
  fi
}

apex_spinner_stop() {
  local result="${1:-ok}"  # ok | fail | warn
  local msg="${2:-}"
  if [ -n "$APEX_SPINNER_PID" ]; then
    kill "$APEX_SPINNER_PID" 2>/dev/null
    wait "$APEX_SPINNER_PID" 2>/dev/null
    APEX_SPINNER_PID=""
  fi
  printf "\r\033[K"  # Clear the line
  case "$result" in
    ok)   printf "  ${OK}✓${RST} ${BESKAR}%s${RST}\n" "${msg:-Done}" ;;
    fail) printf "  ${ERR}✗${RST} ${BESKAR}%s${RST}\n" "${msg:-Failed}" ;;
    warn) printf "  ${WARN}!${RST} ${BESKAR}%s${RST}\n" "${msg:-Warning}" ;;
    skip) printf "  ${STEEL}○${RST} ${STEEL}%s${RST}\n" "${msg:-Skipped}" ;;
  esac
}

# ── Progress Bar ──
# Usage: apex_progress 3 5 "Running checks"  →  ▓▓▓░░ 60% Running checks
apex_progress() {
  local current=$1 total=$2 label="${3:-}"
  local width=20
  local filled=$((current * width / total))
  local empty=$((width - filled))
  local pct=$((current * 100 / total))
  local bar=""
  for ((i=0; i<filled; i++)); do bar="${bar}▓"; done
  for ((i=0; i<empty; i++)); do bar="${bar}░"; done
  if [ "$APEX_COLORS" = true ]; then
    printf "\r  ${GOLD}%s${RST} ${STEEL}%3d%%${RST} ${DIM}%s${RST}" "$bar" "$pct" "$label"
  else
    printf "\r  %s %3d%% %s" "$bar" "$pct" "$label"
  fi
}

# ── Section Header ──
# Usage: apex_header "Pre-Commit Checks"
apex_header() {
  local title="$1"
  if [ "$APEX_COLORS" = true ]; then
    echo ""
    printf "  ${GOLD_BOLD}━━━ ${SWORD} %s ━━━${RST}\n" "$title"
    echo ""
  else
    echo ""
    echo "  ━━━ ${SWORD} $title ━━━"
    echo ""
  fi
}

# ── Section Divider ──
apex_divider() {
  if [ "$APEX_COLORS" = true ]; then
    printf "  ${SHADOW}─────────────────────────────────────${RST}\n"
  else
    echo "  ─────────────────────────────────────"
  fi
}

# ── Status Line ──
# Usage: apex_status "ok" "Types checked"
#        apex_status "fail" "Lint errors found"
apex_status() {
  local type="$1" msg="$2"
  case "$type" in
    ok)   printf "    ${OK}✓${RST} ${BESKAR}%s${RST}\n" "$msg" ;;
    fail) printf "    ${ERR}✗${RST} ${BESKAR}%s${RST}\n" "$msg" ;;
    warn) printf "    ${WARN}!${RST} ${BESKAR}%s${RST}\n" "$msg" ;;
    info) printf "    ${FROST}›${RST} ${STEEL}%s${RST}\n" "$msg" ;;
    run)  printf "    ${GOLD}▸${RST} ${BESKAR}%s${RST}" "$msg" ;;
  esac
}

# ── Blocked Banner ──
apex_blocked() {
  local msg="$1"
  if [ "$APEX_COLORS" = true ]; then
    echo ""
    printf "  ${ERR_BOLD}┌─── ${STOP_ICON} BLOCKED ───┐${RST}\n"
    printf "  ${ERR}│${RST} %s\n" "$msg"
    printf "  ${ERR_BOLD}└────────────────────┘${RST}\n"
    echo ""
  else
    echo ""
    echo "  ┌─── ${STOP_ICON} BLOCKED ───┐"
    echo "  │ $msg"
    echo "  └────────────────────┘"
    echo ""
  fi
}

# ── Success Banner ──
apex_success() {
  local msg="$1"
  if [ "$APEX_COLORS" = true ]; then
    echo ""
    printf "  ${OK_BOLD}┌─── ${CHECK} SUCCESS ───┐${RST}\n"
    printf "  ${OK}│${RST} %s\n" "$msg"
    printf "  ${OK_BOLD}└─────────────────────┘${RST}\n"
  else
    echo ""
    echo "  ┌─── ${CHECK} SUCCESS ───┐"
    echo "  │ $msg"
    echo "  └─────────────────────┘"
  fi
}

# ── Typewriter Effect ──
# Usage: apex_typewriter "This is the way." 0.03
apex_typewriter() {
  local text="$1" delay="${2:-0.02}"
  if [ "$APEX_COLORS" = true ]; then
    for ((i=0; i<${#text}; i++)); do
      printf "%s" "${text:$i:1}"
      sleep "$delay"
    done
    echo ""
  else
    echo "$text"
  fi
}

# ── Fade-in Lines (prints lines with increasing brightness) ──
apex_fade_in() {
  local text="$1"
  if [ "$APEX_COLORS" = true ]; then
    local shades=(232 236 240 244 248 252 255)
    for shade in "${shades[@]}"; do
      printf "\r\033[38;5;%dm%s\033[0m" "$shade" "$text"
      sleep 0.04
    done
    echo ""
  else
    echo "$text"
  fi
}
