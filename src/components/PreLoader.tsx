
import { useState, useEffect } from 'react';

interface PreLoaderProps {
  onComplete: () => void;
}

const PreLoader = ({ onComplete }: PreLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress >= 30 && stage === 0) setStage(1);
    if (progress >= 60 && stage === 1) setStage(2);
    if (progress >= 90 && stage === 2) setStage(3);
  }, [progress, stage]);

  const loadingTexts = [
    "Inicializando máquina de conversão...",
    "Carregando cases premiados...",
    "Preparando experiência imersiva...",
    "Ativando modo alta performance..."
  ];

  return (
    <div className="fixed inset-0 bg-workflow-deep z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-workflow-energy rounded-full animate-particle opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo Formation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-4xl font-display font-bold text-white mb-2 animate-fade-in">
              Work<span className="text-workflow-zen">flow</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-workflow-energy to-workflow-zen mx-auto rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-workflow-zen text-lg mb-8 animate-glow">
          {loadingTexts[stage]}
        </p>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="text-white">
            <div className="text-2xl font-bold text-workflow-zen">{progress}%</div>
            <div className="text-sm opacity-70">Carregado</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold text-workflow-zen">150+</div>
            <div className="text-sm opacity-70">Projetos</div>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold text-workflow-zen">98%</div>
            <div className="text-sm opacity-70">Satisfação</div>
          </div>
        </div>

        {/* Konami Code Easter Egg Hint */}
        {progress > 80 && (
          <div className="mt-8 text-xs text-workflow-zen/50 animate-fade-in">
            👾 Dica: ↑↑↓↓←→←→BA para modo ninja
          </div>
        )}
      </div>
    </div>
  );
};

export default PreLoader;
