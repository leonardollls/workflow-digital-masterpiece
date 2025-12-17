import { useEffect, useState } from 'react';

interface LogoCarouselProps {
  logos: string[];
  speed?: 'slow' | 'medium' | 'fast';
}

const LogoCarousel = ({ logos, speed = 'medium' }: LogoCarouselProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Duplicamos os logos para criar o efeito infinito sem gaps
  const duplicatedLogos = [...logos, ...logos, ...logos];

  // Definir velocidade da animação
  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow': return '60s';
      case 'fast': return '20s';
      default: return '40s';
    }
  };

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Container do carousel */}
      <div className="flex items-center justify-center">
        <div 
          className={`flex gap-8 items-center ${mounted ? 'animate-logo-scroll' : ''}`}
          style={{
            animationDuration: getAnimationDuration(),
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex-shrink-0 w-48 h-28 sm:w-56 sm:h-32 md:w-64 md:h-36 flex items-center justify-center group cursor-pointer"
            >
              <div className="relative w-full h-full">
                {/* Glow effect no hover */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#D4A574]/0 via-purple-500/0 to-violet-500/0 group-hover:from-[#D4A574]/20 group-hover:via-purple-500/10 group-hover:to-violet-500/20 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                
                {/* Screenshot container - simulando browser window */}
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-[#D4A574]/30 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_rgba(212,165,116,0.15)]">
                  {/* Browser top bar */}
                  <div className="absolute top-0 left-0 right-0 h-5 bg-slate-800/80 backdrop-blur-sm border-b border-white/5 flex items-center px-2 gap-1.5 z-10">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/70" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                      <div className="w-2 h-2 rounded-full bg-green-500/70" />
                    </div>
                  </div>
                  
                  {/* Screenshot image */}
                  <img
                    src={logo}
                    alt={`Cliente ${index + 1}`}
                    className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                    loading="lazy"
                    style={{ marginTop: '20px' }}
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logo-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-logo-scroll {
          animation-name: logo-scroll;
        }

        /* Pause animation on hover */
        .animate-logo-scroll:hover {
          animation-play-state: paused;
        }

        /* Ensure smooth scrolling with GPU acceleration */
        @media (prefers-reduced-motion: no-preference) {
          .animate-logo-scroll {
            will-change: transform;
            transform: translateZ(0);
            backface-visibility: hidden;
          }
        }

        /* Disable animation for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-logo-scroll {
            animation: none !important;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel;
