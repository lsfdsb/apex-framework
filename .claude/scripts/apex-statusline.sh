#!/bin/bash
# apex-statusline.sh — APEX Framework Status Line (Beskar Edition)
# by L.B. & Claude · São Paulo, 2026
#
# Official JSON schema (code.claude.com/docs/en/statusline):
#   .model.id / .model.display_name
#   .context_window.used_percentage / .context_window.total_input_tokens
#   .context_window.total_output_tokens / .context_window.context_window_size
#   .cost.total_cost_usd / .cost.total_duration_ms
#   .cost.total_lines_added / .cost.total_lines_removed
#
# Note: context_window is null before first API call. Handle with // 0.

if ! command -v jq &> /dev/null; then
  echo "⚔️ APEX | This is the way."
  exit 0
fi

INPUT=$(cat)

# ── Model ──
MODEL_DISPLAY=$(echo "$INPUT" | jq -r '.model.display_name // "—"')
MODEL_ID=$(echo "$INPUT" | jq -r '.model.id // ""')

case "$MODEL_DISPLAY" in
  *Opus*)   M="opus" ;;
  *Sonnet*) M="sonnet" ;;
  *Haiku*)  M="haiku" ;;
  *)        M="$(echo "$MODEL_DISPLAY" | tr '[:upper:]' '[:lower:]' | cut -c1-8)" ;;
esac
echo "$MODEL_ID" | grep -qi "opusplan" 2>/dev/null && M="opus→sonnet"

# ── Context window ──
CTX_PCT=$(echo "$INPUT" | jq -r '.context_window.used_percentage // 0' 2>/dev/null)
CTX_INT=$(printf '%.0f' "$CTX_PCT" 2>/dev/null || echo "0")
CTX_SIZE=$(echo "$INPUT" | jq -r '.context_window.context_window_size // 0' 2>/dev/null)

# ── Tokens ──
TOK_IN=$(echo "$INPUT" | jq -r '.context_window.total_input_tokens // 0' 2>/dev/null)
TOK_OUT=$(echo "$INPUT" | jq -r '.context_window.total_output_tokens // 0' 2>/dev/null)
# Actual context usage: percentage × window size (includes system prompts, tools, etc.)
TOK_USED=$(echo "$INPUT" | jq -r '
  ((.context_window.used_percentage // 0) * (.context_window.context_window_size // 0) / 100)
  | floor
' 2>/dev/null || echo "0")

fmt_tok() {
  local n=$1
  if [ "$n" -ge 1000000 ] 2>/dev/null; then
    printf '%.1fM' "$(echo "scale=1; $n / 1000000" | bc 2>/dev/null || echo "0")"
  elif [ "$n" -ge 1000 ] 2>/dev/null; then
    printf '%.1fK' "$(echo "scale=1; $n / 1000" | bc 2>/dev/null || echo "0")"
  else
    echo "${n}"
  fi
}

# ── Cost ──
COST=$(printf '%.2f' "$(echo "$INPUT" | jq -r '.cost.total_cost_usd // 0' 2>/dev/null)" 2>/dev/null || echo "0.00")

# ── Lines ──
LA=$(echo "$INPUT" | jq -r '.cost.total_lines_added // 0' 2>/dev/null)
LR=$(echo "$INPUT" | jq -r '.cost.total_lines_removed // 0' 2>/dev/null)
NET=$((LA - LR))
[ "$NET" -ge 0 ] 2>/dev/null && NET_FMT="+${NET}" || NET_FMT="${NET}"

# ── Duration ──
DUR_MS=$(echo "$INPUT" | jq -r '.cost.total_duration_ms // 0' 2>/dev/null)
DUR_SEC=$((DUR_MS / 1000))
if [ "$DUR_SEC" -ge 3600 ] 2>/dev/null; then
  DUR_H=$((DUR_SEC / 3600))
  DUR_M=$(((DUR_SEC % 3600) / 60))
  DUR_FMT="${DUR_H}h${DUR_M}m"
elif [ "$DUR_SEC" -ge 60 ] 2>/dev/null; then
  DUR_FMT="$((DUR_SEC / 60))m"
else
  DUR_FMT="${DUR_SEC}s"
fi

# ── Plan badge ──
PLAN=""
if [ "$COST" = "0.00" ]; then PLAN="MAX "; fi

# ── Context bar (gradient: █ ▓ ▒ ░) ──
BW=10
F=$((CTX_INT * BW / 100))
[ "$F" -gt "$BW" ] && F=$BW
E=$((BW - F))
BAR=""
for ((i=0;i<F;i++)); do
  # Last filled block uses ▓ for gradient edge
  if [ "$i" -eq $((F - 1)) ] && [ "$F" -lt "$BW" ]; then
    BAR="${BAR}▓"
  else
    BAR="${BAR}█"
  fi
done
for ((i=0;i<E;i++)); do
  # First empty block uses ▒ for gradient edge
  if [ "$i" -eq 0 ] && [ "$F" -gt 0 ]; then
    BAR="${BAR}▒"
  else
    BAR="${BAR}░"
  fi
done

# ── Health status ──
if [ "$CTX_INT" -gt 80 ] 2>/dev/null; then
  HEALTH="🔴"
elif [ "$CTX_INT" -gt 60 ] 2>/dev/null; then
  HEALTH="🟡"
elif [ "$CTX_INT" -gt 30 ] 2>/dev/null; then
  HEALTH="🟢"
else
  HEALTH="🟢"
fi

# ── Agents ──
SESSION_ID="${CLAUDE_SESSION_ID:-default}"
AGENT_FILE="/tmp/apex-agents-${SESSION_ID}.json"
AGENT_STR=""
if [ -f "$AGENT_FILE" ]; then
  AGENT_COUNT=$(jq -r '.count // 0' "$AGENT_FILE" 2>/dev/null || echo "0")
  AGENT_TOKENS=$(jq -r '.total_tokens // 0' "$AGENT_FILE" 2>/dev/null || echo "0")
  if [ "$AGENT_COUNT" -gt 0 ] 2>/dev/null; then
    AGENT_STR=" ┃ 🤖 ${AGENT_COUNT} agents $(fmt_tok "$AGENT_TOKENS")"
  fi
fi

# ── Alerts ──
A=""
[ "$CTX_INT" -gt 80 ] 2>/dev/null && A=" ⚠️ CTX"
PREF="$HOME/.claude/apex-preferences.json"
TH="5.00"; [ -f "$PREF" ] && TH=$(jq -r '.cost_alert_threshold_usd // 5.00' "$PREF" 2>/dev/null || echo "5.00")
command -v bc &>/dev/null && [ "$(echo "$COST > $TH" | bc 2>/dev/null)" = "1" ] && A="${A} ⚠️ COST"

# ── Output ──
echo "⚔️ APEX ┃ ${M} ${PLAN}┃ ${HEALTH} ${BAR} ${CTX_INT}% $(fmt_tok "$TOK_USED")/$(fmt_tok "$CTX_SIZE") ┃ ↑$(fmt_tok "$TOK_IN") ↓$(fmt_tok "$TOK_OUT")${AGENT_STR} ┃ +${LA}/-${LR} (${NET_FMT} net) ┃ ${DUR_FMT}${A} ┃ This is the way."
