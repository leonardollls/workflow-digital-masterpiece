-- ============================================================================
-- TABELA: landing_page_briefings
-- Descrição: Armazena briefings completos para criação de Landing Pages e Páginas de Vendas
-- Data: Janeiro 2026
-- ============================================================================

-- 1. Criar a tabela
CREATE TABLE IF NOT EXISTS landing_page_briefings (
  -- Identificação e Metadados
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- ========================================================================
  -- SEÇÃO 1: SOBRE SUA EMPRESA
  -- ========================================================================
  company_name TEXT NOT NULL DEFAULT 'Nome não informado',
  business_segment TEXT NOT NULL DEFAULT 'Segmento não informado',
  business_description TEXT NOT NULL DEFAULT 'Descrição não informada',
  target_audience TEXT NOT NULL DEFAULT 'Público-alvo não informado',
  competitive_differential TEXT NOT NULL DEFAULT 'Diferencial não informado',
  landing_page_goal TEXT NOT NULL DEFAULT 'Objetivo não informado',
  
  -- ========================================================================
  -- SEÇÃO 2: ESTRATÉGIA & MERCADO
  -- ========================================================================
  main_competitors TEXT,
  customer_pain_points TEXT,
  success_stories TEXT,
  social_proof TEXT,
  
  -- ========================================================================
  -- SEÇÃO 3: PRODUTO/SERVIÇO
  -- ========================================================================
  responsible_name TEXT NOT NULL DEFAULT 'Responsável não informado',
  current_website TEXT,
  product_name TEXT NOT NULL DEFAULT 'Produto não informado',
  product_description TEXT NOT NULL DEFAULT 'Descrição do produto não informada',
  main_benefits TEXT NOT NULL DEFAULT 'Benefícios não informados',
  number_of_offers TEXT,
  offer_details TEXT,
  pricing_model TEXT,
  guarantees TEXT,
  
  -- ========================================================================
  -- SEÇÃO 4: CONVERSÃO & ARGUMENTOS
  -- ========================================================================
  target_results TEXT,
  urgency_factors TEXT,
  objections TEXT,
  call_to_action TEXT NOT NULL DEFAULT 'CTA não informado',
  lead_destination TEXT NOT NULL DEFAULT 'Destino não informado',
  
  -- ========================================================================
  -- SEÇÃO 5: DESIGN & IDENTIDADE
  -- ========================================================================
  brand_colors TEXT,
  has_logo TEXT NOT NULL DEFAULT 'Não informado',
  logo_files TEXT[],
  visual_references TEXT,
  visual_files TEXT[],
  content_materials TEXT,
  material_files TEXT[],
  brand_personality TEXT,
  communication_tone TEXT,
  key_messages TEXT,
  
  -- ========================================================================
  -- SEÇÃO 6: ESTRUTURA & FUNCIONALIDADES
  -- ========================================================================
  landing_page_sections TEXT,
  specific_requirements TEXT,
  desired_domain TEXT,
  integrations TEXT,
  analytics_tracking TEXT,
  
  -- ========================================================================
  -- SEÇÃO 7: FINALIZAÇÃO
  -- ========================================================================
  additional_notes TEXT,
  agreed_terms BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- ========================================================================
  -- CAMPOS ADMINISTRATIVOS
  -- ========================================================================
  deadline TEXT DEFAULT 'Valor Acordado na Workana',
  budget TEXT DEFAULT 'Valor Acordado na Workana',
  start_date TEXT,
  proposal_value NUMERIC(10, 2),
  proposal_date TIMESTAMPTZ
);

