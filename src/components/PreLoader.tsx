import { useState, useEffect } from 'react';

interface PreLoaderProps {
  onComplete: () => void;
}

const PreLoader = ({ onComplete }: PreLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    { text: "Iniciando engines...", icon: "🚀", duration: 800 },
    { text: "Carregando components...", icon: "⚙️", duration: 600 },
    { text: "Aplicando design system...", icon: "🎨", duration: 700 },
    { text: "Otimizando performance...", icon: "⚡", duration: 500 },
    { text: "Preparando experiência...", icon: "✨", duration: 400 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    const startProgress = () => {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsComplete(true);
            setTimeout(() => onComplete(), 500);
            return 100;
          }
          return prev + Math.random() * 3 + 1;
        });
      }, 50);
    };

    const startPhases = () => {
      let phaseIndex = 0;
      const nextPhase = () => {
        if (phaseIndex < phases.length) {
          setCurrentPhase(phaseIndex);
          phaseTimeout = setTimeout(() => {
            phaseIndex++;
            nextPhase();
          }, phases[phaseIndex].duration);
        }
      };
      nextPhase();
    };

    startProgress();
    startPhases();

    return () => {
      clearInterval(interval);
      clearTimeout(phaseTimeout);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-mesh flex items-center justify-center transition-opacity duration-500 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-workflow-energy/30 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo/Brand */}
        <div className="mb-12">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-workflow-energy via-workflow-600 to-workflow-zen rounded-3xl flex items-center justify-center shadow-workflow-lg animate-float">
              <span className="text-4xl font-bold text-white">W</span>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-workflow-energy via-workflow-600 to-workflow-zen rounded-3xl opacity-50 animate-glow-pulse" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-workflow-deep mb-2">
            <span className="text-gradient">Workflow</span>
          </h1>
          <p className="text-workflow-deep/70 font-medium">Digital Masterpiece Agency</p>
        </div>

        {/* Progress Section */}
        <div className="space-y-8">
          {/* Current Phase */}
          <div className="min-h-[60px] flex items-center justify-center">
            <div className="flex items-center gap-4 glass-workflow px-6 py-3 rounded-2xl animate-fade-in">
              <span className="text-2xl animate-bounce">
                {phases[currentPhase]?.icon}
              </span>
              <span className="text-workflow-deep font-medium">
                {phases[currentPhase]?.text}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-workflow-deep/60 font-medium">Progresso</span>
              <span className="text-sm font-bold text-workflow-energy">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full h-3 bg-workflow-energy/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-workflow-energy via-workflow-600 to-workflow-zen rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </div>
              </div>
              
              {/* Progress Glow */}
              <div 
                className="absolute top-0 h-3 bg-gradient-to-r from-workflow-energy/50 to-workflow-zen/50 rounded-full blur-sm transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Phase Indicators */}
          <div className="flex justify-center gap-2">
            {phases.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentPhase
                    ? 'bg-workflow-energy scale-110'
                    : 'bg-workflow-energy/20'
                }`}
              />
            ))}
          </div>

          {/* Loading Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-lg font-bold text-workflow-energy">
                {Math.round(progress * 0.15)}
              </div>
              <div className="text-xs text-workflow-deep/60">Components</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-workflow-energy">
                {Math.round(progress * 0.08)}
              </div>
              <div className="text-xs text-workflow-deep/60">Assets</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-workflow-energy">
                {Math.round(progress * 0.03)}
              </div>
              <div className="text-xs text-workflow-deep/60">Animations</div>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-12 text-center">
          <p className="text-xs text-workflow-deep/50 font-medium">
            Preparando sua experiência digital premium
          </p>
        </div>
      </div>

      {/* Rotating Border Effect */}
      <div className="absolute inset-4 border border-workflow-energy/20 rounded-3xl animate-rotate-slow pointer-events-none" />
      <div className="absolute inset-8 border border-workflow-zen/20 rounded-3xl animate-rotate-slow pointer-events-none" style={{ animationDirection: 'reverse' }} />
    </div>
  );
};

export default PreLoader;
