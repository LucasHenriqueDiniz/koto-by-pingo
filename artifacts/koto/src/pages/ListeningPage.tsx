import { useEffect, useState, useCallback } from 'react';
import { Volume2, Play } from 'lucide-react';
import { vocabulary } from '../data/vocabulary';
import { shuffle } from '../utils/scoring';
import { PageHeader } from '../components/ui/PageHeader';
import { AdPlaceholder } from '../components/ui/AdPlaceholder';
import { updatePageSEO } from '../utils/seo';
import type { VocabularyWord } from '../types/vocabulary';

function buildOptions(correct: VocabularyWord, pool: VocabularyWord[]) {
  const distractors = shuffle(pool.filter(w => w.id !== correct.id)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

function checkJapaneseSpeechSupport(): boolean {
  if (!window.speechSynthesis) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some(v => v.lang.startsWith('ja'));
}

export function ListeningPage() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [queue] = useState(() => shuffle([...vocabulary]));
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<VocabularyWord[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    updatePageSEO('Treino de Escuta', 'Treine a escuta do japonês com síntese de voz e identificação auditiva.');
  }, []);

  useEffect(() => {
    const check = () => setSupported(checkJapaneseSpeechSupport());
    if (window.speechSynthesis.getVoices().length > 0) {
      check();
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', check, { once: true });
      setTimeout(check, 1500);
    }
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, []);

  useEffect(() => {
    if (queue.length > 0) {
      setOptions(buildOptions(queue[index % queue.length], vocabulary));
    }
  }, [index, queue]);

  const speak = useCallback(() => {
    const word = queue[index % queue.length];
    if (!word || speaking) return;
    const utter = new SpeechSynthesisUtterance(word.kana);
    utter.lang = 'ja-JP';
    utter.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) utter.voice = jaVoice;
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, [index, queue, speaking]);

  const handleSelect = useCallback((wordId: string) => {
    if (selected) return;
    const word = queue[index % queue.length];
    setSelected(wordId);
    const isCorrect = wordId === word.id;
    setTotal(t => t + 1);
    if (isCorrect) setCorrect(c => c + 1);
  }, [selected, index, queue]);

  const handleNext = useCallback(() => {
    setSelected(null);
    setIndex(i => i + 1);
  }, []);

  const current = queue[index % queue.length];

  return (
    <div>
      <PageHeader
        title="Escuta"
        description="Ouça palavras em japonês e identifique o significado."
        color="#0284C7"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="max-w-sm mx-auto space-y-6">
          {/* Speech API warning */}
          {supported === false && (
            <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-sm text-foreground">
              <p className="font-medium mb-0.5">Voz japonesa indisponível</p>
              <p className="text-muted-foreground text-xs">Seu navegador não possui vozes japonesas instaladas. O treino de escuta requer suporte a síntese de voz em japonês (ja-JP).</p>
            </div>
          )}

          {supported !== false && current && (
            <>
              {/* Stats */}
              {total > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  Acertos: <strong className="text-foreground">{correct}/{total}</strong>
                  {' — '}
                  Precisão: <strong className="text-foreground">{Math.round((correct / total) * 100)}%</strong>
                </div>
              )}

              {/* Play area */}
              <div className="bg-card border-2 border-border rounded-2xl p-8 flex flex-col items-center gap-4">
                <p className="text-xs text-muted-foreground">Ouça e identifique a palavra</p>
                <button
                  onClick={speak}
                  disabled={speaking}
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: '#0284C7' }}
                  data-testid="listen-play-btn"
                >
                  {speaking
                    ? <Volume2 size={28} className="text-white animate-pulse" />
                    : <Play size={28} className="text-white" />
                  }
                </button>
                <p className="text-xs text-muted-foreground">
                  {speaking ? 'Reproduzindo...' : 'Clique para ouvir'}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2">
                {options.map(option => {
                  const isCorrect = option.id === current.id;
                  const isSelected = option.id === selected;
                  let cls = 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
                  if (selected) {
                    if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
                    else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
                    else cls = 'border-border bg-card text-muted-foreground opacity-50';
                  }
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={!!selected}
                      className={`border-2 rounded-xl px-3 py-3 text-sm font-medium text-center transition-all ${cls}`}
                      data-testid={`listen-option-${option.id}`}
                    >
                      {option.meaningPt}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                  data-testid="listen-next-btn"
                >
                  Próxima
                </button>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Preparado para usar arquivos .mp3 quando disponíveis.
              </p>
            </>
          )}
        </div>

        <div className="mt-10">
          <AdPlaceholder slot="banner" />
        </div>
      </div>
    </div>
  );
}
