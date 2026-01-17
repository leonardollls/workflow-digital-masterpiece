import React from 'react';

interface InstantImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  isHovered?: boolean;
}

const InstantImage: React.FC<InstantImageProps> = ({ 
  src, 
  alt, 
  priority = false,
  className = "",
  onClick,
  width = 800,
  height = 406,
  isHovered = false
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover object-top transition-transform duration-300"
        style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onError={(e) => {
          console.error('Erro ao carregar imagem:', src);
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
      />
    </div>
  );
};

export default InstantImage;
