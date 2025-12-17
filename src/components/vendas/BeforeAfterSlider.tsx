import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Sparkles, Play, Pause } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  beforeUrl?: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  beforeUrl = 'https://www.lidderars.com.br/',
  afterUrl,
  beforeLabel = 'Site Antigo',
  afterLabel = 'Nova Versão',
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedAtExtreme = useRef(false);

  // Animação automática contínua
  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      
      // Verificar se está em pausa nos extremos
      if (isPausedAtExtreme.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Velocidade: completa um ciclo em ~4 segundos (0 a 100 ou 100 a 0)
      const speed = 0.025 * delta; // pixels por ms
      
      setSliderPosition(prev => {
        let newPos = prev;
        
        if (direction === 'forward') {
          newPos = prev + speed;
          if (newPos >= 100) {
            newPos = 100;
            // Pausar no extremo por 1.5 segundos antes de reverter
            isPausedAtExtreme.current = true;
            pauseTimeoutRef.current = setTimeout(() => {
              setDirection('backward');
              isPausedAtExtreme.current = false;
            }, 1500);
          }
        } else {
          newPos = prev - speed;
          if (newPos <= 0) {
            newPos = 0;
            // Pausar no extremo por 1.5 segundos antes de reverter
            isPausedAtExtreme.current = true;
            pauseTimeoutRef.current = setTimeout(() => {
              setDirection('forward');
              isPausedAtExtreme.current = false;
            }, 1500);
          }
        }
        
        return newPos;
      });
      
      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [isPaused, direction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const togglePause = () => {
    setIsPaused(prev => !prev);
    lastTimeRef.current = 0;
  };

  // Determinar qual versão está mais visível
  const showingNew = sliderPosition > 50;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden select-none bg-slate-900 group">
      {/* After (New Version) - Full background */}
      <div className="absolute inset-0">
        <iframe
          src={afterUrl}
          title="Nova versão do site"
          className="w-full h-full border-0 pointer-events-none"
          style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
          loading="lazy"
        />
        {/* Label Nova Versão */}
        <div className={`absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg flex items-center gap-2 z-20 transition-all duration-500 ${
          showingNew ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
        }`}>
          <Sparkles size={14} className={showingNew ? 'animate-pulse' : ''} />
          {afterLabel}
        </div>
      </div>

      {/* Before (Old Version) - Clipped */}
      <div
        className="absolute inset-0 overflow-hidden transition-all duration-100"
        style={{ clipPath: `inset(0 ${sliderPosition}% 0 0)` }}
      >
        {/* Site antigo via iframe ou imagem */}
        <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
          {beforeImage ? (
            <img
              src={beforeImage}
              alt="Site atual"
              className="w-full h-full object-cover object-top"
            />
          ) : beforeUrl ? (
            <iframe
              src={beforeUrl}
              title="Site atual (Wix)"
              className="w-full h-full border-0 pointer-events-none"
              style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
              loading="lazy"
            />
          ) : (
            // Fallback visual representando site desatualizado
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
              <AlertTriangle size={48} className="text-amber-500/60 mb-4" />
              <div className="text-white/50 text-lg font-medium mb-2">Site Desatualizado</div>
              <div className="text-white/30 text-sm max-w-xs text-center">
                Design antigo, sem responsividade, SEO limitado
              </div>
              {/* Elementos visuais de site antigo */}
              <div className="mt-6 w-3/4 space-y-2 opacity-30">
                <div className="h-4 bg-white/20 rounded" />
                <div className="h-3 bg-white/15 rounded w-2/3" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          )}
        </div>
        
        {/* Label Site Antigo */}
        <div className={`absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs sm:text-sm font-semibold shadow-lg flex items-center gap-2 z-20 transition-all duration-500 ${
          !showingNew ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
        }`}>
          <AlertTriangle size={14} className={!showingNew ? 'animate-pulse' : ''} />
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line (visual indicator) */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/80 z-30 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        style={{ left: `${100 - sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Glow effect */}
        <div className="absolute inset-y-0 -left-4 -right-4 bg-white/20 blur-xl" />
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePause}
        className="absolute bottom-4 left-4 p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all duration-300 hover:scale-110 z-40"
        aria-label={isPaused ? 'Reproduzir' : 'Pausar'}
      >
        {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
      </button>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-xs sm:text-sm font-medium flex items-center gap-3 z-40">
        <span className={`transition-all duration-300 ${!showingNew ? 'text-red-400 font-semibold' : 'text-white/60'}`}>
          Antes
        </span>
        
        {/* Progress bar */}
        <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-purple-500 to-green-500 transition-all duration-100"
            style={{ width: `${sliderPosition}%` }}
          />
        </div>
        
        <span className={`transition-all duration-300 ${showingNew ? 'text-green-400 font-semibold' : 'text-white/60'}`}>
          Depois
        </span>
      </div>

      {/* Position percentage */}
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white/60 text-xs font-mono z-40">
        {Math.round(100 - sliderPosition)}% / {Math.round(sliderPosition)}%
      </div>

      {/* Animated scan line effect */}
      <div 
        className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none"
        style={{
          animation: 'scanLine 3s ease-in-out infinite',
          top: `${(sliderPosition % 100)}%`
        }}
      />

      <style>{`
        @keyframes scanLine {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(50vh); }
        }
      `}</style>
    </div>
  );
};

export default BeforeAfterSlider;
