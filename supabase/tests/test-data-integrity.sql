-- =====================================================
-- TESTE: Validação de Integridade de Dados
-- =====================================================
-- Execute APÓS migrar os dados
-- Verifica integridade, consistência e qualidade dos dados

\echo '🧪 Iniciando validação de integridade de dados...\n'

-- =====================================================
-- 1. CONTAGEM DE REGISTROS
-- =====================================================
\echo '📊 Contando registros em cada tabela...'

SELECT 
  'users' as table_name,
  COUNT(*) as record_count
FROM users
UNION ALL
SELECT 'tools', COUNT(*) FROM tools
UNION ALL
SELECT 'user_progress', COUNT(*) FROM user_progress
UNION ALL
SELECT 'calculator_data', COUNT(*) FROM calculator_data
UNION ALL
SELECT 'states', COUNT(*) FROM states
UNION ALL
SELECT 'cities', COUNT(*) FROM cities
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'captation_sites', COUNT(*) FROM captation_sites
UNION ALL
SELECT 'client_briefings', COUNT(*) FROM client_briefings
UNION ALL
SELECT 'institutional_briefings', COUNT(*) FROM institutional_briefings
UNION ALL
SELECT 'client_uploads', COUNT(*) FROM client_uploads
UNION ALL
SELECT 'portfolio_images', COUNT(*) FROM portfolio_images
ORDER BY table_name;

-- =====================================================
-- 2. VERIFICAR DADOS OBRIGATÓRIOS
-- =====================================================
\echo '\n🔍 Verificando campos obrigatórios...'

-- Client Briefings - campos essenciais
SELECT 
  'client_briefings - campos vazios' as check_name,
  COUNT(*) as problematic_records
FROM client_briefings
WHERE company_name IS NULL 
   OR company_name = ''
   OR responsible_name IS NULL 
   OR responsible_name = '';

-- Institutional Briefings - campos essenciais
SELECT 
  'institutional_briefings - campos vazios' as check_name,
  COUNT(*) as problematic_records
FROM institutional_briefings
WHERE company_name IS NULL 
   OR company_name = ''
   OR responsible_name IS NULL 
   OR responsible_name = '';

-- Client Uploads - metadados completos
SELECT 
  'client_uploads - metadados incompletos' as check_name,
  COUNT(*) as problematic_records
FROM client_uploads
WHERE client_name IS NULL
   OR file_url IS NULL
   OR file_url = ''
   OR file_size IS NULL
   OR file_size = 0;

-- Portfolio Images - URLs válidas
SELECT 
  'portfolio_images - URLs ausentes' as check_name,
  COUNT(*) as problematic_records
FROM portfolio_images
WHERE original_url IS NULL
   OR original_url = ''
   OR project_id IS NULL
   OR project_id = '';

-- =====================================================
-- 3. VERIFICAR INTEGRIDADE REFERENCIAL
-- =====================================================
\echo '\n🔗 Verificando integridade referencial...'

-- User Progress - referências válidas
SELECT 
  'user_progress - users órfãos' as check_name,
  COUNT(*) as orphan_records
FROM user_progress up
LEFT JOIN users u ON up.user_id = u.id
WHERE up.user_id IS NOT NULL
  AND u.id IS NULL;

-- User Progress - tools órfãos
SELECT 
  'user_progress - tools órfãos' as check_name,
  COUNT(*) as orphan_records
FROM user_progress up
LEFT JOIN tools t ON up.tool_id = t.id
WHERE up.tool_id IS NOT NULL
  AND t.id IS NULL;

-- Calculator Data - referências válidas
SELECT 
  'calculator_data - users órfãos' as check_name,
  COUNT(*) as orphan_records
FROM calculator_data cd
LEFT JOIN users u ON cd.user_id = u.id
WHERE cd.user_id IS NOT NULL
  AND u.id IS NULL;

-- Cities - states órfãos
SELECT 
  'cities - states órfãos' as check_name,
  COUNT(*) as orphan_records
FROM cities c
LEFT JOIN states s ON c.state_id = s.id
WHERE c.state_id IS NOT NULL
  AND s.id IS NULL;

-- Captation Sites - cities órfãs
SELECT 
  'captation_sites - cities órfãs' as check_name,
  COUNT(*) as orphan_records
FROM captation_sites cs
LEFT JOIN cities c ON cs.city_id = c.id
WHERE cs.city_id IS NOT NULL
  AND c.id IS NULL;

-- Captation Sites - categories órfãs
SELECT 
  'captation_sites - categories órfãs' as check_name,
  COUNT(*) as orphan_records
FROM captation_sites cs
LEFT JOIN categories cat ON cs.category_id = cat.id
WHERE cs.category_id IS NOT NULL
  AND cat.id IS NULL;

-- =====================================================
-- 4. VERIFICAR TIMESTAMPS
-- =====================================================
\echo '\n⏰ Verificando timestamps...'

-- Briefings com created_at futuro
SELECT 
  'client_briefings - datas futuras' as check_name,
  COUNT(*) as problematic_records
FROM client_briefings
WHERE created_at > NOW();

-- Briefings com created_at no passado distante (> 5 anos)
SELECT 
  'client_briefings - datas muito antigas' as check_name,
  COUNT(*) as problematic_records
FROM client_briefings
WHERE created_at < NOW() - INTERVAL '5 years';

-- Updated_at anterior a created_at
SELECT 
  'client_briefings - updated anterior a created' as check_name,
  COUNT(*) as problematic_records
