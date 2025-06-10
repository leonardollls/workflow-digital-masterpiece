
const CapabilityMatrix = () => {
  const capabilities = [
    {
      category: "Frontend Mastery",
      technologies: [
        { name: "React 18+", level: 95, icon: "⚛️" },
        { name: "Next.js 14+", level: 92, icon: "▲" },
        { name: "TypeScript", level: 98, icon: "🔷" },
        { name: "Vue 3", level: 88, icon: "💚" },
        { name: "Angular 17+", level: 85, icon: "🅰️" },
        { name: "Svelte", level: 90, icon: "🧡" }
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Backend Excellence",
      technologies: [
        { name: "Node.js", level: 96, icon: "🟢" },
        { name: "Python", level: 94, icon: "🐍" },
        { name: "Go", level: 87, icon: "🔵" },
        { name: "GraphQL", level: 91, icon: "💜" },
        { name: "REST APIs", level: 98, icon: "🔗" },
        { name: "Microservices", level: 89, icon: "🔧" }
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      category: "Cloud & DevOps",
      technologies: [
        { name: "AWS", level: 93, icon: "☁️" },
        { name: "Docker", level: 95, icon: "🐳" },
        { name: "Kubernetes", level: 88, icon: "⚓" },
        { name: "CI/CD", level: 96, icon: "🔄" },
        { name: "Terraform", level: 85, icon: "🏗️" },
        { name: "Monitoring", level: 92, icon: "📊" }
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Design & Creative",
      technologies: [
        { name: "Figma", level: 98, icon: "🎨" },
        { name: "Adobe Suite", level: 94, icon: "🔸" },
        { name: "Blender", level: 86, icon: "🎭" },
        { name: "After Effects", level: 91, icon: "🎬" },
        { name: "Principle", level: 89, icon: "⚡" },
        { name: "ProtoPie", level: 87, icon: "🥧" }
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-workflow-deep mb-4">
            Capability <span className="text-gradient">Matrix</span>
          </h2>
          <p className="text-xl text-workflow-deep/70 mb-8">
            Arsenal tecnológico de última geração para projetos excepcionais
          </p>
          <div className="text-workflow-deep/60">
            Dominamos as melhores tecnologias do mercado para entregar resultados superiores
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {capabilities.map((capability, categoryIndex) => (
            <div
              key={categoryIndex}
              className="animate-fade-in"
              style={{ animationDelay: `${categoryIndex * 0.2}s` }}
            >
              <div className="card-workflow">
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${capability.color} p-6 rounded-t-2xl`}>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {capability.category}
                  </h3>
                </div>

                {/* Technologies */}
                <div className="p-6">
                  <div className="space-y-4">
                    {capability.technologies.map((tech, techIndex) => (
                      <div 
                        key={techIndex}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-workflow-glow/50 transition-colors duration-300"
                      >
                        <div className="text-2xl">{tech.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-workflow-deep">
                              {tech.name}
                            </span>
                            <span className="text-workflow-energy font-bold">
                              {tech.level}%
                            </span>
                          </div>
                          <div className="w-full bg-workflow-glow rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${capability.color} h-full rounded-full transition-all duration-1000 ease-out`}
                              style={{ 
                                width: `${tech.level}%`,
                                animationDelay: `${(categoryIndex * 6 + techIndex) * 0.1}s`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-energy mb-2">24+</div>
            <div className="text-workflow-deep/70">Tecnologias Dominadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-energy mb-2">93%</div>
            <div className="text-workflow-deep/70">Proficiência Média</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-energy mb-2">150+</div>
            <div className="text-workflow-deep/70">Projetos Implementados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-workflow-energy mb-2">24/7</div>
            <div className="text-workflow-deep/70">Suporte Técnico</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilityMatrix;
