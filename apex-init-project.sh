#!/bin/bash
# apex-init-project.sh — Install APEX Framework into any project
# Usage: /path/to/apex-framework/apex-init-project.sh
# Run from inside your project directory (where .git/ is)
#
# This is the PRIMARY installer. Each project gets its own complete
# copy of the framework in .claude/ — no user-level install needed.
#
# by L.B. & Claude · São Paulo, 2026

set -e

# Support running from any location — find APEX relative to this script
APEX_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(pwd)"

# ── Verify we're in a git repo ──
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository. Run 'git init' first, or cd into your project."
  exit 1
fi

# ── Verify apex-framework exists ──
if [ ! -d "$APEX_DIR/.claude" ]; then
  echo "❌ APEX framework not found at $APEX_DIR. Clone the repo first."
  exit 1
fi

APEX_VERSION=$(cat "$APEX_DIR/VERSION" 2>/dev/null | tr -d '[:space:]' || echo "5.12.0")
APEX_V_SHORT=$(echo "$APEX_VERSION" | sed 's/\.[0-9]*$//')

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║    ⚔️  APEX Framework v${APEX_V_SHORT} — Project Setup   ║"
echo "  ║     by L.B. & Claude · São Paulo, 2026      ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "📁 Project: $PROJECT_DIR"
echo ""

