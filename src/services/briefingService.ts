import { supabase, uploadFile, getPublicUrl, saveBriefing, type ClientBriefing } from '@/lib/supabase'

// Tipo para o formulário - TODOS OS CAMPOS OPCIONAIS
export interface ClientBriefForm {
  companyName?: string
  businessSegment?: string
  businessDescription?: string
  targetAudience?: string
  competitiveDifferential?: string
  landingPageGoal?: string
  mainCompetitors?: string
  customerPainPoints?: string
  successStories?: string
  socialProof?: string
  responsibleName?: string
  currentWebsite?: string
  productName?: string
  productDescription?: string
  mainBenefits?: string
  numberOfOffers?: string
  offerDetails?: string
  pricingModel?: string
  guarantees?: string
  targetResults?: string
  urgencyFactors?: string
  objections?: string
  callToAction?: string
  leadDestination?: string
  landingPageSections?: string
  specificRequirements?: string
  brandColors?: string
  hasLogo?: string
  logoFiles?: FileList | null
  visualReferences?: string
  visualFiles?: FileList | null
  contentMaterials?: string
  materialFiles?: FileList | null
  brandPersonality?: string
  communicationTone?: string
  keyMessages?: string
  desiredDomain?: string
  integrations?: string
  analytics?: string
  deliveryDeadline?: string
  startDate?: string
  budget?: string
  additionalNotes?: string
}

// Tipo para briefing institucional - TODOS OS CAMPOS OPCIONAIS
export interface InstitutionalBriefForm {
  companyName?: string
  businessSegment?: string
  companyDescription?: string
  companyHistory?: string
  mission?: string
  vision?: string
  values?: string
  targetAudience?: string
  competitiveAdvantage?: string
  responsibleName?: string
  currentWebsite?: string
  websiteGoal?: string
  websiteType?: string
  mainFunctionalities?: string
  requiredPages?: string
  navigationStructure?: string
  contentHierarchy?: string
  servicesProducts?: string
  teamInfo?: string
  certifications?: string
  awardsRecognition?: string
  caseStudies?: string
  testimonials?: string
  brandColors?: string
  hasLogo?: string
  logoFiles?: FileList | null
  visualReferences?: string
  visualFiles?: FileList | null
  designStyle?: string
  // Novos campos de marketing
  mainCompetitors?: string
  customerPainPoints?: string
  customerObjections?: string
  communicationTone?: string
  keyMessages?: string
  specificRequirements?: string
  contentMaterials?: string
  materialFiles?: FileList | null
  contactForms?: string
  integrations?: string
  seoRequirements?: string
  analytics?: string
  desiredDomain?: string
  hostingPreferences?: string
  deliveryDeadline?: string
  startDate?: string
  budget?: string
  additionalNotes?: string
}

// Tipo para briefing de logo - TODOS OS CAMPOS OPCIONAIS
export interface LogoBriefForm {
  companyName?: string
  businessSegment?: string
  companyDescription?: string
  companyValues?: string
  targetAudience?: string
  brandPersonality?: string
  responsibleName?: string
  currentLogo?: string
  logoStyle?: string
  logoType?: string
  logoMood?: string
  messagesToConvey?: string
  competitorLogos?: string
  whatToAvoid?: string
  preferredColors?: string
  colorsToAvoid?: string
  symbolsElements?: string
  typographyPreference?: string
  visualReferences?: string
  visualFiles?: FileList | null
  logoApplications?: string
  requiredFormats?: string
  logoVersions?: string
  specificRequirements?: string
  deliveryDeadline?: string
  budget?: string
  additionalNotes?: string
}

// Tipo para briefing institucional salvo
export interface InstitutionalBriefing {
  id: string
  company_name: string
  business_segment: string
  company_description: string
  company_history?: string
  mission?: string
  vision?: string
  values?: string
  target_audience: string
  competitive_advantage: string
  responsible_name: string
  current_website?: string
  website_goal: string
  website_type: string
  main_functionalities: string
  required_pages: string
  navigation_structure?: string
  content_hierarchy?: string
  services_products: string
  team_info?: string
  certifications?: string
  awards_recognition?: string
  case_studies?: string
  testimonials?: string
  brand_colors?: string
  has_logo: string
  logo_files?: string[]
  visual_references?: string
  visual_files?: string[]
  design_style?: string
  // Novos campos de marketing
  main_competitors?: string
  customer_pain_points?: string
  customer_objections?: string
  communication_tone?: string
  key_messages?: string
  specific_requirements?: string
  content_materials?: string
  material_files?: string[]
  contact_forms?: string
  integrations?: string
  seo_requirements?: string
  analytics_tracking?: string
  domain_info: string
  hosting_preferences?: string
  deadline: string
  budget?: string
  start_date?: string
  additional_notes?: string
  created_at: string
  updated_at: string
  proposal_value?: number
  proposal_date?: string
}

