import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { kanji } from '../data/kanji';
import { vocabulary } from '../data/vocabulary';
import type { KanjiItem } from '../types/kanji';
import { KanjiSubNav } from '../components/kanji/KanjiSubNav';
import { KanaStrokeViewer } from '../components/kana/KanaStrokeViewer';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { updatePageSEO } from '../utils/seo';

function resolveExample(item: KanjiItem) {
  if (item.exampleWordIds?.length) {
    const word = vocabulary.find(w => w.id === item.exampleWordIds![0]);
    if (word) return { japanese: word.japanese, reading: word.kana, meaningPt: word.meaningPt };
  }
  return item.examples?.[0];
}

export function KanjiLearnPage() {
  const [strokeItem, setStrokeItem] = useState<KanjiItem | null>(null);

  useEffect(() => {
    updatePageSEO('Aprender Kanji', 'Tabela de referência de kanji do N5 e N4 com leituras, significado e exemplos de palavras.');
  }, []);

  const levels = Array.from(new Set(kanji.map(k => k.jlptLevel)));

  return (
    <div>
      <PageHeader title="Aprender Kanji" description="Consulte a tabela de kanji por nível JLPT, com leituras, significado e exemplos." color="#0284C7" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <KanjiSubNav />

        <AdPlaceholder slot="banner" />

        {levels.map(level => (
          <section key={level} className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="font-heading text-base font-bold text-foreground">{level}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {kanji.filter(item => item.jlptLevel === level).map(item => {
                const example = resolveExample(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStrokeItem(item)}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-border bg-background p-3 hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                    data-testid={`kanji-learn-card-${item.id}`}
                    title="Ver ordem dos traços"
                  >
                    <span className="text-4xl font-medium" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {item.character}
                    </span>
                    <span className="text-xs font-semibold text-foreground text-center">{item.meaningPt}</span>
                    <span className="text-[11px] text-muted-foreground font-mono text-center">
                      {item.onyomi[0] ?? item.kunyomi[0] ?? ''}
                    </span>
                    {example && (
                      <p className="text-[11px] text-muted-foreground text-center leading-tight">
                        <span style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>{example.japanese}</span>
                        {' · '}{example.meaningPt}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Dialog open={!!strokeItem} onOpenChange={open => { if (!open) setStrokeItem(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span style={{ fontFamily: "'Noto Sans JP', sans-serif" }} className="text-2xl">
                {strokeItem?.character}
              </span>
              Ordem dos traços
            </DialogTitle>
            <DialogDescription>
              {strokeItem
                ? `${strokeItem.meaningPt} — on: ${strokeItem.onyomi.join(', ') || '—'} · kun: ${strokeItem.kunyomi.join(', ') || '—'}`
                : 'Acompanhe a animação e depois pratique em Treinar > Traçado.'}
            </DialogDescription>
          </DialogHeader>
          {strokeItem && <KanaStrokeViewer character={strokeItem.character} />}
          {strokeItem && (
            <Link
              href="/kanji/treinar"
              className="text-sm text-primary font-medium hover:underline text-center block mt-1"
            >
              Praticar este kanji →
            </Link>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
