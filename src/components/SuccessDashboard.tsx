import { useState, useEffect } from 'react';

const SuccessDashboard = () => {
  const [metrics, setMetrics] = useState({
    conversionIncrease: 247,
    clientHappiness: 94,
    projectsDelivered: 150,
    performanceScore: 98,
    seoScore: 95
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const section = document.getElementById('centro-comando');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Animate counters on mount
    if (isVisible) {
      const timer = setTimeout(() => {
        setMetrics({
          conversionIncrease: 247,
          clientHappiness: 94,
          projectsDelivered: 150,
          performanceScore: 98,
          seoScore: 95
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <section id="centro-comando" className="py-20 bg-gradient-to-br from-workflow-deep via-workflow-deep/95 to-purple-900/90 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhNDVmYzQiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-workflow-zen/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-workflow-zen/20">
            <span className="text-2xl">⚡</span>
            <span className="text-workflow-zen font-semibold">Métricas em Tempo Real</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Centro de <span className="text-gradient-zen">Comando</span>
          </h2>
          <p className="text-xl text-workflow-zen/80 max-w-2xl mx-auto">
            Dashboard científico com resultados comprovados e métricas de alta performance
          </p>
        </div>

                 {/* Enhanced Metrics Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Conversion Meter - Enhanced */}
           <div className={`card-workflow bg-white/95 backdrop-blur-xl border-gray-200/50 hover:border-workflow-zen/60 transform hover:scale-105 transition-all duration-500 group shadow-lg hover:shadow-xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="text-center">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="rgba(195,174,224,0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="url(#conversionGradient)"
                    strokeWidth="3"
                    strokeDasharray="75, 100"
                    strokeLinecap="round"
                    className="animate-[dash_2s_ease-in-out_forwards]"
                  />
                  <defs>
                    <linearGradient id="conversionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c3aee0" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                                 <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-3xl font-bold text-workflow-deep">
                     {metrics.conversionIncrease}%
                   </span>
                 </div>
               </div>
               <h3 className="text-lg font-semibold text-workflow-deep mb-2 group-hover:text-workflow-zen transition-colors">Conversão Média</h3>
               <p className="text-gray-600 text-sm">Aumento comprovado</p>
               <div className="mt-4 flex justify-center">
                 <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">
                   ↗ +{metrics.conversionIncrease}%
                 </span>
               </div>
            </div>
          </div>

                     {/* Impacto Digital - Substitui Leads */}
           <div className={`card-workflow bg-white/95 backdrop-blur-xl border-gray-200/50 hover:border-workflow-zen/60 transform hover:scale-105 transition-all duration-500 group shadow-lg hover:shadow-xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
             <div className="text-center">
               <div className="text-4xl font-bold text-gradient-rainbow mb-3">
                 385%
               </div>
               <h3 className="text-lg font-semibold text-workflow-deep mb-2 group-hover:text-workflow-zen transition-colors">Impacto Digital</h3>
               <p className="text-gray-600 text-sm">Crescimento médio dos clientes</p>
               <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full h-2">
                 <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-5/6 animate-[slideIn_1.5s_ease-out]"></div>
               </div>
               <div className="mt-3 flex justify-center">
                 <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full border border-purple-200">
                   📈 ROI Comprovado
                 </span>
               </div>
             </div>
           </div>

                     {/* Performance Score - Nova métrica */}
           <div className={`card-workflow bg-white/95 backdrop-blur-xl border-gray-200/50 hover:border-workflow-zen/60 transform hover:scale-105 transition-all duration-500 group shadow-lg hover:shadow-xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <div className="relative w-28 h-16 mx-auto mb-4">
                {/* Speed/SEO gauge */}
                <div className="flex justify-between items-end h-full">
                                     <div className="flex flex-col items-center">
                     <div className="relative w-12 h-12 mb-2">
                       <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                       <div 
                         className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                         style={{ 
                           background: `conic-gradient(from 0deg, #10b981 ${metrics.performanceScore * 3.6}deg, rgba(229, 231, 235, 1) ${metrics.performanceScore * 3.6}deg)`
                         }}
                       ></div>
                                             <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-sm font-bold text-white">{metrics.performanceScore}</span>
                       </div>
                     </div>
                     <span className="text-xs text-gray-600">Speed</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <div className="relative w-12 h-12 mb-2">
                       <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                       <div 
                         className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000"
                         style={{ 
                           background: `conic-gradient(from 0deg, #3b82f6 ${metrics.seoScore * 3.6}deg, rgba(229, 231, 235, 1) ${metrics.seoScore * 3.6}deg)`
                         }}
                       ></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-sm font-bold text-white">{metrics.seoScore}</span>
                       </div>
                     </div>
                     <span className="text-xs text-gray-600">SEO</span>
                   </div>
                 </div>
               </div>
               <h3 className="text-lg font-semibold text-workflow-deep mb-2 group-hover:text-workflow-zen transition-colors">Performance Score</h3>
               <p className="text-gray-600 text-sm">Velocidade e otimização</p>
               <div className="mt-3 flex justify-center gap-2">
                 <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-200">
                   ⚡ {metrics.performanceScore}/100
                 </span>
                 <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200">
                   🔍 {metrics.seoScore}/100
                 </span>
               </div>
            </div>
          </div>

                     {/* Client Happiness - Melhorado */}
           <div className={`card-workflow bg-white/95 backdrop-blur-xl border-gray-200/50 hover:border-workflow-zen/60 transform hover:scale-105 transition-all duration-500 group shadow-lg hover:shadow-xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="relative w-28 h-16 mx-auto mb-4">
                {/* Enhanced NPS gauge */}
                <div className="absolute inset-0 bg-workflow-zen/20 rounded-t-full"></div>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-green-500 rounded-t-full transition-all duration-1000 overflow-hidden"
                  style={{ 
                    clipPath: `polygon(0 100%, ${metrics.clientHappiness}% 100%, ${metrics.clientHappiness/2}% 0, 0 0)` 
                  }}
                ></div>
                                 <div className="absolute inset-0 flex items-end justify-center pb-2">
                   <span className="text-3xl font-bold text-workflow-deep">{metrics.clientHappiness}</span>
                 </div>
                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                   <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                 </div>
               </div>
               <h3 className="text-lg font-semibold text-workflow-deep mb-2 group-hover:text-workflow-zen transition-colors">NPS Score</h3>
               <p className="text-gray-600 text-sm">Satisfação cliente</p>
               <div className="mt-3 flex justify-center">
                 <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200">
                   😊 Promotores: {metrics.clientHappiness}%
                 </span>
               </div>
            </div>
          </div>

                                {/* Project Velocity - Melhorado */}
           <div className={`card-workflow bg-white/95 backdrop-blur-xl border-gray-200/50 hover:border-workflow-zen/60 transform hover:scale-105 transition-all duration-500 group shadow-lg hover:shadow-xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
             <div className="text-center">
               <div className="text-4xl font-bold text-gradient-rainbow mb-3">
                 {metrics.projectsDelivered}+
               </div>
               <h3 className="text-lg font-semibold text-workflow-deep mb-2 group-hover:text-workflow-zen transition-colors">Projetos</h3>
               <p className="text-gray-600 text-sm">Entregues com sucesso</p>
               <div className="mt-4 flex justify-center gap-1">
                 {[...Array(7)].map((_, i) => (
                   <div 
                     key={i}
                     className="w-2 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full animate-pulse"
                     style={{ 
                       animationDelay: `${i * 0.15}s`,
                       height: `${20 + Math.sin(i) * 15}px`
                     }}
                   />
                 ))}
               </div>
               <div className="mt-3 flex justify-center">
                 <span className="inline-flex items-center gap-1 text-xs bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full border border-cyan-200">
                   🚀 100% no prazo
                 </span>
               </div>
             </div>
           </div>

                                {/* Metodologia Científica - Nova métrica */}
           <div className={`card-workflow bg-white/95 backdrop-blur-xl border-gray-200/50 hover:border-workflow-zen/60 transform hover:scale-105 transition-all duration-500 group shadow-lg hover:shadow-xl ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
             <div className="text-center">
               <div className="text-4xl mb-3">🔬</div>
               <div className="text-3xl font-bold text-gradient-zen mb-3">
                 A/B Tests
               </div>
               <h3 className="text-lg font-semibold text-workflow-deep mb-2 group-hover:text-workflow-zen transition-colors">Metodologia</h3>
               <p className="text-gray-600 text-sm">Abordagem científica</p>
               <div className="mt-4 space-y-2">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-600">Hipóteses testadas</span>
                   <span className="text-workflow-deep font-semibold">847</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-600">Taxa de acerto</span>
                   <span className="text-green-600 font-semibold">73%</span>
                 </div>
               </div>
               <div className="mt-3 flex justify-center">
                 <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full border border-purple-200">
                   📊 Data-driven
                 </span>
               </div>
             </div>
           </div>
        </div>

                 {/* Enhanced Global Reach Map */}
         <div className={`mt-20 text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
           <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-gray-200/60 shadow-md">
             <span className="text-2xl">🌍</span>
             <span className="text-workflow-deep font-semibold">Presença Global</span>
           </div>
           <h3 className="text-3xl font-display font-bold text-white mb-12">
             Alcance <span className="text-gradient-zen">Internacional</span>
           </h3>
           <div className="relative max-w-6xl mx-auto">
             <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 hover:border-workflow-zen/40 transition-all duration-500 shadow-2xl">
               {/* World Map Visual - Repositioned */}
               <div className="flex justify-center items-center mb-8">
                 <div className="relative">
                   <div className="text-6xl filter drop-shadow-lg">🌍</div>
                   <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                   <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                 </div>
               </div>
               
               {/* Statistics Summary */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                 <div className="text-center">
                   <div className="text-3xl font-bold text-gradient-rainbow">191</div>
                   <div className="text-gray-600 text-sm">Clientes Ativos</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold text-gradient-rainbow">15+</div>
                   <div className="text-gray-600 text-sm">Países</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold text-gradient-rainbow">24/7</div>
                   <div className="text-gray-600 text-sm">Suporte Global</div>
                 </div>
                 <div className="text-center">
                   <div className="text-3xl font-bold text-gradient-rainbow">99.9%</div>
                   <div className="text-gray-600 text-sm">Uptime</div>
                 </div>
               </div>

               {/* Enhanced Regional Data */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                 <div className="group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-green-200 hover:border-green-400 shadow-sm hover:shadow-md">
                   <div className="text-4xl mb-3">🇧🇷</div>
                   <div className="text-xl font-bold text-workflow-deep group-hover:text-green-600 transition-colors">Brasil</div>
                   <div className="text-gray-700 mb-3 text-lg font-semibold">127 clientes</div>
                   <div className="w-full bg-green-100 h-3 rounded-full overflow-hidden mb-3">
                     <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full w-full animate-[slideIn_2s_ease-out]"></div>
                   </div>
                   <div className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">Mercado Principal</div>
                   <div className="mt-3 text-green-600 text-sm font-semibold">↗ +23% este ano</div>
                 </div>
                 
                 <div className="group cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md">
                   <div className="text-4xl mb-3">🇺🇸</div>
                   <div className="text-xl font-bold text-workflow-deep group-hover:text-blue-600 transition-colors">EUA</div>
                   <div className="text-gray-700 mb-3 text-lg font-semibold">34 clientes</div>
                   <div className="w-full bg-blue-100 h-3 rounded-full overflow-hidden mb-3">
                     <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full rounded-full w-3/4 animate-[slideIn_2.2s_ease-out]"></div>
                   </div>
                   <div className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">Expansão Ativa</div>
                   <div className="mt-3 text-green-600 text-sm font-semibold">↗ +156% este ano</div>
                 </div>
                 
                 <div className="group cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-purple-200 hover:border-purple-400 shadow-sm hover:shadow-md">
                   <div className="text-4xl mb-3">🇪🇺</div>
                   <div className="text-xl font-bold text-workflow-deep group-hover:text-purple-600 transition-colors">Europa</div>
                   <div className="text-gray-700 mb-3 text-lg font-semibold">18 clientes</div>
                   <div className="w-full bg-purple-100 h-3 rounded-full overflow-hidden mb-3">
                     <div className="bg-gradient-to-r from-purple-400 to-indigo-400 h-full rounded-full w-1/2 animate-[slideIn_2.4s_ease-out]"></div>
                   </div>
                   <div className="text-xs text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">Crescimento</div>
                   <div className="mt-3 text-green-600 text-sm font-semibold">↗ +89% este ano</div>
                 </div>
                 
                 <div className="group cursor-pointer bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-md">
                   <div className="text-4xl mb-3">🌏</div>
                   <div className="text-xl font-bold text-workflow-deep group-hover:text-orange-600 transition-colors">Ásia & Outros</div>
                   <div className="text-gray-700 mb-3 text-lg font-semibold">12 clientes</div>
                   <div className="w-full bg-orange-100 h-3 rounded-full overflow-hidden mb-3">
                     <div className="bg-gradient-to-r from-orange-400 to-red-400 h-full rounded-full w-1/3 animate-[slideIn_2.6s_ease-out]"></div>
                   </div>
                   <div className="text-xs text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">Emergentes</div>
                   <div className="mt-3 text-green-600 text-sm font-semibold">↗ +67% este ano</div>
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
