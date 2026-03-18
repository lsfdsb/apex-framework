# Instalação do APEX no Claude.ai — Skills Individuais

> As Skills funcionam IDENTICAMENTE no Claude.ai, Claude Code e API.
> "Create them in Claude Code, upload them via the API, or add them in claude.ai settings."
> — Documentação oficial da Anthropic

## O Que Mudou

Antes: eu consolidei tudo num arquivo só. ERRADO.
Agora: cada skill é um arquivo individual que o Claude carrega sob demanda — exatamente como no Claude Code. Progressive disclosure: só consome tokens quando é relevante.

---

## Passo 1: Ativar Skills no Claude.ai

1. Abra **claude.ai**
2. Clique no seu **ícone de perfil** (canto inferior esquerdo)
3. Vá em **Settings** (ou Configurações)
4. Clique em **Customize** (ou Personalizar)
5. Procure a seção **Skills**
6. Ative o toggle de **Code execution and file creation**
7. Ative o toggle de **Skills**

📚 *Sabedoria da Armeira*: Skills no Claude.ai usam o mesmo formato SKILL.md do Claude Code. O frontmatter YAML (name + description) é o que o Claude lê para decidir quando ativar cada skill. O conteúdo só carrega quando necessário — igual ao Claude Code. Zero desperdício de tokens. Este é o caminho.

---

## Passo 2: Upload das Skills (23 skills + 3 references)

1. Ainda em **Settings > Customize > Skills**
2. Clique em **"Upload skill"** (ou "Add skill")
3. Faça upload de CADA arquivo `.md` individualmente

### Skills Essenciais (faça upload destas primeiro):

| # | Arquivo | O que faz | Quando ativa |
|---|---------|-----------|--------------|
| 1 | `prd.md` | Gera PRD completo | "novo app", "nova feature" |
| 3 | `code-standards.md` | Padrões TypeScript/React | Toda escrita de código |
| 4 | `design-system.md` | UI/UX Jony Ive style | Todo trabalho visual |
| 5 | `design-system-reference.md` | Fontes, cores, espaçamento | Detalhes de design |
| 6 | `security.md` | Auditoria OWASP | Auth, pagamentos, PII |
| 7 | `security-reference.md` | Grep patterns, headers | Detalhes de segurança |
| 8 | `sql-practices.md` | PostgreSQL/Supabase | Toda query/migration |
| 9 | `sql-practices-reference.md` | EXPLAIN, indexes, RLS | Detalhes de SQL |
| 10 | `qa.md` | Gate de qualidade 5 fases | Antes de enviar código |

### Skills de Workflow:

| # | Arquivo | O que faz |
|---|---------|-----------|
| 11 | `architecture.md` | Design de sistema |
| 12 | `research.md` | Pesquisa de APIs/libs |
| 13 | `performance.md` | Otimização zero-lag |
| 14 | `cx-review.md` | Review de experiência do cliente |
| 15 | `a11y.md` | Auditoria de acessibilidade WCAG 2.2 |
| 16 | `commit.md` | Commits convencionais |
| 17 | `changelog.md` | CHANGELOG + atualização de PRD |
| 18 | `debug.md` | Protocolo estruturado de debugging |
| 20 | `e2e.md` | Testes E2E com Playwright |
| 21 | `cicd.md` | Pipeline GitHub Actions |

### Skills de Suporte:

| # | Arquivo | O que faz |
|---|---------|-----------|
| 22 | `apex-stack.md` | Stack padrão verificado |
| 23 | `verify-lib.md` | Verificação de segurança de libs |
| 24 | `teach.md` | Ensina terminal e programação |
| 25 | `cost-management.md` | Otimização de modelos e tokens |
| 26 | `set-language.md` | Salvar idioma (pt-br/en-us) |
| 27 | `init.md` | Inicializar APEX em projeto |
| 28 | `about.md` | Easter egg — créditos |
| 29 | `about.md` | Easter egg — créditos ⚔️ |

---

## Passo 3: Criar o Projeto

1. Vá em **Projects** na barra lateral
2. Clique em **"Create project"**
3. Nome: nome do seu app (ex: "Meu Task Manager")
4. Em **Custom instructions**, cole:

```
Você está operando dentro do APEX Framework v5.2, forjado por Lucas Bueno & Claude.

REGRAS OBRIGATÓRIAS:
1. SEMPRE responda em português (pt-br). Código permanece em inglês.
2. ANTES de construir qualquer coisa, crie um PRD. BLOQUEIE se o usuário tentar pular.
3. EXPLIQUE cada decisão educativamente. Use "🔥 Sabedoria da Armeira" para momentos de aprendizado.
4. TERMINE cada interação com: "💰 Sabedoria do Caçador: [dica]. Este é o caminho."
5. Use o estilo Mandalorian: missão → estratégia → forja → resultado.
6. Nunca invente endpoints de API. Pesquise documentação oficial.
7. Adapte-se ao stack do usuário se já tiver um projeto.
8. Quando perguntar "quem fez isso" ou "/about", mostre os créditos.
```

---

## Passo 4: Testar

Abra uma conversa dentro do projeto e teste:

**Teste 1** — "Constrói um app de tarefas"
→ Deve BLOQUEAR e pedir PRD (hook de workflow enforcement ativo)

**Teste 2** — "Cria um PRD para app de tarefas"
→ Deve gerar PRD completo (prd skill ativa)

**Teste 3** — "Quem fez esse framework?"
→ Deve mostrar banner APEX (about skill ativa)

**Teste 4** — Qualquer resposta significativa
→ Deve terminar com "💰 Sabedoria do Caçador... Este é o caminho."

---

## Como Funciona (por que skills individuais > arquivo único)

### Arquivo Único (o que eu fiz errado antes):
```
Upload: 1 arquivo gigante de 200+ linhas
Claude: carrega TUDO na memória sempre
Resultado: desperdício de tokens, contexto poluído
```

### Skills Individuais (o correto):
```
Upload: 29 arquivos pequenos e focados
Claude: lê só o frontmatter (name + description) de cada um
Quando relevante: carrega APENAS a skill necessária
Resultado: eficiente, focado, progressive disclosure
```

📚 *Sabedoria da Armeira*: Isso é exatamente como funciona no Claude Code. O frontmatter (~100 tokens por skill) fica sempre disponível para o Claude decidir qual skill carregar. O conteúdo completo (<500 linhas cada) só carrega quando necessário. Com 29 skills, o custo base é ~2900 tokens — bem dentro do budget. Este é o caminho.

---

## Diferenças: Skills no Claude.ai vs Claude Code

| Funcionalidade | Claude.ai | Claude Code |
|---------------|-----------|-------------|
| Skills SKILL.md | ✅ Upload em Customize > Skills | ✅ .claude/skills/ |
| Auto-ativação por descrição | ✅ | ✅ |
| Progressive disclosure | ✅ | ✅ |
| Reference files | ✅ Upload separado | ✅ Na pasta da skill |
| /slash-commands | ❌ | ✅ |
| context: fork (subagent) | ❌ | ✅ |
| Hooks (determinísticos) | ❌ | ✅ |
| allowed-tools | ❌ | ✅ |
| disable-model-invocation | ❌ | ✅ |
| Scripts executáveis | ❌ | ✅ |
| Path-based rules | ❌ | ✅ |

**Resumo**: Skills no Claude.ai tem a mesma inteligência de ativação (description matching), mas sem os guardrails determinísticos (hooks) e sem isolamento (context: fork). Use Claude.ai para planejar, Claude Code para construir.

---

*O beskar foi forjado nas duas forjas. A armadura está completa.*

**Este é o caminho.** ⚔️
