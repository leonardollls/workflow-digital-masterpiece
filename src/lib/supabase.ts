import { createClient } from '@supabase/supabase-js'

// ⚠️ CONFIGURAÇÃO PARA DEPLOY MANUAL NA HOSTINGER
// Substitua as URLs abaixo pelas suas credenciais do Supabase

const supabaseUrl = 'https://sphiqzwnkuzfiwejjlav.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGlxendua3V6Zml3ZWpqbGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTQxMjMsImV4cCI6MjA2NTI3MDEyM30.-R19Vv3EgGxjeb0PoqaU4-SMi46E3PE-7FnFIyxWUds'

// ⚠️ IMPORTANTE: 
// 1. Substitua 'SEU_PROJETO' pela URL real do seu projeto Supabase
// 2. Substitua 'SUA_CHAVE_ANONIMA_AQUI' pela chave anônima real
// 3. Após configurar, renomeie este arquivo para 'supabase.ts' 
//    (substitua o arquivo original)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface ClientBriefing {
  id?: string
  company_name: string
  business_segment: string
  company_description: string
  target_audience: string
  competitive_advantage: string
  landing_page_goal: string
  responsible_name: string
  current_website?: string
  product_name: string
  product_description: string
  main_benefits: string
  number_of_offers?: string
  offer_details?: string
  pricing_model?: string
  guarantees?: string
  call_to_action: string
  lead_destination: string
  landing_page_sections?: string
  specific_requirements?: string
  brand_colors?: string
  has_logo: string
  logo_files?: string[]
  visual_references?: string
  visual_files?: string[]
  content_materials?: string
  material_files?: string[]
  domain_info: string
  integrations?: string
  analytics_tracking?: string
  deadline: string
  start_date?: string
  budget?: string
  additional_notes?: string
  proposal_value?: number
  proposal_date?: string
  created_at?: string
  updated_at?: string
}

// Função para upload de arquivos
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (error) {
    throw error
  }

  return data
}

// Função para obter URL pública do arquivo
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// Função para salvar briefing
export const saveBriefing = async (briefingData: Omit<ClientBriefing, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('🔄 Tentando salvar no Supabase...', { 
    url: supabaseUrl,
    company: briefingData.company_name,
    timestamp: new Date().toISOString()
  });

  try {
    const { data, error } = await supabase
      .from('client_briefings')
      .insert({
        ...briefingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro do Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Erro de banco de dados: ${error.message}`);
    }

    console.log('✅ Dados salvos com sucesso no Supabase:', data);
    return data;
    
  } catch (networkError) {
    console.error('❌ Erro de rede/conectividade:', networkError);
    
    // Verificar se é erro de conectividade
    if (!navigator.onLine) {
      throw new Error('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
    }
    
    throw networkError;
  }
} 