# Spec: APEX Workshop — "The Way"

**Date**: 2026-03-28 | **Status**: Approved | **Author**: Bueno & Claude

---

## Visao Geral

Workshop presencial de meio dia (4h) para lideres da ADAPTΔ que estao migrando de Lovable para Claude Code. O workshop ensina a metodologia APEX Framework completa usando uma abordagem "show don't tell" — cada conceito e demonstrado visualmente antes de ser explicado.

**Projeto pratico**: App de reserva de salas de reuniao para o escritorio da ADAPTΔ.

**Formato**: Apresentacao web interativa (o proprio slide e um app feito com APEX + Design DNA) + guia escrito permanente.

**Idioma**: PT-BR (apresentacao e guia). Codigo em ingles.

---

## O App de Slides

Uma aplicacao Next.js em `~/Projects/apex-slides` que serve como:

1. **Apresentacao interativa** — slides navegaveis com animacoes e demos ao vivo
2. **Referencia permanente** — os participantes acessam depois do workshop
3. **Prova do conceito** — o proprio slide foi construido com APEX + Design DNA

### Stack

- Next.js 16 (App Router), TypeScript strict, Tailwind CSS
- Design DNA tokens (creative-warm palette para visual impactante)
- Framer Motion para transicoes entre slides
- Sem backend — 100% estatico, deploy no Vercel

### Navegacao

- Setas do teclado (← →) ou swipe no mobile
- Barra de progresso no topo
- Menu lateral com todos os modulos
- Modo apresentador (notas do facilitador visiveis apenas no segundo monitor)

---

## Estrutura dos Modulos

### Pre-Workshop: "O Arsenal" (enviado 1 semana antes)

Guia de instalacao passo-a-passo:

1. Git — instalar + configurar (nome, email, SSH key para GitHub)
2. Node.js 24 LTS — via nvm
3. pnpm — `npm install -g pnpm`
4. Cursor IDE — download + instalar
5. Claude Code — `npm install -g @anthropic-ai/claude-code` + autenticar
6. Conta GitHub — com acesso a org ADAPTΔ
7. Comando de verificacao: `claude -p "Diga 'Arsenal pronto' se voce consegue ler isso"`

Fallback: 2-3 laptops pre-configurados. Pair programming incentivado.

---

### PRIMEIRA METADE — APRENDER A PENSAR (2h)

#### Modulo 1: "O Modelo Mental" (15 min)

**Slide 1: "Isso NAO e Lovable"**

Comparacao visual lado a lado:

| Lovable                                 | Claude Code                                          |
| --------------------------------------- | ---------------------------------------------------- |
| Browser, voce digita prompts            | Terminal + IDE, voce orquestra agentes               |
| Uma IA, um contexto, um tiro            | Multiplos agentes especializados, contextos isolados |
| Gera codigo que voce reza pra funcionar | Prova que funciona antes de entregar (TDD)           |
| Sem memoria de projeto                  | CLAUDE.md = constituicao persistente                 |
| Sem enforcement de qualidade            | Hooks enforcem regras a 100%                         |
| Bom pra prototipos                      | Feito pra producao                                   |

**Slide 2: "As 6 Camadas"**

Piramide visual animada — cada camada aparece de baixo pra cima:

```
         ┌─────────────────┐
         │     HOOKS        │  ← 100% enforced (codigo)
         ├─────────────────┤
         │   SUBAGENTS      │  ← Especialistas isolados
         ├─────────────────┤
         │    COMMANDS       │  ← Pipelines de workflow
         ├─────────────────┤
         │     SKILLS        │  ← Expertise on-demand
         ├─────────────────┤
         │    CLAUDE.md      │  ← A constituicao (~45 linhas)
         ├─────────────────┤
         │    PLUGINS        │  ← Empacotar e compartilhar
         └─────────────────┘
```

**Slide 3: "As 2 Metodologias"**

Duas colunas animadas:

