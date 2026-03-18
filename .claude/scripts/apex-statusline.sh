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

# ── Extract all values in a SINGLE jq call (perf: ~5ms vs ~50ms for 10 calls) ──
PARSED=$(echo "$INPUT" | jq -r '
  [
    (.model.display_name // "—"),
    (.model.id // ""),
    (.context_window.used_percentage // 0 | tostring),
    (.context_window.context_window_size // 0 | tostring),
    (.context_window.total_input_tokens // 0 | tostring),
    (.context_window.total_output_tokens // 0 | tostring),
    ((.context_window.used_percentage // 0) * (.context_window.context_window_size // 0) / 100 | floor | tostring),
    (.cost.total_cost_usd // 0 | tostring),
    (.cost.total_lines_added // 0 | tostring),
    (.cost.total_lines_removed // 0 | tostring),
    (.cost.total_duration_ms // 0 | tostring)
  ] | join("\t")
' 2>/dev/null)

# Split parsed values (tab-separated)
IFS=$'\t' read -r MODEL_DISPLAY MODEL_ID CTX_PCT CTX_SIZE TOK_IN TOK_OUT TOK_USED COST_RAW LA LR DUR_MS <<< "$PARSED"

# ── Model ──
case "$MODEL_DISPLAY" in
  *Opus*)   M="opus" ;;
  *Sonnet*) M="sonnet" ;;
  *Haiku*)  M="haiku" ;;
  *)        M="$(echo "$MODEL_DISPLAY" | tr '[:upper:]' '[:lower:]' | cut -c1-8)" ;;
esac
echo "$MODEL_ID" | grep -qi "opusplan" 2>/dev/null && M="opus→sonnet"

# ── Context window ──
CTX_INT=$(printf '%.0f' "$CTX_PCT" 2>/dev/null || echo "0")

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

# ── Cost (already extracted above) ──
COST=$(printf '%.2f' "$COST_RAW" 2>/dev/null || echo "0.00")

# ── Lines (already extracted above) ──
NET=$((LA - LR))
[ "$NET" -ge 0 ] 2>/dev/null && NET_FMT="+${NET}" || NET_FMT="${NET}"

# ── Duration (already extracted above) ──
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

# ── Agents (single jq call) ──
AGENT_FILE="/tmp/apex-agents.json"
AGENT_STR=""
if [ -f "$AGENT_FILE" ]; then
  AGENT_DATA=$(jq -r '[(.count // 0 | tostring), (.total_tokens // 0 | tostring), ((.types // []) | join(","))] | join("\t")' "$AGENT_FILE" 2>/dev/null)
  IFS=$'\t' read -r AGENT_COUNT AGENT_TOKENS AGENT_TYPES_RAW <<< "$AGENT_DATA"
  if [ "${AGENT_COUNT:-0}" -gt 0 ] 2>/dev/null; then
    TYPES_DISPLAY=""
    if [ -n "$AGENT_TYPES_RAW" ]; then
      IFS=',' read -ra TYPES_ARR <<< "$AGENT_TYPES_RAW"
      TYPE_COUNT=${#TYPES_ARR[@]}
      if [ "$TYPE_COUNT" -le 3 ]; then
        TYPES_DISPLAY=" ($(IFS=', '; echo "${TYPES_ARR[*]}"))"
      else
        TYPES_DISPLAY=" (${TYPES_ARR[0]}, ${TYPES_ARR[1]} +$((TYPE_COUNT - 2)))"
      fi
    fi
    AGENT_STR=" ┃ 🤖 ${AGENT_COUNT}${TYPES_DISPLAY} $(fmt_tok "$AGENT_TOKENS")"
  fi
fi

# ── Alerts ──
A=""
[ "$CTX_INT" -gt 80 ] 2>/dev/null && A=" ⚠️ CTX"
PREF="$HOME/.claude/apex-preferences.json"
TH="5.00"; [ -f "$PREF" ] && TH=$(jq -r '.cost_alert_threshold_usd // 5.00' "$PREF" 2>/dev/null || echo "5.00")
command -v bc &>/dev/null && [ "$(echo "$COST > $TH" | bc 2>/dev/null)" = "1" ] && A="${A} ⚠️ COST"

# ── PR detection (clickable link + merge status, cached 60s) ──
PR_STR=""
if command -v gh &>/dev/null; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  PR_CACHE="/tmp/apex-pr-cache-${BRANCH}.json"
  PR_DATA=""
  # Use cache if fresh (< 60s old)
  if [ -f "$PR_CACHE" ]; then
    CACHE_AGE=$(( $(date +%s) - $(stat -f %m "$PR_CACHE" 2>/dev/null || echo "0") ))
    [ "$CACHE_AGE" -lt 60 ] && PR_DATA=$(cat "$PR_CACHE" 2>/dev/null)
  fi
  # Fetch if no cache or stale
  if [ -z "$PR_DATA" ] && [ -n "$BRANCH" ]; then
    PR_DATA=$(timeout 2 gh pr view --json number,state,url 2>/dev/null)
    if [ -n "$PR_DATA" ]; then
      echo "$PR_DATA" > "$PR_CACHE"
    else
      # Cache "no PR" to avoid re-fetching every render
      echo '{"none":true}' > "$PR_CACHE"
    fi
  fi
  if [ -n "$PR_DATA" ] && [ "$PR_DATA" != '{"none":true}' ]; then
    PR_NUM=$(echo "$PR_DATA" | jq -r '.number // empty')
    PR_STATE=$(echo "$PR_DATA" | jq -r '.state // empty')
    PR_URL=$(echo "$PR_DATA" | jq -r '.url // empty')
    if [ -n "$PR_NUM" ]; then
      case "$PR_STATE" in
        MERGED) PR_ICON="🟣" ;;
        OPEN)   PR_ICON="🟢" ;;
        CLOSED) PR_ICON="🔴" ;;
        *)      PR_ICON="PR" ;;
      esac
      # OSC 8 clickable link (iTerm2, Kitty, WezTerm) with plain text fallback
      if [[ "${TERM_PROGRAM:-}" =~ ^(iTerm|iTerm2|WezTerm)$ ]] || [[ "${TERM:-}" =~ ^(xterm-kitty) ]]; then
        PR_STR=" ┃ ${PR_ICON} \e]8;;${PR_URL}\a#${PR_NUM}\e]8;;\a"
      else
        PR_STR=" ┃ ${PR_ICON} #${PR_NUM}"
      fi
    fi
  fi
fi

# ── Output (printf %b for reliable OSC 8 escape interpretation) ──
printf '%b' "⚔️  APEX ┃ ${M} ${PLAN}┃ ${HEALTH} ${BAR} ${CTX_INT}%% $(fmt_tok "$TOK_USED")/$(fmt_tok "$CTX_SIZE") ┃ ↑$(fmt_tok "$TOK_IN") ↓$(fmt_tok "$TOK_OUT")${AGENT_STR} ┃ +${LA}/-${LR} (${NET_FMT} net) ┃ ${DUR_FMT}${A}${PR_STR} ┃ This is the way.\n"
