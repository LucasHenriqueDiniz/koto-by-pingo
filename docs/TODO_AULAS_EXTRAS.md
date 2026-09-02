# TODO — Extra lessons (`/aulas`)

A page of supplementary material (Cure Dolly style) for understanding the real structure of
Japanese. Today it is a **visual placeholder** — there is no real content (videos/lessons) and no
per-lesson progress.

Design origin: the `Estudo · Curriculum` view in `claude-design-refactor/Treino de Kana.dc.html`.

## Current state
- `src/pages/AulasExtrasPage.tsx` renders chapters/lessons as **locked**, with illustrative
  titles/subtitles and progress pinned at 0%.
- A `Aulas Extras` menu item in `DesktopSidebar` (icon `auto_stories`).

## What a real implementation needs
1. **Content model**: add `src/data/lessons.ts` with `Chapter[] { id, num, title, lessons: Lesson[] }`
   and `Lesson { id, num, title, subtitle, videoUrl?, durationMin }`.
2. **Per-lesson progress**: a new `koto:lessons_progress` key
   (`Record<lessonId, { watched: boolean; watchedAt: string }>`) in
   `services/progress/progress.local.ts`, with `markLessonWatched(id)` and `getLessonsProgress()`.
   A chapter counts as completed once every one of its lessons has been watched.
3. **Sequential unlocking**: a chapter opens up when the previous one is completed (today
   everything is `locked`).
4. **Player**: embed the video (YouTube/Vimeo) or the text material, per lesson.

Until there is real content, keep the page an honest placeholder ("Em breve" — coming soon).