- SDD (Spec-Driven Design): Pense ANTES de construir
- TDD (Test-Driven Development): Prove ANTES de entregar
- Juntas: voce nunca constroi a coisa errada, e sempre prova que a coisa certa funciona

**Slide 4: "O Pipeline APEX"**

Fluxo visual dos 7 fases com 3 gates destacados:

```
[DESCOBRIR] →🔒→ [ARQUITETURA] →🔒→ [PLANEJAR] → [VERIFICAR] → [CONSTRUIR] → [QUALIDADE] →🔒→ [ENTREGAR]
```

"Voce toma 3 decisoes. O APEX toma 300."

---

#### Modulo 2: "CLAUDE.md — A Constituicao" (20 min)

**Slide 5: "O Orcamento de Instrucoes"**

- ~150-200 instrucoes antes da compliance cair
- System prompt usa ~50
- Sobram ~100-150 linhas efetivas
- Teste pra cada linha: "Claude erraria sem isso?" Se nao — delete.

**Slide 6: "O Exemplo PERFEITO"**
Codigo animado aparecendo linha por linha — ~40 linhas de CLAUDE.md lean

**Slide 7: "O Exemplo HORRIVEL"**
400+ linhas, explicando o que TypeScript e, copiando READMEs inteiros
Animacao: linhas criticas ficam enterradas no meio do ruido

**Slide 8: "O Padrao @import"**

```markdown
See @docs/architecture.md for system design
```

"Docs profundos carregam sob demanda. CLAUDE.md e o indice, nao a enciclopedia."

**Demo ao vivo**: Criar CLAUDE.md juntos para o app de salas

---

#### Modulo 3: "Skills — Expertise Sob Demanda" (15 min)

**Slide 9: "Skills vs CLAUDE.md"**

- CLAUDE.md: carrega TODA sessao
- Skills: carregam SO quando a tarefa combina
- No startup: Claude ve so nome + descricao (footprint minimo)

**Slide 10: "Skill PERFEITA vs HORRIVEL"**
Lado a lado:

- PERFEITA: descricao com trigger words exatos, templates copy-paste, regras de seguranca embutidas
- HORRIVEL: `description: "Use when working with databases"` — dispara em TUDO

**Slide 11: "Onde Skills Moram"**

```
.claude/skills/
├── supabase-rls/
│   ├── SKILL.md
│   └── templates/
└── tdd-patterns/
    └── SKILL.md
```

---

#### Modulo 4: "Hooks — O Enforcement de 100%" (20 min)

**Slide 12: "CLAUDE.md Pede. Hooks Mandam."**
Animacao: regra no CLAUDE.md com 80% de brilho, hook com 100%

**Slide 13: "Os 3 Hooks Essenciais"**

1. Auto-format (PostToolUse) — cada arquivo fica bonito
2. Deteccao de segredos (PreToolUse) — bloqueia API keys
3. Auto-run tests (PostToolUse) — Claude ve resultados apos cada edicao

**Slide 14: "Exit Codes"**

- `0` = aprovado ✅
- `1` = erro, tente de novo ⚠️
- `2` = BLOQUEADO ❌ (parada dura)

**Slide 15: "Hook PERFEITO vs HORRIVEL"**

- PERFEITO: comando shell rapido, fail-open, cirurgico
- HORRIVEL: prompt hook em cada Write|Edit, 30-120s POR ARQUIVO

**Demo ao vivo**: Instalar hooks, tentar escrever um segredo → BLOCKED

---

#### Modulo 5: "Subagents — Especialistas Isolados" (20 min)

**Slide 16: "O Insight Critico do TDD"**
"Quando escrita de testes e implementacao acontecem no mesmo contexto, a implementacao CONTAMINA a logica dos testes."

Diagrama animado:

