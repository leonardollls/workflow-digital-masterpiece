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
import { CheckCircle, ArrowLeft, ArrowRight, Building, Users, Palette, Settings, Calendar, Send } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Schema de validação para Sites Institucionais
const institutionalBriefSchema = z.object({
  // Informações da Empresa
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  businessSegment: z.string().min(1, 'Segmento é obrigatório'),
  companyDescription: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres'),
  companyMission: z.string().min(20, 'Missão da empresa é obrigatória'),
  companyVision: z.string().min(20, 'Visão da empresa é obrigatória'),
  companyValues: z.string().min(20, 'Valores da empresa são obrigatórios'),
  foundingYear: z.string().min(1, 'Ano de fundação é obrigatório'),
  numberOfEmployees: z.string().min(1, 'Número de funcionários é obrigatório'),
  locations: z.string().min(1, 'Localização é obrigatória'),
  
  // Informações de Contato
  responsibleName: z.string().min(2, 'Nome do responsável é obrigatório'),
  currentWebsite: z.string().optional(),
  
  // Objetivos do Site
  siteObjectives: z.array(z.string()).min(1, 'Selecione pelo menos um objetivo'),
  targetAudience: z.string().min(20, 'Público-alvo deve ser descrito'),
  keyMessages: z.string().min(30, 'Mensagens-chave são obrigatórias'),
  
  // Conteúdo e Estrutura
  desiredPages: z.array(z.string()).min(1, 'Selecione pelo menos uma página'),
  specialFeatures: z.array(z.string()).optional(),
  contentMaterials: z.string().optional(),
  socialMediaIntegration: z.boolean().default(false),
  blogRequired: z.boolean().default(false),
  newsSection: z.boolean().default(false),
  
  // Design e Branding
  brandColors: z.string().optional(),
  hasLogo: z.string().min(1, 'Informar sobre logo é obrigatório'),
  designStyle: z.string().min(1, 'Estilo de design é obrigatório'),
  visualReferences: z.string().optional(),
  
  // Funcionalidades Técnicas
  multiLanguage: z.boolean().default(false),
  accessibilityRequired: z.boolean().default(false),
  seoOptimization: z.boolean().default(true),
  analyticsRequired: z.boolean().default(true),
  securityRequirements: z.string().optional(),
  
  // Timeline e Orçamento
  deliveryDeadline: z.string().min(1, 'Prazo de entrega é obrigatório'),
  budget: z.string().min(1, 'Orçamento é obrigatório'),
  additionalNotes: z.string().optional(),
});

type InstitutionalBriefForm = z.infer<typeof institutionalBriefSchema>;

const steps = [
  { id: 1, title: 'Empresa', description: 'Informações institucionais', icon: Building },
  { id: 2, title: 'Objetivos', description: 'Metas e público-alvo', icon: Users },
  { id: 3, title: 'Conteúdo', description: 'Estrutura e páginas', icon: Palette },
  { id: 4, title: 'Técnico', description: 'Funcionalidades', icon: Settings },
  { id: 5, title: 'Timeline', description: 'Prazos e orçamento', icon: Calendar },
];

