
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';

const HeroSection = () => {
  const [leadsGenerated, setLeadsGenerated] = useState(15847);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate real-time lead generation
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLeadsGenerated(prev => prev + 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const trustBadges = [
    { text: "Top 1% Agencies", icon: "🏆" },
    { text: "Clutch 5.0★", icon: "⭐" },
    { text: "Awwwards Winner", icon: "🎯" }
  ];

  const clientLogos = [
    "TechUnicorn", "RetailGiant", "HealthTech", "FinanceApp", "LuxuryBrand"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Trust Layer */}
        <div className="flex justify-center items-center gap-8 mb-8 animate-fade-in">
          {trustBadges.map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 glass-workflow px-4 py-2 rounded-full animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className="text-xl">{badge.icon}</span>
              <span className="text-sm font-medium text-workflow-deep">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Main Headline */}
        <h1 className="text-responsive-3xl font-display font-bold text-workflow-deep mb-6 animate-slide-up">
          Não criamos landing pages.<br />
          Criamos <span className="text-gradient">máquinas de conversão</span>.
        </h1>

        {/* Dynamic Subline */}
        <p className="text-responsive-lg text-workflow-deep/80 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 bg-success rounded-full animate-glow"></span>
            <strong className="text-workflow-energy font-semibold">
              {leadsGenerated.toLocaleString('pt-BR')}
            </strong>
            leads gerados e contando...
          </span>
        </p>

        {/* CTA Ecosystem */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <Button 
            className="btn-primary group relative overflow-hidden"
            onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10">Explorar Cases Premiados</span>
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-zen to-workflow-energy opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <Button 
            variant="outline" 
            className="btn-secondary"
            onClick={() => document.getElementById('cta-accelerator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Começar Meu Projeto
          </Button>
          
          <Button 
            variant="ghost" 
            className="btn-ghost"
            onClick={() => setShowModal(true)}
          >
            ▶ Assistir Demo 60s
          </Button>
        </div>

        {/* Client Carousel */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-workflow-deep/60 mb-4">Confiado por empresas inovadoras:</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {clientLogos.map((logo, index) => (
              <div 
                key={index}
                className="text-workflow-deep/40 hover:text-workflow-energy transition-colors duration-300 font-semibold text-lg cursor-pointer"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Ticker */}
        <div className="fixed bottom-6 left-6 glass-workflow p-3 rounded-lg animate-slide-up z-20" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-glow"></div>
            <span className="text-workflow-deep font-medium">Projeto entregue há 2h</span>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 glass-workflow p-3 rounded-lg animate-slide-up z-20" style={{ animationDelay: '1.2s' }}>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-warning rounded-full animate-glow"></div>
            <span className="text-workflow-deep font-medium">Lead gerado há 34min</span>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-workflow-deep hover:text-workflow-energy transition-colors text-2xl"
            >
              ×
            </button>
            <div className="aspect-video bg-workflow-deep rounded-lg flex items-center justify-center text-white text-xl">
              🎬 Demo Workflow (60s)
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
