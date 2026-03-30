---
name: update
description: Manually update the APEX Framework to the latest version. Use when auto-update can't self-update, when you want to force an update, or when starting a new project. Triggers on "update apex", "update framework", "pull latest", "sync framework", "/update".
argument-hint: '[force]'
allowed-tools: Bash, Read, Grep, Glob
---

# Update APEX Framework

Manual update command — pulls the latest APEX from GitHub and installs it into the current project.

## Process

### Step 1: Check current version

```bash
echo "Current: $(cat .claude/.apex-version 2>/dev/null || echo 'unknown')"
echo "Cache: $(cat ~/.apex-framework/VERSION 2>/dev/null || echo 'not cached')"
```

### Step 2: Pull latest from GitHub

```bash
# Fetch + force reset (handles divergent branches on macOS)
if [ -d ~/.apex-framework/.git ]; then
  cd ~/.apex-framework && git fetch origin main --depth=1 && git reset --hard origin/main
else
  gh repo clone lsfdsb/apex-framework ~/.apex-framework -- --depth=1 --branch main
fi
```

### Step 3: Install into current project

```bash
~/.apex-framework/install.sh
```

### Step 4: Verify

```bash
echo "Updated to: $(cat .claude/.apex-version 2>/dev/null || cat ~/.apex-framework/VERSION)"
```

Report the update result to the user: what version was installed, how many files were updated.

If `$ARGUMENTS` contains "force", skip version comparison and always install.
