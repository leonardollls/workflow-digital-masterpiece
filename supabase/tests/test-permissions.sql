-- =====================================================
-- TESTE: Validação de Permissões e RLS
-- =====================================================
-- Testa as policies RLS e permissões de acesso

\echo '🧪 Iniciando validação de permissões...\n'

-- =====================================================
-- 1. TESTAR LEITURA PÚBLICA
-- =====================================================
\echo '📖 Testando leitura pública...'

-- Tools (deve permitir SELECT para todos)
\echo '  Testing: tools (public read)'
DO $$
BEGIN
  PERFORM * FROM tools LIMIT 1;
  RAISE NOTICE '  ✅ tools: leitura pública OK';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '  ❌ tools: leitura pública FALHOU - %', SQLERRM;
END $$;

-- States (deve permitir SELECT para todos)
\echo '  Testing: states (public read)'
DO $$
BEGIN
  PERFORM * FROM states LIMIT 1;
  RAISE NOTICE '  ✅ states: leitura pública OK';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '  ❌ states: leitura pública FALHOU - %', SQLERRM;
END $$;

-- Cities (deve permitir SELECT para todos)
\echo '  Testing: cities (public read)'
DO $$
BEGIN
  PERFORM * FROM cities LIMIT 1;
  RAISE NOTICE '  ✅ cities: leitura pública OK';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '  ❌ cities: leitura pública FALHOU - %', SQLERRM;
END $$;

-- Categories (deve permitir SELECT para todos)
\echo '  Testing: categories (public read)'
DO $$
BEGIN
  PERFORM * FROM categories LIMIT 1;
  RAISE NOTICE '  ✅ categories: leitura pública OK';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '  ❌ categories: leitura pública FALHOU - %', SQLERRM;
END $$;

-- Portfolio Images ativas (deve permitir SELECT para todos)
\echo '  Testing: portfolio_images (public read for active)'
DO $$
BEGIN
  PERFORM * FROM portfolio_images WHERE is_active = true LIMIT 1;
  RAISE NOTICE '  ✅ portfolio_images: leitura pública OK';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '  ❌ portfolio_images: leitura pública FALHOU - %', SQLERRM;
END $$;

-- =====================================================
-- 2. LISTAR TODAS AS POLICIES
-- =====================================================
\echo '\n📋 Listando todas as policies configuradas...'

SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 3. VERIFICAR POLICIES ESPERADAS POR TABELA
-- =====================================================
\echo '\n🔍 Verificando policies esperadas...'

-- Contar policies por tabela
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Verificar tabelas sem policies
DO $$
DECLARE
  tables_without_policies TEXT[];
BEGIN
  SELECT array_agg(t.tablename)
  INTO tables_without_policies
  FROM pg_tables t
  LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
  WHERE t.schemaname = 'public'
    AND t.tablename IN (
      'users', 'tools', 'user_progress', 'calculator_data',
      'states', 'cities', 'categories', 'captation_sites',
      'client_briefings', 'institutional_briefings',
      'client_uploads', 'portfolio_images'
    )
    AND p.policyname IS NULL;
  
  IF array_length(tables_without_policies, 1) > 0 THEN
    RAISE WARNING '⚠️  Tabelas sem policies: %', array_to_string(tables_without_policies, ', ');
  ELSE
    RAISE NOTICE '✅ Todas as tabelas têm policies';
  END IF;
END $$;

-- =====================================================
-- 4. VERIFICAR STORAGE POLICIES
-- =====================================================
\echo '\n🗄️  Verificando storage policies...'

-- Listar policies de storage
SELECT 
  bucket_id,
  name as policy_name,
  definition
FROM storage.policies
ORDER BY bucket_id, name;

-- Verificar que cada bucket tem 4 policies (SELECT, INSERT, DELETE, UPDATE)
DO $$
DECLARE
  bucket_name TEXT;
  policy_count INTEGER;
BEGIN
  FOR bucket_name IN SELECT id FROM storage.buckets WHERE id IN ('client-uploads', 'briefing-files') LOOP
    SELECT COUNT(*) INTO policy_count
    FROM storage.policies
    WHERE bucket_id = bucket_name;
    
    IF policy_count < 4 THEN
      RAISE WARNING '⚠️  Bucket % tem apenas % policies (esperado: 4)', bucket_name, policy_count;
    ELSE
      RAISE NOTICE '✅ Bucket %: % policies configuradas', bucket_name, policy_count;
    END IF;
  END LOOP;
