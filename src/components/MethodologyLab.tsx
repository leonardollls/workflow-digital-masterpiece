
const MethodologyLab = () => {
  const phases = [
    {
      number: 1,
      title: "Intelligence Gathering",
      duration: "2-3 dias",
      description: "Research profundo e análise estratégica",
      activities: [
        "Market research profundo",
        "Competitor analysis avançado",
        "User persona development",
        "Conversion audit completo"
      ],
      color: "from-blue-500 to-cyan-500",
      icon: "🔍"
    },
    {
      number: 2,
      title: "Strategy Architecture",
      duration: "1-2 dias",
      description: "Arquitetura estratégica de conversão",
      activities: [
        "Conversion funnel design",
        "User journey mapping",
        "Content strategy blueprint",
        "Technical requirements"
      ],
      color: "from-purple-500 to-pink-500",
      icon: "🏗️"
    },
    {
      number: 3,
      title: "Experience Design",
      duration: "4-6 dias",
      description: "Design centrado na experiência do usuário",
      activities: [
        "Wireframing interativo",
        "UI/UX prototyping",
        "A/B testing scenarios",
        "Accessibility planning"
      ],
      color: "from-green-500 to-teal-500",
      icon: "🎨"
    },
    {
      number: 4,
      title: "Code Craftsmanship",
      duration: "6-10 dias",
      description: "Desenvolvimento com excelência técnica",
      activities: [
        "Performance-first development",
        "Mobile-responsive coding",
        "SEO implementation",
        "Security hardening"
      ],
      color: "from-orange-500 to-red-500",
      icon: "⚡"
    },
    {
      number: 5,
      title: "Quality Assurance",
      duration: "2-3 dias",
      description: "Garantia de qualidade total",
      activities: [
        "Cross-browser testing",
        "Performance optimization",
        "Conversion tracking setup",
        "User acceptance testing"
      ],
      color: "from-indigo-500 to-purple-500",
      icon: "✅"
    },
    {
      number: 6,
      title: "Launch Orchestration",
      duration: "1 dia",
      description: "Lançamento orquestrado e monitorado",
      activities: [
        "Deployment automation",
        "DNS configuration",
        "SSL setup",
        "Analytics activation"
      ],
      color: "from-yellow-500 to-orange-500",
      icon: "🚀"
    },
    {
      number: 7,
      title: "Growth Optimization",
      duration: "ongoing",
      description: "Otimização contínua para crescimento",
      activities: [
        "Performance monitoring",
        "A/B testing execution",
        "Conversion optimization",
        "Monthly reporting"
      ],
      color: "from-pink-500 to-rose-500",
      icon: "📈"
    }
  ];

  return (
    <section className="py-20 bg-workflow-deep">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            The <span className="text-workflow-zen">Lab</span>
          </h2>
          <p className="text-xl text-workflow-zen/80 mb-8">
            Metodologia Workflow: 7 fases científicas para o sucesso
          </p>
          <div className="text-workflow-zen/60">
            Processo comprovado em mais de 150 projetos de alta conversão
          </div>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-workflow-zen/20 hidden lg:block"></div>

          {phases.map((phase, index) => (
            <div
              key={phase.number}
              className={`relative mb-16 lg:mb-20 animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`lg:flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8`}>
                {/* Phase Content */}
                <div className="lg:w-1/2">
                  <div className="card-workflow bg-white/10 backdrop-blur-lg border-workflow-zen/20">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                          {phase.number}
                        </div>
                        <div>
                          <h3 className="text-xl font-display font-bold text-white">
                            {phase.title}
                          </h3>
                          <div className="text-workflow-zen/70">{phase.duration}</div>
                        </div>
                      </div>

                      <p className="text-workflow-zen/80 mb-6">
                        {phase.description}
                      </p>

                      <div className="space-y-2">
                        {phase.activities.map((activity, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-workflow-zen rounded-full"></div>
                            <span className="text-white/90 text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase Icon */}
                <div className="lg:w-1/2 flex justify-center mb-6 lg:mb-0">
                  <div className={`w-32 h-32 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center text-6xl text-white shadow-workflow-lg animate-float`}>
                    {phase.icon}
                  </div>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 top-16 transform -translate-x-1/2 w-4 h-4 bg-workflow-zen rounded-full border-4 border-workflow-deep hidden lg:block"></div>
            </div>
          ))}
        </div>

        {/* Process Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-zen mb-2">7</div>
            <div className="text-white/70">Fases Científicas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-zen mb-2">150+</div>
            <div className="text-white/70">Projetos Executados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-zen mb-2">98%</div>
            <div className="text-white/70">Taxa de Sucesso</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-zen mb-2">15</div>
            <div className="text-white/70">Dias Médios</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologyLab;
