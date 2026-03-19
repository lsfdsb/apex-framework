#!/bin/bash
# apex-statusline.sh — APEX Framework Status Line v2
# by L.B. & Claude · São Paulo, 2026
#
# Philosophy: Glance, don't read. Hide zeros. Earn every character.
#
# JSON schema (code.claude.com/docs/en/statusline):
#   .model.id / .model.display_name
#   .context_window.used_percentage / .context_window.total_input_tokens
#   .context_window.total_output_tokens / .context_window.context_window_size
#   .cost.total_cost_usd / .cost.total_duration_ms
#   .cost.total_lines_added / .cost.total_lines_removed

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
    ((.context_window.used_percentage // 0) * (.context_window.context_window_size // 0) / 100 | floor | tostring),
    (.cost.total_cost_usd // 0 | tostring),
    (.cost.total_lines_added // 0 | tostring),
    (.cost.total_lines_removed // 0 | tostring),
    (.cost.total_duration_ms // 0 | tostring)
  ] | join("\t")
' 2>/dev/null)

IFS=$'\t' read -r MODEL_DISPLAY MODEL_ID CTX_PCT CTX_SIZE TOK_IN TOK_OUT TOK_USED COST_RAW LA LR DUR_MS <<< "$PARSED"

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

# ── Context bar (clean fill) ──
BW=10
F=$((CTX_INT * BW / 100))
[ "$F" -gt "$BW" ] && F=$BW
E=$((BW - F))
BAR=""
for ((i=0;i<F;i++)); do BAR="${BAR}█"; done
for ((i=0;i<E;i++)); do BAR="${BAR}░"; done

# ── Health indicator ──
if [ "$CTX_INT" -gt 80 ] 2>/dev/null; then
  HEALTH="🔴"
elif [ "$CTX_INT" -gt 60 ] 2>/dev/null; then
  HEALTH="🟡"
else
  HEALTH="🟢"
fi

# ── Plan badge (only show MAX after first API call) ──
PLAN=""
TOK_TOTAL=$((TOK_IN + TOK_OUT))
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
  LINES_STR=" ┃ +${LA}/-${LR} (${NET_FMT})"
fi

# ── Alerts (context only — cost is in Claude's native UI) ──
ALERTS=""
[ "$CTX_INT" -gt 80 ] 2>/dev/null && ALERTS=" ⚠️ CTX"

# ── PR link (cached 60s, validated) ──
PR_STR=""
if command -v gh &>/dev/null; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [ -n "$BRANCH" ]; then
    BRANCH_SAFE=$(echo "$BRANCH" | tr '/' '-')
    PR_CACHE="/tmp/apex-pr-cache-${BRANCH_SAFE}.json"
    PR_DATA=""

    if [ -f "$PR_CACHE" ]; then
      CACHE_AGE=$(( $(date +%s) - $(stat -f %m "$PR_CACHE" 2>/dev/null || echo "0") ))
      [ "$CACHE_AGE" -lt 60 ] && PR_DATA=$(cat "$PR_CACHE" 2>/dev/null)
    fi

    if [ -z "$PR_DATA" ]; then
      # Try with timeout (coreutils), fall back to bg+kill on macOS
      if command -v timeout &>/dev/null; then
        PR_DATA=$(timeout 2 gh pr view --json number,state,url 2>/dev/null)
      else
        gh pr view --json number,state,url > "/tmp/apex-pr-fetch-$$.json" 2>/dev/null &
        GH_PID=$!
        sleep 2
        if kill -0 "$GH_PID" 2>/dev/null; then
          kill "$GH_PID" 2>/dev/null
          wait "$GH_PID" 2>/dev/null
        else
          wait "$GH_PID" 2>/dev/null
          PR_DATA=$(cat "/tmp/apex-pr-fetch-$$.json" 2>/dev/null)
        fi
        rm -f "/tmp/apex-pr-fetch-$$.json"
      fi
      if [ -n "$PR_DATA" ]; then
        echo "$PR_DATA" > "$PR_CACHE"
      else
        echo '{"none":true}' > "$PR_CACHE"
      fi
    fi

    if [ -n "$PR_DATA" ] && [ "$PR_DATA" != '{"none":true}' ]; then
      PR_NUM=$(echo "$PR_DATA" | jq -r '.number // empty')
      PR_STATE=$(echo "$PR_DATA" | jq -r '.state // empty')
      PR_URL=$(echo "$PR_DATA" | jq -r '.url // empty')
      # Validate URL: must start with https://github.com/
      if [ -n "$PR_NUM" ] && echo "$PR_URL" | grep -q '^https://github\.com/' 2>/dev/null; then
        case "$PR_STATE" in
          MERGED) PR_ICON="🟣" ;;
          OPEN)   PR_ICON="🟢" ;;
          CLOSED) PR_ICON="⚪" ;;
          *)      PR_ICON="PR" ;;
        esac
        PR_STR=" ┃ ${PR_ICON} \e]8;;${PR_URL}\a#${PR_NUM}\e]8;;\a"
      fi
    fi
  fi
fi

# ── Build context segment ──
if [ "$CTX_SIZE" -gt 0 ] 2>/dev/null; then
  CTX_STR="${HEALTH} ${BAR} ${CTX_INT}% $(fmt_tok "$TOK_USED")/$(fmt_tok "$CTX_SIZE")"
else
  CTX_STR="${HEALTH} ready"
fi

# ── Output ──
# Segments: APEX | model | context | lines | duration | alerts | PR
printf '%b' "⚔️ APEX ┃ ${M} ${PLAN}┃ ${CTX_STR}${LINES_STR} ┃ ${DUR_FMT}${ALERTS}${PR_STR}\n"
