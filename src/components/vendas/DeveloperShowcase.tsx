import { useState, useEffect } from 'react';
import { 
  Code2, 
  Sparkles, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  MessageCircle,
  Mail,
  ExternalLink,
  Rocket,
  Target,
  Users
} from 'lucide-react';

const DeveloperShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'expertise' | 'results'>('about');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('developer-showcase');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const expertise = [
    {
      icon: Code2,
      title: 'UX/UI Design',
      description: 'Interfaces intuitivas que convertem',
      accent: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Alta Performance',
      description: 'Sites otimizados para velocidade',
      accent: 'from-purple-500 to-violet-500'
    },
    {
      icon: Target,
      title: 'Foco em Conversão',
      description: 'Design orientado a resultados',
      accent: 'from-amber-500 to-orange-500'
    }
  ];

  const achievements = [
    { value: '150+', label: 'Projetos Entregues', icon: Rocket },
    { value: '100%', label: 'Satisfação', icon: Award },
    { value: '5+', label: 'Anos Experiência', icon: Users },
  ];

  return (
    <section 
      id="developer-showcase" 
      className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6">
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Quem desenvolveu este site?</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Conheça o <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Criador</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Especialista em criar experiências digitais que convertem visitantes em clientes
          </p>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
            
            {/* Left Side - Developer Info */}
            <div className="relative group">
              {/* Main Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/10 transition-all duration-500">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl" />
                
                <div className="relative z-10 p-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center border border-white/10">
                        <span className="text-white font-bold text-4xl">LL</span>
                      </div>
                      {/* Active indicator */}
                      <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-300 text-xs font-medium">Disponível</span>
                      </div>
                    </div>
                    
                    {/* Name and Title */}
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Leonardo Lopes
                      </h3>
                      <p className="text-purple-300 font-medium mb-3">
                        UX/UI Designer
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
                          Alta Performance
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium">
                          Alta Conversão
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white/5">
                    {[
                      { id: 'about', label: 'Sobre' },
                      { id: 'expertise', label: 'Expertise' },
                      { id: 'results', label: 'Resultados' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[200px]">
                    {activeTab === 'about' && (
                      <div className="space-y-4 animate-fade-in">
                        <p className="text-white/80 leading-relaxed">
                          Especialista em criar sites de alta performance e conversão, com mais de 5 anos de experiência transformando negócios através do design estratégico.
                        </p>
                        <p className="text-white/60 text-sm leading-relaxed">
                          Minha missão é desenvolver soluções digitais que não apenas impressionam visualmente, mas que geram resultados reais e mensuráveis para cada cliente.
                        </p>
                        <div className="flex gap-3 pt-4">
                          <a
                            href="https://wa.me/555199437916"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-green-500/30 transition-all duration-300"
                          >
                            <MessageCircle size={18} className="group-hover:text-green-400 transition-colors" />
                            <span className="text-sm font-medium">WhatsApp</span>
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <a
                            href="mailto:contato@leonardolopes.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300"
                          >
                            <Mail size={18} className="group-hover:text-blue-400 transition-colors" />
                            <span className="text-sm font-medium">Email</span>
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      </div>
                    )}

                    {activeTab === 'expertise' && (
                      <div className="space-y-3 animate-fade-in">
                        {expertise.map((item, index) => (
                          <div
                            key={index}
                            className="group/item flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                          >
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.accent} flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`}>
                              <item.icon size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                              <p className="text-white/60 text-sm">{item.description}</p>
                            </div>
                            <CheckCircle size={18} className="text-green-400 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'results' && (
                      <div className="grid grid-cols-3 gap-4 animate-fade-in">
                        {achievements.map((stat, index) => (
                          <div
                            key={index}
                            className="group/stat relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                          >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 text-center">
                              <stat.icon size={24} className="mx-auto mb-2 text-purple-400" />
                              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                              <div className="text-white/60 text-xs font-medium">{stat.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Value Proposition */}
            <div className="space-y-6">
              {/* Value Cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: Rocket,
                    title: 'Resultados Comprovados',
                    description: 'Mais de 150 projetos entregues com foco em performance e conversão',
                    accent: 'from-purple-500 to-violet-500'
                  },
                  {
                    icon: Target,
                    title: 'Foco em Conversão',
                    description: 'Cada elemento é pensado para transformar visitantes em clientes',
                    accent: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: Award,
                    title: 'Excelência Técnica',
                    description: 'Sites otimizados para SEO, velocidade e experiência do usuário',
                    accent: 'from-amber-500 to-orange-500'
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-500"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon size={24} className="text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Decorative gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}
      </style>
    </section>
  );
};

export default DeveloperShowcase;
