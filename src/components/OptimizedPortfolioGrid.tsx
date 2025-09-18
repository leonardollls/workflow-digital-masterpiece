import React, { memo } from 'react';
import LazyImage from './LazyImage';
import imageConfig from '@/config/images.json';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface OptimizedPortfolioGridProps {
  projects: Project[];
  onImageClick: (imageSrc: string) => void;
  hoveredProject: number | null;
  onProjectHover: (id: number | null) => void;
  responsiveSizes: string;
}

const OptimizedPortfolioGrid = memo<OptimizedPortfolioGridProps>(({
  projects,
  onImageClick,
  hoveredProject,
  onProjectHover,
  responsiveSizes
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="group relative overflow-hidden rounded-3xl bg-white shadow-glass hover:shadow-workflow-lg transition-shadow duration-300"
          onMouseEnter={() => onProjectHover(project.id)}
          onMouseLeave={() => onProjectHover(null)}
        >
          {/* Project Image - Fixed height prevents layout shift */}
          <div className="relative h-64 overflow-hidden bg-workflow-50">
            <LazyImage
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover object-top will-change-transform transition-transform duration-300 group-hover:scale-105"
              loading={index < 3 ? 'eager' : 'lazy'}
              priority={index < 3}
              sizes={responsiveSizes}
              placeholder={imageConfig.placeholders[project.image.split('/').pop() || ''] || imageConfig.placeholders['landing-page-demonstracao-1.webp']}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          
          {/* Project Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-workflow-dark group-hover:text-workflow-energy transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-workflow-muted text-sm leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>
            
            {/* Action Button */}
            <button
              onClick={() => onImageClick(project.image)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-workflow-energy to-workflow-zen text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span>Ver Projeto</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
          
          {/* Hover Indicator */}
          {hoveredProject === project.id && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-workflow-energy rounded-full animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
});

OptimizedPortfolioGrid.displayName = 'OptimizedPortfolioGrid';

export default OptimizedPortfolioGrid;
