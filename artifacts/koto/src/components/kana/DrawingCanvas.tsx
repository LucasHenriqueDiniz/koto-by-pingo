import { useRef, useEffect, useCallback } from 'react';
import { Eraser } from 'lucide-react';

interface DrawingCanvasProps {
  strokes: string[];
}

const SIZE = 300;

export function DrawingCanvas({ strokes }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const dprRef = useRef(1);

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Center cross guide
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(SIZE / 2, 4); ctx.lineTo(SIZE / 2, SIZE - 4);
    ctx.moveTo(4, SIZE / 2); ctx.lineTo(SIZE - 4, SIZE / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    if (strokes.length === 0) return;

    // KanjiVG guide paths
    const scale = SIZE / 109;
    ctx.save();
    ctx.scale(scale, scale);
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 4 / scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const d of strokes) {
      ctx.beginPath();
      ctx.stroke(new Path2D(d));
    }
    ctx.restore();
  }, [strokes]);

  // Setup canvas with DPR and draw initial guide
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    drawGuide();
  }, [drawGuide]);

  const getPoint = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top),
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const pt = getPoint(e);
    if (!pt) return;
    points.current = [pt];

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
  }, [getPoint]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const pt = getPoint(e);
    if (!pt) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    points.current.push(pt);
    const pts = points.current;

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (pts.length < 3) {
      const prev = pts[pts.length - 2] ?? pt;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    } else {
      const p0 = pts[pts.length - 3];
      const p1 = pts[pts.length - 2];
      const p2 = pt;
      const mid01 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const mid12 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      ctx.beginPath();
      ctx.moveTo(mid01.x, mid01.y);
      ctx.quadraticCurveTo(p1.x, p1.y, mid12.x, mid12.y);
      ctx.stroke();
    }
  }, [getPoint]);

  const handlePointerUp = useCallback(() => {
    drawing.current = false;
    points.current = [];
  }, []);

  const handleClear = useCallback(() => {
    drawGuide();
  }, [drawGuide]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div
        className="rounded-2xl overflow-hidden border border-border bg-white"
        style={{ touchAction: 'none', lineHeight: 0 }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', cursor: 'crosshair', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      <button
        onClick={handleClear}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <Eraser size={14} />
        Limpar
      </button>
    </div>
  );
}
