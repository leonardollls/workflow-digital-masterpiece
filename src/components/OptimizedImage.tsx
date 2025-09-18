import React, { useState, useRef, useEffect } from 'react';
import { useImagePreloader } from '@/utils/imageCache';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  onClick 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { preloadImage, isImageCached } = useImagePreloader();

  // Gera uma versão placeholder da imagem (base64 blur)
  const generatePlaceholder = (width = 400, height = 300) => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <circle cx="50%" cy="50%" r="20" fill="#d1d5db" opacity="0.5"/>
      </svg>
    `)}`;
  };

  // Intersection Observer para lazy loading
  useEffect(() => {
    // Se a imagem já está em cache, carrega imediatamente
    if (isImageCached(src)) {
      setIsLoaded(true);
      setIsInView(true);
      return;
    }

    if (imgRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Precarrega a imagem usando o cache
            preloadImage(src)
              .then(() => setIsLoaded(true))
              .catch(() => setHasError(true));
            observerRef.current?.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '100px' // Aumenta a margem para precarregar mais cedo
        }
      );
      
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, preloadImage, isImageCached]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {/* Placeholder sempre visível */}
      <img
        src={generatePlaceholder()}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      />
      
      {/* Imagem real - só carrega quando está em vista */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } group-hover:scale-105`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-xs">Erro ao carregar</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
