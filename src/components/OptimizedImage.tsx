import React, { useState, useRef, useCallback, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: (error: Event) => void;
  sizes?: string;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError,
  sizes,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Carrega 50px antes da imagem entrar na viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority, loading]);

  // Atualizar src quando entra na viewport
  useEffect(() => {
    if (isInView && currentSrc === placeholder) {
      setCurrentSrc(src);
    }
  }, [isInView, src, currentSrc, placeholder]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsError(true);
    setIsLoaded(false);
    onError?.(e.nativeEvent);
    
    // Fallback para imagem genérica
    const target = e.target as HTMLImageElement;
    if (target.src !== placeholder) {
      target.src = placeholder;
    }
  }, [onError, placeholder]);

  // WebP Support Detection
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (originalSrc === placeholder) return originalSrc;
    
    // Se a imagem já é WebP, retorna como está
    if (originalSrc.includes('.webp')) return originalSrc;
    
    // Tenta converter para WebP para imagens PNG/JPG
    if (originalSrc.includes('.png') || originalSrc.includes('.jpg') || originalSrc.includes('.jpeg')) {
      const webpSrc = originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      return webpSrc;
    }
    
    return originalSrc;
  }, [placeholder]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder/Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-workflow-50 to-workflow-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-workflow-energy border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Main Image */}
      <img
        ref={imgRef}
        src={getOptimizedSrc(currentSrc)}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        style={style}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-workflow-50 flex items-center justify-center text-workflow-deep/50 text-sm">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <span>Imagem não disponível</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
