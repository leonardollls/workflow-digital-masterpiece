-- =====================================================
-- SCRIPT DE IMPORTAÇÃO DE DADOS PARA O NOVO PROJETO
-- =====================================================
-- Execute este script no projeto NOVO (wbtyimthsgdsftgwezop)
-- após ter exportado os dados do projeto antigo

-- =====================================================
-- NOTA IMPORTANTE:
-- =====================================================
-- Como não temos acesso direto aos dados do projeto antigo
-- (está bloqueado), este script serve como template.
-- 
-- Para usar:
-- 1. Substitua os VALUES(...) com os dados reais exportados
-- 2. Ou use a API do Supabase para importar via código
-- 3. Ou aguarde o desbloqueio para fazer dump completo

-- =====================================================
-- 1. IMPORTAR CLIENT_BRIEFINGS
-- =====================================================
-- Template de INSERT
-- INSERT INTO client_briefings (
--   id, company_name, business_segment, company_description,
--   current_website, target_audience, competitive_advantage,
--   landing_page_goal, responsible_name, product_name,
--   product_description, main_benefits, price_range,
--   guarantees, call_to_action, lead_destination,
--   main_competitors, customer_pain_points, success_stories,
--   social_proof, target_results, urgency_factors,
--   objections, brand_personality, communication_tone,
--   key_messages, desired_domain, brand_colors, logo_files,
--   has_logo, visual_references, visual_files,
--   content_materials, material_files, integrations,
--   analytics_tracking, domain_info, start_date, deadline,
--   budget, proposal_value, proposal_date, additional_notes,
--   number_of_offers, offer_details, pricing_model,
--   landing_page_sections, specific_requirements,
--   created_at, updated_at
-- )
-- VALUES
--   -- Cole aqui os dados exportados
--   ('uuid-1', 'Empresa 1', 'Segmento', ..., NOW(), NOW()),
--   ('uuid-2', 'Empresa 2', 'Segmento', ..., NOW(), NOW());

-- =====================================================
-- 2. IMPORTAR INSTITUTIONAL_BRIEFINGS
-- =====================================================
-- INSERT INTO institutional_briefings (...)
-- VALUES (...);

-- =====================================================
-- 3. IMPORTAR CLIENT_UPLOADS (metadados)
-- =====================================================
-- IMPORTANTE: Os arquivos físicos precisam ser copiados
-- manualmente entre os buckets de storage
-- INSERT INTO client_uploads (...)
-- VALUES (...);

-- =====================================================
-- 4. IMPORTAR PORTFOLIO_IMAGES
-- =====================================================
-- INSERT INTO portfolio_images (...)
-- VALUES (...);

-- =====================================================
-- VERIFICAÇÃO PÓS-IMPORTAÇÃO:
-- =====================================================
-- Conte os registros importados
SELECT 'client_briefings' as table_name, COUNT(*) as records FROM client_briefings
UNION ALL
SELECT 'institutional_briefings', COUNT(*) FROM institutional_briefings
UNION ALL
SELECT 'client_uploads', COUNT(*) FROM client_uploads
UNION ALL
SELECT 'portfolio_images', COUNT(*) FROM portfolio_images;

-- Verifique a integridade dos dados
SELECT 
  'client_briefings com dados incompletos' as check_name,
  COUNT(*) as count
FROM client_briefings
WHERE company_name IS NULL OR company_name = '';

-- Verifique referências de arquivos
SELECT 
  'uploads sem URL' as check_name,
  COUNT(*) as count
FROM client_uploads
WHERE file_url IS NULL OR file_url = '';