```
Main Session (orquestrador)
├── @tdd-red    → Testes que FALHAM (nao ve implementacao)
├── @tdd-green  → Codigo MINIMO (nao modifica testes)
├── @tdd-refactor → Limpeza (testes continuam verdes)
├── @security-reviewer → So leitura (nao modifica nada)
└── Explore → Pesquisa (nao polui o contexto principal)
```

**Slide 17: "Subagent PERFEITO vs HORRIVEL"**

- PERFEITO: constrained, model: sonnet, permissionMode: plan, tools limitados
- HORRIVEL: `name: super-agent`, `tools: ALL`, `bypassPermissions` — "so um main session mais lento e caro"

**Slide 18: "Model Mixing"**

```
Lead (voce):     Opus — raciocinio profundo
Builders:        Sonnet — rapido, confiavel
Security/QA:     Sonnet effort: high
Watcher/Writer:  Haiku — barato, rapido
```

"Nao queime tokens de Opus pra escrever testes."

---

#### Modulo 6: "Commands & Contexto" (15 min)

**Slide 19: "Os 3 Comandos Essenciais"**

1. `/spec-create` — SDD com subagents de pesquisa
2. `/tdd` — Red-Green-Refactor com agentes isolados
3. `/pr-ready` — typecheck → lint → test → security review

**Slide 20: "Gestao de Contexto"**
Termometro visual:

- 0-50% 🟢 Trabalhe livremente
- 50-70% 🟡 Atencao
- 70-85% 🟠 /compact AGORA
- 85%+ 🔴 Alucinacoes aumentam
- 90%+ ⛔ /clear OBRIGATORIO

**Slide 21: "Atalhos que Voce Precisa"**

- `Esc Esc` — parar Claude
- `/clear` — contexto fresco
- `/compact` — comprimir preservando info chave
- `/cost` — ver uso de tokens
- `/model` — trocar modelo no meio da sessao

---

#### Modulo 7: "O Quadro Completo" (15 min)

**Slide 22: "A Piramide de Enforcement"**
Animacao final que une tudo:

```
         HOOKS (100% deterministico)
        ┌──────────────────────┐
        │ Auto-format           │
        │ Auto-run tests        │
        │ Block secrets         │
        │ Stop gate             │
        ├──────────────────────┤
        │ SUBAGENTS             │
        │ tdd-red (isolado)     │
        │ security-reviewer     │
        ├──────────────────────┤
        │ SKILLS + CLAUDE.md    │
        │ (advisory, ~80%)      │
        └──────────────────────┘
```

**Slide 23: "As 7 Coisas Que Importam"**

1. CLAUDE.md de 45 linhas
2. 3 hooks (format, secrets, auto-test)
3. 1-3 skills pros seus padroes
4. Spec antes de qualquer feature multi-arquivo
5. Testes que falham ANTES da implementacao
6. Pipeline /pr-ready de validacao
7. Contexto: /clear entre features, /compact a 50%

"Tudo mais e otimizacao. Essas 7 coisas te levam de Lovable pra producao."

**Slide 24: "A Matriz de Decisao"**
Tabela interativa — hover revela detalhes:

| Situacao                    | Ferramenta Certa   | Por que             |
| --------------------------- | ------------------ | ------------------- |
| Claude erra estilo          | CLAUDE.md          | Toda sessao         |
| Padroes Supabase            | Skill              | So quando toca DB   |
| Codigo DEVE ser formatado   | Hook               | 100% enforcement    |
| Segredos NAO podem aparecer | Hook               | Block duro          |
| Review de seguranca         | Subagent           | Isolado do contexto |
| Feature multi-arquivo       | SDD (/spec-create) | Pensar antes        |
| Logica de negocio           | TDD (/tdd)         | Provar antes        |

---

### BREAK (15 min)

---

### SEGUNDA METADE — CONSTRUIR PRA PROVAR (1h45)

#### Level 1: "A Fundacao" (30 min)

