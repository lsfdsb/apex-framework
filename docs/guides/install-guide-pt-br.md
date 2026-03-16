# APEX Framework v5.2 — Guia de Instalação Completo

> Cada passo é explicado. Nada é assumido. Só fontes oficiais. Zero Homebrew.
> Forjado por Lucas Bueno & Claude · São Paulo, Março 2026

---

## Pré-requisitos

| Requisito | Por quê | Verificar |
|-----------|---------|-----------|
| macOS 13+ (Tahoe ✅) | Claude Code roda em macOS 13+ | Apple → Sobre Este Mac |
| Claude Max ($100/200 mês) | Claude Code + limites maiores | claude.ai/settings |
| ~30 minutos | Setup único, depois é automático | — |

---

## FASE 1 — Ferramentas (uma vez na vida)

### 1.1 Node.js — direto do site oficial

📚 *O que é*: Motor que roda JavaScript fora do navegador. Seus apps Next.js precisam dele.

1. Abra **https://nodejs.org**
2. Clique no botão verde **LTS**
3. Abra o `.pkg` baixado → Next → Next → Install
4. Feche e abra o Terminal

Verificar:

```
node --version
```

```
npm --version
```

Esperado: `v22+` e `10+`.

### 1.2 jq — direto do GitHub oficial

📚 *O que é*: Binário único que lê JSON. Nossos hooks usam ele. Sem dependências.

Descubra seu chip:

```
uname -m
```

Se `arm64` (Mac M1/M2/M3/M4):

```
mkdir -p ~/.local/bin
```

```
curl -fsSL https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-macos-arm64 -o ~/.local/bin/jq
```

```
chmod +x ~/.local/bin/jq
```

Se `x86_64` (Mac Intel), troque `arm64` por `amd64` no comando curl acima.

Adicione ao PATH:

```
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

```
source ~/.zshrc
```

Verificar:

```
jq --version
```

Esperado: `jq-1.7.1`.

### 1.3 Claude Code — instalador nativo Anthropic

```
/bin/bash -c "$(curl -fsSL https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/install.sh)"
```

**Feche e abra o Terminal**, depois:

```
claude --version
```

Se `command not found`:

```
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

```
source ~/.zshrc
```

### 1.4 Primeiro Login

```
claude
```

Navegador abre. Login com Claude Max. Authorize. Volte ao Terminal. Digite `/exit`.

---

## FASE 2 — Editor e Terminal

### 2.1 VS Code

1. Baixe em **https://code.visualstudio.com**
2. Arraste para Aplicativos
3. Abra o VS Code

**Extensão Claude Code (oficial Anthropic):**

1. `Cmd + Shift + X` (Extensions)
2. Busque **"Claude Code"**
3. Publisher: **Anthropic** (verificado, 2M+ installs)
4. Install

**Configurar terminal integrado:**

`Cmd + Shift + P` → "Open User Settings JSON" → cole:

```json
{
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.scrollback": 10000,
  "terminal.integrated.enablePersistentSessions": true
}
```

**Atalho para Claude Code:**

`Cmd + Shift + P` → "Open Keyboard Shortcuts JSON" → adicione:

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

📚 *Dica*: Arraste o painel do terminal para o lado direito. Código à esquerda, Claude à direita. Mudanças aparecem em tempo real. Este é o caminho.

### 2.2 iTerm2 (opcional, para Agent Teams)

1. Baixe em **https://iterm2.com**
2. Arraste para Aplicativos
3. Preferences (`Cmd + ,`) → Profiles → Keys → Left Option key: **Esc+**

📚 *Por quê*: Agent Teams usam split panes. iTerm2 faz isso nativamente.

### 2.3 Preview Local

Não precisa instalar nada. Quando rodar `npm run dev`, o app abre em:

```
http://localhost:3000
```

Hot reload atualiza automaticamente quando o código muda.

---

## FASE 3 — Instalar APEX Globalmente (uma vez)

### 3.1 Extrair

```
cd ~/Downloads
```

```
mkdir -p ~/apex-framework
```

```
tar xf apex-framework-v5.2-complete.tar -C ~/apex-framework
```

### 3.2 Instalar

```
cd ~/apex-framework
```

```
chmod +x install-user-level.sh
```

```
./install-user-level.sh
```

### 3.3 Completar as 2 skills que o instalador pula

```
cp -r ~/apex-framework/.claude/skills/debug ~/.claude/skills/debug
```

```
cp -r ~/apex-framework/.claude/skills/a11y ~/.claude/skills/a11y
```

### 3.4 Verificar

```
ls ~/.claude/skills/ | wc -l
```

Esperado: **15**.

---

## FASE 4 — Criar Primeiro Projeto

```
mkdir -p ~/meu-primeiro-app && cd ~/meu-primeiro-app
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

## FASE 5 — Lançar

```
code .
```

No terminal do VS Code (`Ctrl + `` `):

```
claude
```

```
/output-style apex-mandalorian
```

```
/set-language
```

Escolha Português.

**Teste final:**

```
Build me a task management app
```

O Claude deve BLOQUEAR e pedir PRD. Se bloqueou: **APEX 100% operacional**. ✅

---

## Próximos Projetos

Só a Fase 4. Ou dentro do Claude Code:

```
/init
```

---

## Fontes Oficiais (zero terceiros)

| Ferramenta | Fonte | Verificação |
|-----------|-------|-------------|
| Node.js | nodejs.org | OpenJS Foundation |
| jq | github.com/jqlang/jq | MIT, binário oficial |
| Claude Code | Anthropic | Assinado + notarizado Apple |
| VS Code | code.visualstudio.com | Microsoft, MIT |
| Extensão Claude | Anthropic (Marketplace) | Publisher verificado |
| iTerm2 | iterm2.com | GPLv2, 15+ anos |
| Git | Apple | Vem com macOS |

---

*Forjado por Lucas Bueno & Claude · `/about` para a história completa*

**Este é o caminho.** ⚔️
