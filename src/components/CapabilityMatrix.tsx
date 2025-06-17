import { useState, useRef, useEffect, useMemo } from 'react';

const CapabilityMatrix = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
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

  // Removido para melhor performance mobile

  const capabilities = [
    {
      category: "Frontend Excellence",
      description: "Interfaces modernas e performáticas que convertem",
      technologies: [
        { name: "React 18+", level: 98, icon: "⚛️", description: "Hooks avançados, Suspense, Concurrent Features e Server Components" },
        { name: "Next.js 14+", level: 96, icon: "▲", description: "App Router, SSR/SSG, API Routes e otimizações automáticas" },
        { name: "TypeScript", level: 97, icon: "🔷", description: "Tipagem robusta, generics e utility types para código maintível" },
        { name: "Tailwind CSS", level: 98, icon: "🎨", description: "Design systems completos e componentes reutilizáveis" },
        { name: "Framer Motion", level: 92, icon: "🌀", description: "Animações fluidas, gestures e layout animations" },
        { name: "Shadcn/ui", level: 95, icon: "🧩", description: "Componentes acessíveis e customizáveis com Radix UI" }
      ],
      color: "from-blue-500 via-indigo-500 to-purple-500",
      accentColor: "blue",
      icon: "💻"
    },
    {
      category: "Backend & Database",
      description: "APIs escaláveis e arquiteturas robustas",
      technologies: [
        { name: "Node.js", level: 96, icon: "🟢", description: "Express, Fastify e aplicações server-side de alta performance" },
        { name: "Python", level: 94, icon: "🐍", description: "FastAPI, Django e Flask para APIs modernas" },
        { name: "PostgreSQL", level: 95, icon: "🐘", description: "Queries otimizadas, relacionamentos complexos e performance" },
        { name: "Prisma", level: 93, icon: "🔷", description: "ORM type-safe com migrations automáticas e schema modeling" },
        { name: "Supabase", level: 91, icon: "⚡", description: "Backend completo com auth, database e realtime" },
        { name: "GraphQL", level: 89, icon: "💜", description: "APIs flexíveis com Apollo Server e schema stitching" }
      ],
      color: "from-green-500 via-emerald-500 to-teal-500",
      accentColor: "green",
      icon: "⚙️"
    },
    {
      category: "State & Forms",
      description: "Gerenciamento de estado e formulários robustos",
      technologies: [
        { name: "Zustand", level: 94, icon: "🐻", description: "State management simples e performático para React" },
        { name: "React Hook Form", level: 96, icon: "📝", description: "Formulários performáticos com validação em tempo real" },
        { name: "Zod", level: 92, icon: "🛡️", description: "Validação type-safe e schema validation robusta" },
        { name: "TanStack Query", level: 90, icon: "🔄", description: "Data fetching, cache e sincronização avançada" },
        { name: "React Context", level: 95, icon: "🔗", description: "State global nativo com patterns otimizados" },
        { name: "Redux Toolkit", level: 87, icon: "🏪", description: "State management para aplicações complexas" }
      ],
      color: "from-purple-500 via-pink-500 to-rose-500",
      accentColor: "purple",
      icon: "🧠"
    },
    {
      category: "Integrations & Deploy",
      description: "Integrações modernas e deploy automatizado",
      technologies: [
        { name: "Vercel", level: 98, icon: "▲", description: "Deploy automático com edge computing e analytics" },
        { name: "Stripe", level: 93, icon: "💳", description: "Pagamentos seguros e checkout customizado" },
        { name: "NextAuth.js", level: 91, icon: "🔐", description: "Autenticação completa com múltiplos providers" },
        { name: "Resend", level: 89, icon: "📧", description: "API de emails transacionais moderna e confiável" },
        { name: "Uploadthing", level: 87, icon: "📤", description: "Upload de arquivos type-safe para Next.js" },
        { name: "GitHub Actions", level: 94, icon: "🚀", description: "CI/CD automatizado com pipelines customizados" }
      ],
      color: "from-orange-500 via-amber-500 to-yellow-500",
      accentColor: "orange",
      icon: "🔌"
    }
  ];

  const averageProficiency = Math.round(
    capabilities.reduce((total, cat) => 
      total + cat.technologies.reduce((sum, tech) => sum + tech.level, 0) / cat.technologies.length, 0
    ) / capabilities.length
  );

  const totalTechnologies = capabilities.reduce((total, cat) => total + cat.technologies.length, 0);

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      id="capability-matrix"
    >
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-workflow-zen/5 via-transparent to-workflow-accent/5" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 sm:mb-20 md:mb-24 px-4 sm:px-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            <div className="w-8 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
            <span className="text-workflow-zen font-mono text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-medium">
              Arsenal Tecnológico
            </span>
            <div className="w-8 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-workflow-deep mb-6 sm:mb-8 md:mb-10 leading-tight">
            Capability{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-workflow-zen via-workflow-accent to-workflow-energy bg-clip-text text-transparent">
                Matrix
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-workflow-zen/0 via-workflow-zen/60 to-workflow-zen/0 rounded-full" />
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-workflow-deep/80 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed">
            Dominamos{' '}
            <span className="text-workflow-energy font-semibold">até 100% das principais tecnologias do mercado</span>
            {' '}para criar suas landing pages perfeitas
          </p>
          
          <div className="flex items-center justify-center gap-4 md:gap-6 text-sm sm:text-base md:text-lg text-workflow-deep/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-workflow-zen rounded-full" />
              <span>Foco em resultados comprovados</span>
            </div>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-0">
          {capabilities.map((capability, categoryIndex) => (
            <div
              key={categoryIndex}
              className={`relative transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              onMouseEnter={() => setActiveCategory(categoryIndex)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div className="relative group h-full">
                {/* Simple Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${capability.color} rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Main Card */}
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 h-full">
                  
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${capability.color} p-4 sm:p-6 lg:p-8 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div className="text-3xl sm:text-4xl filter drop-shadow-lg">{capability.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-2xl lg:text-3xl font-display font-bold text-white">
                            {capability.category}
                          </h3>
                        </div>
                      </div>
                      <p className="text-white/90 text-xs sm:text-sm lg:text-base leading-relaxed">
                        {capability.description}
                      </p>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="space-y-3 sm:space-y-4">
                      {capability.technologies.map((tech, techIndex) => (
                        <div 
                          key={techIndex}
                          className="group/tech relative p-3 sm:p-4 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredTech(`${categoryIndex}-${techIndex}`)}
                          onMouseLeave={() => setHoveredTech(null)}
                        >
                          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-xl shadow-lg group-hover/tech:scale-105 transition-transform duration-200">
                              <span className="text-lg sm:text-xl">{tech.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-workflow-deep text-sm sm:text-lg group-hover/tech:text-workflow-zen transition-colors duration-300 truncate">
                                  {tech.name}
                                </span>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className={`text-lg sm:text-2xl font-bold bg-gradient-to-r ${capability.color} bg-clip-text text-transparent`}>
                                    {tech.level}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-2 sm:mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                              <div
                                className={`bg-gradient-to-r ${capability.color} h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
                                style={{ 
                                  width: `${tech.level}%`
                                }}
                              >
                                <div className="absolute inset-0 bg-white/20" />
                              </div>
                            </div>
                          </div>

                          {/* Tech Description */}
                          {hoveredTech === `${categoryIndex}-${techIndex}` && (
                            <div className="transition-opacity duration-300">
                              <p className="text-workflow-deep/70 text-xs sm:text-sm leading-relaxed">
                                {tech.description}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats Summary */}
        <div className={`mt-20 sm:mt-24 px-4 sm:px-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/10 via-workflow-accent/10 to-workflow-energy/10 rounded-3xl blur-xl" />
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-workflow-zen mb-2 sm:mb-4">
                    {totalTechnologies}
                  </div>
                  <div className="text-workflow-deep/80 font-medium text-xs sm:text-sm lg:text-base">Tecnologias Dominadas</div>
                  <div className="w-8 sm:w-12 h-0.5 bg-workflow-zen/50 mx-auto mt-2 sm:mt-3 group-hover:bg-workflow-zen transition-colors duration-300" />
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-workflow-energy mb-2 sm:mb-4">
                    100%
                  </div>
                  <div className="text-workflow-deep/80 font-medium text-xs sm:text-sm lg:text-base">Implementação Garantida</div>
                  <div className="w-8 sm:w-12 h-0.5 bg-workflow-energy/50 mx-auto mt-2 sm:mt-3 group-hover:bg-workflow-energy transition-colors duration-300" />
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-workflow-accent mb-2 sm:mb-4">
                    150+
                  </div>
                  <div className="text-workflow-deep/80 font-medium text-xs sm:text-sm lg:text-base">Projetos Criados</div>
                  <div className="w-8 sm:w-12 h-0.5 bg-workflow-accent/50 mx-auto mt-2 sm:mt-3 group-hover:bg-workflow-accent transition-colors duration-300" />
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-green-500 mb-2 sm:mb-4">
                    0
                  </div>
                  <div className="text-workflow-deep/80 font-medium text-xs sm:text-sm lg:text-base">Limitações Técnicas</div>
                  <div className="w-8 sm:w-12 h-0.5 bg-green-500/50 mx-auto mt-2 sm:mt-3 group-hover:bg-green-500 transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`mt-12 sm:mt-16 text-center px-4 sm:px-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-workflow-zen to-workflow-accent rounded-full text-white font-semibold hover:scale-105 transition-transform duration-200 cursor-pointer shadow-lg hover:shadow-xl">
              <span className="text-sm sm:text-base">Pronto para criarmos sua landing page perfeita?</span>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilityMatrix;
