import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface ScrollThroughPreviewProps {
  siteUrl: string;
}

const ScrollThroughPreview = ({ siteUrl }: ScrollThroughPreviewProps) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden bg-slate-900 group">
      {/* Scrolling container */}
      <div
        className={`absolute inset-0 ${isPaused ? '' : 'animate-scroll-through'}`}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <iframe
          src={siteUrl}
          title="Preview do site completo"
          className="w-full border-0 pointer-events-none"
          style={{ 
            height: '3000px',
            transform: 'scale(0.8)',
            transformOrigin: 'top center',
            width: '125%',
            marginLeft: '-12.5%',
          }}
        />
      </div>

      {/* Top gradient fade */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-10" />

      {/* Control button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute bottom-4 right-4 z-20 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
        title={isPaused ? 'Retomar scroll' : 'Pausar scroll'}
      >
        {isPaused ? (
          <Play size={20} className="text-white" />
        ) : (
          <Pause size={20} className="text-white" />
        )}
      </button>

      {/* Status indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
        <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`} />
        <span className="text-white/80 text-xs">
          {isPaused ? 'Pausado - passe o mouse para navegar' : 'Scroll automático'}
        </span>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-20 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/60 text-xs">
        Passe o mouse para pausar
      </div>
    </div>
  );
};

export default ScrollThroughPreview;

