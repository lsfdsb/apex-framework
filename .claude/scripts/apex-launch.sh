#!/bin/bash
# APEX launcher — clean startup before Claude Code

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/apex-colors.sh" 2>/dev/null

VERSION=$(cat "$(dirname "$SCRIPT_DIR")/../VERSION" 2>/dev/null || echo "5.21")

echo ""
printf "  \033[1mAPEX\033[0m v${VERSION}\n"
printf "  \033[38;5;245m──────────────────────────────────────\033[0m\n"
printf "  \033[38;5;245mAgent-Powered EXcellence for Claude\033[0m\n"
printf "  \033[38;5;245mby L.B. & Claude · São Paulo\033[0m\n"
echo ""

exec claude "$@"
