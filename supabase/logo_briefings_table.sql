-- ============================================================================
-- TABELA: logo_briefings
-- Descrição: Armazena briefings para criação de logos
-- Data: Novembro 2025
-- ============================================================================

-- 1. Criar a tabela
CREATE TABLE IF NOT EXISTS logo_briefings (
  -- Identificação e Metadados
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- ========================================================================
  -- ETAPA 1: INFORMAÇÕES DA EMPRESA
  -- ========================================================================
  company_name TEXT NOT NULL,
  business_segment TEXT NOT NULL,
  company_description TEXT NOT NULL,
  company_values TEXT,
  target_audience TEXT,
  brand_personality TEXT,
  
  -- Informações de Contato
  responsible_name TEXT NOT NULL,
  current_logo TEXT,
  
  -- ========================================================================
  -- ETAPA 2: CONCEITO E ESTILO
  -- ========================================================================
  logo_style TEXT NOT NULL,
  logo_type TEXT NOT NULL,
  logo_mood TEXT NOT NULL,
  messages_to_convey TEXT NOT NULL,
  competitor_logos TEXT,
  what_to_avoid TEXT,
  
  -- ========================================================================
  -- ETAPA 3: ELEMENTOS VISUAIS
  -- ========================================================================
  preferred_colors TEXT NOT NULL,
  colors_to_avoid TEXT,
  symbols_elements TEXT,
  typography_preference TEXT,
  visual_references TEXT,
  visual_files TEXT[],
  
  -- ========================================================================
  -- ETAPA 4: APLICAÇÕES E FORMATOS
  -- ========================================================================
  logo_applications TEXT NOT NULL,
  required_formats TEXT,
  logo_versions TEXT,
  specific_requirements TEXT,
  
  -- ========================================================================
  -- ETAPA 5: TIMELINE E ORÇAMENTO
  -- ========================================================================
  deadline TEXT NOT NULL,
  budget TEXT,
  additional_notes TEXT,
  
  -- ========================================================================
  -- PROPOSTA E VALORES
  -- ========================================================================
  proposal_value NUMERIC(10, 2),
  proposal_date TIMESTAMPTZ
);

-- 2. Comentários descritivos para documentação
COMMENT ON TABLE logo_briefings IS 'Armazena briefings completos para criação de logos profissionais';
COMMENT ON COLUMN logo_briefings.id IS 'Identificador único do briefing';
COMMENT ON COLUMN logo_briefings.company_name IS 'Nome da empresa ou marca';
COMMENT ON COLUMN logo_briefings.business_segment IS 'Segmento de atuação da empresa';
COMMENT ON COLUMN logo_briefings.company_description IS 'Descrição detalhada da empresa';
COMMENT ON COLUMN logo_briefings.logo_style IS 'Estilo de logo preferido (minimalista, moderna, clássica, etc.)';
COMMENT ON COLUMN logo_briefings.logo_type IS 'Tipo de logo (logotipo, símbolo, combinado, etc.)';
COMMENT ON COLUMN logo_briefings.logo_mood IS 'Sensação/mood que a logo deve transmitir';
COMMENT ON COLUMN logo_briefings.preferred_colors IS 'Cores preferidas para a logo';
COMMENT ON COLUMN logo_briefings.visual_files IS 'Array de URLs de arquivos de referências visuais';
COMMENT ON COLUMN logo_briefings.logo_applications IS 'Onde a logo será utilizada';
COMMENT ON COLUMN logo_briefings.proposal_value IS 'Valor da proposta em reais';

-- 3. Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_logo_briefings_created_at 
  ON logo_briefings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_logo_briefings_company_name 
  ON logo_briefings(company_name);

CREATE INDEX IF NOT EXISTS idx_logo_briefings_responsible_name 
  ON logo_briefings(responsible_name);

CREATE INDEX IF NOT EXISTS idx_logo_briefings_business_segment 
  ON logo_briefings(business_segment);

CREATE INDEX IF NOT EXISTS idx_logo_briefings_logo_style 
  ON logo_briefings(logo_style);

-- 4. RLS (Row Level Security)
ALTER TABLE logo_briefings ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança

-- Política: Permitir inserção pública (para formulário de briefing)
DROP POLICY IF EXISTS "Enable insert for all users" ON logo_briefings;
CREATE POLICY "Enable insert for all users" 
  ON logo_briefings
  FOR INSERT
  WITH CHECK (true);

-- Política: Permitir leitura apenas para usuários autenticados
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON logo_briefings;
CREATE POLICY "Enable read access for authenticated users" 
  ON logo_briefings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Permitir atualização apenas para usuários autenticados
DROP POLICY IF EXISTS "Enable update for authenticated users" ON logo_briefings;
CREATE POLICY "Enable update for authenticated users" 
  ON logo_briefings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Permitir exclusão apenas para usuários autenticados
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON logo_briefings;
CREATE POLICY "Enable delete for authenticated users" 
  ON logo_briefings
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 6. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_logo_briefings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS logo_briefings_updated_at_trigger ON logo_briefings;
CREATE TRIGGER logo_briefings_updated_at_trigger
  BEFORE UPDATE ON logo_briefings
  FOR EACH ROW
  EXECUTE FUNCTION update_logo_briefings_updated_at();

-- 7. View para estatísticas (opcional)
CREATE OR REPLACE VIEW logo_briefings_stats AS
SELECT 
  COUNT(*) as total_briefings,
  COUNT(DISTINCT business_segment) as total_segments,
  COUNT(DISTINCT logo_style) as total_styles,
  COUNT(DISTINCT logo_type) as total_types,
  COUNT(*) FILTER (WHERE proposal_value IS NOT NULL) as total_with_proposal,
  AVG(proposal_value) as avg_proposal_value,
  MIN(created_at) as first_briefing_date,
  MAX(created_at) as last_briefing_date
FROM logo_briefings;

-- 8. Verificação final
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'logo_briefings'
  ) THEN
    RAISE NOTICE '✅ Tabela logo_briefings criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro ao criar tabela logo_briefings';
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