# ── ALL skills (complete framework copy) ──
echo "📦 Installing all skills..."
mkdir -p .claude/skills
INSTALLED_SKILLS=0
for skill_dir in "$APEX_DIR"/.claude/skills/*/; do
  if [ -d "$skill_dir" ]; then
    skill=$(basename "$skill_dir")
    cp -r "$skill_dir" ".claude/skills/$skill"
    INSTALLED_SKILLS=$((INSTALLED_SKILLS + 1))
  fi
done
echo "   ✅ $INSTALLED_SKILLS skills installed"

# ── Agents ──
echo ""
echo "🤖 Installing agents..."
mkdir -p .claude/agents
INSTALLED_AGENTS=0
for agent in "$APEX_DIR"/.claude/agents/*.md; do
  if [ -f "$agent" ]; then
    cp "$agent" .claude/agents/
    INSTALLED_AGENTS=$((INSTALLED_AGENTS + 1))
  fi
done
echo "   ✅ $INSTALLED_AGENTS agents installed"

# ── Scripts (hooks) ──
echo ""
echo "🔧 Installing hook scripts..."
mkdir -p .claude/scripts
cp "$APEX_DIR"/.claude/scripts/*.sh .claude/scripts/
chmod +x .claude/scripts/*.sh
echo "   ✅ $(ls .claude/scripts/*.sh | wc -l | tr -d ' ') scripts installed"

# ── Rules (path-based) ──
echo ""
echo "📏 Installing rules..."
if [ -d "$APEX_DIR/.claude/rules" ]; then
  cp -r "$APEX_DIR/.claude/rules" .claude/
  echo "   ✅ $(ls .claude/rules/*.md 2>/dev/null | wc -l | tr -d ' ') rules installed"
fi

# ── Output Styles ──
echo ""
echo "🎨 Installing output styles..."
if [ -d "$APEX_DIR/.claude/output-styles" ]; then
  cp -r "$APEX_DIR/.claude/output-styles" .claude/
  echo "   ✅ $(ls .claude/output-styles/*.md 2>/dev/null | wc -l | tr -d ' ') output styles installed"
fi

# ── Settings ──
echo ""
echo "⚙️  Installing settings..."
if [ -f ".claude/settings.json" ]; then
  cp ".claude/settings.json" ".claude/settings.json.backup"
  echo "   📋 Backed up existing settings.json"
fi
cp "$APEX_DIR/.claude/settings.json" .claude/settings.json
echo "   ✅ settings.json (hooks, permissions, sandbox, statusLine)"

# ── Git hooks ──
echo ""
echo "🪝 Installing git hooks..."
if [ -d "$APEX_DIR/.claude/git-hooks" ]; then
  cp -r "$APEX_DIR/.claude/git-hooks" .claude/
  mkdir -p .git/hooks
  cp .claude/git-hooks/pre-commit .git/hooks/pre-commit 2>/dev/null || true
  cp .claude/git-hooks/commit-msg .git/hooks/commit-msg 2>/dev/null || true
  chmod +x .claude/git-hooks/* .git/hooks/pre-commit .git/hooks/commit-msg 2>/dev/null || true
  echo "   ✅ pre-commit + commit-msg"
fi

# ── CLAUDE.md ──
echo ""
echo "📄 Installing CLAUDE.md..."
if [ ! -f "CLAUDE.md" ]; then
  cp "$APEX_DIR/CLAUDE.md" .
  echo "   ✅ CLAUDE.md (project constitution)"
else
  echo "   📋 CLAUDE.md exists — checking for missing sections..."
  SECTIONS_ADDED=0
  # Check for critical sections that may have been added in newer versions
  REQUIRED_SECTIONS=("## Agent Teams" "## Update" "## Workflow" "## Code Standards" "## Git Workflow")
  for section in "${REQUIRED_SECTIONS[@]}"; do
    if ! grep -q "$section" "CLAUDE.md" 2>/dev/null; then
      # Extract section from framework CLAUDE.md (from header to next ## or EOF)
      SECTION_CONTENT=$(sed -n "/^${section}$/,/^## [^${section:3:1}]/{ /^## [^${section:3:1}]/!p; }" "$APEX_DIR/CLAUDE.md" 2>/dev/null)
      if [ -n "$SECTION_CONTENT" ]; then
        echo "" >> "CLAUDE.md"
        echo "$SECTION_CONTENT" >> "CLAUDE.md"
        echo "   ✅ Added missing section: $section"
        SECTIONS_ADDED=$((SECTIONS_ADDED + 1))
      fi
    fi
  done
  if [ "$SECTIONS_ADDED" -eq 0 ]; then
    echo "   ✅ CLAUDE.md is up to date (all sections present)"
  else
    echo "   ✅ Added $SECTIONS_ADDED missing section(s) to CLAUDE.md"
  fi
fi

# ── VERSION marker ──
echo "$APEX_VERSION" > .claude/.apex-version

# ── .gitignore additions ──
echo ""
echo "📝 Checking .gitignore..."
if [ -f ".gitignore" ]; then
  if ! grep -q "settings.local.json" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# APEX Framework" >> .gitignore
    echo ".claude/settings.local.json" >> .gitignore
    echo ".claude/.apex-state.json" >> .gitignore
    echo ".claude/.apex-version" >> .gitignore
    echo "   ✅ Added APEX entries to .gitignore"
  else
    echo "   ✅ .gitignore already has APEX entries"
  fi
else
  cp "$APEX_DIR/.gitignore" . 2>/dev/null || true
  echo "   ✅ .gitignore created"
fi

# ── Design DNA (pattern library) ──
echo ""
echo "🎨 Installing Design DNA pattern library..."
if [ -d "$APEX_DIR/docs/design-dna" ]; then
  mkdir -p docs/design-dna
  # HTML pattern pages + JS modules
  cp "$APEX_DIR"/docs/design-dna/*.html docs/design-dna/ 2>/dev/null || true
  cp "$APEX_DIR"/docs/design-dna/*.js docs/design-dna/ 2>/dev/null || true
  DNA_COUNT=$(ls docs/design-dna/*.html 2>/dev/null | wc -l | tr -d ' ')

  # Design DNA Starters (v5.13+) — tokens, components, recipes
  STARTER_COUNT=0
  if [ -d "$APEX_DIR/docs/design-dna/tokens" ]; then
    mkdir -p docs/design-dna/tokens/palettes
    cp "$APEX_DIR"/docs/design-dna/tokens/*.css docs/design-dna/tokens/ 2>/dev/null || true
    cp "$APEX_DIR"/docs/design-dna/tokens/palettes/*.css docs/design-dna/tokens/palettes/ 2>/dev/null || true
    STARTER_COUNT=$((STARTER_COUNT + $(ls docs/design-dna/tokens/*.css docs/design-dna/tokens/palettes/*.css 2>/dev/null | wc -l | tr -d ' ')))
  fi
  if [ -d "$APEX_DIR/docs/design-dna/starters" ]; then
    for subdir in layout primitives patterns; do
      if [ -d "$APEX_DIR/docs/design-dna/starters/$subdir" ]; then
        mkdir -p "docs/design-dna/starters/$subdir"
        cp "$APEX_DIR/docs/design-dna/starters/$subdir"/*.tsx "docs/design-dna/starters/$subdir/" 2>/dev/null || true
        cp "$APEX_DIR/docs/design-dna/starters/$subdir"/*.ts "docs/design-dna/starters/$subdir/" 2>/dev/null || true
        STARTER_COUNT=$((STARTER_COUNT + $(ls "docs/design-dna/starters/$subdir"/* 2>/dev/null | wc -l | tr -d ' ')))
      fi
    done
  fi
  if [ -d "$APEX_DIR/docs/design-dna/recipes" ]; then
    mkdir -p docs/design-dna/recipes
    cp "$APEX_DIR"/docs/design-dna/recipes/*.md docs/design-dna/recipes/ 2>/dev/null || true
    STARTER_COUNT=$((STARTER_COUNT + $(ls docs/design-dna/recipes/*.md 2>/dev/null | wc -l | tr -d ' ')))
  fi

  echo "   ✅ $DNA_COUNT pattern pages + 2 JS modules"
  [ "$STARTER_COUNT" -gt 0 ] && echo "   ✅ $STARTER_COUNT starter files (tokens, components, recipes)"
  echo "   Preview: node -e \"require('http').createServer((q,s)=>{let f=q.url.split('?')[0];if(f==='/')f='/index.html';if(!require('path').extname(f))f+='.html';const p=require('path').join(__dirname,'docs/design-dna',f);if(!require('fs').existsSync(p)){s.writeHead(404);s.end();return}s.writeHead(200,{'Content-Type':require('path').extname(p)==='.js'?'text/javascript':'text/html'});require('fs').createReadStream(p).pipe(s)}).listen(3001)\""
fi

# ── Docs directories ──
mkdir -p docs/prd docs/architecture docs/research docs/reviews

# ── Summary ──
echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ APEX v$APEX_VERSION installed in $(basename "$PROJECT_DIR")!"
echo ""
echo "   $INSTALLED_SKILLS skills"
echo "   $INSTALLED_AGENTS agents"
echo "   $(ls .claude/scripts/*.sh | wc -l | tr -d ' ') hook scripts"
echo "   $(ls .claude/rules/*.md 2>/dev/null | wc -l | tr -d ' ') path-based rules"
echo "   2 git hooks (pre-commit + commit-msg)"
echo "   StatusLine + Sandbox + Permissions configured"
echo ""
echo "To update the framework later:"
echo "   cd $APEX_DIR && git pull"
echo "   cd $PROJECT_DIR && $APEX_DIR/apex-init-project.sh"
echo ""
echo "Or during a Claude session, use /update"
echo ""
echo "⚔️ This is the way."
echo ""
