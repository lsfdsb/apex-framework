#!/bin/bash
# install-user-level.sh — Makes APEX standard across ALL projects
#
# Per Claude Code docs, ~/.claude/ is the USER scope:
# "User scope is best for: Personal preferences you want everywhere."
# Skills, agents, hooks, and settings in ~/.claude/ apply to ALL projects.
#
# WHAT THIS DOES:
# 1. Copies universal skills to ~/.claude/skills/
# 2. Copies agents to ~/.claude/agents/
# 3. Copies output styles to ~/.claude/output-styles/
# 4. Copies hook scripts to ~/.claude/scripts/
# 5. Copies path-based rules to ~/.claude/rules/
# 6. Creates ~/.claude/CLAUDE.md (user-level constitution)
# 7. Creates ~/.claude/settings.json WITH hooks, permissions, and sandbox
# 8. Creates ~/.claude/apex-preferences.json (language + cost threshold)
#
# RUN: chmod +x install-user-level.sh && ./install-user-level.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APEX_DIR="$SCRIPT_DIR"
USER_CLAUDE="$HOME/.claude"
VERSION=$(cat "$(cd "$(dirname "$0")" && pwd)/VERSION" 2>/dev/null | tr -d '[:space:]' || echo "5.6.0")

echo ""
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║          ⚔️  APEX Framework v${VERSION}          ║"
echo "  ║     User-Level Installation                  ║"
echo "  ╚══════════════════════════════════════════════╝"
echo ""
echo "  Installing to: $USER_CLAUDE"
echo "  Applies to: ALL your projects automatically"
echo ""

# --- Check jq dependency ---
if ! command -v jq &> /dev/null; then
  echo "⚠️  jq is required for APEX hooks. Install it first:"
  echo "   macOS:  brew install jq"
  echo "   Ubuntu: sudo apt install jq"
  echo "   Other:  https://jqlang.github.io/jq/download/"
  echo ""
  read -p "Continue without jq? Hooks will show warnings. (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Install jq and try again."
    exit 1
  fi
fi

# Create directories
mkdir -p "$USER_CLAUDE/skills"
mkdir -p "$USER_CLAUDE/agents"
mkdir -p "$USER_CLAUDE/output-styles"
mkdir -p "$USER_CLAUDE/scripts"
mkdir -p "$USER_CLAUDE/rules"

# --- Universal Skills (useful in every project) ---
UNIVERSAL_SKILLS=(
  "code-standards"
  "design-system"
  "cx-review"
  "teach"
  "apex-stack"
  "verify-lib"
  "sql-practices"
  "debug"
  "a11y"
  "cost-management"
  "about"
  "performance"
  "security"
  "evolve"
)

echo "📦 Installing ${#UNIVERSAL_SKILLS[@]} universal skills..."
for skill in "${UNIVERSAL_SKILLS[@]}"; do
  if [ -d "$APEX_DIR/.claude/skills/$skill" ]; then
    cp -r "$APEX_DIR/.claude/skills/$skill" "$USER_CLAUDE/skills/"
    echo "   ✅ $skill"
  else
    echo "   ⚠️  $skill not found, skipping"
  fi
done

