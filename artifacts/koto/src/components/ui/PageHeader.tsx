interface PageHeaderProps {
  title: string;
  description?: string;
  color?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, color = '#E5484D', children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {children && <div className="flex-shrink-0">{children}</div>}
        </div>
      </div>
    </div>
  );
}
