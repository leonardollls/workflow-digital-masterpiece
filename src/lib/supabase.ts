import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ⚠️ CONFIGURAÇÃO PARA DEPLOY MANUAL NA HOSTINGER
// Substitua as URLs abaixo pelas suas credenciais do Supabase

const supabaseUrl = 'https://sphiqzwnkuzfiwejjlav.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaGlxendua3V6Zml3ZWpqbGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTQxMjMsImV4cCI6MjA2NTI3MDEyM30.-R19Vv3EgGxjeb0PoqaU4-SMi46E3PE-7FnFIyxWUds'

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Credenciais do Supabase não configuradas');
  throw new Error('Missing Supabase environment variables')
}

console.log('🔧 Configurando Supabase cliente...');

// Criar cliente Supabase com configurações otimizadas
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'workflow-app@1.0.0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

console.log('✅ Supabase cliente configurado com sucesso');

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

// Função para upload de arquivos com error handling melhorado
export const uploadFile = async (file: File, bucket: string, path: string) => {
  try {
    console.log('📁 [SUPABASE] Iniciando upload:', { 
      file: file.name, 
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
      bucket, 
      path 
    });
    
    // Verificar se o arquivo é válido
    if (!file || file.size === 0) {
      throw new Error('Arquivo inválido ou vazio');
    }
    
    // Tentar upload com configurações otimizadas
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true, // Sobrescrever se já existir
        duplex: 'half' // Para arquivos grandes
      });

    if (error) {
      console.error('❌ [SUPABASE] Erro detalhado no upload:', {
        message: error.message,
        statusCode: (error as any).statusCode,
        error: error
      });
      
      // Melhorar mensagens de erro baseadas no código
      if (error.message.includes('413') || error.message.includes('too large')) {
        throw new Error('Arquivo muito grande para upload');
      } else if (error.message.includes('403') || error.message.includes('forbidden')) {
        throw new Error('Sem permissão para fazer upload');
      } else if (error.message.includes('400') || error.message.includes('bad request')) {
        throw new Error('Formato de arquivo não suportado');
      } else if (error.message.includes('timeout') || error.message.includes('network')) {
        throw new Error('Timeout na conexão - tente novamente');
      } else {
        throw new Error(`Erro do servidor: ${error.message}`);
      }
    }

    console.log('✅ [SUPABASE] Upload realizado com sucesso:', {
      path: data.path,
      fullPath: data.fullPath,
      id: data.id
    });
    
    return data;
  } catch (error) {
    console.error('❌ [SUPABASE] Erro final no upload:', error);
    throw error;
  }
}

// Função para obter URL pública do arquivo
export const getPublicUrl = (bucket: string, path: string) => {
  try {
    console.log('🔗 Obtendo URL pública:', { bucket, path });
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    console.log('✅ URL pública obtida:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('❌ Erro ao obter URL pública:', error);
    return '';
  }
}

// Função para salvar briefing com error handling melhorado
export const saveBriefing = async (briefingData: Omit<ClientBriefing, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('🔄 Tentando salvar no Supabase...', { 
    url: supabaseUrl,
    company: briefingData.company_name,
    timestamp: new Date().toISOString()
  });

  try {
    // Verificar conexão com o Supabase
    const { data: healthCheck } = await supabase
      .from('client_briefings')
      .select('count')
      .limit(1);

    console.log('🏥 Health check do Supabase:', healthCheck ? 'OK' : 'Falhou');

    const { data, error } = await supabase
      .from('client_briefings')
      .insert({
        ...briefingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

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
    
  } catch (networkError: any) {
    console.error('❌ Erro de rede/conectividade:', networkError);
    
    // Verificar se é erro de conectividade
    if (!navigator.onLine) {
      throw new Error('Sem conexão com a internet. Verifique sua conexão e tente novamente.');
    }
    
    // Se for erro de CORS ou rede
    if (networkError.message?.includes('fetch')) {
      throw new Error('Erro de conexão com o banco de dados. Tente novamente em alguns minutos.');
    }
    
    throw networkError;
  }
} 