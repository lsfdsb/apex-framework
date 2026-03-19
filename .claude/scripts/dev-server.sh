#!/bin/bash
# dev-server.sh — SessionStart hook
# Auto-starts the dev server in background and captures logs for monitoring.
# Only activates if a package.json with a "dev" script exists in the project.
# by L.B. & Claude · São Paulo, 2026

# Skip if not in a project directory
if [ -z "${CLAUDE_PROJECT_DIR:-}" ]; then
  echo "⚙️ Dev server: no project directory detected. Skipped."
  exit 0
fi

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
PACKAGE_JSON="$PROJECT_DIR/package.json"
LOG_DIR="$PROJECT_DIR/.claude"
LOG_FILE="$LOG_DIR/dev-server.log"
PID_FILE="$LOG_DIR/.dev-server.pid"

# Skip if no package.json — BUT check for Design DNA (APEX framework repo)
if [ ! -f "$PACKAGE_JSON" ]; then
  # Check if this is the APEX framework repo with Design DNA
  DNA_DIR="$PROJECT_DIR/docs/design-dna"
  if [ -d "$DNA_DIR" ] && [ -f "$DNA_DIR/index.html" ]; then
    # Start the Design DNA dev server
    DNA_PID_FILE="$LOG_DIR/.dna-server.pid"
    DNA_LOG_FILE="$LOG_DIR/dna-server.log"
    # Check if already running
    if [ -f "$DNA_PID_FILE" ]; then
      OLD_PID=$(cat "$DNA_PID_FILE" 2>/dev/null)
      if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
        echo "🟢 Design DNA server running (PID $OLD_PID · http://localhost:3001)"
        exit 0
      fi
      rm -f "$DNA_PID_FILE" 2>/dev/null
    fi
    # Start DNA server
    nohup node -e "
const http=require('http'),fs=require('fs'),path=require('path');
const dir='$DNA_DIR';
const types={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8'};
http.createServer((q,s)=>{
  let file=q.url.split('?')[0];if(file==='/') file='/index.html';
  if(!path.extname(file)) file+='.html';
  const p=path.join(dir,file);
  if(!fs.existsSync(p)){s.writeHead(404);s.end('Not found');return;}
  s.writeHead(200,{'Content-Type':types[path.extname(p)]||'text/plain'});
  fs.createReadStream(p).pipe(s);
}).listen(3001,()=>console.log('Design DNA running at http://localhost:3001'));
" > "$DNA_LOG_FILE" 2>&1 &
    echo "$!" > "$DNA_PID_FILE"
    sleep 1
    if kill -0 "$(cat "$DNA_PID_FILE")" 2>/dev/null; then
      echo "🟢 Design DNA server started · http://localhost:3001"
    else
      echo "⚠️ Design DNA server failed to start. Check $DNA_LOG_FILE"
    fi
    exit 0
  fi
  echo "⚙️ Dev server: no package.json found. Not a Node.js project."
  exit 0
fi

# Skip if no jq
if ! command -v jq &> /dev/null; then
  echo "⚠️ Dev server: jq not installed — auto-start disabled."
  exit 0
fi

# Skip if no "dev" script in package.json
DEV_SCRIPT=$(jq -r '.scripts.dev // empty' "$PACKAGE_JSON" 2>/dev/null)
if [ -z "$DEV_SCRIPT" ]; then
  echo "⚙️ Dev server: no 'dev' script in package.json. Auto-start skipped."
  exit 0
fi

# Skip if project hasn't been built yet (no node_modules = dependencies not installed)
# The dev server will start automatically after the first `npm install` + `npm run dev`
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "📦 Dev server skipped — no node_modules found. Run install first, then /dev to start."
  exit 0
fi

# Skip if dev server is already running
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE" 2>/dev/null)
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    # Already running — report status
    PORT=$(grep -oE 'localhost:[0-9]+' "$LOG_FILE" 2>/dev/null | tail -1 || echo "")
    echo "🟢 Dev server running (PID $OLD_PID${PORT:+ · http://$PORT}) ━ forge is hot!"
    exit 0
  fi
  # Stale PID file — clean up
  rm -f "$PID_FILE" 2>/dev/null
fi

# Detect package manager
if [ -f "$PROJECT_DIR/pnpm-lock.yaml" ]; then
  PKG_MGR="pnpm"
elif [ -f "$PROJECT_DIR/yarn.lock" ]; then
  PKG_MGR="yarn"
elif [ -f "$PROJECT_DIR/bun.lockb" ]; then
  PKG_MGR="bun"
else
  PKG_MGR="npm"
fi

# Clear previous log
> "$LOG_FILE" 2>/dev/null

# Start dev server in background
if ! cd "$PROJECT_DIR" 2>/dev/null; then
  echo "🔴 Cannot cd to $PROJECT_DIR — dev server not started." >&2
  exit 0
fi
nohup $PKG_MGR run dev > "$LOG_FILE" 2>&1 &
DEV_PID=$!

# Save PID
echo "$DEV_PID" > "$PID_FILE"

# Wait briefly for server to start (up to 5s)
STARTED=false
for i in $(seq 1 10); do
  sleep 0.5
  # Check if process died
  if ! kill -0 "$DEV_PID" 2>/dev/null; then
    ERRORS=$(tail -5 "$LOG_FILE" 2>/dev/null)
    echo "🔴 Dev server failed to start."
    if [ -n "$ERRORS" ]; then
      echo "  Last output:"
      echo "$ERRORS"
    fi
    rm -f "$PID_FILE" 2>/dev/null
    exit 0
  fi
  # Check if server is ready (common patterns from Next.js, Vite, etc.)
  if grep -qiE '(ready|started|listening|localhost:[0-9]+|Local:)' "$LOG_FILE" 2>/dev/null; then
    STARTED=true
    break
  fi
done

if [ "$STARTED" = true ]; then
  # Extract URL
  URL=$(grep -oE 'https?://localhost:[0-9]+' "$LOG_FILE" 2>/dev/null | head -1)
  if [ -z "$URL" ]; then
    URL=$(grep -oE 'https?://127\.0\.0\.1:[0-9]+' "$LOG_FILE" 2>/dev/null | head -1)
  fi
  echo "┌──────────────────────────────────────────────┐"
  echo "│  🟢 Dev server started                        │"
  echo "│     PID $DEV_PID${URL:+ · $URL}"
  echo "│     Logs: .claude/dev-server.log              │"
  echo "│     Use /dev to check status or restart       │"
  echo "│                                               │"
  echo "│  🔥 The forge is hot. Ready to build.         │"
  echo "└──────────────────────────────────────────────┘"
else
  echo "🟡 Dev server starting (PID $DEV_PID) — forge is heating up..."
  echo "   Logs: .claude/dev-server.log"
  echo "   Use /dev to check status."
fi

exit 0
