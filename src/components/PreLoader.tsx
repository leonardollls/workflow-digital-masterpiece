import { useEffect, useState } from 'react';

interface PreLoaderProps {
  onComplete: () => void;
}

const PreLoader = ({ onComplete }: PreLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simular carregamento mais rápido
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(onComplete, 300); // Reduzido de 500ms
          return 100;
        }
        return prev + 8; // Incremento maior para ser mais rápido
      });
    }, 50); // Intervalo menor

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-white via-workflow-50 to-workflow-100 flex items-center justify-center transition-opacity duration-300 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        {/* Logo simplificado */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-workflow-energy to-workflow-zen rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <span className="text-2xl text-white font-bold">W</span>
          </div>
          <h2 className="text-2xl font-bold text-workflow-deep mb-2">Workflow</h2>
          <p className="text-workflow-deep/60 text-sm">Digital Masterpiece</p>
        </div>

        {/* Progress bar simplificado */}
        <div className="w-64 mx-auto">
          <div className="bg-workflow-energy/20 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-workflow-energy to-workflow-zen h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-workflow-deep/60 text-sm font-medium">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
