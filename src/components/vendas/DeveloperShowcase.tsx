import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  MessageCircle,
  Mail,
  ExternalLink,
  Rocket,
  Target,
  Code2,
  Zap,
  Users,
  CheckCircle
} from 'lucide-react';

const DeveloperShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const stats = [
    { value: '150+', label: 'Projetos', icon: Rocket },
    { value: '5+', label: 'Anos', icon: Users },
    { value: '100%', label: 'Satisfação', icon: Award },
  ];

  const skills = [
    { name: 'UX/UI Design', level: 95 },
    { name: 'Performance', level: 98 },
    { name: 'Conversão', level: 92 },
    { name: 'SEO', level: 90 },
  ];

  const highlights = [
    {
      icon: Rocket,
      title: 'Resultados Comprovados',
      description: 'Mais de 150 projetos entregues com foco em performance e conversão',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      icon: Target,
      title: 'Foco em Conversão',
      description: 'Cada elemento é pensado para transformar visitantes em clientes',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Excelência Técnica',
      description: 'Sites otimizados para SEO, velocidade e experiência do usuário',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <section 
      id="developer-showcase" 
      className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-blue-500/10 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 mb-6 hover:scale-105 transition-transform duration-300">
            <Sparkles size={16} className="text-purple-400 animate-pulse" />
            <span className="text-purple-300 text-sm font-medium">Quem desenvolveu este site?</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Conheça o <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">Criador</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Especialista em criar experiências digitais que convertem visitantes em clientes
          </p>
        </div>

        {/* Main Hero Section - Image Focus */}
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Hero Card with Developer Image */}
          <div className="relative group mb-12">
            {/* Animated border gradient */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500 rounded-[2rem] opacity-50 group-hover:opacity-80 blur-sm transition-all duration-700 animate-gradient-xy" />
            
            {/* Main container */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800/95 to-slate-900 border border-white/10">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Developer Image */}
                <div className="relative overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
                  {/* Image Container */}
                  <div className="absolute inset-0">
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-slate-900 animate-pulse flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                      </div>
                    )}
                    
                    {/* Developer Image */}
                    <img
                      src="/Images/leonardo-lopes/Image_202601111107.JPG"
                      alt="Leonardo Lopes - Desenvolvedor Web"
                      className={`w-full h-full object-cover object-center transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                      onLoad={() => setImageLoaded(true)}
                    />
                    
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/90 lg:block hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-violet-600/10 mix-blend-overlay" />
                    
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 animate-pulse opacity-50" />
                  </div>

                  {/* Floating Stats on Image - Mobile */}
                  <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                    <div className="flex justify-center gap-3">
                      {stats.map((stat, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center px-4 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10"
                        >
                          <stat.icon size={18} className="text-purple-400 mb-1" />
                          <span className="text-white font-bold text-lg">{stat.value}</span>
                          <span className="text-white/60 text-xs">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Name Badge - Positioned on Image */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping" />
                      </div>
                      <span className="text-white/90 text-sm font-medium">Disponível para projetos</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Info */}
                <div className="relative p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/15 to-transparent rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    {/* Name and Title */}
                    <div className="mb-8">
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                        Leonardo Lopes
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-purple-400 font-semibold text-lg">UX/UI Designer & Developer</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Alta Performance', 'Alta Conversão', 'React Expert'].map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium hover:scale-105 transition-transform duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
                      Especialista em criar sites de <strong className="text-white">alta performance e conversão</strong>, 
                      com mais de 5 anos de experiência transformando negócios através do design estratégico.
                      Minha missão é desenvolver soluções digitais que geram resultados reais.
                    </p>

                    {/* Stats - Desktop */}
                    <div className="hidden lg:grid grid-cols-3 gap-4 mb-8">
                      {stats.map((stat, index) => (
                        <div
                          key={index}
                          className="group/stat relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />
                          <div className="relative z-10 text-center">
                            <stat.icon size={24} className="mx-auto mb-2 text-purple-400 group-hover/stat:scale-110 transition-transform duration-300" />
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-white/50 text-xs font-medium">{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skills Progress */}
                    <div className="hidden sm:block mb-8">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {skills.map((skill, index) => (
                          <div key={index} className="group/skill">
                            <div className="flex justify-between mb-1">
                              <span className="text-white/70 text-sm font-medium">{skill.name}</span>
                              <span className="text-purple-400 text-sm font-bold">{skill.level}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-1000 ease-out group-hover/skill:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                style={{ 
                                  width: isVisible ? `${skill.level}%` : '0%',
                                  transitionDelay: `${index * 150}ms`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://wa.me/555199437916"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105"
                      >
                        <MessageCircle size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                        <span>WhatsApp</span>
                        <ExternalLink size={14} className="opacity-60 group-hover:opacity-100" />
                      </a>
                      <a
                        href="mailto:contato@leonardolopes.online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-medium transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 hover:scale-105"
                      >
                        <Mail size={20} className="group-hover:text-purple-400 transition-colors duration-300" />
                        <span>Email</span>
                        <ExternalLink size={14} className="opacity-60 group-hover:opacity-100" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <item.icon size={26} className="text-white" />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  {item.description}
                </p>

                {/* Checkmark */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <CheckCircle size={20} className="text-green-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-white/40 text-sm mb-4">Tecnologias que domino</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Node.js', 'Figma'].map((tech, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-300 cursor-default"
                >
                  <Code2 size={14} />
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes gradient-xy {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          
          .animate-gradient-xy {
            background-size: 200% 200%;
            animation: gradient-xy 6s ease infinite;
          }
        `}
      </style>
    </section>
  );
};

export default DeveloperShowcase;
