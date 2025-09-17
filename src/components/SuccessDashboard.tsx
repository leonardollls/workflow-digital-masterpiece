import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Zap, 
  Target, 
  Award, 
  Users,
  Clock,
  BarChart3,
  Activity,
  Rocket,
  Shield
} from 'lucide-react';

const SuccessDashboard = () => {
  const [metrics, setMetrics] = useState({
    conversionIncrease: 247,
    clientHappiness: 94,
    projectsDelivered: 150,
    performanceScore: 98,
    seoScore: 95
  });

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  // Data for charts
  const performanceData = [
    { name: 'Speed', value: metrics.performanceScore, color: '#10b981' },
    { name: 'SEO', value: metrics.seoScore, color: '#3b82f6' },
    { name: 'UX', value: 92, color: '#8b5cf6' },
    { name: 'Security', value: 96, color: '#f59e0b' }
  ];

  const conversionData = [
    { month: 'Jan', conversion: 2.1, projects: 12 },
    { month: 'Feb', conversion: 2.8, projects: 18 },
    { month: 'Mar', conversion: 3.2, projects: 25 },
    { month: 'Apr', conversion: 2.9, projects: 22 },
    { month: 'May', conversion: 3.8, projects: 35 },
    { month: 'Jun', conversion: 4.2, projects: 42 }
  ];



  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setMetrics({
          conversionIncrease: 247,
          clientHappiness: 94,
          projectsDelivered: 150,
          performanceScore: 98,
          seoScore: 95
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="centro-comando" 
      className="py-20 bg-gradient-to-br from-workflow-deep via-workflow-deep/95 to-purple-900/90 relative overflow-hidden"
    >
      {/* Enhanced Animated Background */}
      <motion.div 
        className="absolute inset-0 opacity-30"
      >
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          {[...Array(20)].map((_, i) => (
            <motion.div
            key={i}
              className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            >
              <div 
                className="w-2 h-2 bg-workflow-zen/20 rounded-full blur-sm"
                style={{
                  background: `linear-gradient(45deg, ${['#c3aee0', '#8b5cf6', '#a855f7', '#9333ea'][Math.floor(Math.random() * 4)]}, transparent)`
                }}
              />
            </motion.div>
        ))}
      </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzNhZWUwIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header with Period Selector */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div 
            className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 bg-white/10 backdrop-blur-md px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full mb-4 sm:mb-6 md:mb-8 border border-workflow-zen/20"
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="text-xl sm:text-2xl md:text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            <span className="text-sm sm:text-base md:text-lg text-workflow-zen font-semibold">Métricas em Tempo Real</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 sm:mb-4 md:mb-6"
            variants={itemVariants}
          >
            Centro de <span className="text-gradient-zen">Comando</span>
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-xl md:text-2xl text-workflow-zen/80 max-w-2xl md:max-w-3xl mx-auto mb-8"
            variants={itemVariants}
          >
            Dashboard científico com resultados comprovados e métricas de alta performance
          </motion.p>


        </motion.div>

        {/* Modern Bento Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Conversion Rate - Large Card */}
          <motion.div 
            className="xl:col-span-2 lg:row-span-2 bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-workflow-deep">Conversão Média</h3>
                  <p className="text-gray-600 text-sm">Aumento comprovado</p>
                </div>
        </div>

              <div className="text-center mb-6">
                <motion.div 
                  className="text-5xl font-bold text-gradient-rainbow mb-2"
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <CountUp end={metrics.conversionIncrease} duration={2.5} suffix="%" />
                </motion.div>
                
                <motion.div 
                  className="flex items-center justify-center gap-2 text-green-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 1 }}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+{metrics.conversionIncrease}%</span>
                </motion.div>
              </div>

              {/* Mini chart */}
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversionData}>
                  <defs>
                      <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                    <Area 
                      type="monotone" 
                      dataKey="conversion" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fill="url(#conversionGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
            </div>
          </motion.div>

          {/* Digital Impact */}
          <motion.div 
            className="xl:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl"
                  variants={floatingVariants}
                  animate="animate"
                >
                  <Rocket className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-workflow-deep">Impacto Digital</h3>
                  <p className="text-gray-600 text-sm">Crescimento médio dos clientes</p>
            </div>
          </div>

             <div className="text-center">
                <motion.div 
                  className="text-4xl font-bold text-gradient-rainbow mb-3"
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  385%
                </motion.div>
                
                <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={isVisible ? { width: "85%" } : { width: "0%" }}
                    transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                  />
               </div>
                
               <div className="mt-3 flex justify-center">
                 <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full border border-purple-200">
                   📈 ROI Comprovado
                 </span>
               </div>
             </div>
           </div>
          </motion.div>

          {/* Performance Scores */}
          <motion.div 
            className="xl:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Activity className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-workflow-deep">Performance Score</h3>
                <p className="text-gray-600 text-sm">Velocidade e otimização</p>
                       </div>
                     </div>
            
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
                   </div>
            
            <div className="flex justify-center gap-2">
                 <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-200">
                ⚡ <CountUp end={metrics.performanceScore} duration={2} />/100
                 </span>
                 <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-200">
                🔍 <CountUp end={metrics.seoScore} duration={2} />/100
                 </span>
            </div>
          </motion.div>

          {/* NPS Score */}
          <motion.div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Award className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-workflow-deep">NPS Score</h3>
                <p className="text-gray-600 text-xs">Satisfação cliente</p>
               </div>
            </div>
            
            <div className="text-center mb-4">
              <motion.div 
                className="text-3xl font-bold text-workflow-deep mb-2"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              >
                <CountUp end={metrics.clientHappiness} duration={2.5} />
              </motion.div>
              
              {/* Gauge visualization */}
              <div className="relative w-20 h-10 mx-auto mb-3">
                <div className="absolute inset-0 bg-gray-200 rounded-t-full"></div>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-green-500 rounded-t-full overflow-hidden"
                  initial={{ clipPath: "polygon(0 100%, 0% 100%, 0% 0, 0 0)" }}
                  animate={isVisible ? { 
                    clipPath: `polygon(0 100%, ${metrics.clientHappiness}% 100%, ${metrics.clientHappiness/2}% 0, 0 0)` 
                  } : { clipPath: "polygon(0 100%, 0% 100%, 0% 0, 0 0)" }}
                  transition={{ delay: 1.2, duration: 1.5 }}
                />
                 </div>
               </div>
            
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-200">
                   😊 Promotores: {metrics.clientHappiness}%
                 </span>
            </div>
          </motion.div>

          {/* Projects Delivered */}
          <motion.div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <BarChart3 className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-workflow-deep">Projetos</h3>
                <p className="text-gray-600 text-xs">Entregues com sucesso</p>
               </div>
            </div>
            
            <div className="text-center mb-4">
              <motion.div 
                className="text-3xl font-bold text-gradient-rainbow mb-2"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
              >
                <CountUp end={metrics.projectsDelivered} duration={2.5} />+
              </motion.div>
              
              {/* Animated bars */}
              <div className="flex justify-center gap-1 mb-3">
                 {[...Array(7)].map((_, i) => (
                  <motion.div 
                     key={i}
                    className="w-1.5 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full"
                    initial={{ height: 0 }}
                    animate={isVisible ? { height: `${15 + Math.sin(i) * 10}px` } : { height: 0 }}
                    transition={{ 
                      delay: 1.3 + (i * 0.1), 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100 
                     }}
                   />
                 ))}
               </div>
            </div>
            
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 text-xs bg-cyan-50 text-cyan-600 px-2 py-1 rounded-full border border-cyan-200">
                   🚀 100% no prazo
                 </span>
               </div>
          </motion.div>

          {/* Scientific Methodology */}
          <motion.div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-workflow-deep">Metodologia</h3>
                <p className="text-gray-600 text-xs">Abordagem científica</p>
             </div>
           </div>

            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🔬</div>
              <div className="text-2xl font-bold text-gradient-zen mb-2">A/B Tests</div>
               </div>
            
            <div className="space-y-2 mb-3">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-600">Hipóteses testadas</span>
                <motion.span 
                  className="text-workflow-deep font-semibold"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <CountUp end={847} duration={2} />
                </motion.span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-600">Taxa de acerto</span>
                <motion.span 
                  className="text-green-600 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.7 }}
                >
                  <CountUp end={73} duration={2} />%
                </motion.span>
                 </div>
               </div>
            
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-200">
                   📊 Data-driven
                 </span>
               </div>
          </motion.div>

          {/* Security & Compliance */}
          <motion.div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group"
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold text-workflow-deep">Segurança</h3>
                <p className="text-gray-600 text-xs">SSL & LGPD compliance</p>
           </div>
        </div>

            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🔐</div>
              <div className="text-2xl font-bold text-gradient-zen mb-2">100%</div>
               </div>
               
            <div className="space-y-2 mb-3">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-600">SSL Certificate</span>
                <motion.span 
                  className="text-green-600 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.9 }}
                >
                  ✓ Ativo
                </motion.span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-600">LGPD Compliance</span>
                <motion.span 
                  className="text-green-600 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2.1 }}
                >
                  ✓ Conforme
                </motion.span>
                 </div>
               </div>

            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-200">
                   🛡️ Protegido
                 </span>
               </div>
          </motion.div>
        </motion.div>


      </div>
    </section>
  );
};

export default SuccessDashboard;
