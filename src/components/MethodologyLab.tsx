import { useState, useRef, useEffect } from 'react';

const MethodologyLab = () => {
  const [isVisible, setIsVisible] = useState(false);
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
      accentColor: "blue",
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
      accentColor: "purple",
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
      accentColor: "green",
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
      accentColor: "orange",
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
      accentColor: "indigo",
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
      accentColor: "yellow",
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
      accentColor: "pink",
      icon: "📈"
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding bg-workflow-deep relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-workflow-deep via-gray-900 to-workflow-deep opacity-95" />
        <div className="absolute inset-0 bg-noise opacity-5" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-workflow-zen/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
            <span className="text-workflow-zen font-mono text-sm tracking-[0.2em] uppercase font-medium">
              Metodologia Científica
            </span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight">
            The{' '}
            <span className="relative">
              <span className="text-gradient bg-gradient-to-r from-workflow-zen via-workflow-accent to-workflow-zen bg-clip-text text-transparent">
                Lab
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-workflow-zen/0 via-workflow-zen/60 to-workflow-zen/0 rounded-full" />
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-workflow-zen/80 mb-8 max-w-4xl mx-auto leading-relaxed">
            7 fases científicas que transformam sua visão em{' '}
            <span className="text-workflow-accent font-semibold">resultados mensuráveis</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-workflow-zen/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-workflow-zen rounded-full animate-pulse" />
              <span>150+ projetos de alta conversão</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-workflow-zen/40 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-workflow-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>Entrega garantida em 8 dias</span>
            </div>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="relative max-w-7xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-workflow-zen/0 via-workflow-zen/30 to-workflow-zen/0 hidden lg:block" />

          {phases.map((phase, index) => (
            <div
              key={phase.number}
              className={`relative mb-24 lg:mb-32 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-12'}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`lg:flex items-start ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12`}>
                
                {/* Phase Content */}
                <div className="lg:w-1/2 space-y-6">
                  {/* Phase Header Card */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/20 to-workflow-accent/20 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
                      <div className="flex items-center gap-6 mb-6">
                        <div className={`relative w-16 h-16 bg-gradient-to-r ${phase.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
                          {phase.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2">
                            {phase.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 bg-${phase.accentColor}-400 rounded-full animate-pulse`} />
                            <span className="text-workflow-zen/80 font-medium">{phase.duration}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-workflow-zen/90 text-lg leading-relaxed mb-8">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  {/* Activities with Details */}
                  <div className="space-y-4">
                    {phase.activities.map((activity, i) => (
                      <div
                        key={i}
                        className="group relative"
                        style={{ animationDelay: `${(index * 0.15) + (i * 0.1)}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/5 to-workflow-accent/5 rounded-xl blur-sm transition-all duration-300 group-hover:blur-md opacity-0 group-hover:opacity-100" />
                        
                        <div className="relative bg-white/3 backdrop-blur-lg border border-white/5 rounded-xl p-6 hover:bg-white/8 transition-all duration-300">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`w-8 h-8 bg-gradient-to-r ${phase.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-lg`}>
                              <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-workflow-zen transition-colors duration-300">
                                {activity.name}
                              </h4>
                              <p className="text-workflow-zen/70 leading-relaxed text-sm lg:text-base">
                                {activity.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase Icon */}
                <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0">
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${phase.color} rounded-full blur-2xl opacity-30 transition-all duration-500 group-hover:blur-3xl group-hover:opacity-50`} />
                    <div className={`relative w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center text-7xl lg:text-8xl text-white shadow-2xl hover:scale-110 transition-all duration-500 border-4 border-white/20`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                      <span className="relative z-10 filter drop-shadow-lg">{phase.icon}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 top-20 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-workflow-zen to-workflow-accent rounded-full border-4 border-workflow-deep hidden lg:block shadow-xl">
                <div className="absolute inset-1 bg-white/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Process Stats */}
        <div className={`mt-24 transition-all duration-1000 delay-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/10 via-workflow-accent/10 to-workflow-zen/10 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center group cursor-pointer">
                  <div className="text-5xl lg:text-6xl font-bold text-workflow-zen mb-4 group-hover:scale-110 transition-transform duration-300">
                    7
                  </div>
                  <div className="text-white/80 font-medium">Fases Científicas</div>
                  <div className="w-12 h-0.5 bg-workflow-zen/50 mx-auto mt-2 group-hover:bg-workflow-zen transition-colors duration-300" />
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="text-5xl lg:text-6xl font-bold text-workflow-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    150+
                  </div>
                  <div className="text-white/80 font-medium">Projetos Executados</div>
                  <div className="w-12 h-0.5 bg-workflow-accent/50 mx-auto mt-2 group-hover:bg-workflow-accent transition-colors duration-300" />
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="text-5xl lg:text-6xl font-bold text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    98%
                  </div>
                  <div className="text-white/80 font-medium">Taxa de Sucesso</div>
                  <div className="w-12 h-0.5 bg-green-400/50 mx-auto mt-2 group-hover:bg-green-400 transition-colors duration-300" />
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="text-5xl lg:text-6xl font-bold text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    8
                  </div>
                  <div className="text-white/80 font-medium">Dias de Entrega</div>
                  <div className="w-12 h-0.5 bg-orange-400/50 mx-auto mt-2 group-hover:bg-orange-400 transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologyLab;
