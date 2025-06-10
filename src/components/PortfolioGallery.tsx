import { useState, useRef, useEffect } from 'react';
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
  featured?: boolean;
}

const PortfolioGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'gallery' | 'showcase'>('gallery');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: "FinTech Revolution",
      category: "fintech",
      description: "Banco digital B2B que transformou o setor financeiro com tecnologia de ponta",
      metrics: {
        conversionIncrease: 890,
        revenueGenerated: 12000000,
        timeToLaunch: 14,
        clientSatisfaction: 98
      },
      techStack: ["React", "Node.js", "WebGL", "AI"],
      image: "🏦",
      color: "from-blue-500 via-cyan-500 to-teal-500",
      featured: true
    },
    {
      id: 2,
      title: "EcoCommerce Empire",
      category: "ecommerce",
      description: "Marketplace sustentável com 2.3M visitantes/mês e crescimento exponencial",
      metrics: {
        conversionIncrease: 234,
        revenueGenerated: 8500000,
        timeToLaunch: 21,
        clientSatisfaction: 95
      },
      techStack: ["Next.js", "Shopify Plus", "AR"],
      image: "🌱",
      color: "from-green-500 via-emerald-500 to-teal-500"
    },
    {
      id: 3,
      title: "SaaS Unicorn Launch",
      category: "saas",
      description: "Platform B2B SaaS que atingiu $2.5M Series A em tempo recorde",
      metrics: {
        conversionIncrease: 445,
        revenueGenerated: 15000000,
        timeToLaunch: 28,
        clientSatisfaction: 97
      },
      techStack: ["Vue.js", "Python", "AI", "ML"],
      image: "🚀",
      color: "from-purple-500 via-pink-500 to-rose-500",
      featured: true
    },
    {
      id: 4,
      title: "HealthTech Innovation",
      category: "healthcare",
      description: "Telemedicina premium com 150k consultas/mês e aprovação médica",
      metrics: {
        conversionIncrease: 312,
        revenueGenerated: 6800000,
        timeToLaunch: 35,
        clientSatisfaction: 96
      },
      techStack: ["React Native", "WebRTC", "AI"],
      image: "💊",
      color: "from-red-500 via-orange-500 to-yellow-500"
    },
    {
      id: 5,
      title: "EdTech Revolution",
      category: "education",
      description: "Plataforma educacional com 500k alunos ativos e metodologia inovadora",
      metrics: {
        conversionIncrease: 278,
        revenueGenerated: 4200000,
        timeToLaunch: 42,
        clientSatisfaction: 94
      },
      techStack: ["Angular", "MongoDB", "VR"],
      image: "🎓",
      color: "from-indigo-500 via-blue-500 to-cyan-500"
    },
    {
      id: 6,
      title: "PropTech Luxury",
      category: "realestate",
      description: "Real estate premium com R$ 87M negociados e experiência imersiva",
      metrics: {
        conversionIncrease: 567,
        revenueGenerated: 87000000,
        timeToLaunch: 18,
        clientSatisfaction: 99
      },
      techStack: ["Gatsby", "Strapi CMS", "3D"],
      image: "🏠",
      color: "from-yellow-500 via-amber-500 to-orange-500",
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: projects.length, icon: '🎯' },
    { id: 'fintech', name: 'FinTech', count: projects.filter(p => p.category === 'fintech').length, icon: '💳' },
    { id: 'ecommerce', name: 'E-commerce', count: projects.filter(p => p.category === 'ecommerce').length, icon: '🛒' },
    { id: 'saas', name: 'SaaS', count: projects.filter(p => p.category === 'saas').length, icon: '💻' },
    { id: 'healthcare', name: 'HealthTech', count: projects.filter(p => p.category === 'healthcare').length, icon: '🏥' },
    { id: 'education', name: 'EdTech', count: projects.filter(p => p.category === 'education').length, icon: '📚' },
    { id: 'realestate', name: 'PropTech', count: projects.filter(p => p.category === 'realestate').length, icon: '🏢' },
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

  const formatMetric = (value: number, type: 'percentage' | 'days' | 'currency') => {
    switch (type) {
      case 'percentage':
        return `+${value}%`;
      case 'days':
        return `${value} dias`;
      case 'currency':
        return formatCurrency(value);
      default:
        return value.toString();
    }
  };

  return (
    <section 
      ref={galleryRef}
      id="portfolio" 
      className="section-padding bg-gradient-to-br from-workflow-50 via-white to-workflow-100 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-noise opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-primary rounded-full" />
            <span className="text-workflow-energy font-mono text-sm tracking-wider uppercase">Portfolio</span>
            <div className="w-12 h-0.5 bg-gradient-primary rounded-full" />
          </div>
          
          <h2 className="text-responsive-3xl font-display font-bold text-workflow-deep mb-6">
            The <span className="text-gradient">Gallery</span>
          </h2>
          
          <p className="text-responsive-lg text-workflow-deep/70 mb-8 max-w-3xl mx-auto">
            Experiência museu digital dos nossos cases premiados. Cada projeto é uma obra de arte 
            digital que transforma negócios e gera resultados extraordinários.
          </p>

          {/* Enhanced View Mode Toggle */}
          <div className="flex justify-center gap-3 mb-12">
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'outline'}
              onClick={() => setViewMode('gallery')}
              className={`btn-magnetic px-6 py-3 rounded-xl transition-all duration-300 ${
                viewMode === 'gallery' 
                  ? 'btn-primary' 
                  : 'btn-secondary border-workflow-energy/30 hover:border-workflow-energy'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🎭</span>
                <span>Gallery View</span>
              </span>
            </Button>
            <Button
              variant={viewMode === 'showcase' ? 'default' : 'outline'}
              onClick={() => setViewMode('showcase')}
              className={`btn-magnetic px-6 py-3 rounded-xl transition-all duration-300 ${
                viewMode === 'showcase' 
                  ? 'btn-primary' 
                  : 'btn-secondary border-workflow-energy/30 hover:border-workflow-energy'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📋</span>
                <span>Showcase View</span>
              </span>
            </Button>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden ${
                selectedCategory === category.id
                  ? 'bg-workflow-energy text-white shadow-workflow'
                  : 'bg-white/80 backdrop-blur-sm text-workflow-deep border-2 border-workflow-energy/20 hover:border-workflow-energy hover:bg-workflow-energy/5'
              }`}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
              <span>{category.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-workflow-energy/10 text-workflow-energy'
              }`}>
                {category.count}
              </span>
              {selectedCategory !== category.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-workflow-energy/10 to-workflow-zen/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Enhanced Projects Grid */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {viewMode === 'gallery' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`group relative card-floating transition-all duration-500 ${
                    project.featured ? 'lg:col-span-2' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="card-glass p-0 rounded-3xl overflow-hidden h-full">
                    {/* Project Header */}
                    <div className={`relative p-8 bg-gradient-to-br ${project.color} text-white overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                            {project.image}
                          </div>
                          {project.featured && (
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                              FEATURED
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-white/90 text-sm">{project.description}</p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-workflow-energy/5 rounded-2xl">
                          <div className="text-2xl font-bold text-workflow-energy mb-1">
                            {formatMetric(project.metrics.conversionIncrease, 'percentage')}
                          </div>
                          <div className="text-xs text-workflow-deep/60 font-medium">Conversão</div>
                        </div>
                        <div className="text-center p-4 bg-success-50 rounded-2xl">
                          <div className="text-2xl font-bold text-success-600 mb-1">
                            {project.metrics.clientSatisfaction}%
                          </div>
                          <div className="text-xs text-workflow-deep/60 font-medium">Satisfação</div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-workflow-deep/60">Revenue Generated</span>
                          <span className="font-bold text-workflow-deep">
                            {formatCurrency(project.metrics.revenueGenerated)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-workflow-deep/60">Time to Launch</span>
                          <span className="font-bold text-workflow-deep">
                            {formatMetric(project.metrics.timeToLaunch, 'days')}
                          </span>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div className="mb-6">
                        <div className="text-sm text-workflow-deep/60 mb-3 font-medium">Tech Stack</div>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-workflow-energy/10 text-workflow-energy rounded-full text-xs font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <Button className="w-full btn-secondary group">
                        <span className="flex items-center justify-center gap-2">
                          <span>Ver Case Completo</span>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </span>
                      </Button>
                    </div>

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Showcase View */
            <div className="space-y-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="group card-glass p-8 rounded-3xl hover:shadow-workflow-lg transition-all duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    {/* Project Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">{project.image}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-workflow-deep mb-1">{project.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-workflow-energy/10 text-workflow-energy rounded-full text-xs font-bold uppercase">
                              {project.category}
                            </span>
                            {project.featured && (
                              <span className="px-3 py-1 bg-gradient-primary text-white rounded-full text-xs font-bold">
                                FEATURED
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-workflow-deep/70 mb-6">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-workflow-energy/10 text-workflow-energy rounded-full text-sm font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-workflow-energy/5 rounded-2xl">
                        <div className="text-3xl font-bold text-workflow-energy mb-1">
                          {formatMetric(project.metrics.conversionIncrease, 'percentage')}
                        </div>
                        <div className="text-sm text-workflow-deep/60 font-medium">Conversão</div>
                      </div>
                      <div className="text-center p-4 bg-success-50 rounded-2xl">
                        <div className="text-3xl font-bold text-success-600 mb-1">
                          {project.metrics.clientSatisfaction}%
                        </div>
                        <div className="text-sm text-workflow-deep/60 font-medium">Satisfação</div>
                      </div>
                      <div className="col-span-2 text-center p-4 bg-gradient-to-r from-workflow-energy/5 to-workflow-zen/5 rounded-2xl">
                        <div className="text-2xl font-bold text-workflow-deep mb-1">
                          {formatCurrency(project.metrics.revenueGenerated)}
                        </div>
                        <div className="text-sm text-workflow-deep/60 font-medium">Revenue Generated</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced CTA Section */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-600 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="card-glass p-12 rounded-3xl bg-gradient-to-br from-workflow-energy/5 via-white/50 to-workflow-zen/5">
            <h3 className="text-3xl font-bold text-workflow-deep mb-4">
              Pronto para criar o próximo <span className="text-gradient">case de sucesso</span>?
            </h3>
            <p className="text-workflow-deep/70 mb-8 max-w-2xl mx-auto">
              Transforme sua ideia em uma máquina de conversão que gera resultados extraordinários.
              Vamos construir juntos o futuro do seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-primary btn-magnetic"
                onClick={() => document.getElementById('cta-accelerator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-2">
                  <span>Iniciar Meu Projeto</span>
                  <span>🚀</span>
                </span>
              </Button>
              <Button className="btn-secondary btn-magnetic">
                <span className="flex items-center gap-2">
                  <span>Agendar Consultoria</span>
                  <span>📞</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;
