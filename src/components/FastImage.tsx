import React, { useState, useRef, useEffect } from 'react';

interface FastImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

const FastImage: React.FC<FastImageProps> = ({ 
  src, 
  alt, 
  priority = false,
  className = "",
  onClick 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer para lazy loading
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
        rootMargin: '100px' // Carrega mais cedo
      }
    );
    
    observerRef.current.observe(imgRef.current);
    return () => observerRef.current?.disconnect();
  }, [priority]);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}
      onClick={onClick}
    >
      {/* Placeholder com gradiente */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 opacity-50"></div>
          </div>
        </div>
      )}
      
      {/* Imagem real - carrega apenas quando em vista */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          // Otimizações críticas para performance
          style={{
            maxWidth: '100%',
            height: 'auto',
            imageRendering: 'optimizeSpeed'
          }}
        />
      )}
    </div>
  );
};

export default FastImage;
