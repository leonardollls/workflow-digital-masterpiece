import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo-workflow.png');
  const [logoAttempts, setLogoAttempts] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking para efeitos interativos
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile]);

  useEffect(() => {
    console.log('🔍 Logo inicial carregado de:', logoSrc);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Memoizar dados estáticos para evitar re-renders
  const trustBadges = useMemo(() => [
    { text: "🔥 Alta Performance", icon: "", color: "from-yellow-400 to-orange-500" },
    { text: "⭐ Clutch 5.0★", icon: "", color: "from-blue-400 to-purple-500" },
    { text: "🏆 Premium Quality", icon: "", color: "from-green-400 to-cyan-500" }
  ], []);

  const stats = useMemo(() => [
    { number: "247%", label: "ROI Médio", icon: "📈" },
    { number: "98%", label: "Satisfação", icon: "❤️" },
    { number: "150+", label: "Projetos", icon: "🚀" }
  ], []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 0.8
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-1, 1, -1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-workflow-100"
    >
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient with subtle purple */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100"
          animate={{
            background: [
              "linear-gradient(to bottom right, #f8fafc, #faf5ff, #f1f5f9)",
              "linear-gradient(to bottom right, #faf5ff, #f8fafc, #f1f5f9)",
              "linear-gradient(to bottom right, #f8fafc, #faf5ff, #f1f5f9)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated glow effects */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-workflow-energy/10 rounded-full blur-3xl"
          variants={glowVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-workflow-zen/10 rounded-full blur-3xl"
          variants={glowVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />

        {/* Interactive cursor glow (desktop only) */}
        {!isMobile && (
          <motion.div
            className="fixed w-96 h-96 bg-workflow-energy/5 rounded-full blur-3xl pointer-events-none"
            animate={{
              x: mousePosition.x - 192,
              y: mousePosition.y - 192,
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />
        )}

        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-workflow-energy/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: i * 0.5 }}
          />
        ))}
        </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 text-center w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Logo with enhanced animation */}
        {/* Logo with explicit dimensions to prevent CLS */}
        <motion.div 
          className="flex justify-center mb-2 sm:mb-3 md:mb-4 relative z-30"
          variants={itemVariants}
        >
          <motion.div
            className="relative group"
            style={{ width: '192px', height: '192px' }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            <motion.div className="absolute -inset-2 rounded-full bg-gradient-to-r from-workflow-energy/20 to-workflow-zen/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.img
              src={logoSrc}
              alt="Workflow Logo"
              width={192}
              height={192}
              className="h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 w-auto relative z-10 drop-shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                bounce: 0.5,
                duration: 1.2,
                delay: 0.2
              }}
              onError={() => {
                if (logoAttempts < 2) {
                  console.warn(`❌ Erro ao carregar logo (tentativa ${logoAttempts + 1})`);
                  setLogoAttempts(prev => prev + 1);
                  // Tentar caminhos alternativos para a logo
                  const nextPath = logoAttempts === 0 
                    ? './logo-workflow.png' 
                    : '/Images/logo-workflow-sem-fundo.png';
                  console.log(`🔄 Tentando caminho alternativo: ${nextPath}`);
                  setLogoSrc(nextPath);
                }
              }}
            />
          </motion.div>
        </motion.div>

        {/* Trust Badges - melhorados */}
        <motion.div 
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 relative z-30"
          variants={itemVariants}
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm text-workflow-deep text-xs sm:text-sm md:text-base font-medium rounded-full border border-workflow-energy/30 shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: "0 10px 25px rgba(124, 58, 237, 0.2)"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 1 + index * 0.1,
                type: "spring",
                bounce: 0.4 
              }}
            >
              <span className="whitespace-nowrap">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Main Heading */}
        <motion.div 
          className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 relative z-30"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-display font-black leading-tight mb-3 sm:mb-4 md:mb-5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.5,
              type: "spring",
              bounce: 0.3,
              duration: 1
            }}
          >
            <span className="block">
              <span className="bg-gradient-to-r from-workflow-deep via-workflow-500 to-workflow-energy bg-clip-text text-transparent drop-shadow-sm">
                Landing Pages
              </span>
            </span>
            <span className="block mt-1 sm:mt-2">
              <span className="bg-gradient-to-r from-workflow-zen via-workflow-accent to-workflow-energy bg-clip-text text-transparent drop-shadow-sm">
                de Alto Impacto
              </span>
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-workflow-deep/80 font-medium max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.8,
              type: "spring",
              bounce: 0.3 
            }}
          >
            Transformamos sua visão em{' '}
            <span className="text-workflow-energy font-bold">
              experiências digitais
            </span>
            {' '}que geram{' '}
            <motion.span 
              className="text-workflow-zen font-bold bg-workflow-zen/10 px-2 py-1 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              resultados excepcionais
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Enhanced Statistics - com animação sequencial */}
        <motion.div 
          className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto relative z-30"
          variants={itemVariants}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center group relative"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <motion.div 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1 sm:mb-2 md:mb-3"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                {stat.icon}
              </motion.div>
              <motion.div 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-workflow-energy mb-1 sm:mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 3 + index * 0.1,
                  type: "spring",
                  bounce: 0.6
                }}
              >
                {stat.number}
              </motion.div>
              <motion.div 
                className="text-xs sm:text-sm md:text-base lg:text-lg text-workflow-deep/70 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 + index * 0.1 }}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Ecosystem */}
        <motion.div 
          className="flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center items-center px-2 mb-8 sm:mb-10 md:mb-12 relative z-40"
          variants={itemVariants}
        >
          {/* Primary Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative z-50"
          >
            <Button 
              className="bg-gradient-to-r from-workflow-zen to-workflow-energy text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-semibold text-sm sm:text-base md:text-lg lg:text-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px] sm:min-w-[240px] md:min-w-[280px] cursor-pointer relative z-50"
              onClick={() => {
                console.log('Botão clicado: Portfolio');
                const element = document.getElementById('portfolio');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <motion.span 
                className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", bounce: 0.6 }}
              >
                <span>Criações Recentes</span>
                <motion.span 
                  className="text-lg sm:text-xl md:text-2xl"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  🎨
                </motion.span>
              </motion.span>
            </Button>
          </motion.div>
          
          {/* Secondary Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto max-w-sm sm:max-w-none justify-center items-center relative z-50">
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="w-full sm:w-auto relative z-50"
            >
              <Button 
                className="bg-white/90 backdrop-blur-sm text-workflow-deep border border-workflow-energy/30 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base md:text-lg hover:bg-white hover:border-workflow-energy/50 transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg cursor-pointer relative z-50"
                onClick={() => {
                  console.log('Botão clicado: Metodologia');
                  const element = document.getElementById('methodology-lab');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <span>Metodologia Científica</span>
                  <motion.span 
                    className="text-workflow-energy"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    🔬
                  </motion.span>
                </span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="w-full sm:w-auto relative z-50"
            >
              <Button 
                className="bg-white/90 backdrop-blur-sm text-workflow-deep border border-workflow-energy/30 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base md:text-lg hover:bg-white hover:border-workflow-energy/50 transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg cursor-pointer relative z-50"
                onClick={() => {
                  console.log('Botão clicado: Arsenal');
                  const element = document.getElementById('capability-matrix');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                  <motion.span 
                    className="text-workflow-energy"
                    whileHover={{ scale: 1.1 }}
                  >
                    ⚡
                  </motion.span>
                  <span>Arsenal Tecnológico</span>
                </span>
              </Button>
            </motion.div>
          </div>

          {/* New 100% Editável Button */}
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="w-full sm:w-auto max-w-xs sm:max-w-none relative z-50"
          >
            <Button 
              className="bg-gradient-to-r from-workflow-accent to-workflow-zen text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto border border-workflow-accent/20 hover:border-workflow-accent/40 cursor-pointer relative z-50"
              onClick={() => {
                console.log('Botão clicado: Autonomia Total');
                const element = document.getElementById('autonomia-total');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                <motion.span 
                  className="text-white"
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  ✏️
                </motion.span>
                <span>Entrega 100% Editável</span>
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modal placeholder - modernizado */}
      <AnimatePresence>
      {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
            <h3 className="text-xl font-bold mb-4">Modal Content</h3>
            <Button onClick={() => setShowModal(false)}>Fechar</Button>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HeroSection;
