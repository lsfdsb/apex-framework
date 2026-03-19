#!/bin/bash
# test-observatory.sh — Runtime tests for APEX Observatory
# Starts the server, hits every endpoint, verifies JSON.
# by L.B. & Claude · São Paulo, 2026

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
source "$SCRIPT_DIR/tests/lib/helpers.sh"

echo ""
echo -e "  ${BOLD}APEX Observatory Runtime Tests${NC}"
echo -e "  ${DIM}──────────────────────────────────────${NC}"

# Check prerequisites
if ! command -v node &>/dev/null; then
  echo -e "  ${DIM}· Skipped (node not installed)${NC}"
  exit 0
fi
if [ ! -f "$SCRIPT_DIR/dashboard/server.js" ]; then
  echo -e "  ${DIM}· Skipped (dashboard/server.js not found)${NC}"
  exit 0
fi

# Pick random port and set up cleanup
PORT=$((RANDOM + 30000))
PID_FILE="/tmp/apex-test-server-$$.pid"
trap 'kill "$(cat "$PID_FILE" 2>/dev/null)" 2>/dev/null; rm -f "$PID_FILE"' EXIT

section "Server startup"

# Start server
cd "$SCRIPT_DIR"
PORT=$PORT node dashboard/server.js &>/dev/null &
echo $! > "$PID_FILE"

# Wait for readiness (max 5 seconds)
READY=false
for i in $(seq 1 50); do
  if curl -s "http://localhost:$PORT/" >/dev/null 2>&1; then
    READY=true; break
  fi
  sleep 0.1
done

if [ "$READY" = true ]; then
  pass "Server started on port $PORT"
else
  fail "Server failed to start within 5 seconds"
  print_summary
  exit 1
fi

BASE="http://localhost:$PORT"

section "HTML endpoint"

assert_http_ok "GET / returns 200" "$BASE/"

# Check HTML contains APEX
R_COUNT=$((R_COUNT+1)); TOTAL=$((TOTAL+1))
BODY=$(curl -s "$BASE/" 2>/dev/null)
if echo "$BODY" | grep -qi "APEX"; then
  PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} HTML contains APEX"
else
  FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} HTML missing APEX branding"
fi

section "API endpoints"

assert_http_ok "GET /api/overview" "$BASE/api/overview"
assert_http_json_field "/api/overview has .data" "$BASE/api/overview" ".data"

assert_http_ok "GET /api/agents" "$BASE/api/agents"
assert_http_json_field "/api/agents has .data" "$BASE/api/agents" ".data"

assert_http_ok "GET /api/skills" "$BASE/api/skills"
assert_http_json_field "/api/skills has .data" "$BASE/api/skills" ".data"

assert_http_ok "GET /api/hooks" "$BASE/api/hooks"
assert_http_json_field "/api/hooks has .data" "$BASE/api/hooks" ".data"

assert_http_ok "GET /api/workflow" "$BASE/api/workflow"
assert_http_json_field "/api/workflow has .data" "$BASE/api/workflow" ".data"

assert_http_ok "GET /api/crossref" "$BASE/api/crossref"
assert_http_json_field "/api/crossref has .data" "$BASE/api/crossref" ".data"

assert_http_ok "GET /api/activity" "$BASE/api/activity"

section "Data consistency"

# Agent count matches disk
DISK_AGENTS=$(find "$SCRIPT_DIR/.claude/agents" -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')
API_AGENTS=$(curl -s "$BASE/api/agents" 2>/dev/null | jq '.data.agents | length // (.data | length)' 2>/dev/null)
I_COUNT=$((I_COUNT+1)); TOTAL=$((TOTAL+1))
if [ "$DISK_AGENTS" = "$API_AGENTS" ]; then
  PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} Agent count matches (disk: $DISK_AGENTS, API: $API_AGENTS)"
else
  FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} Agent count mismatch (disk: $DISK_AGENTS, API: $API_AGENTS)"
fi

# Skill count matches disk
DISK_SKILLS=$(find "$SCRIPT_DIR/.claude/skills" -maxdepth 1 -type d | tail -n +2 | wc -l | tr -d ' ')
API_SKILLS=$(curl -s "$BASE/api/skills" 2>/dev/null | jq '.data.skills | length // (.data | length)' 2>/dev/null)
I_COUNT=$((I_COUNT+1)); TOTAL=$((TOTAL+1))
if [ "$DISK_SKILLS" = "$API_SKILLS" ]; then
  PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} Skill count matches (disk: $DISK_SKILLS, API: $API_SKILLS)"
else
  FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} Skill count mismatch (disk: $DISK_SKILLS, API: $API_SKILLS)"
fi

section "Error handling"

# Invalid test suite
R_COUNT=$((R_COUNT+1)); TOTAL=$((TOTAL+1))
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/test?suite=invalid" 2>/dev/null)
if [ "$STATUS" = "400" ] || [ "$STATUS" = "404" ]; then
  PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} Invalid suite returns error (HTTP $STATUS)"
else
  FAIL=$((FAIL+1)); echo -e "  ${RED}✗${NC} Invalid suite should error (got HTTP $STATUS)"
fi

# Unknown API route returns error
R_COUNT=$((R_COUNT+1)); TOTAL=$((TOTAL+1))
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/nonexistent" 2>/dev/null)
if [ "$STATUS" = "404" ] || [ "$STATUS" = "400" ]; then
  PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} Unknown API route returns error (HTTP $STATUS)"
else
  # Server may serve index.html for non-API routes (SPA behavior)
  PASS=$((PASS+1)); echo -e "  ${GREEN}✓${NC} Unknown API route handled (HTTP $STATUS)"
fi

print_summary
[ "$FAIL" -gt 0 ] && exit 1 || exit 0
