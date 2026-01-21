import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/FileUpload';
import { 
  CheckCircle, 
  Sparkles, 
  Target,
  Palette,
  Settings,
  Calendar,
  Upload,
  Send,
  Clock,
  Award,
  X,
  Building2,
  Globe,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Info,
  Lightbulb,
  Users,
  Eye,
  Heart,
  Shield
} from 'lucide-react';
import type { SiteBriefForm } from '@/services/briefingService';

// Schema de validação - todos os campos opcionais
const siteBriefSchema = z.object({
  // Seção 1: Informações da Empresa
  companyName: z.string().optional(),
  businessSegment: z.string().optional(),
  businessSegmentOther: z.string().optional(),
  companyDescription: z.string().optional(),
  companyHistory: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.string().optional(),
  targetAudience: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  responsibleName: z.string().optional(),
  currentWebsite: z.string().optional(),
  
  // Seção 2: Objetivos e Estrutura do Site
  websiteGoal: z.string().optional(),
  websiteGoalOther: z.string().optional(),
  websiteType: z.string().optional(),
  websiteTypeOther: z.string().optional(),
  mainFunctionalities: z.string().optional(),
  requiredPages: z.string().optional(),
  navigationStructure: z.string().optional(),
  contentHierarchy: z.string().optional(),
  servicesProducts: z.string().optional(),
  teamInfo: z.string().optional(),
  certifications: z.string().optional(),
  awardsRecognition: z.string().optional(),
  caseStudies: z.string().optional(),
  testimonials: z.string().optional(),
  
  // Seção 3: Design e Identidade Visual
  designStyle: z.string().optional(),
  brandColors: z.string().optional(),
  hasLogo: z.string().optional(),
  logoFiles: z.any().optional(),
  visualReferences: z.string().optional(),
  visualFiles: z.any().optional(),
  mainCompetitors: z.string().optional(),
  customerPainPoints: z.string().optional(),
  customerObjections: z.string().optional(),
  communicationTone: z.string().optional(),
  keyMessages: z.string().optional(),
  specificRequirements: z.string().optional(),
  contentMaterials: z.string().optional(),
  materialFiles: z.any().optional(),
  
  // Seção 4: Funcionalidades Técnicas
  contactForms: z.string().optional(),
  integrations: z.string().optional(),
  seoRequirements: z.string().optional(),
  analytics: z.string().optional(),
  desiredDomain: z.string().optional(),
  hostingPreferences: z.string().optional(),
  
  // Seção 5: Timeline e Orçamento
  additionalNotes: z.string().optional(),
});

// Definição das abas/seções
const tabs = [
  { id: 1, title: 'Empresa', icon: Building2, color: 'purple' },
  { id: 2, title: 'Site', icon: Globe, color: 'blue' },
  { id: 3, title: 'Design', icon: Palette, color: 'pink' },
  { id: 4, title: 'Técnico', icon: Settings, color: 'cyan' },
  { id: 5, title: 'Timeline', icon: Calendar, color: 'green' },
];

