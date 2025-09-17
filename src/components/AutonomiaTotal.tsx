import { useState, useRef, useEffect } from 'react';
import { X, Check, Edit3, Clock, DollarSign, Users, Zap, Eye, History, Shield, GripVertical } from 'lucide-react';

const AutonomiaTotal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-animation for the slider with pause at the end
  useEffect(() => {
    if (!isDragging && !isPaused) {
      const interval = setInterval(() => {
        setSliderPosition(prev => {
          if (prev >= 95) {
            setIsPaused(true);
            // Pause for 3 seconds at the end (showing Workflow Services)
            setTimeout(() => {
              setIsPaused(false);
              setSliderPosition(5); // Reset to start
            }, 3000);
            return prev;
          }
          return prev + 0.3;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isDragging, isPaused]);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleSliderMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleSliderMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault();
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global mouse move and mouse up listeners when dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleSliderMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const othersFeatures = [
    {
      icon: X,
      title: "Páginas engessadas e difíceis de alterar",
      description: "Código complexo que só o desenvolvedor consegue modificar",
      color: "text-red-500"
    },
    {
      icon: DollarSign,
      title: "Cobrança para cada pequena mudança",
      description: "Taxa adicional para trocar um texto ou imagem simples",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Dependência total do desenvolvedor",
      description: "Precisa aguardar disponibilidade para qualquer ajuste",
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "Longa espera para ajustes simples",
      description: "Dias ou semanas para mudanças que deveriam ser instantâneas",
      color: "text-red-500"
    }
  ];

  const workflowFeatures = [
    {
      icon: Edit3,
      title: "Edição 100% visual e intuitiva",
      description: "Interface de clique e edite, sem conhecimento técnico necessário",
      color: "text-workflow-zen"
    },
    {
      icon: Zap,
      title: "Alterações instantâneas e sem custos",
      description: "Mude textos, imagens e elementos quando quiser, sem pagar nada extra",
      color: "text-workflow-zen"
    },
    {
      icon: Eye,
      title: "Preview antes de publicar",
      description: "Visualize todas as mudanças antes de torná-las públicas",
      color: "text-workflow-zen"
    },
    {
      icon: History,
      title: "Histórico de versões completo",
      description: "Reverta qualquer alteração com um clique, sem perder trabalho",
      color: "text-workflow-zen"
    },
    {
      icon: Shield,
      title: "Zero dependência técnica",
      description: "Você tem controle total, sem precisar de programador no dia a dia",
      color: "text-workflow-zen"
    },
    {
      icon: Check,
      title: "Controle total da página",
      description: "Edite textos, imagens, cores, layouts e elementos visuais livremente",
      color: "text-workflow-zen"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-br from-workflow-deep via-gray-900 to-workflow-deep relative overflow-hidden"
      id="autonomia-total"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-workflow-zen/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-workflow-accent/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 sm:mb-20 md:mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            <div className="w-8 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
            <span className="text-workflow-zen font-mono text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-medium">
              Diferencial Exclusivo
            </span>
            <div className="w-8 sm:w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-workflow-zen to-transparent rounded-full" />
          </div>
          
          <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-6 sm:mb-8 md:mb-10 leading-tight">
            Autonomia{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-workflow-zen via-workflow-accent to-workflow-energy bg-clip-text text-transparent">
                Total
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-workflow-zen/0 via-workflow-zen/60 to-workflow-zen/0 rounded-full" />
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Veja a diferença entre o que{' '}
            <span className="text-red-400 font-semibold">outros profissionais oferecem</span>
            {' '}vs{' '}
            <span className="text-workflow-zen font-semibold">o que a Workflow Services entrega</span>
          </p>
        </div>

        {/* Visual Comparison Slider */}
        <div className={`max-w-6xl mx-auto mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div 
            ref={sliderRef}
            className="relative aspect-video w-full h-96 overflow-hidden rounded-3xl border border-white/10 shadow-2xl cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
          >
            {/* Others Side (Right) */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-xl">
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center select-none">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 select-none">Outros Profissionais</h3>
                  <p className="text-red-200 text-lg max-w-md select-none">
                    Páginas engessadas, cobranças extras e dependência total do desenvolvedor
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Side (Left) */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-workflow-zen/20 to-workflow-accent/10 backdrop-blur-xl"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center select-none">
                  <div className="w-24 h-24 bg-workflow-zen rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-12 h-12 text-workflow-deep" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 select-none">Workflow Services</h3>
                  <p className="text-workflow-zen text-lg max-w-md select-none">
                    Edição visual 100% intuitiva, alterações instantâneas e autonomia total
                  </p>
                </div>
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white/80 z-20 cursor-ew-resize shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            ></div>


          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Others Side */}
            <div className={`transition-all duration-700 opacity-100 scale-100 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 h-full hover:border-red-500/50 transition-colors duration-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                    <X className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">O que outros oferecem</h3>
                  <p className="text-red-200">Limitações que prejudicam seu negócio</p>
                </div>

                <div className="space-y-6">
                  {othersFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-red-200 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Workflow Side */}
            <div className={`transition-all duration-700 opacity-100 scale-100 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`} style={{ transitionDelay: '700ms' }}>
              <div className="bg-gradient-to-br from-workflow-zen/20 to-workflow-accent/10 backdrop-blur-xl border border-workflow-zen/30 rounded-3xl p-8 h-full hover:border-workflow-zen/50 transition-colors duration-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-workflow-zen rounded-2xl flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                    <Check className="w-8 h-8 text-workflow-deep" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">O que nós entregamos</h3>
                  <p className="text-workflow-zen">Independência completa para seu sucesso</p>
                </div>

                <div className="space-y-6">
                  {workflowFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-workflow-zen/10 border border-workflow-zen/20 hover:bg-workflow-zen/20 hover:border-workflow-zen/40 transition-all duration-300 transform hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-12 h-12 bg-workflow-zen/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-workflow-zen/10 backdrop-blur-lg border border-workflow-zen/20 rounded-2xl p-8 max-w-6xl mx-auto hover:bg-workflow-zen/15 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-workflow-zen" />
                <h4 className="text-xl font-bold text-workflow-zen text-center sm:text-left">Garantia de Suporte Completo</h4>
              </div>
              <p className="text-gray-300 leading-relaxed">
                <span className="font-semibold text-workflow-zen">*Compromisso Total:</span> Disponibilizamos quaisquer edições mais avançadas ou complexas necessárias dentro de 7 dias após a entrega, sem custo adicional. Sua autonomia é nossa prioridade, mas estamos sempre aqui quando precisar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutonomiaTotal; 