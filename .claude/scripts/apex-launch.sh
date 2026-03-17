#!/bin/bash
# Animated APEX banner before Claude Code starts
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/apex-colors.sh" 2>/dev/null

echo ""
TOP="  ╔══════════════════════════════════════════════════╗"
for ((i=0; i<${#TOP}; i++)); do
  printf "%s" "${TOP:$i:1}"
  [ $((i % 3)) -eq 0 ] && sleep 0.003
done
echo ""

reveal() { printf "%s\n" "$1"; sleep "${2:-0.015}"; }
tt() {
  local text="$1" delay="${2:-0.006}"
  for ((i=0; i<${#text}; i++)); do printf "%s" "${text:$i:1}"; sleep "$delay"; done
  echo ""
}
fade() {
  for shade in 238 245 252 255; do
    printf "\r\033[38;5;%dm%s\033[0m" "$shade" "$1"
    sleep 0.015
  done
  echo ""
}

reveal "  ║                                                  ║" 0.01
reveal "  ║         ▄▀▀▀▄  ▄▀▀▀▄  ▄▀▀▀▀  ▄▀  ▄▀            ║" 0.025
reveal "  ║         █▄▄▄█  █▄▄▄█  █▄▄▄   ▀▄▄▀              ║" 0.025
reveal "  ║         █   █  █      █      ▄▀  ▄▀             ║" 0.025
reveal "  ║         ▀   ▀  ▀      ▀▀▀▀▀  ▀    ▀             ║" 0.025
reveal "  ║                                                  ║" 0.01
tt     "  ║     ⚔️  APEX Framework v5.7                     ║" 0.008
tt     "  ║     Agent-Powered EXcellence for Claude          ║" 0.006
reveal "  ║                                                  ║" 0.01
reveal "  ╠══════════════════════════════════════════════════╣" 0.015
reveal "  ║                                                  ║" 0.01
fade   "  ║  ✦ Design like Jony Ive                          ║"
fade   "  ║  ✦ Code like Torvalds & Dean                     ║"
fade   "  ║  ✦ Secure like Ionescu & Rutkowska               ║"
fade   "  ║  ✦ Business like Amodei                          ║"
fade   "  ║  ✦ Experience like Walt Disney                   ║"
reveal "  ║                                                  ║" 0.01
reveal "  ╠══════════════════════════════════════════════════╣" 0.015
reveal "  ║                                                  ║" 0.01
tt     "  ║     Forged by L.B. & Claude                      ║" 0.008
tt     "  ║     São Paulo · March 2026                       ║" 0.008
reveal "  ║                                                  ║" 0.01
fade   "  ║     This is the way. ⚔️                           ║"
sleep 0.06
reveal "  ║                                                  ║" 0.01

BOT="  ╚══════════════════════════════════════════════════╝"
for ((i=0; i<${#BOT}; i++)); do
  printf "%s" "${BOT:$i:1}"
  [ $((i % 3)) -eq 0 ] && sleep 0.003
done
echo ""
echo ""

exec claude "$@"
