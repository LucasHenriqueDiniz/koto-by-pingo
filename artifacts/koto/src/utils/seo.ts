const DEFAULT_TITLE = 'Koto by Pingo — Treine japonês com kana, vocabulário e simulados';
const DEFAULT_DESC = 'Treine japonês em sessões rápidas com kana, vocabulário, escuta, progresso e simulados estilo JLPT.';

export function updatePageSEO(title?: string, description?: string): void {
  document.title = title ? `${title} — Koto by Pingo` : DEFAULT_TITLE;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description || DEFAULT_DESC);
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', document.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description || DEFAULT_DESC);
}
