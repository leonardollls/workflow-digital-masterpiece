import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight, Sparkles, Target, Palette, Settings, Calendar, Send, Heart } from 'lucide-react';
import type { ClientBriefForm } from '@/services/briefingService';

// Schema igual ao briefing original
const clientBriefSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  businessSegment: z.string().min(1, 'Segmento é obrigatório'),
  businessDescription: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres'),
  targetAudience: z.string().min(20, 'Público-alvo deve ser descrito'),
  competitiveDifferential: z.string().min(20, 'Diferencial competitivo é obrigatório'),
  landingPageGoal: z.string().min(1, 'Objetivo é obrigatório'),
  mainCompetitors: z.string().optional(),
  customerPainPoints: z.string().optional(),
  successStories: z.string().optional(),
  socialProof: z.string().optional(),
  responsibleName: z.string().min(2, 'Nome do responsável é obrigatório'),
  currentWebsite: z.string().optional(),
  productName: z.string().min(2, 'Nome do produto/serviço é obrigatório'),
  productDescription: z.string().min(50, 'Descrição detalhada é obrigatória'),
  mainBenefits: z.string().min(30, 'Benefícios principais são obrigatórios'),
  guarantees: z.string().optional(),
  targetResults: z.string().optional(),
  urgencyFactors: z.string().optional(),
  objections: z.string().optional(),
  numberOfOffers: z.string().min(1, 'Número de ofertas é obrigatório'),
  offerDetails: z.string().min(20, 'Detalhes das ofertas são obrigatórios'),
  pricingModel: z.string().min(1, 'Modelo de precificação é obrigatório'),
  callToAction: z.string().min(1, 'Call-to-action é obrigatório'),
  leadDestination: z.string().min(1, 'Destino dos leads é obrigatório'),
  landingPageSections: z.string().optional(),
  specificRequirements: z.string().optional(),
  brandColors: z.string().optional(),
  hasLogo: z.string().min(1, 'Informar sobre logo é obrigatório'),
  logoFiles: z.any().optional(),
  visualReferences: z.string().optional(),
  visualFiles: z.any().optional(),
  contentMaterials: z.string().optional(),
  materialFiles: z.any().optional(),
  brandPersonality: z.string().optional(),
  communicationTone: z.string().optional(),
  keyMessages: z.string().optional(),
  desiredDomain: z.string().optional(),
  integrations: z.string().optional(),
  analytics: z.string().optional(),
  deliveryDeadline: z.string().min(1, 'Prazo de entrega é obrigatório'),
  startDate: z.string().optional(),
  budget: z.string().optional(),
  additionalNotes: z.string().optional(),
});

const steps = [
  { id: 1, title: 'Empresa', description: 'Portal de atividades materno', icon: Heart },
  { id: 2, title: 'Produto', description: 'Detalhes do portal', icon: Target },
  { id: 3, title: 'Marketing', description: 'Design feminino e acolhedor', icon: Palette },
  { id: 4, title: 'Técnico', description: 'Performance e integração', icon: Settings },
  { id: 5, title: 'Timeline', description: 'Prazos e entrega', icon: Calendar },
];

