import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import logoWorkflow from '@/assets/logo-workflow.png';

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [logoSrc, setLogoSrc] = useState(logoWorkflow);
  const [logoAttempts, setLogoAttempts] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile com breakpoints mais precisos
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    console.log('🔍 Logo inicial carregado:', logoWorkflow);
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Trust badges redesenhados para melhor UX mobile
  const trustBadges = useMemo(() => [
    { 
      text: "Alta Performance", 
      icon: "🔥", 
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    { 
      text: "Clutch 5.0★", 
      icon: "⭐", 
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-50", 
      textColor: "text-yellow-700"
    },
    { 
      text: "Awwwards Winner", 
      icon: "🏆", 
      color: "from-blue-400 to-purple-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    }
  ], []);

  // Stats redesenhados com mais impacto visual
  const stats = useMemo(() => [
    { 
      number: "247%", 
      label: "ROI Médio", 
      icon: "📈",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    { 
      number: "98%", 
      label: "Satisfação", 
      icon: "❤️",
      color: "text-red-500", 
      bgColor: "bg-red-50"
    },
    { 
      number: "150+", 
      label: "Projetos", 
      icon: "🚀",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ], []);

  // Elementos flutuantes otimizados
  const floatingElements = useMemo(() => {
    const count = isMobile ? 6 : 20;
    return [...Array(count)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-workflow-energy/20 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ));
  }, [isMobile]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-mesh"
    >
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Floating Elements - otimizado para mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>

      {/* Main Content - Melhorado para mobile */}
      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Logo - Otimizado para mobile */}
        <div className={`flex justify-center mb-6 sm:mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-energy/20 to-workflow-zen/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <img 
              src={logoSrc} 
              alt="Workflow Digital Masterpiece" 
              className="relative h-16 sm:h-20 md:h-28 lg:h-32 w-auto object-contain hover:scale-105 transition-transform duration-300 filter drop-shadow-lg"
              loading="eager"
              onError={(e) => {
                const currentAttempt = logoAttempts + 1;
                setLogoAttempts(currentAttempt);
                console.error(`❌ Tentativa ${currentAttempt} falhou para:`, logoSrc);
                
                const fallbackPaths = [
                  "/logo-workflow.png",
                  "/Images/logo-workflow-sem-fundo.png", 
                  "/images/logo-workflow-sem-fundo.png",
                  "./Images/logo-workflow-sem-fundo.png"
                ];
                
                if (currentAttempt <= fallbackPaths.length) {
                  const nextPath = fallbackPaths[currentAttempt - 1];
                  console.log(`🔄 Tentativa ${currentAttempt}: Tentando ${nextPath}`);
                  setLogoSrc(nextPath);
                } else {
                  console.error('💀 Todas as tentativas de carregar o logo falharam');
                  e.currentTarget.style.display = 'none';
                }
              }}
              onLoad={() => {
                console.log('✅ Logo carregado com sucesso!');
                console.log('📁 Caminho que funcionou:', logoSrc);
                console.log('🎯 Número de tentativas:', logoAttempts + 1);
              }}
            />
          </div>
        </div>

        {/* Trust Layer - Redesenhado para mobile */}
        <div className={`mb-8 sm:mb-10 md:mb-12 lg:mb-16 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile: Layout compacto em grid */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:hidden">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className={`group flex items-center gap-1.5 ${badge.bgColor} border border-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-sm group-hover:scale-110 transition-transform duration-300">
                  {badge.icon}
                </span>
                <span className={`text-xs font-semibold ${badge.textColor}`}>
                  {badge.text}
                </span>
              </div>
            ))}
          </div>

          {/* Tablet/Desktop: Layout horizontal original */}
          <div className="hidden sm:flex justify-center items-center gap-3 md:gap-4 lg:gap-6">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className={`group flex items-center gap-2 sm:gap-3 glass-workflow px-4 md:px-6 lg:px-8 py-2.5 md:py-3 lg:py-4 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-lg md:text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-300">
                  {badge.icon}
                </span>
                <span className="text-sm md:text-base font-semibold text-workflow-deep">
                  {badge.text}
                </span>
                <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Headline - Otimizado para mobile */}
        <div className={`mb-6 sm:mb-8 md:mb-8 lg:mb-10 px-2 sm:px-4 md:px-0 transition-all duration-1000 delay-200 ${isVisible ? 'animate-scale-in' : 'opacity-0 translate-y-12'}`}>
          {/* Mobile: Título mais compacto */}
          <h1 className="sm:hidden text-2xl font-display font-bold text-workflow-deep mb-4 leading-tight">
            Não criamos{' '}
            <span className="text-gradient-rainbow">landing pages</span>.
            <br />
            Criamos{' '}
            <span className="text-gradient text-glow-subtle">máquinas de conversão</span>.
          </h1>
          
          {/* Tablet/Desktop: Título original */}
          <h1 className="hidden sm:block text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-bold text-workflow-deep mb-4 md:mb-6 lg:mb-8 leading-tight">
            Não criamos<br />
            <span className="text-gradient-rainbow">landing pages</span>.<br />
            Criamos <span className="text-gradient text-glow-subtle">máquinas de conversão</span>.
          </h1>
          
          {/* Tagline otimizada */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6">
            <div className="w-4 sm:w-12 md:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-transparent to-workflow-energy" />
            <span className="text-workflow-energy font-mono text-xs sm:text-sm md:text-base tracking-wider">DIGITAL MASTERPIECE</span>
            <div className="w-4 sm:w-12 md:w-16 lg:w-20 h-0.5 bg-gradient-to-l from-transparent to-workflow-energy" />
          </div>
        </div>

        {/* Stats Grid - Redesenhado com cards */}
        <div className={`mb-8 sm:mb-10 md:mb-12 lg:mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {/* Mobile: Cards compactos */}
          <div className="grid grid-cols-3 gap-3 sm:hidden max-w-sm mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className={`group relative ${stat.bgColor} border border-white/20 backdrop-blur-sm rounded-2xl p-3 hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm`}>
                <div className="text-center">
                  <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className={`text-lg font-bold ${stat.color} mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-600 font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet/Desktop: Grid original melhorado */}
          <div className="hidden sm:grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-lg md:text-2xl lg:text-3xl font-bold text-workflow-energy mb-1">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-workflow-deep/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Ecosystem - Otimizado para mobile */}
        <div className={`flex flex-col gap-4 sm:gap-4 md:gap-6 lg:gap-8 justify-center items-center mb-10 sm:mb-12 md:mb-16 lg:mb-20 px-2 sm:px-4 md:px-0 transition-all duration-1000 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-90'}`}>
          
          {/* CTA Principal - Melhorado para mobile */}
          <Button 
            className="btn-primary btn-magnetic group relative overflow-hidden w-full max-w-sm sm:w-auto md:min-w-[280px] h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl"
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
              <span>🎨</span>
              <span>Ver Criações Recentes</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/20 to-workflow-energy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          {/* CTAs Secundários */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-sm sm:w-auto">
            <Button 
              className="btn-secondary btn-magnetic w-full sm:w-auto md:min-w-[220px] h-10 sm:h-12 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl"
              onClick={() => document.getElementById('methodology-lab')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🔬</span>
                <span>Metodologia Científica</span>
              </span>
            </Button>
            
            <Button 
              className="btn-ghost btn-magnetic w-full sm:w-auto md:min-w-[180px] h-10 sm:h-12 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl border border-workflow-energy/20"
              onClick={() => document.getElementById('capability-matrix')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-workflow-energy/20 rounded-full flex items-center justify-center">
                  <span className="text-xs sm:text-sm">⚡</span>
                </span>
                <span>Arsenal Tecnológico</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Melhorado */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 sm:w-6 sm:h-10 border-2 border-workflow-energy/40 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-workflow-energy/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

      {/* Modal placeholder - mantido para compatibilidade */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Modal Content</h3>
            <Button onClick={() => setShowModal(false)}>Fechar</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
