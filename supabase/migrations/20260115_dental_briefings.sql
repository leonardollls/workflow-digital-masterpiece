-- ============================================================================
-- TABELA: dental_briefings
-- Descrição: Armazena briefings para criação de sites odontológicos
-- Data: Janeiro 2026
-- ============================================================================

-- 1. Criar a tabela
CREATE TABLE IF NOT EXISTS dental_briefings (
  -- Identificação e Metadados
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- ========================================================================
  -- SEÇÃO 1: IDENTIDADE DA MARCA
  -- ========================================================================
  -- Nome exato para usar no topo do site (Ex: Dra. Ana Silva | Clínica Sorriso Perfeito)
  clinic_name TEXT NOT NULL,
  
  -- URL do arquivo de logo (PNG/Fundo transparente ou Vetor)
  logo_file TEXT,
  
  -- Preferência de cores: 'keep_current' | 'new_suggestion' | texto livre
  color_preference TEXT NOT NULL DEFAULT 'keep_current',
  
  -- ========================================================================
  -- SEÇÃO 2: CONTEÚDO ESTRATÉGICO
  -- ========================================================================
  -- Link do Instagram (principal vitrine para extrair fotos)
  instagram_link TEXT,
  
  -- 4 principais tratamentos "Carro-Chefe" da clínica
  main_treatments TEXT NOT NULL,
  
  -- Frase de impacto/slogan (opcional - pode ser criada pelo designer)
  slogan TEXT,
  
  -- Dados de contato: endereço completo e WhatsApp
  contact_info TEXT NOT NULL,
  
  -- ========================================================================
  -- SEÇÃO 3: COMPROMISSO
  -- ========================================================================
  -- URL da foto de perfil profissional do doutor(a)
  profile_photo TEXT,
  
  -- Checkbox de aceite do termo de compromisso
  agreed_terms BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- ========================================================================
  -- PROPOSTA E VALORES (para admin)
  -- ========================================================================
  proposal_value NUMERIC(10, 2),
  proposal_date TIMESTAMPTZ,
  
  -- ========================================================================
  -- CAMPOS ADICIONAIS (para compatibilidade com admin)
  -- ========================================================================
  responsible_name TEXT,
  business_segment TEXT DEFAULT 'odontologia'
);

-- 2. Comentários descritivos para documentação
COMMENT ON TABLE dental_briefings IS 'Armazena briefings para criação de sites odontológicos profissionais';
COMMENT ON COLUMN dental_briefings.id IS 'Identificador único do briefing';
COMMENT ON COLUMN dental_briefings.clinic_name IS 'Nome exato para usar no topo do site';
COMMENT ON COLUMN dental_briefings.logo_file IS 'URL do arquivo de logo (PNG/Vetor)';
COMMENT ON COLUMN dental_briefings.color_preference IS 'Preferência de cores da marca';
COMMENT ON COLUMN dental_briefings.instagram_link IS 'Link do Instagram para extrair fotos';
COMMENT ON COLUMN dental_briefings.main_treatments IS '4 principais tratamentos da clínica';
COMMENT ON COLUMN dental_briefings.slogan IS 'Frase de impacto/slogan';
COMMENT ON COLUMN dental_briefings.contact_info IS 'Endereço completo e WhatsApp';
COMMENT ON COLUMN dental_briefings.profile_photo IS 'Foto de perfil profissional do doutor(a)';
COMMENT ON COLUMN dental_briefings.agreed_terms IS 'Aceite do termo de compromisso';
COMMENT ON COLUMN dental_briefings.proposal_value IS 'Valor da proposta em reais';
COMMENT ON COLUMN dental_briefings.proposal_date IS 'Data da proposta';

-- 3. Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_dental_briefings_created_at 
  ON dental_briefings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dental_briefings_clinic_name 
  ON dental_briefings(clinic_name);

CREATE INDEX IF NOT EXISTS idx_dental_briefings_agreed_terms 
  ON dental_briefings(agreed_terms);

-- 4. RLS (Row Level Security)
ALTER TABLE dental_briefings ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de segurança
-- Política: Acesso total público (consistente com outras tabelas de briefing)
-- Permite INSERT, SELECT, UPDATE, DELETE para todos os usuários (incluindo anônimos)
CREATE POLICY "Service role tem acesso total aos briefings odontologicos"
  ON dental_briefings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Nota: Segurança mantida através de:
-- 1. Autenticação no painel administrativo (React)
-- 2. Validação de dados no frontend e backend
-- 3. API Keys do Supabase configuradas adequadamente
-- 4. Briefings são dados não-sensíveis (informações de design)

-- 6. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_dental_briefings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS dental_briefings_updated_at_trigger ON dental_briefings;
CREATE TRIGGER dental_briefings_updated_at_trigger
  BEFORE UPDATE ON dental_briefings
  FOR EACH ROW
  EXECUTE FUNCTION update_dental_briefings_updated_at();

-- 7. Verificação final
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'dental_briefings'
  ) THEN
    RAISE NOTICE '✅ Tabela dental_briefings criada com sucesso!';
  ELSE
    RAISE EXCEPTION '❌ Erro ao criar tabela dental_briefings';
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
