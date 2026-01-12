import React from 'react';
import {
  Settings,
  Image,
  Type,
  Palette,
  Layout,
  Sparkles,
  Code2,
  Monitor,
  CheckCircle,
  Lock,
} from 'lucide-react';

interface AdminFeature {
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
}

const AdminPanelShowcaseFlach = () => {

  const features: AdminFeature[] = [
    {
      icon: Type,
      title: 'Edição de Textos',
      description: 'Altere títulos, descrições e conteúdos dos tratamentos',
      accent: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Image,
      title: 'Gerenciador de Mídias',
      description: 'Upload de fotos do consultório e equipe',
      accent: 'from-purple-500 to-violet-500'
    },
    {
      icon: Palette,
      title: 'Cores e Estilos',
      description: 'Personalize cores, fontes e elementos visuais',
      accent: 'from-orange-500 to-amber-500'
    },
    {
      icon: Layout,
      title: 'Organização de Seções',
      description: 'Gerencie tratamentos, blog e páginas',
      accent: 'from-green-500 to-emerald-500'
    }
  ];

  const benefits = [
    'Sem necessidade de programação',
    'Atualizações em tempo real',
    'Interface intuitiva e moderna',
    'Histórico de alterações',
    'Backup automático',
    'Acesso seguro com login'
  ];

  return (
    <section id="admin-panel-section" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#D4A574]/10 via-[#D4A574]/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-full blur-[100px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4A574]/20 via-[#E8C9A9]/20 to-[#D4A574]/20 border border-[#D4A574]/40 mb-6 group hover:scale-105 transition-transform duration-300">
            <Settings size={18} className="text-[#D4A574] group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[#D4A574] text-sm font-semibold tracking-wide">EXCLUSIVO NO PACOTE</span>
            <div className="w-2 h-2 rounded-full bg-[#D4A574] animate-pulse" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Painel <span className="bg-gradient-to-r from-[#D4A574] via-[#E8C9A9] to-[#D4A574] bg-clip-text text-transparent">Administrativo</span>
          </h2>
          <p className="text-white/60 text-lg sm:text-xl max-w-3xl mx-auto mb-8 sm:mb-12">
            Tenha controle total do seu site com uma interface intuitiva para editar textos, imagens e configurações - <strong className="text-white/90">sem precisar de código</strong>
          </p>
        </div>

        {/* Mockup Image */}
        <div className="mb-12 sm:mb-16 flex justify-center">
          <div className="relative group max-w-5xl w-full">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A574]/20 via-[#E8C9A9]/20 to-[#D4A574]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            
            {/* Image Container */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] group-hover:border-white/20 transition-all duration-500">
              <img
                src="/Images/mockups-paineis-edi%C3%A7ao/mockup-flach-odonto.jpeg"
                alt="Painel Administrativo de Edições Visuais - Flach Odontologia"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4A574] to-[#E8C9A9] text-[#122737] text-xs font-bold shadow-lg">
                <span className="flex items-center gap-1">
                  <Sparkles size={12} />
                  INCLUSO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Centralized */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-white font-semibold mb-2 group-hover:text-[#D4A574] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>

        {/* Benefits List */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D4A574]/10 via-[#E8C9A9]/5 to-[#D4A574]/10 border border-[#D4A574]/20">
            <h3 className="flex items-center gap-2 text-white font-semibold mb-4">
              <CheckCircle size={20} className="text-[#D4A574]" />
              O que você pode fazer:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-[#D4A574]" />
              <span className="text-white/60 text-sm">Zero código necessário</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2">
              <Monitor size={18} className="text-purple-400" />
              <span className="text-white/60 text-sm">100% responsivo</span>
            </div>
            <div className="w-px h-6 bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <Lock size={18} className="text-green-400" />
              <span className="text-white/60 text-sm">Acesso seguro</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AdminPanelShowcaseFlach;
