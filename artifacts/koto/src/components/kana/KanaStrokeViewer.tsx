import { useState, useEffect, useRef, useCallback } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { fetchStrokes } from '../../data/strokeData';

interface StrokePathProps {
  d: string;
  state: 'future' | 'active' | 'done';
  duration: number;
}

function StrokePath({ d, state, duration }: StrokePathProps) {
  const ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (state === 'active') {
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.transition = 'none';
      void el.getBoundingClientRect();
      requestAnimationFrame(() => {
        el.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
        el.style.strokeDashoffset = '0';
      });
    } else {
      el.style.strokeDasharray = '';
      el.style.strokeDashoffset = '';
      el.style.transition = 'none';
    }
  }, [state, duration]);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={state === 'future' ? '#d4d4d8' : state === 'active' ? '#E5484D' : '#1a1a1a'}
      strokeWidth={state === 'active' ? 4 : 3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

interface KanaStrokeViewerProps {
  character: string;
}

const STROKE_DURATION = 600;
const STROKE_PAUSE = 300;

export function KanaStrokeViewer({ character }: KanaStrokeViewerProps) {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setRevealed(0);
    setPlaying(false);
    setStrokes([]);
    if (timerRef.current) clearTimeout(timerRef.current);

    fetchStrokes(character).then(paths => {
      if (paths.length === 0) setNotFound(true);
      else setStrokes(paths);
      setLoading(false);
    });

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [character]);

  useEffect(() => {
    if (!playing) return;
    if (revealed >= strokes.length) { setPlaying(false); return; }

    timerRef.current = setTimeout(() => {
      setRevealed(r => r + 1);
    }, STROKE_DURATION + STROKE_PAUSE);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, revealed, strokes.length]);

  const handlePlay = useCallback(() => {
    if (revealed >= strokes.length) {
      setRevealed(0);
      setTimeout(() => setPlaying(true), 50);
    } else {
      setPlaying(p => !p);
    }
  }, [revealed, strokes.length]);

  const handleNext = useCallback(() => {
    setPlaying(false);
    setRevealed(r => Math.min(r + 1, strokes.length));
  }, [strokes.length]);

  const handleReset = useCallback(() => {
    setPlaying(false);
    setRevealed(0);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
        Carregando traçado...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-52 text-muted-foreground text-sm text-center px-4">
        Traçado não disponível para este caractere.
      </div>
    );
  }

  const allDone = revealed >= strokes.length;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="rounded-2xl bg-muted/20 border border-border p-2">
        <svg
          viewBox="0 0 109 109"
          width={192}
          height={192}
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          {strokes.map((d, i) => (
            <StrokePath
              key={i}
              d={d}
              state={i < revealed ? (i === revealed - 1 ? 'active' : 'done') : 'future'}
              duration={STROKE_DURATION}
            />
          ))}
        </svg>
      </div>

      <p className="text-xs text-muted-foreground">
        {revealed === 0
          ? `${strokes.length} traço${strokes.length !== 1 ? 's' : ''}`
          : allDone
          ? 'Traçado completo ✓'
          : `Traço ${revealed} de ${strokes.length}`}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={handleReset}
          className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
          title="Reiniciar"
        >
          <MaterialIcon name="skip_previous" size={16} />
        </button>
        <button
          onClick={handlePlay}
          className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          {playing ? <MaterialIcon name="pause" size={15} /> : <MaterialIcon name="play_arrow" size={15} />}
          {playing ? 'Pausar' : allDone ? 'Repetir' : revealed === 0 ? 'Animar' : 'Continuar'}
        </button>
        <button
          onClick={handleNext}
          disabled={allDone}
          className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
          title="Próximo traço"
        >
          <MaterialIcon name="chevron_right" size={16} />
        </button>
      </div>
    </div>
  );
}
