import { supabase, uploadFile, getPublicUrl, saveBriefing, type ClientBriefing } from '@/lib/supabase'
import type { ClientBriefForm } from '@/pages/ClientBrief'

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

// Função principal para processar e enviar o briefing
export const submitBriefing = async (formData: ClientBriefForm): Promise<ClientBriefing> => {
  try {
    // 1. Upload dos arquivos
    const [logoUrls, visualUrls, materialUrls] = await Promise.all([
      uploadFiles(formData.logoFiles, 'briefing-files', 'logos'),
      uploadFiles(formData.visualFiles, 'briefing-files', 'visual-references'),
      uploadFiles(formData.materialFiles, 'briefing-files', 'materials')
    ])

    // 2. Preparar dados para o banco
    const briefingData: Omit<ClientBriefing, 'id' | 'created_at' | 'updated_at'> = {
      company_name: formData.companyName,
      business_segment: formData.businessSegment,
      company_description: formData.businessDescription,
      target_audience: formData.targetAudience,
      competitive_advantage: formData.competitiveDifferential,
      landing_page_goal: formData.landingPageGoal,
      responsible_name: formData.responsibleName,
      current_website: formData.currentWebsite,
      product_name: formData.productName,
      product_description: formData.productDescription,
      main_benefits: formData.mainBenefits,
      price_range: formData.priceRange,
      guarantees: formData.guarantees,
      call_to_action: formData.callToAction,
      lead_destination: formData.leadDestination,
      brand_colors: formData.brandColors,
      has_logo: formData.hasLogo,
      logo_files: logoUrls,
      visual_references: formData.visualReferences,
      visual_files: visualUrls,
      content_materials: formData.contentMaterials,
      material_files: materialUrls,
      domain_info: formData.desiredDomain || '',
      integrations: formData.integrations,
      analytics_tracking: formData.analytics,
      deadline: formData.deliveryDeadline,
      start_date: formData.startDate,
      additional_notes: formData.additionalNotes
    }

    // 3. Salvar no banco de dados
    const savedBriefing = await saveBriefing(briefingData)

    // 4. Enviar notificação por email (opcional)
    await sendNotificationEmail(savedBriefing)

    return savedBriefing

  } catch (error) {
    console.error('Erro ao processar briefing:', error)
    
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
    // Primeiro tentar buscar do Supabase
    const { data, error } = await supabase
      .from('client_briefings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar briefings do Supabase:', error)
      // Fallback: buscar do localStorage
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      console.log('Usando briefings do localStorage:', localBriefings)
      return localBriefings
    }

    return data
  } catch (error) {
    console.error('Erro geral ao buscar briefings:', error)
    // Fallback: buscar do localStorage
    const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
    console.log('Usando briefings do localStorage (fallback):', localBriefings)
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
    const { error } = await supabase
      .from('client_briefings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Erro ao excluir briefing do Supabase:', error)
      
      // Fallback: excluir do localStorage
      console.log('🔄 Tentando fallback no localStorage após erro de delete...')
      const localBriefings = JSON.parse(localStorage.getItem('briefings') || '[]')
      const originalLength = localBriefings.length
      const filteredBriefings = localBriefings.filter((b: any) => b.id !== id)
      
      if (filteredBriefings.length === originalLength) {
        console.error('❌ Briefing não encontrado no localStorage')
        throw new Error('Briefing não encontrado para exclusão')
      }
      
      localStorage.setItem('briefings', JSON.stringify(filteredBriefings))
      console.log('✅ Briefing excluído do localStorage (fallback)')
      return
    }

    console.log('✅ Briefing excluído do Supabase com sucesso')
    
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