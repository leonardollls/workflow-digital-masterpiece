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
import { CheckCircle, ArrowLeft, ArrowRight, Sparkles, Target, Palette, Settings, Calendar, Send, Upload } from 'lucide-react';
import { FileUpload } from '@/components/ui/FileUpload';
import type { ClientBriefForm } from '@/services/briefingService';

// Schema de validação - TODAS AS VALIDAÇÕES OBRIGATÓRIAS REMOVIDAS
const clientBriefSchema = z.object({
  // Informações da Empresa
  companyName: z.string().optional(),
  businessSegment: z.string().optional(),
  businessDescription: z.string().optional(),
  targetAudience: z.string().optional(),
  competitiveDifferential: z.string().optional(),
  landingPageGoal: z.string().optional(),
  
  // Novos campos para agregar valor
  mainCompetitors: z.string().optional(),
  customerPainPoints: z.string().optional(),
  successStories: z.string().optional(),
  socialProof: z.string().optional(),

  // Informações de Contato
  responsibleName: z.string().optional(),
  currentWebsite: z.string().optional(),

  // Produto/Serviço
  productName: z.string().optional(),
  productDescription: z.string().optional(),
  mainBenefits: z.string().optional(),

  guarantees: z.string().optional(),
  
  // Novos campos para produto/serviço
  targetResults: z.string().optional(),
  urgencyFactors: z.string().optional(),
  objections: z.string().optional(),

  // Marketing
  callToAction: z.string().optional(),
  leadDestination: z.string().optional(),
  
  // NOVO CAMPO SOLICITADO - Seções da Landing Page
  landingPageSections: z.string().optional(),
  
  // Novos campos importantes para estrutura da página
  specificRequirements: z.string().optional(),
  
  // Novos campos para ofertas e preços
  numberOfOffers: z.string().optional(),
  offerDetails: z.string().optional(),
  pricingModel: z.string().optional(),
  
  brandColors: z.string().optional(),
  hasLogo: z.string().optional(),
  logoFiles: z.any().optional(),
  visualReferences: z.string().optional(),
  visualFiles: z.any().optional(),
  contentMaterials: z.string().optional(),
  materialFiles: z.any().optional(),
  
  // Novos campos para marketing
  brandPersonality: z.string().optional(),
  communicationTone: z.string().optional(),
  keyMessages: z.string().optional(),

  // Técnico
  desiredDomain: z.string().optional(),
  integrations: z.string().optional(),
  analytics: z.string().optional(),

  // Timeline - valor fixo
  deliveryDeadline: z.string().optional(),
  startDate: z.string().optional(), // Removido da interface
  budget: z.string().optional(), // Agora é um valor fixo
  additionalNotes: z.string().optional(),
});

// type ClientBriefForm = z.infer<typeof clientBriefSchema>; // Agora importado do service

const steps = [
  { id: 1, title: 'Empresa', description: 'Informações da sua empresa', icon: Sparkles },
  { id: 2, title: 'Produto', description: 'Sobre seu produto/serviço', icon: Target },
  { id: 3, title: 'Marketing', description: 'Estratégia e design', icon: Palette },
  { id: 4, title: 'Técnico', description: 'Configurações técnicas', icon: Settings },
  { id: 5, title: 'Timeline', description: 'Prazos e orçamento', icon: Calendar },
];

