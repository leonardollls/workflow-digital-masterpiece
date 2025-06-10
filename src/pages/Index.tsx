
import { useState, useEffect } from 'react';
import PreLoader from '@/components/PreLoader';
import HeroSection from '@/components/HeroSection';
import SuccessDashboard from '@/components/SuccessDashboard';
import PortfolioGallery from '@/components/PortfolioGallery';
import TestimonialTheater from '@/components/TestimonialTheater';
import MethodologyLab from '@/components/MethodologyLab';
import CapabilityMatrix from '@/components/CapabilityMatrix';
import ResourceVault from '@/components/ResourceVault';
import CTAAccelerator from '@/components/CTAAccelerator';
import WorkflowFooter from '@/components/WorkflowFooter';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PreLoader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-workflow-mesh">
      <HeroSection />
      <SuccessDashboard />
      <PortfolioGallery />
      <TestimonialTheater />
      <MethodologyLab />
      <CapabilityMatrix />
      <ResourceVault />
      <CTAAccelerator />
      <WorkflowFooter />
    </div>
  );
};

export default Index;
