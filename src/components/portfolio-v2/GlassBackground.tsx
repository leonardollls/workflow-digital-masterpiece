import { useEffect, useState } from 'react';

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const GlassBackground = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    // Generate random floating shapes - darker colors
    const colors = [
      'rgba(124, 58, 237, 0.10)', // Purple
      'rgba(167, 139, 250, 0.08)', // Light purple
      'rgba(88, 28, 135, 0.12)',   // Dark purple
      'rgba(139, 92, 246, 0.08)',  // Violet
      'rgba(109, 40, 217, 0.10)', // Purple-violet
    ];

    const generatedShapes: FloatingShape[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 200 + Math.random() * 400,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20,
    }));

    setShapes(generatedShapes);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient - darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-950" />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Mesh gradient overlay - reduced opacity */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-gradient-radial from-purple-600/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-gradient-radial from-purple-800/15 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-radial from-violet-700/10 via-transparent to-transparent" />
      </div>

      {/* Floating blurred shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute rounded-full blur-3xl animate-float-slow"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: shape.color,
            animationDuration: `${shape.duration}s`,
            animationDelay: `${shape.delay}s`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect - stronger */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
};

export default GlassBackground;