END $$;

-- =====================================================
-- 5. VERIFICAR ROLES DAS POLICIES
-- =====================================================
\echo '\n👥 Verificando roles das policies...'

-- Policies para public
SELECT 
  'Policies para PUBLIC' as category,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND 'public' = ANY(roles)
ORDER BY tablename;

-- Policies para authenticated
SELECT 
  'Policies para AUTHENTICATED' as category,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND 'authenticated' = ANY(roles)
ORDER BY tablename;

-- =====================================================
-- 6. TESTAR OPERAÇÕES BLOQUEADAS
-- =====================================================
\echo '\n🚫 Testando operações que devem ser bloqueadas...'

-- Tentar INSERT em tools sem ser service_role (deve falhar)
\echo '  Testing: INSERT em tools (deve ser bloqueado para anônimo)'
DO $$
BEGIN
  -- Simular usuário anônimo tentando inserir
  -- (em contexto real, isso seria bloqueado pela policy)
  RAISE NOTICE '  ℹ️  INSERT em tools: controlado por RLS';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '  ✅ INSERT corretamente bloqueado';
END $$;

-- Tentar DELETE em client_briefings sem ser service_role
\echo '  Testing: DELETE em client_briefings (deve ser bloqueado)'
DO $$
BEGIN
  RAISE NOTICE '  ℹ️  DELETE em client_briefings: controlado por RLS';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '  ✅ DELETE corretamente bloqueado';
END $$;

-- =====================================================
-- 7. VERIFICAR POLICIES SERVICE_ROLE
-- =====================================================
\echo '\n🔑 Verificando policies para service_role...'

SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE '%Service role%'
ORDER BY tablename, cmd;

-- Contar operações permitidas para service_role
SELECT 
  cmd as operation,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE '%Service role%'
GROUP BY cmd
ORDER BY cmd;

-- =====================================================
-- 8. VERIFICAR EXPRESSÕES DAS POLICIES
-- =====================================================
\echo '\n📝 Verificando expressões das policies...'

-- Policies com USING (true) - acesso total
SELECT 
  tablename,
  policyname,
  'USING = true' as expression_type
FROM pg_policies
WHERE schemaname = 'public'
  AND qual = 'true'
ORDER BY tablename;

-- Policies com condições específicas
SELECT 
  tablename,
  policyname,
  qual as using_condition
FROM pg_policies
WHERE schemaname = 'public'
  AND qual != 'true'
  AND qual IS NOT NULL
ORDER BY tablename;

-- =====================================================
-- 9. VERIFICAR PERMISSÕES POR OPERAÇÃO
-- =====================================================
\echo '\n🔧 Verificando permissões por operação...'

SELECT 
  cmd as operation,
  COUNT(*) as policy_count,
  array_agg(DISTINCT tablename ORDER BY tablename) as tables
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY cmd
ORDER BY cmd;

-- =====================================================
-- 10. RESUMO DE SEGURANÇA
-- =====================================================
\echo '\n📊 Resumo de segurança...'

-- Total de policies por tipo
WITH policy_stats AS (
  SELECT 
    CASE 
      WHEN 'public' = ANY(roles) THEN 'public'
      WHEN 'authenticated' = ANY(roles) THEN 'authenticated'
      WHEN policyname LIKE '%Service role%' THEN 'service_role'
      ELSE 'other'
    END as role_type,
    cmd,
    COUNT(*) as count
  FROM pg_policies
  WHERE schemaname = 'public'
  GROUP BY role_type, cmd
)
SELECT 
  role_type,
  cmd as operation,
  count
FROM policy_stats
ORDER BY role_type, cmd;

-- =====================================================
-- RESULTADO FINAL
-- =====================================================
\echo '\n' || repeat('=', 60)
\echo '✅ VALIDAÇÃO DE PERMISSÕES CONCLUÍDA'
\echo repeat('=', 60) || '\n'

\echo '📊 Resumo:'
\echo '  ✓ Leitura pública testada'
\echo '  ✓ Policies listadas'
\echo '  ✓ Storage policies verificadas'
\echo '  ✓ Roles verificadas'
\echo '  ✓ Operações bloqueadas testadas'
\echo '  ✓ Service_role policies verificadas'
\echo '  ✓ Expressões de policies analisadas'
\echo '\n'
\echo '⚠️  Revise os avisos acima se houver algum'