// Função para fazer upload de múltiplos arquivos com tratamento robusto
const uploadFiles = async (files: FileList | null, bucket: string, folder: string): Promise<string[]> => {
  if (!files || files.length === 0) return []

  const uploadPromises = Array.from(files).map(async (file, index) => {
    const timestamp = Date.now()
    // Sanitizar nome do arquivo removendo caracteres especiais
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Substituir caracteres especiais por _
      .replace(/_{2,}/g, '_') // Remover múltiplos _ seguidos
      .toLowerCase()
    
    const fileName = `${folder}/${timestamp}_${index}_${sanitizedName}`
    
    try {
      console.log(`📁 [UPLOAD] Iniciando upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      
      // Verificações de validação
      if (file.size > 1024 * 1024 * 1024) {
        throw new Error(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo: 1GB`)
      }
      
      if (file.size === 0) {
        throw new Error(`Arquivo vazio ou corrompido`)
      }

      // Verificar tipos de arquivo permitidos
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml',
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        console.warn(`⚠️ Tipo de arquivo não validado: ${file.type} - Tentando upload mesmo assim`)
      }
      
      // Tentar upload com retry
      let uploadSuccess = false
      let lastError = null
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`📤 [UPLOAD] Tentativa ${attempt}/3 para ${sanitizedName}`)
      await uploadFile(file, bucket, fileName)
          const url = getPublicUrl(bucket, fileName)
          console.log(`✅ [UPLOAD] Sucesso: ${sanitizedName} -> ${url}`)
          uploadSuccess = true
          return url
        } catch (attemptError) {
          lastError = attemptError
          console.error(`❌ [UPLOAD] Tentativa ${attempt} falhou:`, attemptError)
          
          if (attempt < 3) {
            // Aguardar antes da próxima tentativa
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
          }
        }
      }
      
      if (!uploadSuccess) {
        throw lastError || new Error('Upload falhou após 3 tentativas')
      }
      
    } catch (error) {
      console.error(`❌ [UPLOAD] Erro final no arquivo ${file.name}:`, error)
      
      // Mensagem de erro mais específica
      let errorMessage = 'Erro desconhecido'
      if (error instanceof Error) {
        if (error.message.includes('413')) {
          errorMessage = 'Arquivo muito grande'
        } else if (error.message.includes('403')) {
          errorMessage = 'Sem permissão para upload'
        } else if (error.message.includes('400')) {
          errorMessage = 'Formato de arquivo inválido'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Erro de conexão'
        } else {
          errorMessage = error.message
        }
      }
      
      throw new Error(`${file.name}: ${errorMessage}`)
    }
  })

  try {
    console.log(`📁 [UPLOAD] Iniciando upload de ${files.length} arquivo(s)`)
    const results = await Promise.all(uploadPromises)
    console.log(`✅ [UPLOAD] Todos os ${results.length} arquivo(s) enviados com sucesso`)
    return results
  } catch (error) {
    console.error('❌ [UPLOAD] Erro geral no upload:', error)
    throw new Error(`Erro no upload: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

// Função auxiliar para retry
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`❌ Tentativa ${attempt}/${maxRetries} falhou:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Esperar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error('Máximo de tentativas excedido');
};

// Função principal para processar e enviar o briefing
export const submitBriefing = async (formData: ClientBriefForm): Promise<ClientBriefing> => {
  console.log('🔄 Iniciando submitBriefing...', { 
    device: navigator.userAgent,
    online: navigator.onLine,
    timestamp: new Date().toISOString()
  });
  
  try {
    // 1. Upload de arquivos com fallback em caso de erro
    console.log('📁 [DEBUG] Fazendo upload de arquivos...');
    let logoUrls: string[] = [];
    let visualUrls: string[] = [];
    let materialUrls: string[] = [];
    
    try {
      [logoUrls, visualUrls, materialUrls] = await Promise.all([
      uploadFiles(formData.logoFiles, 'briefing-files', 'logos'),
      uploadFiles(formData.visualFiles, 'briefing-files', 'visual-references'),
      uploadFiles(formData.materialFiles, 'briefing-files', 'materials')
      ]);
      console.log('✅ [DEBUG] Upload de arquivos concluído:', { 
        logoUrls: logoUrls.length, 
        visualUrls: visualUrls.length, 
        materialUrls: materialUrls.length 
      });
    } catch (uploadError) {
      console.error('❌ [DEBUG] Erro no upload de arquivos:', uploadError);
      console.log('⚠️ [DEBUG] Continuando sem arquivos para não bloquear o briefing...');
      
      // Mostrar erro específico para o usuário
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Erro desconhecido no upload';
      console.warn(`⚠️ Upload falhou: ${errorMessage}`);
      
      // Continuar sem arquivos - não bloquear o briefing
      logoUrls = [];
      visualUrls = [];
      materialUrls = [];
    }

    // 2. Preparar dados para o banco (CORRIGIDO - todos os campos obrigatórios)
    const briefingData: Omit<ClientBriefing, 'id' | 'created_at' | 'updated_at'> = {
      // Campos obrigatórios (NOT NULL) - garantir que sempre tenham valor
      company_name: formData.companyName || 'Nome não informado',
      business_segment: formData.businessSegment || 'Segmento não informado',
      company_description: formData.businessDescription || 'Descrição não informada',
      target_audience: formData.targetAudience || 'Público-alvo não informado',
      competitive_advantage: formData.competitiveDifferential || 'Diferencial não informado',
      landing_page_goal: formData.landingPageGoal || 'Objetivo não informado',
      responsible_name: formData.responsibleName || 'Responsável não informado',
      product_name: formData.productName || 'Produto não informado',
      product_description: formData.productDescription || 'Descrição do produto não informada',
      main_benefits: formData.mainBenefits || 'Benefícios não informados',
      call_to_action: formData.callToAction || 'CTA não informado',
      lead_destination: formData.leadDestination || 'Destino não informado',
      has_logo: formData.hasLogo || 'Não informado',
      domain_info: formData.desiredDomain || 'Domínio não informado',
      deadline: formData.deliveryDeadline || 'Valor Acordado na Workana',
      
      // Campos opcionais - CORRIGIDO MAPEAMENTO
      main_competitors: formData.mainCompetitors || null,
      customer_pain_points: formData.customerPainPoints || null,
      success_stories: formData.successStories || null,
      social_proof: formData.socialProof || null,
      current_website: formData.currentWebsite || null,
      number_of_offers: formData.numberOfOffers || null,
      offer_details: formData.offerDetails || null,
      pricing_model: formData.pricingModel || null,
      price_range: null, // Campo não utilizado
      guarantees: formData.guarantees || null,
      target_results: formData.targetResults || null,
      urgency_factors: formData.urgencyFactors || null,
      objections: formData.objections || null,
      landing_page_sections: formData.landingPageSections || null,
      specific_requirements: formData.specificRequirements || null,
      brand_colors: formData.brandColors || null,
      brand_personality: formData.brandPersonality || null,
      communication_tone: formData.communicationTone || null,
      key_messages: formData.keyMessages || null,
      logo_files: logoUrls.length > 0 ? logoUrls : null,
      visual_references: formData.visualReferences || null,
      visual_files: visualUrls.length > 0 ? visualUrls : null,
      content_materials: formData.contentMaterials || null,
      material_files: materialUrls.length > 0 ? materialUrls : null,
      integrations: formData.integrations || null,
      analytics_tracking: formData.analytics || null,
      start_date: formData.startDate || null,
      budget: formData.budget || "Valor Acordado na Workana",
      additional_notes: formData.additionalNotes || null,
      
      // Campos que estavam faltando - ADICIONADOS
      desired_domain: formData.desiredDomain || null
    }

    // 3. Log detalhado dos dados que serão enviados
    console.log('🔍 [DEBUG] Dados mapeados para o banco:', {
      company_name: briefingData.company_name,
      responsible_name: briefingData.responsible_name,
      deadline: briefingData.deadline,
      has_required_fields: !!(briefingData.company_name && briefingData.business_segment && briefingData.target_audience),
      total_fields: Object.keys(briefingData).length
    });

    // 4. Salvar no banco de dados com retry
    console.log('💾 [DEBUG] Tentando salvar no Supabase...');
    const savedBriefing = await retryOperation(() => saveBriefing(briefingData), 3, 2000);
    console.log('✅ [DEBUG] Briefing salvo no Supabase com sucesso!', { 
      id: savedBriefing.id,
      company: savedBriefing.company_name,
      created_at: savedBriefing.created_at 
    });

    // 5. Pular email por enquanto para debug
    console.log('⚠️ [DEBUG] Pulando envio de email para teste...');

    return savedBriefing

  } catch (error) {
    console.error('❌ [DEBUG] Erro detalhado ao processar briefing:', error)
    
    // Log detalhado do erro
    if (error instanceof Error) {
      console.error('❌ [DEBUG] Detalhes do erro:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: (error as any).cause
      });
    }
    
    // Re-lançar erro para que seja capturado no ClientBrief
      throw error
  }
}

// Função para enviar notificação por email (usando Supabase Edge Functions)
const sendNotificationEmail = async (briefing: ClientBriefing) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-briefing-notification', {
      body: {
        briefing,
        to: 'contato@workflowdigital.com', // Seu email
        subject: `Novo Briefing Recebido - ${briefing.company_name}`
      }
    })

    if (error) {
      console.error('Erro ao enviar email de notificação:', error)
      // Não falhar o processo principal se o email falhar
    }

    return data
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    // Não falhar o processo principal se o email falhar
  }
}

// Função para listar briefings (para painel admin futuro)
export const getBriefings = async () => {
  try {
    console.log('🔄 Buscando briefings do Supabase...')
    
    // Primeiro tentar buscar do Supabase
    const { data, error } = await supabase
      .from('client_briefings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar briefings do Supabase:', error)
      
      // Fallback: buscar do localStorage apenas se Supabase falhar completamente
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      console.log('⚠️ Usando briefings do localStorage como fallback:', localBriefings.length)
      return localBriefings
    }

    console.log('✅ Briefings carregados do Supabase:', data?.length || 0)
    
    // Atualizar localStorage com dados do Supabase para sincronização
    try {
      localStorage.setItem('briefings', JSON.stringify(data || []))
      console.log('🔄 localStorage sincronizado com Supabase')
    } catch (localError) {
      console.warn('⚠️ Erro ao sincronizar localStorage:', localError)
    }
    
    return data || []
  } catch (error) {
    console.error('❌ Erro geral ao buscar briefings:', error)
    
    // Fallback final: buscar do localStorage
    const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
    console.log('⚠️ Usando briefings do localStorage (fallback final):', localBriefings.length)
    return localBriefings
  }
}

// Função para obter um briefing específico
export const getBriefing = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('client_briefings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar briefing do Supabase:', error)
      // Fallback: buscar do localStorage
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const briefing = localBriefings.find((b: any) => b.id === id)
      if (!briefing) {
        throw new Error('Briefing não encontrado')
      }
      return briefing
    }

    return data
  } catch (error) {
    console.error('Erro ao buscar briefing:', error)
    throw error
  }
}

