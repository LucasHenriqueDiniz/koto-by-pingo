interface PageHeaderProps {
  title: string;
  description?: string;
  /** @deprecated mantido por compatibilidade; o novo design usa sempre a cor primária no título. */
  color?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-auto py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold text-primary truncate">{title}</h1>
          {description && (
            <p className="text-sm text-[--color-text-secondary] mt-0.5">{description}</p>
          )}
        </div>
        {children && <div className="flex-shrink-0 flex items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}
