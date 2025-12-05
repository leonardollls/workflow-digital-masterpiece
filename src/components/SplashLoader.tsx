import { useEffect, useState, useRef, useCallback } from 'react';

interface SplashLoaderProps {
  onComplete: () => void;
  duration?: number;
}

const SplashLoader = ({ onComplete, duration = 3500 }: SplashLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'revealing' | 'complete'>('loading');
  const [displayText, setDisplayText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasPlayedSoundRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const words = ['Inovação', 'Design', 'Performance', 'Resultados'];

  // Initialize Web Audio API
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Generate synthetic sounds using Web Audio API
  const playWhooshSound = useCallback(() => {
    try {
      const audioContext = initAudio();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create whoosh/sweep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [initAudio]);

  const playCompletionSound = useCallback(() => {
    try {
      const audioContext = initAudio();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create a pleasant completion chime
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        const startTime = audioContext.currentTime + index * 0.08;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.8);
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }, [initAudio]);

  const playTickSound = useCallback(() => {
    try {
      const audioContext = initAudio();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Silent fail
    }
  }, [initAudio]);

  // Word cycling animation
  useEffect(() => {
    if (phase !== 'loading') return;

    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      playTickSound();
    }, 700);

    return () => clearInterval(wordInterval);
  }, [phase, playTickSound, words.length]);

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
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentWordIndex, words]);

  // Progress animation
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      // Play whoosh at certain milestones
      if (!hasPlayedSoundRef.current && newProgress > 10) {
        playWhooshSound();
        hasPlayedSoundRef.current = true;
      }

      setProgress(newProgress);

      if (newProgress >= 100) {
        setPhase('revealing');
        playCompletionSound();
        
        // Trigger reveal animation
        setTimeout(() => {
          setPhase('complete');
          setTimeout(onComplete, 800);
        }, 600);
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [duration, onComplete, playWhooshSound, playCompletionSound]);

  // User interaction to enable audio
  useEffect(() => {
    const enableAudio = () => {
      initAudio();
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
  }, [initAudio]);

  return (
    <div
      ref={containerRef}
      className={`splash-loader fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700 ease-out ${
        phase === 'complete' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a12 100%)',
        backgroundColor: '#0a0a0f',
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="splash-particle absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 50}, ${246}, ${Math.random() * 0.5 + 0.2})`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Central Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`w-[600px] h-[600px] rounded-full transition-all duration-1000 ${
            phase === 'revealing' ? 'scale-[3] opacity-0' : 'scale-100 opacity-100'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-700 ${
        phase === 'revealing' ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Logo Container */}
        <div className="relative mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-purple-500/20"
              style={{
                animation: 'pulse-ring 2s ease-in-out infinite',
              }}
            />
          </div>
          
          {/* Progress Ring */}
          <svg className="w-32 h-32 sm:w-40 sm:h-40 mx-auto transform -rotate-90" viewBox="0 0 100 100">
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
              className="transition-all duration-100"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))',
              }}
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
            <div className="relative">
              <img
                src="/Images/logo-workflow-sem-fundo2.png"
                alt="Workflow"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain logo-pulse"
              />
              {/* Logo Glow */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                  transform: 'scale(1.5)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-wider">
          <span className="text-white">Work</span>
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
            flow
          </span>
        </h1>

        {/* Animated Text */}
        <div className="h-8 mb-8">
          <p className="text-lg sm:text-xl text-purple-300/80 font-light tracking-wide">
            <span className="inline-block min-w-[140px]">{displayText}</span>
            <span className="animate-blink text-purple-400">|</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 mx-auto mb-4">
          <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
              }}
            />
            {/* Shimmer Effect */}
            <div 
              className="absolute inset-0 -translate-x-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
            />
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Loading Message */}
        <p className="mt-6 text-white/40 text-sm tracking-widest uppercase">
          Carregando experiência
        </p>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-purple-500/20 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-purple-500/20 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-purple-500/20 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-purple-500/20 rounded-br-lg" />

      {/* Scan Line Effect */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ mixBlendMode: 'overlay' }}
      >
        <div 
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-scan"
        />
      </div>
    </div>
  );
};

export default SplashLoader;

