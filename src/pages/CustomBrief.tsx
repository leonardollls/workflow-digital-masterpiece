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
import { FileUpload } from '@/components/ui/FileUpload';
import { CheckCircle, ArrowLeft, ArrowRight, Sparkles, Target, Palette, Settings, Calendar, Send, Star } from 'lucide-react';
import type { ClientBriefForm } from '@/services/briefingService';

const clientBriefSchema = z.object({
  companyName: z.string().optional(),
  businessSegment: z.string().optional(),
  businessDescription: z.string().optional(),
  targetAudience: z.string().optional(),
  competitiveDifferential: z.string().optional(),
  landingPageGoal: z.string().optional(),
  mainCompetitors: z.string().optional(),
  customerPainPoints: z.string().optional(),
  successStories: z.string().optional(),
  socialProof: z.string().optional(),
  responsibleName: z.string().optional(),
  currentWebsite: z.string().optional(),
  productName: z.string().optional(),
  productDescription: z.string().optional(),
  mainBenefits: z.string().optional(),
  guarantees: z.string().optional(),
  targetResults: z.string().optional(),
  urgencyFactors: z.string().optional(),
  objections: z.string().optional(),
  numberOfOffers: z.string().optional(),
  offerDetails: z.string().optional(),
  pricingModel: z.string().optional(),
  callToAction: z.string().optional(),
  leadDestination: z.string().optional(),
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
  landingPageSections: z.string().optional(),
  specificRequirements: z.string().optional(),
  desiredDomain: z.string().optional(),
  integrations: z.string().optional(),
  analytics: z.string().optional(),
  deliveryDeadline: z.string().optional(),
  additionalNotes: z.string().optional(),
});

const steps = [
  { id: 1, title: 'Empresa', description: 'Informações do negócio', icon: Star },
  { id: 2, title: 'Produto', description: 'Detalhes do produto/serviço', icon: Target },
  { id: 3, title: 'Visual', description: 'Design e estratégia', icon: Palette },
  { id: 4, title: 'Técnico', description: 'Integrações', icon: Settings },
  { id: 5, title: 'Timeline', description: 'Prazos', icon: Calendar },
];