const InstitutionalBrief = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InstitutionalBriefForm>({
    resolver: zodResolver(institutionalBriefSchema),
    mode: 'onChange',
    defaultValues: {
      siteObjectives: [],
      desiredPages: [],
      specialFeatures: [],
      socialMediaIntegration: false,
      blogRequired: false,
      newsSection: false,
      multiLanguage: false,
      accessibilityRequired: false,
      seoOptimization: true,
      analyticsRequired: true,
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const watchedValues = watch();

  const progressPercentage = (currentStep / steps.length) * 100;

  const onSubmit = async (data: InstitutionalBriefForm) => {
    setIsSubmitting(true);
    
    try {
      console.log('📝 Dados do briefing institucional:', data);
      
      // Salvar no localStorage como fallback
      const briefingData = {
        ...data,
        id: `institutional_${Date.now()}`,
        type: 'institutional',
        created_at: new Date().toISOString()
      };
      
      const existingBriefings = JSON.parse(localStorage.getItem('institutional_briefings') || '[]');
      existingBriefings.push(briefingData);
      localStorage.setItem('institutional_briefings', JSON.stringify(existingBriefings));
      
      console.log('✅ Briefing institucional salvo localmente');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('❌ Erro ao enviar briefing institucional:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-workflow-deep via-purple-900 to-workflow-deep flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full text-center bg-white/95 backdrop-blur-xl border-0 shadow-workflow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-workflow-deep mb-4">
                Briefing Institucional Enviado! 🏢
              </h1>
              <p className="text-lg text-workflow-deep/70 mb-8">
                Recebemos todas as informações do seu site institucional. Nossa equipe irá analisar seu briefing e entrar em contato em até 24 horas com a proposta detalhada.
              </p>
              
              <div className="bg-workflow-energy/10 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-workflow-deep mb-2">Próximo Passo</h3>
                <p className="text-sm text-workflow-deep/70">
                  Análise dos requisitos e estruturação do projeto institucional
                </p>
              </div>
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
            Briefing <span className="text-gradient-rainbow">Institucional</span>
          </h1>
          <p className="text-xl text-workflow-zen/80 max-w-2xl mx-auto">
            Vamos criar um site institucional profissional que represente sua empresa
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
                    <Building className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Informações Institucionais</h2>
                    <p className="text-workflow-deep/70">Conte-nos sobre sua empresa e história</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Nome da Empresa *
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
                        Segmento *
                      </label>
                      <Select onValueChange={(value) => setValue('businessSegment', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o segmento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="consultoria">Consultoria</SelectItem>
                          <SelectItem value="educacao">Educação</SelectItem>
                          <SelectItem value="saude">Saúde</SelectItem>
                          <SelectItem value="financeiro">Financeiro</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="servicos">Serviços</SelectItem>
                          <SelectItem value="comercio">Comércio</SelectItem>
                          <SelectItem value="ong">ONG/Terceiro Setor</SelectItem>
                          <SelectItem value="governo">Governo</SelectItem>
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
                      Descrição da Empresa *
                    </label>
                    <Textarea 
                      {...register('companyDescription')}
                      placeholder="Descreva sua empresa, o que faz, história, área de atuação..."
                      rows={4}
                      className={errors.companyDescription ? 'border-red-500' : ''}
                    />
                    {errors.companyDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyDescription.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Missão da Empresa *
                      </label>
                      <Textarea 
                        {...register('companyMission')}
                        placeholder="Qual é a missão da sua empresa?"
                        rows={2}
                        className={errors.companyMission ? 'border-red-500' : ''}
                      />
                      {errors.companyMission && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyMission.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Visão da Empresa *
                      </label>
                      <Textarea 
                        {...register('companyVision')}
                        placeholder="Onde sua empresa quer chegar?"
                        rows={2}
                        className={errors.companyVision ? 'border-red-500' : ''}
                      />
                      {errors.companyVision && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyVision.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Valores da Empresa *
                      </label>
                      <Textarea 
                        {...register('companyValues')}
                        placeholder="Quais são os valores que guiam sua empresa?"
                        rows={2}
                        className={errors.companyValues ? 'border-red-500' : ''}
                      />
                      {errors.companyValues && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyValues.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Ano de Fundação *
                      </label>
                      <Input 
                        {...register('foundingYear')}
                        placeholder="Ex: 2020"
                        type="number"
                        className={errors.foundingYear ? 'border-red-500' : ''}
                      />
                      {errors.foundingYear && (
                        <p className="text-red-500 text-sm mt-1">{errors.foundingYear.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Número de Funcionários *
                      </label>
                      <Select onValueChange={(value) => setValue('numberOfEmployees', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 funcionários</SelectItem>
                          <SelectItem value="11-50">11-50 funcionários</SelectItem>
                          <SelectItem value="51-200">51-200 funcionários</SelectItem>
                          <SelectItem value="201-500">201-500 funcionários</SelectItem>
                          <SelectItem value="500+">Mais de 500</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.numberOfEmployees && (
                        <p className="text-red-500 text-sm mt-1">{errors.numberOfEmployees.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Localização *
                      </label>
                      <Input 
                        {...register('locations')}
                        placeholder="Ex: São Paulo, SP"
                        className={errors.locations ? 'border-red-500' : ''}
                      />
                      {errors.locations && (
                        <p className="text-red-500 text-sm mt-1">{errors.locations.message}</p>
                      )}
                    </div>
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
                        placeholder="https://seusite.com.br"
                        type="url"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Objetivos */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Users className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Objetivos e Público</h2>
                    <p className="text-workflow-deep/70">Defina as metas e audiência do site</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-3">
                      Objetivos do Site Institucional * (selecione todas as opções relevantes)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Apresentar a empresa',
                        'Gerar credibilidade',
                        'Atrair novos clientes',
                        'Recrutar talentos',
                        'Divulgar produtos/serviços',
                        'Comunicar notícias',
                        'Fortalecer marca',
                        'Facilitar contato',
                        'Mostrar cases de sucesso',
                        'Educar o mercado'
                      ].map((objective) => (
                        <div key={objective} className="flex items-center space-x-2">
                          <Checkbox 
                            id={objective}
                            checked={watchedValues.siteObjectives?.includes(objective)}
                            onCheckedChange={(checked) => {
                              const current = watchedValues.siteObjectives || [];
                              if (checked) {
                                setValue('siteObjectives', [...current, objective]);
                              } else {
                                setValue('siteObjectives', current.filter(item => item !== objective));
                              }
                            }}
                          />
                          <label htmlFor={objective} className="text-sm text-workflow-deep">
                            {objective}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.siteObjectives && (
                      <p className="text-red-500 text-sm mt-1">{errors.siteObjectives.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Público-Alvo Principal *
                    </label>
                    <Textarea 
                      {...register('targetAudience')}
                      placeholder="Descreva quem são os visitantes ideais: clientes em potencial, investidores, funcionários, parceiros, etc."
                      rows={3}
                      className={errors.targetAudience ? 'border-red-500' : ''}
                    />
                    {errors.targetAudience && (
                      <p className="text-red-500 text-sm mt-1">{errors.targetAudience.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Mensagens-Chave *
                    </label>
                    <Textarea 
                      {...register('keyMessages')}
                      placeholder="Quais são as principais mensagens que o site deve transmitir sobre sua empresa?"
                      rows={3}
                      className={errors.keyMessages ? 'border-red-500' : ''}
                    />
                    {errors.keyMessages && (
                      <p className="text-red-500 text-sm mt-1">{errors.keyMessages.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Conteúdo */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Palette className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Estrutura e Conteúdo</h2>
                    <p className="text-workflow-deep/70">Defina páginas e funcionalidades</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-3">
                      Páginas Desejadas * (selecione todas as necessárias)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Home',
                        'Sobre Nós',
                        'Produtos/Serviços',
                        'Equipe',
                        'Contato',
                        'Blog/Notícias',
                        'Cases de Sucesso',
                        'Trabalhe Conosco',
                        'Política de Privacidade',
                        'Termos de Uso',
                        'FAQ',
                        'Localização/Filiais'
                      ].map((page) => (
                        <div key={page} className="flex items-center space-x-2">
                          <Checkbox 
                            id={page}
                            checked={watchedValues.desiredPages?.includes(page)}
                            onCheckedChange={(checked) => {
                              const current = watchedValues.desiredPages || [];
                              if (checked) {
                                setValue('desiredPages', [...current, page]);
                              } else {
                                setValue('desiredPages', current.filter(item => item !== page));
                              }
                            }}
                          />
                          <label htmlFor={page} className="text-sm text-workflow-deep">
                            {page}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.desiredPages && (
                      <p className="text-red-500 text-sm mt-1">{errors.desiredPages.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-3">
                      Funcionalidades Especiais (opcionais)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Área do Cliente',
                        'Portal do Funcionário',
                        'Galeria de Fotos',
                        'Downloads/Recursos',
                        'Newsletter',
                        'Chat Online',
                        'Agenda de Eventos',
                        'Certificações',
                        'Depoimentos',
                        'Mapa Interativo'
                      ].map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={feature}
                            checked={watchedValues.specialFeatures?.includes(feature)}
                            onCheckedChange={(checked) => {
                              const current = watchedValues.specialFeatures || [];
                              if (checked) {
                                setValue('specialFeatures', [...current, feature]);
                              } else {
                                setValue('specialFeatures', current.filter(item => item !== feature));
                              }
                            }}
                          />
                          <label htmlFor={feature} className="text-sm text-workflow-deep">
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="socialMedia"
                        checked={watchedValues.socialMediaIntegration}
                        onCheckedChange={(checked) => setValue('socialMediaIntegration', checked as boolean)}
                      />
                      <label htmlFor="socialMedia" className="text-sm text-workflow-deep">
                        Integração com Redes Sociais
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="blog"
                        checked={watchedValues.blogRequired}
                        onCheckedChange={(checked) => setValue('blogRequired', checked as boolean)}
                      />
                      <label htmlFor="blog" className="text-sm text-workflow-deep">
                        Blog Integrado
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="news"
                        checked={watchedValues.newsSection}
                        onCheckedChange={(checked) => setValue('newsSection', checked as boolean)}
                      />
                      <label htmlFor="news" className="text-sm text-workflow-deep">
                        Seção de Notícias
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Materiais de Conteúdo Disponíveis
                    </label>
                    <Textarea 
                      {...register('contentMaterials')}
                      placeholder="Descreva que tipos de conteúdo você já possui: textos, fotos, vídeos, logos, etc."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Cores da Marca
                      </label>
                      <Input 
                        {...register('brandColors')}
                        placeholder="Ex: #0066CC, #FF6600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-workflow-deep mb-2">
                        Status do Logo *
                      </label>
                      <Select onValueChange={(value) => setValue('hasLogo', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="possui-profissional">Possuo logo profissional</SelectItem>
                          <SelectItem value="possui-simples">Possuo logo simples</SelectItem>
                          <SelectItem value="nao-possui">Não possuo logo</SelectItem>
                          <SelectItem value="precisa-redesign">Preciso redesenhar</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.hasLogo && (
                        <p className="text-red-500 text-sm mt-1">{errors.hasLogo.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Estilo de Design *
                    </label>
                    <Select onValueChange={(value) => setValue('designStyle', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estilo preferido" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moderno-minimalista">Moderno e Minimalista</SelectItem>
                        <SelectItem value="corporativo-tradicional">Corporativo Tradicional</SelectItem>
                        <SelectItem value="criativo-inovador">Criativo e Inovador</SelectItem>
                        <SelectItem value="elegante-sofisticado">Elegante e Sofisticado</SelectItem>
                        <SelectItem value="tecnologico-futurista">Tecnológico e Futurista</SelectItem>
                        <SelectItem value="jovem-dinamico">Jovem e Dinâmico</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.designStyle && (
                      <p className="text-red-500 text-sm mt-1">{errors.designStyle.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Referências Visuais
                    </label>
                    <Textarea 
                      {...register('visualReferences')}
                      placeholder="URLs de sites que você gosta, estilos de referência, etc."
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Técnico */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Settings className="w-12 h-12 text-workflow-energy mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Especificações Técnicas</h2>
                    <p className="text-workflow-deep/70">Funcionalidades e requisitos técnicos</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="multiLanguage"
                        checked={watchedValues.multiLanguage}
                        onCheckedChange={(checked) => setValue('multiLanguage', checked as boolean)}
                      />
                      <label htmlFor="multiLanguage" className="text-sm text-workflow-deep">
                        Site Multi-idioma
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="accessibility"
                        checked={watchedValues.accessibilityRequired}
                        onCheckedChange={(checked) => setValue('accessibilityRequired', checked as boolean)}
                      />
                      <label htmlFor="accessibility" className="text-sm text-workflow-deep">
                        Acessibilidade (WCAG)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="seo"
                        checked={watchedValues.seoOptimization}
                        onCheckedChange={(checked) => setValue('seoOptimization', checked as boolean)}
                      />
                      <label htmlFor="seo" className="text-sm text-workflow-deep">
                        Otimização SEO
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="analytics"
                        checked={watchedValues.analyticsRequired}
                        onCheckedChange={(checked) => setValue('analyticsRequired', checked as boolean)}
                      />
                      <label htmlFor="analytics" className="text-sm text-workflow-deep">
                        Google Analytics
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Requisitos de Segurança
                    </label>
                    <Textarea 
                      {...register('securityRequirements')}
                      placeholder="Descreva requisitos específicos de segurança, certificados SSL, compliance, etc."
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
                    <h2 className="text-2xl font-bold text-workflow-deep mb-2">Timeline e Investimento</h2>
                    <p className="text-workflow-deep/70">Defina prazos e orçamento</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Prazo de Entrega *
                    </label>
                    <Select onValueChange={(value) => setValue('deliveryDeadline', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15-dias">15 dias</SelectItem>
                        <SelectItem value="30-dias">30 dias</SelectItem>
                        <SelectItem value="45-dias">45 dias</SelectItem>
                        <SelectItem value="60-dias">60 dias</SelectItem>
                        <SelectItem value="negociar">A negociar</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.deliveryDeadline && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryDeadline.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Orçamento *
                    </label>
                    <Select onValueChange={(value) => setValue('budget', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a faixa de orçamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2000-5000">R$ 2.000 - R$ 5.000</SelectItem>
                        <SelectItem value="5000-10000">R$ 5.000 - R$ 10.000</SelectItem>
                        <SelectItem value="10000-20000">R$ 10.000 - R$ 20.000</SelectItem>
                        <SelectItem value="20000-plus">Acima de R$ 20.000</SelectItem>
                        <SelectItem value="negociar">A negociar</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-workflow-deep mb-2">
                      Observações Adicionais
                    </label>
                    <Textarea 
                      {...register('additionalNotes')}
                      placeholder="Alguma informação adicional importante para o projeto?"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
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
                    className="flex items-center gap-2"
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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