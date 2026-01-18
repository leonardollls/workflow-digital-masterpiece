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

      {/* Layer 3: Wave Pattern SVG - Main Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className={`absolute w-full transition-opacity duration-700 ${isDark ? 'opacity-[0.12]' : 'opacity-[0.08]'}`}
          style={{ top: '10%', height: '40%', minHeight: '300px' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="wave-path-1"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={isDark ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)'}
          />
          <path
            className="wave-path-2"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,165.3C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={isDark ? 'rgba(124, 58, 237, 0.35)' : 'rgba(124, 58, 237, 0.25)'}
          />
        </svg>

        {/* Bottom Wave Layer */}
        <svg
          className={`absolute w-full transition-opacity duration-700 ${isDark ? 'opacity-[0.08]' : 'opacity-[0.06]'}`}
          style={{ bottom: '5%', height: '35%', minHeight: '250px', transform: 'rotate(180deg)' }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="wave-path-3"
            d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(167, 139, 250, 0.3)'}
          />
          <path
            className="wave-path-4"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill={isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.2)'}
          />
        </svg>
      </div>

      {/* Layer 4: Floating Dot Particles */}
      <div className="absolute inset-0">
        {/* Large accent dots */}
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
        <div 
          className={`absolute w-3 h-3 rounded-full animate-dot-float-1 transition-colors duration-500 ${
            isDark ? 'bg-purple-500/20' : 'bg-purple-400/15'
          }`}
          style={{ top: '15%', left: '60%' }}
        />
        <div 
          className={`absolute w-1 h-1 rounded-full animate-dot-float-2 transition-colors duration-500 ${
            isDark ? 'bg-violet-400/50' : 'bg-violet-500/30'
          }`}
          style={{ top: '55%', left: '90%' }}
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
      <div 
        className={`
          absolute w-[400px] h-[400px] rounded-full blur-[80px] transition-opacity duration-700
          ${isDark 
            ? 'bg-indigo-600/10 opacity-40' 
            : 'bg-indigo-400/6 opacity-30'
          }
        `}
        style={{ top: '40%', left: '50%', transform: 'translateX(-50%)' }}
      />

      {/* Layer 6: Noise Texture for depth */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.015]'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 7: Vignette effect */}
      <div 
        className={`
          absolute inset-0 transition-all duration-700
          ${isDark 
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' 
            : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(100,100,120,0.05)_100%)]'
          }
        `}
      />

      {/* Layer 8: Top edge fade for header area (dark mode only) */}
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
