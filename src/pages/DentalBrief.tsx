import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CheckCircle, 
  Sparkles, 
  Palette, 
  Instagram, 
  FileText,
  Upload,
  User,
  MapPin,
  Phone,
  Send,
  Clock,
  Award,
  X,
  Image as ImageIcon
} from 'lucide-react';

// Schema de validação
const dentalBriefSchema = z.object({
  // Seção 1: Identidade da Marca
  clinicName: z.string().min(1, 'Nome da clínica é obrigatório'),
  logoFile: z.any().optional(),
  colorPreference: z.string().min(1, 'Selecione uma opção de cores'),
  colorCustom: z.string().optional(),
  
  // Seção 2: Conteúdo Estratégico
  instagramLink: z.string().optional(),
  mainTreatments: z.string().min(1, 'Informe os tratamentos principais'),
  slogan: z.string().optional(),
  contactInfo: z.string().min(1, 'Informe os dados de contato'),
  
  // Seção 3: Compromisso
  profilePhoto: z.any().optional(),
  agreedTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar o termo de compromisso'
  }),
});

type DentalBriefForm = z.infer<typeof dentalBriefSchema>;

const DentalBrief = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [logoFiles, setLogoFiles] = useState<FileList | null>(null);
  const [profileFiles, setProfileFiles] = useState<FileList | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

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

  // Generate preview URL for profile photo
  const handleProfileChange = (files: FileList | null) => {
    setProfileFiles(files);
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setProfilePreview(url);
      } else {
        setProfilePreview(null);
      }
    } else {
      setProfilePreview(null);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [logoPreview, profilePreview]);

  useEffect(() => {
    // Animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Set dark background and prevent horizontal overflow
    document.body.style.backgroundColor = '#020617';
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.backgroundColor = '#020617';
    document.documentElement.style.overflowX = 'hidden';
    
    return () => {
      clearTimeout(timer);
      document.body.style.backgroundColor = '';
      document.body.style.overflowX = '';
      document.documentElement.style.backgroundColor = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DentalBriefForm>({
    resolver: zodResolver(dentalBriefSchema),
    defaultValues: {
      colorPreference: 'keep_current',
      agreedTerms: false,
    }
  });

  const colorPreference = watch('colorPreference');

  const onSubmit = async (data: DentalBriefForm) => {
    setIsSubmitting(true);
    
    try {
      console.log('🦷 [DENTAL-DEBUG] Iniciando envio do briefing odontológico...');
      
      const { submitDentalBriefing } = await import('@/services/briefingService');
      
      const formData = {
        ...data,
        logoFile: logoFiles,
        profilePhoto: profileFiles,
      };
      
      console.log('🦷 [DENTAL-DEBUG] Dados do formulário:', formData);
      
      await submitDentalBriefing(formData);
      
      console.log('✅ [DENTAL-DEBUG] Briefing odontológico salvo com sucesso!');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('❌ [DENTAL-DEBUG] Erro ao enviar briefing:', error);
      alert('Erro ao enviar o briefing. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tela de sucesso
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 overflow-x-hidden w-full max-w-full">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none w-screen max-w-full" style={{ left: 0, right: 0 }}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] max-w-[50vw]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-[100px] max-w-[50vw]" />
        </div>
        
        <div className={`relative max-w-2xl w-full max-w-full text-center transition-all duration-1000 px-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 w-full max-w-full overflow-hidden">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 break-words w-full max-w-full">
                Briefing Enviado com Sucesso!
              </h1>
              <p className="text-lg text-white/60 mb-8 break-words w-full max-w-full">
                Recebemos todas as informações do seu projeto. O Designer Leonardo irá analisar seu briefing e criar a primeira versão do seu site em breve.
              </p>
              
              <div className="bg-gradient-to-r from-[#D4A574]/10 via-[#D4A574]/5 to-transparent rounded-2xl p-6 mb-8 border border-[#D4A574]/20 w-full max-w-full overflow-hidden">
                <div className="flex items-center justify-center gap-3 mb-2 w-full max-w-full">
                  <Clock className="w-5 h-5 text-[#D4A574] flex-shrink-0" />
                  <h3 className="font-semibold text-white break-words">Próximo Passo</h3>
                </div>
                <p className="text-sm text-white/60 break-words w-full max-w-full">
                  Você receberá um feedback em até 24 horas com a apresentação do seu novo site.
                </p>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full max-w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl"
              >
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 md:py-12 md:px-6 overflow-x-hidden w-full max-w-full">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none w-screen max-w-full" style={{ left: 0, right: 0 }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] max-w-[50vw]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-[100px] max-w-[50vw]" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] translate-x-0 max-w-[30vw]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 w-full px-0">
        {/* Header */}
        <div className={`text-center mb-10 w-full max-w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4A574]/20 to-purple-500/20 border border-[#D4A574]/30 mb-6 max-w-full">
            <Award className="w-4 h-4 text-[#D4A574] flex-shrink-0" />
            <span className="text-[#D4A574] text-sm font-medium">Briefing de Criação</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-2 break-words">
            Site Profissional{' '}
            <span className="bg-gradient-to-r from-[#D4A574] via-[#E8C9A9] to-[#D4A574] bg-clip-text text-transparent">
              Odontológico
            </span>
          </h1>
          
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-4 px-2">
            Preencha as informações abaixo para que eu possa desenhar a primeira versão do seu novo posicionamento digital.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 max-w-full">
            <Clock className="w-4 h-4 text-white/60 flex-shrink-0" />
            <span className="text-white/60 text-sm">Tempo estimado: 3 minutos</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* ============================================
              SEÇÃO 1: IDENTIDADE DA MARCA
              ============================================ */}
          <div className={`transition-all duration-1000 delay-100 w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-full overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A574]/20 to-[#D4A574]/10 border border-[#D4A574]/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#D4A574]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Seção 1: Identidade da Marca</h2>
                  <p className="text-white/50 text-sm">Informações básicas do seu consultório</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Nome da Clínica */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    1. Qual o nome exato que devemos usar no topo do site? *
                  </Label>
                  <p className="text-white/50 text-xs mb-3">
                    Ex: Dra. Ana Silva | Clínica Sorriso Perfeito
                  </p>
                  <Input
                    {...register('clinicName')}
                    placeholder="Digite o nome da clínica"
                    className="w-full max-w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#D4A574]/50 focus:ring-[#D4A574]/20"
                  />
                  {errors.clinicName && (
                    <p className="text-red-400 text-sm mt-2">{errors.clinicName.message}</p>
                  )}
                </div>

                {/* Upload do Logo */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    2. Sobre o Logotipo
                  </Label>
                  <p className="text-white/50 text-xs mb-3">
                    Por favor, anexe seu logo aqui (preferência em PNG/Fundo transparente ou Vetor). 
                    Se não tiver o arquivo agora, pode me enviar pelo WhatsApp depois.
                  </p>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,.pdf,.ai,.eps,.svg"
                      className="hidden"
                      id="logo-upload"
                      onChange={(e) => {
                        handleLogoChange(e.target.files);
                        setValue('logoFile', e.target.files);
                      }}
                    />
                    
                    {/* Preview da imagem do logo */}
                    {logoPreview ? (
                      <div className="relative w-full max-w-full rounded-xl overflow-hidden bg-white/5 border border-white/20 p-4">
                        <div className="flex items-center gap-4 w-full max-w-full">
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/10 border border-white/20">
                            <img 
                              src={logoPreview} 
                              alt="Preview do logo" 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                            <p className="text-white/80 text-sm font-medium truncate">
                              {logoFiles?.[0]?.name || 'Logo selecionado'}
                            </p>
                            <p className="text-white/50 text-xs mt-1">
                              {logoFiles?.[0] && `${(logoFiles[0].size / 1024 / 1024).toFixed(2)} MB`}
                            </p>
                            <label 
                              htmlFor="logo-upload"
                              className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs cursor-pointer transition-colors"
                            >
                              <Upload className="w-3 h-3" />
                              Trocar arquivo
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleLogoChange(null);
                              setValue('logoFile', null);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors flex-shrink-0"
                            aria-label="Remover logo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="logo-upload"
                        className="flex flex-col items-center justify-center w-full max-w-full h-32 border-2 border-dashed border-white/20 rounded-xl hover:border-[#D4A574]/50 transition-colors cursor-pointer bg-white/5 hover:bg-white/10"
                      >
                        <Upload className="w-8 h-8 text-white/40 mb-2" />
                        <span className="text-white/60 text-sm text-center px-2">
                          {logoFiles && logoFiles.length > 0 
                            ? `${logoFiles.length} arquivo(s) selecionado(s)` 
                            : 'Clique para fazer upload do logo'}
                        </span>
                        <span className="text-white/40 text-xs mt-1 text-center px-2">PNG, JPG, SVG, PDF, AI (máx. 10MB)</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Cores da Marca */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    3. Cores da Marca *
                  </Label>
                  
                  <RadioGroup
                    value={colorPreference}
                    onValueChange={(value) => setValue('colorPreference', value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4A574]/30 transition-colors">
                      <RadioGroupItem value="keep_current" id="keep_current" className="border-white/30 text-[#D4A574]" />
                      <Label htmlFor="keep_current" className="text-white/80 cursor-pointer flex-1">
                        Quero manter as cores que já uso no meu Instagram/Logo
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4A574]/30 transition-colors">
                      <RadioGroupItem value="new_suggestion" id="new_suggestion" className="border-white/30 text-[#D4A574]" />
                      <Label htmlFor="new_suggestion" className="text-white/80 cursor-pointer flex-1">
                        Quero uma sugestão de cores novas (Padrão Dark/Premium)
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4A574]/30 transition-colors">
                      <RadioGroupItem value="custom" id="custom" className="border-white/30 text-[#D4A574]" />
                      <Label htmlFor="custom" className="text-white/80 cursor-pointer flex-1">
                        Outro
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {colorPreference === 'custom' && (
                    <Input
                      {...register('colorCustom')}
                      placeholder="Descreva suas preferências de cores"
                      className="mt-3 w-full max-w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#D4A574]/50"
                    />
                  )}
                  
                  {errors.colorPreference && (
                    <p className="text-red-400 text-sm mt-2">{errors.colorPreference.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================
              SEÇÃO 2: CONTEÚDO ESTRATÉGICO
              ============================================ */}
          <div className={`transition-all duration-1000 delay-200 w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-full overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Seção 2: Conteúdo Estratégico</h2>
                  <p className="text-white/50 text-sm">Informações para compor seu site</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Link do Instagram */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    4. Link do seu Instagram (Principal Vitrine)
                  </Label>
                  <p className="text-white/50 text-xs mb-3">
                    Vou utilizar suas melhores fotos postadas lá para compor o visual do site. Coloque o link aqui:
                  </p>
                  <div className="relative w-full max-w-full">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                    <Input
                      {...register('instagramLink')}
                      placeholder="https://instagram.com/sua_clinica"
                      className="w-full max-w-full pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {/* Tratamentos Principais */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    5. Quais são os 4 principais tratamentos "Carro-Chefe" da clínica? *
                  </Label>
                  <p className="text-white/50 text-xs mb-3">
                    Liste apenas os principais (aqueles que você mais quer vender). 
                    Ex: Implantes, Lentes de Contato, Harmonização, Ortodontia.
                  </p>
                  <Textarea
                    {...register('mainTreatments')}
                    placeholder="1. Implantes&#10;2. Lentes de Contato Dental&#10;3. Harmonização Orofacial&#10;4. Ortodontia Invisível"
                    rows={4}
                    className="w-full max-w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 resize-none"
                  />
                  {errors.mainTreatments && (
                    <p className="text-red-400 text-sm mt-2">{errors.mainTreatments.message}</p>
                  )}
                </div>

                {/* Slogan */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    6. Frase de Impacto (Slogan)
                  </Label>
                  <p className="text-white/50 text-xs mb-3">
                    Uma frase curta que define sua promessa. Se não tiver, deixe em branco que eu crio uma sugestão.
                  </p>
                  <Input
                    {...register('slogan')}
                    placeholder="Ex: Reabilitação oral de alto padrão"
                    className="w-full max-w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
                  />
                  <div className="flex flex-wrap gap-2 mt-3 w-full max-w-full">
                    <span className="text-xs text-white/40 px-3 py-1 rounded-full bg-white/5 border border-white/10 break-words">
                      "Seu sorriso é nossa prioridade"
                    </span>
                    <span className="text-xs text-white/40 px-3 py-1 rounded-full bg-white/5 border border-white/10 break-words">
                      "Odontologia moderna e humanizada"
                    </span>
                    <span className="text-xs text-white/40 px-3 py-1 rounded-full bg-white/5 border border-white/10 break-words">
                      "Reabilitação oral de alto padrão"
                    </span>
                  </div>
                </div>

                {/* Dados de Contato */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    7. Dados de Contato (Rodapé) *
                  </Label>
                  <p className="text-white/50 text-xs mb-3">
                    Endereço completo da clínica e o número do WhatsApp para agendamentos.
                  </p>
                  <Textarea
                    {...register('contactInfo')}
                    placeholder="Endereço: Rua Exemplo, 123 - Bairro - Cidade/UF&#10;WhatsApp: (11) 99999-9999"
                    rows={3}
                    className="w-full max-w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 resize-none"
                  />
                  {errors.contactInfo && (
                    <p className="text-red-400 text-sm mt-2">{errors.contactInfo.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================
              SEÇÃO 3: O COMPROMISSO
              ============================================ */}
          <div className={`transition-all duration-1000 delay-300 w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-full overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Seção 3: O Compromisso</h2>
                  <p className="text-white/50 text-sm">Foto profissional e termo de criação</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Foto de Perfil */}
                <div>
                  <Label className="text-white/90 text-sm font-medium mb-2 block">
                    8. Foto de Perfil (Doutor/a)
                  </Label>
                  <p className="text-white/50 text-xs mb-3">
                    Anexe aqui sua melhor foto de perfil profissional para a seção "Sobre Mim".
                  </p>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="profile-upload"
                      onChange={(e) => {
                        handleProfileChange(e.target.files);
                        setValue('profilePhoto', e.target.files);
                      }}
                    />
                    
                    {/* Preview da foto de perfil */}
                    {profilePreview ? (
                      <div className="relative w-full max-w-full rounded-xl overflow-hidden bg-white/5 border border-white/20 p-4">
                        <div className="flex items-center gap-4 w-full max-w-full">
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-full overflow-hidden bg-white/10 border-2 border-green-500/30">
                            <img 
                              src={profilePreview} 
                              alt="Preview da foto de perfil" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                            <p className="text-white/80 text-sm font-medium truncate">
                              {profileFiles?.[0]?.name || 'Foto selecionada'}
                            </p>
                            <p className="text-white/50 text-xs mt-1">
                              {profileFiles?.[0] && `${(profileFiles[0].size / 1024 / 1024).toFixed(2)} MB`}
                            </p>
                            <label 
                              htmlFor="profile-upload"
                              className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-xs cursor-pointer transition-colors"
                            >
                              <Upload className="w-3 h-3" />
                              Trocar foto
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleProfileChange(null);
                              setValue('profilePhoto', null);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors flex-shrink-0"
                            aria-label="Remover foto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="profile-upload"
                        className="flex flex-col items-center justify-center w-full max-w-full h-32 border-2 border-dashed border-white/20 rounded-xl hover:border-green-500/50 transition-colors cursor-pointer bg-white/5 hover:bg-white/10"
                      >
                        <User className="w-8 h-8 text-white/40 mb-2" />
                        <span className="text-white/60 text-sm text-center px-2">
                          {profileFiles && profileFiles.length > 0 
                            ? `${profileFiles.length} arquivo(s) selecionado(s)` 
                            : 'Clique para fazer upload da foto'}
                        </span>
                        <span className="text-white/40 text-xs mt-1 text-center px-2">JPG, PNG (máx. 10MB)</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Termo de Compromisso */}
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-xl p-6 border border-amber-500/20 w-full max-w-full overflow-hidden">
                  <Label className="text-white/90 text-sm font-medium mb-4 block w-full max-w-full">
                    9. Termo de Criação (Obrigatório) *
                  </Label>
                  <p className="text-white/60 text-sm mb-4 leading-relaxed break-words w-full max-w-full">
                    "Estou ciente que o Designer Leonardo irá dedicar horas de trabalho exclusivo e personalizado para criar este projeto sem custo antecipado. Comprometo-me a analisar o resultado e dar um feedback (positivo ou negativo) em até 24h após a apresentação."
                  </p>
                  
                  <label 
                    htmlFor="terms" 
                    className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors w-full max-w-full"
                  >
                    <Checkbox
                      id="terms"
                      checked={watch('agreedTerms')}
                      onCheckedChange={(checked) => setValue('agreedTerms', checked as boolean)}
                      className="h-5 w-5 border-2 border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 flex-shrink-0"
                    />
                    <span className="text-white/80 font-medium group-hover:text-white transition-colors break-words flex-1 min-w-0">
                      Sim, me comprometo.
                    </span>
                  </label>
                  
                  {errors.agreedTerms && (
                    <p className="text-red-400 text-sm mt-3 break-words w-full max-w-full">{errors.agreedTerms.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className={`transition-all duration-1000 delay-400 w-full max-w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Send className="w-5 h-5" />
                  <span>Enviar Briefing</span>
                </div>
              )}
            </Button>
            
            <p className="text-center text-white/40 text-sm mt-4">
              Ao enviar, você concorda com os termos de criação acima.
            </p>
          </div>
        </form>

        {/* Footer Credits */}
        <div className={`text-center mt-12 w-full max-w-full transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/30 text-sm px-2 break-words">
            Desenvolvido por <span className="text-[#D4A574]">Leonardo Lopes</span> | UX/UI Designer & Developer
          </p>
        </div>
      </div>
    </div>
  );
};

export default DentalBrief;
