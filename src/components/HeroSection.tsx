import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import logoWorkflow from '@/assets/logo-workflow.png';

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [logoSrc, setLogoSrc] = useState(logoWorkflow);
  const [logoAttempts, setLogoAttempts] = useState(0);

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

  const trustBadges = [
    { text: "Alta Performance", icon: "🔥", color: "from-yellow-400 to-orange-500" },
    { text: "Clutch 5.0★", icon: "⭐", color: "from-blue-400 to-purple-500" },
    { text: "Awwwards Winner", icon: "🎯", color: "from-green-400 to-cyan-500" }
  ];

  const stats = [
    { number: "247%", label: "ROI Médio", icon: "📈" },
    { number: "98%", label: "Satisfação", icon: "❤️" },
    { number: "150+", label: "Projetos", icon: "🚀" }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen sm:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-mesh py-8 sm:py-12"
    >
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-workflow-energy/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6">
        {/* Logo */}
        <div className={`flex justify-center mb-6 sm:mb-8 lg:mb-10 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <img 
            src={logoSrc} 
            alt="Workflow Digital Masterpiece" 
            className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain hover:scale-105 transition-transform duration-300"
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

        {/* Trust Layer - Mobile Optimized */}
        <div className={`flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {trustBadges.map((badge, index) => (
            <div 
              key={index}
              className={`group flex items-center gap-2 sm:gap-3 glass-workflow px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer text-xs sm:text-sm`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-base sm:text-lg lg:text-xl group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </span>
              <span className="font-semibold text-workflow-deep whitespace-nowrap">
                {badge.text}
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300`} />
            </div>
          ))}
        </div>

        {/* Main Headline with Enhanced Typography - Mobile Optimized */}
        <div className={`mb-6 sm:mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-12'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-bold text-workflow-deep mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
            Não criamos{' '}
            <span className="relative inline-block">
              <span className="text-gradient-rainbow">landing pages</span>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full" />
            </span>
            .<br className="hidden sm:inline" />
            <span className="sm:hidden"> </span>
            Criamos{' '}
            <span className="text-gradient text-glow-subtle">máquinas de conversão</span>.
          </h1>
          
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-8 sm:w-12 lg:w-16 h-0.5 bg-gradient-to-r from-transparent to-workflow-energy" />
            <span className="text-workflow-energy font-mono text-xs sm:text-sm tracking-wider">DIGITAL MASTERPIECE</span>
            <div className="w-8 sm:w-12 lg:w-16 h-0.5 bg-gradient-to-l from-transparent to-workflow-energy" />
          </div>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className={`grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10 lg:mb-12 max-w-xs sm:max-w-sm lg:max-w-md mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-xl sm:text-2xl lg:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-workflow-energy mb-1">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-workflow-deep/70 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Ecosystem - Mobile Optimized */}
        <div className={`flex flex-col gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-90'}`}>
          <Button 
            className="btn-primary btn-magnetic group relative overflow-hidden w-full max-w-xs sm:max-w-sm lg:max-w-none sm:w-auto min-w-0 sm:min-w-[240px] text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4"
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Criações Recentes</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">🎨</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/20 to-workflow-energy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button 
              className="btn-secondary btn-magnetic w-full sm:w-auto min-w-0 sm:min-w-[200px] text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4"
              onClick={() => document.getElementById('methodology-lab')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center justify-center gap-2">
                <span>Metodologia Científica</span>
                <span className="text-workflow-energy">🔬</span>
              </span>
            </Button>
            
            <Button 
              className="btn-ghost btn-magnetic w-full sm:w-auto text-sm sm:text-base px-6 py-3"
              onClick={() => document.getElementById('capability-matrix')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-workflow-energy/20 rounded-full flex items-center justify-center">
                  ⚡
                </span>
                <span>Arsenal Tecnológico</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on Mobile */}
      <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 border-2 border-workflow-energy/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-workflow-energy rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* Enhanced Demo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-4xl w-full relative shadow-workflow-xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-workflow-energy/10 hover:bg-workflow-energy/20 rounded-full flex items-center justify-center text-workflow-deep hover:text-workflow-energy transition-all duration-300 text-lg sm:text-xl font-semibold"
            >
              ×
            </button>
            <div className="aspect-video bg-gradient-mesh rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-workflow-deep relative overflow-hidden">
              <div className="absolute inset-0 bg-workflow-energy/5" />
              <div className="relative z-10 text-center px-4">
                <div className="text-4xl sm:text-6xl mb-4">🎬</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Demo Workflow</h3>
                <p className="text-workflow-deep/70 text-sm sm:text-base">Experiência completa em 60 segundos</p>
                <Button className="btn-primary mt-6">
                  <span className="flex items-center gap-2">
                    <span>▶</span>
                    <span>Reproduzir Demo</span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
