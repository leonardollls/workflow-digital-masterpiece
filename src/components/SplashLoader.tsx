import { useEffect, useState } from 'react';

interface SplashLoaderProps {
  onComplete: () => void;
  duration?: number;
}

/**
 * Splash Loader with full visual effects but optimized for performance
 * - Shorter duration (1200ms default)
 * - No audio effects
 * - Uses composited animations only (transform/opacity)
 */
const SplashLoader = ({ onComplete, duration = 1200 }: SplashLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'complete'>('loading');
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const words = ['Inovação', 'Design', 'Performance', 'Resultados'];

  // Word cycling animation
  useEffect(() => {
    if (phase !== 'loading') return;

    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 400);

    return () => clearInterval(wordInterval);
  }, [phase, words.length]);

  // Typing effect for current word
  useEffect(() => {
    const targetWord = words[currentWordIndex];
    let charIndex = 0;
    setDisplayText('');

    const typeInterval = setInterval(() => {
      if (charIndex <= targetWord.length) {
        setDisplayText(targetWord.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [currentWordIndex, words]);

  // Progress animation
  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        setPhase('revealing');
        
        // Trigger reveal animation
        setTimeout(() => {
          setPhase('complete');
          setTimeout(onComplete, 400);
        }, 300);
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

  return (
    <div
      className={`splash-loader fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-out ${
        phase === 'complete' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a12 100%)',
        contain: 'layout style paint',
      }}
    >
      {/* Animated Background Particles - reduced count for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="splash-particle absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 50}, 246, ${Math.random() * 0.4 + 0.1})`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Central Glow Effect - GPU optimized */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[400px] h-[400px] rounded-full transition-all duration-500 ${
            phase === 'revealing' ? 'scale-[2] opacity-0' : 'scale-100 opacity-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-500 ${
        phase === 'revealing' ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Logo Container */}
        <div className="relative mb-6" style={{ width: '140px', height: '140px', margin: '0 auto', contain: 'layout' }}>
          {/* Outer Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-full h-full rounded-full border border-purple-500/20"
              style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
            />
          </div>
          
          {/* Progress Ring */}
          <svg className="w-full h-full mx-auto transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(139, 92, 246, 0.1)"
              strokeWidth="2"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className="transition-all duration-75"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
          </svg>

          {/* Logo in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{ width: '64px', height: '64px', contain: 'layout' }}>
              <img
                src="/Images/logo-workflow-sem-fundo2.png"
                alt="Workflow"
                width={64}
                height={64}
                className="w-full h-full object-contain logo-pulse"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-wider">
          <span className="text-white">Work</span>
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
            flow
          </span>
        </h1>

        {/* Animated Text */}
        <div className="h-7 mb-6">
          <p className="text-base sm:text-lg text-purple-300/80 font-light tracking-wide">
            <span className="inline-block min-w-[120px]">{displayText}</span>
            <span className="animate-blink text-purple-400">|</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-56 sm:w-64 mx-auto mb-3">
          <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
              }}
            />
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Loading Message */}
        <p className="mt-4 text-white/30 text-xs tracking-widest uppercase">
          Carregando experiência
        </p>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-purple-500/20 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-purple-500/20 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-purple-500/20 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-purple-500/20 rounded-br-lg pointer-events-none" />
    </div>
  );
};

export default SplashLoader;
