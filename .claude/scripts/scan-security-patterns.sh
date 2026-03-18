#!/bin/bash
# scan-security-patterns.sh — PreToolUse hook on Write|Edit|MultiEdit
# Scans file content being written/edited for hardcoded secrets and dangerous patterns.
# Exit 2 = block with educational message. Exit 0 = allow.
#
# This is a deterministic security gate — catches secrets BEFORE they enter the codebase.
# by L.B. & Claude · São Paulo, 2026

if ! command -v jq &> /dev/null; then
  exit 0
fi

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

# Only scan code files, not configs or docs
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.py|*.rb|*.go|*.java|*.php) ;;
  *) exit 0 ;;
esac

# Get the content being written. For Write, it's .tool_input.content.
# For Edit, it's .tool_input.new_string.
CONTENT=""
if [ "$TOOL_NAME" = "Write" ]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
elif [ "$TOOL_NAME" = "Edit" ] || [ "$TOOL_NAME" = "MultiEdit" ]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
fi

if [ -z "$CONTENT" ]; then
  exit 0
fi

deny() {
  local reason="$1"
  echo "$reason" >&2
  exit 2
}

# ── Pattern 1: Hardcoded API keys with known prefixes ──
# These prefixes are provider-specific and should NEVER be in source code.
if echo "$CONTENT" | grep -qE "(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|AKIA[A-Z0-9]{16}|sk_live_[a-zA-Z0-9]+|sk_test_[a-zA-Z0-9]+)"; then
  deny "⚔️ APEX SECURITY: Hardcoded API key detected.

  📚 WHY THIS IS DANGEROUS:
  API keys in source code get committed to git, shared with collaborators,
  and potentially exposed publicly. Attackers scan GitHub for these prefixes.

  ✅ SAFE ALTERNATIVE:
  1. Store the key in .env.local (which is git-ignored)
  2. Reference it as process.env.YOUR_KEY_NAME
  3. Add the variable name to .env.example (without the value)

  Example:
    .env.local:     STRIPE_SECRET_KEY=sk_live_abc123...
    Your code:      const key = process.env.STRIPE_SECRET_KEY"
fi

# ── Pattern 2: eval() and new Function() — code injection risk ──
if echo "$CONTENT" | grep -qE '(eval\s*\(|new\s+Function\s*\()'; then
  deny "⚔️ APEX SECURITY: eval() or new Function() detected.

  📚 WHY THIS IS DANGEROUS:
  eval() executes arbitrary code. If any user input reaches eval(),
  an attacker can run any code on your server (Remote Code Execution).

  ✅ SAFE ALTERNATIVE:
  - For JSON parsing: use JSON.parse() instead of eval()
  - For dynamic logic: use a lookup object/Map instead of eval()
  - For templates: use tagged template literals, not string concatenation + eval"
fi

# ── Pattern 3: Hardcoded Bearer tokens ──
if echo "$CONTENT" | grep -qE "Authorization.*Bearer ['\"][a-zA-Z0-9._-]{20,}['\"]"; then
  deny "⚔️ APEX SECURITY: Hardcoded Bearer token in Authorization header.

  📚 WHY THIS IS DANGEROUS:
  Tokens in source code are visible to anyone with repo access.
  They get committed to git history permanently — even if deleted later.

  ✅ SAFE ALTERNATIVE:
  const token = process.env.API_TOKEN;
  headers: { Authorization: \`Bearer \${token}\` }"
fi

# ── Pattern 4: SQL template literals with interpolation ──
if echo "$CONTENT" | grep -qE "(query|execute|sql)\s*\(\s*\`[^\`]*\\\$\{"; then
  deny "⚔️ APEX SECURITY: SQL query with template literal interpolation detected.

  📚 WHY THIS IS DANGEROUS:
  Inserting variables directly into SQL via \${...} enables SQL injection.
  An attacker can modify the query to read, modify, or delete any data.

  ✅ SAFE ALTERNATIVE:
  Use parameterized queries:
    db.query('SELECT * FROM users WHERE id = \$1', [userId])
  Or with Drizzle/Prisma:
    db.select().from(users).where(eq(users.id, userId))"
fi

exit 0
