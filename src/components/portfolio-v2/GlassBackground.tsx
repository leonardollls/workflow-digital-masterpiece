/**
 * GlassBackground - Concealed-inspired minimalist background
 * 
 * Design philosophy: Clean, subtle gradients without busy patterns.
 * Inspired by https://concealed.com/
 */
const GlassBackground = () => {
  // Portfolio page is always dark mode
  const isDark = true;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Base Gradient - Concealed style deep navy */}
      <div 
        className={`
          absolute inset-0 transition-all duration-700 ease-out
          ${isDark 
            ? 'bg-gradient-to-br from-[#0a0b1e] via-slate-950 to-[#0d0e24]' 
            : 'bg-gradient-to-br from-slate-50 via-white to-purple-50/30'
          }
        `}
      />

      {/* Layer 2: Primary center glow - more visible */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 100% 60% at 50% 30%, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)'
            : 'radial-gradient(ellipse 100% 60% at 50% 30%, rgba(139, 92, 246, 0.12) 0%, rgba(167, 139, 250, 0.06) 40%, transparent 70%)'
        }}
      />

      {/* Layer 3: Secondary bottom glow for depth */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(124, 58, 237, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)'
        }}
      />

      {/* Layer 4: Subtle vignette for edge depth */}
      <div 
        className={`
          absolute inset-0 transition-opacity duration-700
          ${isDark 
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' 
            : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(100,100,120,0.04)_100%)]'
          }
        `}
      />
    </div>
  );
};

export default GlassBackground;