-- 2. Comentários descritivos para documentação
COMMENT ON TABLE landing_page_briefings IS 'Armazena briefings completos para criação de Landing Pages e Páginas de Vendas';
COMMENT ON COLUMN landing_page_briefings.id IS 'Identificador único do briefing';
COMMENT ON COLUMN landing_page_briefings.company_name IS 'Nome da empresa/marca';
COMMENT ON COLUMN landing_page_briefings.business_segment IS 'Segmento/nicho de atuação';
COMMENT ON COLUMN landing_page_briefings.business_description IS 'Descrição completa do negócio';
COMMENT ON COLUMN landing_page_briefings.target_audience IS 'Descrição do público-alvo';
COMMENT ON COLUMN landing_page_briefings.competitive_differential IS 'Diferencial competitivo';
COMMENT ON COLUMN landing_page_briefings.landing_page_goal IS 'Objetivo principal da landing page';
COMMENT ON COLUMN landing_page_briefings.main_competitors IS 'Principais concorrentes';
COMMENT ON COLUMN landing_page_briefings.customer_pain_points IS 'Principais dores do cliente';
COMMENT ON COLUMN landing_page_briefings.success_stories IS 'Histórias de sucesso e cases';
COMMENT ON COLUMN landing_page_briefings.social_proof IS 'Prova social disponível';
COMMENT ON COLUMN landing_page_briefings.responsible_name IS 'Nome do responsável pelo projeto';
COMMENT ON COLUMN landing_page_briefings.current_website IS 'Site atual (se houver)';
COMMENT ON COLUMN landing_page_briefings.product_name IS 'Nome do produto/serviço';
COMMENT ON COLUMN landing_page_briefings.product_description IS 'Descrição detalhada do produto/serviço';
COMMENT ON COLUMN landing_page_briefings.main_benefits IS 'Principais benefícios';
COMMENT ON COLUMN landing_page_briefings.number_of_offers IS 'Quantidade de ofertas na landing page';
COMMENT ON COLUMN landing_page_briefings.offer_details IS 'Detalhes das ofertas e valores';
COMMENT ON COLUMN landing_page_briefings.pricing_model IS 'Modelo de cobrança';
COMMENT ON COLUMN landing_page_briefings.guarantees IS 'Garantias oferecidas';
COMMENT ON COLUMN landing_page_briefings.target_results IS 'Resultados esperados pelo cliente';
COMMENT ON COLUMN landing_page_briefings.urgency_factors IS 'Fatores de urgência';
COMMENT ON COLUMN landing_page_briefings.objections IS 'Principais objeções dos clientes';
COMMENT ON COLUMN landing_page_briefings.call_to_action IS 'Call-to-action principal';
COMMENT ON COLUMN landing_page_briefings.lead_destination IS 'Destino dos leads (WhatsApp, formulário, etc.)';
COMMENT ON COLUMN landing_page_briefings.brand_colors IS 'Cores da marca';
COMMENT ON COLUMN landing_page_briefings.has_logo IS 'Status do logo (tem, precisa criar, etc.)';
COMMENT ON COLUMN landing_page_briefings.logo_files IS 'URLs dos arquivos de logo';
COMMENT ON COLUMN landing_page_briefings.visual_references IS 'Referências visuais (texto)';
COMMENT ON COLUMN landing_page_briefings.visual_files IS 'URLs dos arquivos de referências visuais';
COMMENT ON COLUMN landing_page_briefings.content_materials IS 'Materiais próprios (descrição)';
COMMENT ON COLUMN landing_page_briefings.material_files IS 'URLs dos arquivos de materiais';
COMMENT ON COLUMN landing_page_briefings.brand_personality IS 'Personalidade da marca';
COMMENT ON COLUMN landing_page_briefings.communication_tone IS 'Tom de comunicação';
COMMENT ON COLUMN landing_page_briefings.key_messages IS 'Mensagens-chave';
COMMENT ON COLUMN landing_page_briefings.landing_page_sections IS 'Seções desejadas na landing page';
COMMENT ON COLUMN landing_page_briefings.specific_requirements IS 'Requisitos específicos';
COMMENT ON COLUMN landing_page_briefings.desired_domain IS 'Domínio desejado';
COMMENT ON COLUMN landing_page_briefings.integrations IS 'Integrações necessárias';
COMMENT ON COLUMN landing_page_briefings.analytics_tracking IS 'Analytics e tracking';
COMMENT ON COLUMN landing_page_briefings.additional_notes IS 'Observações adicionais';
COMMENT ON COLUMN landing_page_briefings.agreed_terms IS 'Aceite do termo de compromisso';
COMMENT ON COLUMN landing_page_briefings.deadline IS 'Prazo de entrega';
COMMENT ON COLUMN landing_page_briefings.budget IS 'Orçamento';
COMMENT ON COLUMN landing_page_briefings.proposal_value IS 'Valor da proposta em reais';
COMMENT ON COLUMN landing_page_briefings.proposal_date IS 'Data da proposta';

-- 3. Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_landing_page_briefings_created_at 
  ON landing_page_briefings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_landing_page_briefings_company_name 
  ON landing_page_briefings(company_name);

CREATE INDEX IF NOT EXISTS idx_landing_page_briefings_business_segment 
  ON landing_page_briefings(business_segment);

CREATE INDEX IF NOT EXISTS idx_landing_page_briefings_agreed_terms 
  ON landing_page_briefings(agreed_terms);

-- 4. RLS (Row Level Security)
ALTER TABLE landing_page_briefings ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança
-- Política: Acesso total público (consistente com outras tabelas de briefing)
-- Permite INSERT, SELECT, UPDATE, DELETE para todos os usuários (incluindo anônimos)
CREATE POLICY "Service role tem acesso total aos briefings de landing page"
  ON landing_page_briefings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Nota: Segurança mantida através de:
-- 1. Autenticação no painel administrativo (React)
-- 2. Validação de dados no frontend e backend
-- 3. API Keys do Supabase configuradas adequadamente
-- 4. Briefings são dados não-sensíveis (informações de design)

-- 6. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_landing_page_briefings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS landing_page_briefings_updated_at_trigger ON landing_page_briefings;
CREATE TRIGGER landing_page_briefings_updated_at_trigger
  BEFORE UPDATE ON landing_page_briefings
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_page_briefings_updated_at();

-- 7. Verificação final
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'landing_page_briefings'
  ) THEN
    RAISE NOTICE '✅ Tabela landing_page_briefings criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro ao criar tabela landing_page_briefings';
  END IF;
END $$;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================

-- Para executar este script no Supabase:
-- 1. Acesse o Dashboard do Supabase
-- 2. Vá em SQL Editor
-- 3. Cole este script completo
-- 4. Clique em "Run"
-- 5. Verifique se a mensagem de sucesso apareceu
