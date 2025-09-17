import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight, Building2, Globe, Palette, Settings, Calendar, Send, Upload, Sparkles, Target, Users, Award, Shield, Eye, Heart } from 'lucide-react';
import { FileUpload } from '@/components/ui/FileUpload';

// Schema de validação para briefing institucional - TODAS AS VALIDAÇÕES OBRIGATÓRIAS REMOVIDAS
const institutionalBriefSchema = z.object({
  // Informações da Empresa
  companyName: z.string().optional(),
  businessSegment: z.string().optional(),
  companyDescription: z.string().optional(),
  companyHistory: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.string().optional(),
  targetAudience: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  
  // Informações de Contato
  responsibleName: z.string().optional(),
  currentWebsite: z.string().optional(),
  
  // Objetivos do Site
  websiteGoal: z.string().optional(),
  websiteType: z.string().optional(),
  mainFunctionalities: z.string().optional(),
  
  // Estrutura do Site
  requiredPages: z.string().optional(),
  navigationStructure: z.string().optional(),
  contentHierarchy: z.string().optional(),
  
  // Conteúdo
  servicesProducts: z.string().optional(),
  teamInfo: z.string().optional(),
  certifications: z.string().optional(),
  awardsRecognition: z.string().optional(),
  caseStudies: z.string().optional(),
  testimonials: z.string().optional(),
  
  // Design e Visual
  brandColors: z.string().optional(),
  hasLogo: z.string().optional(),
  logoFiles: z.any().optional(),
  visualReferences: z.string().optional(),
  visualFiles: z.any().optional(),
  designStyle: z.string().optional(),
  
  // Novos campos de Marketing e Comunicação
  mainCompetitors: z.string().optional(),
  customerPainPoints: z.string().optional(),
  customerObjections: z.string().optional(),
  communicationTone: z.string().optional(),
  keyMessages: z.string().optional(),
  specificRequirements: z.string().optional(),
  contentMaterials: z.string().optional(),
  materialFiles: z.any().optional(),
  
  // Técnico
  contactForms: z.string().optional(),
  integrations: z.string().optional(),
  seoRequirements: z.string().optional(),
  analytics: z.string().optional(),
  
  // Domínio e Hospedagem
  desiredDomain: z.string().optional(),
  hostingPreferences: z.string().optional(),
  
  // Timeline
  deliveryDeadline: z.string().optional(),
  startDate: z.string().optional(),
  budget: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type InstitutionalBriefForm = z.infer<typeof institutionalBriefSchema>;

const steps = [
  { id: 1, title: 'Empresa', description: 'Informações da sua empresa', icon: Building2 },
  { id: 2, title: 'Site', description: 'Objetivos e estrutura', icon: Globe },
  { id: 3, title: 'Design', description: 'Identidade visual', icon: Palette },
  { id: 4, title: 'Técnico', description: 'Funcionalidades técnicas', icon: Settings },
  { id: 5, title: 'Timeline', description: 'Prazos e orçamento', icon: Calendar },
];

const InstitutionalBrief = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InstitutionalBriefForm>({
    resolver: zodResolver(institutionalBriefSchema),
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors }, setValue } = form;

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = async (data: InstitutionalBriefForm) => {
    console.log('🔍 [INSTITUTIONAL-DEBUG] onSubmit chamado - Step atual:', currentStep);
    
    // CORREÇÃO: Só permite envio se estivermos no último step E se for uma submissão explícita
    if (currentStep !== steps.length) {
      console.log('🚫 [INSTITUTIONAL-DEBUG] Tentativa de envio em step incorreto:', currentStep);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🔍 [INSTITUTIONAL-DEBUG] Dados do formulário:', data);
      console.log('🔍 [INSTITUTIONAL-DEBUG] Prazo fixo: Valor Acordado na Workana');
      
      // Definir prazo fixo
      data.deliveryDeadline = 'Valor Acordado na Workana';
      
      // VALIDAÇÕES OBRIGATÓRIAS REMOVIDAS - Agora todos os campos são opcionais
      console.log('✅ [INSTITUTIONAL-DEBUG] Prosseguindo sem validações obrigatórias');
      
      // Tentar enviar para o Supabase
      console.log('🚀 [INSTITUTIONAL-DEBUG] Importando submitInstitutionalBriefing...');
      const { submitInstitutionalBriefing } = await import('@/services/briefingService');
      
      console.log('🚀 [INSTITUTIONAL-DEBUG] Chamando submitInstitutionalBriefing com dados:', {
        companyName: data.companyName,
        responsibleName: data.responsibleName,
        deliveryDeadline: data.deliveryDeadline,
        totalFields: Object.keys(data).length
      });
      
      const savedBriefing = await submitInstitutionalBriefing(data);
      console.log('✅ [INSTITUTIONAL-DEBUG] submitInstitutionalBriefing retornou:', savedBriefing);
      
      console.log('✅ [INSTITUTIONAL-DEBUG] Briefing institucional salvo com sucesso! Definindo isSubmitted = true');
      setIsSubmitted(true);
      return;
      
    } catch (error) {
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro capturado no onSubmit:', error);
      console.error('❌ [INSTITUTIONAL-DEBUG] Tipo do erro:', typeof error);
      console.error('❌ [INSTITUTIONAL-DEBUG] Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      
      // Se deu erro no Supabase, usar fallback local
      if (error instanceof Error && (
        error.message.includes('Supabase') || 
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('database')
      )) {
        console.log('💾 [INSTITUTIONAL-DEBUG] Erro do Supabase detectado, salvando localmente como fallback...');
        const briefingData = {
          ...data,
          id: `institutional_local_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        
        // Salvar no localStorage
        const existingBriefings = JSON.parse(localStorage.getItem('institutional_briefings') || '[]');
        existingBriefings.push(briefingData);
        localStorage.setItem('institutional_briefings', JSON.stringify(existingBriefings));
        
        console.log('✅ [INSTITUTIONAL-DEBUG] Briefing institucional salvo localmente, definindo isSubmitted = true');
        setIsSubmitted(true);
        return;
      }
      
      // Mostrar erro específico para o usuário
      alert(`Erro ao enviar briefing: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // CORREÇÃO DEFINITIVA: Função específica para envio do formulário
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 [INSTITUTIONAL-DEBUG] handleFormSubmit chamado - Step atual:', currentStep);
    
    // CRÍTICO: Só permite envio se estivermos no último step E se for um clique explícito no botão
    if (currentStep === steps.length) {
      console.log('✅ [INSTITUTIONAL-DEBUG] Permitindo envio - estamos no último step');
      handleSubmit(onSubmit)(e);
    } else {
      console.log('🚫 [INSTITUTIONAL-DEBUG] Bloqueando envio - não estamos no último step:', currentStep);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // CORREÇÃO: Função para navegação que NÃO faz envio
  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 [INSTITUTIONAL-DEBUG] handleNextStep chamado - Step atual:', currentStep);
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      console.log('✅ [INSTITUTIONAL-DEBUG] Navegando para step:', currentStep + 1);
    }
  };

  // CORREÇÃO: Função específica para o botão de envio final
  const handleSubmitButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 [INSTITUTIONAL-DEBUG] handleSubmitButtonClick chamado - Step atual:', currentStep);
    
    if (currentStep === steps.length) {
      console.log('✅ [INSTITUTIONAL-DEBUG] Executando envio através do botão');
      // Usar o handleSubmit do react-hook-form diretamente
      handleSubmit(onSubmit)();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-workflow-deep via-purple-900 to-workflow-deep flex items-center justify-center py-8 px-4">
        <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-workflow-deep mb-4">
              🎉 Briefing Institucional Enviado!
            </h1>
            <p className="text-workflow-deep/70 mb-8 text-lg leading-relaxed">
              Recebemos seu briefing para criação do site institucional. Nossa equipe analisará todas as informações e entrará em contato em breve com uma proposta personalizada.
            </p>
            
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-workflow-energy to-purple-600 hover:from-workflow-energy/90 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-workflow-lg hover:shadow-workflow-xl transition-all duration-300 transform hover:scale-105"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-workflow-deep via-purple-900 to-workflow-deep py-4 sm:py-6 md:py-8 lg:py-12 px-2 sm:px-4 lg:px-6">
      <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12 px-2 lg:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Briefing <span className="text-gradient-rainbow">Institucional</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-workflow-zen/80 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-4 leading-relaxed">
            Conte-nos sobre sua empresa e seus objetivos para criarmos um site institucional que represente perfeitamente seu negócio
          </p>
          <div className="mt-3 sm:mt-4 lg:mt-6 inline-block bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 border border-white/20">
            <p className="text-xs sm:text-sm lg:text-base text-white font-medium">
              👨‍💻 Desenvolvedor: Leonardo Lopes
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4 lg:mb-5">
            <span className="text-xs sm:text-sm lg:text-base xl:text-lg text-workflow-zen/80 font-medium">
              Etapa {currentStep} de {steps.length}
            </span>
            <span className="text-xs sm:text-sm lg:text-base xl:text-lg text-workflow-zen/80 font-medium">
              Progresso: {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5 sm:h-2 md:h-2.5 lg:h-3 xl:h-4" />
        </div>

        {/* Steps Navigation */}
        <div className="mb-6 sm:mb-8 px-2 sm:px-4 lg:px-8">
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8 min-w-max justify-center">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                    className={`flex flex-col items-center p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer 
                      min-w-[70px] sm:min-w-[90px] md:min-w-[110px] lg:min-w-[140px] xl:min-w-[160px] flex-shrink-0
                      ${isActive ? 'bg-white/20 text-white scale-105 shadow-lg' : 
                        isCompleted ? 'bg-green-500/20 text-green-300 shadow-md' : 
                        'bg-white/10 text-workflow-zen/60 hover:bg-white/15 hover:scale-102'}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                    <div className={`w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full flex items-center justify-center mb-1 sm:mb-2 lg:mb-3
                      transition-all duration-300
                      ${isActive ? 'bg-workflow-energy shadow-workflow-md' : 
                        isCompleted ? 'bg-green-500 shadow-md' : 
                      'bg-white/20'}`}>
                    {isCompleted ? (
                        <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
                    ) : (
                        <Icon className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
                    )}
                  </div>
                    <span className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-medium text-center leading-tight px-1 lg:px-2">{step.title}</span>
                    <span className="text-[8px] sm:text-xs md:text-sm lg:text-sm opacity-70 text-center leading-tight hidden md:block px-1 lg:px-2 mt-1">{step.description}</span>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl mx-2 sm:mx-0 lg:mx-4 xl:mx-8">
          <form onSubmit={(e) => e.preventDefault()}>
            <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
              
              {/* Step 1: Informações da Empresa */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Building2 className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Informações da Empresa</h2>
                    <p className="text-workflow-deep/70">Conte-nos sobre sua empresa, missão e valores</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome da Empresa *
                      </label>
                      <Input 
                        {...register('companyName')}
                        placeholder="Ex: Minha Empresa Ltda"
                        className={errors.companyName ? 'border-red-500' : ''}
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Segmento de Atuação *
                      </label>
                      <Select onValueChange={(value) => setValue('businessSegment', value)}>
                        <SelectTrigger className={errors.businessSegment ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione o segmento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tecnologia">🖥️ Tecnologia</SelectItem>
                          <SelectItem value="saude">🏥 Saúde</SelectItem>
                          <SelectItem value="educacao">🎓 Educação</SelectItem>
                          <SelectItem value="consultoria">💼 Consultoria</SelectItem>
                          <SelectItem value="advocacia">⚖️ Advocacia</SelectItem>
                          <SelectItem value="arquitetura">🏗️ Arquitetura</SelectItem>
                          <SelectItem value="engenharia">🔧 Engenharia</SelectItem>
                          <SelectItem value="marketing">📱 Marketing</SelectItem>
                          <SelectItem value="financeiro">💰 Financeiro</SelectItem>
                          <SelectItem value="varejo">🛍️ Varejo</SelectItem>
                          <SelectItem value="industria">🏭 Indústria</SelectItem>
                          <SelectItem value="servicos">🔧 Serviços</SelectItem>
                          <SelectItem value="outro">📋 Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.businessSegment && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessSegment.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Descrição da Empresa *
                    </label>
                    <Textarea 
                      {...register('companyDescription')}
                      placeholder="Descreva sua empresa, o que faz, principais atividades..."
                      rows={4}
                      className={errors.companyDescription ? 'border-red-500' : ''}
                    />
                    {errors.companyDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyDescription.message}</p>
                    )}
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                      História da Empresa
                      </label>
                      <Textarea 
                      {...register('companyHistory')}
                      placeholder="Quando foi fundada, principais marcos, evolução..."
                      rows={3}
                      />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Uma boa história fortalece a credibilidade da empresa
                    </p>
                    </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-workflow-energy" />
                        Missão
                      </label>
                      <Textarea 
                        {...register('mission')}
                        placeholder="Qual é a missão da empresa?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-workflow-energy" />
                        Visão
                      </label>
                      <Textarea 
                        {...register('vision')}
                        placeholder="Qual é a visão de futuro?"
                        rows={3}
                      />
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-workflow-energy" />
                        Valores
                      </label>
                      <Textarea
                        {...register('values')}
                        placeholder="Quais são os valores da empresa?"
                        rows={3}
                      />
                    </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Público-Alvo *
                      </label>
                      <Textarea
                        {...register('targetAudience')}
                        placeholder="Quem são seus clientes? Perfil demográfico, necessidades, comportamentos..."
                        rows={3}
                        className={errors.targetAudience ? 'border-red-500' : ''}
                      />
                      {errors.targetAudience && (
                        <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Diferencial Competitivo *
                      </label>
                      <Textarea
                        {...register('competitiveAdvantage')}
                        placeholder="O que diferencia sua empresa da concorrência? Pontos fortes únicos..."
                        rows={3}
                        className={errors.competitiveAdvantage ? 'border-red-500' : ''}
                      />
                      {errors.competitiveAdvantage && (
                        <p className="text-red-500 text-sm mt-1">{errors.competitiveAdvantage.message}</p>
                      )}
                    </div>
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome do Responsável *
                      </label>
                      <Input 
                        {...register('responsibleName')}
                      placeholder="Nome completo do responsável pelo projeto"
                        className={errors.responsibleName ? 'border-red-500' : ''}
                      />
                      {errors.responsibleName && (
                        <p className="text-red-500 text-sm mt-1">{errors.responsibleName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Site Atual (se existir)
                      </label>
                      <Input 
                        {...register('currentWebsite')}
                      placeholder="https://www.seusite.com.br"
                      />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Nos ajuda a entender o que pode ser melhorado
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Objetivos e Estrutura do Site */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Globe className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Objetivos e Estrutura do Site</h2>
                    <p className="text-workflow-deep/70">Defina os objetivos e a estrutura do seu site institucional</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Principal Objetivo do Site *
                    </label>
                      <Select onValueChange={(value) => setValue('websiteGoal', value)}>
                        <SelectTrigger className={errors.websiteGoal ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione o objetivo principal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apresentar-empresa">🏢 Apresentar a empresa</SelectItem>
                          <SelectItem value="gerar-leads">🎯 Gerar leads e contatos</SelectItem>
                          <SelectItem value="vender-online">💰 Vender produtos/serviços online</SelectItem>
                          <SelectItem value="portfolio">🎨 Mostrar portfólio de trabalhos</SelectItem>
                          <SelectItem value="credibilidade">⭐ Aumentar credibilidade</SelectItem>
                          <SelectItem value="informacoes">📚 Fornecer informações</SelectItem>
                          <SelectItem value="suporte">🛠️ Oferecer suporte aos clientes</SelectItem>
                          <SelectItem value="recrutamento">👥 Atrair talentos</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.websiteGoal && (
                        <p className="text-red-500 text-sm mt-1">{errors.websiteGoal.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Tipo de Site *
                          </label>
                      <Select onValueChange={(value) => setValue('websiteType', value)}>
                        <SelectTrigger className={errors.websiteType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione o tipo de site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporativo">🏢 Site Corporativo</SelectItem>
                          <SelectItem value="portfolio">🎨 Portfólio</SelectItem>
                          <SelectItem value="e-commerce">🛒 E-commerce</SelectItem>
                          <SelectItem value="blog">📝 Blog Corporativo</SelectItem>
                          <SelectItem value="catalogo">📋 Catálogo Online</SelectItem>
                          <SelectItem value="institucional">🏛️ Institucional Simples</SelectItem>
                          <SelectItem value="marketplace">🏪 Marketplace</SelectItem>
                          <SelectItem value="portal">🌐 Portal de Conteúdo</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.websiteType && (
                        <p className="text-red-500 text-sm mt-1">{errors.websiteType.message}</p>
                      )}
                        </div>
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Principais Funcionalidades *
                    </label>
                    <Textarea
                      {...register('mainFunctionalities')}
                      placeholder="Ex: Formulário de contato, chat online, área de downloads, sistema de agendamento, calculadora, quiz..."
                      rows={4}
                      className={errors.mainFunctionalities ? 'border-red-500' : ''}
                    />
                    {errors.mainFunctionalities && (
                      <p className="text-red-500 text-sm mt-1">{errors.mainFunctionalities.message}</p>
                    )}
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Funcionalidades especiais podem aumentar muito o engajamento
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Páginas Obrigatórias *
                    </label>
                    <Textarea 
                      {...register('requiredPages')}
                      placeholder="Ex: Home, Sobre Nós, Serviços, Contato, Blog, Portfólio, Equipe, Casos de Sucesso..."
                      rows={3}
                      className={errors.requiredPages ? 'border-red-500' : ''}
                    />
                    {errors.requiredPages && (
                      <p className="text-red-500 text-sm mt-1">{errors.requiredPages.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Estrutura de Navegação
                    </label>
                    <Textarea 
                        {...register('navigationStructure')}
                        placeholder="Como você imagina o menu principal? Submenus? Categorias?"
                      rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Uma navegação clara melhora a experiência do usuário
                      </p>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Hierarquia de Conteúdo
                    </label>
                      <Textarea
                        {...register('contentHierarchy')}
                        placeholder="Qual conteúdo é mais importante? Como organizar as informações?"
                        rows={3}
                          />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Define a prioridade visual das informações
                      </p>
                        </div>
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Serviços/Produtos *
                    </label>
                    <Textarea
                      {...register('servicesProducts')}
                      placeholder="Descreva detalhadamente os serviços ou produtos que oferece, benefícios principais, diferenciais..."
                      rows={4}
                      className={errors.servicesProducts ? 'border-red-500' : ''}
                    />
                    {errors.servicesProducts && (
                      <p className="text-red-500 text-sm mt-1">{errors.servicesProducts.message}</p>
                    )}
                  </div>

                  {/* Seção de Conteúdo Adicional */}
                  <div className="bg-gradient-to-r from-workflow-energy/5 to-purple-500/5 border border-workflow-energy/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-workflow-deep mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-workflow-energy" />
                      Conteúdo Adicional (Opcional)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Informações da Equipe
                    </label>
                        <Textarea
                          {...register('teamInfo')}
                          placeholder="Apresente sua equipe, experiências, especializações..."
                          rows={3}
                        />
                  </div>

                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Certificações e Qualificações
                      </label>
                        <Textarea
                          {...register('certifications')}
                          placeholder="Certificações, qualificações, licenças relevantes..."
                          rows={3}
                        />
                    </div>

                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Prêmios e Reconhecimentos
                      </label>
                        <Textarea
                          {...register('awardsRecognition')}
                          placeholder="Prêmios recebidos, reconhecimentos, menções na mídia..."
                          rows={3}
                        />
                    </div>

                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Casos de Sucesso
                      </label>
                        <Textarea
                          {...register('caseStudies')}
                          placeholder="Projetos de destaque, resultados alcançados, casos de sucesso..."
                          rows={3}
                        />
                    </div>
                  </div>

                    <div className="mt-4">
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Depoimentos de Clientes
                    </label>
                    <Textarea 
                        {...register('testimonials')}
                        placeholder="Depoimentos de clientes satisfeitos, avaliações, recomendações..."
                      rows={3}
                    />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Depoimentos aumentam significativamente a credibilidade
                      </p>
                  </div>
                  </div>
                </div>
              )}

              {/* Step 3: Design e Identidade Visual */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Palette className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Design e Identidade Visual</h2>
                    <p className="text-workflow-deep/70">Defina o visual e a identidade do seu site</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Estilo de Design
                      </label>
                      <Select onValueChange={(value) => setValue('designStyle', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estilo preferido" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moderno">🎨 Moderno e Minimalista</SelectItem>
                          <SelectItem value="classico">🏛️ Clássico e Elegante</SelectItem>
                          <SelectItem value="corporativo">🏢 Corporativo e Profissional</SelectItem>
                          <SelectItem value="criativo">✨ Criativo e Inovador</SelectItem>
                          <SelectItem value="tecnologico">💻 Tecnológico e Futurista</SelectItem>
                          <SelectItem value="luxo">💎 Luxo e Sofisticado</SelectItem>
                          <SelectItem value="jovem">🌟 Jovem e Descontraído</SelectItem>
                          <SelectItem value="tradicional">🏆 Tradicional e Confiável</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Define a personalidade visual do site
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Cores da Marca
                      </label>
                      <Input 
                        {...register('brandColors')}
                        placeholder="Ex: Azul (#0066CC), Branco, Cinza..."
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Cores que representam sua marca
                      </p>
                    </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Sua empresa possui logo? *
                      </label>
                      <Select onValueChange={(value) => setValue('hasLogo', value)}>
                      <SelectTrigger className={errors.hasLogo ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="sim-enviarei">✅ Sim, vou enviar os arquivos</SelectItem>
                        <SelectItem value="sim-nao-tenho-arquivos">📁 Sim, mas não tenho os arquivos digitais</SelectItem>
                        <SelectItem value="nao-preciso-criar">🎨 Não, preciso criar uma logo</SelectItem>
                        <SelectItem value="nao-nao-quero">❌ Não, não quero logo</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.hasLogo && (
                        <p className="text-red-500 text-sm mt-1">{errors.hasLogo.message}</p>
                      )}
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Upload de Logo
                    </label>
                    <FileUpload
                      id="logo-upload"
                      accept="image/*,.svg"
                      multiple
                      onChange={(files) => setValue('logoFiles', files)}
                      label="Arquivos de Logo"
                      description="PNG, JPG, SVG - Preferencialmente em alta resolução"
                    />
                    <p className="text-sm text-workflow-deep/60 mt-2">
                      💡 <strong>Dica:</strong> Envie arquivos em diferentes formatos se tiver (PNG, SVG, etc.)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Referências Visuais
                    </label>
                    <Textarea
                      {...register('visualReferences')}
                      placeholder="Descreva sites que você gosta, estilos de referência, cores que chamam atenção..."
                      rows={3}
                    />
                    
                    <FileUpload
                      id="visual-references-upload"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(files) => setValue('visualFiles', files)}
                      label="Upload de Referências Visuais"
                      description="PNG, JPG, PDF - Screenshots de sites/designs que você gosta"
                      className="mt-4"
                    />
                    <p className="text-sm text-workflow-deep/60 mt-2">
                      💡 Referências visuais nos ajudam a entender seu gosto e expectativas
                    </p>
                  </div>

                  {/* Seção de Marketing e Comunicação */}
                  <div className="bg-gradient-to-r from-workflow-energy/5 to-purple-500/5 border border-workflow-energy/20 rounded-2xl p-6 mt-6">
                    <h3 className="text-lg font-semibold text-workflow-deep mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-workflow-energy" />
                      Marketing e Comunicação
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Principais Concorrentes
                        </label>
                        <Textarea
                          {...register('mainCompetitors')}
                          placeholder="Liste seus principais concorrentes e sites..."
                          rows={3}
                        />
                        <p className="text-sm text-workflow-deep/60 mt-1">
                          💡 Nos ajuda a entender o mercado e se diferenciar
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Principais Dores do Cliente
                        </label>
                        <Textarea
                          {...register('customerPainPoints')}
                          placeholder="Quais problemas seus clientes enfrentam?"
                          rows={3}
                        />
                        <p className="text-sm text-workflow-deep/60 mt-1">
                          💡 Essencial para criar mensagens que conectam
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Principais Objeções dos Clientes
                        </label>
                        <Textarea
                          {...register('customerObjections')}
                          placeholder="Quais objeções os clientes costumam ter?"
                          rows={3}
                        />
                        <p className="text-sm text-workflow-deep/60 mt-1">
                          💡 Permite responder dúvidas antes mesmo delas surgirem
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Tom de Comunicação
                        </label>
                        <Select onValueChange={(value) => setValue('communicationTone', value)}>
                      <SelectTrigger>
                            <SelectValue placeholder="Selecione o tom de comunicação" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="formal">🎩 Formal e Profissional</SelectItem>
                            <SelectItem value="informal">😊 Informal e Próximo</SelectItem>
                            <SelectItem value="amigavel">🤝 Amigável e Acolhedor</SelectItem>
                            <SelectItem value="tecnico">🔧 Técnico e Especializado</SelectItem>
                            <SelectItem value="inspirador">✨ Inspirador e Motivacional</SelectItem>
                            <SelectItem value="confiavel">🛡️ Confiável e Seguro</SelectItem>
                      </SelectContent>
                    </Select>
                        <p className="text-sm text-workflow-deep/60 mt-1">
                          💡 Define como os textos serão escritos
                        </p>
                      </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Mensagens-Chave
                    </label>
                    <Textarea 
                        {...register('keyMessages')}
                        placeholder="Quais são as 3 mensagens mais importantes que você quer transmitir? O que não pode faltar no site?"
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Essas mensagens serão destacadas estrategicamente
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Requisitos Específicos
                      </label>
                      <Textarea
                        {...register('specificRequirements')}
                        placeholder="Alguma funcionalidade específica que você precisa? (calculadora, quiz, chat, área restrita, etc.)"
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Funcionalidades especiais podem aumentar muito o engajamento
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Materiais Próprios para o Site
                      </label>
                      <Textarea
                        {...register('contentMaterials')}
                        placeholder="Descreva os materiais que você tem e gostaria de incluir no site (fotos da empresa, textos, vídeos, certificados, etc.)"
                        rows={3}
                    />
                      
                      <FileUpload
                        id="materials-upload"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        multiple
                        onChange={(files) => setValue('materialFiles', files)}
                        label="Upload dos Seus Materiais"
                        description="Imagens (PNG, JPG, WEBP), Vídeos (MP4, MOV), Documentos (PDF, DOC) - Máximo 50MB por arquivo"
                        className="mt-4"
                      />
                      <p className="text-sm text-workflow-deep/60 mt-2">
                        💡 <strong>Dica:</strong> Quanto mais materiais de qualidade você fornecer, mais personalizado será seu site!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Funcionalidades Técnicas */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Settings className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Funcionalidades Técnicas</h2>
                    <p className="text-workflow-deep/70">Configure as funcionalidades técnicas do seu site</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Formulários de Contato
                      </label>
                      <Textarea
                        {...register('contactForms')}
                        placeholder="Quais formulários precisa? Contato, orçamento, newsletter..."
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Formulários são essenciais para capturar leads
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Integrações Necessárias
                      </label>
                      <Textarea
                        {...register('integrations')}
                        placeholder="Ex: Google Analytics, Facebook Pixel, CRM, sistemas internos..."
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Integrações conectam seu site com outras ferramentas
                      </p>
                    </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Requisitos de SEO
                      </label>
                      <Textarea
                        {...register('seoRequirements')}
                        placeholder="Palavras-chave importantes, objetivos de SEO..."
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 SEO ajuda seu site a ser encontrado no Google
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Ferramentas de Analytics
                      </label>
                      <Input
                        {...register('analytics')}
                        placeholder="Google Analytics, Tag Manager, outras ferramentas..."
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Para acompanhar o desempenho do site
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-workflow-energy/5 to-purple-500/5 border border-workflow-energy/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-workflow-deep mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-workflow-energy" />
                      Domínio e Hospedagem
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Informações sobre Domínio *
                    </label>
                    <Textarea 
                          {...register('desiredDomain')}
                          placeholder="Já tem domínio? Quer registrar? Qual nome prefere?"
                      rows={3}
                          className={errors.desiredDomain ? 'border-red-500' : ''}
                        />
                        {errors.desiredDomain && (
                          <p className="text-red-500 text-sm mt-1">{errors.desiredDomain.message}</p>
                        )}
                        <p className="text-sm text-workflow-deep/60 mt-1">
                          💡 O domínio é o endereço do seu site na internet
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-workflow-deep mb-2">
                          Preferências de Hospedagem
                        </label>
                        <Textarea
                          {...register('hostingPreferences')}
                          placeholder="Já tem hospedagem? Prefere alguma empresa específica?"
                          rows={3}
                        />
                        <p className="text-sm text-workflow-deep/60 mt-1">
                          💡 Podemos ajudar a escolher a melhor hospedagem
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Timeline e Orçamento */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Calendar className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Timeline e Orçamento</h2>
                    <p className="text-workflow-deep/70">Defina prazos e expectativas do projeto</p>
                  </div>

                  <div className="bg-gradient-to-r from-workflow-energy/10 to-purple-500/10 border border-workflow-energy/20 rounded-2xl p-4 md:p-6 mb-6">
                    <h3 className="font-semibold text-workflow-deep mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-workflow-energy" />
                      Informação Importante:
                    </h3>
                    <p className="text-workflow-deep/80 text-sm">
                      O prazo de entrega e orçamento serão definidos conforme acordado na Workana, 
                      baseado na complexidade e escopo do projeto apresentado neste briefing.
                    </p>
                  </div>

                  <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Observações Adicionais
                    </label>
                    <Textarea 
                      {...register('additionalNotes')}
                        placeholder="Alguma informação adicional importante para o projeto? Expectativas especiais, preocupações, ideias..."
                      rows={4}
                        className="resize-none"
                    />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Qualquer detalhe adicional que possa nos ajudar a criar o site perfeito para você
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-workflow-energy/5 to-purple-500/5 border border-workflow-energy/20 rounded-2xl p-4 md:p-6">
                      <h3 className="font-semibold text-workflow-deep mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-workflow-energy" />
                        Resumo do Projeto
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-workflow-energy rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-workflow-deep">Tipo de Site:</span>
                          <span className="text-workflow-deep/80">Site Institucional</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-workflow-energy rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-workflow-deep">Prazo:</span>
                          <span className="text-workflow-deep/80">Conforme acordado na Workana</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-workflow-energy rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-workflow-deep">Orçamento:</span>
                          <span className="text-workflow-deep/80">Conforme acordado na Workana</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-workflow-energy rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-workflow-deep">Entrega:</span>
                          <span className="text-workflow-deep/80">Site completo e funcional</span>
                        </div>
                      </div>
                    </div>

                    {/* Aviso importante sobre o envio */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-6">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Send className="w-5 h-5 text-blue-600" />
                        Pronto para Enviar?
                      </h3>
                      <p className="text-blue-800 text-sm mb-4">
                        Revise todas as informações preenchidas antes de enviar o briefing. 
                        Após o envio, entraremos em contato para alinhar os próximos passos do projeto.
                      </p>
                      <p className="text-blue-700 text-xs">
                        ⚠️ Clique no botão "Enviar Briefing" abaixo para finalizar o processo.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 sm:pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center gap-2 border-workflow-energy/30 text-workflow-deep hover:bg-workflow-energy/10 w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-workflow-energy to-purple-600 hover:from-workflow-energy/90 hover:to-purple-700 text-white shadow-workflow-lg hover:shadow-workflow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmitButtonClick}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-workflow-lg hover:shadow-workflow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Briefing
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default InstitutionalBrief; 