// Nova função para atualizar um briefing
export const updateBriefing = async (id: string, updates: Partial<ClientBriefing>): Promise<ClientBriefing> => {
  try {
    console.log('🔄 Atualizando briefing:', { id, updates })
    
    // Primeiro, verificar se o briefing existe
    const { data: existingBriefing, error: selectError } = await supabase
      .from('client_briefings')
      .select('*')
      .eq('id', id)
      .single()

    if (selectError || !existingBriefing) {
      console.error('❌ Briefing não encontrado no Supabase:', selectError)
      
      // Fallback: buscar e atualizar no localStorage
      console.log('🔄 Tentando fallback no localStorage...')
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const briefingIndex = localBriefings.findIndex((b: any) => b.id === id)
      
      if (briefingIndex === -1) {
        console.error('❌ Briefing não encontrado no localStorage')
        throw new Error(`Briefing com ID ${id} não encontrado`)
      }
      
      // Atualizar no localStorage
      localBriefings[briefingIndex] = {
        ...localBriefings[briefingIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      localStorage.setItem('briefings', JSON.stringify(localBriefings))
      console.log('✅ Briefing atualizado no localStorage')
      return localBriefings[briefingIndex]
    }

    console.log('✅ Briefing encontrado no Supabase:', existingBriefing)
    
    // Agora atualizar o briefing
    const { data, error } = await supabase
      .from('client_briefings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar briefing no Supabase:', error)
      
      // Fallback: atualizar no localStorage
      console.log('🔄 Tentando fallback no localStorage após erro de update...')
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const briefingIndex = localBriefings.findIndex((b: any) => b.id === id)
      
      if (briefingIndex !== -1) {
        localBriefings[briefingIndex] = {
          ...localBriefings[briefingIndex],
          ...updates,
          updated_at: new Date().toISOString()
        }
        
        localStorage.setItem('briefings', JSON.stringify(localBriefings))
        console.log('✅ Briefing atualizado no localStorage (fallback)')
        return localBriefings[briefingIndex]
      }
      
      throw new Error('Falha ao atualizar briefing')
    }

    console.log('✅ Briefing atualizado no Supabase:', data)
    
    // Também atualizar no localStorage para consistência
    try {
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const briefingIndex = localBriefings.findIndex((b: any) => b.id === id)
      
      if (briefingIndex !== -1) {
        localBriefings[briefingIndex] = data
        localStorage.setItem('briefings', JSON.stringify(localBriefings))
        console.log('✅ Briefing também atualizado no localStorage')
      }
    } catch (localError) {
      console.warn('⚠️ Erro ao atualizar localStorage:', localError)
    }
    
    return data
  } catch (error) {
    console.error('❌ Erro geral ao atualizar briefing:', error)
    throw error
  }
}

// Nova função para excluir um briefing
export const deleteBriefing = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ Tentando excluir briefing do Supabase:', id)
    
    // Primeiro, verificar se o briefing existe
    const { data: existingBriefing, error: selectError } = await supabase
      .from('client_briefings')
      .select('id, company_name')
      .eq('id', id)
      .single()

    if (selectError || !existingBriefing) {
      console.error('❌ Briefing não encontrado no Supabase:', selectError)
      
      // Fallback: tentar excluir do localStorage
      console.log('🔄 Tentando fallback no localStorage...')
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const originalLength = localBriefings.length
      const filteredBriefings = localBriefings.filter((b: any) => b.id !== id)
      
      if (filteredBriefings.length === originalLength) {
        console.error('❌ Briefing não encontrado no localStorage')
        throw new Error(`Briefing com ID ${id} não encontrado para exclusão`)
      }
      
      localStorage.setItem('briefings', JSON.stringify(filteredBriefings))
      console.log('✅ Briefing excluído do localStorage')
      return
    }

    console.log('✅ Briefing encontrado no Supabase:', existingBriefing)
    
    // Agora excluir o briefing
    const { error, count } = await supabase
      .from('client_briefings')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (error) {
      console.error('❌ Erro ao excluir briefing do Supabase:', error)
      throw new Error(`Erro do Supabase: ${error.message}`)
    }

    console.log('✅ Briefing excluído do Supabase com sucesso. Registros afetados:', count)
    
    if (count === 0) {
      console.warn('⚠️ Nenhum registro foi excluído. Briefing pode não existir.')
      throw new Error('Nenhum registro foi excluído')
    }
    
    // Também remover do localStorage para garantir consistência
    try {
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const filteredBriefings = localBriefings.filter((b: any) => b.id !== id)
      localStorage.setItem('briefings', JSON.stringify(filteredBriefings))
      console.log('✅ Briefing também removido do localStorage')
    } catch (localError) {
      console.warn('⚠️ Erro ao limpar localStorage:', localError)
    }
    
  } catch (error) {
    console.error('❌ Erro geral ao excluir briefing:', error)
    
    // Fallback final: tentar excluir do localStorage
    try {
      console.log('🔄 Tentando fallback final no localStorage...')
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const originalLength = localBriefings.length
      const filteredBriefings = localBriefings.filter((b: any) => b.id !== id)
      
      if (filteredBriefings.length === originalLength) {
        throw new Error(`Briefing com ID ${id} não encontrado para exclusão`)
      }
      
      localStorage.setItem('briefings', JSON.stringify(filteredBriefings))
      console.log('✅ Briefing excluído do localStorage (fallback final)')
    } catch (localError) {
      console.error('❌ Erro ao excluir do localStorage:', localError)
      throw new Error('Falha ao excluir briefing')
    }
  }
}

// Nova função para adicionar valor da proposta
export const addProposalValue = async (id: string, proposalValue: number): Promise<ClientBriefing> => {
  try {
    console.log('💰 Adicionando valor da proposta:', { id, proposalValue })
    
    const updates = {
      proposal_value: proposalValue,
      proposal_date: new Date().toISOString()
    }

    const result = await updateBriefing(id, updates)
    console.log('✅ Valor da proposta adicionado com sucesso:', result)
    return result
  } catch (error) {
    console.error('❌ Erro ao adicionar valor da proposta:', error)
    throw error
  }
} 

