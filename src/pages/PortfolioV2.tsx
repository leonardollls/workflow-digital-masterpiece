import { useState, useEffect, useCallback } from 'react';
import { GlassBackground, ProjectCard, IframeLiveModal } from '@/components/portfolio-v2';
import WorkflowFooter from '@/components/WorkflowFooter';
import SplashLoader from '@/components/SplashLoader';
import { usePortfolioV2, PortfolioProject } from '@/hooks/usePortfolioV2';
import { Filter, X } from 'lucide-react';

const PortfolioV2 = () => {
  const { projects, categories, loading } = usePortfolioV2();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // Handle splash loader completion
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setContentReady(true);
    }, 100);
  }, []);

  // Animation on mount (after splash)
  useEffect(() => {
    if (contentReady) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [contentReady]);

  const handleViewProject = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  // Filter projects by category
  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects;

  return (
    <>
      {/* Splash Loading Screen - reduced duration for better LCP */}
      {showSplash && (
        <SplashLoader onComplete={handleSplashComplete} duration={1800} />
      )}

      {/* Iframe Modal - rendered at root level for z-index */}
      <IframeLiveModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <div className={`min-h-screen relative transition-opacity duration-700 ${
        contentReady ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Animated Background */}
        <GlassBackground />

        {/* Main Content */}
        <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div
              className={`text-center transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Logo with Glow Effect - explicit dimensions to prevent CLS */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="logo-glow-container" style={{ width: '140px', height: '140px' }}>
                  <img
                    src="/Images/logo-workflow-sem-fundo2.png"
                    alt="Workflow Logo"
                    width={140}
                    height={140}
                    className="logo-glow-image h-20 sm:h-24 md:h-28 lg:h-32 object-contain"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-purple-200 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                  Criações Recentes
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
                Conheça alguns dos projetos desenvolvidos. Cada site é uma experiência
                única, criada com foco em performance, design moderno e resultados reais.
              </p>

              {/* Category Filter */}
              <div
                className={`transition-all duration-1000 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {/* All button */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === null
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Filter size={14} />
                    Todos
                    <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-xs">
                      {projects.length}
                    </span>
                  </button>

                  {/* Category buttons */}
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(selectedCategory === category ? null : category)
                      }
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {category}
                      {selectedCategory === category && (
                        <X size={14} className="hover:scale-110 transition-transform" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              // Loading skeleton with fixed dimensions to prevent CLS
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden card-portfolio"
                    style={{ minHeight: '420px' }}
                  >
                    {/* Fixed aspect ratio for image placeholder */}
                    <div className="bg-white/5 skeleton" style={{ aspectRatio: '800/406', minHeight: '180px' }} />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-white/10 rounded-lg w-3/4 skeleton" />
                      <div className="h-4 bg-white/5 rounded-lg skeleton" />
                      <div className="h-4 bg-white/5 rounded-lg w-2/3 skeleton" />
                      <div className="flex gap-3 pt-2">
                        <div className="h-10 bg-white/10 rounded-xl flex-1 skeleton" />
                        <div className="h-10 w-10 bg-white/10 rounded-xl skeleton" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Projects grid
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-500 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="animate-fade-in"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    <ProjectCard
                      project={project}
                      onView={handleViewProject}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Filter size={24} className="text-white/40" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-white/50 text-sm mb-4">
                  Não há projetos na categoria selecionada.
                </p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all duration-200"
                >
                  <X size={14} />
                  Limpar filtro
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { value: '150+', label: 'Projetos Entregues', accent: 'from-violet-500 to-purple-600' },
                { value: '100%', label: 'Clientes Satisfeitos', accent: 'from-purple-500 to-violet-600' },
                { value: '5+', label: 'Anos de Experiência', accent: 'from-purple-500 to-indigo-600' },
                { value: '24h', label: 'Tempo de Resposta', accent: 'from-violet-500 to-purple-600' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden"
                >
                  {/* Animated gradient border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  <div className="absolute inset-[1px] bg-slate-900/90 rounded-2xl" />
                  
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${stat.accent} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 rounded-2xl`} />
                  
                  {/* Content */}
                  <div className="relative text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-950/80 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    {/* Decorative top line */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r ${stat.accent} rounded-full opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-300`} />
                    
                    {/* Value with gradient */}
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform duration-300`}>
                      {stat.value}
                    </div>
                    
                    {/* Label */}
                    <div className="text-white/70 text-xs sm:text-sm font-medium group-hover:text-white/90 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </main>

        {/* Footer */}
        <WorkflowFooter />
      </div>
    </>
  );
};

export default PortfolioV2;

