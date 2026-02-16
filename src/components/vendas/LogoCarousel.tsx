import { useState, useRef, useEffect } from 'react';

interface LogoCarouselProps {
  logos: string[];
  speed?: 'slow' | 'medium' | 'fast';
}

const LogoCarousel = ({ logos, speed = 'medium' }: LogoCarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const trackRef = useRef<HTMLDivElement>(null);

  // Função para codificar caminhos de imagem corretamente
  // Em produção (Vercel), espaços e caracteres especiais em nomes de arquivo precisam ser codificados
  // Usamos uma abordagem conservadora: codificar apenas o necessário
  const encodeImagePath = (path: string): string => {
    // Em Vite/Vercel, arquivos em /public são servidos na raiz
    // Precisamos codificar apenas espaços e caracteres problemáticos no nome do arquivo
    try {
      // Se o caminho já começa com /, manter; caso contrário, adicionar
      const normalizedPath = path.startsWith('/') ? path : '/' + path;
      
      // Separar o caminho em partes (diretórios e nome do arquivo)
      const parts = normalizedPath.split('/').filter(Boolean); // Remove partes vazias
      if (parts.length === 0) return normalizedPath;
      
      // Última parte é o nome do arquivo
      const filename = parts[parts.length - 1];
      // Codificar apenas espaços no nome do arquivo (mais comum em produção)
      // Outros caracteres especiais serão tratados no retry
      const encodedFilename = filename.replace(/\s+/g, '%20');
      
      // Reconstruir o caminho mantendo diretórios intactos
      parts[parts.length - 1] = encodedFilename;
      return '/' + parts.join('/');
    } catch {
      // Se houver erro, retornar caminho original
      return path;
    }
  };

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
                  {!failedImages.has(logo) ? (
                    <img
                      src={encodeImagePath(logo)}
                      alt={`Cliente ${index + 1}`}
                      className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 absolute inset-0"
                      style={{ top: '20px', bottom: 0 }}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const retryCount = parseInt(target.dataset.retryCount || '0', 10);
                        
                        // Estratégia de retry: tentar diferentes codificações
                        if (retryCount === 0) {
                          // Tentativa 1: caminho original sem codificação (caso a codificação inicial tenha falhado)
                          target.dataset.retryCount = '1';
                          // Garantir que o caminho comece com /
                          const originalPath = logo.startsWith('/') ? logo : '/' + logo;
                          target.src = originalPath;
                          return;
                        } else if (retryCount === 1) {
                          // Tentativa 2: codificar apenas espaços manualmente em todo o caminho
                          target.dataset.retryCount = '2';
                          const pathWithSpaces = logo.startsWith('/') ? logo : '/' + logo;
                          target.src = pathWithSpaces.replace(/\s+/g, '%20');
                          return;
                        } else if (retryCount === 2) {
                          // Tentativa 3: usar encodeURI para codificar caracteres especiais (exceto /, :, etc)
                          target.dataset.retryCount = '3';
                          try {
                            const pathToEncode = logo.startsWith('/') ? logo : '/' + logo;
                            // encodeURI não codifica /, então precisamos codificar manualmente o nome do arquivo
                            const parts = pathToEncode.split('/');
                            const encodedParts = parts.map((part, idx) => {
                              if (idx === parts.length - 1 && part) {
                                // Última parte: codificar caracteres especiais
                                return encodeURIComponent(part);
                              }
                              return part;
                            });
                            target.src = encodedParts.join('/');
                          } catch {
                            // Se encodeURIComponent falhar, marcar como falha
                            setFailedImages(prev => new Set(prev).add(logo));
                            target.style.display = 'none';
                            const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement;
                            if (placeholder) {
                              placeholder.style.display = 'flex';
                            }
                          }
                          return;
                        }
                        
                        // Após todas as tentativas, marcar como falha e mostrar placeholder
                        setFailedImages(prev => new Set(prev).add(logo));
                        target.style.display = 'none';
                        const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                      onLoad={(e) => {
                        // Quando a imagem carregar com sucesso, esconder placeholder se existir
                        const target = e.target as HTMLImageElement;
                        const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'none';
                        }
                        // Garantir que a imagem esteja visível
                        target.style.display = 'block';
                        // Remover da lista de falhas se estava lá
                        setFailedImages(prev => {
                          const next = new Set(prev);
                          next.delete(logo);
                          return next;
                        });
                      }}
                    />
                  ) : null}
                  {/* Placeholder para imagens quebradas */}
                  {failedImages.has(logo) && (
                    <div 
                      className="image-placeholder w-full h-full flex items-center justify-center bg-slate-800/50 text-white/30 text-xs absolute"
                      style={{ top: '20px', bottom: 0, left: 0, right: 0, zIndex: 5 }}
                    >
                      <span>Imagem não disponível</span>
                    </div>
                  )}
                  
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
