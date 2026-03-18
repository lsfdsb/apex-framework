# APEX Framework v5.2 — Complete Installation Guide

> Every step is explained. Nothing is assumed. Official sources only. Zero Homebrew.
> Forged by Lucas Bueno & Claude · São Paulo, March 2026

---

## Prerequisites

| Requirement | Why | Verify |
|-------------|-----|--------|
| macOS 13+ (Tahoe ✅) | Claude Code runs on macOS 13+ | Apple → About This Mac |
| Claude Max ($100/200 month) | Claude Code + higher limits | claude.ai/settings |
| ~30 minutes | One-time setup, then automatic | — |

---

## PHASE 1 — Tools (once in your life)

### 1.1 Node.js — from the official website

📚 *What it is*: The engine that runs JavaScript outside the browser. Your Next.js apps need it.

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

📚 *What it is*: A single binary that reads JSON. Our hooks use it. Zero dependencies.

Check your chip:

```
uname -m
```

If `arm64` (Mac M1/M2/M3/M4):

```
mkdir -p ~/.local/bin
```

```
curl -fsSL https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-macos-arm64 -o ~/.local/bin/jq
```

```
chmod +x ~/.local/bin/jq
```

If `x86_64` (Intel Mac), replace `arm64` with `amd64` in the curl command above.

Add to PATH:

```
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

```
source ~/.zshrc
```

Verify:

```
jq --version
```

Expected: `jq-1.7.1`.

### 1.3 Claude Code — Anthropic native installer

```
/bin/bash -c "$(curl -fsSL https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/install.sh)"
```

**Close and reopen Terminal**, then:

```
claude --version
```

If `command not found`:

```
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

```
source ~/.zshrc
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
3. Publisher: **Anthropic** (verified, 2M+ installs)
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

**Keyboard shortcut for Claude Code:**

`Cmd + Shift + P` → "Open Keyboard Shortcuts JSON" → add:

```json
[
  {
    "key": "cmd+shift+c",
    "command": "workbench.action.terminal.sendSequence",
    "args": { "text": "claude\n" },
    "when": "terminalFocus"
  }
]
```

📚 *Tip*: Drag the terminal panel to the right side. Code on the left, Claude on the right. Changes appear in real-time. This is the way.

### 2.2 iTerm2 (optional, for Agent Teams)

1. Download from **https://iterm2.com**
2. Drag to Applications
3. Preferences (`Cmd + ,`) → Profiles → Keys → Left Option key: **Esc+**

📚 *Why*: Agent Teams use split panes. iTerm2 handles this natively.

### 2.3 Local Preview

No installation needed. When you run `npm run dev`, the app opens at:

```
http://localhost:3000
```

Hot reload updates automatically when code changes.

---

## PHASE 3 — Install APEX Globally (once)

### 3.1 Extract

```
cd ~/Downloads
```

```
mkdir -p ~/apex-framework
```

```
tar xf apex-framework-v5.2-complete.tar -C ~/apex-framework
```

### 3.2 Install

```
cd ~/apex-framework
```

```
chmod +x install-user-level.sh
```

```
./install-user-level.sh
```

### 3.3 Complete the 2 skills the installer skips

```
cp -r ~/apex-framework/.claude/skills/debug ~/.claude/skills/debug
```

```
cp -r ~/apex-framework/.claude/skills/a11y ~/.claude/skills/a11y
```

### 3.4 Verify

```
ls ~/.claude/skills/ | wc -l
```

Expected: **15**.

---

## PHASE 4 — Create Your First Project

```
mkdir -p ~/my-first-apex-app && cd ~/my-first-apex-app
```

```
git init
```

```
mkdir -p .claude/skills
```

```
for skill in prd architecture research qa security performance deploy commit changelog init e2e cicd; do cp -r ~/apex-framework/.claude/skills/$skill .claude/skills/; done
```

```
cp -r ~/apex-framework/.claude/scripts .claude/
```

```
cp -r ~/apex-framework/.claude/rules .claude/
```

```
cp ~/apex-framework/.claude/settings.json .claude/settings.json
```

```
cp ~/apex-framework/.claude/settings.local.json .claude/settings.local.json
```

```
cp -r ~/apex-framework/.claude/git-hooks .claude/
```

```
mkdir -p .git/hooks
```

```
cp .claude/git-hooks/pre-commit .git/hooks/pre-commit
```

```
cp .claude/git-hooks/commit-msg .git/hooks/commit-msg
```

```
chmod +x .claude/scripts/*.sh .claude/git-hooks/* .git/hooks/*
```

```
cp ~/apex-framework/CLAUDE.md .
```

```
cp ~/apex-framework/.gitignore .
```

```
mkdir -p docs/prd docs/architecture docs/research docs/reviews
```

```
git add .
```

```
git commit -m "chore: initialize APEX Framework v5.2"
```

---

## PHASE 5 — Launch

```
code .
```

In VS Code terminal (`Ctrl + `` `):

```
claude
```

**Final test:**

```
Build me a task management app
```

Claude should BLOCK and ask for a PRD first. If it blocks: **APEX is 100% operational**. ✅

---

## Next Projects

Only Phase 4. Or inside Claude Code:

```
/init
```

---

## Official Sources (zero third-party)

| Tool | Source | Verification |
|------|--------|-------------|
| Node.js | nodejs.org | OpenJS Foundation |
| jq | github.com/jqlang/jq | MIT, official binary |
| Claude Code | Anthropic | Signed + Apple notarized |
| VS Code | code.visualstudio.com | Microsoft, MIT |
| Claude extension | Anthropic (Marketplace) | Verified publisher |
| iTerm2 | iterm2.com | GPLv2, 15+ years |
| Git | Apple | Comes with macOS |

---

*Forged by Lucas Bueno & Claude · `/about` for the full story*

**This is the way.** ⚔️
