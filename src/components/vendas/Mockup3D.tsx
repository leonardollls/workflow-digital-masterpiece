import { useState } from 'react';
import { Smartphone, Play } from 'lucide-react';

interface Mockup3DProps {
  siteUrl: string;
  onOpenFullscreen?: () => void;
  staticMode?: boolean;
  mockupImage?: string;
}

const Mockup3D = ({ siteUrl, onOpenFullscreen, staticMode = false, mockupImage }: Mockup3DProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onOpenFullscreen) {
      onOpenFullscreen();
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* 3D Mockup Container */}
      <div
        className="perspective-1500 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div
          className="relative transition-transform duration-700 ease-out preserve-3d"
          style={{
            transform: isHovered
              ? 'rotateY(0deg) rotateX(0deg)'
              : 'rotateY(-15deg) rotateX(10deg)',
          }}
        >
          {/* Smartphone Frame */}
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2rem] p-2 shadow-2xl">
            {/* Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-xl z-10" />
            
            {/* Screen bezel */}
            <div className="bg-black rounded-[1.5rem] p-1">
              {/* Screen */}
              <div className="relative rounded-[1.25rem] overflow-hidden bg-white" style={{ width: '150px', height: '270px' }}>
                {staticMode ? (
                  mockupImage ? (
                    <img
                      src={mockupImage}
                      alt="Preview mobile do site Roberta Bento Odontologia"
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#122737] via-[#1a3346] to-[#0f1f2e] relative overflow-hidden">
                      <div className="absolute inset-0 flex flex-col">
                        <div className="h-[10%] bg-white/5 flex items-center px-2">
                          <div className="w-[30px] h-[3px] bg-[#D4A574]/30 rounded" />
                          <div className="ml-auto flex gap-1">
                            <div className="w-[10px] h-[2px] bg-white/10 rounded" />
                            <div className="w-[10px] h-[2px] bg-white/10 rounded" />
                          </div>
                        </div>
                        <div className="flex-1 p-3 space-y-2">
                          <div className="w-[50%] h-[3px] bg-[#D4A574]/25 rounded" />
                          <div className="w-[80%] h-[4px] bg-white/12 rounded" />
                          <div className="w-[60%] h-[4px] bg-white/12 rounded" />
                          <div className="w-[90%] h-[2px] bg-white/5 rounded mt-2" />
                          <div className="w-[70%] h-[2px] bg-white/5 rounded" />
                          <div className="flex gap-2 mt-3">
                            <div className="w-[35%] h-[10px] bg-[#D4A574]/20 rounded" />
                            <div className="w-[35%] h-[10px] bg-white/5 rounded border border-white/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <iframe
                    src={siteUrl}
                    title="Preview 3D Mobile do site"
                    className="w-full h-full border-0 pointer-events-none"
                    style={{
                      transform: 'scale(0.28)',
                      transformOrigin: 'top left',
                      width: '357%',
                      height: '357%',
                    }}
                    loading="lazy"
                  />
                )}

                {/* Screen reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                {/* Botão Play Animado no Centro */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="relative">
                    {/* Círculos pulsantes - múltiplas camadas para efeito mais suave */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-16 h-16 rounded-full bg-purple-500/40 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute w-16 h-16 rounded-full bg-purple-500/30 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                      <div className="absolute w-12 h-12 rounded-full bg-purple-500/20 animate-pulse" style={{ animationDuration: '1.5s' }} />
                    </div>
                    
                    {/* Glow effect pulsante */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-16 h-16 rounded-full bg-purple-500/50 blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
                    </div>
                    
                    {/* Botão Play */}
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/70 transition-all duration-300 hover:scale-110 animate-pulse" style={{ animationDuration: '2s' }}>
                      <Play 
                        size={18} 
                        className="text-white ml-0.5" 
                        fill="white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center mt-1.5">
              <div className="w-16 h-0.5 rounded-full bg-white/30" />
            </div>
          </div>

          {/* Shadow on surface */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full transition-all duration-700"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
              transform: isHovered
                ? 'translateX(-50%) scaleX(1.2) scaleY(0.8)'
                : 'translateX(-50%) scaleX(1) scaleY(1)',
            }}
          />
        </div>
      </div>

      {/* Instruction */}
      <p className="mt-6 text-white/40 text-xs">
        Passe o mouse para interagir
      </p>
    </div>
  );
};

export default Mockup3D;

