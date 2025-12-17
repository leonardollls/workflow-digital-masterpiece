import { useState } from 'react';
import { ChevronDown, HelpCircle, Check } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Vocês cuidam da hospedagem e domínio?',
    answer: 'Sim, podemos cuidar de toda a configuração técnica, se necessário. Configuramos a hospedagem otimizada e deixamos tudo funcionando perfeitamente!'
  },
  {
    question: 'O site ficará no meu nome e domínio?',
    answer: 'Sim, 100%. O site será registrado em seu nome, com seu domínio personalizado. Você terá total propriedade e controle sobre todos os arquivos e códigos fonte.'
  },
  {
    question: 'Quanto tempo leva para o site ficar pronto?',
    answer: 'O site está praticamente pronto! Após a confirmação do pagamento, fazemos os ajustes finais personalizados e o site fica no ar em até 48 horas.'
  },
  {
    question: 'Posso fazer alterações no site depois?',
    answer: 'Sim! Você terá acesso completo ao código fonte e poderá fazer alterações quando quiser. Além disso, oferecemos suporte técnico para auxiliar em qualquer modificação futura que desejar.'
  },
  {
    question: 'E se eu não gostei do resultado atual?',
    answer: 'Oferecemos 30 dias de garantia para quaisquer ajustes e mudanças desejadas.'
  },
  {
    question: 'O site funcionará bem no celular?',
    answer: 'Sim, todos os nossos sites são 100% responsivos! Funcionam perfeitamente em celulares, tablets e desktops, garantindo uma experiência excelente em qualquer dispositivo.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
            <HelpCircle size={16} className="text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Perguntas Frequentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Dúvidas <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Comuns</span>
          </h2>
          <p className="text-white/60 text-lg">
            Tudo o que você precisa saber sobre o novo site
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                {/* Decorative gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/0 via-violet-500/0 to-purple-500/0 ${isOpen ? 'opacity-5' : 'opacity-0 group-hover:opacity-5'} transition-opacity duration-500`} />
                
                {/* Question Button */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full text-left p-6 flex items-start gap-4 relative z-10"
                  aria-expanded={isOpen}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isOpen 
                      ? 'bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg shadow-purple-500/30' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    {isOpen ? (
                      <Check size={20} className="text-white" />
                    ) : (
                      <HelpCircle size={20} className="text-white/70 group-hover:text-white" />
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold pr-4 transition-colors duration-300 ${
                      isOpen ? 'text-white' : 'text-white/90 group-hover:text-white'
                    }`}>
                      {item.question}
                    </h3>
                  </div>

                  {/* Chevron */}
                  <div className="flex-shrink-0">
                    <ChevronDown
                      size={20}
                      className={`text-white/50 transition-all duration-300 ${
                        isOpen ? 'rotate-180 text-purple-400' : 'group-hover:text-white/70'
                      }`}
                    />
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pl-[4.5rem]">
                    <div className="relative">
                      {/* Decorative line */}
                      <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-purple-500/50 to-transparent rounded-full" />
                      
                      {/* Answer text */}
                      <p className="text-white/70 text-base leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20">
          <p className="text-white/70 mb-4">
            Ainda tem dúvidas? Estou aqui para ajudar!
          </p>
          <a
            href="https://wa.me/555199437916"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-sm transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-105"
          >
            <HelpCircle size={18} />
            Falar com Desenvolvedor
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
