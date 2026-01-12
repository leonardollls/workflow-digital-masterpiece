import { Suspense, lazy, useState, useEffect } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import HeroSection from "../components/HeroSection";
import PreLoader from "../components/PreLoader";

const SuccessDashboard = lazy(() => import("../components/SuccessDashboard"));
const CapabilityMatrix = lazy(() => import("../components/CapabilityMatrix"));
const AutonomiaTotal = lazy(() => import("../components/AutonomiaTotal"));
const MethodologyLab = lazy(() => import("../components/MethodologyLab"));
const ResourceVault = lazy(() => import("../components/ResourceVault"));
const PortfolioGallery = lazy(() => import("../components/PortfolioGallery"));
const TestimonialTheater = lazy(() => import("../components/TestimonialTheater"));
const WorkflowFooter = lazy(() => import("../components/WorkflowFooter"));

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    console.log('PreLoader completado');
    setIsLoading(false);
  };

  // Remover favicons do Lovable e atualizar meta tags de imagem
  useEffect(() => {
    const removeAllFavicons = () => {
      // Remover todos os links de favicon existentes
      const faviconLinks = document.querySelectorAll('link[rel*="icon"], link[rel*="shortcut"], link[rel*="apple-touch-icon"]');
      faviconLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        // Remover se contiver "lovable" ou qualquer referência suspeita
        if (href.toLowerCase().includes('lovable') || href.toLowerCase().includes('workflow.lovable')) {
          link.remove();
        }
      });
      
      // Remover também por seletores específicos
      const selectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel="apple-touch-icon-precomposed"]',
      ];
      
      selectors.forEach(selector => {
        const links = document.querySelectorAll(selector);
        links.forEach(link => {
          const href = link.getAttribute('href') || '';
          if (href.toLowerCase().includes('lovable') || href.toLowerCase().includes('workflow.lovable')) {
            link.remove();
          }
        });
      });
    };

    const updateMetaTag = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    removeAllFavicons();

    // Atualizar meta tags de imagem de preview
    const previewImageUrl = 'https://leonardolopes.online/Images/leonardo-lopes/I_need_the_202601121847.jpeg';
    updateMetaTag('og:image', previewImageUrl);
    updateMetaTag('og:image:secure_url', previewImageUrl);
    updateMetaTag('og:image:type', 'image/jpeg');
    updateMetaTag('og:image:alt', 'Leonardo Lopes - UX/UI Designer & Developer');
    updateMetaTag('twitter:card', 'summary_large_image', false);
    updateMetaTag('twitter:image', previewImageUrl, false);
    updateMetaTag('twitter:image:alt', 'Leonardo Lopes - UX/UI Designer & Developer', false);
  }, []);

  // Garantir que o loading seja removido após um tempo máximo
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Forçando fim do loading após timeout');
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-[#0B0B14] relative overflow-x-hidden">
      {/* Background com z-index baixo */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>
      
      {/* PreLoader com controle de estado */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999]">
          <PreLoader onComplete={handleLoadingComplete} />
        </div>
      )}
      
      {/* Conteúdo principal com z-index apropriado */}
      <div className="relative z-10">
        <HeroSection />
        
        <Suspense fallback={<div className="h-32"></div>}>
          <SuccessDashboard />
        </Suspense>
        
        <Suspense fallback={<div className="h-32"></div>}>
          <PortfolioGallery />
        </Suspense>
        
        <Suspense fallback={<div className="h-32"></div>}>
          <AutonomiaTotal />
        </Suspense>
        
        <Suspense fallback={<div className="h-32"></div>}>
          <CapabilityMatrix />
        </Suspense>
        
        <Suspense fallback={<div className="h-32"></div>}>
          <MethodologyLab />
        </Suspense>
        
        <Suspense fallback={<div className="h-32"></div>}>
          <TestimonialTheater />
        </Suspense>
        
        <Suspense fallback={<div className="h-32"></div>}>
          <ResourceVault />
        </Suspense>
        
        <Suspense fallback={<div className="h-32"></div>}>
          <WorkflowFooter />
        </Suspense>
      </div>
    </div>
  );
};

export default Index;
