import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.01;

      // Create flowing wave patterns
      const drawWave = (amplitude: number, frequency: number, phase: number, color: string, opacity: number) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin((x * frequency) + phase + time) * amplitude;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${color}00`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      };

      // Multiple wave layers
      drawWave(80, 0.005, 0, '#7c3aed', 0.08);
      drawWave(60, 0.008, Math.PI / 4, '#a78bfa', 0.06);
      drawWave(40, 0.012, Math.PI / 2, '#06b6d4', 0.04);
      drawWave(100, 0.003, Math.PI, '#f59e0b', 0.03);

      // Floating orb effects
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 6) * (i + 1) + Math.sin(time * 0.5 + i) * 100;
        const y = (canvas.height / 3) + Math.cos(time * 0.3 + i) * 80;
        const radius = 60 + Math.sin(time * 0.8 + i) * 20;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(124, 58, 237, ${0.15 + Math.sin(time + i) * 0.05})`);
        gradient.addColorStop(0.5, `rgba(167, 139, 250, ${0.08 + Math.sin(time + i) * 0.03})`);
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Light streak effects
      for (let i = 0; i < 3; i++) {
        const angle = (time * 0.2 + i * Math.PI / 3) % (Math.PI * 2);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const length = Math.min(canvas.width, canvas.height) * 0.8;
        
        const x1 = centerX + Math.cos(angle) * (length / 2);
        const y1 = centerY + Math.sin(angle) * (length / 2);
        const x2 = centerX - Math.cos(angle) * (length / 2);
        const y2 = centerY - Math.sin(angle) * (length / 2);
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0)');
        gradient.addColorStop(0.5, `rgba(167, 139, 250, ${0.1 + Math.sin(time * 2 + i) * 0.05})`);
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 2 + Math.sin(time * 3 + i) * 1;
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-workflow-50 to-workflow-100" />
      
      {/* Animated mesh overlay */}
      <div className="absolute inset-0 opacity-60">
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
              linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(167, 139, 250, 0.05))
            `,
            backgroundSize: '400% 400%'
          }}
        />
      </div>

      {/* Canvas for dynamic effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-workflow-energy/20 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-workflow-zen/10 rounded-full blur-sm animate-float-delayed" />
        <div className="absolute top-1/2 left-3/4 w-16 h-16 border-2 border-workflow-accent/20 rotate-45 animate-bounce-subtle" />
        <div className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-gradient-to-br from-workflow-energy/10 to-transparent rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Diagonal light rays */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-workflow-energy/30 to-transparent transform rotate-12 animate-fade-in" />
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-workflow-zen/30 to-transparent transform -rotate-12 animate-fade-in" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Content overlay for readability */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default AnimatedBackground;
