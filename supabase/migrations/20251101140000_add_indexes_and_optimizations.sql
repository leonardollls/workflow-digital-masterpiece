-- =====================================================
-- MIGRATION: Adicionar Índices e Otimizações
-- =====================================================
-- Criado em: 2025-11-01
-- Objetivo: Melhorar performance de queries mais comuns

-- =====================================================
-- 1. ÍNDICES PARA BRIEFINGS
-- =====================================================

-- Client Briefings - ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_client_briefings_created_at 
ON client_briefings(created_at DESC);

-- Client Briefings - busca por empresa
CREATE INDEX IF NOT EXISTS idx_client_briefings_company_name 
ON client_briefings(company_name);

-- Client Briefings - busca por responsável
CREATE INDEX IF NOT EXISTS idx_client_briefings_responsible_name 
ON client_briefings(responsible_name);

-- Institutional Briefings - ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_institutional_briefings_created_at 
ON institutional_briefings(created_at DESC);

-- Institutional Briefings - busca por empresa
CREATE INDEX IF NOT EXISTS idx_institutional_briefings_company_name 
ON institutional_briefings(company_name);

-- Institutional Briefings - busca por responsável
CREATE INDEX IF NOT EXISTS idx_institutional_briefings_responsible_name 
ON institutional_briefings(responsible_name);

COMMENT ON INDEX idx_client_briefings_created_at IS 'Otimiza listagem de briefings por data de criação (mais recentes primeiro)';
COMMENT ON INDEX idx_institutional_briefings_created_at IS 'Otimiza listagem de briefings por data de criação (mais recentes primeiro)';

-- =====================================================
-- 2. ÍNDICES PARA UPLOADS
-- =====================================================

-- Client Uploads - ordenação por data
CREATE INDEX IF NOT EXISTS idx_client_uploads_created_at 
ON client_uploads(created_at DESC);

-- Client Uploads - busca por cliente
CREATE INDEX IF NOT EXISTS idx_client_uploads_client_name 
ON client_uploads(client_name);

-- Client Uploads - busca por email
CREATE INDEX IF NOT EXISTS idx_client_uploads_client_email 
ON client_uploads(client_email);

-- Client Uploads - filtro por status
CREATE INDEX IF NOT EXISTS idx_client_uploads_status 
ON client_uploads(upload_status);

-- Client Uploads - busca composta (cliente + status)
CREATE INDEX IF NOT EXISTS idx_client_uploads_client_status 
ON client_uploads(client_name, upload_status);

COMMENT ON INDEX idx_client_uploads_created_at IS 'Otimiza listagem de uploads por data';
COMMENT ON INDEX idx_client_uploads_status IS 'Otimiza filtros por status de upload';

-- =====================================================
-- 3. ÍNDICES PARA PORTFOLIO
-- =====================================================

-- Portfolio Images - filtro por ativo
CREATE INDEX IF NOT EXISTS idx_portfolio_images_is_active 
ON portfolio_images(is_active) WHERE is_active = true;

-- Portfolio Images - filtro por categoria
CREATE INDEX IF NOT EXISTS idx_portfolio_images_category 
ON portfolio_images(project_category);

-- Portfolio Images - ordenação por prioridade
CREATE INDEX IF NOT EXISTS idx_portfolio_images_priority 
ON portfolio_images(priority DESC);

-- Portfolio Images - busca composta (ativo + categoria)
CREATE INDEX IF NOT EXISTS idx_portfolio_images_active_category 
ON portfolio_images(is_active, project_category) 
WHERE is_active = true;

-- Portfolio Images - ordenação por data
CREATE INDEX IF NOT EXISTS idx_portfolio_images_created_at 
ON portfolio_images(created_at DESC);

COMMENT ON INDEX idx_portfolio_images_is_active IS 'Otimiza busca de imagens ativas apenas';
COMMENT ON INDEX idx_portfolio_images_priority IS 'Otimiza ordenação por prioridade';

-- =====================================================
-- 4. ÍNDICES PARA CAPTAÇÃO
-- =====================================================

-- Captation Sites - filtro por cidade
CREATE INDEX IF NOT EXISTS idx_captation_sites_city_id 
ON captation_sites(city_id);

-- Captation Sites - filtro por categoria
CREATE INDEX IF NOT EXISTS idx_captation_sites_category_id 
ON captation_sites(category_id);

-- Captation Sites - filtro por status
CREATE INDEX IF NOT EXISTS idx_captation_sites_status 
ON captation_sites(proposal_status);

-- Captation Sites - busca composta (cidade + status)
CREATE INDEX IF NOT EXISTS idx_captation_sites_city_status 
ON captation_sites(city_id, proposal_status);

-- Captation Sites - ordenação por data
CREATE INDEX IF NOT EXISTS idx_captation_sites_created_at 
ON captation_sites(created_at DESC);

COMMENT ON INDEX idx_captation_sites_status IS 'Otimiza filtros por status de proposta';
COMMENT ON INDEX idx_captation_sites_city_status IS 'Otimiza busca por cidade e status';

-- =====================================================
-- 5. ÍNDICES PARA USER PROGRESS
-- =====================================================

-- User Progress - busca por usuário
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id 
ON user_progress(user_id);

-- User Progress - busca por ferramenta
CREATE INDEX IF NOT EXISTS idx_user_progress_tool_id 
ON user_progress(tool_id);