// Função para salvar briefing institucional
export const submitInstitutionalBriefing = async (formData: InstitutionalBriefForm): Promise<InstitutionalBriefing> => {
  console.log('🔄 Iniciando submitInstitutionalBriefing...', { 
    device: navigator.userAgent,
    online: navigator.onLine,
    timestamp: new Date().toISOString()
  });
  
  try {
    // 1. Upload de arquivos com fallback em caso de erro
    console.log('📁 [INSTITUTIONAL-DEBUG] Fazendo upload de arquivos...');
    let logoUrls: string[] = [];
    let visualUrls: string[] = [];
    let materialUrls: string[] = [];
    
    try {
      [logoUrls, visualUrls, materialUrls] = await Promise.all([
        uploadFiles(formData.logoFiles, 'briefing-files', 'institutional-logos'),
        uploadFiles(formData.visualFiles, 'briefing-files', 'institutional-visual-references'),
        uploadFiles(formData.materialFiles, 'briefing-files', 'institutional-materials')
      ]);
      console.log('✅ [INSTITUTIONAL-DEBUG] Upload de arquivos concluído:', { 
        logoUrls: logoUrls.length, 
        visualUrls: visualUrls.length,
        materialUrls: materialUrls.length
      });
    } catch (uploadError) {
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro no upload de arquivos:', uploadError);
      // Continuar mesmo com erro no upload, definindo arrays vazios
      logoUrls = [];
      visualUrls = [];
      materialUrls = [];
    }

    // 2. Preparar dados para o banco - MAPEAMENTO COMPLETO ATUALIZADO
    console.log('📝 [INSTITUTIONAL-DEBUG] Preparando dados para o banco...');
    const briefingData = {
      // Informações da Empresa - TODOS os campos mapeados
      company_name: formData.companyName || 'Nome não informado',
      business_segment: formData.businessSegment || 'Segmento não informado',
      company_description: formData.companyDescription || 'Descrição não informada',
      company_history: formData.companyHistory || null,
      mission: formData.mission || null,
      vision: formData.vision || null,
      values: formData.values || null,
      target_audience: formData.targetAudience || 'Público não informado',
      competitive_advantage: formData.competitiveAdvantage || 'Diferencial não informado',
      
      // Informações de Contato
      responsible_name: formData.responsibleName || 'Nome não informado',
      current_website: formData.currentWebsite || null,
      
      // Objetivos do Site
      website_goal: formData.websiteGoal || 'Objetivo não informado',
      website_type: formData.websiteType || 'Tipo não informado',
      main_functionalities: formData.mainFunctionalities || 'Funcionalidades não informadas',
      
      // Estrutura do Site
      required_pages: formData.requiredPages || 'Páginas não especificadas',
      navigation_structure: formData.navigationStructure || null,
      content_hierarchy: formData.contentHierarchy || null,
      
      // Conteúdo
      services_products: formData.servicesProducts || 'Serviços não descritos',
      team_info: formData.teamInfo || null,
      certifications: formData.certifications || null,
      awards_recognition: formData.awardsRecognition || null,
      case_studies: formData.caseStudies || null,
      testimonials: formData.testimonials || null,
      
      // Design e Visual
      brand_colors: formData.brandColors || null,
      has_logo: formData.hasLogo || 'nao-informado',
      logo_files: logoUrls || [],
      visual_references: formData.visualReferences || null,
      visual_files: visualUrls || [],
      design_style: formData.designStyle || null,
      
      // Marketing e Comunicação - NOVOS CAMPOS MAPEADOS
      main_competitors: formData.mainCompetitors || null,
      customer_pain_points: formData.customerPainPoints || null,
      customer_objections: formData.customerObjections || null,
      communication_tone: formData.communicationTone || null,
      key_messages: formData.keyMessages || null,
      specific_requirements: formData.specificRequirements || null,
      content_materials: formData.contentMaterials || null,
      material_files: materialUrls || [],
      
      // Técnico
      contact_forms: formData.contactForms || null,
      integrations: formData.integrations || null,
      seo_requirements: formData.seoRequirements || null,
      analytics_tracking: formData.analytics || null,
      
      // Domínio e Hospedagem
      domain_info: formData.desiredDomain || 'Não informado',
      hosting_preferences: formData.hostingPreferences || null,
      
      // Timeline e Orçamento
      deadline: formData.deliveryDeadline || 'Valor Acordado na Workana',
      start_date: formData.startDate || null,
      budget: formData.budget || 'Valor Acordado na Workana',
      additional_notes: formData.additionalNotes || null,
      
      // Metadados
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 [INSTITUTIONAL-DEBUG] Dados preparados para o banco:', {
      totalFields: Object.keys(briefingData).length,
      companyName: briefingData.company_name,
      responsibleName: briefingData.responsible_name,
      hasLogo: briefingData.has_logo,
      logoFilesCount: briefingData.logo_files?.length || 0,
      visualFilesCount: briefingData.visual_files?.length || 0,
      materialFilesCount: briefingData.material_files?.length || 0,
      mainCompetitors: briefingData.main_competitors ? 'Preenchido' : 'Vazio',
      customerPainPoints: briefingData.customer_pain_points ? 'Preenchido' : 'Vazio',
      communicationTone: briefingData.communication_tone ? 'Preenchido' : 'Vazio'
    });

    // 3. Salvar no Supabase com retry
    console.log('💾 [INSTITUTIONAL-DEBUG] Salvando no Supabase...');
    
    const savedBriefing = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('institutional_briefings')
        .insert([briefingData])
        .select()
        .single();

      if (error) {
        console.error('❌ [INSTITUTIONAL-DEBUG] Erro do Supabase:', error);
        throw new Error(`Erro do banco: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado do banco');
      }

      return data;
    }, 3, 1000);

    console.log('✅ [INSTITUTIONAL-DEBUG] Briefing institucional salvo com sucesso:', savedBriefing.id);

    // 4. Enviar notificação por email (opcional)
    try {
      await sendInstitutionalNotificationEmail(savedBriefing);
      console.log('✅ [INSTITUTIONAL-DEBUG] Email de notificação enviado');
    } catch (emailError) {
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro ao enviar email:', emailError);
      // Não falhar o processo por causa do email
    }

    return savedBriefing;

  } catch (error) {
    console.error('❌ [INSTITUTIONAL-DEBUG] Erro geral no submitInstitutionalBriefing:', error);
    
    // Melhorar mensagem de erro
    let errorMessage = 'Erro desconhecido';
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        errorMessage = 'Briefing duplicado detectado';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Erro de conexão com o banco de dados';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Tempo limite excedido';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(`Erro ao salvar briefing institucional: ${errorMessage}`);
  }
};

// Função para enviar notificação por email para briefing institucional
const sendInstitutionalNotificationEmail = async (briefing: InstitutionalBriefing) => {
  try {
    console.log('📧 [INSTITUTIONAL-DEBUG] Enviando notificação por email...');
    
    // Aqui você pode implementar o envio de email
    // Por exemplo, usando um serviço como SendGrid, Mailgun, etc.
    
    console.log('✅ [INSTITUTIONAL-DEBUG] Email enviado para:', briefing.responsible_name);
  } catch (error) {
    console.error('❌ [INSTITUTIONAL-DEBUG] Erro ao enviar email:', error);
    throw error;
  }
};

// Função para buscar briefings institucionais
export const getInstitutionalBriefings = async (): Promise<InstitutionalBriefing[]> => {
  console.log('📋 [INSTITUTIONAL-DEBUG] Buscando briefings institucionais...');
  
  try {
    const { data, error } = await supabase
      .from('institutional_briefings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro ao buscar briefings:', error);
      throw new Error(`Erro ao buscar briefings: ${error.message}`);
    }

    console.log('✅ [INSTITUTIONAL-DEBUG] Briefings encontrados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ [INSTITUTIONAL-DEBUG] Erro geral ao buscar briefings:', error);
    throw error;
  }
};

// Função para buscar um briefing institucional específico
export const getInstitutionalBriefing = async (id: string): Promise<InstitutionalBriefing | null> => {
  console.log('📋 [INSTITUTIONAL-DEBUG] Buscando briefing institucional:', id);
  
  try {
    const { data, error } = await supabase
      .from('institutional_briefings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [INSTITUTIONAL-DEBUG] Briefing não encontrado:', id);
        return null;
      }
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro ao buscar briefing:', error);
      throw new Error(`Erro ao buscar briefing: ${error.message}`);
    }

    console.log('✅ [INSTITUTIONAL-DEBUG] Briefing encontrado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [INSTITUTIONAL-DEBUG] Erro geral ao buscar briefing:', error);
    throw error;
  }
};

// Função para atualizar briefing institucional
export const updateInstitutionalBriefing = async (id: string, updates: Partial<InstitutionalBriefing>): Promise<InstitutionalBriefing> => {
  console.log('📝 [INSTITUTIONAL-DEBUG] Atualizando briefing institucional:', id);
  
  try {
    const { data, error } = await supabase
      .from('institutional_briefings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro ao atualizar briefing:', error);
      throw new Error(`Erro ao atualizar briefing: ${error.message}`);
    }

    console.log('✅ [INSTITUTIONAL-DEBUG] Briefing atualizado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [INSTITUTIONAL-DEBUG] Erro geral ao atualizar briefing:', error);
    throw error;
  }
};

// Função para deletar briefing institucional
export const deleteInstitutionalBriefing = async (id: string): Promise<void> => {
  console.log('🗑️ [INSTITUTIONAL-DEBUG] Deletando briefing institucional:', id);
  
  try {
    const { error } = await supabase
      .from('institutional_briefings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro ao deletar briefing:', error);
      throw new Error(`Erro ao deletar briefing: ${error.message}`);
    }

    console.log('✅ [INSTITUTIONAL-DEBUG] Briefing deletado:', id);
  } catch (error) {
    console.error('❌ [INSTITUTIONAL-DEBUG] Erro geral ao deletar briefing:', error);
    throw error;
  }
};

// Função para deletar briefing de logo
export const deleteLogoBriefing = async (id: string): Promise<void> => {
  console.log('🗑️ [LOGO-DEBUG] Deletando briefing de logo:', id);
  
  try {
    const { error } = await supabase
      .from('logo_briefings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ [LOGO-DEBUG] Erro ao deletar briefing:', error);
      throw new Error(`Erro ao deletar briefing: ${error.message}`);
    }

    console.log('✅ [LOGO-DEBUG] Briefing de logo deletado:', id);
  } catch (error) {
    console.error('❌ [LOGO-DEBUG] Erro geral ao deletar briefing:', error);
    throw error;
  }
};

// Função para adicionar valor da proposta ao briefing institucional
export const addInstitutionalProposalValue = async (id: string, proposalValue: number): Promise<InstitutionalBriefing> => {
  console.log('💰 [INSTITUTIONAL-DEBUG] Adicionando valor da proposta:', { id, proposalValue });
  
  try {
    const { data, error } = await supabase
      .from('institutional_briefings')
      .update({ 
        proposal_value: proposalValue,
        proposal_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [INSTITUTIONAL-DEBUG] Erro ao adicionar valor da proposta:', error);
      throw new Error(`Erro ao adicionar valor da proposta: ${error.message}`);
    }

    console.log('✅ [INSTITUTIONAL-DEBUG] Valor da proposta adicionado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [INSTITUTIONAL-DEBUG] Erro geral ao adicionar valor da proposta:', error);
    throw error;
  }
};

// ============================================================================
// BRIEFING DE LOGO
// ============================================================================

// Tipo para briefing de logo salvo
export interface LogoBriefing {
  id: string
  company_name: string
  business_segment: string
  company_description: string
  company_values?: string
  target_audience?: string
  brand_personality?: string
  responsible_name: string
  current_logo?: string
  logo_style: string
  logo_type: string
  logo_mood: string
  messages_to_convey: string
  competitor_logos?: string
  what_to_avoid?: string
  preferred_colors: string
  colors_to_avoid?: string
  symbols_elements?: string
  typography_preference?: string
  visual_references?: string
  visual_files?: string[]
  logo_applications: string
  required_formats?: string
  logo_versions?: string
  specific_requirements?: string
  deadline: string
  budget?: string
  additional_notes?: string
  created_at: string
  updated_at: string
  proposal_value?: number
  proposal_date?: string
}

// Função para salvar briefing de logo
export const submitLogoBriefing = async (formData: LogoBriefForm): Promise<LogoBriefing> => {
  console.log('🔄 Iniciando submitLogoBriefing...', { 
    device: navigator.userAgent,
    online: navigator.onLine,
    timestamp: new Date().toISOString()
  });
  
  try {
    // 1. Upload de arquivos de referência visual
    console.log('📁 [LOGO-DEBUG] Fazendo upload de arquivos...');
    let visualUrls: string[] = [];
    
    try {
      visualUrls = await uploadFiles(formData.visualFiles, 'briefing-files', 'logo-visual-references');
      console.log('✅ [LOGO-DEBUG] Upload de arquivos concluído:', { 
        visualUrls: visualUrls.length
      });
    } catch (uploadError) {
      console.error('❌ [LOGO-DEBUG] Erro no upload de arquivos:', uploadError);
      // Continuar mesmo com erro no upload
      visualUrls = [];
    }

    // 2. Preparar dados para o banco
    console.log('📝 [LOGO-DEBUG] Preparando dados para o banco...');
    const briefingData = {
      // Informações da Empresa
      company_name: formData.companyName || 'Nome não informado',
      business_segment: formData.businessSegment || 'Segmento não informado',
      company_description: formData.companyDescription || 'Descrição não informada',
      company_values: formData.companyValues || null,
      target_audience: formData.targetAudience || null,
      brand_personality: formData.brandPersonality || null,
      
      // Informações de Contato
      responsible_name: formData.responsibleName || 'Responsável não informado',
      current_logo: formData.currentLogo || null,
      
      // Conceito e Estilo
      logo_style: formData.logoStyle || 'Estilo não informado',
      logo_type: formData.logoType || 'Tipo não informado',
      logo_mood: formData.logoMood || 'Mood não informado',
      messages_to_convey: formData.messagesToConvey || 'Mensagens não informadas',
      competitor_logos: formData.competitorLogos || null,
      what_to_avoid: formData.whatToAvoid || null,
      
      // Elementos Visuais
      preferred_colors: formData.preferredColors || 'Cores não especificadas',
      colors_to_avoid: formData.colorsToAvoid || null,
      symbols_elements: formData.symbolsElements || null,
      typography_preference: formData.typographyPreference || null,
      visual_references: formData.visualReferences || null,
      visual_files: visualUrls || [],
      
      // Aplicações e Formatos
      logo_applications: formData.logoApplications || 'Aplicações não especificadas',
      required_formats: formData.requiredFormats || null,
      logo_versions: formData.logoVersions || null,
      specific_requirements: formData.specificRequirements || null,
      
      // Timeline e Orçamento
      deadline: formData.deliveryDeadline || 'Valor Acordado na Workana',
      budget: formData.budget || 'Valor Acordado na Workana',
      additional_notes: formData.additionalNotes || null,
      
      // Metadados
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 [LOGO-DEBUG] Dados preparados para o banco:', {
      totalFields: Object.keys(briefingData).length,
      companyName: briefingData.company_name,
      responsibleName: briefingData.responsible_name,
      logoStyle: briefingData.logo_style,
      logoType: briefingData.logo_type,
      visualFilesCount: briefingData.visual_files?.length || 0
    });

    // 3. Salvar no Supabase com retry
    console.log('💾 [LOGO-DEBUG] Salvando no Supabase...');
    
    const savedBriefing = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('logo_briefings')
        .insert([briefingData])
        .select()
        .single();

      if (error) {
        console.error('❌ [LOGO-DEBUG] Erro do Supabase:', error);
        throw new Error(`Erro do banco: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado do banco');
      }

      return data;
    }, 3, 1000);

    console.log('✅ [LOGO-DEBUG] Briefing de logo salvo com sucesso:', savedBriefing.id);

    return savedBriefing;

  } catch (error) {
    console.error('❌ [LOGO-DEBUG] Erro geral no submitLogoBriefing:', error);
    
    // Melhorar mensagem de erro
    let errorMessage = 'Erro desconhecido';
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        errorMessage = 'Briefing duplicado detectado';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Erro de conexão com o banco de dados';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Tempo limite excedido';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(`Erro ao salvar briefing de logo: ${errorMessage}`);
  }
};

