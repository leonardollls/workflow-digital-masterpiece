
import { Button } from '@/components/ui/button';

const ResourceVault = () => {
  const resources = [
    {
      id: 1,
      title: "Conversion Audit Checklist",
      description: "127 pontos críticos para otimização de conversão",
      type: "Checklist",
      value: "R$ 497",
      icon: "📋",
      downloadCount: "2.3k",
      rating: 4.9,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Psychology-Based Color Guide",
      description: "64 páginas sobre psicologia das cores em UX/UI",
      type: "E-book",
      value: "R$ 297",
      icon: "🎨",
      downloadCount: "1.8k",
      rating: 4.8,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Typography Hierarchy Masterclass",
      description: "Vídeo de 45min sobre hierarquia tipográfica",
      type: "Video",
      value: "R$ 397",
      icon: "🎬",
      downloadCount: "1.5k",
      rating: 4.9,
      color: "from-red-500 to-orange-500"
    },
    {
      id: 4,
      title: "Mobile-First Design System",
      description: "Template completo no Figma para projetos mobile",
      type: "Template",
      value: "R$ 697",
      icon: "📱",
      downloadCount: "987",
      rating: 5.0,
      color: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      title: "Performance Optimization Playbook",
      description: "89 técnicas avançadas de otimização de performance",
      type: "Playbook",
      value: "R$ 597",
      icon: "⚡",
      downloadCount: "1.2k",
      rating: 4.8,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: 6,
      title: "A/B Testing Calculator",
      description: "Tool interativo para cálculos estatísticos de testes",
      type: "Tool",
      value: "R$ 397",
      icon: "🧮",
      downloadCount: "756",
      rating: 4.7,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const totalValue = resources.reduce((sum, resource) => {
    return sum + parseInt(resource.value.replace('R$ ', ''));
  }, 0);

  return (
    <section className="py-20 bg-workflow-glow">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-workflow-deep mb-4">
            The <span className="text-gradient">Vault</span>
          </h2>
          <p className="text-xl text-workflow-deep/70 mb-8">
            Recursos premium gratuitos que valem mais de R$ {totalValue.toLocaleString('pt-BR')}
          </p>
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/20 rounded-full px-6 py-3">
            <span className="w-3 h-3 bg-success rounded-full animate-glow"></span>
            <span className="text-success font-semibold">100% Gratuito • Sem Pegadinhas</span>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, index) => (
            <div
              key={resource.id}
              className="card-workflow group hover:shadow-workflow-lg transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Resource Header */}
              <div className={`bg-gradient-to-r ${resource.color} p-6 rounded-t-2xl relative overflow-hidden`}>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-bold text-workflow-deep">{resource.type}</span>
                </div>
                <div className="text-6xl mb-4">{resource.icon}</div>
                <div className="text-white font-bold text-lg line-through opacity-75">
                  {resource.value}
                </div>
                <div className="text-white/90 text-sm">Valor de mercado</div>
              </div>

              {/* Resource Content */}
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-workflow-deep mb-3">
                  {resource.title}
                </h3>
                <p className="text-workflow-deep/70 mb-4 text-sm">
                  {resource.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold text-workflow-deep">{resource.rating}</span>
                  </div>
                  <div className="text-workflow-deep/60">
                    {resource.downloadCount} downloads
                  </div>
                </div>

                {/* CTA */}
                <Button className="w-full btn-primary group-hover:scale-105 transition-transform duration-300">
                  <span className="flex items-center justify-center gap-2">
                    📥 Download Gratuito
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-workflow bg-workflow-deep text-white">
            <div className="p-8 md:p-12">
              <div className="text-6xl mb-6">🎁</div>
              <h3 className="text-3xl font-display font-bold mb-4">
                Valor Total: <span className="text-workflow-zen">R$ {totalValue.toLocaleString('pt-BR')}</span>
              </h3>
              <p className="text-xl text-workflow-zen/80 mb-8">
                Nosso presente para você: conhecimento que transformou centenas de negócios
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-2xl font-bold text-workflow-zen mb-2">12</div>
                  <div className="text-white/70">Recursos Premium</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen mb-2">8.7k+</div>
                  <div className="text-white/70">Downloads Totais</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen mb-2">4.8★</div>
                  <div className="text-white/70">Rating Médio</div>
                </div>
              </div>

              <Button className="btn-secondary bg-white text-workflow-deep hover:bg-workflow-zen/20">
                🚀 Baixar Tudo Agora (Grátis)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceVault;