-- User Progress - busca composta (usuário + ferramenta)
CREATE INDEX IF NOT EXISTS idx_user_progress_user_tool 
ON user_progress(user_id, tool_id);

COMMENT ON INDEX idx_user_progress_user_tool IS 'Otimiza busca de progresso específico usuário-ferramenta';

-- =====================================================
-- 6. ÍNDICES PARA LOCALIZAÇÃO
-- =====================================================

-- Cities - busca por estado
CREATE INDEX IF NOT EXISTS idx_cities_state_id 
ON cities(state_id);

-- Cities - busca por nome
CREATE INDEX IF NOT EXISTS idx_cities_name 
ON cities(name);

-- States - busca por código
CREATE INDEX IF NOT EXISTS idx_states_code 
ON states(code);

COMMENT ON INDEX idx_cities_state_id IS 'Otimiza busca de cidades por estado';

-- =====================================================
-- 7. ÍNDICES DE TEXTO (BUSCA)
-- =====================================================

-- Client Briefings - busca full-text em descrição
CREATE INDEX IF NOT EXISTS idx_client_briefings_company_description_text 
ON client_briefings USING gin(to_tsvector('portuguese', company_description));

-- Institutional Briefings - busca full-text em descrição
CREATE INDEX IF NOT EXISTS idx_institutional_briefings_company_description_text 
ON institutional_briefings USING gin(to_tsvector('portuguese', company_description));

COMMENT ON INDEX idx_client_briefings_company_description_text IS 'Busca full-text em descrição da empresa';

-- =====================================================
-- 8. ESTATÍSTICAS E ANÁLISE
-- =====================================================

-- Atualizar estatísticas das tabelas para o query planner
ANALYZE client_briefings;
ANALYZE institutional_briefings;
ANALYZE client_uploads;
ANALYZE portfolio_images;
ANALYZE captation_sites;
ANALYZE user_progress;
ANALYZE cities;
ANALYZE states;

-- =====================================================
-- 9. VIEWS OTIMIZADAS (OPCIONAL)
-- =====================================================

-- View: Briefings recentes com dados relacionados
CREATE OR REPLACE VIEW recent_client_briefings AS
SELECT 
  cb.*,
  COALESCE(
    (SELECT COUNT(*) FROM client_uploads cu 
     WHERE cu.client_name = cb.company_name),
    0
  ) as upload_count
FROM client_briefings cb
ORDER BY cb.created_at DESC;

COMMENT ON VIEW recent_client_briefings IS 'Briefings de clientes com contagem de uploads';

-- View: Portfolio ativo com estatísticas
CREATE OR REPLACE VIEW active_portfolio AS
SELECT 
  project_id,
  project_title,
  project_description,
  project_category,
  COUNT(*) as image_count,
  MIN(priority) as highest_priority,
  MAX(created_at) as latest_image_date
FROM portfolio_images
WHERE is_active = true
GROUP BY project_id, project_title, project_description, project_category
ORDER BY highest_priority, latest_image_date DESC;

COMMENT ON VIEW active_portfolio IS 'Portfólio ativo agrupado por projeto com estatísticas';

-- View: Sites de captação com dados de localização
CREATE OR REPLACE VIEW captation_sites_full AS
SELECT 
  cs.*,
  c.name as city_name,
  s.name as state_name,
  s.code as state_code,
  cat.name as category_name
FROM captation_sites cs
LEFT JOIN cities c ON cs.city_id = c.id
LEFT JOIN states s ON c.state_id = s.id
LEFT JOIN categories cat ON cs.category_id = cat.id;

COMMENT ON VIEW captation_sites_full IS 'Sites de captação com dados de cidade, estado e categoria';

-- =====================================================
-- 10. FUNÇÕES DE UTILIDADE
-- =====================================================

-- Função: Contar briefings por período
CREATE OR REPLACE FUNCTION count_briefings_by_period(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  period TEXT,
  client_count BIGINT,
  institutional_count BIGINT,
  total_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'specified_period'::TEXT,
    (SELECT COUNT(*) FROM client_briefings 
     WHERE created_at BETWEEN start_date AND end_date),
    (SELECT COUNT(*) FROM institutional_briefings 
     WHERE created_at BETWEEN start_date AND end_date),
    (SELECT COUNT(*) FROM client_briefings 
     WHERE created_at BETWEEN start_date AND end_date) +
    (SELECT COUNT(*) FROM institutional_briefings 
     WHERE created_at BETWEEN start_date AND end_date);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION count_briefings_by_period IS 'Conta briefings criados em um período específico';

-- Função: Obter estatísticas de storage
CREATE OR REPLACE FUNCTION storage_stats()
RETURNS TABLE (
  bucket_id TEXT,
  file_count BIGINT,
  total_size_bytes BIGINT,
  total_size_mb NUMERIC,
  avg_file_size_mb NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.bucket_id,
    COUNT(*) as file_count,
    SUM(o.size) as total_size_bytes,
    ROUND(SUM(o.size)::NUMERIC / 1024 / 1024, 2) as total_size_mb,
    ROUND(AVG(o.size)::NUMERIC / 1024 / 1024, 2) as avg_file_size_mb
  FROM storage.objects o
  GROUP BY o.bucket_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION storage_stats IS 'Retorna estatísticas de uso de storage por bucket';

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Listar todos os índices criados
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Resumo de índices por tabela
SELECT 
  tablename,
  COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
GROUP BY tablename
ORDER BY index_count DESC;

