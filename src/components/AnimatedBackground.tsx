import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = [];
      const colors = ['#7c3aed', '#a78bfa', '#06b6d4', '#f59e0b'];
      
      for (let i = 0; i < 80; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setParticles(newParticles);
    };

    createParticles();
    window.addEventListener('resize', createParticles);
    return () => window.removeEventListener('resize', createParticles);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Mouse interaction
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.x -= (dx / distance) * force * 0.5;
            particle.y -= (dy / distance) * force * 0.5;
          }

          // Update position
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

          // Keep within bounds
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));

          return particle;
        })
      );

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, mousePosition]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-workflow-50 via-white to-workflow-100" />
      
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-gradient-shift" />
      
      {/* Radial Gradients */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-workflow-energy/20 to-transparent opacity-60" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-workflow-zen/20 to-transparent opacity-60" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-radial from-workflow-accent/10 to-transparent opacity-40" />
      
      {/* Canvas for Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* CSS-based floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-workflow-energy/10 to-workflow-zen/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-workflow-accent/10 to-workflow-energy/10 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-gradient-to-br from-workflow-zen/10 to-workflow-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 right-10 w-4 h-4 bg-workflow-energy/20 rounded-sm rotate-45 animate-spin-slow" />
        <div className="absolute bottom-20 left-10 w-6 h-6 border-2 border-workflow-zen/20 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-gradient-to-br from-workflow-accent/20 to-transparent rotate-12 animate-bounce-subtle" />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-10 bg-noise" />
      </div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-workflow-energy/20 via-transparent to-transparent transform rotate-12 animate-fade-in" />
        <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-workflow-zen/20 via-transparent to-transparent transform -rotate-12 animate-fade-in" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Overlay for content readability */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default AnimatedBackground;