const ClientBrief = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Removido deliveryType pois agora é valor fixo

  const form = useForm<ClientBriefForm>({
    resolver: zodResolver(clientBriefSchema),
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors }, setValue } = form;

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = async (data: ClientBriefForm) => {
    // Prevenir envio automático - só permitir se estiver na última etapa
    if (currentStep !== steps.length) {
      console.log('⚠️ [CLIENT-DEBUG] Tentativa de envio automático bloqueada - etapa atual:', currentStep);
      return;
    }
    
    console.log('✅ [CLIENT-DEBUG] Envio autorizado - usuário está na última etapa');
    setIsSubmitting(true);
    
    try {
      // Debug: verificar dados antes do envio
      console.log('🔍 [CLIENT-DEBUG] Dados do formulário:', data);
      console.log('🔍 [CLIENT-DEBUG] Prazo fixo: Valor Acordado na Workana');
      
      // Definir prazo fixo
      data.deliveryDeadline = 'Valor Acordado na Workana';
      
      // VALIDAÇÕES OBRIGATÓRIAS REMOVIDAS - Agora todos os campos são opcionais
      console.log('✅ [CLIENT-DEBUG] Prosseguindo sem validações obrigatórias');
      
      // Tentar enviar para o Supabase
      console.log('🚀 [CLIENT-DEBUG] Importando submitBriefing...');
        const { submitBriefing } = await import('@/services/briefingService');
      
      console.log('🚀 [CLIENT-DEBUG] Chamando submitBriefing com dados:', {
        companyName: data.companyName,
        responsibleName: data.responsibleName,
        deliveryDeadline: data.deliveryDeadline,
        totalFields: Object.keys(data).length
      });
      
        const savedBriefing = await submitBriefing(data);
      console.log('✅ [CLIENT-DEBUG] submitBriefing retornou:', savedBriefing);
      
      console.log('✅ [CLIENT-DEBUG] Briefing salvo com sucesso! Definindo isSubmitted = true');
        setIsSubmitted(true);
        return;
      
    } catch (error) {
      console.error('❌ [CLIENT-DEBUG] Erro capturado no onSubmit:', error);
      console.error('❌ [CLIENT-DEBUG] Tipo do erro:', typeof error);
      console.error('❌ [CLIENT-DEBUG] Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
        
      // Se deu erro no Supabase, usar fallback local
      if (error instanceof Error && (
        error.message.includes('Supabase') || 
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('database')
      )) {
        console.log('💾 [CLIENT-DEBUG] Erro do Supabase detectado, salvando localmente como fallback...');
        const briefingData = {
          ...data,
          id: `local_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        
        // Salvar no localStorage
        const existingBriefings = JSON.parse(localStorage.getItem('briefings') || '[]');
        existingBriefings.push(briefingData);
        localStorage.setItem('briefings', JSON.stringify(existingBriefings));
        
        console.log('✅ [CLIENT-DEBUG] Briefing salvo localmente, definindo isSubmitted = true');
        setIsSubmitted(true);
        return;
      }
      
      // Mostrar erro específico para o usuário
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado. Por favor, tente novamente.';
      console.error('❌ [CLIENT-DEBUG] Mostrando erro para usuário:', errorMessage);
      alert(`Erro: ${errorMessage}`);
      
    } finally {
      console.log('🔄 [CLIENT-DEBUG] Finalizando onSubmit, setIsSubmitting(false)');
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-workflow-deep via-purple-900 to-workflow-deep flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full text-center bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-workflow-deep mb-4">
                Briefing Enviado com Sucesso! 🎉
              </h1>
              <p className="text-lg text-workflow-deep/70 mb-8">
                Recebemos todas as informações do seu projeto. Nossa equipe irá analisar seu briefing e entrar em contato em até 24 horas com o cronograma detalhado e próximos passos.
              </p>
              
              <div className="bg-workflow-energy/10 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-workflow-deep mb-2">Próximo Passo</h3>
                <p className="text-sm text-workflow-deep/70">
                  Análise do briefing e estruturação do projeto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-workflow-deep via-purple-900 to-workflow-deep py-4 md:py-8 px-2 md:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 md:mb-4">
            Briefing <span className="text-gradient-rainbow">Completo</span>
          </h1>
          <p className="text-lg md:text-xl text-workflow-zen/80 max-w-2xl mx-auto px-2">
            Vamos coletar todas as informações necessárias para criar sua landing page perfeita
          </p>
          <div className="mt-3 md:mt-4 inline-block bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-2 border border-white/20">
            <p className="text-xs md:text-sm text-white font-medium">
              👨‍💻 Desenvolvedor: Leonardo Lopes
          </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 md:mb-8 px-2">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <span className="text-xs md:text-sm text-workflow-zen/80">
              Etapa {currentStep} de {steps.length}
            </span>
            <span className="text-xs md:text-sm text-workflow-zen/80">
              {Math.round(progressPercentage)}% completo
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-6 md:mb-8 overflow-x-auto pb-4 px-2">
          <div className="flex space-x-2 md:space-x-4 min-w-max">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center p-2 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 cursor-pointer min-w-[80px] md:min-w-auto
                    ${isActive ? 'bg-white/20 text-white scale-105' : 
                      isCompleted ? 'bg-green-500/20 text-green-300' : 
                      'bg-white/10 text-workflow-zen/60 hover:bg-white/15'}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2
                    ${isActive ? 'bg-workflow-energy' : 
                      isCompleted ? 'bg-green-500' : 
                      'bg-white/20'}`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 md:w-6 md:h-6" />
                    ) : (
                      <Icon className="w-4 h-4 md:w-6 md:h-6" />
                    )}
                  </div>
                  <span className="text-xs md:text-sm font-medium text-center">{step.title}</span>
                  <span className="text-xs opacity-70 text-center hidden md:block">{step.description}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl mx-2 md:mx-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-4 md:p-8">
              
              {/* Step 1: Informações da Empresa */}
              {currentStep === 1 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center mb-6 md:mb-8">
                    <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-workflow-energy mx-auto mb-3 md:mb-4" />
                    <h2 className="text-xl md:text-2xl font-bold text-workflow-deep mb-2">Informações da Empresa</h2>
                    <p className="text-sm md:text-base text-workflow-deep/70">Conte-nos sobre sua empresa e negócio</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome da Empresa/Marca *
                      </label>
                      <Input 
                        {...register('companyName')}
                        placeholder="Ex: Workflow Digital"
                        className={errors.companyName ? 'border-red-500' : ''}
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Segmento/Nicho *
                      </label>
                      <Select onValueChange={(value) => setValue('businessSegment', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o segmento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                          <SelectItem value="educacao">Educação</SelectItem>
                          <SelectItem value="tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="consultoria">Consultoria</SelectItem>
                          <SelectItem value="servicos">Serviços</SelectItem>
                          <SelectItem value="alimentacao">Alimentação</SelectItem>
                          <SelectItem value="moda">Moda e Beleza</SelectItem>
                          <SelectItem value="imobiliario">Imobiliário</SelectItem>
                          <SelectItem value="financeiro">Financeiro</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.businessSegment && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessSegment.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Descrição do Negócio *
                    </label>
                    <Textarea 
                      {...register('businessDescription')}
                      placeholder="Descreva sua empresa, o que faz, como funciona..."
                      rows={4}
                      className={errors.businessDescription ? 'border-red-500' : ''}
                    />
                    {errors.businessDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Público-Alvo *
                    </label>
                    <Textarea 
                      {...register('targetAudience')}
                      placeholder="Quem são seus clientes ideais? Idade, profissão, problemas que enfrentam..."
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
                      {...register('competitiveDifferential')}
                      placeholder="O que te diferencia da concorrência? Por que escolher você?"
                      rows={3}
                      className={errors.competitiveDifferential ? 'border-red-500' : ''}
                    />
                    {errors.competitiveDifferential && (
                      <p className="text-red-500 text-sm mt-1">{errors.competitiveDifferential.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Objetivo da Landing Page *
                    </label>
                    <Select onValueChange={(value) => setValue('landingPageGoal', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qual o principal objetivo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendas">Aumentar Vendas</SelectItem>
                        <SelectItem value="leads">Capturar Leads</SelectItem>
                        <SelectItem value="agendamentos">Gerar Agendamentos</SelectItem>
                        <SelectItem value="cadastros">Aumentar Cadastros</SelectItem>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="downloads">Downloads de Material</SelectItem>
                        <SelectItem value="inscricoes">Inscrições em Evento</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.landingPageGoal && (
                      <p className="text-red-500 text-sm mt-1">{errors.landingPageGoal.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Principais Concorrentes
                    </label>
                    <Textarea 
                      {...register('mainCompetitors')}
                      placeholder="Liste seus principais concorrentes e o que eles fazem de diferente..."
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Isso nos ajuda a criar uma proposta única e diferenciada
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Principais Dores do Cliente
                    </label>
                    <Textarea 
                      {...register('customerPainPoints')}
                      placeholder="Quais são os maiores problemas que seu público enfrenta? O que os mantém acordados à noite?"
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Entender as dores nos ajuda a criar uma mensagem mais persuasiva
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Histórias de Sucesso
                    </label>
                    <Textarea 
                      {...register('successStories')}
                      placeholder="Conte casos de sucesso de clientes, resultados obtidos, transformações..."
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Cases reais aumentam muito a credibilidade da landing page
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Prova Social Disponível
                    </label>
                    <Textarea 
                      {...register('socialProof')}
                      placeholder="Depoimentos, avaliações, certificações, prêmios, números impressionantes..."
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Prova social é fundamental para aumentar a conversão
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Produto/Serviço */}
              {currentStep === 2 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center mb-6 md:mb-8">
                    <Target className="w-10 h-10 md:w-12 md:h-12 text-workflow-energy mx-auto mb-3 md:mb-4" />
                    <h2 className="text-xl md:text-2xl font-bold text-workflow-deep mb-2">Produto/Serviço</h2>
                    <p className="text-sm md:text-base text-workflow-deep/70">Detalhes sobre o que você oferece</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                        Site Atual (se houver)
                      </label>
                      <Input 
                        {...register('currentWebsite')}
                        placeholder="https://seusite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Nome do Produto/Serviço Principal *
                    </label>
                    <Input 
                      {...register('productName')}
                      placeholder="Ex: Curso de Marketing Digital"
                      className={errors.productName ? 'border-red-500' : ''}
                    />
                    {errors.productName && (
                      <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Descrição Detalhada do Produto/Serviço *
                    </label>
                    <Textarea 
                      {...register('productDescription')}
                      placeholder="O que é, como funciona, o que está incluído, metodologia..."
                      rows={4}
                      className={errors.productDescription ? 'border-red-500' : ''}
                    />
                    {errors.productDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.productDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Principais Benefícios *
                    </label>
                    <Textarea 
                      {...register('mainBenefits')}
                      placeholder="Quais resultados o cliente vai ter? Como vai melhorar a vida dele?"
                      rows={3}
                      className={errors.mainBenefits ? 'border-red-500' : ''}
                    />
                    {errors.mainBenefits && (
                      <p className="text-red-500 text-sm mt-1">{errors.mainBenefits.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Quantas Ofertas Terá na Landing Page? *
                    </label>
                    <Select onValueChange={(value) => setValue('numberOfOffers', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 oferta (mais simples)</SelectItem>
                        <SelectItem value="2">2 ofertas (básica + premium)</SelectItem>
                        <SelectItem value="3">3 ofertas (básica + intermediária + premium)</SelectItem>
                        <SelectItem value="4+">4 ou mais ofertas</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.numberOfOffers && (
                      <p className="text-red-500 text-sm mt-1">{errors.numberOfOffers.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Detalhes das Ofertas e Valores Exatos *
                    </label>
                    <Textarea 
                      {...register('offerDetails')}
                      placeholder="Descreva cada oferta com o valor exato. Ex: 
Oferta 1: Curso Básico - R$ 297,00
Oferta 2: Curso Premium - R$ 497,00 
Oferta 3: Mentoria VIP - R$ 1.497,00

Inclua o que está incluso em cada uma."
                      rows={6}
                      className={errors.offerDetails ? 'border-red-500' : ''}
                    />
                    {errors.offerDetails && (
                      <p className="text-red-500 text-sm mt-1">{errors.offerDetails.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Modelo de Cobrança *
                      </label>
                      <Select onValueChange={(value) => setValue('pricingModel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Como será cobrado?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="valor-unico">Valor único (pagamento à vista)</SelectItem>
                          <SelectItem value="mensal">Mensalidade</SelectItem>
                          <SelectItem value="trimestral">Trimestral</SelectItem>
                          <SelectItem value="semestral">Semestral</SelectItem>
                          <SelectItem value="anual">Anual</SelectItem>
                          <SelectItem value="vitalicio">Vitalício</SelectItem>
                          <SelectItem value="parcelado">Parcelado (valor único dividido)</SelectItem>
                          <SelectItem value="misto">Misto (diferentes modelos por oferta)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.pricingModel && (
                        <p className="text-red-500 text-sm mt-1">{errors.pricingModel.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Garantias Oferecidas
                      </label>
                      <Input 
                        {...register('guarantees')}
                        placeholder="Ex: 30 dias de garantia"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Resultados Esperados pelo Cliente
                    </label>
                    <Textarea 
                      {...register('targetResults')}
                      placeholder="Que transformação específica o cliente terá? Números, prazos, resultados concretos..."
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Resultados específicos geram mais interesse e urgência
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Fatores de Urgência
                    </label>
                    <Textarea 
                      {...register('urgencyFactors')}
                      placeholder="Por que o cliente precisa agir agora? Promoções, vagas limitadas, problemas que pioram com o tempo..."
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Urgência é um dos maiores motivadores de conversão
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Principais Objeções dos Clientes
                    </label>
                    <Textarea 
                      {...register('objections')}
                      placeholder="Que dúvidas ou resistências os clientes costumam ter? 'É muito caro', 'Não tenho tempo', 'Já tentei antes'..."
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Conhecer as objeções nos permite respondê-las na landing page
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Marketing */}
              {currentStep === 3 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center mb-6 md:mb-8">
                    <Palette className="w-10 h-10 md:w-12 md:h-12 text-workflow-energy mx-auto mb-3 md:mb-4" />
                    <h2 className="text-xl md:text-2xl font-bold text-workflow-deep mb-2">Marketing & Design</h2>
                    <p className="text-sm md:text-base text-workflow-deep/70">Estratégia e identidade visual</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Call-to-Action Principal *
                    </label>
                    <Input 
                      {...register('callToAction')}
                      placeholder="Ex: Quero Começar Agora, Agendar Consulta, Comprar Agora"
                      className={errors.callToAction ? 'border-red-500' : ''}
                    />
                    {errors.callToAction && (
                      <p className="text-red-500 text-sm mt-1">{errors.callToAction.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Para onde direcionar os leads? *
                    </label>
                    <Select onValueChange={(value) => setValue('leadDestination', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="formulario">Formulário de contato</SelectItem>
                        <SelectItem value="email">Email direto</SelectItem>
                        <SelectItem value="checkout">Página de checkout</SelectItem>
                        <SelectItem value="agendamento">Sistema de agendamento</SelectItem>
                        <SelectItem value="telefone">Ligação telefônica</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.leadDestination && (
                      <p className="text-red-500 text-sm mt-1">{errors.leadDestination.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Cores da Marca
                    </label>
                    <Input 
                      {...register('brandColors')}
                      placeholder="Ex: Azul (#0066cc), Branco, Cinza"
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      Se não tiver cores definidas, nossa equipe criará uma paleta profissional
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Logo da Empresa *
                    </label>
                    <Select onValueChange={(value) => setValue('hasLogo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Você tem logo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tem-logo">Sim, tenho logo profissional</SelectItem>
                        <SelectItem value="logo-simples">Tenho algo simples que pode ser melhorado</SelectItem>
                        <SelectItem value="sem-logo">Não tenho logo, preciso criar</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.hasLogo && (
                      <p className="text-red-500 text-sm mt-1">{errors.hasLogo.message}</p>
                    )}
                    
                    <FileUpload
                      id="logo-upload"
                      accept="image/*,.pdf,.ai,.eps,.svg"
                      multiple
                      onChange={(files) => setValue('logoFiles', files)}
                      label="Upload do Logo (se tiver)"
                      description="PNG, JPG, PDF, AI, EPS, SVG (máx. 10MB cada)"
                      className="mt-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Referências Visuais
                    </label>
                    <Textarea 
                      {...register('visualReferences')}
                      placeholder="Sites, landing pages ou empresas que você admira o design. Cole links ou descreva o estilo..."
                      rows={3}
                    />
                    
                    <FileUpload
                      id="visual-upload"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(files) => setValue('visualFiles', files)}
                      label="Upload de Referências Visuais"
                      description="PNG, JPG, PDF - Screenshots de sites/designs que você gosta"
                      className="mt-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Materiais Próprios para a Landing Page
                    </label>
                    <Textarea 
                      {...register('contentMaterials')}
                      placeholder="Descreva os materiais que você tem e gostaria de incluir na landing page (fotos de produtos, imagens da empresa, vídeos, depoimentos, certificados, etc.)"
                      rows={3}
                    />
                    
                    <FileUpload
                      id="materials-upload"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      multiple
                      onChange={(files) => setValue('materialFiles', files)}
                      label="Upload dos Seus Materiais"
                      description="Imagens (PNG, JPG, WEBP), Vídeos (MP4, MOV), Documentos (PDF, DOC) - Máximo 500MB por arquivo"
                      className="mt-4"
                    />
                    <p className="text-sm text-workflow-deep/60 mt-2">
                      💡 <strong>Dica:</strong> Quanto mais materiais de qualidade você fornecer, mais personalizada e impactante será sua landing page!
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Personalidade da Marca
                    </label>
                    <Textarea 
                      {...register('brandPersonality')}
                      placeholder="Como você quer que sua marca seja percebida? Séria, descontraída, inovadora, confiável, jovem..."
                      rows={2}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Isso define o tom visual e textual da landing page
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Tom de Comunicação
                    </label>
                    <Select onValueChange={(value) => setValue('communicationTone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Como prefere se comunicar?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal e profissional</SelectItem>
                        <SelectItem value="informal">Informal e próximo</SelectItem>
                        <SelectItem value="tecnico">Técnico e especializado</SelectItem>
                        <SelectItem value="emocional">Emocional e inspirador</SelectItem>
                        <SelectItem value="direto">Direto e objetivo</SelectItem>
                        <SelectItem value="educativo">Educativo e didático</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Define como os textos serão escritos
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Mensagens-Chave
                    </label>
                    <Textarea 
                      {...register('keyMessages')}
                      placeholder="Quais são as 3 mensagens mais importantes que você quer transmitir? O que não pode faltar na landing page?"
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Essas mensagens serão destacadas estrategicamente
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Seções da Landing Page 📋
                    </label>
                    <Textarea 
                      {...register('landingPageSections')}
                      placeholder="Tem em mente quantas e quais seções aproximadamente terá a página? (hero, benefícios, depoimentos, FAQ, formulário, sobre nós, portfólio, etc.)"
                      rows={4}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 <strong>Importante:</strong> Nos ajude a estruturar a página da forma ideal para seus objetivos
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Requisitos Específicos
                    </label>
                    <Textarea 
                      {...register('specificRequirements')}
                      placeholder="Alguma funcionalidade específica que você precisa? (calculadora, quiz, vídeo em popup, chat, agendamento, etc.)"
                      rows={3}
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 Funcionalidades especiais podem aumentar muito a conversão
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Técnico */}
              {currentStep === 4 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center mb-6 md:mb-8">
                    <Settings className="w-10 h-10 md:w-12 md:h-12 text-workflow-energy mx-auto mb-3 md:mb-4" />
                    <h2 className="text-xl md:text-2xl font-bold text-workflow-deep mb-2">Configurações Técnicas</h2>
                    <p className="text-sm md:text-base text-workflow-deep/70">Integrações e funcionalidades</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Domínio Desejado
                    </label>
                    <Input 
                      {...register('desiredDomain')}
                      placeholder="Ex: meunegocio.com.br"
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      Se não tiver, podemos hospedar em subdomínio temporário
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Integrações Necessárias
                    </label>
                    <Textarea 
                      {...register('integrations')}
                      placeholder="Ex: Mailchimp, RD Station, Hotmart, PagSeguro, Google Analytics..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Analytics e Tracking
                    </label>
                    <Textarea 
                      {...register('analytics')}
                      placeholder="Google Analytics, Facebook Pixel, Tag Manager... Cole os códigos se já tiver"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Timeline */}
              {currentStep === 5 && (
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center mb-6 md:mb-8">
                    <Calendar className="w-10 h-10 md:w-12 md:h-12 text-workflow-energy mx-auto mb-3 md:mb-4" />
                    <h2 className="text-xl md:text-2xl font-bold text-workflow-deep mb-2">Timeline & Orçamento</h2>
                    <p className="text-sm md:text-base text-workflow-deep/70">Prazos e investimento</p>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Prazo de Entrega *
                      </label>
                      <Input 
                        value="Valor Acordado na Workana"
                        readOnly
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-sm text-workflow-deep/60 mt-1">
                        💡 O prazo de entrega já foi definido conforme acordo na Workana
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Orçamento
                    </label>
                    <Input 
                      value="Valor Acordado na Workana"
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-sm text-workflow-deep/60 mt-1">
                      💡 O orçamento já foi definido conforme acordo na Workana
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Observações Adicionais
                    </label>
                    <Textarea 
                      {...register('additionalNotes')}
                      placeholder="Alguma informação importante que não foi mencionada? Requisitos especiais?"
                      rows={4}
                    />
                  </div>


                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 md:pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Briefing'}
                    <Send className="w-4 h-4" />
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

export default ClientBrief; 