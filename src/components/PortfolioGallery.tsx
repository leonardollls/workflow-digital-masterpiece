import { useState, useRef, useEffect } from 'react';
import FastImage from '@/components/FastImage';
import { usePortfolioImages } from '@/hooks/usePortfolioImages';

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
  
  // Hook para buscar dados otimizados do Supabase
  const { projects, loading } = usePortfolioImages();

  useEffect(() => {
    // Garantir que o conteúdo seja visível imediatamente para evitar problemas mobile
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { 
        threshold: 0.1,
        rootMargin: '50px' // Adicionar margem para melhorar detecção mobile
      }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Precarrega as imagens críticas (prioritárias)
  useEffect(() => {
    if (projects.length === 0) return;
    
    const preloadCriticalImages = () => {
      const criticalImages = projects.filter(project => project.priority);
      criticalImages.forEach((project) => {
        const img = new Image();
        img.src = project.thumbnailImage || project.image;
      });
    };

    // Precarrega após um pequeno delay para não bloquear o carregamento inicial
    const timer = setTimeout(preloadCriticalImages, 100);
    return () => clearTimeout(timer);
  }, [projects]);

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
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-workflow-50 via-white to-workflow-100 opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0 transition-opacity duration-500 portfolio-content ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gradient-to-r from-workflow-energy to-workflow-zen rounded-full" />
            <span className="text-workflow-energy font-mono text-xs sm:text-sm md:text-base tracking-wider uppercase">Portfolio</span>
            <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gradient-to-l from-workflow-energy to-workflow-zen rounded-full" />
          </div>
          
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-workflow-deep mb-4 sm:mb-6 md:mb-8">
            Nossas <span className="text-gradient">Criações</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-workflow-deep/70 mb-6 sm:mb-8 md:mb-10 max-w-3xl md:max-w-4xl mx-auto">
            Veja alguns de nossas criações mais recentes. Cada projeto é uma obra de arte 
            digital que transforma negócios e gera resultados extraordinários.
          </p>
        </div>

        {/* Projects Grid */}
        <div className={`transition-opacity duration-500 portfolio-content ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-2 sm:px-4 md:px-0">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-glass hover:shadow-workflow-lg transition-shadow duration-300"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <FastImage
                    src={project.thumbnailImage || project.image}
                    alt={project.title}
                    priority={project.priority}
                    className="w-full h-full"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                
                {/* Ícone de olho SEMPRE VISÍVEL e clicável */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Eye button clicked for:', project.title);
                    openImageModal(project.image);
                  }}
                  className="absolute top-4 right-4 group/btn w-14 h-14 bg-white/80 hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg hover:scale-110 z-20"
                  type="button"
                  style={{ zIndex: 20 }}
                >
                  {/* Brilho de fundo */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-workflow-energy/30 to-workflow-zen/30 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  
                  {/* Ícone SVG moderno */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 text-workflow-deep drop-shadow-lg group-hover/btn:scale-110 transition-transform duration-300"
                  >
                    <path
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover/btn:stroke-workflow-energy transition-colors duration-300"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="group-hover/btn:stroke-workflow-energy transition-colors duration-300"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="1"
                      fill="currentColor"
                      className="group-hover/btn:fill-workflow-energy transition-colors duration-300"
                    />
                  </svg>
                  
                  {/* Efeito de ondas sutis */}
                  <div className="absolute inset-0 rounded-full border border-white/40 scale-100 group-hover/btn:scale-110 opacity-100 group-hover/btn:opacity-0 transition-all duration-300" />
                </button>

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
                    <span className="w-2 h-2 bg-workflow-energy rounded-full" />
                    <span className="capitalize">{project.category}</span>
                  </div>
                </div>

                {/* Simple Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-workflow-energy/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 animate-fade-in">
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className="fixed top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 z-10 backdrop-blur-sm"
          >
            <svg
              width="24"
              height="24"
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

          {/* Scrollable Container */}
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full flex items-start justify-center p-4 pt-20">
              {/* Image Container */}
              <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-2xl animate-scale-in">
                <img
                  src={selectedImage}
                  alt="Landing page preview"
                  className="w-full h-auto block"
                  style={{ minHeight: '100vh' }}
                />
              </div>
            </div>
          </div>

          {/* Click outside overlay */}
          <div
            className="fixed inset-0 -z-10"
            onClick={closeImageModal}
          />

          {/* Scroll Indicator */}
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-bounce"
            >
              <path
                d="M7 13L12 18L17 13M7 6L12 11L17 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Role para ver a landing page completa</span>
          </div>
        </div>
      )}


    </section>
  );
};

export default PortfolioGallery;
