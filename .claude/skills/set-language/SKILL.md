---
name: set-language
description: Sets the user's preferred language for APEX (en-us or pt-br). Persists across sessions. This skill should be used when the user says "set language", "change language", "trocar idioma", "português", "english", "switch to English", "trocar para português", or at the start of any new session when language preference is not yet saved.
allowed-tools: Bash
---

# Set APEX Language Preference

When the user selects their language, save it permanently:

## For English:
```bash
mkdir -p ~/.claude
cat > ~/.claude/apex-preferences.json << 'EOF'
{"language":"en-us","cost_alert_threshold_usd":5.00}
EOF
echo "✅ Language set to English (en-us). This persists across all sessions."
```

## For Portuguese:
```bash
mkdir -p ~/.claude
cat > ~/.claude/apex-preferences.json << 'EOF'
{"language":"pt-br","cost_alert_threshold_usd":5.00}
EOF
echo "✅ Idioma definido para Português (pt-br). Isso persiste em todas as sessões."
```

After saving, confirm to the user:
- en-us: "Your language is now English. All APEX explanations will be in English. Code stays in English. This is saved permanently — you won't be asked again."
- pt-br: "Seu idioma agora é Português. Todas as explicações do APEX serão em português. Código permanece em inglês. Isso foi salvo permanentemente — você não será perguntado novamente."

The preference file at `~/.claude/apex-preferences.json` is read by the SessionStart hook every time Claude Code starts. The `cost_alert_threshold_usd` field controls when you get cost warnings (default: $5.00 per session).
