import { useEffect, useState } from 'react';

interface SplashLoaderProps {
  onComplete: () => void;
  duration?: number;
}

/**
 * Optimized SplashLoader - Minimal version to reduce CLS
 * Uses only opacity transitions to prevent layout shifts
 */
const SplashLoader = ({ onComplete, duration = 800 }: SplashLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        setIsVisible(false);
        // Small delay before calling onComplete to allow fade out
        setTimeout(onComplete, 300);
      } else {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        progress >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a12 100%)',
        contain: 'layout style paint',
      }}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute w-64 h-64 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo with fixed dimensions */}
        <div 
          className="mx-auto mb-4"
          style={{ width: '80px', height: '80px', contain: 'layout' }}
        >
          <img
            src="/Images/logo-workflow-sem-fundo2.png"
            alt="Workflow"
            width={80}
            height={80}
            className="w-full h-full object-contain"
            fetchPriority="high"
            decoding="sync"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-bold mb-4 tracking-wider">
          <span className="text-white">Work</span>
          <span className="text-purple-400">flow</span>
        </h1>

        {/* Simple Progress Bar */}
        <div className="w-48 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashLoader;