FROM client_briefings
WHERE updated_at < created_at;

-- =====================================================
-- 5. VERIFICAR ARRAYS
-- =====================================================
\echo '\n📦 Verificando arrays...'

-- Logo files - arrays vazios vs NULL
SELECT 
  'client_briefings - logo_files vazios' as check_name,
  COUNT(*) as records_with_empty_arrays
FROM client_briefings
WHERE logo_files IS NOT NULL
  AND array_length(logo_files, 1) IS NULL;

-- Visual files - arrays vazios vs NULL
SELECT 
  'client_briefings - visual_files vazios' as check_name,
  COUNT(*) as records_with_empty_arrays
FROM client_briefings
WHERE visual_files IS NOT NULL
  AND array_length(visual_files, 1) IS NULL;

-- Material files - arrays vazios vs NULL
SELECT 
  'client_briefings - material_files vazios' as check_name,
  COUNT(*) as records_with_empty_arrays
FROM client_briefings
WHERE material_files IS NOT NULL
  AND array_length(material_files, 1) IS NULL;

-- =====================================================
-- 6. VERIFICAR ENUM VALUES
-- =====================================================
\echo '\n🎭 Verificando valores de ENUMs...'

-- Proposal status - valores válidos
SELECT 
  'captation_sites - proposal_status inválidos' as check_name,
  COUNT(*) as invalid_records
FROM captation_sites
WHERE proposal_status NOT IN (
  'pending', 'accepted', 'rejected', 
  'in_progress', 'paid', 'to_send'
);

-- Distribuição de status
SELECT 
  'Distribuição de proposal_status' as info,
  proposal_status,
  COUNT(*) as count
FROM captation_sites
GROUP BY proposal_status
ORDER BY count DESC;

-- =====================================================
-- 7. VERIFICAR DUPLICATAS
-- =====================================================
\echo '\n🔄 Verificando duplicatas...'

-- UUIDs duplicados (não deveria acontecer)
SELECT 
  'client_briefings - IDs duplicados' as check_name,
  COUNT(*) - COUNT(DISTINCT id) as duplicate_count
FROM client_briefings;

-- Portfolio - project_id duplicados
SELECT 
  'portfolio_images - project_id duplicados' as check_name,
  COUNT(*) - COUNT(DISTINCT project_id) as duplicate_count
FROM portfolio_images;

-- States - nomes duplicados
SELECT 
  'states - nomes duplicados' as check_name,
  COUNT(*) - COUNT(DISTINCT name) as duplicate_count
FROM states;

-- =====================================================
-- 8. VERIFICAR VALORES NUMÉRICOS
-- =====================================================
\echo '\n🔢 Verificando valores numéricos...'

-- Proposal values negativos
SELECT 
  'client_briefings - valores negativos' as check_name,
  COUNT(*) as problematic_records
FROM client_briefings
WHERE proposal_value < 0;

-- File sizes negativos ou zero
SELECT 
  'client_uploads - file_size inválido' as check_name,
  COUNT(*) as problematic_records
FROM client_uploads
WHERE file_size <= 0;

-- Progress fora do range 0-100
SELECT 
  'user_progress - progress inválido' as check_name,
  COUNT(*) as problematic_records
FROM user_progress
WHERE progress < 0 OR progress > 100;

-- =====================================================
-- 9. VERIFICAR URLs
-- =====================================================
\echo '\n🔗 Verificando URLs...'

-- Client Uploads - URLs malformadas
SELECT 
  'client_uploads - URLs inválidas' as check_name,
  COUNT(*) as problematic_records
FROM client_uploads
WHERE file_url NOT LIKE 'http%'
  AND file_url != '';

-- Portfolio - URLs malformadas
SELECT 
  'portfolio_images - URLs inválidas' as check_name,
  COUNT(*) as problematic_records
FROM portfolio_images
WHERE original_url NOT LIKE 'http%'
  AND original_url != '';

-- =====================================================
-- 10. VERIFICAR STORAGE FILES
-- =====================================================
\echo '\n📁 Verificando arquivos no storage...'

-- Client uploads - registros vs arquivos
SELECT 
  'client-uploads bucket' as bucket,
  COUNT(*) as files_in_storage
FROM storage.objects
WHERE bucket_id = 'client-uploads';

SELECT 
  'client_uploads table' as source,
  COUNT(*) as records
FROM client_uploads;

-- Briefing files
SELECT 
  'briefing-files bucket' as bucket,
  COUNT(*) as files_in_storage
FROM storage.objects
WHERE bucket_id = 'briefing-files';

-- =====================================================
-- RESULTADO FINAL
-- =====================================================
\echo '\n' || repeat('=', 60)
\echo '✅ VALIDAÇÃO DE INTEGRIDADE CONCLUÍDA'
\echo repeat('=', 60) || '\n'

\echo '📊 Resumo dos Checks:'
\echo '  ✓ Contagem de registros'
\echo '  ✓ Campos obrigatórios'
\echo '  ✓ Integridade referencial'
\echo '  ✓ Timestamps'
\echo '  ✓ Arrays'
\echo '  ✓ ENUMs'
\echo '  ✓ Duplicatas'
\echo '  ✓ Valores numéricos'
\echo '  ✓ URLs'
\echo '  ✓ Arquivos de storage'
\echo '\n'
\echo '⚠️  Analise os resultados acima para identificar problemas'