// Função para buscar briefings de logo
export const getLogoBriefings = async (): Promise<LogoBriefing[]> => {
  console.log('📋 [LOGO-DEBUG] Buscando briefings de logo...');
  
  try {
    const { data, error } = await supabase
      .from('logo_briefings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [LOGO-DEBUG] Erro ao buscar briefings:', error);
      throw new Error(`Erro ao buscar briefings: ${error.message}`);
    }

    console.log('✅ [LOGO-DEBUG] Briefings encontrados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ [LOGO-DEBUG] Erro geral ao buscar briefings:', error);
    throw error;
  }
};

// Função para buscar um briefing de logo específico
export const getLogoBriefing = async (id: string): Promise<LogoBriefing | null> => {
  console.log('📋 [LOGO-DEBUG] Buscando briefing de logo:', id);
  
  try {
    const { data, error } = await supabase
      .from('logo_briefings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [LOGO-DEBUG] Briefing não encontrado:', id);
        return null;
      }
      console.error('❌ [LOGO-DEBUG] Erro ao buscar briefing:', error);
      throw new Error(`Erro ao buscar briefing: ${error.message}`);
    }

    console.log('✅ [LOGO-DEBUG] Briefing encontrado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [LOGO-DEBUG] Erro geral ao buscar briefing:', error);
    throw error;
  }
};

// ============================================================================
// BRIEFING ODONTOLÓGICO
// ============================================================================

// Tipo para o formulário de briefing odontológico
export interface DentalBriefForm {
  clinicName: string
  logoFile?: FileList | null
  colorPreference: string
  colorCustom?: string
  instagramLink?: string
  mainTreatments: string
  slogan?: string
  contactInfo: string
  profilePhoto?: FileList | null
  agreedTerms: boolean
}

// Tipo para briefing odontológico salvo
export interface DentalBriefing {
  id: string
  clinic_name: string
  logo_file?: string
  color_preference: string
  instagram_link?: string
  main_treatments: string
  slogan?: string
  contact_info: string
  profile_photo?: string
  agreed_terms: boolean
  responsible_name?: string
  business_segment: string
  proposal_value?: number
  proposal_date?: string
  created_at: string
  updated_at: string
}

