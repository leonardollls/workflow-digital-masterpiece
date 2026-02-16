import { useState, useRef, useEffect } from 'react';

interface LogoCarouselProps {
  logos: string[];
  speed?: 'slow' | 'medium' | 'fast';
}

const LogoCarousel = ({ logos, speed = 'medium' }: LogoCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicamos os logos 2 vezes para loop suave com menos DOM nodes
  // [A, B, C] -> [A, B, C, A, B, C]
  const duplicatedLogos = [...logos, ...logos];

  // Marcar quando estamos no cliente para evitar hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calcular a porcentagem exata baseada no número de logos após renderização
  useEffect(() => {
    if (!isClient || !trackRef.current || logos.length === 0) return;

    const calculateAnimation = () => {
      if (!trackRef.current) return;
      
      const track = trackRef.current;
      const children = Array.from(track.children) as HTMLElement[];
      
      if (children.length === 0) return;
      
      // Função para calcular e aplicar a animação
      const applyAnimation = () => {
        // Calcular a largura total de um conjunto completo de logos originais
        let singleSetWidth = 0;
        for (let i = 0; i < logos.length && i < children.length; i++) {
          const child = children[i];
          if (child) {
            const rect = child.getBoundingClientRect();
            singleSetWidth += rect.width;
            // Adicionar gap (gap-8 = 2rem = 32px) exceto no último item
            if (i < logos.length - 1) {
              singleSetWidth += 32;
            }
          }
        }
        
        // Forçar reflow para garantir scrollWidth correto
        track.offsetHeight;
        
        // Calcular a largura total de todos os logos duplicados
        const totalWidth = track.scrollWidth;
        
        if (totalWidth > 0 && singleSetWidth > 0) {
          // Calcular a porcentagem exata para mover exatamente um conjunto
          const percentage = (singleSetWidth / totalWidth) * 100;
          
          // Criar ou atualizar os keyframes dinamicamente
          const styleId = 'logo-carousel-dynamic-keyframes';
          let styleElement = document.getElementById(styleId) as HTMLStyleElement;
          
          if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
          }
          
          styleElement.textContent = `
            @keyframes logo-carousel-scroll {
              from {
                transform: translate3d(0, 0, 0);
              }
              to {
                transform: translate3d(-${percentage}%, 0, 0);
              }
            }
          `;
        }
      };
      
      // Aguardar que todas as imagens carreguem para cálculo preciso
      const images = track.querySelectorAll('img');
      const totalImages = images.length;
      
      if (totalImages === 0) {
        // Se não houver imagens, calcular imediatamente após um frame
        requestAnimationFrame(() => {
          requestAnimationFrame(applyAnimation);
        });
      } else {
        // Aguardar todas as imagens carregarem
        let loadedImages = 0;
        const checkAndCalculate = () => {
          loadedImages++;
          if (loadedImages >= totalImages) {
            // Aguardar um frame adicional para garantir layout completo
            requestAnimationFrame(() => {
              requestAnimationFrame(applyAnimation);
            });
          }
        };
        
        images.forEach((img) => {
          if (img.complete) {
            checkAndCalculate();
          } else {
            img.addEventListener('load', checkAndCalculate, { once: true });
            img.addEventListener('error', checkAndCalculate, { once: true });
          }
        });
      }
    };
    
    // Aguardar múltiplos frames para garantir renderização completa
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        calculateAnimation();
      });
    });
  }, [logos.length, isClient]);

  return (
    <div className="relative w-full py-8 overflow-hidden">
      {/* Gradient masks for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
      
      {/* Container do carousel */}
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={trackRef}
          className={`logo-carousel-track speed-${speed} ${isPaused ? 'paused' : ''}`}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`logo-${index}`}
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
    </div>
  );
};

export default LogoCarousel;
