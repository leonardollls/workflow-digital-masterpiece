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
      value: "R$ 397",
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
      value: "R$ 497",
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
      value: "R$ 297",
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
      value: "R$ 597",
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
      value: "R$ 397",
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
      value: "R$ 447",
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
      value: "R$ 347",
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
      value: "R$ 297",
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
      value: "R$ 197",
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

  const totalValue = resources.reduce((sum, resource) => {
    return sum + parseInt(resource.value.replace('R$ ', ''));
  }, 0);

  const totalDownloads = resources.reduce((sum, resource) => {
    const count = parseFloat(resource.downloadCount.replace('k', '')) * 1000;
    return sum + count;
  }, 0);

  return (
    <section className="py-24 bg-workflow-glow relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-workflow-zen/5 to-transparent"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-workflow-zen/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-workflow-zen/10 border border-workflow-zen/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-workflow-zen rounded-full animate-pulse"></span>
            <span className="text-workflow-zen font-semibold text-sm">BÔNUS EXCLUSIVOS</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-display font-bold text-workflow-deep mb-6">
            The <span className="text-gradient bg-gradient-to-r from-workflow-zen to-blue-500 bg-clip-text text-transparent">Vault</span>
          </h2>
          <p className="text-xl text-workflow-deep/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ferramentas profissionais que valem <strong>R$ {totalValue.toLocaleString('pt-BR')}</strong> no mercado.
            <br />Entregues como <strong>bônus exclusivo</strong> após a conclusão do seu projeto.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-6 py-3">
              <span className="w-3 h-3 bg-success rounded-full animate-glow"></span>
              <span className="text-success font-semibold">Bônus Gratuito</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-3">
              <span className="text-blue-500">🎁</span>
              <span className="text-blue-500 font-semibold">Pós-Entrega</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-3">
              <span className="text-purple-500">🚀</span>
              <span className="text-purple-500 font-semibold">Valor Agregado</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.map((category, categoryIndex) => (
          <div key={category.id} className="mb-20">
            {/* Category Header */}
            <div className="text-center mb-12">
              <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${category.color} p-6 rounded-2xl text-white mb-6`}>
                <span className="text-3xl">{category.icon}</span>
                <div className="text-left">
                  <h3 className="text-2xl font-display font-bold">{category.name}</h3>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {resources.filter(resource => resource.category === category.id).map((resource, index) => (
                <div
                  key={resource.id}
                  className="group bg-white/60 backdrop-blur-sm border border-white/40 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-workflow-zen/20 transition-all duration-700 hover:-translate-y-2"
                  style={{ animationDelay: `${(categoryIndex * 3 + index) * 0.1}s` }}
                >
                  {/* Resource Header */}
                  <div className={`bg-gradient-to-br ${resource.color} p-8 relative overflow-hidden`}>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-bold text-white">{resource.type}</span>
                    </div>
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                    
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">{resource.icon}</div>
                      <div className="text-white font-bold text-xl line-through opacity-80">
                        {resource.value}
                      </div>
                      <div className="text-white/90 text-sm">Valor de mercado</div>
                    </div>
                  </div>

                  {/* Resource Content */}
                  <div className="p-8">
                    <h4 className="text-xl font-display font-bold text-workflow-deep mb-3 group-hover:text-workflow-zen transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-workflow-deep/70 mb-4 text-sm leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <p className="text-workflow-deep/60 mb-6 text-xs leading-relaxed">
                      {resource.detailedDescription}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-2">
                        {resource.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 bg-workflow-zen rounded-full"></span>
                            <span className="text-workflow-deep/70">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-semibold text-workflow-deep">{resource.rating}</span>
                      </div>
                      <div className="text-workflow-deep/60">
                        {resource.downloadCount} usuários
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="w-full bg-gradient-to-r from-workflow-zen/10 to-blue-500/10 border border-workflow-zen/20 rounded-xl py-3 px-6 text-center">
                      <span className="flex items-center justify-center gap-2 text-workflow-zen font-semibold">
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

        {/* Value Proposition */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-workflow-deep to-workflow-deep/90 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-workflow-zen/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-workflow-zen/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="text-7xl mb-8">🎁</div>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
                Valor Total: <span className="text-gradient bg-gradient-to-r from-workflow-zen to-blue-400 bg-clip-text text-transparent">R$ {totalValue.toLocaleString('pt-BR')}</span>
              </h3>
              <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Mais de 30 horas de trabalho condensadas em ferramentas profissionais.
                <strong> Entregues como bônus após a conclusão da sua landing page.</strong>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-workflow-zen mb-2">9</div>
                  <div className="text-white/70">Ferramentas Premium</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-workflow-zen mb-2">{(totalDownloads / 1000).toFixed(1)}k+</div>
                  <div className="text-white/70">Usuários Ativos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold text-workflow-zen mb-2">4.8★</div>
                  <div className="text-white/70">Rating Médio</div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6">
                  <div className="text-3xl">📅</div>
                  <div className="text-left">
                    <div className="text-white font-bold text-lg">Entrega Pós-Projeto</div>
                    <div className="text-white/70 text-sm">Todas as ferramentas são enviadas após a conclusão da landing page</div>
                  </div>
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
