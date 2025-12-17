import { Briefcase, Users, Clock, Zap } from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  icon: React.ElementType;
  accent: string;
}

const SocialProof = () => {
  const stats: StatItem[] = [
    { 
      value: '150+', 
      label: 'Projetos Entregues', 
      icon: Briefcase,
      accent: 'from-violet-500 to-purple-600'
    },
    { 
      value: '100%', 
      label: 'Clientes Satisfeitos', 
      icon: Users,
      accent: 'from-green-500 to-emerald-600'
    },
    { 
      value: '5+', 
      label: 'Anos de Experiência', 
      icon: Clock,
      accent: 'from-blue-500 to-indigo-600'
    },
    { 
      value: 'A+', 
      label: 'Performance', 
      icon: Zap,
      accent: 'from-amber-500 to-orange-600'
    },
  ];

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full sm:w-auto"
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.accent} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon size={24} className="text-white" />
            </div>

            {/* Content */}
            <div className="text-left">
              <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-white/60 text-sm font-medium">
                {stat.label}
              </div>
            </div>

            {/* Glow effect on hover */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${stat.accent} opacity-0 group-hover:opacity-20 blur-xl rounded-2xl transition-opacity duration-300`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProof;

