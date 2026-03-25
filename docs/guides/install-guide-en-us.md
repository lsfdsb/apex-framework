# APEX Framework v5.21.0 — Complete Installation Guide

> Every step is explained. Nothing is assumed. Official sources only. Zero Homebrew.
> Forged by L.B. & Claude · São Paulo, March 2026

---

## Prerequisites

| Requirement | Why | Verify |
|-------------|-----|--------|
| macOS 13+ or Linux | Claude Code runs on macOS 13+ and Linux | Apple → About This Mac |
| Claude Max ($100/200 month) | Claude Code + higher limits | claude.ai/settings |
| ~15 minutes | One-time setup, then automatic | — |

---

## PHASE 1 — Tools (once in your life)

### 1.1 Node.js — from the official website

*What it is*: The engine that runs JavaScript outside the browser. Your Next.js apps need it.

1. Open **https://nodejs.org**
2. Click the green **LTS** button
3. Open the downloaded `.pkg` → Next → Next → Install
4. Close and reopen Terminal

Verify:

```
node --version
```

```
npm --version
```

Expected: `v22+` and `10+`.

### 1.2 jq — from the official GitHub repo

*What it is*: A single binary that reads JSON. APEX hooks use it for parsing tool inputs. Zero dependencies.

Check your chip:

```
uname -m
```

If `arm64` (Mac M1/M2/M3/M4):

```
mkdir -p ~/.local/bin
curl -fsSL https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-macos-arm64 -o ~/.local/bin/jq
chmod +x ~/.local/bin/jq
```

If `x86_64` (Intel Mac), replace `arm64` with `amd64` in the curl command above.

Add to PATH (if not already there):

```
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify:

```
jq --version
```

Expected: `jq-1.7.1`.

### 1.3 Claude Code — Anthropic native installer

```
npm install -g @anthropic-ai/claude-code
```

**Close and reopen Terminal**, then:

```
claude --version
```

### 1.4 First Login

```
claude
```

Browser opens. Login with Claude Max. Authorize. Return to Terminal. Type `/exit`.

---

## PHASE 2 — Editor and Terminal

### 2.1 VS Code

1. Download from **https://code.visualstudio.com**
2. Drag to Applications
3. Open VS Code

**Claude Code extension (official Anthropic):**

1. `Cmd + Shift + X` (Extensions)
2. Search **"Claude Code"**
3. Publisher: **Anthropic** (verified)
4. Install

**Configure the integrated terminal:**

`Cmd + Shift + P` → "Open User Settings JSON" → paste:

```json
{
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.scrollback": 10000,
  "terminal.integrated.enablePersistentSessions": true
}
```

*Tip*: Drag the terminal panel to the right side. Code on the left, Claude on the right. Changes appear in real-time. This is the way.

### 2.2 iTerm2 (optional, for Agent Teams)

1. Download from **https://iterm2.com**
2. Drag to Applications
3. Preferences (`Cmd + ,`) → Profiles → Keys → Left Option key: **Esc+**

*Why*: Agent Teams use split panes. iTerm2 handles this natively.

---

## PHASE 3 — Clone APEX (once)

```
git clone https://github.com/lsfdsb/apex-framework.git ~/.apex-framework
```

That's it. The framework is now on your machine. Updates are automatic — APEX checks GitHub for new versions on every session start.

---

## PHASE 4 — Install APEX in Your Project (once per project)

```
cd ~/your-project
~/.apex-framework/install.sh
```

**One command.** The installer:

1. Checks prerequisites (git, jq, claude)
2. Copies all 22 skills, 4 agents, 22 hook scripts, 7 rules into `.claude/`
3. Installs `settings.json` with hooks, permissions, sandbox, statusline
4. Installs git hooks (pre-commit + commit-msg)
5. Copies `CLAUDE.md` (project constitution)
6. Creates doc directories (`docs/prd`, `docs/architecture`, `docs/research`, `docs/reviews`)
7. Updates `.gitignore` with APEX entries

If you don't have a project yet:

```
mkdir ~/my-first-app && cd ~/my-first-app && git init
~/.apex-framework/install.sh
```

---

## PHASE 5 — Launch

```
code .
```

In VS Code terminal:

```
claude
```

**Final test:**

```
Build me a task management app
```

Claude should BLOCK and ask for a PRD first. If it blocks: **APEX is 100% operational**.

---

## Next Projects

Just Phase 4:

```
cd ~/another-project
~/.apex-framework/install.sh
```

Or inside an active Claude Code session:

```
/init
```

---

## Updates

APEX auto-updates on session start. It checks GitHub for newer versions and pulls changes into your project's `.claude/` directory automatically.

To manually update the source:

```
cd ~/.apex-framework && git pull
```

To re-install in a project (after manual update):

```
cd ~/your-project
~/.apex-framework/install.sh
```

---

## Official Sources (zero third-party)

| Tool | Source | Verification |
|------|--------|-------------|
| Node.js | nodejs.org | OpenJS Foundation |
| jq | github.com/jqlang/jq | MIT, official binary |
| Claude Code | npmjs.com/@anthropic-ai/claude-code | Anthropic |
| VS Code | code.visualstudio.com | Microsoft, MIT |
| Claude extension | Anthropic (Marketplace) | Verified publisher |
| iTerm2 | iterm2.com | GPLv2, 15+ years |
| Git | Apple | Comes with macOS |

---

*Forged by L.B. & Claude · `/about` for the full story*

**This is the way.**
