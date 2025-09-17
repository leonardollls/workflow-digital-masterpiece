import { Button } from '@/components/ui/button';

const ResourceVault = () => {
  const resources = [
    // Calculadoras Básicas
    {
      id: 1,
      title: "ROI Calculator Pro",
      description: "Calcule o retorno sobre investimento de forma instantânea. Interface intuitiva que transforma números em decisões estratégicas certeiras.",
      detailedDescription: "Ferramenta completa que calcula ROI, break-even point e projeções futuras. Inclui gráficos visuais e comparativos com benchmarks do mercado.",
      type: "Calculadora",
      value: "Economiza 3h",
      icon: "📊",
      downloadCount: "3.2k",
      rating: 4.9,
      color: "from-emerald-500 to-teal-500",
      category: "calculator",
      features: ["Cálculo instantâneo", "Gráficos visuais", "Export para PDF", "Benchmarks inclusos"]
    },
    {
      id: 2,
      title: "A/B Testing Calculator",
      description: "Determine a significância estatística dos seus testes A/B com precisão científica. Nunca mais tome decisões baseadas em palpites.",
      detailedDescription: "Calculadora avançada com análise de confidence interval, power analysis e sample size. Interface que explica cada resultado de forma clara.",
      type: "Calculadora",
      value: "Economiza 12h",
      icon: "🧮",
      downloadCount: "2.8k",
      rating: 4.8,
      color: "from-blue-500 to-cyan-500",
      category: "calculator",
      features: ["Análise estatística", "Sample size calculator", "Confidence intervals", "Explicações didáticas"]
    },
    {
      id: 3,
      title: "Conversion Rate Calculator",
      description: "Analise e otimize suas taxas de conversão com precisão. Inclui benchmarks da indústria e sugestões de melhorias automáticas.",
      detailedDescription: "Mais que uma calculadora: um sistema completo de análise de conversão com insights acionáveis e roadmap de otimização personalizado.",
      type: "Calculadora",
      value: "Economiza 2h",
      icon: "📈",
      downloadCount: "4.1k",
      rating: 4.9,
      color: "from-purple-500 to-pink-500",
      category: "calculator",
      features: ["Benchmarks da indústria", "Sugestões automáticas", "Tracking histórico", "Multi-device analysis"]
    },
    
    // Checklists Interativos
    {
      id: 4,
      title: "SEO Audit Checklist 2024",
      description: "Checklist interativo com 45 pontos críticos de SEO. Interface moderna que torna auditorias complexas em processos simples e organizados.",
      detailedDescription: "Sistema completo de auditoria SEO com explicações detalhadas, links para ferramentas e scoring automático. Exporta relatórios profissionais.",
      type: "Checklist",
      value: "Economiza 8h",
      icon: "🔍",
      downloadCount: "5.7k",
      rating: 5.0,
      color: "from-orange-500 to-red-500",
      category: "checklist",
      features: ["45 pontos críticos", "Explicações detalhadas", "Scoring automático", "Relatório em PDF"]
    },
    {
      id: 5,
      title: "Pre-Launch Checklist",
      description: "20 verificações essenciais antes de qualquer lançamento. Sistema inteligente que garante que nada importante seja esquecido.",
      detailedDescription: "Checklist categorizado por áreas (técnico, design, marketing, legal) com sistema de prioridades e timeline sugerido para cada tarefa.",
      type: "Checklist",
      value: "Economiza 5h",
      icon: "🚀",
      downloadCount: "3.9k",
      rating: 4.8,
      color: "from-green-500 to-emerald-500",
      category: "checklist",
      features: ["20 categorias organizadas", "Sistema de prioridades", "Timeline sugerido", "Colaboração em equipe"]
    },
    {
      id: 6,
      title: "Performance Audit Checklist",
      description: "15 pontos fundamentais para otimização de velocidade. Transforme sites lentos em máquinas de alta performance.",
      detailedDescription: "Guia prático com testes automatizados, links para ferramentas gratuitas e estimativas de impacto para cada otimização implementada.",
      type: "Checklist",
      value: "Economiza 10h",
      icon: "⚡",
      downloadCount: "2.6k",
      rating: 4.9,
      color: "from-yellow-500 to-orange-500",
      category: "checklist",
      features: ["Testes automatizados", "Estimativa de impacto", "Ferramentas gratuitas", "Scripts prontos"]
    },

    // Guias PDF Interativos
    {
      id: 7,
      title: "Typography Mastery Guide",
      description: "Guia visual completo com 25 combinações de fontes testadas e aprovadas. Inclui hierarquias e tamanhos ideais para cada dispositivo.",
      detailedDescription: "Manual premium de 24 páginas com exemplos reais, psychological impact das fontes e sistema completo de hierarquia tipográfica responsiva.",
      type: "Guia PDF",
      value: "Economiza 7h",
      icon: "🎨",
      downloadCount: "4.3k",
      rating: 4.9,
      color: "from-pink-500 to-rose-500",
      category: "guide",
      features: ["25 combinações testadas", "Hierarquias responsivas", "Psychology of fonts", "Exemplos reais"]
    },
    {
      id: 8,
      title: "Responsive Design Bible",
      description: "Referência definitiva para design responsivo. Breakpoints, grid systems e best practices condensados em um guia prático e visual.",
      detailedDescription: "Guia técnico de 18 páginas com media queries prontas, exemplos de código e estratégias mobile-first que realmente funcionam.",
      type: "Guia PDF",
      value: "Economiza 6h",
      icon: "📱",
      downloadCount: "3.8k",
      rating: 4.8,
      color: "from-indigo-500 to-blue-500",
      category: "guide",
      features: ["Media queries prontas", "Grid systems", "Mobile-first strategy", "Code examples"]
    },
    {
      id: 9,
      title: "Git Commands Mastery",
      description: "Cheat sheet completo com 50+ comandos Git organizados por situação. Inclui emergency commands e workflow para equipes.",
      detailedDescription: "Referência visual de 12 páginas com comandos categorizados, explicações práticas e cenários reais de uso em projetos profissionais.",
      type: "Guia PDF",
      value: "Economiza 4h",
      icon: "🔧",
      downloadCount: "6.2k",
      rating: 4.7,
      color: "from-gray-600 to-gray-800",
      category: "guide",
      features: ["50+ comandos essenciais", "Emergency scenarios", "Team workflows", "Visual explanations"]
    }
  ];

  const categories = [
    {
      id: "calculator",
      name: "Calculadoras Básicas",
      description: "Ferramentas que transformam dados em decisões inteligentes",
      icon: "🧮",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "checklist", 
      name: "Checklists Interativos",
      description: "Sistemas organizados que garantem qualidade e nada esquecido",
      icon: "✅",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "guide",
      name: "Guias PDF Interativos", 
      description: "Referências visuais e práticas para consulta rápida",
      icon: "📚",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const totalDownloads = resources.reduce((sum, resource) => {
    const count = parseFloat(resource.downloadCount.replace('k', '')) * 1000;
    return sum + count;
  }, 0);

  const totalTimeSaved = resources.reduce((sum, resource) => {
    return sum + parseInt(resource.value.replace('Economiza ', '').replace('h', ''));
  }, 0);

  return (
    <section className="py-24 bg-workflow-deep relative overflow-hidden">
      {/* Enhanced Dark Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-workflow-deep via-gray-900 to-workflow-deep opacity-95" />
        <div className="absolute inset-0 bg-noise opacity-5" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-workflow-zen/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Glow Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-workflow-zen/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-workflow-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 md:mb-24 px-4 sm:px-0">
          <div className="inline-flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            <div className="w-8 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
            <span className="text-workflow-zen font-mono text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-medium">
              Bônus Exclusivos
            </span>
            <div className="w-8 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
          </div>
          
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-6 sm:mb-8 md:mb-10 leading-tight">
            The{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-workflow-zen via-workflow-accent to-workflow-zen bg-clip-text text-transparent">
                Vault
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-workflow-zen/0 via-workflow-zen/60 to-workflow-zen/0 rounded-full" />
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-workflow-zen/80 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed">
            Ferramentas profissionais que <span className="text-workflow-accent font-semibold">economizam {totalTimeSaved}+ horas</span> de trabalho manual.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Entregues como <strong className="text-white">bônus exclusivo</strong> após a conclusão do seu projeto.
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 md:gap-8 items-center justify-center text-sm sm:text-base md:text-lg text-workflow-zen/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-workflow-zen rounded-full animate-pulse" />
              <span>9 ferramentas premium</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-workflow-zen/40 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-workflow-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span>Entrega pós-projeto</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-workflow-zen/40 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span>Economia de {totalTimeSaved}+ horas</span>
            </div>
          </div>
        </div>



        {/* Categories */}
        {categories.map((category, categoryIndex) => (
          <div key={category.id} className="mb-16 sm:mb-20 px-4 sm:px-0">

            
            {/* Category Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 hover:bg-white/8 transition-all duration-500`}>
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-4">
                    <div className={`relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl lg:text-3xl shadow-2xl`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
                      <span className="relative z-10 filter drop-shadow-lg">{category.icon}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-display font-bold text-white mb-1 sm:mb-2">{category.name}</h3>
                      <p className="text-workflow-zen/80 text-xs sm:text-sm lg:text-base">{category.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {resources.filter(resource => resource.category === category.id).map((resource, index) => (
                <div
                  key={resource.id}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-workflow-zen/20 transition-all duration-700 hover:-translate-y-2 hover:bg-white/8"
                  style={{ animationDelay: `${(categoryIndex * 3 + index) * 0.1}s` }}
                >
                  {/* Resource Header */}
                  <div className={`bg-gradient-to-br ${resource.color} p-4 sm:p-6 lg:p-8 relative overflow-hidden`}>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                      <span className="text-xs font-bold text-white">{resource.type}</span>
                    </div>
                    <div className="absolute -top-6 -right-6 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 sm:w-16 h-12 sm:h-16 bg-white/10 rounded-full"></div>
                    
                    <div className="relative z-10">
                      <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">{resource.icon}</div>
                      <div className="text-white font-bold text-lg sm:text-xl">
                        {resource.value}
                      </div>
                      <div className="text-white/90 text-xs sm:text-sm">de trabalho manual</div>
                    </div>
                  </div>

                  {/* Resource Content */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    <h4 className="text-lg sm:text-xl font-display font-bold text-white mb-2 sm:mb-3 group-hover:text-workflow-zen transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-workflow-zen/80 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <p className="text-workflow-zen/60 mb-4 sm:mb-6 text-xs leading-relaxed">
                      {resource.detailedDescription}
                    </p>

                    {/* Features */}
                    <div className="mb-4 sm:mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        {resource.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 bg-workflow-zen rounded-full flex-shrink-0"></span>
                            <span className="text-workflow-zen/70">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>



                    {/* Status Badge */}
                    <div className="w-full bg-gradient-to-r from-workflow-zen/20 to-workflow-accent/20 border border-workflow-zen/30 rounded-xl py-2 sm:py-3 px-4 sm:px-6 text-center hover:bg-gradient-to-r hover:from-workflow-zen/30 hover:to-workflow-accent/30 transition-all duration-300">
                      <span className="flex items-center justify-center gap-2 text-workflow-zen font-semibold text-sm sm:text-base">
                        <span className="text-lg">🎁</span>
                        Incluído no Projeto
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Enhanced Value Proposition */}
        <div className="max-w-5xl mx-auto mt-16 sm:mt-20 px-4 sm:px-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/10 via-workflow-accent/10 to-workflow-zen/10 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12">
              <div className="text-center">
                <div className="relative group cursor-pointer mb-6 sm:mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/20 to-workflow-accent/20 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                  <div className="relative text-4xl sm:text-6xl lg:text-7xl xl:text-8xl filter drop-shadow-lg">🎁</div>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-4 sm:mb-6 text-white">
                  Economia Total: <span className="bg-gradient-to-r from-workflow-zen to-workflow-accent bg-clip-text text-transparent">{totalTimeSaved}+ Horas</span>
                </h3>
                
                <p className="text-sm sm:text-lg lg:text-xl text-workflow-zen/80 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                  Ferramentas que eliminam trabalho repetitivo e aceleram seu workflow.
                  <br className="hidden sm:block" /><span className="sm:hidden"> </span><strong className="text-white">Entregues como bônus após a conclusão da sua landing page.</strong>
                </p>
              


                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-4 sm:py-6">
                    <div className="text-2xl sm:text-3xl">📅</div>
                    <div className="text-center sm:text-left">
                      <div className="text-white font-bold text-base sm:text-lg">Entrega Pós-Projeto</div>
                      <div className="text-white/70 text-xs sm:text-sm">Todas as ferramentas são enviadas após a conclusão da landing page</div>
                    </div>
                  </div>
                </div>

                {/* CTA para Briefings */}
                <div className="mt-12 space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                    Pronto para receber essas ferramentas?
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                    {/* Landing Page CTA */}
                    <div 
                      className="flex-1 cursor-pointer group"
                      onClick={() => window.location.href = '/briefing-cliente'}
                    >
                      <div className="bg-gradient-to-r from-workflow-zen to-workflow-accent rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20">
                        <div className="text-3xl mb-3">🚀</div>
                        <h4 className="font-bold text-lg mb-2">Landing Page</h4>
                        <p className="text-sm opacity-90">+ Ferramentas Premium</p>
                      </div>
                    </div>

                    {/* Site Institucional CTA */}
                    <div 
                      className="flex-1 cursor-pointer group"
                      onClick={() => window.location.href = '/briefing-institucional'}
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20">
                        <div className="text-3xl mb-3">🏢</div>
                        <h4 className="font-bold text-lg mb-2">Site Institucional</h4>
                        <p className="text-sm opacity-90">+ Ferramentas Premium</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-workflow-zen/80 text-sm">
                    Escolha seu projeto e garante acesso a todas as ferramentas premium
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceVault;
