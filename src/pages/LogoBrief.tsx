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
import { CheckCircle, ArrowLeft, ArrowRight, Sparkles, Palette, Image, Layers, Calendar, Send, Building2, Target, Eye, Heart, Zap } from 'lucide-react';
import { FileUpload } from '@/components/ui/FileUpload';

// Schema de validação para briefing de logo - TODAS AS VALIDAÇÕES OBRIGATÓRIAS REMOVIDAS
const logoBriefSchema = z.object({
  // Informações da Empresa
  companyName: z.string().optional(),
  businessSegment: z.string().optional(),
  companyDescription: z.string().optional(),
  companyValues: z.string().optional(),
  targetAudience: z.string().optional(),
  brandPersonality: z.string().optional(),
  
  // Informações de Contato
  responsibleName: z.string().optional(),
  currentLogo: z.string().optional(),
  
  // Conceito e Estilo da Logo
  logoStyle: z.string().optional(),
  logoType: z.string().optional(),
  logoMood: z.string().optional(),
  messagesToConvey: z.string().optional(),
  competitorLogos: z.string().optional(),
  whatToAvoid: z.string().optional(),
  
  // Elementos Visuais
  preferredColors: z.string().optional(),
  colorsToAvoid: z.string().optional(),
  symbolsElements: z.string().optional(),
  typographyPreference: z.string().optional(),
  visualReferences: z.string().optional(),
  visualFiles: z.any().optional(),
  
  // Aplicações e Formatos
  logoApplications: z.string().optional(),
  requiredFormats: z.string().optional(),
  logoVersions: z.string().optional(),
  specificRequirements: z.string().optional(),
  
  // Timeline
  deliveryDeadline: z.string().optional(),
  budget: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type LogoBriefForm = z.infer<typeof logoBriefSchema>;

const steps = [
  { id: 1, title: 'Empresa', description: 'Sobre sua empresa', icon: Building2 },
  { id: 2, title: 'Conceito', description: 'Estilo e identidade', icon: Sparkles },
  { id: 3, title: 'Visual', description: 'Cores e elementos', icon: Palette },
  { id: 4, title: 'Aplicações', description: 'Uso e formatos', icon: Layers },
  { id: 5, title: 'Timeline', description: 'Prazos e detalhes', icon: Calendar },
];

const LogoBrief = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>(['colorida', 'pb']); // Versões padrão selecionadas

  const form = useForm<LogoBriefForm>({
    resolver: zodResolver(logoBriefSchema),
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  
  // Função para alternar versões selecionadas
  const toggleVersion = (version: string) => {
    setSelectedVersions(prev => {
      const updated = prev.includes(version)
        ? prev.filter(v => v !== version)
        : [...prev, version];
      
      // Atualizar o campo do formulário com as versões selecionadas
      const versionLabels = updated.map(v => {
        const labels: Record<string, string> = {
          'colorida': '🎨 Versão Colorida (principal)',
          'pb': '⚫⚪ Versão Preto e Branco',
          'negativa': '🔳 Versão Negativa (para fundos escuros)',
          'horizontal': '↔️ Versão Horizontal',
          'vertical': '↕️ Versão Vertical',
          'simbolo': '🎯 Apenas Símbolo (sem texto)'
        };
        return labels[v] || v;
      });
      
      const versionsText = versionLabels.join(', ');
      setValue('logoVersions', versionsText, { shouldValidate: true });
      
      return updated;
    });
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = async (data: LogoBriefForm) => {
    console.log('🔍 [LOGO-DEBUG] onSubmit chamado - Step atual:', currentStep);
    
    // Só permite envio se estivermos no último step
    if (currentStep !== steps.length) {
      console.log('🚫 [LOGO-DEBUG] Tentativa de envio em step incorreto:', currentStep);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🔍 [LOGO-DEBUG] Dados do formulário:', data);
      console.log('🔍 [LOGO-DEBUG] Prazo fixo: Valor Acordado na Workana');
      
      // Definir prazo fixo
      data.deliveryDeadline = 'Valor Acordado na Workana';
      data.budget = 'Valor Acordado na Workana';
      
      console.log('✅ [LOGO-DEBUG] Prosseguindo sem validações obrigatórias');
      
      // Tentar enviar para o Supabase
      console.log('🚀 [LOGO-DEBUG] Importando submitLogoBriefing...');
      const { submitLogoBriefing } = await import('@/services/briefingService');
      
      console.log('🚀 [LOGO-DEBUG] Chamando submitLogoBriefing com dados:', {
        companyName: data.companyName,
        responsibleName: data.responsibleName,
        deliveryDeadline: data.deliveryDeadline,
        totalFields: Object.keys(data).length
      });
      
      const savedBriefing = await submitLogoBriefing(data);
      console.log('✅ [LOGO-DEBUG] submitLogoBriefing retornou:', savedBriefing);
      
      console.log('✅ [LOGO-DEBUG] Briefing de logo salvo com sucesso! Definindo isSubmitted = true');
      setIsSubmitted(true);
      return;
      
    } catch (error) {
      console.error('❌ [LOGO-DEBUG] Erro capturado no onSubmit:', error);
      console.error('❌ [LOGO-DEBUG] Tipo do erro:', typeof error);
      console.error('❌ [LOGO-DEBUG] Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      
      // Se deu erro no Supabase, usar fallback local
      if (error instanceof Error && (
        error.message.includes('Supabase') || 
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('database')
      )) {
        console.log('💾 [LOGO-DEBUG] Erro do Supabase detectado, salvando localmente como fallback...');
        const briefingData = {
          ...data,
          id: `logo_local_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        
        // Salvar no localStorage
        const existingBriefings = JSON.parse(localStorage.getItem('logo_briefings') || '[]');
        existingBriefings.push(briefingData);
        localStorage.setItem('logo_briefings', JSON.stringify(existingBriefings));
        
        console.log('✅ [LOGO-DEBUG] Briefing de logo salvo localmente, definindo isSubmitted = true');
        setIsSubmitted(true);
        return;
      }
      
      // Mostrar erro específico para o usuário
      alert(`Erro ao enviar briefing de logo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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

  // Função específica para navegação que NÃO faz envio
  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 [LOGO-DEBUG] handleNextStep chamado - Step atual:', currentStep);
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      console.log('✅ [LOGO-DEBUG] Navegando para step:', currentStep + 1);
    }
  };

  // Função específica para o botão de envio final
  const handleSubmitButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 [LOGO-DEBUG] handleSubmitButtonClick chamado - Step atual:', currentStep);
    
    if (currentStep === steps.length) {
      console.log('✅ [LOGO-DEBUG] Executando envio através do botão');
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
              🎨 Briefing de Logo Enviado com Sucesso!
            </h1>
            <p className="text-workflow-deep/70 mb-8 text-lg leading-relaxed">
              Recebemos seu briefing para criação da logo. Nossa equipe de designers analisará todas as informações e entrará em contato em breve com propostas criativas personalizadas para sua marca.
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
            Briefing <span className="text-gradient-rainbow">Criação de Logo</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-workflow-zen/80 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-4 leading-relaxed">
            Vamos coletar todas as informações necessárias para criar uma logo profissional e memorável para sua marca
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
                    <p className="text-workflow-deep/70">Conte-nos sobre sua empresa e marca</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome da Empresa/Marca *
                      </label>
                      <Input 
                        {...register('companyName')}
                        placeholder="Ex: Minha Empresa"
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
                          <SelectItem value="tecnologia">💻 Tecnologia</SelectItem>
                          <SelectItem value="saude">🏥 Saúde e Bem-estar</SelectItem>
                          <SelectItem value="educacao">🎓 Educação</SelectItem>
                          <SelectItem value="alimentacao">🍔 Alimentação</SelectItem>
                          <SelectItem value="moda">👗 Moda e Beleza</SelectItem>
                          <SelectItem value="consultoria">💼 Consultoria</SelectItem>
                          <SelectItem value="advocacia">⚖️ Advocacia</SelectItem>
                          <SelectItem value="arquitetura">🏗️ Arquitetura</SelectItem>
                          <SelectItem value="engenharia">🔧 Engenharia</SelectItem>
                          <SelectItem value="marketing">📱 Marketing</SelectItem>
                          <SelectItem value="financeiro">💰 Financeiro</SelectItem>
                          <SelectItem value="varejo">🛍️ Varejo</SelectItem>
                          <SelectItem value="servicos">🔧 Serviços</SelectItem>
                          <SelectItem value="esportes">⚽ Esportes</SelectItem>
                          <SelectItem value="entretenimento">🎬 Entretenimento</SelectItem>
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
                      placeholder="Descreva sua empresa, o que faz, principais atividades, missão..."
                      rows={4}
                      className={errors.companyDescription ? 'border-red-500' : ''}
                    />
                    {errors.companyDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyDescription.message}</p>
                    )}
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Essas informações nos ajudam a entender a essência da sua marca
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-workflow-energy" />
                        Valores da Marca
                      </label>
                      <Textarea 
                        {...register('companyValues')}
                        placeholder="Quais valores sua empresa representa?"
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Ex: Inovação, Qualidade, Confiança
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-workflow-energy" />
                        Público-Alvo
                      </label>
                      <Textarea 
                        {...register('targetAudience')}
                        placeholder="Para quem é seu produto/serviço?"
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Idade, perfil, interesses
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-workflow-energy" />
                        Personalidade da Marca
                      </label>
                      <Textarea 
                        {...register('brandPersonality')}
                        placeholder="Como sua marca deve ser percebida?"
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Ex: Moderna, Séria, Divertida
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome do Responsável *
                      </label>
                      <Input 
                        {...register('responsibleName')}
                        placeholder="Seu nome completo"
                        className={errors.responsibleName ? 'border-red-500' : ''}
                      />
                      {errors.responsibleName && (
                        <p className="text-red-500 text-sm mt-1">{errors.responsibleName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Situação Atual da Logo
                      </label>
                      <Select onValueChange={(value) => setValue('currentLogo', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nao-tem">🆕 Não tenho logo, é nova</SelectItem>
                          <SelectItem value="redesign">🔄 Tenho logo, quero redesign</SelectItem>
                          <SelectItem value="modernizar">✨ Tenho logo, quero modernizar</SelectItem>
                          <SelectItem value="simplificar">🎯 Tenho logo, quero simplificar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Conceito e Estilo */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Sparkles className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Conceito e Estilo</h2>
                    <p className="text-workflow-deep/70">Defina a identidade visual da sua logo</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Estilo de Logo Preferido *
                      </label>
                      <Select onValueChange={(value) => setValue('logoStyle', value)}>
                        <SelectTrigger className={errors.logoStyle ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione o estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimalista">🎯 Minimalista e Limpa</SelectItem>
                          <SelectItem value="moderna">✨ Moderna e Inovadora</SelectItem>
                          <SelectItem value="classica">🏛️ Clássica e Elegante</SelectItem>
                          <SelectItem value="arrojada">🚀 Arrojada e Ousada</SelectItem>
                          <SelectItem value="divertida">🎨 Divertida e Criativa</SelectItem>
                          <SelectItem value="corporativa">🏢 Corporativa e Profissional</SelectItem>
                          <SelectItem value="luxo">💎 Luxo e Sofisticação</SelectItem>
                          <SelectItem value="artesanal">✋ Artesanal e Humanizada</SelectItem>
                          <SelectItem value="tecnologica">💻 Tecnológica e Futurista</SelectItem>
                          <SelectItem value="organica">🌿 Orgânica e Natural</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.logoStyle && (
                        <p className="text-red-500 text-sm mt-1">{errors.logoStyle.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Tipo de Logo *
                      </label>
                      <Select onValueChange={(value) => setValue('logoType', value)}>
                        <SelectTrigger className={errors.logoType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="logotipo">📝 Logotipo (apenas texto/nome)</SelectItem>
                          <SelectItem value="simbolo">🎨 Símbolo/Ícone (apenas imagem)</SelectItem>
                          <SelectItem value="combinado">🔗 Combinado (texto + símbolo)</SelectItem>
                          <SelectItem value="emblema">🛡️ Emblema (texto dentro de forma)</SelectItem>
                          <SelectItem value="mascote">🦁 Mascote</SelectItem>
                          <SelectItem value="abstrato">🌀 Abstrato/Geométrico</SelectItem>
                          <SelectItem value="nao-sei">❓ Não tenho certeza, preciso de ajuda</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.logoType && (
                        <p className="text-red-500 text-sm mt-1">{errors.logoType.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Mood/Sensação que a Logo Deve Transmitir *
                    </label>
                    <Select onValueChange={(value) => setValue('logoMood', value)}>
                      <SelectTrigger className={errors.logoMood ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione a sensação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confiavel">🛡️ Confiável e Segura</SelectItem>
                        <SelectItem value="inovadora">💡 Inovadora e Criativa</SelectItem>
                        <SelectItem value="energetica">⚡ Energética e Dinâmica</SelectItem>
                        <SelectItem value="sofisticada">💎 Sofisticada e Elegante</SelectItem>
                        <SelectItem value="amigavel">😊 Amigável e Acessível</SelectItem>
                        <SelectItem value="poderosa">💪 Poderosa e Forte</SelectItem>
                        <SelectItem value="sustentavel">🌱 Sustentável e Eco-friendly</SelectItem>
                        <SelectItem value="divertida">🎉 Divertida e Jovem</SelectItem>
                        <SelectItem value="seria">🎩 Séria e Profissional</SelectItem>
                        <SelectItem value="exclusiva">👑 Exclusiva e Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.logoMood && (
                      <p className="text-red-500 text-sm mt-1">{errors.logoMood.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Mensagens-Chave que a Logo Deve Transmitir *
                    </label>
                    <Textarea 
                      {...register('messagesToConvey')}
                      placeholder="Quais mensagens ou conceitos a logo deve comunicar visualmente? Ex: Velocidade, Qualidade, Inovação, Tradição..."
                      rows={4}
                      className={errors.messagesToConvey ? 'border-red-500' : ''}
                    />
                    {errors.messagesToConvey && (
                      <p className="text-red-500 text-sm mt-1">{errors.messagesToConvey.message}</p>
                    )}
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Seja específico sobre os valores e conceitos que quer transmitir
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Logos de Concorrentes ou Referência
                      </label>
                      <Textarea 
                        {...register('competitorLogos')}
                        placeholder="Liste empresas do seu setor que você admira (ou não) as logos..."
                        rows={4}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Nos ajuda a entender o mercado e criar algo único
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        O que Evitar/Não Fazer
                      </label>
                      <Textarea 
                        {...register('whatToAvoid')}
                        placeholder="Existe algum estilo, cor, símbolo ou abordagem que você NÃO quer na logo?"
                        rows={4}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Importante: nos diga o que definitivamente não funciona para você
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Elementos Visuais */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Palette className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Elementos Visuais</h2>
                    <p className="text-workflow-deep/70">Cores, símbolos e tipografia</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Cores Preferidas *
                      </label>
                      <Textarea 
                        {...register('preferredColors')}
                        placeholder="Quais cores você gosta? Ex: Azul, Verde, Preto e Branco... (Pode indicar códigos HEX se tiver: #0066CC)"
                        rows={3}
                        className={errors.preferredColors ? 'border-red-500' : ''}
                      />
                      {errors.preferredColors && (
                        <p className="text-red-500 text-sm mt-1">{errors.preferredColors.message}</p>
                      )}
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 A psicologia das cores é fundamental para a identidade da marca
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Cores a Evitar
                      </label>
                      <Textarea 
                        {...register('colorsToAvoid')}
                        placeholder="Existem cores que você definitivamente NÃO quer usar?"
                        rows={3}
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 Importante para não seguir direções que você não gosta
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Símbolos ou Elementos Visuais
                    </label>
                    <Textarea 
                      {...register('symbolsElements')}
                      placeholder="Existe algum símbolo, ícone, forma ou elemento que você gostaria de incluir? Ex: Leão, Montanha, Folha, Engrenagem, Estrela..."
                      rows={4}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Elementos específicos ajudam a criar uma logo mais representativa
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Preferência de Tipografia (se aplicável)
                    </label>
                    <Select onValueChange={(value) => setValue('typographyPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estilo de fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">📰 Serif (Tradicional, Elegante)</SelectItem>
                        <SelectItem value="sans-serif">✨ Sans-serif (Moderna, Limpa)</SelectItem>
                        <SelectItem value="script">✍️ Script (Manuscrita, Elegante)</SelectItem>
                        <SelectItem value="display">🎨 Display (Decorativa, Única)</SelectItem>
                        <SelectItem value="geometrica">📐 Geométrica (Precisa, Técnica)</SelectItem>
                        <SelectItem value="arredondada">⭕ Arredondada (Amigável, Suave)</SelectItem>
                        <SelectItem value="bold">💪 Bold (Forte, Impactante)</SelectItem>
                        <SelectItem value="light">🌟 Light (Delicada, Sofisticada)</SelectItem>
                        <SelectItem value="nao-sei">❓ Não tenho certeza, preciso de orientação</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 A tipografia influencia muito a percepção da marca
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Referências Visuais (URLs ou Descrição)
                    </label>
                    <Textarea 
                      {...register('visualReferences')}
                      placeholder="Cole links de logos, sites, imagens ou descreva estilos visuais que você gosta como referência..."
                      rows={4}
                    />
                    
                    <FileUpload
                      id="visual-references-upload"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(files) => setValue('visualFiles', files)}
                      label="Upload de Referências Visuais"
                      description="PNG, JPG, PDF - Logos de referência, moodboards, paletas de cores..."
                      className="mt-4"
                    />
                    <p className="text-sm text-workflow-deep/60 mt-2">
                      💡 <strong>Importante:</strong> Referências visuais são extremamente úteis para alinhar expectativas!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-workflow-energy/5 to-purple-500/5 border border-workflow-energy/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-workflow-deep mb-2 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-workflow-energy" />
                      💡 Dica Profissional
                    </h3>
                    <p className="text-sm text-workflow-deep/80 leading-relaxed">
                      Quanto mais referências visuais você fornecer (logos que admira, cores específicas, estilos), 
                      mais preciso será o resultado. Não se preocupe em ser técnico - descreva com suas próprias 
                      palavras o que você gosta ou não gosta!
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Aplicações e Formatos */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Layers className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Aplicações e Formatos</h2>
                    <p className="text-workflow-deep/70">Onde e como a logo será usada</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Onde a Logo Será Utilizada? *
                    </label>
                    <Textarea 
                      {...register('logoApplications')}
                      placeholder="Ex: Site, Redes sociais, Cartões de visita, Fachada, Uniformes, Embalagens, Veículos, Material gráfico..."
                      rows={4}
                      className={errors.logoApplications ? 'border-red-500' : ''}
                    />
                    {errors.logoApplications && (
                      <p className="text-red-500 text-sm mt-1">{errors.logoApplications.message}</p>
                    )}
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Isso define a versatilidade necessária da logo
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Formatos Necessários
                    </label>
                    <Textarea 
                      {...register('requiredFormats')}
                      placeholder="Tem alguma necessidade específica de formato? Ex: Vetorizado (AI, EPS, SVG), Alta resolução (PNG, JPG), Favicon..."
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Por padrão, fornecemos todos os formatos profissionais necessários
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Versões da Logo Necessárias
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-workflow-energy/5 rounded-lg border border-workflow-energy/10 cursor-pointer hover:bg-workflow-energy/10 transition-colors"
                        onClick={() => toggleVersion('colorida')}>
                        <input 
                          type="checkbox" 
                          id="versao-colorida" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={selectedVersions.includes('colorida')}
                          onChange={() => {}} 
                        />
                        <label htmlFor="versao-colorida" className="text-sm font-medium text-workflow-deep cursor-pointer flex-1">
                          🎨 Versão Colorida (principal)
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-workflow-energy/5 rounded-lg border border-workflow-energy/10 cursor-pointer hover:bg-workflow-energy/10 transition-colors"
                        onClick={() => toggleVersion('pb')}>
                        <input 
                          type="checkbox" 
                          id="versao-pb" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={selectedVersions.includes('pb')}
                          onChange={() => {}} 
                        />
                        <label htmlFor="versao-pb" className="text-sm font-medium text-workflow-deep cursor-pointer flex-1">
                          ⚫⚪ Versão Preto e Branco
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-workflow-energy/5 rounded-lg border border-workflow-energy/10 cursor-pointer hover:bg-workflow-energy/10 transition-colors"
                        onClick={() => toggleVersion('negativa')}>
                        <input 
                          type="checkbox" 
                          id="versao-negativa" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={selectedVersions.includes('negativa')}
                          onChange={() => {}} 
                        />
                        <label htmlFor="versao-negativa" className="text-sm font-medium text-workflow-deep cursor-pointer flex-1">
                          🔳 Versão Negativa (para fundos escuros)
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-workflow-energy/5 rounded-lg border border-workflow-energy/10 cursor-pointer hover:bg-workflow-energy/10 transition-colors"
                        onClick={() => toggleVersion('horizontal')}>
                        <input 
                          type="checkbox" 
                          id="versao-horizontal" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={selectedVersions.includes('horizontal')}
                          onChange={() => {}} 
                        />
                        <label htmlFor="versao-horizontal" className="text-sm font-medium text-workflow-deep cursor-pointer flex-1">
                          ↔️ Versão Horizontal
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-workflow-energy/5 rounded-lg border border-workflow-energy/10 cursor-pointer hover:bg-workflow-energy/10 transition-colors"
                        onClick={() => toggleVersion('vertical')}>
                        <input 
                          type="checkbox" 
                          id="versao-vertical" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={selectedVersions.includes('vertical')}
                          onChange={() => {}} 
                        />
                        <label htmlFor="versao-vertical" className="text-sm font-medium text-workflow-deep cursor-pointer flex-1">
                          ↕️ Versão Vertical
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-workflow-energy/5 rounded-lg border border-workflow-energy/10 cursor-pointer hover:bg-workflow-energy/10 transition-colors"
                        onClick={() => toggleVersion('simbolo')}>
                        <input 
                          type="checkbox" 
                          id="versao-simbolo" 
                          className="w-4 h-4 cursor-pointer" 
                          checked={selectedVersions.includes('simbolo')}
                          onChange={() => {}} 
                        />
                        <label htmlFor="versao-simbolo" className="text-sm font-medium text-workflow-deep cursor-pointer flex-1">
                          🎯 Apenas Símbolo (sem texto)
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-workflow-deep/60 mt-2">
                      💡 Selecione as versões que você precisa - versões adicionais podem ser discutidas posteriormente
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Requisitos ou Restrições Específicas
                    </label>
                    <Textarea 
                      {...register('specificRequirements')}
                      placeholder="Existe alguma restrição técnica, legal ou criativa? Ex: Precisa funcionar em tamanho muito pequeno, não pode usar certas cores por regulamentação, precisa incluir tagline..."
                      rows={4}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Quanto mais informações, melhor o resultado final
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Timeline e Detalhes Finais */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Calendar className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Timeline e Detalhes Finais</h2>
                    <p className="text-workflow-deep/70">Últimas informações do projeto</p>
                  </div>

                  <div className="bg-gradient-to-r from-workflow-energy/10 to-purple-500/10 border border-workflow-energy/20 rounded-2xl p-6 mb-6">
                    <h3 className="font-semibold text-workflow-deep mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-workflow-energy" />
                      Informação Importante
                    </h3>
                    <p className="text-workflow-deep/80 text-sm">
                      O prazo de entrega e orçamento da criação da logo serão definidos conforme acordado na Workana, 
                      baseado na complexidade e quantidade de versões solicitadas neste briefing.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Observações Adicionais
                    </label>
                    <Textarea 
                      {...register('additionalNotes')}
                      placeholder="Alguma informação adicional importante? Inspirações extras, histórias sobre a marca, detalhes específicos que não foram mencionados..."
                      rows={5}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Qualquer detalhe adicional que possa nos ajudar a criar a logo perfeita
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-workflow-energy/5 to-purple-500/5 border border-workflow-energy/20 rounded-2xl p-6">
                    <h3 className="font-semibold text-workflow-deep mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-workflow-energy" />
                      Processo de Criação
                    </h3>
                    <div className="space-y-3 text-sm text-workflow-deep/80">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">1</div>
                        <div>
                          <strong className="text-workflow-deep">Análise do Briefing</strong>
                          <p className="text-xs mt-1">Estudaremos profundamente todas as informações fornecidas</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
                        <div>
                          <strong className="text-workflow-deep">Pesquisa e Conceito</strong>
                          <p className="text-xs mt-1">Pesquisa de mercado e desenvolvimento de conceitos criativos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
                        <div>
                          <strong className="text-workflow-deep">Apresentação de Propostas</strong>
                          <p className="text-xs mt-1">Apresentaremos diferentes propostas criativas para sua avaliação</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">4</div>
                        <div>
                          <strong className="text-workflow-deep">Refinamento</strong>
                          <p className="text-xs mt-1">Ajustes e refinamentos baseados no seu feedback</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">5</div>
                        <div>
                          <strong className="text-workflow-deep">Entrega Final</strong>
                          <p className="text-xs mt-1">Logo finalizada em todos os formatos + Manual da Marca</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Send className="w-5 h-5 text-blue-600" />
                      Pronto para Começar?
                    </h3>
                    <p className="text-blue-800 text-sm mb-4">
                      Revise todas as informações preenchidas antes de enviar o briefing. 
                      Após o envio, nossa equipe de design entrará em contato para alinhar os próximos passos 
                      e iniciar a criação da sua logo profissional.
                    </p>
                    <p className="text-blue-700 text-xs font-medium">
                      ⚠️ Clique no botão "Enviar Briefing" abaixo para finalizar o processo.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 sm:pt-8 border-t border-gray-200 mt-8">
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

export default LogoBrief;

