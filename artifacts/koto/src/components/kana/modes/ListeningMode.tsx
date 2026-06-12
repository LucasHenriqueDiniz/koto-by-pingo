import { useState, useCallback, useEffect, useMemo } from 'react';
import { Volume2, Play } from 'lucide-react';
import type { KanaItem } from '../../../types/kana';
import { allKana } from '../../../data/kana';
import { shuffle } from '../../../utils/scoring';
import { recordKanaAttempt } from '../../../services/progress/progress.local';
import { useKanaQueue } from '../../../hooks/useKanaQueue';
import { KanaStats } from '../KanaStats';

interface ListeningModeProps {
  items: KanaItem[];
}

function checkJapaneseSpeechSupport(): boolean {
  if (!window.speechSynthesis) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some(v => v.lang.startsWith('ja'));
}

export function ListeningMode({ items }: ListeningModeProps) {
  const { current, sessionCorrect, sessionTotal, sessionAccuracy, registerResult, next, endSession } = useKanaQueue(items);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => () => endSession(), [endSession]);

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

  const options = useMemo(() => {
    if (!current) return [];
    const pool = allKana.filter(k => k.script === current.script && k.romaji !== current.romaji);
    const distractors = shuffle(pool).slice(0, 3).map(k => k.romaji);
    return shuffle([current.romaji, ...distractors]);
  }, [current]);

  const speak = useCallback(() => {
    if (!current || speaking) return;
    const utter = new SpeechSynthesisUtterance(current.character);
    utter.lang = 'ja-JP';
    utter.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) utter.voice = jaVoice;
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, [current, speaking]);

  const handleSelect = useCallback((romaji: string) => {
    if (!current || selected) return;
    setSelected(romaji);
    const isCorrect = romaji === current.romaji;
    recordKanaAttempt(current.id, isCorrect, { mode: 'listening', group: current.group });
    registerResult(isCorrect);
  }, [current, selected, registerResult]);

  const handleNext = useCallback(() => {
    setSelected(null);
    next();
  }, [next]);

  if (!current) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhum caractere disponível para este filtro.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {supported === false && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 text-sm text-foreground w-full">
          <p className="font-medium mb-0.5">Voz japonesa indisponível</p>
          <p className="text-muted-foreground text-xs">
            Seu navegador não possui vozes japonesas instaladas. O caractere será exibido como alternativa.
          </p>
        </div>
      )}

      <div className="bg-card border-2 border-border rounded-2xl p-8 flex flex-col items-center gap-4 w-full">
        {supported === false ? (
          <span
            className="text-7xl font-medium select-none"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            data-testid="kana-listening-fallback-character"
          >
            {current.character}
          </span>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">Ouça e identifique o romaji</p>
            <button
              onClick={speak}
              disabled={speaking}
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: '#0284C7' }}
              data-testid="kana-listening-play-btn"
            >
              {speaking
                ? <Volume2 size={28} className="text-white animate-pulse" />
                : <Play size={28} className="text-white" />
              }
            </button>
            <p className="text-xs text-muted-foreground">
              {speaking ? 'Reproduzindo...' : 'Clique para ouvir'}
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 w-full" data-testid="kana-listening-options">
        {options.map(romaji => {
          const isCorrect = romaji === current.romaji;
          const isSelected = romaji === selected;
          let cls = 'border-border bg-card text-foreground hover:bg-muted cursor-pointer';
          if (selected) {
            if (isCorrect) cls = 'border-[#2F9E44] bg-[#DCFCE7] text-[#166534]';
            else if (isSelected) cls = 'border-[#E5484D] bg-[#FFE5E7] text-[#B4232A]';
            else cls = 'border-border bg-card text-muted-foreground opacity-50';
          }
          return (
            <button
              key={romaji}
              onClick={() => handleSelect(romaji)}
              disabled={!!selected}
              className={`border-2 rounded-xl px-3 py-3 text-center font-mono font-semibold transition-all ${cls}`}
              data-testid={`kana-listening-option-${romaji}`}
            >
              {romaji}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={handleNext}
          autoFocus
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
          data-testid="kana-listening-next-btn"
        >
          Próximo
        </button>
      )}

      <KanaStats correct={sessionCorrect} total={sessionTotal} accuracy={sessionAccuracy} />
    </div>
  );
}
