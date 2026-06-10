import { useEffect, useState } from 'react';
import { updatePageSEO } from '../utils/seo';

export function ContactPage() {
  useEffect(() => {
    updatePageSEO('Contato', 'Entre em contato com a equipe do Koto by Pingo.');
  }, []);

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Contato</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Para dúvidas, sugestões ou problemas, preencha o formulário abaixo.
        </p>

        {sent ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-3">
            <p className="text-base font-semibold text-foreground">Mensagem recebida.</p>
            <p className="text-sm text-muted-foreground">
              Agradecemos o contato. Retornaremos em até 3 dias úteis.
            </p>
            <button
              onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="contact-name">
                  Nome
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                  data-testid="input-contact-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="contact-email">
                  E-mail
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                  data-testid="input-contact-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="contact-subject">
                Assunto
              </label>
              <select
                id="contact-subject"
                required
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                data-testid="select-contact-subject"
              >
                <option value="">Selecione um assunto</option>
                <option value="duvida">Dúvida sobre o app</option>
                <option value="erro">Reportar erro ou conteúdo incorreto</option>
                <option value="sugestao">Sugestão</option>
                <option value="privacidade">Privacidade / LGPD</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="contact-message">
                Mensagem
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                data-testid="textarea-contact-message"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              data-testid="btn-contact-submit"
            >
              Enviar mensagem
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Você também pode escrever diretamente para{' '}
              <span className="text-foreground">contato@pingoconcursos.com.br</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
