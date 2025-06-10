import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    { text: "Top 1% Global", icon: "🏆", color: "from-yellow-400 to-orange-500" },
    { text: "Clutch 5.0★", icon: "⭐", color: "from-blue-400 to-purple-500" },
    { text: "Awwwards Winner", icon: "🎯", color: "from-green-400 to-cyan-500" }
  ];

  const clientLogos = [
    { name: "TechUnicorn", logo: "🦄" },
    { name: "RetailGiant", logo: "🛍️" },
    { name: "HealthTech", logo: "🏥" },
    { name: "FinanceApp", logo: "💳" },
    { name: "LuxuryBrand", logo: "✨" }
  ];

  const stats = [
    { number: "247%", label: "ROI Médio", icon: "📈" },
    { number: "98%", label: "Satisfação", icon: "❤️" },
    { number: "150+", label: "Projetos", icon: "🚀" }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-mesh"
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
      <div className="relative z-10 text-center max-w-7xl mx-auto px-6">
        {/* Trust Layer */}
        <div className={`flex justify-center items-center gap-4 mb-12 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {trustBadges.map((badge, index) => (
            <div 
              key={index}
              className={`group flex items-center gap-3 glass-workflow px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </span>
              <span className="text-sm font-semibold text-workflow-deep">
                {badge.text}
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300`} />
            </div>
          ))}
        </div>

        {/* Main Headline with Enhanced Typography */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-12'}`}>
          <h1 className="text-responsive-4xl font-display font-bold text-workflow-deep mb-6 leading-tight">
            Não criamos <span className="relative">
              <span className="text-gradient-rainbow">landing pages</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full" />
            </span>.<br />
            Criamos <span className="text-gradient text-glow-strong">máquinas de conversão</span>.
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-workflow-energy" />
            <span className="text-workflow-energy font-mono text-sm tracking-wider">DIGITAL MASTERPIECE</span>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-workflow-energy" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-3 gap-6 mb-12 max-w-md mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-workflow-energy mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-workflow-deep/70 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Ecosystem */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-90'}`}>
          <Button 
            className="btn-primary btn-magnetic group relative overflow-hidden min-w-[240px]"
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Explorar Cases Premiados</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">🏆</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen/20 to-workflow-energy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          
          <Button 
            className="btn-secondary btn-magnetic min-w-[200px]"
            onClick={() => document.getElementById('cta-accelerator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="flex items-center gap-2">
              <span>Começar Projeto</span>
              <span className="text-workflow-energy">⚡</span>
            </span>
          </Button>
          
          <Button 
            className="btn-ghost btn-magnetic"
            onClick={() => setShowModal(true)}
          >
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 bg-workflow-energy/20 rounded-full flex items-center justify-center">
                ▶
              </span>
              <span>Demo 60s</span>
            </span>
          </Button>
        </div>

        {/* Enhanced Client Showcase */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm text-workflow-deep/60 mb-6 font-medium">Confiado por empresas inovadoras ao redor do mundo</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {clientLogos.map((client, index) => (
              <div 
                key={index}
                className="group flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-workflow-energy/5 transition-all duration-300 cursor-pointer"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {client.logo}
                </span>
                <span className="text-workflow-deep/60 group-hover:text-workflow-energy transition-colors duration-300 font-semibold">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Real-time Activity Notifications */}
      <div className="fixed bottom-6 left-6 z-20 space-y-3">
        <div className="glass-workflow p-4 rounded-2xl animate-slide-up max-w-xs" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-glow" />
              <div className="absolute inset-0 w-3 h-3 bg-success-500 rounded-full animate-ping opacity-75" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-workflow-deep">Projeto entregue</div>
              <div className="text-workflow-deep/60">E-commerce • há 2h</div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-20 space-y-3">
        <div className="glass-workflow p-4 rounded-2xl animate-slide-up max-w-xs" style={{ animationDelay: '1.2s' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-warning-500 rounded-full animate-glow" />
              <div className="absolute inset-0 w-3 h-3 bg-warning-500 rounded-full animate-ping opacity-75" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-workflow-deep">Lead qualificado</div>
              <div className="text-workflow-deep/60">SaaS B2B • há 34min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 border-2 border-workflow-energy/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-workflow-energy rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* Enhanced Demo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full relative shadow-workflow-xl">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-workflow-energy/10 hover:bg-workflow-energy/20 rounded-full flex items-center justify-center text-workflow-deep hover:text-workflow-energy transition-all duration-300 text-xl font-semibold"
            >
              ×
            </button>
            <div className="aspect-video bg-gradient-mesh rounded-2xl flex flex-col items-center justify-center text-workflow-deep relative overflow-hidden">
              <div className="absolute inset-0 bg-workflow-energy/5" />
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h3 className="text-2xl font-bold mb-2">Demo Workflow</h3>
                <p className="text-workflow-deep/70">Experiência completa em 60 segundos</p>
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