// Dados pré-preenchidos baseados na proposta
const prefilledData: Partial<ClientBriefForm> = {
  companyName: 'Portal de Atividades Materno',
  businessSegment: 'educacao',
  businessDescription: 'Portal online dedicado a oferecer atividades educativas e recreativas para crianças, com foco especial no desenvolvimento infantil e apoio às mães. Nossa plataforma conecta famílias com atividades de qualidade, proporcionando momentos especiais de aprendizado e diversão.',
  targetAudience: 'Mães modernas, ativas e preocupadas com o desenvolvimento dos filhos. Mulheres entre 25-45 anos, que buscam atividades de qualidade para seus filhos e valorizam momentos de conexão familiar. Público que aprecia conteúdo acolhedor e tem interesse em educação infantil.',
  competitiveDifferential: 'Abordagem acolhedora e feminina que entende as necessidades específicas das mães. Portal curado com atividades de alta qualidade, design emocional que transmite carinho e cuidado, foco na experiência materno-infantil.',
  landingPageGoal: 'Conversão para checkout do portal de atividades',
  productName: 'Portal de Atividades Materno',
  productDescription: 'Um portal completo com atividades cuidadosamente selecionadas para crianças, criado especialmente para mães que buscam qualidade e praticidade. Oferecemos uma experiência digital acolhedora com atividades que promovem o desenvolvimento infantil e fortalecem os laços familiares.',
  mainBenefits: 'Atividades curadas por especialistas, design acolhedor e feminino, experiência otimizada para mães ocupadas, conteúdo que fortalece vínculos familiares, praticidade no acesso via mobile, qualidade garantida em todas as atividades.',
  numberOfOffers: '1',
  offerDetails: 'Acesso completo ao Portal de Atividades Materno com atividades ilimitadas, suporte especializado e atualizações constantes de conteúdo.',
  pricingModel: 'Pagamento único',
  callToAction: 'Acessar Portal Agora',
  leadDestination: 'Checkout/página de pagamento',
  landingPageSections: 'Headline emocional, seção sobre o propósito do projeto, benefícios para mães e filhos, depoimentos de mães, chamada para ação (checkout), rodapé com redes sociais',
  specificRequirements: 'Design responsivo obrigatório, carregamento rápido, otimização para mobile, efeitos visuais (carrossel, brilho nos botões), tom emocional feminino e acolhedor, espaço para 1-2 depoimentos de mães, integração futura com formulários/email marketing.',
  brandColors: 'Tons suaves e acolhedores (rosas, lavanda, bege, branco)',
  hasLogo: 'possui-simples',
  brandPersonality: 'Acolhedora, feminina, carinhosa, profissional, confiável',
  communicationTone: 'Tom emocional, acolhedor e empático. Linguagem que fala diretamente com mães, transmitindo carinho, cuidado e compreensão das necessidades maternas.',
  keyMessages: 'Momentos especiais com seus filhos, atividades de qualidade para o desenvolvimento infantil, apoio às mães modernas, experiência acolhedora e confiável.',
  deliveryDeadline: '10-dias',
  additionalNotes: 'IMPORTANTE: Foco total na experiência feminina/materna. A página deve transmitir acolhimento e carinho. Priorizar performance mobile. Incluir efeitos visuais sutis que agreguem valor (carrossel suave, hover effects, animações delicadas). Possibilidade de entrega em Webflow, WordPress, Notion ou HTML/CSS conforme melhor opção técnica.',
  customerPainPoints: 'Mães sobrecarregadas que buscam atividades de qualidade, falta de tempo para pesquisar atividades adequadas, necessidade de conteúdo confiável e seguro para os filhos.',
  targetResults: 'Aumentar conversões para o checkout, criar conexão emocional com as mães, estabelecer confiança na marca, gerar interesse no portal de atividades.',
  urgencyFactors: 'Mães querem o melhor para seus filhos agora, oportunidade limitada de desenvolvimento na primeira infância.',
  socialProof: 'Depoimentos de mães satisfeitas, casos de sucesso de famílias que usaram o portal.'
};

