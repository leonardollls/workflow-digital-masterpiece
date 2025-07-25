import { supabase, uploadFile, getPublicUrl, saveBriefing, type ClientBriefing } from '@/lib/supabase'

// Tipo para o formulário
export interface ClientBriefForm {
  companyName: string
  businessSegment: string
  businessDescription: string
  targetAudience: string
  competitiveDifferential: string
  landingPageGoal: string
  mainCompetitors?: string
  customerPainPoints?: string
  successStories?: string
  socialProof?: string
  responsibleName: string
  currentWebsite?: string
  productName: string
  productDescription: string
  mainBenefits: string
  numberOfOffers: string
  offerDetails: string
  pricingModel: string
  guarantees?: string
  targetResults?: string
  urgencyFactors?: string
  objections?: string
  callToAction: string
  leadDestination: string
  landingPageSections?: string
  specificRequirements?: string
  brandColors?: string
  hasLogo: string
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
  deliveryDeadline: string
  startDate: string
  budget?: string
  additionalNotes?: string
}

// Função para fazer upload de múltiplos arquivos
const uploadFiles = async (files: FileList | null, bucket: string, folder: string): Promise<string[]> => {
  if (!files || files.length === 0) return []

  const uploadPromises = Array.from(files).map(async (file, index) => {
    const timestamp = Date.now()
    const fileName = `${folder}/${timestamp}_${index}_${file.name}`
    
    try {
      // Verificar tamanho do arquivo (máx 50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error(`Arquivo ${file.name} é muito grande. Máximo 50MB.`)
      }
      
      await uploadFile(file, bucket, fileName)
      return getPublicUrl(bucket, fileName)
    } catch (error) {
      console.error(`Erro ao fazer upload do arquivo ${file.name}:`, error)
      throw new Error(`Falha no upload de ${file.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  })

  try {
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Erro no upload de arquivos:', error)
    throw new Error(`Erro no upload de arquivos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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
    // 1. Upload dos arquivos
    console.log('📁 Fazendo upload de arquivos...');
    const [logoUrls, visualUrls, materialUrls] = await Promise.all([
      uploadFiles(formData.logoFiles, 'briefing-files', 'logos'),
      uploadFiles(formData.visualFiles, 'briefing-files', 'visual-references'),
      uploadFiles(formData.materialFiles, 'briefing-files', 'materials')
    ])
    console.log('✅ Upload de arquivos concluído:', { logoUrls, visualUrls, materialUrls });

    // 2. Preparar dados para o banco
    const briefingData: Omit<ClientBriefing, 'id' | 'created_at' | 'updated_at'> = {
      company_name: formData.companyName || '',
      business_segment: formData.businessSegment || '',
      company_description: formData.businessDescription || '',
      target_audience: formData.targetAudience || '',
      competitive_advantage: formData.competitiveDifferential || '',
      landing_page_goal: formData.landingPageGoal || '',
      main_competitors: formData.mainCompetitors || '',
      customer_pain_points: formData.customerPainPoints || '',
      success_stories: formData.successStories || '',
      social_proof: formData.socialProof || '',
      responsible_name: formData.responsibleName || '',
      current_website: formData.currentWebsite || '',
      product_name: formData.productName || '',
      product_description: formData.productDescription || '',
      main_benefits: formData.mainBenefits || '',
      number_of_offers: formData.numberOfOffers || '',
      offer_details: formData.offerDetails || '',
      pricing_model: formData.pricingModel || '',
      price_range: formData.budget || null, // Mapear budget para price_range do banco
      guarantees: formData.guarantees || '',
      target_results: formData.targetResults || '',
      urgency_factors: formData.urgencyFactors || '',
      objections: formData.objections || '',
      call_to_action: formData.callToAction || '',
      lead_destination: formData.leadDestination || '',
      landing_page_sections: formData.landingPageSections || '',
      specific_requirements: formData.specificRequirements || '',
      brand_colors: formData.brandColors || '',
      brand_personality: formData.brandPersonality || '',
      communication_tone: formData.communicationTone || '',
      key_messages: formData.keyMessages || '',
      has_logo: formData.hasLogo || '',
      logo_files: logoUrls,
      visual_references: formData.visualReferences || '',
      visual_files: visualUrls,
      content_materials: formData.contentMaterials || '',
      material_files: materialUrls,
      desired_domain: formData.desiredDomain || '',
      domain_info: formData.desiredDomain || '',
      integrations: formData.integrations || '',
      analytics_tracking: formData.analytics || '',
      deadline: formData.deliveryDeadline || '',
      start_date: formData.startDate || '',
      budget: "Valor Acordado na Workana",
      additional_notes: formData.additionalNotes || ''
    }

    // 3. Salvar no banco de dados com retry
    console.log('💾 Salvando no Supabase...', { companyName: briefingData.company_name });
    const savedBriefing = await retryOperation(() => saveBriefing(briefingData), 3, 2000);
    console.log('✅ Briefing salvo no Supabase com sucesso!', { id: savedBriefing.id });

    // 4. Enviar notificação por email (opcional)
    try {
      console.log('📧 Enviando notificação por email...');
      await sendNotificationEmail(savedBriefing)
      console.log('✅ Email de notificação enviado!');
    } catch (emailError) {
      console.warn('⚠️ Falha no envio do email (não crítico):', emailError);
    }

    return savedBriefing

  } catch (error) {
    console.error('❌ Erro ao processar briefing:', error)
    
    // Log detalhado do erro
    if (error instanceof Error) {
      console.error('Detalhes do erro:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    if (error instanceof Error) {
      // Se é um erro específico (upload, validação, etc), manter a mensagem
      throw error
    } else {
      // Erro genérico
      throw new Error('Falha ao enviar briefing. Verifique sua conexão e tente novamente.')
    }
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