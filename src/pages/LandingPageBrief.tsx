import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  Sparkles, 
  Target,
  Palette,
  TrendingUp,
  LayoutGrid,
  FileCheck,
  Upload,
  Send,
  Clock,
  Award,
  X,
  Building2,
  ShoppingBag,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Info,
  Lightbulb
} from 'lucide-react';
import type { LandingPageBriefForm } from '@/services/briefingService';

// Schema de validação
const landingPageBriefSchema = z.object({
  // Seção 1: Sobre sua Empresa
  companyName: z.string().optional(),
  businessSegment: z.string().optional(),
  businessDescription: z.string().optional(),
  targetAudience: z.string().optional(),
  competitiveDifferential: z.string().optional(),
  landingPageGoal: z.string().optional(),
  
  // Seção 2: Estratégia & Mercado
  mainCompetitors: z.string().optional(),
  customerPainPoints: z.string().optional(),
  successStories: z.string().optional(),
  socialProof: z.string().optional(),
  
  // Seção 3: Produto/Serviço
  responsibleName: z.string().optional(),
  currentWebsite: z.string().optional(),
  productName: z.string().optional(),
  productDescription: z.string().optional(),
  mainBenefits: z.string().optional(),
  numberOfOffers: z.string().optional(),
  offerDetails: z.string().optional(),
  pricingModel: z.string().optional(),
  guarantees: z.string().optional(),
  productDifferentials: z.string().optional(),
  
  // Seção 4: Conversão & Argumentos
  targetResults: z.string().optional(),
  urgencyFactors: z.string().optional(),
  objections: z.string().optional(),
  callToAction: z.string().optional(),
  leadDestination: z.string().optional(),
  salesArguments: z.string().optional(),
  
  // Seção 5: Design & Identidade
  brandColors: z.string().optional(),
  hasLogo: z.string().optional(),
  logoFiles: z.any().optional(),
  visualReferences: z.string().optional(),
  visualFiles: z.any().optional(),
  contentMaterials: z.string().optional(),
  materialFiles: z.any().optional(),
  brandPersonality: z.string().optional(),
  communicationTone: z.string().optional(),
  keyMessages: z.string().optional(),
  
  // Seção 6: Estrutura & Funcionalidades
  landingPageSections: z.string().optional(),
  specificRequirements: z.string().optional(),
  desiredDomain: z.string().optional(),
  hostingPreference: z.string().optional(),
  integrations: z.string().optional(),
  analytics: z.string().optional(),
  
  // Seção 7: Finalização
  additionalNotes: z.string().optional(),
  projectTimeline: z.string().optional(),
  preferredContact: z.string().optional(),
  agreedTerms: z.boolean().optional(),
});

// Definição das abas/seções
const tabs = [
  { id: 1, title: 'Empresa', icon: Building2, color: 'purple' },
  { id: 2, title: 'Mercado', icon: TrendingUp, color: 'blue' },
  { id: 3, title: 'Produto', icon: ShoppingBag, color: 'emerald' },
  { id: 4, title: 'Conversão', icon: Target, color: 'orange' },
  { id: 5, title: 'Design', icon: Palette, color: 'pink' },
  { id: 6, title: 'Estrutura', icon: LayoutGrid, color: 'cyan' },
  { id: 7, title: 'Finalização', icon: FileCheck, color: 'green' },
];

