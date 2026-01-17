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

  // Forçar favicon Leonardo Lopes e atualizar meta tags de imagem
  useEffect(() => {
    const leonardoFavicon = '/Images/logos/logo-leonardo-lopes-icone.svg';
    
    const forceLeonardoFavicon = () => {
      // Remover TODOS os links de favicon existentes que não sejam do Leonardo Lopes
      const faviconLinks = document.querySelectorAll('link[rel*="icon"], link[rel*="shortcut"], link[rel*="apple-touch-icon"], link[rel*="mask-icon"]');
      faviconLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (!href.includes('logo-leonardo-lopes-icone.svg') && 
            !href.includes('leonardolopes') &&
            (href.toLowerCase().includes('lovable') || 
             href.toLowerCase().includes('workflow.lovable') ||
             href.toLowerCase().includes('favicon.ico') ||
             href.includes('data:image'))) {
          link.remove();
        }
      });
      
      // Verificar se já existe o favicon do Leonardo Lopes
      let hasLeonardoFavicon = false;
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingFavicons.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('logo-leonardo-lopes-icone.svg')) {
          hasLeonardoFavicon = true;
        }
      });
      
      // Adicionar favicon Leonardo Lopes se não existir
      if (!hasLeonardoFavicon && document.head) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = leonardoFavicon;
        link.type = 'image/svg+xml';
        document.head.insertBefore(link, document.head.firstChild);
        
        const shortcutLink = document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.href = leonardoFavicon;
        shortcutLink.type = 'image/svg+xml';
        document.head.insertBefore(shortcutLink, document.head.firstChild);
      }
      
      // Remover também qualquer link que possa ser um favicon indesejado
      const allLinks = document.querySelectorAll('link');
      allLinks.forEach(link => {
        const rel = link.getAttribute('rel') || '';
        const href = link.getAttribute('href') || '';
        if (
          (rel.toLowerCase().includes('icon') || rel.toLowerCase().includes('shortcut')) &&
          !href.includes('logo-leonardo-lopes-icone.svg') &&
          !href.includes('leonardolopes') &&
          (href.toLowerCase().includes('lovable') ||
           href.toLowerCase().includes('workflow.lovable') ||
           href.toLowerCase().includes('favicon.ico') ||
           href.includes('data:image') ||
           (href.toLowerCase().includes('.ico') && !href.includes('leonardo')) ||
           (href.toLowerCase().includes('.png') && !href.includes('leonardo')))
        ) {
          link.remove();
        }
      });
    };
    
    // Usar MutationObserver para monitorar e remover favicons adicionados dinamicamente
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as Element;
            if (element.tagName === 'LINK') {
              const rel = element.getAttribute('rel') || '';
              const href = element.getAttribute('href') || '';
              if (
                (rel.toLowerCase().includes('icon') || rel.toLowerCase().includes('shortcut')) &&
                !href.includes('logo-leonardo-lopes-icone.svg') &&
                !href.includes('leonardolopes') &&
                (href.toLowerCase().includes('lovable') ||
                 href.toLowerCase().includes('workflow.lovable') ||
                 href.toLowerCase().includes('favicon.ico') ||
                 href.includes('data:image') ||
                 (href.toLowerCase().includes('.ico') && !href.includes('leonardo')) ||
                 (href.toLowerCase().includes('.png') && !href.includes('leonardo')))
              ) {
                element.remove();
              }
            }
          }
        });
      });
      forceLeonardoFavicon();
    });
    
    // Observar mudanças no head
    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });
    
    // Executar imediatamente e periodicamente
    forceLeonardoFavicon();
    const interval = setInterval(forceLeonardoFavicon, 200);
    
    return () => {
      clearInterval(interval);
      observer.disconnect();
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

    // removeAllFavicons já está sendo executado no useEffect acima

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
