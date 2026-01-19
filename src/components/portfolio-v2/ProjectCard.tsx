import { useState } from 'react';
import GlassCard from './GlassCard';
import { Eye, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail_url?: string;
}

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  index: number;
}

const ProjectCard = ({ project, onView, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  // Portfolio page is always dark mode
  const isDark = true;

  const getCategoryGradient = (category: string): string => {
    const gradients: Record<string, string> = {
      'Advocacia': 'from-amber-500/20 to-orange-600/20',
      'App/Saúde': 'from-green-500/20 to-emerald-600/20',
      'Arquitetura': 'from-slate-500/20 to-zinc-600/20',
      'Varejo': 'from-pink-500/20 to-rose-600/20',
      'Agência': 'from-violet-500/20 to-purple-600/20',
      'Financeiro': 'from-blue-500/20 to-indigo-600/20',
      'Tecnologia': 'from-cyan-500/20 to-teal-600/20',
      'Tecnologia/AI': 'from-fuchsia-500/20 to-purple-600/20',
      'Educação': 'from-yellow-500/20 to-amber-600/20',
      'Industrial': 'from-gray-500/20 to-slate-600/20',
      'Fintech': 'from-emerald-500/20 to-green-600/20',
      'E-commerce': 'from-orange-500/20 to-red-600/20',
      'Produção': 'from-red-500/20 to-rose-600/20',
    };
    return gradients[category] || 'from-purple-500/20 to-violet-600/20';
  };

  const getCategoryColor = (category: string, isDarkMode: boolean): string => {
    const darkColors: Record<string, string> = {
      'Advocacia': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'App/Saúde': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Arquitetura': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      'Varejo': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Agência': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      'Financeiro': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Tecnologia': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Tecnologia/AI': 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      'Educação': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Industrial': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      'Fintech': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'E-commerce': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Produção': 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    
    const lightColors: Record<string, string> = {
      'Advocacia': 'bg-amber-100 text-amber-700 border-amber-300',
      'App/Saúde': 'bg-green-100 text-green-700 border-green-300',
      'Arquitetura': 'bg-slate-100 text-slate-700 border-slate-300',
      'Varejo': 'bg-pink-100 text-pink-700 border-pink-300',
      'Agência': 'bg-violet-100 text-violet-700 border-violet-300',
      'Financeiro': 'bg-blue-100 text-blue-700 border-blue-300',
      'Tecnologia': 'bg-cyan-100 text-cyan-700 border-cyan-300',
      'Tecnologia/AI': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
      'Educação': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Industrial': 'bg-gray-100 text-gray-700 border-gray-300',
      'Fintech': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'E-commerce': 'bg-orange-100 text-orange-700 border-orange-300',
      'Produção': 'bg-red-100 text-red-700 border-red-300',
    };

    const colors = isDarkMode ? darkColors : lightColors;
    const defaultColor = isDarkMode 
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
      : 'bg-purple-100 text-purple-700 border-purple-300';
    
    return colors[category] || defaultColor;
  };

  // Title color based on theme and hover state
  const getTitleColor = () => {
    if (isDark) {
      return isHovered ? 'rgb(216, 180, 254)' : 'white';
    }
    return isHovered ? 'rgb(109, 40, 217)' : 'rgb(30, 41, 59)';
  };

  return (
    <div
      className="relative isolate"
      style={{
        animationDelay: `${index * 50}ms`,
        minHeight: '420px',
        contain: 'layout style',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassCard className="h-full flex flex-col" hover isHovered={isHovered}>
        {/* Thumbnail Section */}
        <div className="relative overflow-hidden rounded-t-2xl" style={{ height: '208px' }}>
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={`Capa do projeto ${project.title}`}
              width={800}
              height={406}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(project.category)}`}>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-20 h-20 rounded-2xl backdrop-blur-sm flex items-center justify-center border ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-purple-200/50'}`}>
                  <span className={`text-4xl font-bold ${isDark ? 'text-white/80' : 'text-purple-600/80'}`}>
                    {project.title.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'bg-gradient-to-t from-black/60 via-black/20 to-transparent' : 'bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent'}`}
            style={{ opacity: isHovered ? 0.8 : 0.6 }}
          />

          {/* Eye icon button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(project);
            }}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 ${
              isDark 
                ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' 
                : 'bg-white/80 border-purple-200/50 text-purple-600 hover:bg-white hover:border-purple-300'
            }`}
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            }}
            aria-label={`Visualizar ${project.title}`}
          >
            <Eye size={18} />
          </button>

          {/* Category badge */}
          <div className="absolute bottom-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-colors duration-300 ${getCategoryColor(project.category, isDark)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {project.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 
            className="text-lg font-semibold mb-2 line-clamp-1 transition-colors duration-300"
            style={{ color: getTitleColor() }}
          >
            {project.title}
          </h3>
          
          <p className={`text-sm leading-relaxed line-clamp-3 mb-4 flex-1 transition-colors duration-300 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            {project.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onView(project)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium transition-all duration-300 hover:from-purple-500 hover:to-violet-500 active:scale-[0.98] shadow-lg shadow-purple-500/25"
              aria-label={`Visualizar projeto ${project.title}`}
            >
              <Eye size={16} />
              <span>Visualizar</span>
            </button>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30' 
                  : 'bg-purple-50 border-purple-200/50 text-purple-500 hover:text-purple-700 hover:bg-purple-100 hover:border-purple-300'
              }`}
              aria-label={`Abrir ${project.title} em nova aba`}
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProjectCard;
