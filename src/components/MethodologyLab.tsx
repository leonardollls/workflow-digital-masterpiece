import { useState, useRef, useEffect } from 'react';

const MethodologyLab = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const phases = [
    {
      number: 1,
      title: "Intelligence Gathering",
      duration: "1-2 dias",
      description: "Research profundo e análise estratégica para fundamentar as decisões",
      activities: [
        {
          name: "Market research profundo",
          explanation: "Análise completa do mercado-alvo, identificando tendências, oportunidades e ameaças. Estudamos concorrentes diretos e indiretos, comportamento do consumidor, sazonalidades e gaps de mercado para posicionar sua marca estrategicamente."
        },
        {
          name: "Competitor analysis avançado", 
          explanation: "Mapeamento detalhado da concorrência, analisando suas estratégias de conversão, pontos fortes e vulnerabilidades. Identificamos oportunidades de diferenciação e benchmarks de performance para superá-los."
        },
        {
          name: "User persona development",
          explanation: "Criação de personas detalhadas baseadas em dados reais, definindo motivações, dores, jornada de compra e linguagem ideal. Cada persona guiará decisões de design, copywriting e experiência do usuário."
        },
        {
          name: "Conversion audit completo",
          explanation: "Auditoria técnica e estratégica de performance atual, identificando gargalos de conversão, oportunidades de otimização e elementos que estão funcionando bem para replicar e potencializar."
        }
      ],
      color: "from-blue-500 to-cyan-500",
      icon: "🔍"
    },
    {
      number: 2,
      title: "Strategy Architecture", 
      duration: "1 dia",
      description: "Arquitetura estratégica de conversão baseada nos insights coletados",
      activities: [
        {
          name: "Conversion funnel design",
          explanation: "Estruturação do funil de conversão otimizado, mapeando cada etapa da jornada do usuário com pontos de contato estratégicos, eliminando atritos e maximizando as chances de conversão em cada fase."
        },
        {
          name: "User journey mapping",
          explanation: "Mapeamento detalhado da jornada do usuário, desde o primeiro contato até a conversão e pós-venda. Identificamos momentos-chave, emoções e oportunidades de engajamento para criar uma experiência fluida."
        },
        {
          name: "Content strategy blueprint",
          explanation: "Estratégia de conteúdo personalizada baseada nas personas, definindo tom de voz, mensagens-chave, hierarquia de informações e gatilhos psicológicos que irão persuadir e converter seu público-alvo."
        },
        {
          name: "Technical requirements",
          explanation: "Definição dos requisitos técnicos necessários para implementação, incluindo integrações, ferramentas de tracking, CRM, automações e infraestrutura necessária para suportar o crescimento."
        }
      ],
      color: "from-purple-500 to-pink-500",
      icon: "🏗️"
    },
    {
      number: 3,
      title: "Experience Design",
      duration: "2-3 dias", 
      description: "Design centrado na experiência do usuário e otimização para conversão",
      activities: [
        {
          name: "Wireframing interativo",
          explanation: "Criação de wireframes interativos que testam o fluxo de navegação e usabilidade antes do design visual. Validamos a estrutura, hierarquia de informações e experiência do usuário de forma rápida e eficiente."
        },
        {
          name: "UI/UX prototyping",
          explanation: "Desenvolvimento de protótipos de alta fidelidade com interface visual completa, testando interações, micro-animações e elementos de conversão em um ambiente controlado antes da implementação final."
        },
        {
          name: "A/B testing scenarios",
          explanation: "Planejamento de cenários de teste A/B para elementos críticos de conversão, como headlines, CTAs, formulários e layouts. Preparamos hipóteses e métricas para otimização contínua pós-lançamento."
        },
        {
          name: "Accessibility planning",
          explanation: "Garantia de acessibilidade seguindo padrões WCAG, assegurando que a landing page seja utilizável por pessoas com diferentes necessidades, ampliando o alcance e demonstrando responsabilidade social."
        }
      ],
      color: "from-green-500 to-teal-500", 
      icon: "🎨"
    },
    {
      number: 4,
      title: "Code Craftsmanship",
      duration: "2-3 dias",
      description: "Desenvolvimento com excelência técnica e performance otimizada",
      activities: [
        {
          name: "Performance-first development",
          explanation: "Código otimizado desde a base para máxima performance, utilizando técnicas avançadas de otimização, lazy loading, compressão de assets e estruturas eficientes que garantem carregamento rápido e experiência fluida."
        },
        {
          name: "Mobile-responsive coding",
          explanation: "Desenvolvimento mobile-first com responsividade perfeita em todos os dispositivos. Cada elemento é testado e otimizado para oferecer experiência consistente desde smartphones até desktops de alta resolução."
        },
        {
          name: "SEO implementation", 
          explanation: "Implementação técnica de SEO on-page, incluindo estrutura semântica, meta tags otimizadas, schema markup, sitemap XML e configurações que maximizam a visibilidade nos motores de busca."
        },
        {
          name: "Security hardening",
          explanation: "Implementação de medidas de segurança robustas, incluindo SSL, proteção contra ataques comuns, validação de formulários, sanitização de dados e compliance com regulamentações de privacidade."
        }
      ],
      color: "from-orange-500 to-red-500",
      icon: "⚡"
    },
    {
      number: 5,
      title: "Quality Assurance",
      duration: "1 dia",
      description: "Garantia de qualidade total através de testes rigorosos",
      activities: [
        {
          name: "Cross-browser testing",
          explanation: "Testes extensivos em diferentes navegadores e versões para garantir compatibilidade universal. Verificamos funcionalidade, layout e performance em Chrome, Firefox, Safari, Edge e versões mobile."
        },
        {
          name: "Performance optimization",
          explanation: "Otimização final de performance com análise detalhada de Core Web Vitals, compressão de imagens, minificação de código, cache estratégico e configurações para velocidade máxima de carregamento."
        },
        {
          name: "Conversion tracking setup",
          explanation: "Configuração completa de tracking de conversões, incluindo Google Analytics, pixels de redes sociais, heat maps e ferramentas de monitoramento para medir e otimizar performance continuamente."
        },
        {
          name: "User acceptance testing",
          explanation: "Testes finais simulando cenários reais de uso, validando fluxos de conversão, formulários, integrações e experiência geral do usuário para garantir que tudo funcione perfeitamente no lançamento."
        }
      ],
      color: "from-indigo-500 to-purple-500",
      icon: "✅"
    },
    {
      number: 6,
      title: "Launch Orchestration",
      duration: "1 dia",
      description: "Lançamento orquestrado e monitorado para máximo impacto",
      activities: [
        {
          name: "Deployment automation",
          explanation: "Deploy automatizado com pipeline de CI/CD que garante lançamento sem erros, rollback automático em caso de problemas e monitoramento em tempo real de todos os sistemas e integrações."
        },
        {
          name: "DNS configuration",
          explanation: "Configuração otimizada de DNS com tempos de resposta mínimos, redundância geográfica e configurações que garantem disponibilidade máxima e velocidade de acesso global."
        },
        {
          name: "SSL setup",
          explanation: "Implementação de certificados SSL premium com configuração de segurança avançada, HSTS, e otimizações que garantem conexões seguras e confiança do usuário e motores de busca."
        },
        {
          name: "Analytics activation",
          explanation: "Ativação e configuração final de todas as ferramentas de analytics, incluindo Goals, Events, Audiences customizadas e dashboards personalizados para monitoramento completo da performance."
        }
      ],
      color: "from-yellow-500 to-orange-500",
      icon: "🚀"
    },
    {
      number: 7,
      title: "Growth Optimization",
      duration: "ongoing",
      description: "Otimização contínua para crescimento e performance máxima",
      activities: [
        {
          name: "Performance monitoring",
          explanation: "Monitoramento 24/7 de performance, uptime, velocidade e métricas de conversão com alertas automáticos para qualquer anomalia, garantindo máxima disponibilidade e experiência consistente."
        },
        {
          name: "A/B testing execution",
          explanation: "Execução sistemática de testes A/B baseados em dados, testando headlines, CTAs, layouts e elementos de conversão para otimização contínua e crescimento sustentável das taxas de conversão."
        },
        {
          name: "Conversion optimization",
          explanation: "Análise contínua de dados de usuários, heat maps, session recordings e métricas para identificar oportunidades de otimização e implementar melhorias que aumentem consistentemente as conversões."
        },
        {
          name: "Monthly reporting",
          explanation: "Relatórios mensais detalhados com insights acionáveis, análise de performance, recomendações de otimização e roadmap de melhorias para crescimento contínuo e ROI maximizado."
        }
      ],
      color: "from-pink-500 to-rose-500",
      icon: "📈"
    }
  ];

  const togglePhaseExpansion = (phaseNumber: number) => {
    setExpandedPhase(expandedPhase === phaseNumber ? null : phaseNumber);
  };

  return (
    <section ref={sectionRef} className="section-padding bg-workflow-deep relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-workflow-deep via-workflow-700 to-workflow-deep opacity-90" />
        <div className="absolute inset-0 bg-noise opacity-5" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-workflow-zen to-workflow-accent rounded-full" />
            <span className="text-workflow-zen font-mono text-sm tracking-wider uppercase">Metodologia</span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-workflow-zen to-workflow-accent rounded-full" />
          </div>
          
          <h2 className="text-responsive-3xl font-display font-bold text-white mb-6">
            The <span className="text-gradient bg-gradient-to-r from-workflow-zen to-workflow-accent bg-clip-text text-transparent">Lab</span>
          </h2>
          
          <p className="text-responsive-lg text-workflow-zen/80 mb-8 max-w-3xl mx-auto">
            Metodologia Workflow: 7 fases científicas para transformar sua visão em resultados concretos
          </p>
          
          <div className="text-workflow-zen/60">
            Processo comprovado em mais de 150 projetos de alta conversão • Entrega em apenas 8 dias
          </div>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-workflow-zen/20 hidden lg:block"></div>

          {phases.map((phase, index) => (
            <div
              key={phase.number}
              className={`relative mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`lg:flex items-start ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8`}>
                {/* Phase Content */}
                <div className="lg:w-1/2">
                  <div className="card-workflow bg-white/10 backdrop-blur-lg border-workflow-zen/20 hover:bg-white/15 transition-all duration-300">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                          {phase.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-display font-bold text-white">
                            {phase.title}
                          </h3>
                          <div className="text-workflow-zen/70">{phase.duration}</div>
                        </div>
                        <button
                          onClick={() => togglePhaseExpansion(phase.number)}
                          className="text-workflow-zen hover:text-workflow-accent transition-colors duration-300"
                        >
                          {expandedPhase === phase.number ? '−' : '+'}
                        </button>
                      </div>

                      <p className="text-workflow-zen/80 mb-6">
                        {phase.description}
                      </p>

                      <div className="space-y-3">
                        {phase.activities.map((activity, i) => (
                          <div key={i} className="group">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => togglePhaseExpansion(phase.number)}>
                              <div className="w-1.5 h-1.5 bg-workflow-zen rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                              <span className="text-white/90 text-sm font-medium group-hover:text-workflow-zen transition-colors duration-300">
                                {activity.name}
                              </span>
                            </div>
                            
                            {expandedPhase === phase.number && (
                              <div className="mt-2 ml-5 p-3 bg-white/5 rounded-lg border border-workflow-zen/10 animate-fade-in">
                                <p className="text-workflow-zen/70 text-sm leading-relaxed">
                                  {activity.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase Icon */}
                <div className="lg:w-1/2 flex justify-center mb-6 lg:mb-0">
                  <div className={`w-32 h-32 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center text-6xl text-white shadow-workflow-lg animate-float hover:scale-110 transition-transform duration-300`}>
                    {phase.icon}
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 top-16 transform -translate-x-1/2 w-4 h-4 bg-workflow-zen rounded-full border-4 border-workflow-deep hidden lg:block shadow-lg"></div>
            </div>
          ))}
        </div>

        {/* Process Stats */}
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 transition-all duration-1000 delay-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center group">
            <div className="text-4xl font-bold text-workflow-zen mb-2 group-hover:scale-110 transition-transform duration-300">7</div>
            <div className="text-white/70">Fases Científicas</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-workflow-zen mb-2 group-hover:scale-110 transition-transform duration-300">150+</div>
            <div className="text-white/70">Projetos Executados</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-workflow-zen mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
            <div className="text-white/70">Taxa de Sucesso</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-workflow-zen mb-2 group-hover:scale-110 transition-transform duration-300">8</div>
            <div className="text-white/70">Dias de Entrega</div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-workflow-zen/5 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-workflow-accent/5 rounded-full blur-lg animate-float-delayed" />
        <div className="absolute top-3/4 left-3/4 w-20 h-20 bg-workflow-zen/5 rounded-full blur-md animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
};

export default MethodologyLab;
