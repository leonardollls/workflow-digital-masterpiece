
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  metrics: {
    conversionIncrease: number;
    revenueGenerated: number;
    timeToLaunch: number;
    clientSatisfaction: number;
  };
  techStack: string[];
  image: string;
  color: string;
}

const PortfolioGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');

  const projects: Project[] = [
    {
      id: 1,
      title: "FinTech Revolution",
      category: "fintech",
      description: "Banco digital B2B que transformou o setor financeiro",
      metrics: {
        conversionIncrease: 890,
        revenueGenerated: 12000000,
        timeToLaunch: 14,
        clientSatisfaction: 98
      },
      techStack: ["React", "Node.js", "WebGL"],
      image: "🏦",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "EcoCommerce Empire",
      category: "ecommerce",
      description: "Marketplace sustentável com 2.3M visitantes/mês",
      metrics: {
        conversionIncrease: 234,
        revenueGenerated: 8500000,
        timeToLaunch: 21,
        clientSatisfaction: 95
      },
      techStack: ["Next.js", "Shopify Plus"],
      image: "🌱",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "SaaS Unicorn Launch",
      category: "saas",
      description: "Platform B2B SaaS que atingiu $2.5M Series A",
      metrics: {
        conversionIncrease: 445,
        revenueGenerated: 15000000,
        timeToLaunch: 28,
        clientSatisfaction: 97
      },
      techStack: ["Vue.js", "Python", "AI"],
      image: "🚀",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "HealthTech Innovation",
      category: "healthcare",
      description: "Telemedicina premium com 150k consultas/mês",
      metrics: {
        conversionIncrease: 312,
        revenueGenerated: 6800000,
        timeToLaunch: 35,
        clientSatisfaction: 96
      },
      techStack: ["React Native", "WebRTC"],
      image: "💊",
      color: "from-red-500 to-orange-500"
    },
    {
      id: 5,
      title: "EdTech Revolution",
      category: "education",
      description: "Plataforma educacional com 500k alunos ativos",
      metrics: {
        conversionIncrease: 278,
        revenueGenerated: 4200000,
        timeToLaunch: 42,
        clientSatisfaction: 94
      },
      techStack: ["Angular", "MongoDB"],
      image: "🎓",
      color: "from-indigo-500 to-blue-500"
    },
    {
      id: 6,
      title: "PropTech Luxury",
      category: "realestate",
      description: "Real estate premium com R$ 87M negociados",
      metrics: {
        conversionIncrease: 567,
        revenueGenerated: 87000000,
        timeToLaunch: 18,
        clientSatisfaction: 99
      },
      techStack: ["Gatsby", "Strapi CMS"],
      image: "🏠",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: projects.length },
    { id: 'fintech', name: 'FinTech', count: projects.filter(p => p.category === 'fintech').length },
    { id: 'ecommerce', name: 'E-commerce', count: projects.filter(p => p.category === 'ecommerce').length },
    { id: 'saas', name: 'SaaS', count: projects.filter(p => p.category === 'saas').length },
    { id: 'healthcare', name: 'HealthTech', count: projects.filter(p => p.category === 'healthcare').length },
    { id: 'education', name: 'EdTech', count: projects.filter(p => p.category === 'education').length },
    { id: 'realestate', name: 'PropTech', count: projects.filter(p => p.category === 'realestate').length },
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-workflow-deep mb-4">
            The <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-xl text-workflow-deep/70 mb-8">
            Experiência museu digital dos nossos cases premiados
          </p>

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'outline'}
              onClick={() => setViewMode('gallery')}
              className="btn-secondary"
            >
              🎭 Gallery
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className="btn-secondary"
            >
              📋 List
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-workflow-energy text-white shadow-workflow'
                  : 'bg-workflow-glow text-workflow-deep hover:bg-workflow-zen/20'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'gallery' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="card-project group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Preview */}
              <div className={`relative h-48 bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden`}>
                <div className="text-6xl animate-float">{project.image}</div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button className="btn-primary">
                    Ver Case Completo
                  </Button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-workflow-energy bg-workflow-glow px-3 py-1 rounded-full">
                    {categories.find(c => c.id === project.category)?.name}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-workflow-deep mb-2">
                  {project.title}
                </h3>
                <p className="text-workflow-deep/70 mb-4">
                  {project.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      +{project.metrics.conversionIncrease}%
                    </div>
                    <div className="text-xs text-workflow-deep/60">Conversão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-workflow-energy">
                      {formatCurrency(project.metrics.revenueGenerated)}
                    </div>
                    <div className="text-xs text-workflow-deep/60">Revenue</div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-workflow-deep text-white px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Timeline */}
                <div className="flex items-center justify-between text-sm text-workflow-deep/60">
                  <span>🚀 {project.metrics.timeToLaunch} dias</span>
                  <span>😊 {project.metrics.clientSatisfaction}% satisfação</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="btn-primary">
            Carregar Mais Projetos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;
