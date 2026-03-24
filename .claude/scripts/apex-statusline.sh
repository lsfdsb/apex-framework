#!/bin/bash
# apex-statusline.sh — APEX Framework Status Line v3
# by L.B. & Claude · São Paulo, 2026
#
# Philosophy: Glance, don't read. Hide zeros. Earn every character.
#
# v3 changes:
#   - TOK_TOTAL = total_input + total_output (session-wide SUM, includes agents)
#   - Context bar still shows main thread % (that's the overflow constraint)
#   - Added session cost (total_cost_usd)
#   - Added rate limit indicator (five_hour.used_percentage)
#
# JSON schema (code.claude.com/docs/en/statusline):
#   .model.id / .model.display_name
#   .context_window.used_percentage / .context_window.total_input_tokens
#   .context_window.total_output_tokens / .context_window.context_window_size
#   .cost.total_cost_usd / .cost.total_duration_ms
#   .cost.total_lines_added / .cost.total_lines_removed
#   .rate_limits.five_hour.used_percentage

export LC_NUMERIC=C

if ! command -v jq &> /dev/null; then
  echo "⚔️ APEX ┃ install jq for full status"
  exit 0
fi

INPUT=$(cat)

# ── Parse all values in a single jq call ──
PARSED=$(echo "$INPUT" | jq -r '
  [
    (.model.display_name // "—"),
    (.model.id // ""),
    (.context_window.used_percentage // 0 | tostring),
    (.context_window.context_window_size // 0 | tostring),
    (.context_window.total_input_tokens // 0 | tostring),
    (.context_window.total_output_tokens // 0 | tostring),
    (.cost.total_cost_usd // 0 | tostring),
    (.cost.total_lines_added // 0 | tostring),
    (.cost.total_lines_removed // 0 | tostring),
    (.cost.total_duration_ms // 0 | tostring),
    (.rate_limits.five_hour.used_percentage // 0 | tostring)
  ] | join("\t")
' 2>/dev/null)

IFS=$'\t' read -r MODEL_DISPLAY MODEL_ID CTX_PCT CTX_SIZE TOK_IN TOK_OUT COST_RAW LA LR DUR_MS RATE_5H <<< "$PARSED"

# ── Session-wide token sum (main thread + all agents) ──
TOK_TOTAL=$((TOK_IN + TOK_OUT))

# ── Model ──
case "$MODEL_DISPLAY" in
  *Opus*)   M="opus" ;;
  *Sonnet*) M="sonnet" ;;
  *Haiku*)  M="haiku" ;;
  *)        M="$(echo "$MODEL_DISPLAY" | tr '[:upper:]' '[:lower:]' | cut -c1-8)" ;;
esac
echo "$MODEL_ID" | grep -qi "opusplan" 2>/dev/null && M="opus→sonnet"

# ── Context size correction for known model limits ──
EXPECTED_CTX=0
case "$MODEL_ID" in
  *opus*[1][mM]*) EXPECTED_CTX=1000000 ;;
  *opus-4*)       EXPECTED_CTX=200000 ;;
  *sonnet-4*)     EXPECTED_CTX=200000 ;;
  *haiku*)        EXPECTED_CTX=200000 ;;
esac

if [ "$EXPECTED_CTX" -gt 0 ] 2>/dev/null && [ "$CTX_SIZE" -gt 0 ] 2>/dev/null; then
  if [ "$CTX_SIZE" -ne "$EXPECTED_CTX" ]; then
    if command -v bc &>/dev/null; then
      CTX_PCT=$(echo "scale=1; $CTX_PCT * $CTX_SIZE / $EXPECTED_CTX" | bc 2>/dev/null || echo "$CTX_PCT")
    fi
    CTX_SIZE=$EXPECTED_CTX
  fi
fi
CTX_INT=$(printf '%.0f' "$CTX_PCT" 2>/dev/null || echo "0")

# ── Format tokens ──
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

# ── Format cost ──
fmt_cost() {
  local c=$1
  if command -v bc &>/dev/null; then
    local cents
    cents=$(echo "$c * 100" | bc 2>/dev/null || echo "0")
    cents_int=$(printf '%.0f' "$cents" 2>/dev/null || echo "0")
    if [ "$cents_int" -lt 1 ] 2>/dev/null; then
      echo ""
    elif [ "$cents_int" -lt 100 ] 2>/dev/null; then
      printf '$%.2f' "$c"
    else
      printf '$%.1f' "$c"
    fi
  else
    [ "$c" != "0" ] && [ "$c" != "0.00" ] && echo "\$$c" || echo ""
  fi
}

# ── Context bar (clean fill) ──
BW=10
F=$((CTX_INT * BW / 100))
[ "$F" -gt "$BW" ] && F=$BW
E=$((BW - F))
BAR=""
for ((i=0;i<F;i++)); do BAR="${BAR}█"; done
for ((i=0;i<E;i++)); do BAR="${BAR}░"; done

# ── Health indicator (based on main thread %) ──
if [ "$CTX_INT" -gt 80 ] 2>/dev/null; then
  HEALTH="🔴"
elif [ "$CTX_INT" -gt 60 ] 2>/dev/null; then
  HEALTH="🟡"
else
  HEALTH="🟢"
fi

# ── Plan badge (only show MAX after first API call) ──
PLAN=""
if [ "$COST_RAW" = "0" ] || [ "$COST_RAW" = "0.00" ]; then
  [ "$TOK_TOTAL" -gt 0 ] 2>/dev/null && PLAN="MAX "
fi

# ── Duration ──
DUR_SEC=$((DUR_MS / 1000))
if [ "$DUR_SEC" -ge 3600 ] 2>/dev/null; then
  DUR_FMT="$((DUR_SEC / 3600))h$(((DUR_SEC % 3600) / 60))m"
elif [ "$DUR_SEC" -ge 60 ] 2>/dev/null; then
  DUR_FMT="$((DUR_SEC / 60))m"
else
  DUR_FMT="${DUR_SEC}s"
fi

# ── Lines changed (hide if zero) ──
LINES_STR=""
NET=$((LA - LR))
if [ "$LA" -gt 0 ] 2>/dev/null || [ "$LR" -gt 0 ] 2>/dev/null; then
  [ "$NET" -ge 0 ] 2>/dev/null && NET_FMT="+${NET}" || NET_FMT="${NET}"
  LINES_STR=" ┃ Δ +${LA} / -${LR}"
fi

# ── Cost (session-wide, hide if zero) ──
COST_STR=""
COST_FMT=$(fmt_cost "$COST_RAW")
[ -n "$COST_FMT" ] && COST_STR=" ┃ ${COST_FMT}"

# ── Rate limit (hide if zero or unavailable) ──
RATE_STR=""
RATE_INT=$(printf '%.0f' "$RATE_5H" 2>/dev/null || echo "0")
if [ "$RATE_INT" -gt 0 ] 2>/dev/null; then
  if [ "$RATE_INT" -gt 80 ] 2>/dev/null; then
    RATE_STR=" ┃ ⏱ 🔴 ${RATE_INT}%"
  elif [ "$RATE_INT" -gt 50 ] 2>/dev/null; then
    RATE_STR=" ┃ ⏱ 🟡 ${RATE_INT}%"
  else
    RATE_STR=" ┃ ⏱ ${RATE_INT}%"
  fi
fi

# ── Alerts ──
ALERTS=""
[ "$CTX_INT" -gt 80 ] 2>/dev/null && ALERTS=" ⚠️ CTX"
[ "$RATE_INT" -gt 90 ] 2>/dev/null && ALERTS="${ALERTS} ⚠️ RATE"

# ── Version (from VERSION file, lazy git fallback) ──
VER=""
VER_PATH="${CLAUDE_PROJECT_DIR:+$CLAUDE_PROJECT_DIR/VERSION}"
if [ -n "$VER_PATH" ] && [ -f "$VER_PATH" ]; then
  VER=$(head -1 "$VER_PATH" 2>/dev/null | tr -d '[:space:]')
else
  VER_PATH="$(git rev-parse --show-toplevel 2>/dev/null)/VERSION"
  [ -f "$VER_PATH" ] && VER=$(head -1 "$VER_PATH" 2>/dev/null | tr -d '[:space:]')
fi
VER_STR="${VER:+v${VER} }"

# ── Build context segment ──
# Bar + % = main thread context (overflow constraint)
# Σ tokens = session-wide SUM (main + all agents)
if [ "$CTX_SIZE" -gt 0 ] 2>/dev/null; then
  CTX_STR="${HEALTH} ${BAR} ${CTX_INT}% · Σ $(fmt_tok "$TOK_TOTAL") / $(fmt_tok "$CTX_SIZE")"
else
  CTX_STR="${HEALTH} ready"
fi

# ── Output ──
# Segments: APEX version | model | context (Σ all agents) | cost | lines | duration | rate | alerts
printf '%b' "⚔️ APEX ${VER_STR}┃ ${M} ${PLAN}┃ ${CTX_STR}${COST_STR}${LINES_STR} ┃ ${DUR_FMT}${RATE_STR}${ALERTS}\n"
