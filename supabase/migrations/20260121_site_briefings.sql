-- Migration: Criar tabela site_briefings
-- Autor: Leonardo Lopes
-- Data: 2026-01-21
-- Descrição: Tabela para armazenar briefings de sites institucionais (novo formulário moderno)

-- Criar tabela site_briefings
CREATE TABLE IF NOT EXISTS site_briefings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Seção 1: Informações da Empresa
    company_name TEXT NOT NULL DEFAULT 'Nome não informado',
    business_segment TEXT NOT NULL DEFAULT 'Segmento não informado',
    company_description TEXT NOT NULL DEFAULT 'Descrição não informada',
    company_history TEXT,
    mission TEXT,
    vision TEXT,
    values TEXT,
    target_audience TEXT NOT NULL DEFAULT 'Público não informado',
    competitive_advantage TEXT NOT NULL DEFAULT 'Diferencial não informado',
    responsible_name TEXT NOT NULL DEFAULT 'Responsável não informado',
    current_website TEXT,
    
    -- Seção 2: Objetivos e Estrutura do Site
    website_goal TEXT NOT NULL DEFAULT 'Objetivo não informado',
    website_type TEXT NOT NULL DEFAULT 'Tipo não informado',
    main_functionalities TEXT NOT NULL DEFAULT 'Funcionalidades não informadas',
    required_pages TEXT NOT NULL DEFAULT 'Páginas não especificadas',
    navigation_structure TEXT,
    content_hierarchy TEXT,
    services_products TEXT NOT NULL DEFAULT 'Serviços não descritos',
    team_info TEXT,
    certifications TEXT,
    awards_recognition TEXT,
    case_studies TEXT,
    testimonials TEXT,
    
    -- Seção 3: Design e Identidade Visual
    design_style TEXT,
    brand_colors TEXT,
    has_logo TEXT NOT NULL DEFAULT 'nao-informado',
    logo_files TEXT[],
    visual_references TEXT,
    visual_files TEXT[],
    main_competitors TEXT,
    customer_pain_points TEXT,
    customer_objections TEXT,
    communication_tone TEXT,
    key_messages TEXT,
    specific_requirements TEXT,
    content_materials TEXT,
    material_files TEXT[],
    
    -- Seção 4: Funcionalidades Técnicas
    contact_forms TEXT,
    integrations TEXT,
    seo_requirements TEXT,
    analytics_tracking TEXT,
    domain_info TEXT NOT NULL DEFAULT 'Não informado',
    hosting_preferences TEXT,
    
    -- Seção 5: Timeline e Orçamento
    deadline TEXT NOT NULL DEFAULT 'Valor Acordado na Workana',
    budget TEXT DEFAULT 'Valor Acordado na Workana',
    additional_notes TEXT,
    
    -- Campos de proposta (preenchidos pelo admin)
    proposal_value DECIMAL(10, 2),
    proposal_date TIMESTAMPTZ,
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar índices para otimização
CREATE INDEX IF NOT EXISTS idx_site_briefings_created_at ON site_briefings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_briefings_company_name ON site_briefings(company_name);
CREATE INDEX IF NOT EXISTS idx_site_briefings_business_segment ON site_briefings(business_segment);

-- Habilitar RLS (Row Level Security)
ALTER TABLE site_briefings ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (qualquer pessoa pode enviar briefing)
CREATE POLICY "Permitir inserção pública de briefings de site"
ON site_briefings
FOR INSERT
TO public
WITH CHECK (true);

-- Política para permitir leitura para usuários autenticados (admin)
CREATE POLICY "Permitir leitura para usuários autenticados"
ON site_briefings
FOR SELECT
TO authenticated
USING (true);

-- Política para permitir atualização para usuários autenticados (admin)
CREATE POLICY "Permitir atualização para usuários autenticados"
ON site_briefings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política para permitir deleção para usuários autenticados (admin)
CREATE POLICY "Permitir deleção para usuários autenticados"
ON site_briefings
FOR DELETE
TO authenticated
USING (true);

-- Permitir leitura anônima para o formulário funcionar
CREATE POLICY "Permitir leitura anônima de briefings de site"
ON site_briefings
FOR SELECT
TO anon
USING (true);

-- Comentário na tabela
COMMENT ON TABLE site_briefings IS 'Tabela para armazenar briefings de sites institucionais (formulário moderno)';
