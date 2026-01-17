import { useEffect, useState, useRef, useCallback } from 'react';

interface SplashLoaderProps {
  onComplete: () => void;
  duration?: number;
}

/**
 * Splash Loader with full visual effects but optimized for performance
 * - Shorter duration (1200ms default)
 * - Audio effects (lazy initialized on user interaction)
 * - Uses composited animations only (transform/opacity)
 */
const SplashLoader = ({ onComplete, duration = 1200 }: SplashLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'complete'>('loading');
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const hasPlayedWhooshRef = useRef(false);
  const hasPlayedCompletionRef = useRef(false);

  const words = ['Inovação', 'Design', 'Performance', 'Resultados'];

  // Reset audio state on each mount to ensure sounds play every time
  useEffect(() => {
    // Reset refs on mount
    hasPlayedWhooshRef.current = false;
    hasPlayedCompletionRef.current = false;
    
    // Close any existing audio context and create fresh one
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    
    // Cleanup on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  // Initialize Web Audio API lazily (only after user interaction)
  const initAudio = useCallback((): AudioContext | null => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      }
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      return audioContextRef.current;
    } catch {
      return null;
    }
  }, []);

  // Whoosh sound effect
  const playWhooshSound = useCallback(() => {
    if (!audioEnabled || hasPlayedWhooshRef.current) return;
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== 'running') return;
      hasPlayedWhooshRef.current = true;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.4);

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch {
      // Silent fail
    }
  }, [audioEnabled]);

  // Completion chime sound
  const playCompletionSound = useCallback(() => {
    if (!audioEnabled || hasPlayedCompletionRef.current) return;
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== 'running') return;
      hasPlayedCompletionRef.current = true;

      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime + index * 0.06;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.6);
      });
    } catch {
      // Silent fail
    }
  }, [audioEnabled]);

  // Enable audio on user interaction
  const handleEnableAudio = useCallback(() => {
    if (audioEnabled) return;
    const ctx = initAudio();
    if (ctx?.state === 'running') {
      setAudioEnabled(true);
      if (!hasPlayedWhooshRef.current && progress > 10) {
        setTimeout(playWhooshSound, 50);
      }
    }
  }, [audioEnabled, initAudio, progress, playWhooshSound]);

  // Listen for user interactions to enable audio
  useEffect(() => {
    const handleInteraction = () => handleEnableAudio();
    document.addEventListener('click', handleInteraction, { passive: true });
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [handleEnableAudio]);

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

      // Play whoosh at 15% progress
      if (newProgress >= 15 && !hasPlayedWhooshRef.current && audioEnabled) {
        playWhooshSound();
      }

      setProgress(newProgress);

      if (newProgress >= 100) {
        setPhase('revealing');
        playCompletionSound();
        
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
  }, [duration, onComplete, audioEnabled, playWhooshSound, playCompletionSound]);

  return (
    <div
      onClick={handleEnableAudio}
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
      {/* Para ajustar a posição vertical do brilho, altere o valor de 'translateY' abaixo (valores negativos = mais acima, positivos = mais abaixo) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[400px] h-[400px] rounded-full transition-all duration-500 ${
            phase === 'revealing' ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            transform: phase === 'revealing' ? 'translateY(-40px) scale(2)' : 'translateY(-40px) scale(1)',
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
      <div className={`relative z-10 text-center transition-all duration-500 flex flex-col justify-center items-center ${
        phase === 'revealing' ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
      }`} style={{ minHeight: '100vh' }}>
        {/* Logo - Large and positioned above progress bar */}
        {/* Para ajustar a posição vertical da logo, altere o valor de 'mt-8' abaixo (ex: mt-4 = menos espaço, mt-12 = mais espaço) */}
        <div className="mb-0 mt-0 flex justify-center">
          <div style={{ width: '320px', height: '320px', contain: 'layout' }}>
            <img
              src="/Images/logo-workflow-sem-fundo2.png"
              alt="Workflow"
              width={320}
              height={320}
              className="w-full h-full object-contain logo-pulse"
            />
          </div>
        </div>

        {/* Animated Text - sem cursor */}
        <div className="h-7 mb-0">
          <p className="text-base sm:text-lg text-purple-300/80 font-light tracking-wide">
            <span className="inline-block min-w-[120px]">{displayText}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-56 sm:w-64 mx-auto mb-2">
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
