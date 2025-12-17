import { useState, useEffect } from 'react';
import { Code, RefreshCw, CheckCircle } from 'lucide-react';

interface CodeOptimizationProps {
  siteUrl: string;
}

const CodeOptimization = ({ siteUrl }: CodeOptimizationProps) => {
  const [optimization, setOptimization] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animatedOptimization, setAnimatedOptimization] = useState(0);

  const checkOptimization = async () => {
    setIsLoading(true);
    setError(false);
    setAnimatedOptimization(0);

    try {
      // Simular verificação de otimização
      await new Promise(resolve => setTimeout(resolve, 750));
      
      // Sempre retornar uma otimização alta (entre 92-98%)
      const finalOptimization = Math.round(92 + Math.random() * 6);
      
      setOptimization(finalOptimization);
      setIsLoading(false);

      // Animate the counter
      const duration = 1200;
      const steps = 60;
      const stepTime = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedOptimization(Math.round(finalOptimization * eased));

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
    checkOptimization();
  }, [siteUrl]);

  const getOptimizationColor = (optimization: number): string => {
    if (optimization >= 95) return '#22c55e'; // green
    if (optimization >= 90) return '#3b82f6'; // blue
    if (optimization >= 85) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getOptimizationLabel = (optimization: number): string => {
    if (optimization >= 95) return 'Otimizado';
    if (optimization >= 90) return 'Bem Otimizado';
    if (optimization >= 85) return 'Moderado';
    return 'Necessita Melhorias';
  };

  const optimizationColor = optimization ? getOptimizationColor(optimization) : '#22c55e';
  const optimizationLabel = optimization ? getOptimizationLabel(optimization) : 'Otimizado';

  return (
    <div className="relative flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Code size={20} className="text-cyan-400" />
        <span className="text-white font-medium text-sm">Otimização de Código</span>
      </div>

      {/* Main display - Container similar ao QR Code */}
      <div className="relative flex flex-col items-center justify-center flex-1 min-h-0" style={{ minHeight: '152px' }}>
        {isLoading ? (
          <div className="flex flex-col items-center">
            <RefreshCw size={32} className="text-white/40 animate-spin mb-2" />
            <span className="text-white/60 text-sm">Analisando...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <span className="text-red-400 text-lg mb-2">Erro</span>
            <button
              onClick={checkOptimization}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {/* Optimization display */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold" style={{ color: optimizationColor }}>
                  {animatedOptimization}
                </span>
                <span className="text-white/60 text-2xl">%</span>
              </div>
              
              {/* Status badge */}
              <div className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full`} style={{ backgroundColor: `${optimizationColor}20` }}>
                <CheckCircle size={14} style={{ color: optimizationColor }} />
                <span className="text-xs font-medium" style={{ color: optimizationColor }}>
                  {optimizationLabel}
                </span>
              </div>
            </div>

            {/* Info text */}
            <div className="mt-4 text-center">
              <span className="text-white/40 text-xs">Minificação & Compressão</span>
            </div>
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
            onClick={checkOptimization}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/btn"
            title="Analisar novamente"
          >
            <RefreshCw size={14} className="text-white/40 group-hover/btn:text-white/60 transition-colors" />
          </button>
        )}
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl rounded-2xl transition-opacity duration-300 -z-10" />
    </div>
  );
};

export default CodeOptimization;

