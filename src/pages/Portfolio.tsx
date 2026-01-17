import { useState, useRef, useEffect } from 'react';
import WorkflowFooter from '@/components/WorkflowFooter';
import InstantImage from '@/components/InstantImage';
import { usePortfolioImages } from '@/hooks/usePortfolioImages';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  thumbnailImage?: string;
  category: string;
  priority?: boolean;
}

const Portfolio = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo-workflow.png');
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const galleryRef = useRef<HTMLElement>(null);
  
  // Hook para buscar dados otimizados do Supabase
  const { projects, loading, error } = usePortfolioImages();

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

  useEffect(() => {
    const updateLogoSrc = () => {
      const newLogoSrc = window.location.pathname === '/' 
        ? './logo-workflow.png' 
        : '/Images/logo-workflow-sem-fundo.png';
      setLogoSrc(newLogoSrc);
    };

    updateLogoSrc();
    window.addEventListener('popstate', updateLogoSrc);
    return () => window.removeEventListener('popstate', updateLogoSrc);
  }, []);

  // Sem precarregamento adicional - deixa o browser otimizar naturalmente


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
    <div className="min-h-screen bg-gradient-to-br from-workflow-50 via-white to-workflow-100">
      <section 
        ref={galleryRef}
        id="portfolio" 
        className="section-padding pt-8 sm:pt-10 md:pt-12 bg-gradient-to-br from-workflow-50 via-white to-workflow-100 relative overflow-hidden min-h-screen"
      >
        {/* Simple Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-workflow-50 via-white to-workflow-100 opacity-50" />
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Header Section */}
          <div className={`text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0 transition-opacity duration-500 portfolio-content ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Logo da Workflow - with explicit dimensions to prevent CLS */}
            <div className="flex justify-center mb-8">
              <div className="logo-glow-container" style={{ width: '140px', height: '140px' }}>
                <img 
                  src={logoSrc} 
                  alt="Workflow Logo" 
                  width={140}
                  height={140}
                  className="logo-glow-image h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/Images/logo-workflow-sem-fundo.png';
                  }}
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gradient-to-r from-workflow-energy to-workflow-zen rounded-full" />
              <span className="text-workflow-energy font-mono text-xs sm:text-sm md:text-base tracking-wider uppercase">Portfólio - Leonardo Lopes</span>
              <div className="w-8 sm:w-12 md:w-16 h-0.5 bg-gradient-to-l from-workflow-energy to-workflow-zen rounded-full" />
            </div>
            
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-workflow-deep mb-4 sm:mb-6 md:mb-8">
              Criações <span className="text-gradient">Recentes</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-workflow-deep/70 mb-6 sm:mb-8 md:mb-10 max-w-3xl md:max-w-4xl mx-auto">
              Veja algumas das criações mais recentes do desenvolvedor Leonardo Lopes. Cada projeto é uma obra de arte 
              digital que transforma negócios e gera resultados extraordinários.
            </p>
          </div>

          {/* Projects Grid */}
          <div className={`transition-opacity duration-500 portfolio-content ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-4 md:px-0">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="rounded-2xl overflow-hidden"
                    style={{ 
                      backgroundColor: '#16162a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      minHeight: '420px'
                    }}
                  >
                    <div className="animate-pulse">
                      <div style={{ aspectRatio: '800/406', backgroundColor: '#1f1f3a' }} />
                      <div className="p-5">
                        <div className="h-5 rounded" style={{ backgroundColor: '#2a2a4a', marginBottom: '12px' }} />
                        <div className="h-4 rounded" style={{ backgroundColor: '#232340', marginBottom: '8px' }} />
                        <div className="h-4 rounded w-3/4" style={{ backgroundColor: '#232340' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-4 md:px-0">
                {projects.map((project) => {
                  const isHovered = hoveredCardId === project.id;
                  
                  return (
                    <article
                      key={project.id}
                      className="rounded-2xl overflow-hidden"
                      style={{ 
                        backgroundColor: '#16162a',
                        border: isHovered ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                        minHeight: '420px',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                      }}
                      onMouseEnter={() => setHoveredCardId(project.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      {/* Project Image */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '800/406' }}>
                        <InstantImage
                          src={project.thumbnailImage || project.image}
                          alt={`Capa do projeto ${project.title}`}
                          priority={project.priority}
                          className="w-full h-full object-cover"
                          width={800}
                          height={406}
                          isHovered={isHovered}
                        />
                        
                        {/* Category Badge */}
                        <div className="absolute bottom-3 left-3">
                          <span 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white rounded-full text-xs font-semibold"
                            style={{ backgroundColor: 'rgba(139, 92, 246, 0.9)' }}
                          >
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            {project.category}
                          </span>
                        </div>
                        
                        {/* Eye Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openImageModal(project.image);
                          }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-transform duration-200 cursor-pointer hover:scale-110"
                          type="button"
                          aria-label={`Visualizar ${project.title}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                            <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>

                      {/* Project Info */}
                      <div className="p-5">
                        <h3 
                          className="text-lg font-bold mb-2 transition-colors duration-200"
                          style={{ color: isHovered ? 'rgb(192, 132, 252)' : 'white' }}
                        >
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openImageModal(project.image);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer"
                            type="button"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                              <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Visualizar
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openImageModal(project.image);
                            }}
                            className="w-10 h-10 flex items-center justify-center text-white rounded-xl transition-colors duration-200 cursor-pointer hover:bg-white/20"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                            type="button"
                            aria-label="Abrir em nova aba"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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
                    width={1200}
                    height={2400}
                    className="w-full h-auto block"
                    loading="eager"
                    decoding="async"
                    style={{ minHeight: '50vh' }}
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
      
      {/* Rodapé */}
      <WorkflowFooter />
    </div>
  );
};

export default Portfolio; 