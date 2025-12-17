import { useState } from 'react';
import { Smartphone, Play } from 'lucide-react';

interface Mockup3DProps {
  siteUrl: string;
  onOpenFullscreen?: () => void;
}

const Mockup3D = ({ siteUrl, onOpenFullscreen }: Mockup3DProps) => {
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
                />

                {/* Screen reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

                {/* Botão Play Animado no Centro */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="relative">
                    {/* Círculos pulsantes */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute w-12 h-12 rounded-full bg-purple-500/30 animate-ping" />
                      <div className="absolute w-12 h-12 rounded-full bg-purple-500/20 animate-pulse" />
                    </div>
                    
                    {/* Botão Play */}
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-110">
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

