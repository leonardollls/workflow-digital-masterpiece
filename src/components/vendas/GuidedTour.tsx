import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Eye, Users, Briefcase, UserCircle, Phone, Maximize2 } from 'lucide-react';

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  scrollPercent: number;
  icon: React.ReactNode;
  highlightColor: string;
}

interface GuidedTourProps {
  siteUrl: string;
  onOpenFullscreen?: () => void;
}

const GuidedTour = ({ siteUrl, onOpenFullscreen }: GuidedTourProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slides: CarouselSlide[] = [
    {
      id: 'hero',
      title: 'Hero Impactante',
      description: 'Primeira impressão profissional com imagem do escritório e call-to-action estratégico.',
      scrollPercent: 0,
      icon: <Eye size={20} />,
      highlightColor: '#D4A574',
    },
    {
      id: 'sobre',
      title: 'Quem Somos',
      description: 'História, missão, visão e valores em cards interativos com badge de 35 anos.',
      scrollPercent: 12,
      icon: <Users size={20} />,
      highlightColor: '#3B82F6',
    },
    {
      id: 'servicos',
      title: 'Serviços Premium',
      description: 'Os 4 departamentos apresentados em cards expansíveis com detalhes completos.',
      scrollPercent: 30,
      icon: <Briefcase size={20} />,
      highlightColor: '#8B5CF6',
    },
    {
      id: 'equipe',
      title: 'Equipe Profissional',
      description: 'Fotos reais dos sócios com efeitos hover sofisticados e banner de vagas.',
      scrollPercent: 55,
      icon: <UserCircle size={20} />,
      highlightColor: '#22C55E',
    },
    {
      id: 'contato',
      title: 'Formulário Inteligente',
      description: 'Validação em tempo real, integração WhatsApp e Google Maps.',
      scrollPercent: 80,
      icon: <Phone size={20} />,
      highlightColor: '#EF4444',
    },
  ];

  // Auto-play com loop infinito
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
      return;
    }

    autoPlayRef.current = setTimeout(() => {
      goToNext();
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentSlide]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const goToSlide = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection(dir);
    setCurrentSlide(index);

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex, 'next');
  }, [currentSlide, slides.length, goToSlide]);

  const goToPrev = useCallback(() => {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevIndex, 'prev');
  }, [currentSlide, slides.length, goToSlide]);

  const handleDotClick = (index: number) => {
    if (index === currentSlide) return;
    const dir = index > currentSlide ? 'next' : 'prev';
    goToSlide(index, dir);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full">
      {/* Main Carousel Container */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl group">
        {/* Slides Container */}
        <div className="relative aspect-video overflow-hidden">
          {/* All slides rendered for smooth transition */}
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            const isPrev = direction === 'next' 
              ? index === (currentSlide - 1 + slides.length) % slides.length
              : index === (currentSlide + 1) % slides.length;
            
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-600 ease-out ${
                  isActive 
                    ? 'opacity-100 translate-x-0 scale-100 z-10' 
                    : isPrev 
                    ? direction === 'next'
                      ? 'opacity-0 -translate-x-full scale-95 z-0'
                      : 'opacity-0 translate-x-full scale-95 z-0'
                    : 'opacity-0 translate-x-full scale-95 z-0'
                }`}
                style={{ transitionDuration: '600ms' }}
              >
                {/* Iframe container with scroll position */}
                <div 
                  className="absolute inset-0"
                  style={{
                    transform: `translateY(-${slide.scrollPercent}%)`,
                    transition: 'transform 0.6s ease-out',
                  }}
                >
                  <iframe
                    src={siteUrl}
                    title={`Preview - ${slide.title}`}
                    className="w-full border-0 pointer-events-none"
                    style={{
                      transform: 'scale(0.5)',
                      transformOrigin: 'top left',
                      width: '200%',
                      height: '600%',
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(
                      to bottom,
                      transparent 0%,
                      transparent 50%,
                      rgba(0,0,0,0.7) 80%,
                      rgba(0,0,0,0.9) 100%
                    )`,
                  }}
                />

                {/* Section highlight indicator */}
                <div
                  className={`absolute inset-x-4 top-4 h-1 rounded-full transition-all duration-500 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: slide.highlightColor }}
                />
              </div>
            );
          })}

          {/* Navigation arrows */}
          <button
            onClick={() => { goToPrev(); setIsAutoPlaying(false); }}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 disabled:opacity-30"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => { goToNext(); setIsAutoPlaying(false); }}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110 disabled:opacity-30"
            aria-label="Próximo slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Fullscreen button */}
          {onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 hover:scale-110"
              aria-label="Tela cheia"
            >
              <Maximize2 size={18} />
            </button>
          )}
        </div>

        {/* Bottom Info Panel */}
        <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black via-black/95 to-transparent -mt-20 pt-24">
          {/* Current slide info */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
                style={{ 
                  backgroundColor: `${currentSlideData.highlightColor}20`,
                  borderColor: `${currentSlideData.highlightColor}40`,
                  borderWidth: '1px',
                }}
              >
                <span style={{ color: currentSlideData.highlightColor }}>
                  {currentSlideData.icon}
                </span>
                <span 
                  className="text-xs font-bold"
                  style={{ color: currentSlideData.highlightColor }}
                >
                  {currentSlide + 1}/{slides.length}
                </span>
              </div>
              <h4 className="text-white font-semibold text-lg transition-all duration-300">
                {currentSlideData.title}
              </h4>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xl transition-all duration-300">
              {currentSlideData.description}
            </p>
          </div>

          {/* Dot indicators with progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => handleDotClick(index)}
                  className={`relative transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 h-3' 
                      : 'w-3 h-3 hover:scale-125'
                  }`}
                  aria-label={`Ir para ${slide.title}`}
                >
                  {/* Background */}
                  <div 
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                  
                  {/* Progress fill for active dot */}
                  {index === currentSlide && isAutoPlaying && (
                    <div 
                      className="absolute inset-0 rounded-full overflow-hidden"
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: currentSlideData.highlightColor,
                          animation: 'progressFill 4s linear',
                          animationPlayState: isAutoPlaying ? 'running' : 'paused',
                        }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Play/Pause button */}
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-white text-slate-900 hover:bg-white/90'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isAutoPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
              {isAutoPlaying ? 'Pausar' : 'Reproduzir'}
            </button>
          </div>
        </div>

        {/* Animated border effect */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
          style={{
            boxShadow: `inset 0 0 0 2px ${currentSlideData.highlightColor}20`,
          }}
        />
      </div>

      {/* Thumbnail strip below */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => handleDotClick(index)}
            className={`relative flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentSlide 
                ? 'ring-2 ring-offset-2 ring-offset-slate-950 scale-105' 
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              ringColor: index === currentSlide ? currentSlideData.highlightColor : 'transparent',
            }}
          >
            {/* Thumbnail iframe */}
            <div 
              className="absolute inset-0"
              style={{
                transform: `translateY(-${slide.scrollPercent * 0.15}px)`,
              }}
            >
              <iframe
                src={siteUrl}
                title={`Thumbnail - ${slide.title}`}
                className="w-full border-0 pointer-events-none"
                style={{
                  transform: 'scale(0.12)',
                  transformOrigin: 'top left',
                  width: '833%',
                  height: '1000%',
                }}
                loading="lazy"
              />
            </div>

            {/* Overlay with icon */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                index === currentSlide ? 'bg-black/30' : 'bg-black/50'
              }`}
            >
              <span 
                className="text-white/80"
                style={{ color: index === currentSlide ? slide.highlightColor : undefined }}
              >
                {slide.icon}
              </span>
            </div>

            {/* Active indicator */}
            {index === currentSlide && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: slide.highlightColor }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GuidedTour;