// Função para salvar briefing odontológico
export const submitDentalBriefing = async (formData: DentalBriefForm): Promise<DentalBriefing> => {
  console.log('🦷 Iniciando submitDentalBriefing...', { 
    device: navigator.userAgent,
    online: navigator.onLine,
    timestamp: new Date().toISOString()
  });
  
  try {
    // 1. Upload de arquivos
    console.log('📁 [DENTAL-DEBUG] Fazendo upload de arquivos...');
    let logoUrl: string | null = null;
    let profileUrl: string | null = null;
    
    try {
      if (formData.logoFile && formData.logoFile.length > 0) {
        const logoUrls = await uploadFiles(formData.logoFile, 'briefing-files', 'dental-logos');
        logoUrl = logoUrls[0] || null;
      }
      
      if (formData.profilePhoto && formData.profilePhoto.length > 0) {
        const profileUrls = await uploadFiles(formData.profilePhoto, 'briefing-files', 'dental-profiles');
        profileUrl = profileUrls[0] || null;
      }
      
      console.log('✅ [DENTAL-DEBUG] Upload de arquivos concluído:', { logoUrl, profileUrl });
    } catch (uploadError) {
      console.error('❌ [DENTAL-DEBUG] Erro no upload de arquivos:', uploadError);
      // Continuar mesmo com erro no upload
      logoUrl = null;
      profileUrl = null;
    }

    // 2. Preparar dados para o banco
    console.log('📝 [DENTAL-DEBUG] Preparando dados para o banco...');
    
    // Determinar preferência de cor final
    let finalColorPreference = formData.colorPreference;
    if (formData.colorPreference === 'custom' && formData.colorCustom) {
      finalColorPreference = formData.colorCustom;
    }
    
    const briefingData = {
      clinic_name: formData.clinicName,
      logo_file: logoUrl,
      color_preference: finalColorPreference,
      instagram_link: formData.instagramLink || null,
      main_treatments: formData.mainTreatments,
      slogan: formData.slogan || null,
      contact_info: formData.contactInfo,
      profile_photo: profileUrl,
      agreed_terms: formData.agreedTerms,
      responsible_name: formData.clinicName, // Usar nome da clínica como responsável
      business_segment: 'odontologia',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 [DENTAL-DEBUG] Dados preparados para o banco:', {
      totalFields: Object.keys(briefingData).length,
      clinicName: briefingData.clinic_name,
      agreedTerms: briefingData.agreed_terms,
      hasLogo: !!briefingData.logo_file,
      hasProfile: !!briefingData.profile_photo
    });

    // 3. Salvar no Supabase com retry
    console.log('💾 [DENTAL-DEBUG] Salvando no Supabase...');
    
    const savedBriefing = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('dental_briefings')
        .insert([briefingData])
        .select()
        .single();

      if (error) {
        console.error('❌ [DENTAL-DEBUG] Erro do Supabase:', error);
        throw new Error(`Erro do banco: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado do banco');
      }

      return data;
    }, 3, 1000);

    console.log('✅ [DENTAL-DEBUG] Briefing odontológico salvo com sucesso:', savedBriefing.id);

    return savedBriefing;

  } catch (error) {
    console.error('❌ [DENTAL-DEBUG] Erro geral no submitDentalBriefing:', error);
    
    // Melhorar mensagem de erro
    let errorMessage = 'Erro desconhecido';
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        errorMessage = 'Briefing duplicado detectado';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Erro de conexão com o banco de dados';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Tempo limite excedido';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(`Erro ao salvar briefing odontológico: ${errorMessage}`);
  }
};

// Função para buscar briefings odontológicos
export const getDentalBriefings = async (): Promise<DentalBriefing[]> => {
  console.log('🦷 [DENTAL-DEBUG] Buscando briefings odontológicos...');
  
  try {
    const { data, error } = await supabase
      .from('dental_briefings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DENTAL-DEBUG] Erro ao buscar briefings:', error);
      throw new Error(`Erro ao buscar briefings: ${error.message}`);
    }

    console.log('✅ [DENTAL-DEBUG] Briefings encontrados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ [DENTAL-DEBUG] Erro geral ao buscar briefings:', error);
    throw error;
  }
};

// Função para buscar um briefing odontológico específico
export const getDentalBriefing = async (id: string): Promise<DentalBriefing | null> => {
  console.log('🦷 [DENTAL-DEBUG] Buscando briefing odontológico:', id);
  
  try {
    const { data, error } = await supabase
      .from('dental_briefings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [DENTAL-DEBUG] Briefing não encontrado:', id);
        return null;
      }
      console.error('❌ [DENTAL-DEBUG] Erro ao buscar briefing:', error);
      throw new Error(`Erro ao buscar briefing: ${error.message}`);
    }

    console.log('✅ [DENTAL-DEBUG] Briefing encontrado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [DENTAL-DEBUG] Erro geral ao buscar briefing:', error);
    throw error;
  }
};

// Função para deletar briefing odontológico
export const deleteDentalBriefing = async (id: string): Promise<void> => {
  console.log('🗑️ [DENTAL-DEBUG] Deletando briefing odontológico:', id);
  
  try {
    const { error } = await supabase
      .from('dental_briefings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ [DENTAL-DEBUG] Erro ao deletar briefing:', error);
      throw new Error(`Erro ao deletar briefing: ${error.message}`);
    }

    console.log('✅ [DENTAL-DEBUG] Briefing odontológico deletado:', id);
  } catch (error) {
    console.error('❌ [DENTAL-DEBUG] Erro geral ao deletar briefing:', error);
    throw error;
  }
};

// Função para atualizar briefing odontológico
export const updateDentalBriefing = async (id: string, updates: Partial<DentalBriefing>): Promise<DentalBriefing> => {
  console.log('📝 [DENTAL-DEBUG] Atualizando briefing odontológico:', id);
  
  try {
    const { data, error } = await supabase
      .from('dental_briefings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [DENTAL-DEBUG] Erro ao atualizar briefing:', error);
      throw new Error(`Erro ao atualizar briefing: ${error.message}`);
    }

    console.log('✅ [DENTAL-DEBUG] Briefing atualizado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [DENTAL-DEBUG] Erro geral ao atualizar briefing:', error);
    throw error;
  }
};

// Função para adicionar valor da proposta ao briefing odontológico
export const addDentalProposalValue = async (id: string, proposalValue: number): Promise<DentalBriefing> => {
  console.log('💰 [DENTAL-DEBUG] Adicionando valor da proposta:', { id, proposalValue });
  
  try {
    const { data, error } = await supabase
      .from('dental_briefings')
      .update({ 
        proposal_value: proposalValue,
        proposal_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [DENTAL-DEBUG] Erro ao adicionar valor da proposta:', error);
      throw new Error(`Erro ao adicionar valor da proposta: ${error.message}`);
    }

    console.log('✅ [DENTAL-DEBUG] Valor da proposta adicionado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [DENTAL-DEBUG] Erro geral ao adicionar valor da proposta:', error);
    throw error;
  }
};

// ============================================================================
// BRIEFING DE LANDING PAGE / PÁGINA DE VENDAS
// ============================================================================

// Tipo para o formulário de briefing de landing page
export interface LandingPageBriefForm {
  // Seção 1: Sobre sua Empresa
  companyName?: string
  businessSegment?: string
  businessSegmentOther?: string
  businessDescription?: string
  targetAudience?: string
  competitiveDifferential?: string
  landingPageGoal?: string
  landingPageGoalOther?: string
  
  // Seção 2: Estratégia & Mercado
  mainCompetitors?: string
  customerPainPoints?: string
  successStories?: string
  socialProof?: string
  
  // Seção 3: Produto/Serviço
  responsibleName?: string
  currentWebsite?: string
  productName?: string
  productDescription?: string
  mainBenefits?: string
  numberOfOffers?: string
  offerDetails?: string
  pricingModel?: string
  guarantees?: string
  productDifferentials?: string
  
  // Seção 4: Conversão & Argumentos
  targetResults?: string
  urgencyFactors?: string
  objections?: string
  callToAction?: string
  leadDestination?: string
  salesArguments?: string
  
  // Seção 5: Design & Identidade
  brandColors?: string
  hasLogo?: string
  logoFiles?: FileList | null
  visualReferences?: string
  visualFiles?: FileList | null
  contentMaterials?: string
  materialFiles?: FileList | null
  brandPersonality?: string
  communicationTone?: string
  keyMessages?: string
  
  // Seção 6: Estrutura & Funcionalidades
  landingPageSections?: string
  specificRequirements?: string
  desiredDomain?: string
  hostingPreference?: string
  integrations?: string
  analytics?: string
  
  // Seção 7: Finalização
  additionalNotes?: string
  projectTimeline?: string
  preferredContact?: string
  agreedTerms: boolean
}

// Tipo para briefing de landing page salvo
export interface LandingPageBriefing {
  id: string
  company_name: string
  business_segment: string
  business_description: string
  target_audience: string
  competitive_differential: string
  landing_page_goal: string
  main_competitors?: string
  customer_pain_points?: string
  success_stories?: string
  social_proof?: string
  responsible_name: string
  current_website?: string
  product_name: string
  product_description: string
  main_benefits: string
  number_of_offers?: string
  offer_details?: string
  pricing_model?: string
  guarantees?: string
  product_differentials?: string
  target_results?: string
  urgency_factors?: string
  objections?: string
  call_to_action: string
  lead_destination: string
  sales_arguments?: string
  brand_colors?: string
  has_logo: string
  logo_files?: string[]
  visual_references?: string
  visual_files?: string[]
  content_materials?: string
  material_files?: string[]
  brand_personality?: string
  communication_tone?: string
  key_messages?: string
  landing_page_sections?: string
  specific_requirements?: string
  desired_domain?: string
  hosting_preference?: string
  integrations?: string
  analytics_tracking?: string
  additional_notes?: string
  agreed_terms: boolean
  deadline?: string
  budget?: string
  start_date?: string
  proposal_value?: number
  proposal_date?: string
  created_at: string
  updated_at: string
}

// Função para salvar briefing de landing page
export const submitLandingPageBriefing = async (formData: LandingPageBriefForm): Promise<LandingPageBriefing> => {
  console.log('🚀 Iniciando submitLandingPageBriefing...', { 
    device: navigator.userAgent,
    online: navigator.onLine,
    timestamp: new Date().toISOString()
  });
  
  try {
    // 1. Upload de arquivos
    console.log('📁 [LANDING-DEBUG] Fazendo upload de arquivos...');
    let logoUrls: string[] = [];
    let visualUrls: string[] = [];
    let materialUrls: string[] = [];
    
    try {
      [logoUrls, visualUrls, materialUrls] = await Promise.all([
        uploadFiles(formData.logoFiles, 'briefing-files', 'landing-page-logos'),
        uploadFiles(formData.visualFiles, 'briefing-files', 'landing-page-visual-references'),
        uploadFiles(formData.materialFiles, 'briefing-files', 'landing-page-materials')
      ]);
      console.log('✅ [LANDING-DEBUG] Upload de arquivos concluído:', { 
        logoUrls: logoUrls.length, 
        visualUrls: visualUrls.length,
        materialUrls: materialUrls.length
      });
    } catch (uploadError) {
      console.error('❌ [LANDING-DEBUG] Erro no upload de arquivos:', uploadError);
      // Continuar mesmo com erro no upload
      logoUrls = [];
      visualUrls = [];
      materialUrls = [];
    }

    // 2. Preparar dados para o banco
    console.log('📝 [LANDING-DEBUG] Preparando dados para o banco...');
    const briefingData = {
      // Seção 1: Sobre sua Empresa
      company_name: formData.companyName || 'Nome não informado',
      business_segment: formData.businessSegment === 'outro'
        ? (formData.businessSegmentOther?.trim() || 'Outro (não especificado)')
        : (formData.businessSegment || 'Segmento não informado'),
      business_description: formData.businessDescription || 'Descrição não informada',
      target_audience: formData.targetAudience || 'Público-alvo não informado',
      competitive_differential: formData.competitiveDifferential || 'Diferencial não informado',
      landing_page_goal: formData.landingPageGoal === 'outro'
        ? (formData.landingPageGoalOther?.trim() || 'Outro (não especificado)')
        : (formData.landingPageGoal || 'Objetivo não informado'),
      
      // Seção 2: Estratégia & Mercado
      main_competitors: formData.mainCompetitors || null,
      customer_pain_points: formData.customerPainPoints || null,
      success_stories: formData.successStories || null,
      social_proof: formData.socialProof || null,
      
      // Seção 3: Produto/Serviço
      responsible_name: formData.responsibleName || 'Responsável não informado',
      current_website: formData.currentWebsite || null,
      product_name: formData.productName || 'Produto não informado',
      product_description: formData.productDescription || 'Descrição do produto não informada',
      main_benefits: formData.mainBenefits || 'Benefícios não informados',
      number_of_offers: formData.numberOfOffers || null,
      offer_details: formData.offerDetails || null,
      pricing_model: formData.pricingModel || null,
      guarantees: formData.guarantees || null,
      product_differentials: formData.productDifferentials || null,
      
      // Seção 4: Conversão & Argumentos
      target_results: formData.targetResults || null,
      urgency_factors: formData.urgencyFactors || null,
      objections: formData.objections || null,
      call_to_action: formData.callToAction || 'CTA não informado',
      lead_destination: formData.leadDestination || 'Destino não informado',
      sales_arguments: formData.salesArguments || null,
      
      // Seção 5: Design & Identidade
      brand_colors: formData.brandColors || null,
      has_logo: formData.hasLogo || 'Não informado',
      logo_files: logoUrls.length > 0 ? logoUrls : null,
      visual_references: formData.visualReferences || null,
      visual_files: visualUrls.length > 0 ? visualUrls : null,
      content_materials: formData.contentMaterials || null,
      material_files: materialUrls.length > 0 ? materialUrls : null,
      brand_personality: formData.brandPersonality || null,
      communication_tone: formData.communicationTone || null,
      key_messages: formData.keyMessages || null,
      
      // Seção 6: Estrutura & Funcionalidades
      landing_page_sections: formData.landingPageSections || null,
      specific_requirements: formData.specificRequirements || null,
      desired_domain: formData.desiredDomain || null,
      hosting_preference: formData.hostingPreference || null,
      integrations: formData.integrations || null,
      analytics_tracking: formData.analytics || null,
      
      // Seção 7: Finalização
      additional_notes: formData.additionalNotes || null,
      agreed_terms: formData.agreedTerms || false,
      
      // Campos administrativos
      deadline: 'Valor Acordado na Workana',
      budget: 'Valor Acordado na Workana',
      
      // Metadados
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 [LANDING-DEBUG] Dados preparados para o banco:', {
      totalFields: Object.keys(briefingData).length,
      companyName: briefingData.company_name,
      responsibleName: briefingData.responsible_name,
      hasLogo: briefingData.has_logo,
      logoFilesCount: briefingData.logo_files?.length || 0,
      visualFilesCount: briefingData.visual_files?.length || 0,
      materialFilesCount: briefingData.material_files?.length || 0,
      agreedTerms: briefingData.agreed_terms
    });

    // 3. Salvar no Supabase com retry
    console.log('💾 [LANDING-DEBUG] Salvando no Supabase...');
    
    const savedBriefing = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('landing_page_briefings')
        .insert([briefingData])
        .select()
        .single();

      if (error) {
        console.error('❌ [LANDING-DEBUG] Erro do Supabase:', error);
        throw new Error(`Erro do banco: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado do banco');
      }

      return data;
    }, 3, 1000);

    console.log('✅ [LANDING-DEBUG] Briefing de landing page salvo com sucesso:', savedBriefing.id);

    return savedBriefing;

  } catch (error) {
    console.error('❌ [LANDING-DEBUG] Erro geral no submitLandingPageBriefing:', error);
    
    // Melhorar mensagem de erro
    let errorMessage = 'Erro desconhecido';
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        errorMessage = 'Briefing duplicado detectado';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Erro de conexão com o banco de dados';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Tempo limite excedido';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(`Erro ao salvar briefing de landing page: ${errorMessage}`);
  }
};

