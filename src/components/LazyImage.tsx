import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onLoad?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes,
  style,
  placeholder,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const [currentSrc, setCurrentSrc] = useState(priority || loading === 'eager' ? src : '');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || loading === 'eager') {
      setCurrentSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          setCurrentSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority, loading, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.warn('Image failed to load:', target.src);
    
    if (!hasError) {
      setHasError(true);
      // Fallback para versão sem extensão ou alternativa
      if (target.src.includes('.webp')) {
        target.src = target.src.replace('.webp', '.jpg');
      } else if (target.src.includes('.jpg')) {
        target.src = target.src.replace('.jpg', '.png');
      }
    }
  };

  // Se não há src e não é prioritária, renderizar placeholder
  if (!currentSrc && !priority && loading !== 'eager') {
    return (
      <div ref={imgRef} className={`relative overflow-hidden ${className} bg-workflow-50 flex items-center justify-center`} style={style}>
        <div className="w-8 h-8 border-2 border-workflow-energy border-t-transparent rounded-full animate-spin opacity-50"></div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Loading spinner simples */}
      {!isLoaded && currentSrc && (
        <div className="absolute inset-0 bg-workflow-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-workflow-energy border-t-transparent rounded-full animate-spin opacity-50"></div>
        </div>
      )}
      
      {/* Imagem principal */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      )}
    </div>
  );
};

export default LazyImage;
