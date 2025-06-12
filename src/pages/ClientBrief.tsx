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

// Schema de validação
const clientBriefSchema = z.object({
  // Informações da Empresa
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  businessSegment: z.string().min(1, 'Segmento é obrigatório'),
  businessDescription: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres'),
  targetAudience: z.string().min(20, 'Público-alvo deve ser descrito'),
  competitiveDifferential: z.string().min(20, 'Diferencial competitivo é obrigatório'),
  landingPageGoal: z.string().min(1, 'Objetivo é obrigatório'),
  
  // Novos campos para agregar valor
  mainCompetitors: z.string().optional(),
  customerPainPoints: z.string().optional(),
  successStories: z.string().optional(),
  socialProof: z.string().optional(),

  // Informações de Contato
  responsibleName: z.string().min(2, 'Nome do responsável é obrigatório'),
  currentWebsite: z.string().optional(),

  // Produto/Serviço
  productName: z.string().min(2, 'Nome do produto/serviço é obrigatório'),
  productDescription: z.string().min(50, 'Descrição detalhada é obrigatória'),
  mainBenefits: z.string().min(30, 'Benefícios principais são obrigatórios'),
  priceRange: z.string().min(1, 'Faixa de preço é obrigatória'),
  guarantees: z.string().optional(),
  
  // Novos campos para produto/serviço
  targetResults: z.string().optional(),
  urgencyFactors: z.string().optional(),
  objections: z.string().optional(),

  // Marketing
  callToAction: z.string().min(1, 'Call-to-action é obrigatório'),
  leadDestination: z.string().min(1, 'Destino dos leads é obrigatório'),
  brandColors: z.string().optional(),
  hasLogo: z.string().min(1, 'Informar sobre logo é obrigatório'),
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

  // Timeline - alterado para dias específicos
  deliveryDeadline: z.string().min(1, 'Prazo de entrega é obrigatório'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  additionalNotes: z.string().optional(),
});

type ClientBriefForm = z.infer<typeof clientBriefSchema>;

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

  const form = useForm<ClientBriefForm>({
    resolver: zodResolver(clientBriefSchema),
    mode: 'onChange',
  });

  const { register, handleSubmit, formState: { errors }, setValue } = form;

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = async (data: ClientBriefForm) => {
    setIsSubmitting(true);
    
    try {
      // Importar o serviço dinamicamente para evitar problemas de build
      const { submitBriefing } = await import('@/services/briefingService');
      
      // Enviar briefing para o backend
      const savedBriefing = await submitBriefing(data);
      
      console.log('Briefing salvo com sucesso:', savedBriefing);
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Erro ao enviar briefing:', error);
      
      // Mostrar erro específico para o usuário
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado. Por favor, tente novamente.';
      alert(errorMessage);
      
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
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-workflow-energy/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-workflow-deep mb-2">Próximo Passo</h3>
                  <p className="text-sm text-workflow-deep/70">
                    Análise do briefing e estruturação do projeto
                  </p>
                </div>
                <div className="bg-workflow-zen/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-workflow-deep mb-2">Contato</h3>
                  <p className="text-sm text-workflow-deep/70">
                    Retorno em até 24h via WhatsApp ou email
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = '/'}
                className="btn-primary"
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-workflow-deep via-purple-900 to-workflow-deep py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Briefing <span className="text-gradient-rainbow">Completo</span>
          </h1>
          <p className="text-xl text-workflow-zen/80 max-w-2xl mx-auto">
            Vamos coletar todas as informações necessárias para criar sua landing page perfeita
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-workflow-zen/80">
              Etapa {currentStep} de {steps.length}
            </span>
            <span className="text-sm text-workflow-zen/80">
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
                      isCompleted ? 'bg-green-500/20 text-green-300' : 
                      'bg-white/10 text-workflow-zen/60 hover:bg-white/15'}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${isActive ? 'bg-workflow-energy' : 
                      isCompleted ? 'bg-green-500' : 
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
                    <Sparkles className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Informações da Empresa</h2>
                    <p className="text-workflow-deep/70">Conte-nos sobre sua empresa e negócio</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
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
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Target className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Produto/Serviço</h2>
                    <p className="text-workflow-deep/70">Detalhes sobre o que você oferece</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Faixa de Preço *
                      </label>
                      <Select onValueChange={(value) => setValue('priceRange', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a faixa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ate-100">Até R$ 100</SelectItem>
                          <SelectItem value="100-500">R$ 100 - R$ 500</SelectItem>
                          <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                          <SelectItem value="1000-5000">R$ 1.000 - R$ 5.000</SelectItem>
                          <SelectItem value="5000-10000">R$ 5.000 - R$ 10.000</SelectItem>
                          <SelectItem value="acima-10000">Acima de R$ 10.000</SelectItem>
                          <SelectItem value="gratuito">Gratuito</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.priceRange && (
                        <p className="text-red-500 text-sm mt-1">{errors.priceRange.message}</p>
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
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Palette className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Marketing & Design</h2>
                    <p className="text-workflow-deep/70">Estratégia e identidade visual</p>
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
                      description="Imagens (PNG, JPG, WEBP), Vídeos (MP4, MOV), Documentos (PDF, DOC) - Máximo 50MB por arquivo"
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
                </div>
              )}

              {/* Step 4: Técnico */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Settings className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Configurações Técnicas</h2>
                    <p className="text-workflow-deep/70">Integrações e funcionalidades</p>
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
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Calendar className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Timeline & Orçamento</h2>
                    <p className="text-workflow-deep/70">Prazos e investimento</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Prazo de Entrega (em dias) *
                      </label>
                      <Select onValueChange={(value) => setValue('deliveryDeadline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Quantos dias para entrega?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 dia (super urgente)</SelectItem>
                          <SelectItem value="2">2 dias</SelectItem>
                          <SelectItem value="3">3 dias</SelectItem>
                          <SelectItem value="4">4 dias</SelectItem>
                          <SelectItem value="5">5 dias</SelectItem>
                          <SelectItem value="6">6 dias</SelectItem>
                          <SelectItem value="7">7 dias (1 semana)</SelectItem>
                          <SelectItem value="15">até 15 dias</SelectItem>
                          <SelectItem value="9">9 dias</SelectItem>
                          <SelectItem value="10">10 dias</SelectItem>
                          <SelectItem value="11">11 dias</SelectItem>
                          <SelectItem value="12">12 dias</SelectItem>
                          <SelectItem value="13">13 dias</SelectItem>
                          <SelectItem value="14">14 dias (2 semanas)</SelectItem>
                          <SelectItem value="15">15 dias</SelectItem>
                          <SelectItem value="16">16 dias</SelectItem>
                          <SelectItem value="17">17 dias</SelectItem>
                          <SelectItem value="18">18 dias</SelectItem>
                          <SelectItem value="19">19 dias</SelectItem>
                          <SelectItem value="20">20 dias</SelectItem>
                          <SelectItem value="21">21 dias (3 semanas)</SelectItem>
                          <SelectItem value="22">22 dias</SelectItem>
                          <SelectItem value="23">23 dias</SelectItem>
                          <SelectItem value="24">24 dias</SelectItem>
                          <SelectItem value="25">25 dias</SelectItem>
                          <SelectItem value="26">26 dias</SelectItem>
                          <SelectItem value="27">27 dias</SelectItem>
                          <SelectItem value="28">28 dias (4 semanas)</SelectItem>
                          <SelectItem value="29">29 dias</SelectItem>
                          <SelectItem value="30">30 dias (1 mês)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.deliveryDeadline && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryDeadline.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Data de Início Desejada *
                    </label>
                    <Select onValueChange={(value) => setValue('startDate', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Quando podemos começar?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imediatamente">Imediatamente</SelectItem>
                        <SelectItem value="esta-semana">Esta semana</SelectItem>
                        <SelectItem value="proxima-semana">Próxima semana</SelectItem>
                        <SelectItem value="proximo-mes">Próximo mês</SelectItem>
                        <SelectItem value="a-definir">A definir</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
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

                  <div className="bg-gradient-to-r from-workflow-energy/10 to-workflow-zen/10 rounded-2xl p-6 border border-workflow-energy/20">
                    <h3 className="font-semibold text-workflow-deep mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-workflow-energy" />
                      Próximos Passos após o Envio:
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className="font-medium text-workflow-deep">Análise Detalhada (24h)</p>
                          <p className="text-sm text-workflow-deep/70">Nossa equipe analisará seu briefing e criará a estratégia personalizada</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className="font-medium text-workflow-deep">Proposta & Cronograma</p>
                          <p className="text-sm text-workflow-deep/70">Enviaremos proposta detalhada com timeline e marcos do projeto</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-workflow-energy text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className="font-medium text-workflow-deep">Início do Desenvolvimento</p>
                          <p className="text-sm text-workflow-deep/70">Após aprovação, iniciamos a criação da sua landing page de alta conversão</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex items-center gap-2"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2"
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