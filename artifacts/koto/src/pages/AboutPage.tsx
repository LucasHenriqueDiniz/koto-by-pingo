import { useEffect } from 'react';
import { updatePageSEO } from '../utils/seo';
import { Logo } from '../components/brand/Logo';

export function AboutPage() {
  useEffect(() => {
    updatePageSEO('Sobre o Koto by Pingo', 'Saiba mais sobre o Koto by Pingo, app de treino de japonês para brasileiros.');
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="max-w-2xl">
        <div className="mb-8">
          <Logo variant="horizontal" size="lg" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Sobre o Koto by Pingo</h1>
        <p className="text-muted-foreground text-sm mb-8">Última atualização: junho de 2026</p>

        <div className="prose prose-sm max-w-none text-foreground space-y-6">
          <section>
            <h2 className="text-base font-semibold mb-2">O que é o Koto?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Koto by Pingo é uma plataforma gratuita de treino de japonês desenvolvida para estudantes brasileiros.
              O objetivo é oferecer uma forma prática e estruturada de estudar kana, vocabulário, escuta e preparação
              para o exame JLPT, com sessões curtas e feedback imediato.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">Pingo Concursos</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Koto é um produto independente desenvolvido pela equipe da Pingo Concursos, empresa brasileira
              voltada para a preparação em exames e certificações. O mascote Pingo — um pinguim preto — é o
              símbolo da marca e aparece no Koto como Pingo-sensei, guia dos estudos de japonês.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">Proposta</h2>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que o aprendizado de idiomas é mais efetivo quando feito em sessões curtas, consistentes
              e bem estruturadas. O Koto foi desenvolvido com esse princípio: sem gamificação excessiva, sem cursos
              longos, sem distração. Apenas prática direta e progressão clara.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">Tecnologia</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Koto by Pingo é um aplicativo web desenvolvido com tecnologias modernas e funciona diretamente no
              navegador. O progresso do usuário é armazenado localmente no dispositivo, sem necessidade de criar
              conta. Futuramente, suporte a conta de usuário será adicionado para sincronização entre dispositivos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para dúvidas, sugestões ou problemas, acesse a página de <a href="/contato" className="text-primary hover:underline">contato</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
