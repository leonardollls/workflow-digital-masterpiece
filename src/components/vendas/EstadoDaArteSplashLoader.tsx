import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

interface EstadoDaArteSplashLoaderProps {
  onComplete: () => void;
  duration?: number;
}

interface ParticleStyle {
  width: string;
  height: string;
  left: string;
  top: string;
  background: string;
  animation: string;
  animationDelay: string;
}

// Função para gerar partículas com valores fixos (baseados no índice) para evitar hydration mismatch
const generateParticleStyles = (count: number): ParticleStyle[] => {
  const particles: ParticleStyle[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 17 + 7;
    const width = ((seed % 30) / 10) + 1;
    const height = width;
    const left = (seed * 7 % 100);
    const top = (seed * 13 % 100);
    // Cores verde menta do Estado da Arte
    const r = 74 + (seed % 20);
    const g = 189 + (seed * 3 % 30);
    const b = 172 + (seed * 2 % 20);
    const opacity = ((seed % 40) / 100) + 0.1;
    const animDuration = 4 + (seed % 30) / 10;
    const animDelay = (seed % 20) / 10;

    particles.push({
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}%`,
      top: `${top}%`,
      background: `rgba(${r}, ${g}, ${b}, ${opacity})`,
      animation: `float ${animDuration}s ease-in-out infinite`,
      animationDelay: `${animDelay}s`,
    });
  }
  return particles;
};

/**
 * Splash Loader customizado para Estado da Arte
 * - Exibe a marca "Estado da Arte" ao invés de "Workflow"
 * - Cores alinhadas com a identidade visual da clínica (verde menta)
 */
const EstadoDaArteSplashLoader = ({ onComplete, duration = 1200 }: EstadoDaArteSplashLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'complete'>('loading');
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const hasPlayedWhooshRef = useRef(false);
  const hasPlayedCompletionRef = useRef(false);

  const words = ['Excelência', 'Saúde', 'Beleza', 'Confiança'];
  
  // Gerar estilos de partículas uma vez (valores consistentes entre servidor e cliente)
  const particleStyles = useMemo(() => generateParticleStyles(20), []);

  useEffect(() => {
    hasPlayedWhooshRef.current = false;
    hasPlayedCompletionRef.current = false;
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

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

  const playCompletionSound = useCallback(() => {
    if (!audioEnabled || hasPlayedCompletionRef.current) return;
    try {
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state !== 'running') return;
      hasPlayedCompletionRef.current = true;

      const frequencies = [523.25, 659.25, 783.99];
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

  useEffect(() => {
    const handleInteraction = () => handleEnableAudio();
    document.addEventListener('click', handleInteraction, { passive: true });
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [handleEnableAudio]);

  useEffect(() => {
    if (phase !== 'loading') return;
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 400);
    return () => clearInterval(wordInterval);
  }, [phase, words.length]);

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

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

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
        background: 'linear-gradient(135deg, #0a1612 0%, #122737 50%, #0a1612 100%)',
        contain: 'layout style paint',
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleStyles.map((style, i) => (
          <div
            key={i}
            className="splash-particle absolute rounded-full"
            style={style}
          />
        ))}
      </div>

      {/* Central Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[400px] h-[400px] rounded-full transition-all duration-500 ${
            phase === 'revealing' ? 'scale-[2] opacity-0' : 'scale-100 opacity-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(74, 189, 172, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 189, 172, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 189, 172, 0.5) 1px, transparent 1px)
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
              className="w-full h-full rounded-full border border-[#4ABDAC]/20"
              style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
            />
          </div>
          
          {/* Progress Ring */}
          <svg className="w-full h-full mx-auto transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(74, 189, 172, 0.1)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#estadoDaArteProgressGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className="transition-all duration-75"
            />
            <defs>
              <linearGradient id="estadoDaArteProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ABDAC" />
                <stop offset="50%" stopColor="#7DD5C9" />
                <stop offset="100%" stopColor="#4ABDAC" />
              </linearGradient>
            </defs>
          </svg>

          {/* Logo in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#122737] to-[#4ABDAC] flex items-center justify-center shadow-lg logo-pulse">
              <span className="text-white font-bold text-2xl">EA</span>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-wider">
          <span className="bg-gradient-to-r from-[#4ABDAC] via-[#7DD5C9] to-[#4ABDAC] bg-clip-text text-transparent">
            Estado da Arte
          </span>
        </h1>

        {/* Animated Text */}
        <div className="h-7 mb-6">
          <p className="text-base sm:text-lg text-[#4ABDAC]/80 font-light tracking-wide">
            <span className="inline-block min-w-[120px]">{displayText}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-56 sm:w-64 mx-auto mb-3">
          <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-75"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #4ABDAC 0%, #7DD5C9 50%, #4ABDAC 100%)',
                boxShadow: '0 0 15px rgba(74, 189, 172, 0.4)',
              }}
            />
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#4ABDAC] to-[#7DD5C9] bg-clip-text text-transparent tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Loading Message */}
        <p className="mt-4 text-white/30 text-xs tracking-widest uppercase">
          Carregando experiência
        </p>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-[#4ABDAC]/20 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-[#4ABDAC]/20 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-[#4ABDAC]/20 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-[#4ABDAC]/20 rounded-br-lg pointer-events-none" />
    </div>
  );
};

export default EstadoDaArteSplashLoader;
