import { useState, useRef, useEffect, useCallback } from 'react';
import { Monitor, Maximize2, Play } from 'lucide-react';

interface HeroMockup3DProps {
  siteUrl: string;
  onOpenFullscreen?: () => void;
  compact?: boolean;
  staticMode?: boolean;
}

const HeroMockup3D = ({ siteUrl, onOpenFullscreen, compact = false, staticMode = false }: HeroMockup3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Detectar se é mobile - apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Efeito parallax com mouse
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalizar posição do mouse (-1 a 1)
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x: x * 15, y: y * -10 }); // Multiplicadores para intensidade do efeito
  }, [isMobile]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Animação suave de retorno
    setMousePosition({ x: 0, y: 0 });
  };

  // Entrada animada
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`w-full ${compact ? 'max-w-md' : 'max-w-3xl'} mx-auto ${compact ? 'mt-0' : 'mt-0'} transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Header */}
      {!compact && (
        <div className="hidden sm:flex items-center justify-center gap-2 mb-4">
          <Monitor size={20} className="text-purple-400" />
          <span className="text-white font-semibold text-sm">Preview Interativo do Novo Site</span>
        </div>
      )}

      {/* Container 3D */}
      <div
        ref={containerRef}
        className="relative mx-auto cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onOpenFullscreen}
        style={{ perspective: '1200px' }}
      >
        {/* Glow de fundo */}
        <div 
          className={`absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-purple-600/20 blur-3xl rounded-3xl transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-50'
          }`}
        />

        {/* Mockup do Monitor */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: isMobile 
              ? 'rotateX(5deg) rotateY(0deg)' 
              : `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Frame do Monitor */}
          <div className="relative bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-3 shadow-2xl">
            {/* Borda superior com câmera */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-slate-600 rounded-b-lg flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
            </div>

            {/* Bezel preto */}
            <div className="bg-black rounded-xl p-1 relative overflow-hidden">
              {/* Tela */}
              <div 
                className="relative rounded-lg overflow-hidden bg-white"
                style={{ 
                  width: '100%', 
                  height: compact ? '180px' : (isMobile ? '200px' : '340px'),
                }}
              >
                {/* Site preview - static mode uses gradient placeholder, otherwise iframe */}
                {staticMode ? (
                  <div className="w-full h-full bg-gradient-to-b from-[#122737] via-[#1a3346] to-[#0f1f2e] relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col">
                      <div className="h-[8%] bg-white/5 flex items-center px-[4%]">
                        <div className="flex gap-[2px]">
                          <div className="w-[4px] h-[4px] rounded-full bg-white/20" />
                          <div className="w-[4px] h-[4px] rounded-full bg-white/20" />
                          <div className="w-[4px] h-[4px] rounded-full bg-white/20" />
                        </div>
                        <div className="ml-auto flex gap-[6px]">
                          <div className="w-[20px] h-[3px] bg-white/10 rounded" />
                          <div className="w-[20px] h-[3px] bg-white/10 rounded" />
                          <div className="w-[20px] h-[3px] bg-white/10 rounded" />
                        </div>
                      </div>
                      <div className="flex-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#122737]/80 to-[#1a3346]/60" />
                        <div className="relative p-[6%] space-y-[4%]">
                          <div className="w-[40%] h-[6px] bg-[#D4A574]/30 rounded" />
                          <div className="w-[70%] h-[8px] bg-white/15 rounded" />
                          <div className="w-[55%] h-[8px] bg-white/15 rounded" />
                          <div className="w-[80%] h-[4px] bg-white/5 rounded mt-[3%]" />
                          <div className="w-[60%] h-[4px] bg-white/5 rounded" />
                          <div className="flex gap-[4%] mt-[5%]">
                            <div className="w-[30%] h-[16px] bg-[#D4A574]/20 rounded-md" />
                            <div className="w-[30%] h-[16px] bg-white/5 rounded-md border border-white/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={siteUrl}
                    title="Preview do novo site"
                    className="w-full h-full border-0 pointer-events-none"
                    style={{
                      transform: 'scale(0.35)',
                      transformOrigin: 'top left',
                      width: '286%',
                      height: '286%',
                    }}
                    loading="lazy"
                  />
                )}

                {/* Reflexo da tela */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(
                      ${135 + mousePosition.x}deg,
                      rgba(255,255,255,0.15) 0%,
                      transparent 40%,
                      transparent 60%,
                      rgba(255,255,255,0.05) 100%
                    )`,
                  }}
                />

                {/* Botão Play Animado no Centro */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="relative">
                    {/* Círculos pulsantes - múltiplas camadas para efeito mais suave */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-20 h-20 rounded-full bg-purple-500/40 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute w-20 h-20 rounded-full bg-purple-500/30 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                      <div className="absolute w-16 h-16 rounded-full bg-purple-500/20 animate-pulse" style={{ animationDuration: '1.5s' }} />
                    </div>
                    
                    {/* Glow effect pulsante */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-20 h-20 rounded-full bg-purple-500/50 blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
                    </div>
                    
                    {/* Botão Play */}
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/70 transition-all duration-300 hover:scale-110 animate-pulse" style={{ animationDuration: '2s' }}>
                      <Play 
                        size={24} 
                        className="text-white ml-1" 
                        fill="white"
                      />
                    </div>
                  </div>
                </div>

                {/* Overlay hover - Texto abaixo do play */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ paddingTop: '150px' }}
                >
                  <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white font-semibold shadow-lg">
                    <Maximize2 size={20} />
                    <span>Clique para expandir</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra inferior do monitor (logo/chin) */}
            <div className="flex justify-center py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
              </div>
            </div>
          </div>

          {/* Suporte do monitor */}
          <div className="flex flex-col items-center" style={{ transform: 'translateZ(-20px)' }}>
            {/* Pescoço */}
            <div 
              className="w-12 h-12 bg-gradient-to-b from-slate-700 to-slate-800"
              style={{
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              }}
            />
            {/* Base */}
            <div 
              className="w-36 h-4 bg-gradient-to-b from-slate-600 to-slate-700 rounded-full"
              style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}
            />
          </div>

          {/* Sombra no "chão" */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-6 transition-all duration-300"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
              transform: `translateX(-50%) scaleX(${isHovered ? 1.3 : 1}) scaleY(${isHovered ? 0.7 : 1})`,
            }}
          />
        </div>

      </div>

      {/* Instruções */}
      {!compact && (
        <p className="text-center text-white/40 text-sm mt-6">
          {isMounted && isMobile ? 'Toque para ver em tela cheia' : 'Mova o mouse para interagir • Clique para expandir'}
        </p>
      )}

    </div>
  );
};

export default HeroMockup3D;

