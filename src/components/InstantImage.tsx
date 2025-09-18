import React from 'react';

interface InstantImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

const InstantImage: React.FC<InstantImageProps> = ({ 
  src, 
  alt, 
  priority = false,
  className = "",
  onClick 
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        style={{
          // Otimizações para carregamento mais rápido
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default InstantImage;
