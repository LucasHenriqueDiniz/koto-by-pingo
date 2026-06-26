import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    id: '1',
    question: 'Preciso pagar algo?',
    answer: 'Não, Koto é 100% grátis e sempre será.',
  },
  {
    id: '2',
    question: 'Preciso de internet?',
    answer:
      'Não, funciona 100% offline. Seu progresso é salvo localmente. Se você fizer login, sincroniza com sua conta.',
  },
  {
    id: '3',
    question: 'Por onde começo?',
    answer:
      'Comece no botão "Começar agora" e escolha seu script preferido: hiragana ou katakana.',
  },
  {
    id: '4',
    question: 'Quanto tempo leva por dia?',
    answer: 'De 5 a 15 minutos. Você controla o tempo.',
  },
  {
    id: '5',
    question: 'Meu progresso fica salvo?',
    answer:
      'Sim, tudo fica salvo no seu dispositivo. Se fazer login, sincroniza com sua conta.',
  },
  {
    id: '6',
    question: 'Para qual nível de japonês?',
    answer: 'Começamos no N5 (básico). Mais níveis em breve.',
  },
];

export function FAQSection() {
  return (
    <section className="py-12 md:py-20 space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Dúvidas comuns
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-2 rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline hover:text-primary">
                <span className="font-medium text-left">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
