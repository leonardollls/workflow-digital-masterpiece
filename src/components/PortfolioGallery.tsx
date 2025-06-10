import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link?: string;
}

const PortfolioGallery = () => {
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
      description: "Interface moderna para banco digital com foco em conversão e experiência premium",
      image: "/Images/ee1872227308933.683debf336d7e.webp",
      category: "fintech"
    },
    {
      id: 2,
      title: "E-commerce Premium",
      description: "Loja virtual de luxo com design imersivo e jornada de compra otimizada",
      image: "/Images/a07726227325915.683e384f30c96.webp",
      category: "ecommerce"
    },
    {
      id: 3,
      title: "SaaS Platform",
      description: "Dashboard intuitiva para plataforma SaaS B2B com métricas em tempo real",
      image: "/Images/6355c2227386813.683f241d5b2f9.webp",
      category: "saas"
    },
    {
      id: 4,
      title: "HealthTech App",
      description: "Aplicativo de telemedicina com interface clean e foco na usabilidade",
      image: "/Images/d1f278227408887.683f856b97a03.webp",
      category: "healthtech"
    },
    {
      id: 5,
      title: "EdTech Platform",
      description: "Plataforma educacional moderna com gamificação e aprendizado adaptativo",
      image: "/Images/4683bc227571641.684237771bde1.webp",
      category: "edtech"
    },
    {
      id: 6,
      title: "Real Estate Luxury",
      description: "Portal imobiliário premium com tour virtual 3D e experiência imersiva",
      image: "/Images/d45ff7227834569.6848166f2acfe.webp",
      category: "realestate"
    },
    {
      id: 7,
      title: "Crypto Exchange",
      description: "Exchange de criptomoedas com design futurista e trading avançado",
      image: "/Images/e953da227530013.6841891c2230b.webp",
      category: "crypto"
    },
    {
      id: 8,
      title: "Food Delivery",
      description: "App de delivery premium com interface gastronômica e UX excepcional",
      image: "/Images/14f8a8227635329.68437fc4b7069.webp",
      category: "food"
    },
    {
      id: 9,
      title: "Fashion E-commerce",
      description: "Loja virtual de moda com AR try-on e experiência shopping personalizada",
      image: "/Images/9ffefc227662493.68444f2354b35 (1).webp",
      category: "fashion"
    }
  ];

  return (
    <section 
      ref={galleryRef}
      id="portfolio" 
      className="section-padding bg-gradient-to-br from-workflow-50 via-white to-workflow-100 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 animate-gradient-shift" />
        <div className="absolute inset-0 bg-noise opacity-10" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-workflow-energy to-workflow-zen rounded-full" />
            <span className="text-workflow-energy font-mono text-sm tracking-wider uppercase">Portfolio</span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-workflow-energy to-workflow-zen rounded-full" />
          </div>
          
          <h2 className="text-responsive-3xl font-display font-bold text-workflow-deep mb-6">
            Nossas <span className="text-gradient">Criações</span>
          </h2>
          
          <p className="text-responsive-lg text-workflow-deep/70 mb-8 max-w-3xl mx-auto">
            Veja alguns de nossas criações mais recentes. Cada projeto é uma obra de arte 
            digital que transforma negócios e gera resultados extraordinários.
          </p>
        </div>

        {/* Projects Grid */}
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-glass hover:shadow-workflow-lg transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Hover Content */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    hoveredProject === project.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <Button className="btn-primary btn-magnetic">
                      <span className="flex items-center gap-2">
                        <span>Ver Projeto</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-workflow-deep mb-3 group-hover:text-workflow-energy transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-workflow-deep/70 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-workflow-energy/10 text-workflow-energy rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 bg-workflow-energy rounded-full animate-glow-pulse" />
                    <span className="capitalize">{project.category}</span>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-workflow-energy/20 transition-colors duration-500" />
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-workflow-energy/30 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-workflow-zen/40 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.5s' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-400 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              className="btn-primary btn-magnetic min-w-[200px]"
              onClick={() => document.getElementById('cta-accelerator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center gap-2">
                <span>Criar Meu Projeto</span>
                <span>🚀</span>
              </span>
            </Button>
            <Button 
              className="btn-ghost btn-magnetic"
              onClick={() => window.open('https://dribbble.com', '_blank')}
            >
              <span className="flex items-center gap-2">
                <span>Ver Mais Cases</span>
                <span>↗</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-workflow-energy/5 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 bg-workflow-zen/5 rounded-full blur-lg animate-float-delayed" />
        <div className="absolute top-3/4 left-3/4 w-20 h-20 bg-workflow-accent/5 rounded-full blur-md animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
};

export default PortfolioGallery;
