import { useState, useRef, useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const PortfolioGallery = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
      title: "Design Agency Portfolio",
      description: "Portfolio moderno para agência de design com showcase interativo e animações elegantes",
      image: "/Images/ee1872227308933.683debf336d7e.webp",
      category: "design"
    },
    {
      id: 2,
      title: "Creative Studio",
      description: "Landing page criativa para estúdio com foco em branding e identidade visual",
      image: "/Images/a07726227325915.683e384f30c96.webp",
      category: "creative"
    },
    {
      id: 3,
      title: "Corporate Business",
      description: "Site corporativo empresarial com design profissional e layout institucional",
      image: "/Images/6355c2227386813.683f241d5b2f9.webp",
      category: "corporate"
    },
    {
      id: 4,
      title: "Fashion Brand",
      description: "E-commerce de moda com galeria visual impactante e experiência de compra premium",
      image: "/Images/d1f278227408887.683f856b97a03.webp",
      category: "fashion"
    },
    {
      id: 5,
      title: "Technology Startup",
      description: "Landing page tech com design futurista e foco em inovação tecnológica",
      image: "/Images/4683bc227571641.684237771bde1.webp",
      category: "tech"
    },
    {
      id: 6,
      title: "Luxury Restaurant",
      description: "Site gastronômico premium com apresentação visual sofisticada e menu interativo",
      image: "/Images/d45ff7227834569.6848166f2acfe.webp",
      category: "restaurant"
    },
    {
      id: 7,
      title: "Digital Agency",
      description: "Agência digital moderna com portfólio de serviços e cases de sucesso",
      image: "/Images/e953da227530013.6841891c2230b.webp",
      category: "agency"
    },
    {
      id: 8,
      title: "Creative Portfolio",
      description: "Portfolio pessoal criativo com galeria de trabalhos e biografia interativa",
      image: "/Images/14f8a8227635329.68437fc4b7069.webp",
      category: "portfolio"
    },
    {
      id: 9,
      title: "Product Landing",
      description: "Landing page de produto com foco em conversão e apresentação visual impactante",
      image: "/Images/9ffefc227662493.68444f2354b35 (1).webp",
      category: "product"
    }
  ];

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Eye Icon for Preview */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    hoveredProject === project.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <button
                      onClick={() => openImageModal(project.image)}
                      className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-workflow-energy hover:bg-white hover:scale-110 transition-all duration-300 shadow-workflow"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform duration-300"
                      >
                        <path
                          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
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
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 z-10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Image Container */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-workflow-xl animate-scale-in">
              <img
                src={selectedImage}
                alt="Landing page preview"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            </div>

            {/* Click outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={closeImageModal}
            />
          </div>
        </div>
      )}

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
