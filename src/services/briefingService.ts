import { supabase, uploadFile, getPublicUrl, saveBriefing, type ClientBriefing } from '@/lib/supabase'
import type { ClientBriefForm } from '@/pages/ClientBrief'

// Função para fazer upload de múltiplos arquivos
const uploadFiles = async (files: FileList | null, bucket: string, folder: string): Promise<string[]> => {
  if (!files || files.length === 0) return []

  const uploadPromises = Array.from(files).map(async (file, index) => {
    const timestamp = Date.now()
    const fileName = `${folder}/${timestamp}_${index}_${file.name}`
    
    try {
      await uploadFile(file, bucket, fileName)
      return getPublicUrl(bucket, fileName)
    } catch (error) {
      console.error(`Erro ao fazer upload do arquivo ${file.name}:`, error)
      throw error
    }
  })

  return Promise.all(uploadPromises)
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
      company_description: formData.companyDescription,
      target_audience: formData.targetAudience,
      competitive_advantage: formData.competitiveAdvantage,
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
      domain_info: formData.domainInfo,
      integrations: formData.integrations,
      analytics_tracking: formData.analyticsTracking,
      deadline: formData.deadline,
      budget: formData.budget,
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
    throw new Error('Falha ao enviar briefing. Tente novamente.')
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
  const { data, error } = await supabase
    .from('client_briefings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Função para obter um briefing específico
export const getBriefing = async (id: string) => {
  const { data, error } = await supabase
    .from('client_briefings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
} 