// Função para buscar briefings de landing page
export const getLandingPageBriefings = async (): Promise<LandingPageBriefing[]> => {
  console.log('🚀 [LANDING-DEBUG] Buscando briefings de landing page...');
  
  try {
    const { data, error } = await supabase
      .from('landing_page_briefings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [LANDING-DEBUG] Erro ao buscar briefings:', error);
      throw new Error(`Erro ao buscar briefings: ${error.message}`);
    }

    console.log('✅ [LANDING-DEBUG] Briefings encontrados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ [LANDING-DEBUG] Erro geral ao buscar briefings:', error);
    throw error;
  }
};

// Função para buscar um briefing de landing page específico
export const getLandingPageBriefing = async (id: string): Promise<LandingPageBriefing | null> => {
  console.log('🚀 [LANDING-DEBUG] Buscando briefing de landing page:', id);
  
  try {
    const { data, error } = await supabase
      .from('landing_page_briefings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [LANDING-DEBUG] Briefing não encontrado:', id);
        return null;
      }
      console.error('❌ [LANDING-DEBUG] Erro ao buscar briefing:', error);
      throw new Error(`Erro ao buscar briefing: ${error.message}`);
    }

    console.log('✅ [LANDING-DEBUG] Briefing encontrado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [LANDING-DEBUG] Erro geral ao buscar briefing:', error);
    throw error;
  }
};

// Função para deletar briefing de landing page
export const deleteLandingPageBriefing = async (id: string): Promise<void> => {
  console.log('🗑️ [LANDING-DEBUG] Deletando briefing de landing page:', id);
  
  try {
    const { error } = await supabase
      .from('landing_page_briefings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ [LANDING-DEBUG] Erro ao deletar briefing:', error);
      throw new Error(`Erro ao deletar briefing: ${error.message}`);
    }

    console.log('✅ [LANDING-DEBUG] Briefing de landing page deletado:', id);
  } catch (error) {
    console.error('❌ [LANDING-DEBUG] Erro geral ao deletar briefing:', error);
    throw error;
  }
};

// Função para atualizar briefing de landing page
export const updateLandingPageBriefing = async (id: string, updates: Partial<LandingPageBriefing>): Promise<LandingPageBriefing> => {
  console.log('📝 [LANDING-DEBUG] Atualizando briefing de landing page:', id);
  
  try {
    const { data, error } = await supabase
      .from('landing_page_briefings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [LANDING-DEBUG] Erro ao atualizar briefing:', error);
      throw new Error(`Erro ao atualizar briefing: ${error.message}`);
    }

    console.log('✅ [LANDING-DEBUG] Briefing atualizado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [LANDING-DEBUG] Erro geral ao atualizar briefing:', error);
    throw error;
  }
};

