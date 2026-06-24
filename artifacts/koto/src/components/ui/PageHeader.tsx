import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** @deprecated mantido por compatibilidade; o novo design usa sempre a cor primária no título. */
  color?: string;
  children?: React.ReactNode;
}

const SCROLL_THRESHOLD = 8;

export function PageHeader({ title, description, children }: PageHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-14 lg:top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div
        className={`max-w-6xl mx-auto px-4 flex items-center justify-between gap-4 transition-[padding] duration-200 ${scrolled ? 'py-2.5' : 'py-4'}`}
      >
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold text-primary truncate">{title}</h1>
          <AnimatePresence initial={false}>
            {description && !scrolled && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="text-sm text-[--color-text-secondary] overflow-hidden"
              >
                <span className="block mt-0.5">{description}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {children && <div className="flex-shrink-0 flex items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}