const CustomBrief = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ClientBriefForm>({
    resolver: zodResolver(clientBriefSchema),
    mode: 'onChange',
    defaultValues: prefilledData as ClientBriefForm
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const watchedValues = watch();

  // Pré-preencher campos no mount
  useEffect(() => {
    Object.entries(prefilledData).forEach(([key, value]) => {
      if (value) {
        setValue(key as keyof ClientBriefForm, value);
      }
    });
  }, [setValue]);

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = async (data: ClientBriefForm) => {
    setIsSubmitting(true);
    
    try {
      console.log('📝 Dados do briefing personalizado:', data);
      
      // Adicionar identificador de briefing customizado
      const briefingData = {
        ...data,
        id: `custom_portal_materno_${Date.now()}`,
        type: 'custom_landing_page',
        client_proposal: 'Portal de Atividades Materno - Briefing Personalizado',
        created_at: new Date().toISOString()
      };
      
      // Tentar enviar para o Supabase primeiro
      try {
        const { submitBriefing } = await import('@/services/briefingService');
        const savedBriefing = await submitBriefing(data);
        console.log('✅ Briefing personalizado salvo no Supabase:', savedBriefing);
        setIsSubmitted(true);
        return;
      } catch (supabaseError) {
        console.error('❌ Erro no Supabase:', supabaseError);
        
        // Fallback: salvar localmente
        const existingBriefings = JSON.parse(localStorage.getItem('briefings') || '[]');
        existingBriefings.push(briefingData);
        localStorage.setItem('briefings', JSON.stringify(existingBriefings));
        
        console.log('✅ Briefing personalizado salvo localmente');
        setIsSubmitted(true);
      }
      
    } catch (error) {
      console.error('❌ Erro ao enviar briefing personalizado:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Erro inesperado'}`);
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full text-center bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-pink-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-workflow-deep mb-4">
                Briefing Personalizado Enviado! 💝
              </h1>
              <p className="text-lg text-workflow-deep/70 mb-8">
                Recebemos seu briefing personalizado para o Portal de Atividades Materno. Nossa equipe irá criar uma landing page acolhedora e profissional, perfeita para o público materno!
              </p>
              
              <div className="bg-pink-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-workflow-deep mb-2">Próximo Passo</h3>
                <p className="text-sm text-workflow-deep/70">
                  Desenvolvimento da landing page com design feminino e acolhedor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-300" />
            <span className="text-pink-200 font-mono text-sm tracking-wider">BRIEFING PERSONALIZADO</span>
            <Heart className="w-8 h-8 text-pink-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Portal de <span className="text-gradient-rainbow">Atividades Materno</span>
          </h1>
          <p className="text-xl text-pink-200/80 max-w-2xl mx-auto">
            Briefing pré-preenchido para landing page acolhedora e profissional
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-pink-200/80">
              Etapa {currentStep} de {steps.length}
            </span>
            <span className="text-sm text-pink-200/80">
              {Math.round(progressPercentage)}% completo
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 cursor-pointer
                    ${isActive ? 'bg-white/20 text-white scale-105' : 
                      isCompleted ? 'bg-pink-500/20 text-pink-300' : 
                      'bg-white/10 text-pink-200/60 hover:bg-white/15'}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${isActive ? 'bg-pink-500' : 
                      isCompleted ? 'bg-pink-600' : 
                      'bg-white/20'}`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-center">{step.title}</span>
                  <span className="text-xs opacity-70 text-center">{step.description}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-8">
              
              {/* Step 1: Informações da Empresa */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Informações do Portal</h2>
                    <p className="text-workflow-deep/70">Dados já preenchidos baseados na sua proposta</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome da Empresa/Projeto *
                      </label>
                      <Input 
                        {...register('companyName')}
                        className={errors.companyName ? 'border-red-500' : 'border-pink-200 focus:border-pink-500'}
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Segmento *
                      </label>
                      <Select value={watchedValues.businessSegment} onValueChange={(value) => setValue('businessSegment', value)}>
                        <SelectTrigger className="border-pink-200 focus:border-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educacao">Educação</SelectItem>
                          <SelectItem value="familia">Família e Criança</SelectItem>
                          <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Descrição do Projeto *
                    </label>
                    <Textarea 
                      {...register('businessDescription')}
                      rows={4}
                      className={`border-pink-200 focus:border-pink-500 ${errors.businessDescription ? 'border-red-500' : ''}`}
                    />
                    {errors.businessDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessDescription.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Público-Alvo (Mães) *
                    </label>
                    <Textarea 
                      {...register('targetAudience')}
                      rows={3}
                      className={`border-pink-200 focus:border-pink-500 ${errors.targetAudience ? 'border-red-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Diferencial Competitivo *
                    </label>
                    <Textarea 
                      {...register('competitiveDifferential')}
                      rows={3}
                      className={`border-pink-200 focus:border-pink-500 ${errors.competitiveDifferential ? 'border-red-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Objetivo da Landing Page *
                    </label>
                    <Input 
                      {...register('landingPageGoal')}
                      className={`border-pink-200 focus:border-pink-500 ${errors.landingPageGoal ? 'border-red-500' : ''}`}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Produto/Serviço */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Target className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Detalhes do Portal</h2>
                    <p className="text-workflow-deep/70">Informações sobre o produto/serviço</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome do Responsável *
                      </label>
                      <Input 
                        {...register('responsibleName')}
                        placeholder="Seu nome completo"
                        className={`border-pink-200 focus:border-pink-500 ${errors.responsibleName ? 'border-red-500' : ''}`}
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
                        placeholder="https://seusite.com.br"
                        className="border-pink-200 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Nome do Produto/Serviço *
                    </label>
                    <Input 
                      {...register('productName')}
                      className={`border-pink-200 focus:border-pink-500 ${errors.productName ? 'border-red-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Descrição Detalhada do Portal *
                    </label>
                    <Textarea 
                      {...register('productDescription')}
                      rows={4}
                      className={`border-pink-200 focus:border-pink-500 ${errors.productDescription ? 'border-red-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Principais Benefícios para as Mães *
                    </label>
                    <Textarea 
                      {...register('mainBenefits')}
                      rows={3}
                      className={`border-pink-200 focus:border-pink-500 ${errors.mainBenefits ? 'border-red-500' : ''}`}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Número de Ofertas *
                      </label>
                      <Select value={watchedValues.numberOfOffers} onValueChange={(value) => setValue('numberOfOffers', value)}>
                        <SelectTrigger className="border-pink-200 focus:border-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 oferta principal</SelectItem>
                          <SelectItem value="2">2 ofertas</SelectItem>
                          <SelectItem value="3">3 ofertas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Modelo de Cobrança *
                      </label>
                      <Select value={watchedValues.pricingModel} onValueChange={(value) => setValue('pricingModel', value)}>
                        <SelectTrigger className="border-pink-200 focus:border-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pagamento único">Pagamento único</SelectItem>
                          <SelectItem value="Assinatura mensal">Assinatura mensal</SelectItem>
                          <SelectItem value="Assinatura anual">Assinatura anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Call-to-Action *
                      </label>
                      <Input 
                        {...register('callToAction')}
                        className={`border-pink-200 focus:border-pink-500 ${errors.callToAction ? 'border-red-500' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Detalhes da Oferta *
                    </label>
                    <Textarea 
                      {...register('offerDetails')}
                      rows={3}
                      className={`border-pink-200 focus:border-pink-500 ${errors.offerDetails ? 'border-red-500' : ''}`}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Marketing e Design */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Palette className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Design Feminino e Acolhedor</h2>
                    <p className="text-workflow-deep/70">Configurações visuais e de marca</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Destino dos Leads/Cliques *
                    </label>
                    <Input 
                      {...register('leadDestination')}
                      className={`border-pink-200 focus:border-pink-500 ${errors.leadDestination ? 'border-red-500' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Seções da Landing Page
                    </label>
                    <Textarea 
                      {...register('landingPageSections')}
                      rows={3}
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Requisitos Específicos de Design
                    </label>
                    <Textarea 
                      {...register('specificRequirements')}
                      rows={4}
                      className="border-pink-200 focus:border-pink-500"
                      placeholder="Efeitos visuais, responsividade, performance mobile..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Cores da Marca
                      </label>
                      <Input 
                        {...register('brandColors')}
                        className="border-pink-200 focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Status do Logo *
                      </label>
                      <Select value={watchedValues.hasLogo} onValueChange={(value) => setValue('hasLogo', value)}>
                        <SelectTrigger className="border-pink-200 focus:border-pink-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="possui-profissional">Possuo logo profissional</SelectItem>
                          <SelectItem value="possui-simples">Possuo identidade visual básica</SelectItem>
                          <SelectItem value="nao-possui">Não possuo logo</SelectItem>
                          <SelectItem value="precisa-redesign">Preciso redesenhar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Personalidade da Marca
                    </label>
                    <Textarea 
                      {...register('brandPersonality')}
                      rows={2}
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Tom de Comunicação
                    </label>
                    <Textarea 
                      {...register('communicationTone')}
                      rows={3}
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Técnico */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Settings className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Especificações Técnicas</h2>
                    <p className="text-workflow-deep/70">Performance e integrações</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Domínio Desejado
                    </label>
                    <Input 
                      {...register('desiredDomain')}
                      placeholder="Ex: portalatividades.com.br"
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Integrações Necessárias
                    </label>
                    <Textarea 
                      {...register('integrations')}
                      rows={3}
                      placeholder="Ex: Email marketing, formulários, redes sociais..."
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Analytics e Tracking
                    </label>
                    <Textarea 
                      {...register('analytics')}
                      rows={2}
                      placeholder="Google Analytics, Facebook Pixel, etc."
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Timeline */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Calendar className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Timeline e Observações</h2>
                    <p className="text-workflow-deep/70">Prazos e considerações finais</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Prazo de Entrega *
                    </label>
                    <Select value={watchedValues.deliveryDeadline} onValueChange={(value) => setValue('deliveryDeadline', value)}>
                      <SelectTrigger className="border-pink-200 focus:border-pink-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-dias">5 dias (Express)</SelectItem>
                        <SelectItem value="7-dias">7 dias (Rápido)</SelectItem>
                        <SelectItem value="10-dias">10 dias (Padrão)</SelectItem>
                        <SelectItem value="15-dias">15 dias (Flexível)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Observações Adicionais
                    </label>
                    <Textarea 
                      {...register('additionalNotes')}
                      rows={6}
                      className="border-pink-200 focus:border-pink-500"
                    />
                  </div>

                  <div className="bg-pink-50 rounded-xl p-6">
                    <h3 className="font-semibold text-workflow-deep mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      Resumo do Projeto
                    </h3>
                    <ul className="text-sm text-workflow-deep/70 space-y-1">
                      <li>• Landing page acolhedora para Portal de Atividades Materno</li>
                      <li>• Design responsivo com tom feminino e emocional</li>
                      <li>• Foco em conversão para checkout</li>
                      <li>• Otimização para mobile e performance</li>
                      <li>• Efeitos visuais sutis (carrossel, hover effects)</li>
                      <li>• Integração futura com email marketing</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-pink-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Briefing Personalizado
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

export default CustomBrief; 