#!/bin/bash
# language-preference.sh — SessionStart hook (runs BEFORE session-context.sh)
# Reads saved language preference and injects it into Claude's context.
# Per docs: "For SessionStart hooks, anything you write to stdout is added to Claude's context."
# Requires jq — exit 0 if missing to degrade gracefully
if ! command -v jq &> /dev/null; then exit 0; fi

PREF_FILE="$HOME/.claude/apex-preferences.json"

# Create preferences file if it doesn't exist
if [ ! -f "$PREF_FILE" ]; then
  mkdir -p "$HOME/.claude"
  echo '{"language":"ask","cost_alert_threshold_usd":5.00}' > "$PREF_FILE"
fi

# Read language preference
LANG_PREF=$(jq -r '.language // "ask"' "$PREF_FILE" 2>/dev/null)

if [ "$LANG_PREF" = "pt-br" ]; then
  echo "🌍 APEX Language: Português (pt-br) — todas as explicações em português. Código em inglês."
  echo "Para trocar: edite ~/.claude/apex-preferences.json ou diga 'switch to English'."
elif [ "$LANG_PREF" = "en-us" ]; then
  echo "🌍 APEX Language: English (en-us)"
  echo "To switch: edit ~/.claude/apex-preferences.json or say 'trocar para português'."
else
  echo "🌍 APEX Language: Not set yet. Ask the user to choose: English (en-us) or Português (pt-br)."
  echo "After they choose, save their preference by running:"
  echo "  echo '{\"language\":\"en-us\",\"cost_alert_threshold_usd\":5.00}' > ~/.claude/apex-preferences.json"
  echo "  (or \"pt-br\" for Portuguese)"
fi

exit 0
