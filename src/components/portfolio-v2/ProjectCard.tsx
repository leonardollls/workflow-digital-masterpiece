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

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
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
    return colors[category] || 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  };

  return (
    <div
      style={{
        animationDelay: `${index * 50}ms`,
        minHeight: '420px',
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
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <span className="text-4xl font-bold text-white/80">
                    {project.title.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300"
            style={{ opacity: isHovered ? 0.8 : 0.6 }}
          />

          {/* Eye icon button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(project);
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 z-10"
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
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${getCategoryColor(project.category)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {project.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col">
          <h3 
            className="text-lg font-semibold mb-2 line-clamp-1 transition-colors duration-300"
            style={{ color: isHovered ? 'rgb(216, 180, 254)' : 'white' }}
          >
            {project.title}
          </h3>
          
          <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4 flex-1">
            {project.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onView(project)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-medium transition-all duration-300 hover:from-purple-500 hover:to-violet-500 active:scale-[0.98]"
              aria-label={`Visualizar projeto ${project.title}`}
            >
              <Eye size={16} />
              <span>Visualizar</span>
            </button>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
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
