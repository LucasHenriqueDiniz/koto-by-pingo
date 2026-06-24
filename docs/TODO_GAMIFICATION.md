# TODO — Gamificação (Streak, XP/Nível, Conquistas)

> **Status:** ❌ não implementado. A UI já existe como **placeholder visual** (criada no
> refactor de design de 2026-06). Os números exibidos (ofensiva, XP, "Top 5%", conquistas,
> metas semanais) são fixos/mockados. Este documento descreve o que falta para torná-los reais.

A regra do projeto continua valendo: **todo estado persistente passa por
`src/services/progress/progress.local.ts`** (prefixo `koto:`). Não criar serviço de
sync/auth paralelo — quando houver backend, estender `progress.remote.ts`.

---

## 1. Streak / Ofensiva diária

**Onde aparece (placeholder):** `src/pages/DashboardPage.tsx` (card "Ofensiva Atual", mostra `0`).

**Implementar:**
- Tipo em `src/services/progress/progress.types.ts`:
  ```ts
  export interface StreakRecord {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string; // YYYY-MM-DD
  }
  ```
- Nova chave localStorage: `koto:streak`.
- Função `recordDailyActivity()` em `progress.local.ts`, chamada dentro de
  `recordKanaAttempt`, `recordWordAttempt` e na conclusão de simulado:
  - se `lastActiveDate === hoje` → não faz nada;
  - se `=== ontem` → `currentStreak += 1`;
  - senão → `currentStreak = 1`;
  - atualizar `longestStreak` e `lastActiveDate`.
- Expor `getStreak(): StreakRecord` e consumir no card do Dashboard.

---

## 2. XP / Nível

**Onde aparece (placeholder):** `src/pages/DashboardPage.tsx` (card "Nível do Aprendizado",
barra de XP e selo "Top 5% este mês").

**Implementar:**
- Nova chave: `koto:xp` → `{ totalXp: number; level: number }`.
- Fórmula de XP por ação (sugestão): +10 acerto, +2 erro, +50 simulado concluído.
- Curva de nível por thresholds progressivos (ex.: nível N exige `N * 150` XP acumulado).
- Conceder XP nos mesmos pontos de registro de progresso (kana/vocab/exam).
- Componente `src/components/ui/LevelCard.tsx` pode ser extraído do bloco inline atual.

**⚠️ Selo "Top 5% este mês":** é comparativo entre usuários → **exige dados agregados de
backend**, fora do escopo local-first atual. Mantido como placeholder fixo por decisão do
produto. Ao implementar, ou (a) ligar a um endpoint de ranking no Worker/D1, ou (b) trocar
por métrica não-comparativa (ex.: "melhor semana sua até agora").

---

## 3. Conquistas / Achievements

**Onde aparece (placeholder):** `src/pages/DashboardPage.tsx` (grid de `AchievementBadge`,
todos `locked`) e `src/pages/KanaTrainPage.tsx` (card "Próxima recompensa").
Componente pronto: `src/components/ui/AchievementBadge.tsx`.

**Implementar:**
- Catálogo em `src/data/achievements.ts`:
  ```ts
  export interface Achievement {
    id: string;
    label: string;
    description: string;
    icon: MaterialIconName;
    /** Avalia o progresso atual e diz se está desbloqueada. */
    isUnlocked: (ctx: AchievementContext) => boolean;
  }
  ```
- Nova chave: `koto:achievements` → `Record<achievementId, { unlockedAt: string }>`.
- Avaliar condições após cada registro de progresso; persistir desbloqueios.
- Exemplos de condição: "domine todo o hiragana básico", "ofensiva de 7 dias",
  "100% em um simulado".

---

## 4. Metas semanais

**Onde aparece (placeholder):** `src/pages/DashboardPage.tsx` (card "Metas Semanais", barras zeradas).

**Implementar:** definir metas (kana novos, minutos de estudo, revisões) configuráveis em
`src/services/settings/settings.local.ts` (já existe `dailyGoalMinutes`) e calcular o
progresso da semana a partir dos `attempts[]` + sessões.

---

## ✅ Já é real (não é gamificação)

- **Atividade Semanal** (`WeeklyActivityChart`): usa `getWeeklyActivity()` em
  `progress.local.ts`, agregando `attempts[].timestamp` reais de kana + vocabulário.
- **Precisão Global / por Categoria**: `getKanaStats()`, `getKanaGroupStats()`, `getVocabStats()`.