# --- Agents ---
echo ""
echo "🤖 Installing agents..."
for agent in "$APEX_DIR"/.claude/agents/*.md; do
  if [ -f "$agent" ]; then
    cp "$agent" "$USER_CLAUDE/agents/"
    echo "   ✅ $(basename "$agent" .md)"
  fi
done

# --- Output Styles ---
echo ""
echo "🎨 Installing output styles..."
for style in "$APEX_DIR"/.claude/output-styles/*.md; do
  if [ -f "$style" ]; then
    cp "$style" "$USER_CLAUDE/output-styles/"
    echo "   ✅ $(basename "$style" .md)"
  fi
done

# --- Scripts (hooks + statusline) ---
echo ""
echo "🔧 Installing hook scripts..."
for script in "$APEX_DIR"/.claude/scripts/*.sh; do
  if [ -f "$script" ]; then
    cp "$script" "$USER_CLAUDE/scripts/"
    chmod +x "$USER_CLAUDE/scripts/$(basename "$script")"
    echo "   ✅ $(basename "$script")"
  fi
done

# --- Path-based Rules ---
echo ""
echo "📏 Installing path-based rules..."
for rule in "$APEX_DIR"/.claude/rules/*.md; do
  if [ -f "$rule" ]; then
    cp "$rule" "$USER_CLAUDE/rules/"
    echo "   ✅ $(basename "$rule")"
  fi
done

# --- Preferences file (language + cost threshold) ---
if [ ! -f "$USER_CLAUDE/apex-preferences.json" ]; then
  echo ""
  echo "🌐 Creating preferences file..."
  cat > "$USER_CLAUDE/apex-preferences.json" << 'PREFJSON'
{
  "language": "ask",
  "cost_alert_threshold_usd": 5.00,
  "auto_update": true,
  "update_repo": "lsfdsb/apex-framework",
  "update_branch": "main"
}
PREFJSON
  echo "   ✅ ~/.claude/apex-preferences.json (language will be asked on first session)"
else
  echo ""
  echo "🌐 Preferences file already exists, keeping current settings."
fi

# --- User CLAUDE.md ---
echo ""
echo "📄 Installing user-level CLAUDE.md..."
cat > "$USER_CLAUDE/CLAUDE.md" << 'CLAUDEMD'
# APEX Framework — User Constitution

> "Simplicity is the ultimate sophistication." — Da Vinci

## I Am

Building world-class applications with Claude Code. I follow the APEX philosophy: design like Ive, code like Torvalds, secure like Ionescu, business like Amodei, experience like Disney.

## Always

- Explain what you're building and why (educational output)
- Check for a PRD before implementing new features
- Run tests after writing code
- Verify libraries before installing (security, license, maintenance)
- Adapt to my project's existing stack — don't force the APEX default stack

## Never

- Skip steps in the workflow (PRD → Architecture → Research → Build → QA → Deploy)
- Install unverified dependencies
- Push directly to main/master
- Leave code untested
- Use console.log in production
- Hallucinate an API — always research first
CLAUDEMD
echo "   ✅ ~/.claude/CLAUDE.md"

# --- User Settings (WITH hooks, permissions, sandbox) ---
echo ""
echo "⚙️  Installing user settings..."
if [ -f "$USER_CLAUDE/settings.json" ]; then
  echo "   📋 Backing up existing settings to settings.json.backup"
  cp "$USER_CLAUDE/settings.json" "$USER_CLAUDE/settings.json.backup"
fi

# Note: User-level hooks use ~/.claude/scripts/ paths
cat > "$USER_CLAUDE/settings.json" << 'SETTINGSJSON'
{
  "outputStyle": "~/.claude/output-styles/apex-educational.md",
  "model": "opusplan",
  "preferences": {
    "teammateMode": "tmux"
  },
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Skill",
      "Bash(npm run *)",
      "Bash(npx vitest *)",
      "Bash(npx playwright *)",
      "Bash(npx tsc *)",
      "Bash(npx eslint *)",
      "Bash(npx prettier *)",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git branch *)",
      "Bash(git add *)",
      "Bash(git checkout *)",
      "Bash(git stash *)",
      "Bash(npm view *)",
      "Bash(npm audit *)",
      "Bash(npx drizzle-kit *)",
      "Bash(cat > ~/.claude/apex-preferences.json *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push * main)",
      "Bash(git push * master)",
      "Bash(git push * -f)",
      "Bash(git push * --force)",
      "Read(~/.ssh/*)",
      "Read(~/.aws/*)",
      "Read(~/.gnupg/*)",
      "Read(.env)",
      "Read(.env.local)",
      "Read(.env.production)",
      "Read(.env.*.local)",
      "Edit(~/.bashrc)",
      "Edit(~/.zshrc)",
      "Edit(~/.claude/settings.json)"
    ]
  },
  "sandbox": {
    "filesystem": {
      "denyWrite": [
        "/etc/**",
        "/usr/**",
        "/System/**",
        "~/.ssh/**",
        "~/.aws/**",
        "~/.gnupg/**",
        "~/.claude/settings.json"
      ],
      "denyRead": ["~/.ssh/id_*", "~/.aws/credentials"]
    }
  },
  "statusLine": {
    "type": "command",
    "command": "~/.claude/scripts/apex-statusline.sh",
    "timeout": 5
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/auto-update.sh",
            "timeout": 30
          },
          {
            "type": "command",
            "command": "~/.claude/scripts/session-context.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/block-dangerous-commands.sh",
            "timeout": 5
          },
          {
            "type": "command",
            "command": "~/.claude/scripts/verify-install.sh",
            "timeout": 5
          },
          {
            "type": "command",
            "command": "~/.claude/scripts/enforce-commit-msg.sh",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/protect-files.sh",
            "timeout": 5
          },
          {
            "type": "command",
            "command": "~/.claude/scripts/enforce-workflow.sh",
            "timeout": 5
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/auto-format.sh",
            "timeout": 15
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/pre-compact.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/stop-gate.sh",
            "timeout": 30
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/scripts/notify.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
SETTINGSJSON
echo "   ✅ ~/.claude/settings.json (full config: hooks, permissions, sandbox)"

# --- Summary ---
echo ""
echo "============================================="
echo "✅ APEX v${VERSION} installed at user level!"
echo ""
echo "What's available in EVERY project now:"
echo "  📦 ${#UNIVERSAL_SKILLS[@]} skills (code-standards, design-system, security, etc.)"
echo "  🤖 3 subagents (code-reviewer, researcher, design-reviewer)"
echo "  🎨 Output style (educational)"
echo "  🔧 11 hook scripts (security, formatting, workflow enforcement)"
echo "  📏 7 path-based rules (testing, components, api, sql, supabase, nextjs, error-handling)"
echo "  🛡️ Permissions + sandbox (blocks rm -rf, protects secrets)"
echo "  📊 Status line (model, tokens, cost, context %)"
echo ""
echo "For project-specific skills (prd, architecture, qa, commit, etc.):"
echo "  cd your-project && $APEX_DIR/apex-init-project.sh"
echo ""
echo "Or just start Claude Code and say: 'Initialize APEX for this project'"
echo ""
echo "⚔️ This is the way."
echo ""
