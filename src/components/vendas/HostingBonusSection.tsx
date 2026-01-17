import { Cloud, Shield, CheckCircle, Server, Zap, Gift, Sparkles, Globe, TrendingUp, Clock, Award } from 'lucide-react';

interface HostingBonusSectionProps {
  isVisible?: boolean;
}

const HostingBonusSection = ({ isVisible = true }: HostingBonusSectionProps) => {
  const benefits = [
    {
      icon: Server,
      title: 'Hospedagem de Alta Performance',
      value: 'INCLUSA',
      highlight: 'Grátis',
      accent: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Shield,
      title: 'Certificado de Segurança (SSL)',
      value: 'INCLUSO',
      highlight: 'Grátis',
      accent: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Seu único custo anual',
      value: 'Apenas',
      highlight: '~R$ 40/ano',
      description: 'Renovação do domínio (pago direto ao Registro.br ou outro registrador)',
      accent: 'from-amber-500 to-orange-500'
    }
  ];

  const cloudFeatures = [
    { icon: TrendingUp, label: '99.9% Uptime', description: 'Disponibilidade garantida' },
    { icon: Clock, label: '< 100ms', description: 'Tempo de resposta' },
    { icon: Award, label: 'Edge Network', description: '200+ países' },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 mb-6 group hover:scale-105 transition-transform duration-300 animate-pulse">
            <Gift size={20} className="text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="text-amber-300 text-sm font-bold tracking-wide uppercase">Bônus Exclusivo</span>
            <Sparkles size={16} className="text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Isenção <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent animate-gradient">Vitalícia</span> de Hospedagem
          </h2>
          
          <p className="text-white/60 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Diferente das agências que cobram <span className="text-red-400 line-through">mensalidades eternas</span>, eu utilizo uma 
            <span className="text-cyan-400 font-semibold"> infraestrutura moderna em nuvem (Cloud)</span>.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Image Side - Aligned with Zero Mensalidade card */}
          <div className="relative group order-2 lg:order-1 flex flex-col">
            {/* Spacer to align with Zero Mensalidade card start */}
            <div className="hidden lg:block h-0" />
            
            {/* Image container */}
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
              
              <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-br-3xl z-10" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-amber-500/30 to-transparent rounded-tl-3xl z-10" />
                
                <img 
                  src="/Images/hospedagem-cloud/Detailed_mockup_of_202601131010.jpeg" 
                  alt="Infraestrutura Cloud de Alta Performance - Cloudflare Pages"
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                {/* Badge on image */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-cyan-500/30">
                    <Cloud size={18} className="text-cyan-400" />
                    <span className="text-white text-sm font-medium">Infraestrutura Cloud Premium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cloud Features - Below the image */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {cloudFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group/feature"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center group-hover/feature:scale-110 transition-transform duration-300">
                      <feature.icon size={18} className="text-cyan-400" />
                    </div>
                    <div className="text-white font-bold text-sm">{feature.label}</div>
                    <div className="text-white/50 text-xs mt-1">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional info below features */}
            <div className="mt-4 text-center">
              <p className="text-white/40 text-xs">
                Powered by <span className="text-cyan-400 font-medium">Cloudflare</span> • CDN Global • DDoS Protection
              </p>
            </div>
          </div>

          {/* Benefits Side */}
          <div className="space-y-5 order-1 lg:order-2">
            {/* Zero Mensalidade highlight */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 p-6 group hover:border-green-400/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30">
                  <Zap size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Zero <span className="text-green-400">Mensalidade</span>
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base">
                    Você paga uma única vez e tem o site funcionando para sempre!
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 group hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Background accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${benefit.accent} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.accent} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <benefit.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-base sm:text-lg mb-1">
                      {benefit.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/60 text-sm">{benefit.value}</span>
                      <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${benefit.accent} text-white text-sm font-bold`}>
                        {benefit.highlight}
                      </span>
                    </div>
                    {benefit.description && (
                      <p className="text-white/50 text-xs sm:text-sm mt-2">
                        {benefit.description}
                      </p>
                    )}
                  </div>
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}

            {/* Additional info */}
            <div className="text-center pt-4">
              <p className="text-white/50 text-sm">
                <span className="text-amber-400 font-medium">Economia de até R$ 1.200/ano</span> em comparação com agências tradicionais
              </p>
            </div>
          </div>
        </div>

        {/* Bottom highlight bar */}
        <div className={`mt-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/50 via-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10 p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-amber-500/5" />
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Cloud size={20} className="text-cyan-400" />
                </div>
                <span className="text-white/80 text-sm font-medium">Cloudflare Pages</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <Shield size={20} className="text-green-400" />
                </div>
                <span className="text-white/80 text-sm font-medium">SSL Gratuito</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/20" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Zap size={20} className="text-amber-400" />
                </div>
                <span className="text-white/80 text-sm font-medium">CDN Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostingBonusSection;