const SiteBrief = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logoFiles, setLogoFiles] = useState<FileList | null>(null);
  const [visualFiles, setVisualFiles] = useState<FileList | null>(null);
  const [materialFiles, setMaterialFiles] = useState<FileList | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const [showBusinessSegmentOther, setShowBusinessSegmentOther] = useState(false);
  const [showWebsiteGoalOther, setShowWebsiteGoalOther] = useState(false);
  const [showWebsiteTypeOther, setShowWebsiteTypeOther] = useState(false);

  // Generate preview URL for logo
  const handleLogoChange = (files: FileList | null) => {
    setLogoFiles(files);
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setLogoPreview(url);
      } else {
        setLogoPreview(null);
      }
    } else {
      setLogoPreview(null);
    }
  };

  // Toggle theme with animation
  const handleToggleTheme = () => {
    setIsThemeTransitioning(true);
    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
      setTimeout(() => setIsThemeTransitioning(false), 300);
    }, 150);
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Apply theme styles
  useEffect(() => {
    const bgColor = isDarkMode ? '#020617' : '#f8fafc';
    document.body.style.backgroundColor = bgColor;
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.backgroundColor = bgColor;
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.transition = 'background-color 0.5s ease';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.overflowX = '';
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.overflowX = '';
      document.documentElement.style.transition = '';
    };
  }, [isDarkMode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SiteBriefForm>({
    resolver: zodResolver(siteBriefSchema),
  });

  const onSubmit = async (data: SiteBriefForm) => {
    // Prevenir envio automático - só permitir se estiver na última etapa
    if (currentTab !== tabs.length) {
      console.log('⚠️ [SITE-DEBUG] Tentativa de envio automático bloqueada - etapa atual:', currentTab);
      return;
    }
    
    console.log('✅ [SITE-DEBUG] Envio autorizado - usuário está na última etapa e clicou no botão');
    setIsSubmitting(true);
    
    try {
      console.log('🚀 [SITE-DEBUG] Iniciando envio do briefing de site...');
      
      const { submitSiteBriefing } = await import('@/services/briefingService');
      
      const formData = {
        ...data,
        logoFiles: logoFiles,
        visualFiles: visualFiles,
        materialFiles: materialFiles,
      };
      
      console.log('🚀 [SITE-DEBUG] Dados do formulário:', formData);
      
      await submitSiteBriefing(formData);
      
      console.log('✅ [SITE-DEBUG] Briefing de site salvo com sucesso!');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('❌ [SITE-DEBUG] Erro ao enviar briefing:', error);
      alert('Erro ao enviar o briefing. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTab = () => {
    if (currentTab < tabs.length) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevTab = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };

  // Theme-aware classes
  const themeClasses = {
    bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
    card: isDarkMode 
      ? 'bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/20' 
      : 'bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-white/60' : 'text-slate-600',
    textSubtle: isDarkMode ? 'text-white/40' : 'text-slate-500',
    input: isDarkMode 
      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' 
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400',
    label: isDarkMode ? 'text-white/90' : 'text-slate-700',
    border: isDarkMode ? 'border-white/10' : 'border-slate-200',
  };

  // Tela de sucesso
  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-6 overflow-x-hidden transition-colors duration-500`}>
        {/* Background effects */}
        {isDarkMode && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
          </div>
        )}
        
        <div className={`relative max-w-2xl w-full text-center transition-all duration-1000 px-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className={`${themeClasses.card} border rounded-3xl p-8 md:p-12 transition-all duration-500`}>
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4 transition-colors duration-500`}>
                Briefing Enviado com Sucesso!
              </h1>
              <p className={`text-lg ${themeClasses.textMuted} mb-8 transition-colors duration-500`}>
                Recebemos todas as informações do seu projeto. Nossa equipe analisará seu briefing e entrará em contato em breve com uma proposta personalizada para seu site institucional.
              </p>
              
              <div className={`bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-transparent rounded-2xl p-6 border ${isDarkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className={`font-semibold ${themeClasses.text}`}>Próximo Passo</h3>
                </div>
                <p className={`text-sm ${themeClasses.textMuted}`}>
                  Você receberá um feedback em até 24 horas do desenvolvedor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-500 overflow-x-hidden`}>
      {/* Background effects - Dark mode only */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]" />
        </div>
      )}

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header Compacto */}
        <header className={`flex-shrink-0 px-4 md:px-6 lg:px-8 py-4 border-b ${themeClasses.border} transition-colors duration-500`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-100 border-purple-200'} border`}>
                <Award className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-purple-500 text-xs font-medium">Briefing Completo</span>
              </div>
              
              <h1 className={`text-xl md:text-2xl font-bold ${themeClasses.text} transition-colors duration-500`}>
                Site{' '}
                <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                  Institucional
                </span>
              </h1>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={handleToggleTheme}
              className={`relative p-2.5 rounded-xl ${isDarkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-100 hover:bg-slate-200'} transition-all duration-300 group`}
              aria-label="Alternar tema"
            >
              <div className={`relative w-5 h-5 transition-transform duration-500 ${isThemeTransitioning ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
                {isDarkMode ? (
                  <Sun className={`w-5 h-5 text-amber-400 transition-all duration-300 ${isThemeTransitioning ? 'opacity-0' : 'opacity-100'}`} />
                ) : (
                  <Moon className={`w-5 h-5 text-slate-600 transition-all duration-300 ${isThemeTransitioning ? 'opacity-0' : 'opacity-100'}`} />
                )}
              </div>
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        <div className={`flex-shrink-0 px-4 md:px-6 lg:px-8 py-3 border-b ${themeClasses.border} transition-colors duration-500`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${themeClasses.textMuted}`}>Etapa {currentTab} de {tabs.length}</span>
              <span className={`text-xs ${themeClasses.textMuted}`}>{Math.round((currentTab / tabs.length) * 100)}% completo</span>
            </div>
            <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'} overflow-hidden`}>
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentTab / tabs.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <nav className={`flex-shrink-0 px-4 md:px-6 lg:px-8 py-3 border-b ${themeClasses.border} overflow-x-auto transition-colors duration-500`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                const isCompleted = currentTab > tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? isDarkMode 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                        : isCompleted
                          ? isDarkMode
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-green-50 text-green-600 border border-green-200'
                          : isDarkMode
                            ? 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    <span className="hidden md:inline">{tab.title}</span>
                    <span className="md:hidden">{tab.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <form onSubmit={(e) => {
              e.preventDefault();
              // Prevenir submit automático do formulário
              if (currentTab === tabs.length) {
                handleSubmit(onSubmit)();
              }
            }}>
              
              {/* SEÇÃO 1: INFORMAÇÕES DA EMPRESA */}
              {currentTab === 1 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-100 border-purple-200'} border flex items-center justify-center`}>
                      <Building2 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Informações da Empresa</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Conte-nos sobre sua empresa, missão e valores</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Coluna 1 */}
                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Nome da Empresa *</Label>
                        <Input {...register('companyName')} placeholder="Ex: Minha Empresa Ltda" className={`${themeClasses.input} h-9 text-sm`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Segmento de Atuação *</Label>
                        <Select onValueChange={(value) => {
                          setValue('businessSegment', value);
                          if (value === 'outro') {
                            setShowBusinessSegmentOther(true);
                            setValue('businessSegmentOther' as any, '');
                          } else {
                            setShowBusinessSegmentOther(false);
                            setValue('businessSegmentOther' as any, '');
                          }
                        }}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione o segmento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tecnologia">Tecnologia</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="educacao">Educação</SelectItem>
                            <SelectItem value="consultoria">Consultoria</SelectItem>
                            <SelectItem value="advocacia">Advocacia</SelectItem>
                            <SelectItem value="arquitetura">Arquitetura</SelectItem>
                            <SelectItem value="engenharia">Engenharia</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="financeiro">Financeiro</SelectItem>
                            <SelectItem value="varejo">Varejo</SelectItem>
                            <SelectItem value="industria">Indústria</SelectItem>
                            <SelectItem value="servicos">Serviços</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        {showBusinessSegmentOther && (
                          <Input
                            {...register('businessSegmentOther')}
                            placeholder="Especifique o segmento"
                            className={`${themeClasses.input} h-9 text-sm mt-2`}
                            onChange={(e) => setValue('businessSegmentOther', e.target.value)}
                          />
                        )}
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Descrição da Empresa *</Label>
                        <Textarea {...register('companyDescription')} placeholder="Descreva sua empresa, o que faz, principais atividades..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>História da Empresa</Label>
                        <Textarea {...register('companyHistory')} placeholder="Quando foi fundada, principais marcos, evolução..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Uma boa história fortalece a credibilidade
                        </p>
                      </div>
                    </div>

                    {/* Coluna 2 */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 flex items-center gap-2`}>
                            <Target className="w-3 h-3 text-purple-500" /> Missão
                          </Label>
                          <Textarea {...register('mission')} placeholder="Qual é a missão da empresa?" rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        </div>
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 flex items-center gap-2`}>
                            <Eye className="w-3 h-3 text-purple-500" /> Visão
                          </Label>
                          <Textarea {...register('vision')} placeholder="Qual é a visão de futuro?" rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        </div>
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 flex items-center gap-2`}>
                            <Heart className="w-3 h-3 text-purple-500" /> Valores
                          </Label>
                          <Textarea {...register('values')} placeholder="Quais são os valores da empresa?" rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        </div>
                      </div>
                    </div>

                    {/* Coluna 3 */}
                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Público-Alvo *</Label>
                        <Textarea {...register('targetAudience')} placeholder="Quem são seus clientes? Perfil demográfico, necessidades..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Diferencial Competitivo *</Label>
                        <Textarea {...register('competitiveAdvantage')} placeholder="O que diferencia sua empresa da concorrência?" rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Nome do Responsável *</Label>
                        <Input {...register('responsibleName')} placeholder="Nome completo do responsável pelo projeto" className={`${themeClasses.input} h-9 text-sm`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Site Atual (se existir)</Label>
                        <Input {...register('currentWebsite')} placeholder="https://www.seusite.com.br" className={`${themeClasses.input} h-9 text-sm`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Nos ajuda a entender o que pode ser melhorado
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 2: OBJETIVOS E ESTRUTURA DO SITE */}
              {currentTab === 2 && (
                <div className="space-y-6">
                  <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-100 border-purple-200'} border flex items-center justify-center`}>
                        <Globe className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Objetivos e Estrutura do Site</h2>
                        <p className={`text-sm ${themeClasses.textMuted}`}>Defina os objetivos e a estrutura do seu site institucional</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principal Objetivo do Site *</Label>
                        <Select onValueChange={(value) => {
                          setValue('websiteGoal', value);
                          if (value === 'outro') {
                            setShowWebsiteGoalOther(true);
                            setValue('websiteGoalOther' as any, '');
                          } else {
                            setShowWebsiteGoalOther(false);
                            setValue('websiteGoalOther' as any, '');
                          }
                        }}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione o objetivo principal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apresentar-empresa">Apresentar a empresa</SelectItem>
                            <SelectItem value="gerar-leads">Gerar leads e contatos</SelectItem>
                            <SelectItem value="vender-online">Vender produtos/serviços online</SelectItem>
                            <SelectItem value="portfolio">Mostrar portfólio de trabalhos</SelectItem>
                            <SelectItem value="credibilidade">Aumentar credibilidade</SelectItem>
                            <SelectItem value="informacoes">Fornecer informações</SelectItem>
                            <SelectItem value="suporte">Oferecer suporte aos clientes</SelectItem>
                            <SelectItem value="recrutamento">Atrair talentos</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        {showWebsiteGoalOther && (
                          <Input
                            {...register('websiteGoalOther')}
                            placeholder="Especifique o objetivo"
                            className={`${themeClasses.input} h-9 text-sm mt-2`}
                            onChange={(e) => setValue('websiteGoalOther' as any, e.target.value)}
                          />
                        )}
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Tipo de Site *</Label>
                        <Select onValueChange={(value) => {
                          setValue('websiteType', value);
                          if (value === 'outro') {
                            setShowWebsiteTypeOther(true);
                            setValue('websiteTypeOther', '');
                          } else {
                            setShowWebsiteTypeOther(false);
                            setValue('websiteTypeOther', '');
                          }
                        }}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione o tipo de site" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporativo">Site Corporativo</SelectItem>
                            <SelectItem value="portfolio">Portfólio</SelectItem>
                            <SelectItem value="e-commerce">E-commerce</SelectItem>
                            <SelectItem value="blog">Blog Corporativo</SelectItem>
                            <SelectItem value="catalogo">Catálogo Online</SelectItem>
                            <SelectItem value="institucional">Institucional Simples</SelectItem>
                            <SelectItem value="marketplace">Marketplace</SelectItem>
                            <SelectItem value="portal">Portal de Conteúdo</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        {showWebsiteTypeOther && (
                          <Input
                            {...register('websiteTypeOther')}
                            placeholder="Especifique o tipo de site"
                            className={`${themeClasses.input} h-9 text-sm mt-2`}
                            onChange={(e) => setValue('websiteTypeOther' as any, e.target.value)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Funcionalidades *</Label>
                        <Textarea {...register('mainFunctionalities')} placeholder="Ex: Formulário de contato, chat online, área de downloads, sistema de agendamento, calculadora, quiz..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Funcionalidades especiais podem aumentar muito o engajamento
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Páginas Obrigatórias *</Label>
                        <Textarea {...register('requiredPages')} placeholder="Ex: Home, Sobre Nós, Serviços, Contato, Blog, Portfólio, Equipe, Casos de Sucesso..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Estrutura de Navegação</Label>
                          <Textarea {...register('navigationStructure')} placeholder="Como você imagina o menu principal? Submenus? Categorias?" rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                          <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                            <Lightbulb className="w-3 h-3" /> Uma navegação clara melhora a experiência do usuário
                          </p>
                        </div>
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Hierarquia de Conteúdo</Label>
                          <Textarea {...register('contentHierarchy')} placeholder="Qual conteúdo é mais importante? Como organizar as informações?" rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                          <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                            <Lightbulb className="w-3 h-3" /> Define a prioridade visual das informações
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Serviços/Produtos *</Label>
                        <Textarea {...register('servicesProducts')} placeholder="Descreva detalhadamente os serviços ou produtos que oferece, benefícios principais, diferenciais..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo Adicional */}
                  <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-amber-500/20 border-amber-500/30' : 'bg-amber-100 border-amber-200'} border flex items-center justify-center`}>
                        <Award className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold ${themeClasses.text}`}>Conteúdo Adicional (Opcional)</h3>
                        <p className={`text-xs ${themeClasses.textMuted}`}>Informações que fortalecem a credibilidade</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Informações da Equipe</Label>
                        <Textarea {...register('teamInfo')} placeholder="Apresente sua equipe, experiências, especializações..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Certificações e Qualificações</Label>
                        <Textarea {...register('certifications')} placeholder="Certificações, qualificações, licenças relevantes..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Prêmios e Reconhecimentos</Label>
                        <Textarea {...register('awardsRecognition')} placeholder="Prêmios recebidos, reconhecimentos, menções na mídia..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Casos de Sucesso</Label>
                        <Textarea {...register('caseStudies')} placeholder="Projetos de destaque, resultados alcançados, casos de sucesso..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div className="lg:col-span-2">
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Depoimentos de Clientes</Label>
                        <Textarea {...register('testimonials')} placeholder="Depoimentos de clientes satisfeitos, avaliações, recomendações..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Depoimentos aumentam significativamente a credibilidade
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 3: DESIGN E IDENTIDADE VISUAL */}
              {currentTab === 3 && (
                <div className="space-y-6">
                  <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-pink-500/20 border-pink-500/30' : 'bg-pink-100 border-pink-200'} border flex items-center justify-center`}>
                        <Palette className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Design e Identidade Visual</h2>
                        <p className={`text-sm ${themeClasses.textMuted}`}>Defina o visual e a identidade do seu site</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Estilo de Design</Label>
                        <Select onValueChange={(value) => setValue('designStyle', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione o estilo preferido" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moderno">Moderno e Minimalista</SelectItem>
                            <SelectItem value="classico">Clássico e Elegante</SelectItem>
                            <SelectItem value="corporativo">Corporativo e Profissional</SelectItem>
                            <SelectItem value="criativo">Criativo e Inovador</SelectItem>
                            <SelectItem value="tecnologico">Tecnológico e Futurista</SelectItem>
                            <SelectItem value="luxo">Luxo e Sofisticado</SelectItem>
                            <SelectItem value="jovem">Jovem e Descontraído</SelectItem>
                            <SelectItem value="tradicional">Tradicional e Confiável</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Define a personalidade visual do site
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Cores da Marca</Label>
                        <Input {...register('brandColors')} placeholder="Ex: Azul (#0066CC), Branco, Cinza..." className={`${themeClasses.input} h-9 text-sm`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Cores que representam sua marca
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Sua empresa possui logo? *</Label>
                        <Select onValueChange={(value) => setValue('hasLogo', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm mb-2`}>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sim-enviarei">Sim, vou enviar os arquivos</SelectItem>
                            <SelectItem value="sim-nao-tenho-arquivos">Sim, mas não tenho os arquivos digitais</SelectItem>
                            <SelectItem value="nao-preciso-criar">Não, preciso criar uma logo</SelectItem>
                            <SelectItem value="nao-nao-quero">Não, não quero logo</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <input type="file" accept="image/*,.pdf,.ai,.svg" multiple className="hidden" id="logo-upload"
                          onChange={(e) => { handleLogoChange(e.target.files); setValue('logoFiles', e.target.files); }} />
                        
                        {logoPreview ? (
                          <div className={`relative rounded-lg p-3 ${isDarkMode ? 'bg-white/5 border-white/20' : 'bg-slate-50 border-slate-200'} border flex items-center gap-3`}>
                            <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain rounded" />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${themeClasses.text} truncate`}>{logoFiles?.[0]?.name}</p>
                              <label htmlFor="logo-upload" className={`text-xs ${isDarkMode ? 'text-pink-400' : 'text-pink-600'} cursor-pointer hover:underline`}>Trocar</label>
                            </div>
                            <button type="button" onClick={() => { handleLogoChange(null); setValue('logoFiles', null); }} className="p-1 hover:bg-red-500/20 rounded">
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="logo-upload" className={`flex items-center justify-center h-16 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-pink-500/50 bg-white/5' : 'border-slate-200 hover:border-pink-500/50 bg-slate-50'}`}>
                            <div className="text-center">
                              <Upload className={`w-4 h-4 mx-auto mb-1 ${themeClasses.textSubtle}`} />
                              <span className={`text-xs ${themeClasses.textMuted}`}>Upload logo (PNG, JPG, SVG)</span>
                            </div>
                          </label>
                        )}
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Referências Visuais</Label>
                        <Textarea {...register('visualReferences')} placeholder="Descreva sites que você gosta, estilos de referência, cores que chamam atenção..." rows={2} className={`${themeClasses.input} text-sm resize-none mb-2`} />
                        <input type="file" accept="image/*,.pdf" multiple className="hidden" id="visual-upload"
                          onChange={(e) => { setVisualFiles(e.target.files); setValue('visualFiles', e.target.files); }} />
                        <label htmlFor="visual-upload" className={`flex items-center justify-center h-12 border-2 border-dashed rounded-lg cursor-pointer ${isDarkMode ? 'border-white/20 hover:border-pink-500/50' : 'border-slate-200 hover:border-pink-500/50'}`}>
                          <span className={`text-xs ${themeClasses.textMuted}`}>{visualFiles?.length ? `${visualFiles.length} arquivo(s) selecionado(s)` : 'Upload de referências visuais'}</span>
                        </label>
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Referências visuais nos ajudam a entender seu gosto
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Marketing e Comunicação */}
                  <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-cyan-100 border-cyan-200'} border flex items-center justify-center`}>
                        <Users className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold ${themeClasses.text}`}>Marketing e Comunicação</h3>
                        <p className={`text-xs ${themeClasses.textMuted}`}>Estratégia de comunicação e posicionamento</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Concorrentes</Label>
                        <Textarea {...register('mainCompetitors')} placeholder="Liste seus principais concorrentes e sites..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Nos ajuda a entender o mercado
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Dores do Cliente</Label>
                        <Textarea {...register('customerPainPoints')} placeholder="Quais problemas seus clientes enfrentam?" rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Essencial para criar mensagens que conectam
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Objeções dos Clientes</Label>
                        <Textarea {...register('customerObjections')} placeholder="Quais objeções os clientes costumam ter?" rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Permite responder dúvidas antes mesmo delas surgirem
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Tom de Comunicação</Label>
                        <Select onValueChange={(value) => setValue('communicationTone', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione o tom de comunicação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal e Profissional</SelectItem>
                            <SelectItem value="informal">Informal e Próximo</SelectItem>
                            <SelectItem value="amigavel">Amigável e Acolhedor</SelectItem>
                            <SelectItem value="tecnico">Técnico e Especializado</SelectItem>
                            <SelectItem value="inspirador">Inspirador e Motivacional</SelectItem>
                            <SelectItem value="confiavel">Confiável e Seguro</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Define como os textos serão escritos
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Mensagens-Chave</Label>
                        <Textarea {...register('keyMessages')} placeholder="Quais são as 3 mensagens mais importantes que você quer transmitir? O que não pode faltar no site?" rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Essas mensagens serão destacadas estrategicamente
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Requisitos Específicos</Label>
                        <Textarea {...register('specificRequirements')} placeholder="Alguma funcionalidade específica que você precisa? (calculadora, quiz, chat, área restrita, etc.)" rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Materiais Próprios para o Site</Label>
                        <Textarea {...register('contentMaterials')} placeholder="Descreva os materiais que você tem e gostaria de incluir no site (fotos da empresa, textos, vídeos, certificados, etc.)" rows={2} className={`${themeClasses.input} text-sm resize-none mb-2`} />
                        <input type="file" accept="image/*,video/*,.pdf,.doc,.docx" multiple className="hidden" id="material-upload"
                          onChange={(e) => { setMaterialFiles(e.target.files); setValue('materialFiles', e.target.files); }} />
                        <label htmlFor="material-upload" className={`flex items-center justify-center h-12 border-2 border-dashed rounded-lg cursor-pointer ${isDarkMode ? 'border-white/20 hover:border-pink-500/50' : 'border-slate-200 hover:border-pink-500/50'}`}>
                          <span className={`text-xs ${themeClasses.textMuted}`}>{materialFiles?.length ? `${materialFiles.length} arquivo(s) selecionado(s)` : 'Upload de materiais (imagens, vídeos, documentos)'}</span>
                        </label>
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Quanto mais materiais de qualidade você fornecer, mais personalizado será seu site!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 4: FUNCIONALIDADES TÉCNICAS */}
              {currentTab === 4 && (
                <div className="space-y-6">
                  <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-cyan-100 border-cyan-200'} border flex items-center justify-center`}>
                        <Settings className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Funcionalidades Técnicas</h2>
                        <p className={`text-sm ${themeClasses.textMuted}`}>Configure as funcionalidades técnicas do seu site</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Formulários de Contato</Label>
                        <Textarea {...register('contactForms')} placeholder="Quais formulários precisa? Contato, orçamento, newsletter..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Formulários são essenciais para capturar leads
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Integrações Necessárias</Label>
                        <Textarea {...register('integrations')} placeholder="Ex: Google Analytics, Facebook Pixel, CRM, sistemas internos..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Integrações conectam seu site com outras ferramentas
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Requisitos de SEO</Label>
                        <Textarea {...register('seoRequirements')} placeholder="Palavras-chave importantes, objetivos de SEO..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> SEO ajuda seu site a ser encontrado no Google
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Ferramentas de Analytics</Label>
                        <Textarea {...register('analytics')} placeholder="Google Analytics, Tag Manager, outras ferramentas..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Para acompanhar o desempenho do site
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Domínio e Hospedagem */}
                  <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-100 border-emerald-200'} border flex items-center justify-center`}>
                        <Globe className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold ${themeClasses.text}`}>Domínio e Hospedagem</h3>
                        <p className={`text-xs ${themeClasses.textMuted}`}>Configurações de infraestrutura</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Informações sobre Domínio *</Label>
                        <Textarea {...register('desiredDomain')} placeholder="Já tem domínio? Quer registrar? Qual nome prefere?" rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> O domínio é o endereço do seu site na internet
                        </p>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Preferências de Hospedagem</Label>
                        <Textarea {...register('hostingPreferences')} placeholder="Já tem hospedagem? Prefere alguma empresa específica?" rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Podemos ajudar a escolher a melhor hospedagem
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 5: TIMELINE E ORÇAMENTO */}
              {currentTab === 5 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-200'} border flex items-center justify-center`}>
                      <Calendar className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Timeline e Orçamento</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Defina prazos e expectativas do projeto</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Informação Importante */}
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border`}>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className={`font-semibold ${themeClasses.text} mb-1`}>Informação Importante:</h3>
                          <p className={`text-sm ${themeClasses.textMuted}`}>
                            O prazo de entrega e orçamento serão definidos conforme acordado na Workana, 
                            baseado na complexidade e escopo do projeto apresentado neste briefing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Observações Adicionais</Label>
                      <Textarea {...register('additionalNotes')} placeholder="Alguma informação adicional importante para o projeto? Expectativas especiais, preocupações, ideias..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                      <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                        <Lightbulb className="w-3 h-3" /> Qualquer detalhe adicional que possa nos ajudar a criar o site perfeito para você
                      </p>
                    </div>

                    {/* Resumo do Projeto */}
                    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-purple-500/5 border-purple-500/20' : 'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 border-purple-200'} border`}>
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'} flex items-center justify-center flex-shrink-0`}>
                          <Award className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${themeClasses.text} mb-1`}>Resumo do Projeto</h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className={`font-medium ${themeClasses.text}`}>Tipo de Site:</span>
                          <span className={themeClasses.textMuted}>Site Institucional</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className={`font-medium ${themeClasses.text}`}>Prazo:</span>
                          <span className={themeClasses.textMuted}>Conforme acordado na Workana</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className={`font-medium ${themeClasses.text}`}>Orçamento:</span>
                          <span className={themeClasses.textMuted}>Conforme acordado na Workana</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className={`font-medium ${themeClasses.text}`}>Entrega:</span>
                          <span className={themeClasses.textMuted}>Site completo e funcional</span>
                        </div>
                      </div>
                    </div>

                    {/* Pronto para Enviar */}
                    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/5 border-green-500/20' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-green-200'} border`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} flex items-center justify-center flex-shrink-0`}>
                          <Send className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${themeClasses.text} mb-1`}>Pronto para Enviar?</h3>
                          <p className={`text-sm ${themeClasses.textMuted} mb-2`}>
                            Revise todas as informações preenchidas antes de enviar o briefing. 
                            Após o envio, entraremos em contato para alinhar os próximos passos do projeto.
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                            Clique no botão "Enviar Briefing" abaixo para finalizar o processo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className={`flex items-center justify-between mt-6 pt-4 border-t ${themeClasses.border}`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevTab}
                  disabled={currentTab === 1}
                  className={`${isDarkMode ? 'border-white/30 bg-white/5 text-white hover:bg-white/15 hover:border-white/40' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'} disabled:opacity-50`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentTab === tabs.length ? (
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Briefing
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextTab}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8"
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className={`flex-shrink-0 px-4 py-3 border-t ${themeClasses.border} transition-colors duration-500`}>
          <p className={`text-center text-xs ${themeClasses.textSubtle}`}>
            Desenvolvido por <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>Leonardo Lopes</span> | UX/UI Designer & Developer
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SiteBrief;
