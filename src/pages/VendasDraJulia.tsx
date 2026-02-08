import { useState, useEffect, useCallback } from 'react';
import { GlassBackground } from '@/components/portfolio-v2';
import WorkflowFooter from '@/components/WorkflowFooter';
import {
  SocialProof,
  LighthouseScores,
  FeatureComparison,
  QRCodePreview,
  LoadTimeCounter,
  UptimeScore,
  CodeOptimization,
  Mockup3D,
  HeroMockup3D,
  FAQ,
  LogoCarousel,
  DeveloperShowcase,
  DraJuliaSplashLoader,
  HostingBonusSection,
} from '@/components/vendas';
import AdminPanelShowcaseDraJulia from '@/components/vendas/AdminPanelShowcaseDraJulia';
import { 
  Shield, TrendingUp, Smartphone, Search, 
  MessageCircle, Award, ChevronDown,
  CreditCard, QrCode, FileText, CheckCircle, X,
  Monitor, Zap, Lock, Globe,
  Play, Sparkles, Menu, ChevronUp, MessageSquare, Gift
} from 'lucide-react';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const VendasDraJulia = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SITE_URL = 'https://drajulia-bisicomin-odontologia.vercel.app/';
  const PAYMENT_LINK = 'https://wa.me/555199437916';

  // Recursos específicos do site Dra. Julia para o comparativo
  const draJuliaComparisons = [
    { feature: 'Design Moderno e Premium', oldSite: false, newSite: true },
    { feature: '100% Responsivo', oldSite: false, newSite: true },
    { feature: 'SEO Otimizado', oldSite: false, newSite: true },
    { feature: 'WhatsApp Integrado', oldSite: false, newSite: true },
    { feature: 'Galeria de Serviços Odontológicos', oldSite: false, newSite: true },
    { feature: 'Avaliações Google Integradas', oldSite: false, newSite: true },
    { feature: 'Formulário de Agendamento', oldSite: false, newSite: true },
    { feature: 'Seção de Implantes Dentários', oldSite: false, newSite: true },
    { feature: 'Google Maps Integrado', oldSite: false, newSite: true },
    { feature: 'Performance A+', oldSite: false, newSite: true },
  ];

  // Handle splash loader completion
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    setTimeout(() => {
      setContentReady(true);
    }, 100);
  }, []);

  // Set dark background on mount
  useEffect(() => {
    document.body.style.backgroundColor = '#020617'; // slate-950
    document.documentElement.style.backgroundColor = '#020617';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  // Animation on mount (after splash)
  useEffect(() => {
    if (contentReady) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [contentReady]);

  // Reset iframe loading when preview opens
  useEffect(() => {
    if (isPreviewOpen) {
      setIframeLoading(true);
    }
  }, [isPreviewOpen]);

  // Lock body scroll when modal is open and ensure dark background
  useEffect(() => {
    document.body.style.backgroundColor = '#020617';
    document.documentElement.style.backgroundColor = '#020617';
    
    if (isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [isPreviewOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isPreviewOpen]);

  // Header visibility based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 200) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscapeMobileMenu = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscapeMobileMenu);
    return () => document.removeEventListener('keydown', handleEscapeMobileMenu);
  }, [isMobileMenuOpen]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to pricing section
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Scroll to benefits section
  const scrollToBenefits = () => {
    const benefitsSection = document.getElementById('benefits-section');
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Scroll to preview section
  const scrollToPreview = () => {
    const previewSection = document.getElementById('preview-section');
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const getDeviceWidth = (): string => {
    switch (device) {
      case 'mobile': return 'w-full max-w-[100vw] sm:max-w-[480px]';
      case 'tablet': return 'max-w-[900px]';
      default: return 'max-w-[1600px]';
    }
  };

  const getDeviceHeight = (): string => {
    switch (device) {
      case 'mobile': return 'h-full min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] sm:max-h-[932px]';
      case 'tablet': return 'max-h-[1200px]';
      default: return 'max-h-full';
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Aumento de Credibilidade',
      description: 'Site profissional que transmite confiança e cuidado, refletindo a excelência da Dra. Julia.',
      accent: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      title: '+60% Mais Contatos',
      description: 'Integração inteligente com WhatsApp e formulário otimizado para agendamento de consultas.',
      accent: 'from-green-500 to-emerald-500'
    },
    {
      icon: Search,
      title: 'Melhor no Google',
      description: 'SEO otimizado para aparecer nas primeiras posições nas buscas locais por odontologia em Caxias do Sul.',
      accent: 'from-purple-500 to-violet-500'
    },
    {
      icon: Smartphone,
      title: '100% Responsivo',
      description: 'Funciona perfeitamente em qualquer dispositivo: celular, tablet ou desktop.',
      accent: 'from-orange-500 to-amber-500'
    },
    {
      icon: Zap,
      title: 'Carregamento Rápido',
      description: 'Otimizado para performance máxima, reduzindo abandono e melhorando ranking no Google.',
      accent: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Lock,
      title: 'Seguro e Moderno',
      description: 'Tecnologias de ponta utilizadas por empresas como Netflix, Airbnb e Meta.',
      accent: 'from-red-500 to-pink-500'
    }
  ];

  const stats = [
    { value: '+70%', label: 'Mais Credibilidade', accent: 'from-amber-500 to-orange-600' },
    { value: '+45%', label: 'Mais Visibilidade', accent: 'from-blue-500 to-indigo-600' },
    { value: '+60%', label: 'Mais Contatos', accent: 'from-green-500 to-emerald-600' },
    { value: '+80%', label: 'Mais Profissionalismo', accent: 'from-purple-500 to-violet-600' },
  ];

  const paymentMethods = [
    { icon: QrCode, name: 'PIX', description: 'Pagamento instantâneo' },
    { icon: FileText, name: 'Boleto', description: 'Até 3 dias úteis' },
    { icon: CreditCard, name: 'Cartão', description: 'Até 12x sem juros' },
  ];

  const includedItems = [
    'Site completo e funcional',
    'Design moderno e premium',
    'Painel Administrativo',
    'Integração WhatsApp',
    'SEO otimizado',
    '100% responsivo',
    'Suporte Técnico',
    'Garantia de 30 dias',
  ];

  // Logos das empresas atendidas
  const clientLogos = [
    '/Images/capas-sites/Bidix Pay.webp',
    '/Images/capas-sites/CognusCore.webp',
    '/Images/capas-sites/Color Haus Acabamentos.webp',
    '/Images/capas-sites/Empregga.webp',
    '/Images/capas-sites/Faculdade Phorte - Black Friday.webp',
    '/Images/capas-sites/Hora do Sono Colchões.webp',
    '/Images/capas-sites/James Produtor.webp',
    '/Images/capas-sites/Livia Rosa Advocacia.webp',
    '/Images/capas-sites/MRA Advogados Associados.webp',
    '/Images/capas-sites/Oasis Corp.webp',
    '/Images/capas-sites/Oxpay.webp',
    '/Images/Captura1101262.webp',
  ];

  return (
    <>
      {/* Splash Loading Screen */}
      {showSplash && (
        <DraJuliaSplashLoader onComplete={handleSplashComplete} duration={1200} />
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
            onClick={() => setIsPreviewOpen(false)}
          />
          <div 
            className="relative w-full h-full sm:max-h-[95vh] flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 backdrop-blur-xl border-b border-white/10 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#122737] to-[#D4A574] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-base">J</span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-white font-semibold truncate text-sm sm:text-base">Dra. Julia Bisi Comin</h2>
                  <p className="text-white/50 text-xs truncate hidden sm:block">Preview Interativo</p>
                </div>
              </div>

              {/* Device Selector - Mobile visible */}
              <div className="flex md:hidden items-center gap-1 bg-white/5 rounded-xl p-1 mr-2">
                {[
                  { type: 'desktop' as DeviceType, Icon: Monitor, label: 'Desktop' },
                  { type: 'mobile' as DeviceType, Icon: Smartphone, label: 'Mobile' },
                ].map(({ type, Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setDevice(type)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      device === type 
                        ? 'bg-purple-500/30 text-purple-300' 
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                    title={label}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>

              {/* Device Selector - Desktop */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-white/5 rounded-xl p-1">
                {[
                  { type: 'desktop' as DeviceType, Icon: Monitor, label: 'Desktop' },
                  { type: 'mobile' as DeviceType, Icon: Smartphone, label: 'Mobile' },
                ].map(({ type, Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setDevice(type)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      device === type 
                        ? 'bg-purple-500/30 text-purple-300' 
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                    title={label}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 sm:p-2 rounded-xl text-white/50 hover:text-white hover:bg-red-500/20 transition-all"
                  title="Fechar (ESC)"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Container */}
            <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-hidden rounded-b-2xl min-h-0 relative">
              <div 
                className={`relative w-full h-full ${getDeviceWidth()} ${getDeviceHeight()} transition-all duration-500 mx-auto ${
                  device === 'mobile' ? 'p-2 sm:p-4' : ''
                }`}
                style={{
                  boxShadow: device !== 'desktop' ? '0 0 60px rgba(0,0,0,0.5)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-violet-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <p className="mt-4 text-white/50 text-sm">Carregando preview...</p>
                  </div>
                )}
                <div 
                  className="w-full h-full relative flex-1 min-h-0"
                  style={{
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <iframe
                    src={SITE_URL}
                    title="Preview Dra. Julia Bisi Comin - Odontologia"
                    className={`w-full h-full bg-white transition-opacity duration-500 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => {
                      setIframeLoading(false);
                    }}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    style={{
                      border: 'none',
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'auto',
                    }}
                    allow="fullscreen"
                    scrolling="yes"
                  />
                </div>
              </div>
            </div>

            {/* Footer hint */}
            <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm text-white/40 text-xs pointer-events-none">
              <span>Pressione</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">ESC</kbd>
              <span>para fechar</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          FLOATING HEADER
          ============================================ */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isHeaderVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-4 mt-4">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <button
                onClick={scrollToTop}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#122737] to-[#D4A574] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(212,165,116,0.4)] transition-all duration-300">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-white font-semibold text-sm">Dra. Julia</span>
                  <span className="block text-white/50 text-xs">Novo Site</span>
                </div>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={scrollToBenefits}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <TrendingUp size={16} />
                  Vantagens
                </button>
                <button
                  onClick={scrollToPreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <Monitor size={16} />
                  Ver Resultado
                </button>
                <button
                  onClick={scrollToPricing}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <Sparkles size={16} />
                  Investimento
                </button>
                <button
                  onClick={() => {
                    setIsPreviewOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <Monitor size={16} />
                  Abrir Site
                </button>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Preview Button */}
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="group flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/90 to-violet-600/90 text-white font-medium text-sm transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:scale-105"
                >
                  <Play size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Visualizar</span>
                  <span className="sm:hidden">Visualizar Site</span>
                </button>

                {/* Buy Button - Desktop */}
                <button
                  onClick={scrollToPricing}
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A574] to-[#E8C9A9] text-[#122737] font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,165,116,0.5)] hover:scale-105"
                >
                  <MessageSquare size={16} />
                  Adquirir
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div 
              className={`md:hidden overflow-hidden transition-all duration-300 ${
                isMobileMenuOpen ? 'max-h-96 mt-4 pt-4 border-t border-white/10' : 'max-h-0'
              }`}
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={scrollToBenefits}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <TrendingUp size={18} />
                  Vantagens
                </button>
                <button
                  onClick={scrollToPreview}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <Monitor size={18} />
                  Ver Resultado
                </button>
                <button
                  onClick={scrollToPricing}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <Sparkles size={18} />
                  Ver Investimento
                </button>
                <button
                  onClick={() => {
                    setIsPreviewOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                >
                  <Monitor size={18} />
                  Abrir Site
                </button>
                <button
                  onClick={scrollToPricing}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4A574] to-[#E8C9A9] text-[#122737] font-semibold text-sm transition-all duration-300"
                >
                  <MessageSquare size={18} />
                  Adquirir
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-30 p-3 rounded-full bg-purple-600/90 backdrop-blur-sm text-white shadow-lg transition-all duration-500 hover:bg-purple-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] ${
          isHeaderVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
        title="Voltar ao topo"
      >
        <ChevronUp size={24} />
      </button>

      <div className={`min-h-screen relative transition-opacity duration-700 bg-slate-950 ${contentReady ? 'opacity-100' : 'opacity-0'}`}>
        <GlassBackground />

        <main className="relative z-10">
          {/* ============================================
              HERO SECTION
              ============================================ */}
          <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#122737]/30 to-[#D4A574]/30 border border-[#D4A574]/30 mb-6">
                  <Award size={16} className="text-[#D4A574]" />
                  <span className="text-[#D4A574] text-sm font-medium">Proposta Exclusiva</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-white">Novo Site</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#D4A574] via-[#E8C9A9] to-[#D4A574] bg-clip-text text-transparent">
                    Dra. Julia Bisi Comin
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Uma nova presença digital que reflete a <strong className="text-white/90">excelência e o cuidado</strong> da Dra. Julia Bisi Comin em odontologia.
                </p>

                {/* Hero Mockup 3D Interativo - Mobile First */}
                <div className="block sm:hidden mb-8">
                  <HeroMockup3D 
                    siteUrl={SITE_URL} 
                    onOpenFullscreen={() => setIsPreviewOpen(true)} 
                  />
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-lg transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-105"
                  >
                    <Monitor size={22} />
                    Visualizar Nova Versão
                    <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={scrollToPricing}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#122737] to-[#1a3346] text-white font-semibold text-lg transition-all duration-300 hover:bg-[#D4A574]/10 hover:shadow-[0_0_30px_rgba(212,165,116,0.3)] hover:scale-105"
                  >
                    <MessageSquare size={22} className="text-[#D4A574]" />
                    Quero Adquirir
                  </button>
                </div>

                {/* Hero Mockup 3D Interativo - Desktop */}
                <div className="hidden sm:block">
                  <HeroMockup3D 
                    siteUrl={SITE_URL} 
                    onOpenFullscreen={() => setIsPreviewOpen(true)} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
              STATS SECTION
              ============================================ */}
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-5xl mx-auto">
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {stats.map((stat, index) => (
                  <div key={index} className="group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                    <div className="absolute inset-[1px] bg-slate-900/90 rounded-2xl" />
                    <div className={`absolute -inset-1 bg-gradient-to-r ${stat.accent} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 rounded-2xl`} />
                    <div className="relative text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-950/80 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r ${stat.accent} rounded-full opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-300`} />
                      <div className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform duration-300`}>
                        {stat.value}
                      </div>
                      <div className="text-white/70 text-xs sm:text-sm font-medium group-hover:text-white/90 transition-colors duration-300">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================
              BENEFITS SECTION
              ============================================ */}
          <section id="benefits-section" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-6xl mx-auto">
              <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  Por que sua empresa <span className="text-gradient">precisa</span> deste site?
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Vantagens estratégicas que transformam visitantes em clientes
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(124,58,237,0.15)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.accent} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================
              PREVIEW SECTION - ENHANCED
              ============================================ */}
          <section id="preview-section" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-7xl mx-auto">
              <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  Veja o resultado <span className="text-gradient">ao vivo</span>
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Explore todas as funcionalidades do novo site
                </p>
              </div>

              {/* Row 1: 3D Preview + Lighthouse Scores */}
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="flex flex-col">
                  <HeroMockup3D 
                    siteUrl={SITE_URL} 
                    onOpenFullscreen={() => setIsPreviewOpen(true)}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4 text-center lg:text-left">Métricas de Performance</h3>
                  <LighthouseScores />
                </div>
              </div>

              {/* Row 2: QR Code + Load Time + Uptime + Code Optimization + Mockup 3D */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 transition-all duration-1000 delay-300 items-stretch ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="hidden md:block flex">
                  <QRCodePreview url={SITE_URL} />
                </div>
                <div className="hidden md:flex">
                  <LoadTimeCounter siteUrl={SITE_URL} />
                </div>
                <div className="hidden md:flex">
                  <UptimeScore siteUrl={SITE_URL} />
                </div>
                <div className="hidden md:flex">
                  <CodeOptimization siteUrl={SITE_URL} />
                </div>
                <div className="hidden md:flex sm:col-span-2 lg:col-span-1 justify-center">
                  <Mockup3D 
                    siteUrl={SITE_URL} 
                    onOpenFullscreen={() => {
                      setDevice('mobile');
                      setIsPreviewOpen(true);
                    }}
                  />
                </div>
              </div>

              {/* Row 4: Feature Comparison */}
              <div className={`mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h3 className="text-white font-semibold mb-4 text-center">Comparativo de Recursos</h3>
                <FeatureComparison comparisons={draJuliaComparisons} />
              </div>

              {/* Row 5: Social Proof */}
              <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h3 className="text-white font-semibold mb-4 text-center">Por que confiar em mim?</h3>
                <SocialProof />
              </div>

              {/* CTA Button */}
              <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-lg transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:scale-105"
                >
                  <Globe size={22} />
                  Ver Site em Tela Cheia
                </button>
              </div>
            </div>
          </section>

          {/* ============================================
              ADMIN PANEL SHOWCASE SECTION
              ============================================ */}
          <AdminPanelShowcaseDraJulia />

          {/* ============================================
              HOSTING BONUS SECTION
              ============================================ */}
          <HostingBonusSection isVisible={isVisible} />

          {/* ============================================
              INVESTMENT SECTION - MODERNIZED
              ============================================ */}
          <section id="pricing-section" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
              {/* Section Header */}
              <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 mb-6 group hover:scale-105 transition-transform duration-300">
                  <Sparkles size={18} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-amber-400 text-sm font-semibold tracking-wide">OFERTA ESPECIAL DE LANÇAMENTO</span>
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                  Investimento <span className="bg-gradient-to-r from-[#D4A574] via-[#E8C9A9] to-[#D4A574] bg-clip-text text-transparent">Único</span>
                </h2>
                <p className="text-white/50 text-lg max-w-2xl mx-auto">
                  Sem mensalidades. Sem taxas ocultas. Apenas um pagamento.
                </p>
              </div>

              <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Main Investment Card */}
                <div className="relative group">
                  <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#D4A574]/20 via-purple-500/20 to-[#D4A574]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#D4A574]/20 via-[#D4A574]/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-purple-500/20 via-violet-500/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4A574]/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 p-8 sm:p-12">
                      {/* Pricing Section */}
                      <div className="text-center mb-10 group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="relative inline-block mb-6">
                          <div className="flex flex-col items-center gap-4">
                            {/* Old Price - Strikethrough */}
                            <div className="flex items-center gap-2">
                              <span className="text-white/70 text-lg line-through">De R$ 897,00</span>
                              <span className="px-2 py-1 rounded-md bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">-50%</span>
                            </div>
                            
                            {/* New Price - Highlighted */}
                            <div className="relative">
                              <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 rounded-2xl blur-xl animate-pulse" />
                              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-green-500/30 rounded-2xl px-8 py-6">
                                {/* Label - Above Price */}
                                <div className="mb-3 flex items-center justify-center">
                                  <span className="text-white/60 text-sm font-medium uppercase tracking-wider">por</span>
                                </div>
                                {/* Cash Price - Main Highlight */}
                                <div className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent mb-3">
                                  R$ 450<span className="text-3xl sm:text-4xl">,00</span>
                                </div>
                                {/* À Vista Label - Below Price */}
                                <div className="mb-3 flex items-center justify-center">
                                  <span className="text-white/70 text-base font-medium uppercase tracking-wider">à vista</span>
                                </div>
                                {/* Installment - Below À Vista */}
                                <div className="flex flex-col items-center gap-1 pt-3 border-t border-white/10">
                                  <span className="text-[#D4A574] text-xl sm:text-2xl font-semibold">ou 12x de R$ 37,50</span>
                                  <span className="text-white/50 text-sm">no cartão sem juros</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Urgency text */}
                        <p className="text-amber-400/80 text-sm mt-4 font-medium flex items-center justify-center gap-2 whitespace-nowrap">
                          <Sparkles size={16} className="animate-pulse flex-shrink-0" />
                          <span>O valor retornará ao padrão após o preenchimento das vagas da região.</span>
                          <Sparkles size={16} className="animate-pulse flex-shrink-0" />
                        </p>
                        
                        {/* Value proposition */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                            <CheckCircle size={18} className="text-green-400" />
                            <span className="text-green-300 text-sm font-medium">Zero Mensalidade</span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <Monitor size={18} className="text-cyan-400" />
                            <span className="text-cyan-300 text-sm font-medium">Painel Admin incluso</span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Shield size={18} className="text-amber-400" />
                            <span className="text-amber-300 text-sm font-medium">Hospedagem Vitalícia</span>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-slate-900 border border-white/10">
                          <span className="text-white/50 text-xs font-medium">O que está incluso</span>
                        </div>
                      </div>

                      {/* What's included - Enhanced Grid */}
                      <div className="flex justify-center sm:justify-center mb-10">
                        <div className="grid sm:grid-cols-2 gap-4 w-full max-w-3xl mx-auto pl-12 pr-4 sm:pl-24 sm:pr-4">
                          {includedItems.map((item, index) => (
                            <div
                              key={index}
                              className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 hover:translate-x-1 justify-start"
                            >
                              <div className="relative flex-shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300">
                                  <CheckCircle size={16} className="text-green-400" />
                                </div>
                                <div className="absolute inset-0 rounded-lg bg-green-500/20 blur-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                              </div>
                              <span className="text-white/80 text-sm font-medium group-hover/item:text-white transition-colors duration-300">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Methods - Enhanced */}
                      <div className="hidden sm:block mb-10">
                        <h3 className="text-center text-white/60 text-sm font-medium mb-4">Formas de Pagamento</h3>
                        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto px-4">
                          {paymentMethods.map((method, index) => (
                            <div
                              key={index}
                              className="group/payment relative overflow-hidden flex items-center gap-3 px-5 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4A574]/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A574]/10 to-purple-500/10 opacity-0 group-hover/payment:opacity-100 transition-opacity duration-300" />
                              
                              <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4A574]/20 to-[#D4A574]/10 border border-[#D4A574]/30 flex items-center justify-center group-hover/payment:scale-110 transition-transform duration-300">
                                  <method.icon size={20} className="text-[#D4A574]" />
                                </div>
                                <div className="text-left">
                                  <div className="text-white font-semibold text-sm">{method.name}</div>
                                  <div className="text-white/50 text-xs">{method.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Section - Enhanced */}
                      <div className="text-center space-y-4">
                        <a
                          href={PAYMENT_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/cta relative inline-flex items-center gap-3 px-12 py-6 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 blur-xl bg-green-500 transition-all duration-300" />
                          
                          <div className="relative z-10 flex items-center gap-3">
                            <CreditCard size={26} className="text-white group-hover/cta:rotate-12 group-hover/cta:scale-110 transition-all duration-300" />
                            <div className="text-left">
                              <div className="text-white font-bold text-xl">QUERO GARANTIR ESSE PREÇO</div>
                              <div className="text-white/80 text-xs font-medium">Solicitar instalação e teste (Sem pagamento agora)</div>
                            </div>
                          </div>
                        </a>
                        
                        <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                          <Shield size={16} className="text-green-400" />
                          <span>Pagamento 100% seguro via Asaas</span>
                        </div>

                        {/* Bonus Highlight */}
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30">
                          <div className="flex items-center justify-center gap-3 text-amber-400 font-semibold">
                            <Gift size={20} />
                            <span>+ BÔNUS: Isenção Vitalícia de Hospedagem (Zero Mensalidade)</span>
                          </div>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <Lock size={16} className="text-white/40" />
                            <span className="text-white/40 text-xs">Pagamento Seguro</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield size={16} className="text-white/40" />
                            <span className="text-white/40 text-xs">Garantia de 30 dias</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award size={16} className="text-white/40" />
                            <span className="text-white/40 text-xs">Suporte Incluído</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Proof - Logo Carousel */}
                <div className="mt-12">
                  <div className="text-center mb-6">
                    <h3 className="text-white/90 text-xl font-semibold mb-2">
                      Empresas que <span className="bg-gradient-to-r from-[#D4A574] to-[#E8C9A9] bg-clip-text text-transparent">confiaram</span> no meu trabalho
                    </h3>
                    <p className="text-white/50 text-sm">Mais de 50 empresas com sites modernos e de alta performance</p>
                  </div>
                  <LogoCarousel logos={clientLogos} speed="medium" />
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
              DEVELOPER SHOWCASE SECTION
              ============================================ */}
          <DeveloperShowcase />

          {/* ============================================
              FAQ SECTION
              ============================================ */}
          <FAQ />

          {/* ============================================
              FINAL CTA SECTION
              ============================================ */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                  Pronto para elevar sua <span className="text-gradient">presença digital</span>?
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto mb-4">
                  Um site profissional não é um custo, é um investimento que gera retorno todos os dias.
                </p>
                <p className="text-white/40 text-sm max-w-xl mx-auto mb-8 italic">
                  "Um consultório odontológico com um site moderno e profissional transmite segurança e confiança aos pacientes, aumentando significativamente os agendamentos."
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105"
                  >
                    <Monitor size={20} />
                    Ver Demonstração
                  </button>
                  <a
                    href={PAYMENT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-105"
                  >
                    <MessageSquare size={20} />
                    Adquirir Agora
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <WorkflowFooter />
      </div>
    </>
  );
};

export default VendasDraJulia;
