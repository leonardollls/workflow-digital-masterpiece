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
  price_range?: string
  guarantees?: string
  call_to_action: string
  lead_destination: string
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
  budget: string
  start_date?: string
  additional_notes?: string
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
    throw error
  }

  return data
} 