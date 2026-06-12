import { useEffect } from 'react';
import { updatePageSEO } from '../utils/seo';

export function TermsPage() {
  useEffect(() => {
    updatePageSEO('Termos de Uso', 'Termos de uso do Koto by Pingo — condições de utilização do aplicativo.');
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Termos de Uso</h1>
        <p className="text-muted-foreground text-sm mb-8">Última atualização: junho de 2026</p>

        <div className="space-y-6 text-sm">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Aceitação dos termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e utilizar o Koto by Pingo, você concorda com estes Termos de Uso. Se não concordar
              com qualquer parte dos termos, não utilize o aplicativo.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Descrição do serviço</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Koto by Pingo é uma plataforma educacional gratuita voltada para o treino de japonês. O conteúdo
              inclui exercícios de kana, vocabulário, escuta e simulados no estilo do exame JLPT. O serviço é
              disponibilizado gratuitamente para uso pessoal e não comercial.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Uso permitido</h2>
            <p className="text-muted-foreground leading-relaxed">
              O aplicativo é destinado exclusivamente ao uso pessoal e educacional. É proibido reproduzir,
              distribuir, modificar ou utilizar comercialmente qualquer parte do conteúdo sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Limitação de responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Koto by Pingo é disponibilizado "como está", sem garantias de qualquer natureza. Não nos
              responsabilizamos por perdas de progresso decorrentes de limpeza de dados do navegador,
              troca de dispositivo ou qualquer outro fator técnico. O conteúdo educacional é elaborado com
              cuidado, mas pode conter imprecisões que serão corrigidas conforme identificadas.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Propriedade intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteúdo, design, marca e mascote do Koto by Pingo são propriedade da Pingo Concursos.
              Os caracteres japoneses e o sistema de escrita japonês são patrimônio cultural e não sujeitos
              a direitos exclusivos. O conteúdo pedagógico, questões e explanações são de autoria própria.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Publicidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O aplicativo pode exibir anúncios de terceiros para subsidiar a manutenção e o desenvolvimento
              do serviço gratuito. Os anúncios são gerenciados por plataformas de terceiros e estão sujeitos
              às respectivas políticas de privacidade e termos de uso.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Modificações</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamos o direito de modificar estes termos a qualquer momento. Alterações serão comunicadas
              por meio da atualização da data neste documento. O uso continuado do aplicativo representa
              aceite das condições vigentes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Legislação aplicável</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais
              competentes do Brasil.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