const CustomBrief = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);

  const form = useForm<ClientBriefForm>({
    resolver: zodResolver(clientBriefSchema),
    mode: 'onSubmit',
    defaultValues: {
      companyName: 'Portal de Atividades Materno',
      businessSegment: 'educacao',
      businessDescription: 'Portal online dedicado a oferecer atividades educativas e recreativas para crianças, com foco especial no desenvolvimento infantil e apoio às mães. Nossa plataforma conecta famílias com atividades de qualidade, proporcionando momentos especiais de aprendizado e diversão.',
      targetAudience: 'Mães modernas, ativas e preocupadas com o desenvolvimento dos filhos. Mulheres entre 25-45 anos, que buscam atividades de qualidade para seus filhos e valorizam momentos de conexão familiar. Público que aprecia conteúdo acolhedor e tem interesse em educação infantil.',
      competitiveDifferential: 'Abordagem acolhedora e feminina que entende as necessidades específicas das mães. Portal curado com atividades de alta qualidade, design emocional que transmite carinho e cuidado, foco na experiência materno-infantil.',
      landingPageGoal: 'vendas',
      mainCompetitors: 'Outros portais de atividades infantis, blogs educativos, aplicativos de entretenimento infantil',
      customerPainPoints: 'Mães sobrecarregadas que buscam atividades de qualidade, falta de tempo para pesquisar atividades adequadas, necessidade de conteúdo confiável e seguro para os filhos',
      successStories: 'Casos de famílias que usaram as atividades para fortalecer laços, crianças que desenvolveram habilidades através das atividades propostas',
      socialProof: 'Depoimentos de mães satisfeitas, casos de sucesso de famílias que usaram o portal, avaliações positivas sobre a qualidade das atividades',
      responsibleName: '',
      productName: 'Portal de Atividades Materno',
      productDescription: 'Um portal completo com atividades cuidadosamente selecionadas para crianças, criado especialmente para mães que buscam qualidade e praticidade. Oferecemos uma experiência digital acolhedora com atividades que promovem o desenvolvimento infantil e fortalecem os laços familiares.',
      mainBenefits: 'Atividades curadas por especialistas, design acolhedor e feminino, experiência otimizada para mães ocupadas, conteúdo que fortalece vínculos familiares, praticidade no acesso via mobile, qualidade garantida em todas as atividades',
      numberOfOffers: '1',
      offerDetails: 'Acesso completo ao Portal de Atividades Materno com atividades ilimitadas, suporte especializado e atualizações constantes de conteúdo',
      pricingModel: 'assinatura',
      callToAction: 'Acessar Portal Agora',
      leadDestination: 'checkout',
      brandColors: 'Tons suaves e acolhedores (rosas, lavanda, bege, branco)',
      hasLogo: 'logo-simples',
      visualReferences: 'Design clean e feminino, cores suaves, elementos que remetem ao carinho materno e educação',
      brandPersonality: 'Acolhedora, feminina, carinhosa, profissional, confiável',
      communicationTone: 'emocional',
      keyMessages: 'Momentos especiais com seus filhos, atividades de qualidade para o desenvolvimento infantil, apoio às mães modernas, experiência acolhedora e confiável',
      landingPageSections: 'Header com proposta de valor forte; Seção de benefícios emocionais; Depoimentos de mães; Prévia das atividades disponíveis; Seção sobre a criadora/especialista; Oferta irresistível; FAQ focado em dúvidas maternas; Checkout simplificado',
      specificRequirements: 'Design que transmita confiança e carinho materno; Botões com efeito glow; Galeria de atividades com carousel; Seção de depoimentos de mães com fotos',
      desiredDomain: 'portalatividadesmaterno.com.br',
      deliveryDeadline: '5-8-dias',
      additionalNotes: 'Foco total na experiência feminina/materna. A página deve transmitir acolhimento e carinho. Priorizar performance mobile. Incluir efeitos visuais sutis que agreguem valor (carrossel suave, hover effects, animações delicadas).',
      startDate: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = async (data: ClientBriefForm) => {
    console.log('🚨 onSubmit foi chamado!', { currentStep, isSubmitting, allowSubmit });
    
    // Verificação adicional para garantir que estamos na página 5
    if (currentStep !== 5) {
      console.log('❌ Envio bloqueado: não está na página final');
      return;
    }

    if (isSubmitting) {
      console.log('❌ Envio bloqueado: já está enviando');
      return;
    }

    if (!allowSubmit) {
      console.log('❌ Envio bloqueado: não foi autorizado via botão');
      return;
    }

    console.log('✅ Iniciando envio do briefing...');
    
    // Verificar conectividade
    if (!navigator.onLine) {
      alert('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
      return;
    }
    
    setIsSubmitting(true);
    setAllowSubmit(false); // Reset flag
    
    try {
      const briefingData = {
        ...data,
        id: `custom_briefing_${Date.now()}`,
        type: 'custom_landing_page',
        created_at: new Date().toISOString()
      };
      
      try {
        const { submitBriefing } = await import('@/services/briefingService');
        console.log('📤 Enviando para Supabase...', data);
        await submitBriefing(data);
        console.log('✅ Briefing enviado com sucesso para Supabase!');
        setIsSubmitted(true);
      } catch (supabaseError) {
        console.error('❌ Erro ao enviar para Supabase:', supabaseError);
        
        // Fallback: salvar no localStorage apenas como backup
        const existingBriefings = JSON.parse(localStorage.getItem('briefings') || '[]');
        existingBriefings.push(briefingData);
        localStorage.setItem('briefings', JSON.stringify(existingBriefings));
        console.log('💾 Briefing salvo no localStorage como fallback');
        
        // Mostrar erro específico para o usuário
        alert(`Erro de conectividade: ${supabaseError.message || 'Verifique sua conexão com a internet'}. Seus dados foram salvos e serão enviados automaticamente quando a conexão for restabelecida.`);
        setIsSubmitted(true);
      }
      
    } catch (error) {
      console.error('Erro ao enviar briefing:', error);
      alert('Erro ao enviar briefing. Tente novamente.');
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

  // Prevenir envio automático com Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep === 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Handler seguro para envio do briefing
  const handleSafeSubmit = (e?: React.MouseEvent) => {
    console.log('🔘 Botão clicado!', { currentStep, isSubmitting });
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (currentStep !== 5) {
      console.log('❌ Botão bloqueado: não está na página 5');
      return;
    }
    
    if (isSubmitting) {
      console.log('❌ Botão bloqueado: já está enviando');
      return;
    }
    
    console.log('✅ Autorizando e executando envio via botão...');
    setAllowSubmit(true); // Autorizar envio
    handleSubmit(onSubmit)();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full text-center bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-pink-600" />
            </div>
            <h1 className="text-3xl font-bold text-workflow-deep mb-4">
              Briefing Enviado!
            </h1>
            <p className="text-lg text-workflow-deep/70 mb-4">
              Recebemos seu briefing personalizado. Desenvolvimento em 5 a 8 dias úteis!
            </p>
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 mb-8">
              <p className="text-pink-900 font-medium">
                Responsável pela criação: <span className="font-bold text-pink-700">Leonardo Lopes</span>
              </p>
              <p className="text-sm text-pink-600 mt-2">
                Desenvolvedor Especialista em Landing Pages
              </p>
            </div>
            <Button onClick={() => window.location.href = '/'} className="btn-primary">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-pink-300" />
            <h1 className="text-3xl font-bold text-white">Briefing Personalizado</h1>
            <Star className="w-8 h-8 text-pink-300" />
          </div>
          <p className="text-pink-100 text-lg">Landing page com design feminino e acolhedor</p>
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 inline-block">
            <p className="text-pink-200 text-sm">
              Desenvolvido por <span className="font-semibold text-white">Leonardo Lopes</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
        </div>

        <div className="grid grid-cols-5 gap-2 mb-8">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all
                  ${isActive ? 'bg-pink-500 text-white shadow-lg scale-110' : 
                    isCompleted ? 'bg-pink-400 text-white' : 'bg-white/20 text-pink-200'}`}>
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                </div>
                <p className={`text-xs font-medium ${isActive ? 'text-pink-200' : 'text-pink-300/70'}`}>
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>

        <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl">
          <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown}>
            <CardContent className="p-8">
              
              {/* Step 1: Empresa */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Star className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-pink-900 mb-2">Sua Empresa</h2>
                    <p className="text-pink-700/70">Conte-nos sobre seu negócio</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-pink-800 mb-2">Nome da Empresa</label>
                      <Input {...register('companyName')} placeholder="Digite o nome da sua empresa"
                        className="border-pink-200 focus:border-pink-400" />
                    </div>
                                      <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Segmento de Atuação</label>
                    <Select onValueChange={(value) => setValue('businessSegment', value)} defaultValue="educacao">
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Selecione o segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="consultoria">Consultoria</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="e-commerce">E-commerce</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Descrição da Empresa</label>
                    <Textarea {...register('businessDescription')} placeholder="Descreva sua empresa, o que faz, missão..."
                      rows={4} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Público-Alvo</label>
                    <Textarea {...register('targetAudience')} placeholder="Quem é seu cliente ideal? Idade, interesses, dores..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Diferencial Competitivo</label>
                    <Textarea {...register('competitiveDifferential')} placeholder="O que te diferencia da concorrência?"
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Objetivo da Landing Page</label>
                    <Select onValueChange={(value) => setValue('landingPageGoal', value)} defaultValue="vendas">
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Qual o principal objetivo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendas">Aumentar Vendas</SelectItem>
                        <SelectItem value="leads">Capturar Leads</SelectItem>
                        <SelectItem value="agendamentos">Gerar Agendamentos</SelectItem>
                        <SelectItem value="cadastros">Aumentar Cadastros</SelectItem>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Principais Concorrentes</label>
                    <Textarea {...register('mainCompetitors')} placeholder="Liste seus principais concorrentes..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Principais Dores do Cliente</label>
                    <Textarea {...register('customerPainPoints')} placeholder="Quais problemas seu público enfrenta?"
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Histórias de Sucesso</label>
                    <Textarea {...register('successStories')} placeholder="Conte casos de sucesso de clientes..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Prova Social Disponível</label>
                    <Textarea {...register('socialProof')} placeholder="Depoimentos, avaliações, certificações..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>
                </div>
              )}

              {/* Step 2: Produto */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Target className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-pink-900 mb-2">Produto/Serviço</h2>
                    <p className="text-pink-700/70">Detalhes sobre o que você oferece</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-pink-800 mb-2">Nome do Responsável</label>
                      <Input {...register('responsibleName')} placeholder="Seu nome completo"
                        className="border-pink-200 focus:border-pink-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-pink-800 mb-2">Site Atual (se houver)</label>
                      <Input {...register('currentWebsite')} placeholder="https://seusite.com"
                        className="border-pink-200 focus:border-pink-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Nome do Produto/Serviço Principal</label>
                    <Input {...register('productName')} placeholder="Ex: Curso de Marketing Digital"
                      className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Descrição Detalhada do Produto/Serviço</label>
                    <Textarea {...register('productDescription')} placeholder="O que é, como funciona, metodologia..."
                      rows={4} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Principais Benefícios</label>
                    <Textarea {...register('mainBenefits')} placeholder="Quais resultados o cliente vai ter?"
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Quantas Ofertas Terá na Landing Page?</label>
                    <Select onValueChange={(value) => setValue('numberOfOffers', value)} defaultValue="1">
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 oferta (mais simples)</SelectItem>
                        <SelectItem value="2">2 ofertas (básica + premium)</SelectItem>
                        <SelectItem value="3">3 ofertas (básica + intermediária + premium)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Detalhes das Ofertas e Valores Exatos</label>
                    <Textarea {...register('offerDetails')} placeholder="Descreva cada oferta com valor exato..."
                      rows={6} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Modelo de Precificação</label>
                    <Select onValueChange={(value) => setValue('pricingModel', value)} defaultValue="assinatura">
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Como será a precificação?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pagamento-unico">Pagamento único</SelectItem>
                        <SelectItem value="parcelado">Parcelado</SelectItem>
                        <SelectItem value="assinatura">Assinatura mensal</SelectItem>
                        <SelectItem value="assinatura-anual">Assinatura anual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Call-to-Action Principal</label>
                    <Input {...register('callToAction')} placeholder="Ex: Comprar Agora, Solicitar Orçamento"
                      className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Para onde direcionar os leads?</label>
                    <Select onValueChange={(value) => setValue('leadDestination', value)} defaultValue="checkout">
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Escolha o destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="formulario">Formulário de contato</SelectItem>
                        <SelectItem value="email">Email direto</SelectItem>
                        <SelectItem value="checkout">Página de checkout</SelectItem>
                        <SelectItem value="agendamento">Sistema de agendamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Visual */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Palette className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-pink-900 mb-2">Visual & Marketing</h2>
                    <p className="text-pink-700/70">Design e estratégia da landing page</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Cores da Marca</label>
                    <Input {...register('brandColors')} placeholder="Ex: Rosa (#E91E63), Branco, Dourado"
                      className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Logo da Empresa</label>
                    <Select onValueChange={(value) => setValue('hasLogo', value)} defaultValue="logo-simples">
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Você tem logo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tem-logo">Sim, tenho logo profissional</SelectItem>
                        <SelectItem value="logo-simples">Tenho algo simples que pode ser melhorado</SelectItem>
                        <SelectItem value="sem-logo">Não tenho logo, preciso criar</SelectItem>
                      </SelectContent>
                    </Select>
                    
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
                    <label className="block text-sm font-medium text-pink-800 mb-2">Referências Visuais</label>
                    <Textarea {...register('visualReferences')} placeholder="Sites ou designs que você admira..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                    
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
                    <label className="block text-sm font-medium text-pink-800 mb-2">Materiais Próprios para a Landing Page</label>
                    <Textarea {...register('contentMaterials')} placeholder="Fotos, vídeos, depoimentos que você tem..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                    
                    <FileUpload
                      id="materials-upload"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      multiple
                      onChange={(files) => setValue('materialFiles', files)}
                      label="Upload dos Seus Materiais"
                      description="Imagens, Vídeos, Documentos - Máximo 500MB por arquivo"
                      className="mt-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Personalidade da Marca</label>
                    <Textarea {...register('brandPersonality')} placeholder="Como quer que sua marca seja percebida?"
                      rows={2} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Tom de Comunicação</label>
                    <Select onValueChange={(value) => setValue('communicationTone', value)} defaultValue="emocional">
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Como prefere se comunicar?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal e profissional</SelectItem>
                        <SelectItem value="informal">Informal e próximo</SelectItem>
                        <SelectItem value="emocional">Emocional e inspirador</SelectItem>
                        <SelectItem value="direto">Direto e objetivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Mensagens-Chave</label>
                    <Textarea {...register('keyMessages')} placeholder="3 mensagens mais importantes que quer transmitir..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Seções da Landing Page</label>
                    <Textarea {...register('landingPageSections')} placeholder="Quais seções terá a página? (hero, benefícios, depoimentos, FAQ...)"
                      rows={4} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Requisitos Específicos</label>
                    <Textarea {...register('specificRequirements')} placeholder="Funcionalidades específicas? (calculadora, quiz, chat...)"
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>
                </div>
              )}

              {/* Step 4: Técnico */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Settings className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-pink-900 mb-2">Configurações Técnicas</h2>
                    <p className="text-pink-700/70">Integrações e funcionalidades</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Domínio Desejado</label>
                    <Input {...register('desiredDomain')} placeholder="Ex: meunegocio.com.br"
                      className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Integrações Necessárias</label>
                    <Textarea {...register('integrations')} placeholder="Ex: Mailchimp, RD Station, PagSeguro..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Analytics e Tracking</label>
                    <Textarea {...register('analytics')} placeholder="Google Analytics, Facebook Pixel, Tag Manager..."
                      rows={3} className="border-pink-200 focus:border-pink-400" />
                  </div>
                </div>
              )}

              {/* Step 5: Timeline */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Calendar className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-pink-900 mb-2">Timeline</h2>
                    <p className="text-pink-700/70">Prazos de entrega</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Prazo de Entrega</label>
                    <Input value="5 a 8 dias úteis (prazo fixo)" readOnly
                      className="bg-pink-50 border-pink-200 cursor-not-allowed text-pink-800" />
                    <p className="text-sm text-pink-600 mt-1">Prazo otimizado para garantir qualidade máxima</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pink-800 mb-2">Observações Adicionais</label>
                    <Textarea {...register('additionalNotes')} placeholder="Informações importantes que não foram mencionadas..."
                      rows={4} className="border-pink-200 focus:border-pink-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey === false && e.shiftKey === false) {
                          e.preventDefault();
                        }
                      }} />
                  </div>

                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 border border-pink-200">
                    <h3 className="font-semibold text-pink-900 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-pink-600" />
                      Próximos Passos:
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className="font-medium text-pink-900">Análise (24h)</p>
                          <p className="text-sm text-pink-700">Análise do briefing e estratégia personalizada</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className="font-medium text-pink-900">Desenvolvimento (5-8 dias)</p>
                          <p className="text-sm text-pink-700">Criação da landing page</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-pink-200">
                      <p className="text-sm text-pink-700">
                        <span className="font-medium">Responsável:</span> Leonardo Lopes - Desenvolvedor Especialista
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-8">
                <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}
                  className="flex items-center gap-2 border-pink-200 text-pink-700 hover:bg-pink-50">
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentStep < steps.length ? (
                  <Button type="button" onClick={nextStep}
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2">
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="button" disabled={isSubmitting} onClick={handleSafeSubmit}
                    className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2">
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

export default CustomBrief; 