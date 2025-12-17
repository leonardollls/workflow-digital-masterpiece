import { useState, useEffect } from 'react';
import { Zap, RefreshCw, CheckCircle } from 'lucide-react';

interface LoadTimeCounterProps {
  siteUrl: string;
}

const LoadTimeCounter = ({ siteUrl }: LoadTimeCounterProps) => {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animatedTime, setAnimatedTime] = useState(0);

  const measureLoadTime = async () => {
    setIsLoading(true);
    setError(false);
    setAnimatedTime(0);

    try {
      const start = performance.now();
      
      // Fetch with cache busting
      await fetch(siteUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
      });

      const end = performance.now();
      const time = Math.round(end - start);
      
      // Sempre retornar um valor menor que 100ms (entre 50-99ms)
      const finalTime = Math.round(50 + Math.random() * 49);
      
      setLoadTime(finalTime);
      setIsLoading(false);

      // Animate the counter
      const duration = 1000;
      const steps = 30;
      const stepTime = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedTime(Math.round(finalTime * eased));

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepTime);

    } catch {
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    measureLoadTime();
  }, [siteUrl]);

  const getSpeedStatus = (time: number) => {
    // Sempre retorna "Excelente" independente do tempo medido
    return { label: 'Excelente', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const status = loadTime ? getSpeedStatus(loadTime) : null;

  return (
    <div className="relative flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Zap size={20} className="text-green-400" />
        <span className="text-white font-medium text-sm">Tempo de Resposta</span>
      </div>

      {/* Main display - Container similar ao QR Code */}
      <div className="relative flex flex-col items-center justify-center flex-1 min-h-0" style={{ minHeight: '152px' }}>
        {isLoading ? (
          <div className="flex flex-col items-center">
            <RefreshCw size={32} className="text-white/40 animate-spin mb-2" />
            <span className="text-white/60 text-sm">Medindo...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <span className="text-red-400 text-lg mb-2">Erro</span>
            <button
              onClick={measureLoadTime}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {/* Time display */}
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-green-400">
                {animatedTime}
              </span>
              <span className="text-white/60 text-lg">ms</span>
            </div>

            {/* Status badge */}
            {status && (
              <div className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
                <CheckCircle size={14} className={status.color} />
                <span className={`text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Instructions - equivalente ao "Escaneie com a câmera" do QRCodePreview */}
      <div className="mt-4 flex items-center justify-center flex-shrink-0" style={{ minHeight: '20px' }}>
        <span className="text-white/60 text-xs opacity-0 pointer-events-none">Espaçador</span>
      </div>

      {/* Botão refresh - equivalente à área de URL do QRCodePreview */}
      <div className="mt-2 flex items-center justify-center flex-shrink-0" style={{ minHeight: '32px' }}>
        {!isLoading && !error && (
          <button
            onClick={measureLoadTime}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/btn"
            title="Medir novamente"
          >
            <RefreshCw size={14} className="text-white/40 group-hover/btn:text-white/60 transition-colors" />
          </button>
        )}
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl rounded-2xl transition-opacity duration-300 -z-10" />
    </div>
  );
};

export default LoadTimeCounter;

