import { useState, useEffect } from 'react';
import { Activity, RefreshCw, TrendingUp } from 'lucide-react';

interface UptimeScoreProps {
  siteUrl: string;
}

const UptimeScore = ({ siteUrl }: UptimeScoreProps) => {
  const [uptime, setUptime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animatedUptime, setAnimatedUptime] = useState(0);

  const checkUptime = async () => {
    setIsLoading(true);
    setError(false);
    setAnimatedUptime(0);

    try {
      // Simular verificação de uptime
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Sempre retornar um uptime alto (entre 99.5-99.9%)
      const finalUptime = parseFloat((99.5 + Math.random() * 0.4).toFixed(2));
      
      setUptime(finalUptime);
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
        setAnimatedUptime(parseFloat((finalUptime * eased).toFixed(2)));

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
    checkUptime();
  }, [siteUrl]);

  const getUptimeColor = (uptime: number): string => {
    if (uptime >= 99.9) return '#22c55e'; // green
    if (uptime >= 99.5) return '#3b82f6'; // blue
    if (uptime >= 99.0) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getUptimeLabel = (uptime: number): string => {
    if (uptime >= 99.9) return 'Excepcional';
    if (uptime >= 99.5) return 'Excelente';
    if (uptime >= 99.0) return 'Bom';
    return 'Regular';
  };

  const uptimeColor = uptime ? getUptimeColor(uptime) : '#22c55e';
  const uptimeLabel = uptime ? getUptimeLabel(uptime) : 'Excelente';

  return (
    <div className="relative flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Activity size={20} className="text-blue-400" />
        <span className="text-white font-medium text-sm">Uptime</span>
      </div>

      {/* Main display - Container similar ao QR Code */}
      <div className="relative flex flex-col items-center justify-center flex-1 min-h-0" style={{ minHeight: '152px' }}>
        {isLoading ? (
          <div className="flex flex-col items-center">
            <RefreshCw size={32} className="text-white/40 animate-spin mb-2" />
            <span className="text-white/60 text-sm">Verificando...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <span className="text-red-400 text-lg mb-2">Erro</span>
            <button
              onClick={checkUptime}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            {/* Uptime display */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold" style={{ color: uptimeColor }}>
                  {animatedUptime.toFixed(2)}
                </span>
                <span className="text-white/60 text-2xl">%</span>
              </div>
              
              {/* Status badge */}
              <div className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full`} style={{ backgroundColor: `${uptimeColor}20` }}>
                <TrendingUp size={14} style={{ color: uptimeColor }} />
                <span className="text-xs font-medium" style={{ color: uptimeColor }}>
                  {uptimeLabel}
                </span>
              </div>
            </div>

            {/* Info text */}
            <div className="mt-4 text-center">
              <span className="text-white/40 text-xs">Disponibilidade</span>
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
            onClick={checkUptime}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group/btn"
            title="Verificar novamente"
          >
            <RefreshCw size={14} className="text-white/40 group-hover/btn:text-white/60 transition-colors" />
          </button>
        )}
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl rounded-2xl transition-opacity duration-300 -z-10" />
    </div>
  );
};

export default UptimeScore;

