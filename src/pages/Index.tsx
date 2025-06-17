import { useState, useEffect, lazy, Suspense } from 'react';
import PreLoader from '@/components/PreLoader';
import HeroSection from '@/components/HeroSection';

// Lazy loading dos componentes pesados
const SuccessDashboard = lazy(() => import('@/components/SuccessDashboard'));
const PortfolioGallery = lazy(() => import('@/components/PortfolioGallery'));
const TestimonialTheater = lazy(() => import('@/components/TestimonialTheater'));
const MethodologyLab = lazy(() => import('@/components/MethodologyLab'));
const CapabilityMatrix = lazy(() => import('@/components/CapabilityMatrix'));
const ResourceVault = lazy(() => import('@/components/ResourceVault'));
const WorkflowFooter = lazy(() => import('@/components/WorkflowFooter'));

// Componente de loading otimizado
const SectionLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-8 h-8 border-2 border-workflow-energy/30 border-t-workflow-energy rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);

  useEffect(() => {
    // Reduzir tempo de preloader para melhor UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Carregar seções após hero estar visível
      setTimeout(() => setSectionsLoaded(true), 500);
    }, 1500); // Reduzido de 3000 para 1500ms

    return () => clearTimeout(timer);
  }, []);

  // Detectar se é mobile para otimizações específicas
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isLoading) {
    return <PreLoader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-workflow-mesh">
      {/* Hero sempre carregado primeiro */}
      <HeroSection />
      
      {/* Seções carregadas progressivamente */}
      {sectionsLoaded && (
        <Suspense fallback={<SectionLoader />}>
          <SuccessDashboard />
        </Suspense>
      )}
      
      {sectionsLoaded && (
        <Suspense fallback={<SectionLoader />}>
          <PortfolioGallery />
        </Suspense>
      )}
      
      {sectionsLoaded && (
        <Suspense fallback={<SectionLoader />}>
          <TestimonialTheater />
        </Suspense>
      )}
      
      {sectionsLoaded && (
        <Suspense fallback={<SectionLoader />}>
          <MethodologyLab />
        </Suspense>
      )}
      
      {sectionsLoaded && (
        <Suspense fallback={<SectionLoader />}>
          <CapabilityMatrix />
        </Suspense>
      )}
      
      {sectionsLoaded && (
        <Suspense fallback={<SectionLoader />}>
          <ResourceVault />
        </Suspense>
      )}
      
      {sectionsLoaded && (
        <Suspense fallback={<SectionLoader />}>
          <WorkflowFooter />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
