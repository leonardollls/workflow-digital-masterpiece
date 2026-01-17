import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  isHovered = false,
  onClick 
}: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base glass effect
        'relative overflow-hidden rounded-2xl',
        'bg-white/10 backdrop-blur-xl',
        'border border-white/20',
        
        // Transition
        hover && 'transition-all duration-300 ease-out',
        
        // Cursor
        onClick && 'cursor-pointer',
        
        className
      )}
      style={{
        // Hover effects controlled via prop - NO external shadows
        borderColor: isHovered ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.2)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
