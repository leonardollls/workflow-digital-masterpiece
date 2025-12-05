import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
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
        
        // Shadow and depth
        'shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
        
        // Hover effects
        hover && [
          'transition-all duration-500 ease-out',
          'hover:bg-white/15',
          'hover:border-white/30',
          'hover:shadow-[0_16px_48px_rgba(124,58,237,0.15)]',
          'hover:-translate-y-1',
          'hover:scale-[1.02]',
        ],
        
        // Glow effect
        glow && 'shadow-[0_0_40px_rgba(124,58,237,0.2)]',
        
        // Cursor
        onClick && 'cursor-pointer',
        
        className
      )}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -inset-full top-0 h-[200%] w-[200%] rotate-[30deg] translate-x-[-70%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[70%] transition-transform duration-1000 ease-out" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;

