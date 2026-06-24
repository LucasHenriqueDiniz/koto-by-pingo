import { useEffect } from "react";
import { Link } from "wouter";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { updatePageSEO } from "@/utils/seo";

export default function NotFound() {
  useEffect(() => {
    updatePageSEO("Página não encontrada — Koto", "A página que você procura não existe.");
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-card-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-5">
          <MaterialIcon name="error" filled size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">
          Esta página não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <MaterialIcon name="home" size={18} />
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