const LandingPageBrief = () => {
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
  } = useForm<LandingPageBriefForm>({
    resolver: zodResolver(landingPageBriefSchema),
    defaultValues: {
      agreedTerms: false,
    }
  });

  const onSubmit = async (data: LandingPageBriefForm) => {
    // Prevenir envio automático - só permitir se estiver na última etapa
    if (currentTab !== tabs.length) {
      console.log('⚠️ [LANDING-DEBUG] Tentativa de envio automático bloqueada - etapa atual:', currentTab);
      return;
    }
    
    console.log('✅ [LANDING-DEBUG] Envio autorizado - usuário está na última etapa e clicou no botão');
    setIsSubmitting(true);
    
    try {
      console.log('🚀 [LANDING-DEBUG] Iniciando envio do briefing de landing page...');
      
      const { submitLandingPageBriefing } = await import('@/services/briefingService');
      
      const formData = {
        ...data,
        logoFiles: logoFiles,
        visualFiles: visualFiles,
        materialFiles: materialFiles,
        agreedTerms: true, // Always true when submitting
      };
      
      console.log('🚀 [LANDING-DEBUG] Dados do formulário:', formData);
      
      await submitLandingPageBriefing(formData);
      
      console.log('✅ [LANDING-DEBUG] Briefing de landing page salvo com sucesso!');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('❌ [LANDING-DEBUG] Erro ao enviar briefing:', error);
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
                Recebemos todas as informações do seu projeto. O Designer Leonardo irá analisar seu briefing e criar a primeira versão da sua landing page em breve.
              </p>
              
              <div className={`bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-transparent rounded-2xl p-6 border ${isDarkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className={`font-semibold ${themeClasses.text}`}>Próximo Passo</h3>
                </div>
                <p className={`text-sm ${themeClasses.textMuted}`}>
                  Você receberá um feedback em até 24 horas com a apresentação da sua landing page.
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
                Landing Page{' '}
                <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                  Profissional
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
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
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
              
              {/* SEÇÃO 1: SOBRE SUA EMPRESA */}
              {currentTab === 1 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-100 border-purple-200'} border flex items-center justify-center`}>
                      <Building2 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Sobre sua Empresa</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Informações básicas do seu negócio</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Nome da Empresa *</Label>
                        <Input {...register('companyName')} placeholder="Ex: Workflow Digital" className={`${themeClasses.input} h-9 text-sm`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Segmento *</Label>
                        <Select onValueChange={(value) => setValue('businessSegment', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="educacao">Educação</SelectItem>
                            <SelectItem value="tecnologia">Tecnologia</SelectItem>
                            <SelectItem value="consultoria">Consultoria</SelectItem>
                            <SelectItem value="servicos">Serviços</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Descrição do Negócio *</Label>
                        <Textarea {...register('businessDescription')} placeholder="Descreva sua empresa..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Público-Alvo *</Label>
                        <Textarea {...register('targetAudience')} placeholder="Quem são seus clientes ideais?" rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Diferencial Competitivo *</Label>
                        <Textarea {...register('competitiveDifferential')} placeholder="O que te diferencia?" rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Objetivo da Landing Page *</Label>
                        <Select onValueChange={(value) => setValue('landingPageGoal', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Qual o objetivo?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vendas">Aumentar Vendas</SelectItem>
                            <SelectItem value="leads">Capturar Leads</SelectItem>
                            <SelectItem value="agendamentos">Gerar Agendamentos</SelectItem>
                            <SelectItem value="cadastros">Aumentar Cadastros</SelectItem>
                            <SelectItem value="awareness">Brand Awareness</SelectItem>
                            <SelectItem value="downloads">Downloads</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'} border`}>
                        <p className={`text-xs ${themeClasses.textMuted} flex items-start gap-2`}>
                          <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span>Quanto mais detalhes você fornecer, mais personalizada será sua landing page!</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 2: ESTRATÉGIA & MERCADO */}
              {currentTab === 2 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-200'} border flex items-center justify-center`}>
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Estratégia & Mercado</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Informações sobre seu mercado</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Concorrentes</Label>
                        <Textarea {...register('mainCompetitors')} placeholder="Liste seus concorrentes e o que fazem de diferente..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Ajuda a criar proposta diferenciada
                        </p>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Dores do Cliente</Label>
                        <Textarea {...register('customerPainPoints')} placeholder="Quais problemas seu público enfrenta?" rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Mensagem mais persuasiva
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Histórias de Sucesso</Label>
                        <Textarea {...register('successStories')} placeholder="Cases de sucesso, resultados, transformações..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Aumenta credibilidade
                        </p>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Prova Social Disponível</Label>
                        <Textarea {...register('socialProof')} placeholder="Depoimentos, certificações, prêmios, números..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Fundamental para conversão
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 3: PRODUTO/SERVIÇO */}
              {currentTab === 3 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-100 border-emerald-200'} border flex items-center justify-center`}>
                      <ShoppingBag className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Produto/Serviço</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Detalhes sobre sua oferta</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Responsável *</Label>
                          <Input {...register('responsibleName')} placeholder="Seu nome" className={`${themeClasses.input} h-9 text-sm`} />
                        </div>
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Site Atual</Label>
                          <Input {...register('currentWebsite')} placeholder="https://..." className={`${themeClasses.input} h-9 text-sm`} />
                        </div>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Nome do Produto *</Label>
                        <Input {...register('productName')} placeholder="Ex: Curso de Marketing" className={`${themeClasses.input} h-9 text-sm`} />
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Descrição Detalhada *</Label>
                        <Textarea {...register('productDescription')} placeholder="O que é, como funciona..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Benefícios *</Label>
                        <Textarea {...register('mainBenefits')} placeholder="Resultados que o cliente terá" rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Qtd. Ofertas</Label>
                          <Select onValueChange={(value) => setValue('numberOfOffers', value)}>
                            <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 oferta</SelectItem>
                              <SelectItem value="2">2 ofertas</SelectItem>
                              <SelectItem value="3">3 ofertas</SelectItem>
                              <SelectItem value="4+">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Cobrança</Label>
                          <Select onValueChange={(value) => setValue('pricingModel', value)}>
                            <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                              <SelectValue placeholder="Modelo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="valor-unico">Único</SelectItem>
                              <SelectItem value="mensal">Mensal</SelectItem>
                              <SelectItem value="anual">Anual</SelectItem>
                              <SelectItem value="parcelado">Parcelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Detalhes das Ofertas</Label>
                        <Textarea {...register('offerDetails')} placeholder="Oferta 1: R$ 297..." rows={3} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Garantias</Label>
                        <Input {...register('guarantees')} placeholder="Ex: 30 dias de garantia" className={`${themeClasses.input} h-9 text-sm`} />
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Diferenciais do Produto</Label>
                        <Textarea {...register('productDifferentials')} placeholder="O que torna seu produto único? Tecnologia exclusiva, metodologia própria..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Destaque o que só você oferece
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 4: CONVERSÃO & ARGUMENTOS */}
              {currentTab === 4 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-100 border-orange-200'} border flex items-center justify-center`}>
                      <Target className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Conversão & Argumentos</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Estratégias para converter</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Resultados Esperados</Label>
                        <Textarea {...register('targetResults')} placeholder="Transformação que o cliente terá?" rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Gera interesse e urgência
                        </p>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Fatores de Urgência</Label>
                        <Textarea {...register('urgencyFactors')} placeholder="Por que agir agora?" rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Maior motivador de conversão
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Objeções dos Clientes</Label>
                        <Textarea {...register('objections')} placeholder={`"É muito caro", "Não tenho tempo"...`} rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Respondemos na landing page
                        </p>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>CTA Principal *</Label>
                        <Input {...register('callToAction')} placeholder="Ex: Quero Começar Agora" className={`${themeClasses.input} h-9 text-sm`} />
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Destino dos Leads *</Label>
                        <Select onValueChange={(value) => setValue('leadDestination', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione destino" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="formulario">Formulário</SelectItem>
                            <SelectItem value="checkout">Checkout</SelectItem>
                            <SelectItem value="agendamento">Agendamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Principais Argumentos de Venda</Label>
                        <Textarea {...register('salesArguments')} placeholder="Quais são os argumentos mais fortes para convencer o cliente? Ex: ROI comprovado, resultados rápidos, suporte premium..." rows={8} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Lightbulb className="w-3 h-3" /> Usaremos nos CTAs e headlines
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 5: DESIGN & IDENTIDADE */}
              {currentTab === 5 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-pink-500/20 border-pink-500/30' : 'bg-pink-100 border-pink-200'} border flex items-center justify-center`}>
                      <Palette className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Design & Identidade</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Visual da sua marca</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Cores da Marca</Label>
                        <Input {...register('brandColors')} placeholder="Ex: Azul (#0066cc), Branco" className={`${themeClasses.input} h-9 text-sm`} />
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Logo *</Label>
                        <Select onValueChange={(value) => setValue('hasLogo', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm mb-2`}>
                            <SelectValue placeholder="Você tem logo?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tem-logo">Sim, tenho</SelectItem>
                            <SelectItem value="logo-simples">Tenho algo simples</SelectItem>
                            <SelectItem value="sem-logo">Não tenho</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <input type="file" accept="image/*,.pdf,.ai,.svg" className="hidden" id="logo-upload"
                          onChange={(e) => { handleLogoChange(e.target.files); setValue('logoFiles', e.target.files); }} />
                        
                        {logoPreview ? (
                          <div className={`relative rounded-lg p-3 ${isDarkMode ? 'bg-white/5 border-white/20' : 'bg-slate-50 border-slate-200'} border flex items-center gap-3`}>
                            <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain rounded" />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${themeClasses.text} truncate`}>{logoFiles?.[0]?.name}</p>
                              <label htmlFor="logo-upload" className={`text-xs ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} cursor-pointer hover:underline`}>Trocar</label>
                            </div>
                            <button type="button" onClick={() => { handleLogoChange(null); setValue('logoFiles', null); }} className="p-1 hover:bg-red-500/20 rounded">
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="logo-upload" className={`flex items-center justify-center h-16 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'border-white/20 hover:border-pink-500/50 bg-white/5' : 'border-slate-200 hover:border-pink-500/50 bg-slate-50'}`}>
                            <div className="text-center">
                              <Upload className={`w-4 h-4 mx-auto mb-1 ${themeClasses.textSubtle}`} />
                              <span className={`text-xs ${themeClasses.textMuted}`}>Upload logo</span>
                            </div>
                          </label>
                        )}
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Referências Visuais</Label>
                        <Textarea {...register('visualReferences')} placeholder="Sites que você admira..." rows={2} className={`${themeClasses.input} text-sm resize-none mb-2`} />
                        <input type="file" accept="image/*,.pdf" multiple className="hidden" id="visual-upload"
                          onChange={(e) => { setVisualFiles(e.target.files); setValue('visualFiles', e.target.files); }} />
                        <label htmlFor="visual-upload" className={`flex items-center justify-center h-12 border-2 border-dashed rounded-lg cursor-pointer ${isDarkMode ? 'border-white/20 hover:border-pink-500/50' : 'border-slate-200 hover:border-pink-500/50'}`}>
                          <span className={`text-xs ${themeClasses.textMuted}`}>{visualFiles?.length ? `${visualFiles.length} arquivo(s)` : 'Upload'}</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Materiais para Landing</Label>
                        <Textarea {...register('contentMaterials')} placeholder="Fotos, vídeos, depoimentos..." rows={2} className={`${themeClasses.input} text-sm resize-none mb-2`} />
                        <input type="file" accept="image/*,video/*,.pdf" multiple className="hidden" id="material-upload"
                          onChange={(e) => { setMaterialFiles(e.target.files); setValue('materialFiles', e.target.files); }} />
                        <label htmlFor="material-upload" className={`flex items-center justify-center h-12 border-2 border-dashed rounded-lg cursor-pointer ${isDarkMode ? 'border-white/20 hover:border-pink-500/50' : 'border-slate-200 hover:border-pink-500/50'}`}>
                          <span className={`text-xs ${themeClasses.textMuted}`}>{materialFiles?.length ? `${materialFiles.length} arquivo(s)` : 'Upload'}</span>
                        </label>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Personalidade</Label>
                        <Textarea {...register('brandPersonality')} placeholder="Séria, jovem, inovadora..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Tom de Comunicação</Label>
                        <Select onValueChange={(value) => setValue('communicationTone', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="informal">Informal</SelectItem>
                            <SelectItem value="tecnico">Técnico</SelectItem>
                            <SelectItem value="emocional">Emocional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Mensagens-Chave</Label>
                        <Textarea {...register('keyMessages')} placeholder="3 mensagens mais importantes que devem aparecer..." rows={6} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>

                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-pink-500/10 border-pink-500/20' : 'bg-pink-50 border-pink-200'} border`}>
                        <p className={`text-xs ${themeClasses.textMuted} flex items-start gap-2`}>
                          <Sparkles className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                          <span>Quanto mais materiais de qualidade você fornecer, mais personalizada será sua landing page!</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 6: ESTRUTURA & FUNCIONALIDADES */}
              {currentTab === 6 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-cyan-100 border-cyan-200'} border flex items-center justify-center`}>
                      <LayoutGrid className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Estrutura & Funcionalidades</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Organização e recursos técnicos</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Seções da Landing Page</Label>
                        <Textarea {...register('landingPageSections')} placeholder="Hero, benefícios, depoimentos, FAQ, formulário..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                        <p className={`text-xs ${themeClasses.textSubtle} mt-1 flex items-center gap-1`}>
                          <Sparkles className="w-3 h-3" /> Estrutura ideal para seus objetivos
                        </p>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Requisitos Específicos</Label>
                        <Textarea {...register('specificRequirements')} placeholder="Calculadora, quiz, vídeo popup, chat..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Domínio Desejado</Label>
                          <Input {...register('desiredDomain')} placeholder="meunegocio.com.br" className={`${themeClasses.input} h-9 text-sm`} />
                        </div>
                        <div>
                          <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Hospedagem</Label>
                          <Select onValueChange={(value) => setValue('hostingPreference', value)}>
                            <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                              <SelectValue placeholder="Preferência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vercel">Vercel (Recomendado)</SelectItem>
                              <SelectItem value="netlify">Netlify</SelectItem>
                              <SelectItem value="hostinger">Hostinger</SelectItem>
                              <SelectItem value="proprio">Servidor Próprio</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Integrações Necessárias</Label>
                        <Textarea {...register('integrations')} placeholder="Mailchimp, RD Station, Hotmart..." rows={2} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Analytics e Tracking</Label>
                        <Textarea {...register('analytics')} placeholder="Google Analytics, Facebook Pixel, Tag Manager..." rows={4} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEÇÃO 7: FINALIZAÇÃO */}
              {currentTab === 7 && (
                <div className={`${themeClasses.card} border rounded-2xl p-6 transition-all duration-500`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-200'} border flex items-center justify-center`}>
                      <FileCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Finalização</h2>
                      <p className={`text-sm ${themeClasses.textMuted}`}>Informações finais do projeto</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Observações Adicionais</Label>
                        <Textarea {...register('additionalNotes')} placeholder="Informações importantes não mencionadas, requisitos especiais, expectativas..." rows={5} className={`${themeClasses.input} text-sm resize-none`} />
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Expectativa de Timeline</Label>
                        <Select onValueChange={(value) => setValue('projectTimeline', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Quando precisa da landing page?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgente">Urgente (até 3 dias)</SelectItem>
                            <SelectItem value="rapido">Rápido (até 7 dias)</SelectItem>
                            <SelectItem value="normal">Normal (até 15 dias)</SelectItem>
                            <SelectItem value="flexivel">Flexível (sem pressa)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className={`${themeClasses.label} text-xs font-medium mb-1.5 block`}>Preferência de Contato</Label>
                        <Select onValueChange={(value) => setValue('preferredContact', value)}>
                          <SelectTrigger className={`${themeClasses.input} h-9 text-sm`}>
                            <SelectValue placeholder="Como prefere ser contatado?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="email">E-mail</SelectItem>
                            <SelectItem value="telefone">Telefone</SelectItem>
                            <SelectItem value="videocall">Videochamada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Card Informativo */}
                      <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-purple-500/5 border-purple-500/20' : 'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 border-purple-200'} border`}>
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'} flex items-center justify-center flex-shrink-0`}>
                            <Info className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${themeClasses.text} mb-1`}>Próximos Passos</h3>
                            <p className={`text-sm ${themeClasses.textMuted}`}>Após enviar o briefing:</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 ml-13">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-purple-500">1</span>
                            </div>
                            <p className={`text-sm ${themeClasses.textMuted}`}>Análise detalhada do briefing em até 24h</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-purple-500">2</span>
                            </div>
                            <p className={`text-sm ${themeClasses.textMuted}`}>Apresentação da primeira versão da landing page</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-purple-500">3</span>
                            </div>
                            <p className={`text-sm ${themeClasses.textMuted}`}>Ajustes finais e entrega do projeto</p>
                          </div>
                        </div>
                      </div>

                      {/* Card de Contato */}
                      <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-emerald-500/5 border-emerald-500/20' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 border-emerald-200'} border`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex items-center justify-center flex-shrink-0`}>
                            <Lightbulb className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${themeClasses.text} mb-1`}>Dica Importante</h3>
                            <p className={`text-sm ${themeClasses.textMuted}`}>
                              Quanto mais completo o briefing, mais assertiva será a primeira versão da sua landing page. Não hesite em voltar e adicionar mais informações!
                            </p>
                          </div>
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
                  className={`${isDarkMode ? 'border-white/30 bg-white/5 text-white hover:bg-white/15 hover:border-white/40' : 'border-slate-200 text-slate-700 hover:bg-slate-100'} disabled:opacity-50`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentTab === tabs.length ? (
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-8"
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
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-8"
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

export default LandingPageBrief;
