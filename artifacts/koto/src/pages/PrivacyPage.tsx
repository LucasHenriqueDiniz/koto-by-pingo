import { useEffect } from 'react';
import { updatePageSEO } from '../utils/seo';

export function PrivacyPage() {
  useEffect(() => {
    updatePageSEO('Política de Privacidade', 'Política de privacidade do Koto by Pingo — como seus dados são tratados.');
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Política de Privacidade</h1>
        <p className="text-muted-foreground text-sm mb-8">Última atualização: junho de 2026</p>

        <div className="space-y-6 text-sm">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Dados coletados</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Koto by Pingo, em sua versão atual, não coleta dados pessoais identificáveis. Todo o progresso
              de estudo (tentativas de kana, vocabulário, resultados de simulados e sessões) é armazenado
              exclusivamente no dispositivo do usuário, por meio do armazenamento local do navegador (localStorage).
              Esses dados não são transmitidos a nenhum servidor.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Armazenamento local</h2>
            <p className="text-muted-foreground leading-relaxed">
              Os dados de progresso são gravados localmente sob a chave de prefixo <code className="bg-muted px-1 rounded text-foreground">koto:</code>.
              O usuário pode remover esses dados a qualquer momento através da função "Resetar progresso" na
              página de Progresso, ou diretamente pelas ferramentas do navegador.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Publicidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Koto by Pingo pode exibir anúncios de terceiros. Serviços de publicidade podem utilizar cookies
              e tecnologias similares para exibir anúncios relevantes. Consulte a política de privacidade do
              provedor de anúncios para mais informações sobre o tratamento de dados por esses serviços.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              O Koto by Pingo utiliza apenas armazenamento local (localStorage) para persistir o progresso do
              usuário. Não utilizamos cookies de rastreamento proprietários. Serviços de terceiros integrados
              (como publicidade) podem utilizar seus próprios cookies.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Lei Geral de Proteção de Dados (LGPD)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Em conformidade com a Lei nº 13.709/2018 (LGPD), informamos que, nesta versão do aplicativo,
              não coletamos, processamos ou armazenamos dados pessoais em servidores próprios. Caso dados
              pessoais passem a ser coletados em versões futuras (como e-mail para criação de conta), esta
              política será atualizada e o usuário será informado.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Alterações nesta política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta política pode ser atualizada periodicamente. A data de última atualização constará no topo
              desta página. O uso continuado do aplicativo após alterações indica aceite das novas condições.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para questões relacionadas à privacidade, entre em contato através da nossa{' '}
              <a href="/contato" className="text-primary hover:underline">página de contato</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
