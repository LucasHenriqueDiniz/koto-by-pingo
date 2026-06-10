# Koto by Pingo

> Japonês em pequenos treinos diários.

App web de japonês para brasileiros. Funciona 100% offline, sem backend — todo o progresso fica no `localStorage` do navegador.

---

## Stack

- React + Vite + TypeScript
- Tailwind CSS + framer-motion
- Wouter (roteamento)
- lucide-react (ícones)
- Web Speech API (modo Escuta)

---

## Módulos

| Módulo | Descrição |
|--------|-----------|
| **Kana** | Trainer de hiragana, katakana e misto |
| **Vocabulário** | 45 palavras N5 em 4 modos de treino |
| **Escuta** | Reconhecimento auditivo via Web Speech API |
| **Simulados** | N5 Mini + N4 Mini com revisão por questão |
| **Progresso** | Dashboard com estatísticas de kana e vocabulário |

---

## Modos de vocabulário

1. **Flashcards** — Vire o card, avalie acerto/erro
2. **Seleção de palavras** — Escolha a leitura correta em romaji
3. **Combinar pares** — Associe palavras japonesas às leituras/significados
4. **Quiz de tradução** — Escolha o significado correto em português

---

## Layout

- **Desktop (>= 1024px):** sidebar fixa à esquerda + área de conteúdo + painel lateral de estudo (xl+)
- **Tablet:** sidebar oculta, conteúdo centralizado
- **Mobile (< 768px):** top bar + bottom navigation, sem sidebar

---

## Regras de AdSense / UX

> **IMPORTANTE:** estas regras devem ser mantidas em qualquer futura integração de anúncios reais.

### O que é proibido

- ❌ Colocar anúncio **dentro do card de exercício** (flashcard, questão, par)
- ❌ Colocar anúncio **imediatamente antes ou depois** de botões de ação (Confirmar, Próxima, Acertei, Errei, Iniciar)
- ❌ Colocar anúncio **entre opções de resposta** em qualquer quiz
- ❌ Colocar anúncio que **interrompa o fluxo** de uma sessão em andamento
- ❌ Anúncio flutuante que sobreponha conteúdo de treino

### O que é permitido

- ✅ Antes de iniciar uma sessão (entre a seleção de filtros e o card)
- ✅ Depois de completar uma sessão (na tela de resultado)
- ✅ Na sidebar direita do desktop, com espaçamento seguro (≥ 16px dos cards)
- ✅ Entre blocos de conteúdo editorial (ex: na página Sobre, entre parágrafos)
- ✅ No Dashboard, após as estatísticas e antes do botão de reset

### Componente

Use sempre `<AdPlaceholder slot="banner" />` ou `<AdPlaceholder slot="rectangle" />`.
Nunca coloque o marcador dentro de `<form>`, `<dialog>` ou qualquer container de questão.

---

## Progresso

Todo o acesso ao `localStorage` passa exclusivamente por:

```
src/services/progress/progress.local.ts
```

Nenhum componente ou página deve chamar `localStorage` diretamente.

### Critérios de classificação de palavras

| Classificação | Tentativas | Acerto |
|--------------|-----------|--------|
| **Dominada** | ≥ 5 | ≥ 85% |
| **Problemática** | ≥ 3 | < 60% |
| **Nunca vista** | 0 | — |

---

## Arquitetura futura

Ver documentação técnica em `/docs/`:

| Arquivo | Conteúdo |
|---------|----------|
| `TODO_CLERK_AUTH.md` | Plano de autenticação com Clerk |
| `TODO_CLOUDFLARE_D1.md` | Migração para banco Cloudflare D1 |
| `TODO_TRACING.md` | Feature de traçado de kana |
| `TODO_EXAMS.md` | Expansão dos simulados JLPT |

---

## Mascote

**Pingo-sensei** — pinguim preto, mascote do app.

- SVG embutido em 5 variantes: `default`, `kana`, `listening`, `exam`, `progress`
- Para usar imagem real: adicione `public/brand/pingo.png`

---

## Scripts

```bash
pnpm dev      # servidor de desenvolvimento
pnpm build    # build de produção
pnpm preview  # preview do build
```
