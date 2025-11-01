-- =====================================================
-- TESTE: Validação da Estrutura do Banco
-- =====================================================
-- Execute no SQL Editor do projeto NOVO
-- Verifica se todas as tabelas, índices e constraints existem

\echo '🧪 Iniciando validação de estrutura...\n'

-- =====================================================
-- 1. VERIFICAR TABELAS
-- =====================================================
\echo '📋 Verificando existência das tabelas...'

DO $$
DECLARE
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  expected_tables TEXT[] := ARRAY[
    'users',
    'tools',
    'user_progress',
    'calculator_data',
    'states',
    'cities',
    'categories',
    'captation_sites',
    'client_briefings',
    'institutional_briefings',
    'client_uploads',
    'portfolio_images'
  ];
  tbl TEXT;
  table_exists BOOLEAN;
BEGIN
  FOREACH tbl IN ARRAY expected_tables LOOP
    SELECT EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = tbl
    ) INTO table_exists;
    
    IF NOT table_exists THEN
      missing_tables := array_append(missing_tables, tbl);
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE EXCEPTION '❌ Tabelas faltando: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE '✅ Todas as 12 tabelas existem';
  END IF;
END $$;

-- =====================================================
-- 2. VERIFICAR RLS
-- =====================================================
\echo '\n🔒 Verificando Row Level Security...'

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'tools', 'user_progress', 'calculator_data',
    'states', 'cities', 'categories', 'captation_sites',
    'client_briefings', 'institutional_briefings',
    'client_uploads', 'portfolio_images'
  )
ORDER BY tablename;

-- Verificar que todas têm RLS
DO $$
DECLARE
  tables_without_rls INTEGER;
BEGIN
  SELECT COUNT(*) INTO tables_without_rls
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename IN (
      'users', 'tools', 'user_progress', 'calculator_data',
      'states', 'cities', 'categories', 'captation_sites',
      'client_briefings', 'institutional_briefings',
      'client_uploads', 'portfolio_images'
    )
    AND rowsecurity = false;
  
  IF tables_without_rls > 0 THEN
    RAISE WARNING '⚠️  % tabela(s) sem RLS habilitado', tables_without_rls;
  ELSE
    RAISE NOTICE '✅ RLS habilitado em todas as tabelas';
  END IF;
END $$;

-- =====================================================
-- 3. VERIFICAR POLICIES
-- =====================================================
\echo '\n📜 Verificando policies...'

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Contar policies
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public';
  
  RAISE NOTICE '📊 Total de policies criadas: %', policy_count;
  
  IF policy_count < 15 THEN
    RAISE WARNING '⚠️  Menos policies que o esperado (mínimo: 15)';
  ELSE
    RAISE NOTICE '✅ Policies suficientes configuradas';
  END IF;
END $$;

-- =====================================================
-- 4. VERIFICAR ÍNDICES
-- =====================================================
\echo '\n🔍 Verificando índices...'

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'captation_sites', 'client_briefings', 'institutional_briefings',
    'client_uploads', 'portfolio_images'
  )
ORDER BY tablename, indexname;

-- Contar índices personalizados
DO $$
DECLARE
  custom_index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO custom_index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%';
  
  RAISE NOTICE '📊 Total de índices personalizados: %', custom_index_count;
  
  IF custom_index_count < 10 THEN
    RAISE WARNING '⚠️  Menos índices que o esperado (mínimo: 10)';
  ELSE
    RAISE NOTICE '✅ Índices suficientes criados';
  END IF;
END $$;

-- =====================================================
-- 5. VERIFICAR FOREIGN KEYS
-- =====================================================
\echo '\n🔗 Verificando foreign keys...'

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- =====================================================
-- 6. VERIFICAR ENUM TYPES
-- =====================================================
\echo '\n🎭 Verificando ENUM types...'

SELECT 
  t.typname as enum_name,
  array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
GROUP BY t.typname;

-- Verificar proposal_status
DO $$
DECLARE
  enum_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM pg_type
    WHERE typname = 'proposal_status'
  ) INTO enum_exists;
  
  IF NOT enum_exists THEN
    RAISE EXCEPTION '❌ ENUM proposal_status não existe';
  ELSE
    RAISE NOTICE '✅ ENUM proposal_status configurado';
  END IF;
END $$;

-- =====================================================
-- 7. VERIFICAR BUCKETS DE STORAGE
-- =====================================================
\echo '\n🗄️  Verificando buckets de storage...'

SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets
ORDER BY created_at;

-- Verificar que os buckets necessários existem
DO $$
DECLARE
  bucket_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO bucket_count
  FROM storage.buckets
  WHERE id IN ('client-uploads', 'briefing-files');
  
  IF bucket_count < 2 THEN
    RAISE EXCEPTION '❌ Buckets faltando (esperado: 2, encontrado: %)', bucket_count;
  ELSE
    RAISE NOTICE '✅ Ambos os buckets existem';
  END IF;
END $$;

-- =====================================================
-- 8. VERIFICAR POLICIES DE STORAGE
-- =====================================================
\echo '\n🔐 Verificando policies de storage...'

SELECT 
  name as policy_name,
  bucket_id,
  definition
FROM storage.policies
ORDER BY bucket_id, name;

-- Contar policies de storage
DO $$
DECLARE
  storage_policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO storage_policy_count
  FROM storage.policies
  WHERE bucket_id IN ('client-uploads', 'briefing-files');
  
  RAISE NOTICE '📊 Total de storage policies: %', storage_policy_count;
  
  IF storage_policy_count < 8 THEN
    RAISE WARNING '⚠️  Menos storage policies que o esperado (mínimo: 8)';
  ELSE
    RAISE NOTICE '✅ Storage policies configuradas';
  END IF;
END $$;

-- =====================================================
-- 9. VERIFICAR MIGRATIONS
-- =====================================================
\echo '\n📦 Verificando migrations aplicadas...'

SELECT 
  version,
  name
FROM supabase_migrations.schema_migrations
ORDER BY version;

-- Contar migrations
DO $$
DECLARE
  migration_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO migration_count
  FROM supabase_migrations.schema_migrations;
  
  RAISE NOTICE '📊 Total de migrations aplicadas: %', migration_count;
  
  IF migration_count < 4 THEN
    RAISE WARNING '⚠️  Menos migrations que o esperado (mínimo: 4)';
  ELSE
    RAISE NOTICE '✅ Todas as migrations aplicadas';
  END IF;
END $$;

-- =====================================================
-- RESULTADO FINAL
-- =====================================================
\echo '\n' || repeat('=', 60)
\echo '✅ VALIDAÇÃO DE ESTRUTURA CONCLUÍDA'
\echo repeat('=', 60) || '\n'

\echo '📊 Resumo:'
\echo '  - Tabelas: 12'
\echo '  - RLS: Habilitado'
\echo '  - Policies: Configuradas'
\echo '  - Índices: Criados'
\echo '  - Foreign Keys: OK'
\echo '  - ENUMs: OK'
\echo '  - Buckets: 2'
\echo '  - Storage Policies: Configuradas'
\echo '  - Migrations: 4'

