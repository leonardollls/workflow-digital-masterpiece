-- Migration: WhatsApp Scripts System
-- Tabelas para gerenciamento de scripts de WhatsApp vinculados a sites captados

-- =====================================================
-- Tabela: whatsapp_scripts
-- Templates de scripts reutilizáveis
-- =====================================================
CREATE TABLE IF NOT EXISTS whatsapp_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_template BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para whatsapp_scripts
CREATE INDEX IF NOT EXISTS idx_whatsapp_scripts_category ON whatsapp_scripts(category_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_scripts_is_template ON whatsapp_scripts(is_template);
CREATE INDEX IF NOT EXISTS idx_whatsapp_scripts_created_at ON whatsapp_scripts(created_at DESC);

-- =====================================================
-- Enum para tipos de mensagem
-- =====================================================
DO $$ BEGIN
  CREATE TYPE message_type AS ENUM ('text', 'image', 'conditional');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Tabela: script_messages
-- Mensagens individuais dentro de um script
-- =====================================================
CREATE TABLE IF NOT EXISTS script_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID NOT NULL REFERENCES whatsapp_scripts(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  type message_type DEFAULT 'text',
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  condition TEXT,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  parent_message_id UUID REFERENCES script_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para script_messages
CREATE INDEX IF NOT EXISTS idx_script_messages_script ON script_messages(script_id);
CREATE INDEX IF NOT EXISTS idx_script_messages_order ON script_messages(script_id, "order");
CREATE INDEX IF NOT EXISTS idx_script_messages_parent ON script_messages(parent_message_id);

-- =====================================================
-- Tabela: site_script_assignments
-- Atribuição de scripts a sites captados
-- =====================================================
CREATE TABLE IF NOT EXISTS site_script_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES captation_sites(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES whatsapp_scripts(id) ON DELETE CASCADE,
  custom_values JSONB DEFAULT '{}',
  sent_messages JSONB DEFAULT '[]',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, script_id)
);

-- Índices para site_script_assignments
CREATE INDEX IF NOT EXISTS idx_site_script_site ON site_script_assignments(site_id);
CREATE INDEX IF NOT EXISTS idx_site_script_script ON site_script_assignments(script_id);
CREATE INDEX IF NOT EXISTS idx_site_script_assigned ON site_script_assignments(assigned_at DESC);

-- =====================================================
-- Trigger para atualizar updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_whatsapp_scripts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_whatsapp_scripts_updated_at ON whatsapp_scripts;
CREATE TRIGGER trigger_whatsapp_scripts_updated_at
  BEFORE UPDATE ON whatsapp_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_whatsapp_scripts_updated_at();

-- =====================================================
-- RLS Policies
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE whatsapp_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_script_assignments ENABLE ROW LEVEL SECURITY;

-- Policies para whatsapp_scripts
DROP POLICY IF EXISTS "Allow all operations on whatsapp_scripts" ON whatsapp_scripts;
CREATE POLICY "Allow all operations on whatsapp_scripts" ON whatsapp_scripts
  FOR ALL USING (true) WITH CHECK (true);

-- Policies para script_messages
DROP POLICY IF EXISTS "Allow all operations on script_messages" ON script_messages;
CREATE POLICY "Allow all operations on script_messages" ON script_messages
  FOR ALL USING (true) WITH CHECK (true);

-- Policies para site_script_assignments
DROP POLICY IF EXISTS "Allow all operations on site_script_assignments" ON site_script_assignments;
CREATE POLICY "Allow all operations on site_script_assignments" ON site_script_assignments
  FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- Dados iniciais: Script de exemplo
-- =====================================================
DO $$
DECLARE
  script_id UUID;
  msg1_id UUID;
  msg2_id UUID;
  msg3_id UUID;
BEGIN
  -- Criar script template de exemplo
  INSERT INTO whatsapp_scripts (name, description, is_template)
  VALUES (
    'Abordagem Profissional - Clínica de Saúde',
    'Script padrão para abordagem de clínicas médicas e odontológicas com proposta de site profissional',
    true
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO script_id;
  
  -- Se o script foi criado, adicionar mensagens
  IF script_id IS NOT NULL THEN
    -- Mensagem 1: Apresentação
    INSERT INTO script_messages (script_id, "order", type, title, content, position_x, position_y)
    VALUES (
      script_id,
      1,
      'text',
      'Apresentação Inicial',
      E'Boa tarde.\nMe chamo Leonardo, sou Designer especializado na área da saúde.\nTomei a liberdade de criar uma nova proposta de site profissional para a clínica {{nome_contato}}, focada em transmitir mais autoridade e sofisticação.',
      100,
      100
    )
    RETURNING id INTO msg1_id;
    
    -- Mensagem 2: Mockup/Imagem
    INSERT INTO script_messages (script_id, "order", type, title, content, image_url, position_x, position_y, parent_message_id)
    VALUES (
      script_id,
      2,
      'image',
      'MOCKUP - Imagem do Projeto',
      '[ENVIE A IMAGEM DO COMPUTADOR AQUI]',
      NULL,
      100,
      220
    ,
      msg1_id
    )
    RETURNING id INTO msg2_id;
    
    -- Mensagem 3: Gancho imediato
    INSERT INTO script_messages (script_id, "order", type, title, content, position_x, position_y, parent_message_id)
    VALUES (
      script_id,
      3,
      'text',
      'Gancho Imediato',
      E'O site já está pronto. O resultado ficou incrível e muito superior ao antigo.\nPara quem eu posso enviar o link de visualização (sem compromisso) para aprovação?',
      100,
      340
    ,
      msg2_id
    )
    RETURNING id INTO msg3_id;
    
    -- Mensagem 4: Após resposta positiva
    INSERT INTO script_messages (script_id, "order", type, title, content, condition, position_x, position_y, parent_message_id)
    VALUES (
      script_id,
      4,
      'conditional',
      'Link da Proposta (Após Resposta Positiva)',
      E'Ótimo!\nCriei uma página de apresentação explicando por que esse novo padrão visual e técnico vai atrair mais pacientes particulares para a clínica.\n*Segue o link do projeto* 👇 {{link_proposta}}\nNessa página eu detalho exatamente como a nova estrutura vai ajudar na autoridade da clínica e apresento o investimento.\n*Uma dica:* Se possível, acesse pelo computador. Assim você consegue visualizar todos os detalhes do design e testar a performance em tela cheia.\n_Obs: O site já vem com um Painel Administrativo incluso. Vocês terão total autonomia para alterar fotos e textos quando quiserem, sem custos extras!_\nFico à total disposição se tiver qualquer dúvida!',
      'after_positive_response',
      100,
      460
    ,
      msg3_id
    );
  END IF;
END $$;