- Scaffold do projeto Next.js para o app de salas
- CLAUDE.md juntos (~35 linhas)
- Instalar hooks (format + secrets + auto-test)
- Criar primeira skill (supabase-rooms com RLS)
- Todos sentem auto-format e bloqueio de segredos

#### Level 2: "A Caca" (45 min)

- `/brainstorm` ao vivo — Claude pergunta, a sala responde
- `/prd` gera requisitos completos do app de salas
- GATE 1: Sala aprova o PRD
- `/architecture` desenha o sistema (schema, API, componentes)
- GATE 2: Sala aprova a arquitetura

#### Level 3: "A Forja" (20 min)

- `/tdd` para primeira feature (verificacao de disponibilidade)
- @tdd-red escreve testes que FALHAM — a sala ve vermelho
- @tdd-green faz passar — a sala ve verde
- Cada participante tenta um mini-ciclo TDD

#### Level 4: "O Caminho" (10 min)

- `/qa` executa — 7 fases de qualidade ao vivo
- PR criado, merge
- Recap: Lovable vs APEX lado a lado
- "Voces nao aprenderam uma ferramenta. Aprenderam uma metodologia."
- "This is the Way."

---

## Identidade Visual

- **Logo**: ADAPTΔ (com delta grego)
- **Paleta**: creative-warm do Design DNA (tons quentes, impactantes)
- **Tipografia**: Geist Sans para interface, Geist Mono para codigo
- **Estetica**: Dark mode, minimalista, slides com muito espaco em branco
- **Animacoes**: Framer Motion — entradas suaves, sem exagero
- **Principio**: Show don't tell — cada conceito e visual antes de textual

---

## Estrutura de Arquivos

```
~/Projects/apex-slides/
├── CLAUDE.md
├── .claude/
│   └── settings.json
├── app/
│   ├── layout.tsx          # Shell com navegacao
│   ├── page.tsx            # Redirect para slide 1
│   └── slides/
│       ├── [id]/
│       │   └── page.tsx    # Renderiza slide por ID
│       └── layout.tsx      # Slide shell (progresso, nav)
├── components/
│   ├── slides/
│   │   ├── SlideShell.tsx  # Container de slide com transicoes
│   │   ├── CodeBlock.tsx   # Blocos de codigo animados
│   │   ├── Comparison.tsx  # Lado a lado (awesome vs awful)
│   │   ├── Pyramid.tsx     # Piramide animada das 6 camadas
│   │   ├── Pipeline.tsx    # Pipeline visual dos 7 fases
│   │   ├── Thermometer.tsx # Termometro de contexto
│   │   └── Matrix.tsx      # Tabela de decisao interativa
│   ├── layout/
│   │   ├── SlideNav.tsx    # Navegacao entre slides
│   │   ├── Progress.tsx    # Barra de progresso
│   │   └── ModuleMenu.tsx  # Menu lateral com modulos
│   └── ui/                 # shadcn/ui components
├── data/
│   └── slides.ts           # Conteudo de todos os slides
├── hooks/
│   └── useSlideNavigation.ts
├── lib/
│   └── utils.ts
├── public/
│   └── fonts/              # Geist Sans + Mono
├── styles/
│   └── globals.css         # Design DNA tokens
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Fora de Escopo

- Backend / banco de dados (slides sao 100% estaticos)
- Sistema de login / autenticacao
- Edicao de slides em runtime
- Export para PDF (futuro)
- O app de salas em si (sera construido ao vivo no workshop, nao faz parte deste app)

---

## Verificacao

- [ ] Todas as 24+ slides renderizam com conteudo correto em PT-BR
- [ ] Navegacao por teclado (← →) funciona
- [ ] Navegacao mobile (swipe) funciona
- [ ] Animacoes respeitam `prefers-reduced-motion`
- [ ] Blocos de codigo tem syntax highlighting
- [ ] Logo ADAPTΔ aparece consistentemente
- [ ] Dark mode por padrao
- [ ] Lighthouse > 95
- [ ] Deploy no Vercel funciona
