# TODO — Aulas Extras (`/aulas`)

Página de material complementar (estilo Cure Dolly) para entender a estrutura real
do japonês. Hoje é **placeholder visual** — não há conteúdo real (vídeos/aulas) nem
progresso por aula.

Origem do design: view "Estudo · Curriculum" em `claude-design-refactor/Treino de Kana.dc.html`.

## Estado atual
- `src/pages/AulasExtrasPage.tsx` renderiza capítulos/aulas **bloqueados** (locked), com
  títulos/subtítulos ilustrativos e progresso fixo em 0%.
- Item de menu "Aulas Extras" no `DesktopSidebar` (ícone `auto_stories`).

## Para implementar de verdade
1. **Modelo de conteúdo**: criar `src/data/lessons.ts` com `Chapter[] { id, num, title, lessons: Lesson[] }`
   e `Lesson { id, num, title, subtitle, videoUrl?, durationMin }`.
2. **Progresso por aula**: nova chave `koto:lessons_progress` (`Record<lessonId, { watched: boolean; watchedAt: string }>`)
   em `services/progress/progress.local.ts`, com `markLessonWatched(id)` e `getLessonsProgress()`.
   Critério de "capítulo concluído": todas as aulas assistidas.
3. **Desbloqueio sequencial**: um capítulo libera quando o anterior é concluído (hoje tudo é `locked`).
4. **Player**: incorporar vídeo (YouTube/Vimeo) ou material textual por aula.

Enquanto não houver conteúdo, manter a página como placeholder honesto ("Em breve").
