import React, { useState, useRef, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  thumbnailSrc?: string;
  alt: string;
  blurDataUrl?: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

const SmartImage: React.FC<SmartImageProps> = ({ 
  src, 
  thumbnailSrc, 
  alt, 
  blurDataUrl,
  priority = false,
  className = "",
  onClick 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Imagens prioritárias carregam imediatamente
  const [hasError, setHasError] = useState(false);
  const [showFullRes, setShowFullRes] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Placeholder blur base64 padrão
  const defaultBlurDataUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";

  // Intersection Observer para lazy loading (apenas se não for prioritária)
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );
    
    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Estratégia de carregamento otimizada
  const imageUrl = thumbnailSrc || src;
  const placeholderUrl = blurDataUrl || defaultBlurDataUrl;
  
  // Carregamento progressivo - carrega thumbnail primeiro, depois full res
  useEffect(() => {
    if (isLoaded && !showFullRes && !priority) {
      const timer = setTimeout(() => {
        setShowFullRes(true);
      }, 500); // Delay para mostrar versão completa
      return () => clearTimeout(timer);
    }
  }, [isLoaded, showFullRes, priority]);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-100 ${className}`}
      onClick={onClick}
    >
      {/* Placeholder blur - sempre visível até a imagem carregar */}
      {!isLoaded && (
        <img
          src={placeholderUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 filter blur-sm transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Imagem real com lazy loading condicional */}
      {isInView && (
        <img
          src={imageUrl}
          alt={alt}
          className={`w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}

      {/* Loading indicator para imagens prioritárias */}
      {priority && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 rounded w-8 h-8"></div>
        </div>
      )}

      {/* Estado de erro */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">Erro</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartImage;
