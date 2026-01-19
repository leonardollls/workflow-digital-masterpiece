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
  // Portfolio page is always dark mode
  const isDark = true;

  // Solid background colors to prevent backdrop-blur bleed
  const getBackgroundColor = () => {
    if (isDark) {
      // Solid dark backgrounds - no transparency to avoid blur bleed
      return isHovered ? '#1e1b2e' : '#16141f';
    }
    // Light mode - solid white backgrounds
    return isHovered ? '#ffffff' : '#fafafa';
  };

  const getBorderColor = () => {
    if (isDark) {
      return isHovered ? 'rgba(139, 92, 246, 0.6)' : 'rgba(255, 255, 255, 0.1)';
    }
    return isHovered ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.15)';
  };

  const getBoxShadow = () => {
    if (isDark) {
      // Inset glow for hover - won't bleed to other cards
      return isHovered 
        ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.3)' 
        : '0 2px 8px rgba(0, 0, 0, 0.2)';
    }
    return isHovered 
      ? '0 8px 30px rgba(139, 92, 246, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)' 
      : '0 2px 12px rgba(139, 92, 246, 0.06), 0 1px 4px rgba(0, 0, 0, 0.02)';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        // Solid card - no backdrop-blur to prevent bleed
        'relative overflow-hidden rounded-2xl',
        'border',
        
        // Transition
        hover && 'transition-all duration-300 ease-out',
        
        // Cursor
        onClick && 'cursor-pointer',
        
        className
      )}
      style={{
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
        boxShadow: getBoxShadow(),
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Inner glow effect on hover - contained within card */}
      {isHovered && isDark && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(124, 58, 237, 0.05) 100%)',
          }}
        />
      )}
      
      {/* Gradient overlay for depth - adaptive */}
      <div 
        className={cn(
          'absolute inset-0 pointer-events-none transition-opacity duration-300',
          isDark 
            ? 'bg-gradient-to-br from-white/[0.03] via-transparent to-black/10' 
            : 'bg-gradient-to-br from-white/80 via-transparent to-purple-500/[0.02]'
        )}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
