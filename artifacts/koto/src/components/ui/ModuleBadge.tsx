type ModuleType = 'kana' | 'vocabulario' | 'escuta' | 'simulados' | 'progresso' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

const moduleColors: Record<string, { bg: string; text: string; label: string }> = {
  kana:       { bg: '#FFE5E7', text: '#B4232A', label: 'Kana' },
  vocabulario:{ bg: '#EDE9FE', text: '#5B21B6', label: 'Vocabulário' },
  escuta:     { bg: '#E0F2FE', text: '#0369A1', label: 'Escuta' },
  simulados:  { bg: '#FFF7ED', text: '#C2410C', label: 'Simulados' },
  progresso:  { bg: '#DCFCE7', text: '#166534', label: 'Progresso' },
  N5:         { bg: '#DCFCE7', text: '#166534', label: 'N5' },
  N4:         { bg: '#FEF9C3', text: '#854D0E', label: 'N4' },
  N3:         { bg: '#FEE2E2', text: '#991B1B', label: 'N3' },
  N2:         { bg: '#EDE9FE', text: '#5B21B6', label: 'N2' },
  N1:         { bg: '#F1F5F9', text: '#334155', label: 'N1' },
};

interface ModuleBadgeProps {
  module: ModuleType | string;
  className?: string;
}

export function ModuleBadge({ module, className = '' }: ModuleBadgeProps) {
  const config = moduleColors[module] ?? { bg: '#F1F5F9', text: '#334155', label: module };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${className}`}
      style={{ backgroundColor: config.bg, color: config.text }}
      data-testid={`badge-module-${module}`}
    >
      {config.label}
    </span>
  );
}
