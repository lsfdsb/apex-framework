#!/bin/bash
# apex-statusline.sh — APEX Framework Status Line
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
  echo "⚔️ APEX | by L.B. & Claude"
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

# ── Tokens ──
TOK_IN=$(echo "$INPUT" | jq -r '.context_window.total_input_tokens // 0' 2>/dev/null)
TOK_OUT=$(echo "$INPUT" | jq -r '.context_window.total_output_tokens // 0' 2>/dev/null)
CTX_SIZE=$(echo "$INPUT" | jq -r '.context_window.context_window_size // 0' 2>/dev/null)

# ── Context size correction based on known model limits ──
# Claude Code may report stale/wrong context_window_size after model switch.
# Override with known values and recompute percentage proportionally.
EXPECTED_CTX=0
case "$MODEL_ID" in
  *opus*1m*|*opus*1M*)   EXPECTED_CTX=1000000 ;;
  *opus-4*)              EXPECTED_CTX=200000 ;;
  *sonnet-4*)            EXPECTED_CTX=200000 ;;
  *haiku*)               EXPECTED_CTX=200000 ;;
esac
# Also check display name for 1M hint
echo "$MODEL_ID" | grep -qi "1m" 2>/dev/null && EXPECTED_CTX=1000000

if [ "$EXPECTED_CTX" -gt 0 ] 2>/dev/null && [ "$CTX_SIZE" -gt 0 ] 2>/dev/null; then
  if [ "$CTX_SIZE" -ne "$EXPECTED_CTX" ]; then
    # Recompute: if API says 14% of 200K, but actual window is 1M,
    # real percentage = 14% * 200K / 1M = 2.8%
    if command -v bc &>/dev/null; then
      CTX_PCT=$(echo "scale=1; $CTX_PCT * $CTX_SIZE / $EXPECTED_CTX" | bc 2>/dev/null || echo "$CTX_PCT")
      CTX_INT=$(printf '%.0f' "$CTX_PCT" 2>/dev/null || echo "0")
    fi
    CTX_SIZE=$EXPECTED_CTX
  fi
fi

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

# ── Duration ──
DUR_MS=$(echo "$INPUT" | jq -r '.cost.total_duration_ms // 0' 2>/dev/null)
DUR_MIN=$((DUR_MS / 60000))

# ── Plan badge ──
PLAN=""
if [ "$COST" = "0.00" ]; then PLAN="MAX "; fi

# ── Context bar (enhanced with gradient feel) ──
BW=12
F=$((CTX_INT * BW / 100))
[ "$F" -gt "$BW" ] && F=$BW
E=$((BW - F))
BAR=""
for ((i=0;i<F;i++)); do BAR="${BAR}█"; done
for ((i=0;i<E;i++)); do BAR="${BAR}░"; done

# ── Context status icon ──
CTX_ICON="◆"
[ "$CTX_INT" -gt 80 ] 2>/dev/null && CTX_ICON="◆!"
[ "$CTX_INT" -gt 60 ] 2>/dev/null && [ "$CTX_INT" -le 80 ] 2>/dev/null && CTX_ICON="◆"

# ── Alerts ──
A=""
[ "$CTX_INT" -gt 80 ] 2>/dev/null && A=" ⚠️CTX"
[ "$CTX_INT" -gt 60 ] 2>/dev/null && [ "$CTX_INT" -le 80 ] 2>/dev/null && A=" 🟡"
PREF="$HOME/.claude/apex-preferences.json"
TH="5.00"; [ -f "$PREF" ] && TH=$(jq -r '.cost_alert_threshold_usd // 5.00' "$PREF" 2>/dev/null || echo "5.00")
command -v bc &>/dev/null && [ "$(echo "$COST > $TH" | bc 2>/dev/null)" = "1" ] && A="${A} ⚠️COST"

# ── Forge animation (subtle pulse based on activity) ──
# Alternate between two states every 5s based on duration
PULSE_STATE=$((DUR_MIN % 2))
if [ "$PULSE_STATE" -eq 0 ]; then
  SWORD_ICON="⚔️"
else
  SWORD_ICON="🔥"
fi

# ── Context size label ──
CTX_LABEL=""
if [ "$CTX_SIZE" -gt 0 ] 2>/dev/null; then
  CTX_LABEL=" /$(fmt_tok "$CTX_SIZE")"
fi

# ── Output ──
echo "${SWORD_ICON} APEX ┃ ${M} ${PLAN}┃ ${BAR} ${CTX_INT}%${CTX_LABEL} ┃ ↑$(fmt_tok "$TOK_IN") ↓$(fmt_tok "$TOK_OUT") ┃ \$${COST} ┃ +${LA}/-${LR} ┃ ${DUR_MIN}m${A} ┃ L.B. & Claude"