// Função para adicionar valor da proposta ao briefing de landing page
export const addLandingPageProposalValue = async (id: string, proposalValue: number): Promise<LandingPageBriefing> => {
  console.log('💰 [LANDING-DEBUG] Adicionando valor da proposta:', { id, proposalValue });
  
  try {
    const { data, error } = await supabase
      .from('landing_page_briefings')
      .update({ 
        proposal_value: proposalValue,
        proposal_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [LANDING-DEBUG] Erro ao adicionar valor da proposta:', error);
      throw new Error(`Erro ao adicionar valor da proposta: ${error.message}`);
    }

    console.log('✅ [LANDING-DEBUG] Valor da proposta adicionado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [LANDING-DEBUG] Erro geral ao adicionar valor da proposta:', error);
    throw error;
  }
};

// ============================================================================
// BRIEFING DE SITE INSTITUCIONAL (NOVO - VISUAL MODERNO)
// ============================================================================

// Tipo para o formulário de briefing de site
export interface SiteBriefForm {
  // Seção 1: Informações da Empresa
  companyName?: string
  businessSegment?: string
  businessSegmentOther?: string
  companyDescription?: string
  companyHistory?: string
  mission?: string
  vision?: string
  values?: string
  targetAudience?: string
  competitiveAdvantage?: string
  responsibleName?: string
  currentWebsite?: string
  
  // Seção 2: Objetivos e Estrutura do Site
  websiteGoal?: string
  websiteGoalOther?: string
  websiteType?: string
  websiteTypeOther?: string
  mainFunctionalities?: string
  requiredPages?: string
  navigationStructure?: string
  contentHierarchy?: string
  servicesProducts?: string
  teamInfo?: string
  certifications?: string
  awardsRecognition?: string
  caseStudies?: string
  testimonials?: string
  
  // Seção 3: Design e Identidade Visual
  designStyle?: string
  brandColors?: string
  hasLogo?: string
  logoFiles?: FileList | null
  visualReferences?: string
  visualFiles?: FileList | null
  mainCompetitors?: string
  customerPainPoints?: string
  customerObjections?: string
  communicationTone?: string
  keyMessages?: string
  specificRequirements?: string
  contentMaterials?: string
  materialFiles?: FileList | null
  
  // Seção 4: Funcionalidades Técnicas
  contactForms?: string
  integrations?: string
  seoRequirements?: string
  analytics?: string
  desiredDomain?: string
  hostingPreferences?: string
  
  // Seção 5: Timeline e Orçamento
  additionalNotes?: string
}

// Tipo para briefing de site salvo
export interface SiteBriefing {
  id: string
  company_name: string
  business_segment: string
  company_description: string
  company_history?: string
  mission?: string
  vision?: string
  values?: string
  target_audience: string
  competitive_advantage: string
  responsible_name: string
  current_website?: string
  website_goal: string
  website_type: string
  main_functionalities: string
  required_pages: string
  navigation_structure?: string
  content_hierarchy?: string
  services_products: string
  team_info?: string
  certifications?: string
  awards_recognition?: string
  case_studies?: string
  testimonials?: string
  design_style?: string
  brand_colors?: string
  has_logo: string
  logo_files?: string[]
  visual_references?: string
  visual_files?: string[]
  main_competitors?: string
  customer_pain_points?: string
  customer_objections?: string
  communication_tone?: string
  key_messages?: string
  specific_requirements?: string
  content_materials?: string
  material_files?: string[]
  contact_forms?: string
  integrations?: string
  seo_requirements?: string
  analytics_tracking?: string
  domain_info: string
  hosting_preferences?: string
  deadline: string
  budget?: string
  additional_notes?: string
  created_at: string
  updated_at: string
  proposal_value?: number
  proposal_date?: string
}

// Função para salvar briefing de site
export const submitSiteBriefing = async (formData: SiteBriefForm): Promise<SiteBriefing> => {
  console.log('🌐 Iniciando submitSiteBriefing...', { 
    device: navigator.userAgent,
    online: navigator.onLine,
    timestamp: new Date().toISOString()
  });
  
  try {
    // 1. Upload de arquivos
    console.log('📁 [SITE-DEBUG] Fazendo upload de arquivos...');
    let logoUrls: string[] = [];
    let visualUrls: string[] = [];
    let materialUrls: string[] = [];
    
    try {
      [logoUrls, visualUrls, materialUrls] = await Promise.all([
        uploadFiles(formData.logoFiles, 'briefing-files', 'site-logos'),
        uploadFiles(formData.visualFiles, 'briefing-files', 'site-visual-references'),
        uploadFiles(formData.materialFiles, 'briefing-files', 'site-materials')
      ]);
      console.log('✅ [SITE-DEBUG] Upload de arquivos concluído:', { 
        logoUrls: logoUrls.length, 
        visualUrls: visualUrls.length,
        materialUrls: materialUrls.length
      });
    } catch (uploadError) {
      console.error('❌ [SITE-DEBUG] Erro no upload de arquivos:', uploadError);
      // Continuar mesmo com erro no upload
      logoUrls = [];
      visualUrls = [];
      materialUrls = [];
    }

    // 2. Preparar dados para o banco
    console.log('📝 [SITE-DEBUG] Preparando dados para o banco...');
    const briefingData = {
      // Seção 1: Informações da Empresa
      company_name: formData.companyName || 'Nome não informado',
      business_segment: formData.businessSegment === 'outro' 
        ? (formData.businessSegmentOther?.trim() || 'Outro (não especificado)')
        : (formData.businessSegment || 'Segmento não informado'),
      company_description: formData.companyDescription || 'Descrição não informada',
      company_history: formData.companyHistory || null,
      mission: formData.mission || null,
      vision: formData.vision || null,
      values: formData.values || null,
      target_audience: formData.targetAudience || 'Público não informado',
      competitive_advantage: formData.competitiveAdvantage || 'Diferencial não informado',
      responsible_name: formData.responsibleName || 'Responsável não informado',
      current_website: formData.currentWebsite || null,
      
      // Seção 2: Objetivos e Estrutura do Site
      website_goal: formData.websiteGoal === 'outro' && formData.websiteGoalOther
        ? formData.websiteGoalOther
        : (formData.websiteGoal || 'Objetivo não informado'),
      website_type: formData.websiteType === 'outro' && formData.websiteTypeOther
        ? formData.websiteTypeOther
        : (formData.websiteType || 'Tipo não informado'),
      main_functionalities: formData.mainFunctionalities || 'Funcionalidades não informadas',
      required_pages: formData.requiredPages || 'Páginas não especificadas',
      navigation_structure: formData.navigationStructure || null,
      content_hierarchy: formData.contentHierarchy || null,
      services_products: formData.servicesProducts || 'Serviços não descritos',
      team_info: formData.teamInfo || null,
      certifications: formData.certifications || null,
      awards_recognition: formData.awardsRecognition || null,
      case_studies: formData.caseStudies || null,
      testimonials: formData.testimonials || null,
      
      // Seção 3: Design e Identidade Visual
      design_style: formData.designStyle || null,
      brand_colors: formData.brandColors || null,
      has_logo: formData.hasLogo || 'nao-informado',
      logo_files: logoUrls.length > 0 ? logoUrls : null,
      visual_references: formData.visualReferences || null,
      visual_files: visualUrls.length > 0 ? visualUrls : null,
      main_competitors: formData.mainCompetitors || null,
      customer_pain_points: formData.customerPainPoints || null,
      customer_objections: formData.customerObjections || null,
      communication_tone: formData.communicationTone || null,
      key_messages: formData.keyMessages || null,
      specific_requirements: formData.specificRequirements || null,
      content_materials: formData.contentMaterials || null,
      material_files: materialUrls.length > 0 ? materialUrls : null,
      
      // Seção 4: Funcionalidades Técnicas
      contact_forms: formData.contactForms || null,
      integrations: formData.integrations || null,
      seo_requirements: formData.seoRequirements || null,
      analytics_tracking: formData.analytics || null,
      domain_info: formData.desiredDomain || 'Não informado',
      hosting_preferences: formData.hostingPreferences || null,
      
      // Seção 5: Timeline e Orçamento
      deadline: 'Valor Acordado na Workana',
      budget: 'Valor Acordado na Workana',
      additional_notes: formData.additionalNotes || null,
      
      // Metadados
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📋 [SITE-DEBUG] Dados preparados para o banco:', {
      totalFields: Object.keys(briefingData).length,
      companyName: briefingData.company_name,
      responsibleName: briefingData.responsible_name,
      hasLogo: briefingData.has_logo,
      logoFilesCount: briefingData.logo_files?.length || 0,
      visualFilesCount: briefingData.visual_files?.length || 0,
      materialFilesCount: briefingData.material_files?.length || 0
    });

    // 3. Salvar no Supabase com retry
    console.log('💾 [SITE-DEBUG] Salvando no Supabase...');
    
    const savedBriefing = await retryOperation(async () => {
      const { data, error } = await supabase
        .from('site_briefings')
        .insert([briefingData])
        .select()
        .single();

      if (error) {
        console.error('❌ [SITE-DEBUG] Erro do Supabase:', error);
        throw new Error(`Erro do banco: ${error.message}`);
      }

      if (!data) {
        throw new Error('Nenhum dado retornado do banco');
      }

      return data;
    }, 3, 1000);

    console.log('✅ [SITE-DEBUG] Briefing de site salvo com sucesso:', savedBriefing.id);

    return savedBriefing;

  } catch (error) {
    console.error('❌ [SITE-DEBUG] Erro geral no submitSiteBriefing:', error);
    
    // Melhorar mensagem de erro
    let errorMessage = 'Erro desconhecido';
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        errorMessage = 'Briefing duplicado detectado';
      } else if (error.message.includes('connection')) {
        errorMessage = 'Erro de conexão com o banco de dados';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Tempo limite excedido';
      } else {
        errorMessage = error.message;
      }
    }
    
    throw new Error(`Erro ao salvar briefing de site: ${errorMessage}`);
  }
};

// Função para buscar briefings de site
export const getSiteBriefings = async (): Promise<SiteBriefing[]> => {
  console.log('🌐 [SITE-DEBUG] Buscando briefings de site...');
  
  try {
    const { data, error } = await supabase
      .from('site_briefings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [SITE-DEBUG] Erro ao buscar briefings:', error);
      throw new Error(`Erro ao buscar briefings: ${error.message}`);
    }

    console.log('✅ [SITE-DEBUG] Briefings encontrados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ [SITE-DEBUG] Erro geral ao buscar briefings:', error);
    throw error;
  }
};

// Função para buscar um briefing de site específico
export const getSiteBriefing = async (id: string): Promise<SiteBriefing | null> => {
  console.log('🌐 [SITE-DEBUG] Buscando briefing de site:', id);
  
  try {
    const { data, error } = await supabase
      .from('site_briefings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [SITE-DEBUG] Briefing não encontrado:', id);
        return null;
      }
      console.error('❌ [SITE-DEBUG] Erro ao buscar briefing:', error);
      throw new Error(`Erro ao buscar briefing: ${error.message}`);
    }

    console.log('✅ [SITE-DEBUG] Briefing encontrado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [SITE-DEBUG] Erro geral ao buscar briefing:', error);
    throw error;
  }
};

// Função para deletar briefing de site
export const deleteSiteBriefing = async (id: string): Promise<void> => {
  console.log('🗑️ [SITE-DEBUG] Deletando briefing de site:', id);
  
  try {
    const { error } = await supabase
      .from('site_briefings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ [SITE-DEBUG] Erro ao deletar briefing:', error);
      throw new Error(`Erro ao deletar briefing: ${error.message}`);
    }

    console.log('✅ [SITE-DEBUG] Briefing de site deletado:', id);
  } catch (error) {
    console.error('❌ [SITE-DEBUG] Erro geral ao deletar briefing:', error);
    throw error;
  }
};

// Função para atualizar briefing de site
export const updateSiteBriefing = async (id: string, updates: Partial<SiteBriefing>): Promise<SiteBriefing> => {
  console.log('📝 [SITE-DEBUG] Atualizando briefing de site:', id);
  
  try {
    const { data, error } = await supabase
      .from('site_briefings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [SITE-DEBUG] Erro ao atualizar briefing:', error);
      throw new Error(`Erro ao atualizar briefing: ${error.message}`);
    }

    console.log('✅ [SITE-DEBUG] Briefing atualizado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [SITE-DEBUG] Erro geral ao atualizar briefing:', error);
    throw error;
  }
};

// Função para adicionar valor da proposta ao briefing de site
export const addSiteProposalValue = async (id: string, proposalValue: number): Promise<SiteBriefing> => {
  console.log('💰 [SITE-DEBUG] Adicionando valor da proposta:', { id, proposalValue });
  
  try {
    const { data, error } = await supabase
      .from('site_briefings')
      .update({ 
        proposal_value: proposalValue,
        proposal_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ [SITE-DEBUG] Erro ao adicionar valor da proposta:', error);
      throw new Error(`Erro ao adicionar valor da proposta: ${error.message}`);
    }

    console.log('✅ [SITE-DEBUG] Valor da proposta adicionado:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [SITE-DEBUG] Erro geral ao adicionar valor da proposta:', error);
    throw error;
  }
};