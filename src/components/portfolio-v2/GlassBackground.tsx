import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const GlassBackground = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Base Gradient */}
      <div 
        className={`
          absolute inset-0 transition-all duration-700 ease-out
          ${isDark 
            ? 'bg-gradient-to-br from-slate-950 via-[#0c0a1d] to-slate-950' 
            : 'bg-gradient-to-br from-slate-50 via-white to-purple-50/30'
          }
        `}
      />

      {/* Layer 2: Dot Matrix Pattern */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-[0.35]' : 'opacity-[0.25]'}`}
        style={{
          backgroundImage: isDark
            ? `radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 1px, transparent 1px)`
            : `radial-gradient(circle at center, rgba(139, 92, 246, 0.35) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0',
        }}
      />

      {/* Layer 3: Wave Patterns - Multiple animated waves */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave 1 - Top area, slowest */}
        <div 
          className={`wave-layer wave-1 absolute w-[200%] transition-opacity duration-700 ${
            isDark ? 'opacity-[0.15]' : 'opacity-[0.1]'
          }`}
          style={{
            height: '60%',
            top: '5%',
            left: '-50%',
            background: isDark
              ? `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(139, 92, 246, 0.3) 30%,
                  rgba(124, 58, 237, 0.4) 50%,
                  rgba(139, 92, 246, 0.3) 70%,
                  transparent 100%)`
              : `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(139, 92, 246, 0.2) 30%,
                  rgba(124, 58, 237, 0.3) 50%,
                  rgba(139, 92, 246, 0.2) 70%,
                  transparent 100%)`,
            borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%',
            transform: 'rotate(-3deg)',
          }}
        />

        {/* Wave 2 - Middle, medium speed */}
        <div 
          className={`wave-layer wave-2 absolute w-[200%] transition-opacity duration-700 ${
            isDark ? 'opacity-[0.12]' : 'opacity-[0.08]'
          }`}
          style={{
            height: '50%',
            top: '25%',
            left: '-50%',
            background: isDark
              ? `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(167, 139, 250, 0.25) 35%,
                  rgba(139, 92, 246, 0.35) 50%,
                  rgba(167, 139, 250, 0.25) 65%,
                  transparent 100%)`
              : `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(167, 139, 250, 0.15) 35%,
                  rgba(139, 92, 246, 0.25) 50%,
                  rgba(167, 139, 250, 0.15) 65%,
                  transparent 100%)`,
            borderRadius: '50% 50% 45% 55% / 55% 50% 50% 45%',
            transform: 'rotate(2deg)',
          }}
        />

        {/* Wave 3 - Lower area, faster */}
        <div 
          className={`wave-layer wave-3 absolute w-[200%] transition-opacity duration-700 ${
            isDark ? 'opacity-[0.1]' : 'opacity-[0.06]'
          }`}
          style={{
            height: '45%',
            top: '50%',
            left: '-50%',
            background: isDark
              ? `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(124, 58, 237, 0.2) 40%,
                  rgba(139, 92, 246, 0.3) 50%,
                  rgba(124, 58, 237, 0.2) 60%,
                  transparent 100%)`
              : `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(124, 58, 237, 0.12) 40%,
                  rgba(139, 92, 246, 0.2) 50%,
                  rgba(124, 58, 237, 0.12) 60%,
                  transparent 100%)`,
            borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%',
            transform: 'rotate(-1deg)',
          }}
        />

        {/* Wave 4 - Bottom accent */}
        <div 
          className={`wave-layer wave-4 absolute w-[200%] transition-opacity duration-700 ${
            isDark ? 'opacity-[0.08]' : 'opacity-[0.05]'
          }`}
          style={{
            height: '40%',
            bottom: '0%',
            left: '-50%',
            background: isDark
              ? `linear-gradient(0deg, 
                  rgba(139, 92, 246, 0.25) 0%,
                  rgba(167, 139, 250, 0.15) 40%,
                  transparent 100%)`
              : `linear-gradient(0deg, 
                  rgba(139, 92, 246, 0.15) 0%,
                  rgba(167, 139, 250, 0.08) 40%,
                  transparent 100%)`,
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          }}
        />
      </div>

      {/* Layer 4: Floating Dot Particles */}
      <div className="absolute inset-0">
        <div 
          className={`absolute w-2 h-2 rounded-full animate-dot-float-1 transition-colors duration-500 ${
            isDark ? 'bg-purple-400/40' : 'bg-purple-500/30'
          }`}
          style={{ top: '20%', left: '15%' }}
        />
        <div 
          className={`absolute w-1.5 h-1.5 rounded-full animate-dot-float-2 transition-colors duration-500 ${
            isDark ? 'bg-violet-400/50' : 'bg-violet-500/35'
          }`}
          style={{ top: '35%', left: '80%' }}
        />
        <div 
          className={`absolute w-2.5 h-2.5 rounded-full animate-dot-float-3 transition-colors duration-500 ${
            isDark ? 'bg-purple-300/35' : 'bg-purple-400/25'
          }`}
          style={{ top: '60%', left: '25%' }}
        />
        <div 
          className={`absolute w-1 h-1 rounded-full animate-dot-float-1 transition-colors duration-500 ${
            isDark ? 'bg-indigo-400/45' : 'bg-indigo-500/30'
          }`}
          style={{ top: '75%', left: '70%' }}
        />
        <div 
          className={`absolute w-2 h-2 rounded-full animate-dot-float-2 transition-colors duration-500 ${
            isDark ? 'bg-violet-300/40' : 'bg-violet-400/25'
          }`}
          style={{ top: '45%', left: '50%' }}
        />
        <div 
          className={`absolute w-1.5 h-1.5 rounded-full animate-dot-float-3 transition-colors duration-500 ${
            isDark ? 'bg-purple-400/35' : 'bg-purple-500/20'
          }`}
          style={{ top: '85%', left: '35%' }}
        />
      </div>

      {/* Layer 5: Gradient Glow Spots */}
      <div 
        className={`
          absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-opacity duration-700
          ${isDark 
            ? 'bg-purple-600/15 opacity-60' 
            : 'bg-purple-400/10 opacity-50'
          }
        `}
        style={{ top: '-10%', left: '-10%' }}
      />
      <div 
        className={`
          absolute w-[500px] h-[500px] rounded-full blur-[100px] transition-opacity duration-700
          ${isDark 
            ? 'bg-violet-600/12 opacity-50' 
            : 'bg-violet-400/8 opacity-40'
          }
        `}
        style={{ bottom: '-5%', right: '-5%' }}
      />

      {/* Layer 6: Noise Texture */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.015]'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 7: Vignette */}
      <div 
        className={`
          absolute inset-0 transition-all duration-700
          ${isDark 
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' 
            : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(100,100,120,0.05)_100%)]'
          }
        `}
      />

      {/* Layer 8: Top fade (dark mode) */}
      {isDark && (
        <div 
          className="absolute top-0 left-0 right-0 h-32 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.6) 0%, transparent 100%)',
          }}
        />
      )}
    </div>
  );
};

export default GlassBackground;
