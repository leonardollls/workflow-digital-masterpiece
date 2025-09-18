import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import WorkflowFooter from '@/components/WorkflowFooter';
import LazyImage from '@/components/LazyImage';
import OptimizedPortfolioGrid from '@/components/OptimizedPortfolioGrid';
import imageConfig from '@/config/images.json';
import { useImageOptimization, useImagePreloader, useResponsiveImageSizes } from '@/hooks/useImageOptimization';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const Portfolio = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [logoSrc, setLogoSrc] = useState('/logo-workflow.png');
  const [isVisible, setIsVisible] = useState(false);
  
  // Hooks de otimização de imagem
  const imageOptimization = useImageOptimization();
  const responsiveSizes = useResponsiveImageSizes();
  
  // Preload das imagens críticas
  const criticalImages = useMemo(() => 
    projects.slice(0, 3).map(p => p.image), 
    [projects]
  );
  const { preloadedImages } = useImagePreloader(criticalImages, true);
  const galleryRef = useRef<HTMLElement>(null);

  // Memoizar projetos para evitar re-renderização desnecessária
  const projects = useMemo(() => [
    {
      id: 101,
      title: "Plataforma de IA para Vendas",
      description: "Landing page desenvolvida para uma plataforma inovadora de inteligência artificial focada em otimizar processos de vendas e atendimento ao cliente.",
      image: "/Images/landing-page-demonstracao-workana-1.png",
      category: "ai"
    },
    {
      id: 102,
      title: "Quart's - Móveis Sob Medida",
      description: "Landing page desenvolvida para uma empresa especializada em móveis sob medida e design de interiores.",
      image: "/Images/118d31229400769.686562b112afe.jpg",
      category: "interiores"
    },
    {
      id: 1,
      title: "Wood Home - Móveis Planejados",
      description: "Landing page para empresa de móveis planejados sob medida, destacando design sofisticado, qualidade e atendimento personalizado",
      image: "/Images/landing-page-demonstracao-1.webp",
      category: "design"
    },
    {
      id: 105,
      title: "Valor Corretora - Seguro de Renda",
      description: "Página de captura que apresenta o Seguro DIT para proteger a renda de trabalhadores contra afastamentos por acidente ou doença.",
      image: "/Images/FireShot Capture 003 - Segura de Renda.webp",
      category: "finance"
    },
    {
      id: 106,
      title: "Curso Nano Lips – Domine a Técnica Mais Lucrativa do Mercado",
      description: "Página de captura para curso especializado em Nano Lips, apresentando benefícios, público-alvo, técnicas ensinadas, resultados alcançáveis e bônus exclusivos.",
      image: "/Images/FireShotCaptureNanoLips.jpg",
      category: "education"
    },
    {
      id: 104,
      title: "Rei do Crédito – Crédito Rápido e Seguro",
      description: "Página de captura que apresenta soluções de crédito rápido e transparente (Antecipação FGTS, crédito pessoal e para trabalhadores).",
      image: "/Images/FireShot Capture 001 - Rei do Crédito.webp",
      category: "finance"
    },
    {
      id: 2,
      title: "Teacher Mary - Curso de Inglês",
      description: "Página de captura para professora de inglês com método exclusivo, aulas personalizadas e resultados comprovados",
      image: "/Images/landing-page-demonstracao-2.webp",
      category: "education"
    },
    {
      id: 103,
      title: "Evento de Imersão",
      description: "Landing page desenvolvida para uma imersão de alto nível voltada para desenvolvimento pessoal e networking estratégico.",
      image: "/Images/54478b229424237.68648848892d0_11zon%20(1).webp",
      category: "evento"
    },
    {
      id: 3,
      title: "Plataforma de Design Interativo",
      description: "Landing page para ferramenta de criação de interfaces UI com gráficos vetoriais em tempo real e multiplataforma",
      image: "/Images/landing-page-demonstracao-3.png",
      category: "tech"
    },
    {
      id: 4,
      title: "Desenvolvimento Pessoal & Relacionamentos",
      description: "Página de conversão para programa de autoconhecimento e relacionamentos saudáveis voltado para mulheres",
      image: "/Images/landing-page-demonstracao-4.webp",
      category: "lifestyle"
    },
    {
      id: 5,
      title: "Checklist Produto Digital",
      description: "Landing page para método de lançamento de produtos digitais em 3 dias, ideal para iniciantes sem audiência",
      image: "/Images/landing-page-demonstracao-5.webp",
      category: "digital"
    },
    {
      id: 6,
      title: "Grupo Dharma - Arquitetura",
      description: "Site institucional para empresa de arquitetura e design de interiores com portfólio de projetos residenciais e comerciais",
      image: "/Images/landing-page-demonstracao-6.webp",
      category: "architecture"
    },
    {
      id: 7,
      title: "Oasis Corp - Presença Digital",
      description: "Landing page para agência especializada em criar sites profissionais para pequenas empresas e empreendedores",
      image: "/Images/landing-page-demonstracao-7.webp",
      category: "agency"
    },
    {
      id: 8,
      title: "Turtle Fast - Autoridade Digital",
      description: "Página de vendas para metodologia que transforma especialistas em autoridades digitais lucrativas em 120 dias",
      image: "/Images/landing-page-demonstracao-8.webp",
      category: "business"
    },
    {
      id: 9,
      title: "Automação Financeira Empresarial",
      description: "Plataforma de gestão financeira inteligente para pequenas empresas com IA, insights em tempo real e integração bancária",
      image: "/Images/landing-page-demonstracao-9.png",
      category: "fintech"
    }
  ], []);

  // Intersection Observer para lazy loading
  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { 
        threshold: 0.1,
        rootMargin: '50px'
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

  // Funções de modal otimizadas com useCallback
  const openImageModal = useCallback((imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

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
            
            {/* Logo da Workflow */}
            <div className="flex justify-center mb-8">
              <LazyImage
                src={logoSrc}
                alt="Workflow Logo"
                className="h-24 sm:h-28 md:h-32 lg:h-36 object-contain"
                priority={true}
                loading="eager"
              />
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

          {/* Projects Grid - Otimizado */}
          <div className={`transition-opacity duration-500 portfolio-content ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="px-2 sm:px-4 md:px-0">
              <OptimizedPortfolioGrid
                projects={projects}
                onImageClick={openImageModal}
                hoveredProject={hoveredProject}
                onProjectHover={setHoveredProject}
                responsiveSizes={responsiveSizes}
              />
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
                  <LazyImage
                    src={selectedImage || ''}
                    alt="Landing page preview"
                    className="w-full h-auto block"
                    style={{ minHeight: '100vh' }}
                    loading="eager"
                    priority={true}
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