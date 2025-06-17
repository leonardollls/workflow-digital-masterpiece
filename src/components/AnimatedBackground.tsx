import { useEffect, useRef, useCallback } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const isMobileRef = useRef<boolean>(false);

  // Detectar mobile para otimizações
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
  }, []);

  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Throttle para 30fps em mobile, 60fps em desktop
    const targetFPS = isMobileRef.current ? 30 : 60;
    const interval = 1000 / targetFPS;
    
    if (currentTime - lastTimeRef.current < interval) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastTimeRef.current = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const time = currentTime * 0.001; // Convert to seconds

    // Reduzir complexidade em mobile
    const complexity = isMobileRef.current ? 0.5 : 1;
    const waveCount = Math.floor(3 * complexity);
    const orbCount = Math.floor(3 * complexity);

    // Create flowing wave patterns (reduzido)
    const drawWave = (amplitude: number, frequency: number, phase: number, color: string, opacity: number) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      // Reduzir pontos de cálculo em mobile
      const step = isMobileRef.current ? 4 : 2;
      for (let x = 0; x < canvas.width; x += step) {
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

    // Waves simplificadas
    if (waveCount >= 1) drawWave(60, 0.005, 0, '#7c3aed', 0.06);
    if (waveCount >= 2) drawWave(40, 0.008, Math.PI / 4, '#a78bfa', 0.04);
    if (waveCount >= 3) drawWave(80, 0.003, Math.PI, '#f59e0b', 0.02);

    // Floating orb effects (reduzido)
    for (let i = 0; i < orbCount; i++) {
      const x = (canvas.width / (orbCount + 1)) * (i + 1) + Math.sin(time * 0.5 + i) * 50;
      const y = (canvas.height / 3) + Math.cos(time * 0.3 + i) * 40;
      const radius = 40 + Math.sin(time * 0.8 + i) * 10;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(124, 58, 237, ${0.1 + Math.sin(time + i) * 0.03})`);
      gradient.addColorStop(0.5, `rgba(167, 139, 250, ${0.05 + Math.sin(time + i) * 0.02})`);
      gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Light streak effects (apenas em desktop)
    if (!isMobileRef.current) {
      for (let i = 0; i < 2; i++) {
        const angle = (time * 0.2 + i * Math.PI) % (Math.PI * 2);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const length = Math.min(canvas.width, canvas.height) * 0.6;
        
        const x1 = centerX + Math.cos(angle) * (length / 2);
        const y1 = centerY + Math.sin(angle) * (length / 2);
        const x2 = centerX - Math.cos(angle) * (length / 2);
        const y2 = centerY - Math.sin(angle) * (length / 2);
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0)');
        gradient.addColorStop(0.5, `rgba(167, 139, 250, ${0.08 + Math.sin(time * 2 + i) * 0.03})`);
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 1 + Math.sin(time * 3 + i) * 0.5;
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Reduzir resolução em mobile para melhor performance
      const scale = isMobileRef.current ? Math.min(dpr, 1.5) : dpr;
      
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      
      ctx.scale(scale, scale);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 768;
      resizeCanvas();
    };
    
    window.addEventListener('resize', handleResize);

    // Iniciar animação
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-workflow-50 to-workflow-100" />
      
      {/* Animated mesh overlay - simplificado em mobile */}
      <div className="absolute inset-0 opacity-60">
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.12) 0%, transparent 50%),
              ${!isMobileRef.current ? 'radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),' : ''}
              linear-gradient(135deg, rgba(124, 58, 237, 0.04), rgba(167, 139, 250, 0.04))
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
      
      {/* Geometric patterns - reduzido em mobile */}
      <div className="absolute inset-0 pointer-events-none opacity-20 md:opacity-30">
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/6 w-20 md:w-32 h-20 md:h-32 border border-workflow-energy/20 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/4 w-12 md:w-20 h-12 md:h-20 bg-workflow-zen/10 rounded-full blur-sm animate-float-delayed" />
        {!isMobileRef.current && (
          <>
            <div className="absolute top-1/2 left-3/4 w-16 h-16 border-2 border-workflow-accent/20 rotate-45 animate-bounce-subtle" />
            <div className="absolute bottom-1/4 left-1/2 w-24 h-24 bg-gradient-to-br from-workflow-energy/10 to-transparent rounded-full animate-float" style={{ animationDelay: '2s' }} />
          </>
        )}
        
        {/* Grid pattern overlay - apenas desktop */}
        {!isMobileRef.current && (
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
        )}
      </div>
      
      {/* Content overlay for readability */}
      <div className="absolute inset-0 bg-white/3 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default AnimatedBackground;
