import { useState, useEffect } from 'react';
import { Clock, Smartphone, Activity, Shield, Zap, Globe, Lock } from 'lucide-react';

interface ScoreItem {
  name: string;
  score: number;
  color: string;
}

interface MetricCard {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
  isDesktopOnly: boolean;
}

const LighthouseScores = () => {
  const [animatedScores, setAnimatedScores] = useState<number[]>([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedMetrics, setAnimatedMetrics] = useState<{ [key: string]: number }>({});

  const scores: ScoreItem[] = [
    { name: 'Performance', score: 98, color: '#22c55e' },
    { name: 'Acessibilidade', score: 95, color: '#3b82f6' },
    { name: 'SEO', score: 100, color: '#8b5cf6' },
    { name: 'Boas Práticas', score: 96, color: '#f59e0b' },
  ];

  // Novos cards de métricas adicionais (desktop only)
  const additionalMetrics: MetricCard[] = [
    {
      id: 'loadTime',
      icon: <Clock size={24} />,
      label: 'Tempo de Carga',
      value: '1.2s',
      subtext: 'First Contentful Paint',
      color: '#06b6d4', // cyan
      isDesktopOnly: true,
    },
    {
      id: 'mobileScore',
      icon: <Smartphone size={24} />,
      label: 'Mobile Score',
      value: '95+',
      subtext: 'Otimização Mobile',
      color: '#10b981', // emerald
      isDesktopOnly: true,
    },
    {
      id: 'webVitals',
      icon: <Activity size={24} />,
      label: 'Core Web Vitals',
      value: 'Aprovado',
      subtext: 'LCP, FID, CLS',
      color: '#8b5cf6', // violet
      isDesktopOnly: true,
    },
    {
      id: 'ssl',
      icon: <Shield size={24} />,
      label: 'SSL/HTTPS',
      value: 'Ativo',
      subtext: 'Certificado Válido',
      color: '#22c55e', // green
      isDesktopOnly: true,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      setAnimatedScores(scores.map(s => Math.round(s.score * eased)));
      
      // Animar métricas numéricas
      setAnimatedMetrics({
        loadTime: parseFloat((1.2 * eased).toFixed(1)),
        mobileScore: Math.round(95 * eased),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [isVisible]);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#22c55e'; // green
    if (score >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const circumference = 2 * Math.PI * 45; // r = 45

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Lighthouse Scores - Circles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {scores.map((item, index) => {
          const animatedScore = animatedScores[index];
          const strokeDasharray = `${(animatedScore / 100) * circumference} ${circumference}`;
          const color = getScoreColor(item.score);

          return (
            <div
              key={index}
              className="group relative flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Circle Progress */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={strokeDasharray}
                    className="transition-all duration-100"
                    style={{
                      filter: `drop-shadow(0 0 6px ${color})`,
                    }}
                  />
                </svg>

                {/* Score number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color }}
                  >
                    {animatedScore}
                  </span>
                </div>
              </div>

              {/* Label */}
              <span className="text-white/80 text-xs sm:text-sm font-medium text-center">
                {item.name}
              </span>

              {/* Glow effect */}
              <div
                className="absolute -inset-1 opacity-0 group-hover:opacity-30 blur-xl rounded-2xl transition-opacity duration-300"
                style={{ backgroundColor: color }}
              />
            </div>
          );
        })}
      </div>

      {/* Additional Metrics - Desktop Only */}
      <div className="hidden md:grid grid-cols-4 gap-4 sm:gap-6">
        {additionalMetrics.map((metric, index) => {
          // Determinar valor animado
          let displayValue = metric.value;
          if (metric.id === 'loadTime' && animatedMetrics.loadTime !== undefined) {
            displayValue = `${animatedMetrics.loadTime.toFixed(1)}s`;
          } else if (metric.id === 'mobileScore' && animatedMetrics.mobileScore !== undefined) {
            displayValue = `${animatedMetrics.mobileScore}+`;
          }

          return (
            <div
              key={metric.id}
              className={`group relative flex flex-col items-center p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ 
                transitionDelay: `${(index + 4) * 100}ms`,
              }}
            >
              {/* Icon container */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: `${metric.color}20`,
                  color: metric.color,
                }}
              >
                {metric.icon}
              </div>

              {/* Value */}
              <div 
                className="text-2xl font-bold mb-1 flex items-center gap-1"
                style={{ color: metric.color }}
              >
                {displayValue}
              </div>

              {/* Label */}
              <span className="text-white/80 text-sm font-medium text-center mb-1">
                {metric.label}
              </span>

              {/* Subtext */}
              <span className="text-white/40 text-xs text-center">
                {metric.subtext}
              </span>

              {/* Status indicator */}
              <div className="absolute top-3 right-3">
                {metric.id === 'ssl' ? (
                  <Lock size={12} className="text-green-500" />
                ) : metric.id === 'loadTime' ? (
                  <Zap size={12} className="text-cyan-500" />
                ) : metric.id === 'mobileScore' ? (
                  <Globe size={12} className="text-emerald-500" />
                ) : (
                  <Activity size={12} className="text-violet-500" />
                )}
              </div>

              {/* Glow effect */}
              <div
                className="absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-300"
                style={{ backgroundColor: metric.color }}
              />

              {/* Animated border gradient on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, transparent 40%, ${metric.color}20 50%, transparent 60%)`,
                  backgroundSize: '200% 200%',
                  animation: 'shimmer 2s linear infinite',
                }}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </div>
  );
};

export default LighthouseScores;
