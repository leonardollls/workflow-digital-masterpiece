
import { useState, useEffect } from 'react';

const SuccessDashboard = () => {
  const [metrics, setMetrics] = useState({
    conversionIncrease: 247,
    revenueGenerated: 18700000,
    clientHappiness: 94,
    projectsDelivered: 150
  });

  useEffect(() => {
    // Animate counters on mount
    const timer = setTimeout(() => {
      setMetrics({
        conversionIncrease: 247,
        revenueGenerated: 18700000,
        clientHappiness: 94,
        projectsDelivered: 150
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section className="py-20 bg-workflow-deep relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhNDVmYzQiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Centro de <span className="text-workflow-zen">Comando</span>
          </h2>
          <p className="text-xl text-workflow-zen/80">
            Dashboard em tempo real dos nossos resultados científicos
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Conversion Meter */}
          <div className="card-workflow bg-white/10 backdrop-blur-lg border-workflow-zen/20 hover:bg-white/15 transition-all duration-500">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="rgba(195,174,224,0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#c3aee0"
                    strokeWidth="2"
                    strokeDasharray="75, 100"
                    className="animate-[dash_2s_ease-in-out_forwards]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-workflow-zen">
                    {metrics.conversionIncrease}%
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Conversão Média</h3>
              <p className="text-workflow-zen/70 text-sm">Aumento comprovado</p>
            </div>
          </div>

          {/* Revenue Generated */}
          <div className="card-workflow bg-white/10 backdrop-blur-lg border-workflow-zen/20 hover:bg-white/15 transition-all duration-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {formatCurrency(metrics.revenueGenerated)}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Revenue Gerado</h3>
              <p className="text-workflow-zen/70 text-sm">Para nossos clientes</p>
              <div className="mt-4 bg-success/20 rounded-full h-2">
                <div className="bg-success h-full rounded-full w-3/4 animate-[slideIn_1.5s_ease-out]"></div>
              </div>
            </div>
          </div>

          {/* Client Happiness */}
          <div className="card-workflow bg-white/10 backdrop-blur-lg border-workflow-zen/20 hover:bg-white/15 transition-all duration-500">
            <div className="text-center">
              <div className="relative w-24 h-12 mx-auto mb-4">
                {/* Simplified NPS gauge */}
                <div className="absolute inset-0 bg-workflow-zen/20 rounded-t-full"></div>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-warning to-success rounded-t-full transition-all duration-1000"
                  style={{ 
                    clipPath: `polygon(0 100%, ${metrics.clientHappiness}% 100%, ${metrics.clientHappiness/2}% 0, 0 0)` 
                  }}
                ></div>
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <span className="text-2xl font-bold text-white">{metrics.clientHappiness}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">NPS Score</h3>
              <p className="text-workflow-zen/70 text-sm">Satisfação cliente</p>
            </div>
          </div>

          {/* Project Velocity */}
          <div className="card-workflow bg-white/10 backdrop-blur-lg border-workflow-zen/20 hover:bg-white/15 transition-all duration-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-info mb-2">
                {metrics.projectsDelivered}+
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Projetos</h3>
              <p className="text-workflow-zen/70 text-sm">Entregues com sucesso</p>
              <div className="mt-4 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-8 bg-info rounded-full animate-pulse"
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      height: `${20 + Math.random() * 20}px`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Reach Map */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-8">
            Alcance <span className="text-workflow-zen">Global</span>
          </h3>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-workflow-zen/20">
              <div className="text-6xl mb-4">🌍</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">Brasil</div>
                  <div className="text-white/70">127 clientes</div>
                  <div className="w-full bg-workflow-zen/20 h-1 rounded-full mt-2">
                    <div className="bg-workflow-zen h-full rounded-full w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">EUA</div>
                  <div className="text-white/70">34 clientes</div>
                  <div className="w-full bg-workflow-zen/20 h-1 rounded-full mt-2">
                    <div className="bg-workflow-zen h-full rounded-full w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">Europa</div>
                  <div className="text-white/70">18 clientes</div>
                  <div className="w-full bg-workflow-zen/20 h-1 rounded-full mt-2">
                    <div className="bg-workflow-zen h-full rounded-full w-1/2"></div>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-workflow-zen">Outros</div>
                  <div className="text-white/70">12 clientes</div>
                  <div className="w-full bg-workflow-zen/20 h-1 rounded-full mt-2">
                    <div className="bg-workflow-zen h-full rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessDashboard;
