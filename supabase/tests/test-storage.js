/**
 * =====================================================
 * TESTE: Validação de Storage e Arquivos
 * =====================================================
 * Testa os buckets e operações de storage
 * 
 * USO: node supabase/tests/test-storage.js
 */

import { createClient } from '@supabase/supabase-js'

// =====================================================
// CONFIGURAÇÃO
// =====================================================

const supabaseUrl = 'https://wbtyimthsgdsftgwezop.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidHlpbXRoc2dkc2Z0Z3dlem9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjczOTksImV4cCI6MjA3NzU0MzM5OX0.NwG03rbXrRxA8iWWLo9_SxNHcWm6PsKPcYNqs6jc_CQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =====================================================
// UTILITÁRIOS
// =====================================================

const log = {
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  info: (msg) => console.log(`ℹ️  ${msg}`),
  section: (msg) => console.log(`\n${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}`)
}

// =====================================================
// TESTES
// =====================================================

async function testListBuckets() {
  log.section('1. LISTAR BUCKETS')
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) throw error
    
    log.info(`Buckets encontrados: ${buckets.length}`)
    
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name}`)
      console.log(`    ID: ${bucket.id}`)
      console.log(`    Public: ${bucket.public}`)
      console.log(`    File size limit: ${bucket.file_size_limit || 'Sem limite'}`)
      console.log(`    Created: ${new Date(bucket.created_at).toLocaleString()}`)
    })
    
    // Verificar buckets esperados
    const expectedBuckets = ['client-uploads', 'briefing-files']
    const foundBuckets = buckets.map(b => b.id)
    
    expectedBuckets.forEach(expected => {
      if (foundBuckets.includes(expected)) {
        log.success(`Bucket "${expected}" encontrado`)
      } else {
        log.error(`Bucket "${expected}" NÃO encontrado`)
      }
    })
    
    return { success: true, count: buckets.length }
  } catch (error) {
    log.error(`Erro ao listar buckets: ${error.message}`)
    return { success: false, error }
  }
}

async function testListFiles(bucketName) {
  log.section(`2. LISTAR ARQUIVOS: ${bucketName}`)
  
  try {
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
    
    if (error) throw error
    
    log.info(`Arquivos encontrados: ${files.length}`)
    
    if (files.length === 0) {
      log.warning(`Bucket "${bucketName}" está vazio`)
      return { success: true, count: 0 }
    }
    
    // Estatísticas
    let totalSize = 0
    const fileTypes = {}
    
    files.slice(0, 10).forEach(file => {
      console.log(`  - ${file.name}`)
      console.log(`    Size: ${(file.metadata?.size / 1024 / 1024).toFixed(2)} MB`)
      console.log(`    Type: ${file.metadata?.mimetype || 'unknown'}`)
      console.log(`    Created: ${new Date(file.created_at).toLocaleString()}`)
      
      totalSize += file.metadata?.size || 0
      const type = file.metadata?.mimetype || 'unknown'
      fileTypes[type] = (fileTypes[type] || 0) + 1
    })
    
    log.info(`Total size (primeiros 10): ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
    log.info('Tipos de arquivo:')
    Object.entries(fileTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} arquivo(s)`)
    })
    
    log.success(`Bucket "${bucketName}" acessível`)
    return { success: true, count: files.length }
    
  } catch (error) {
    log.error(`Erro ao listar arquivos de "${bucketName}": ${error.message}`)
    return { success: false, error }
  }
}

async function testPublicAccess(bucketName) {
  log.section(`3. TESTAR ACESSO PÚBLICO: ${bucketName}`)
  
  try {
    // Listar um arquivo para testar
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 })
    
    if (listError) throw listError
    
    if (files.length === 0) {
      log.warning(`Bucket vazio, não é possível testar acesso público`)
      return { success: true, skipped: true }
    }
    
    const testFile = files[0]
    
    // Obter URL pública
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(testFile.name)
    
    log.info(`URL pública gerada: ${data.publicUrl}`)
    
    // Tentar acessar a URL
    const response = await fetch(data.publicUrl, { method: 'HEAD' })
    
    if (response.ok) {
      log.success(`Arquivo "${testFile.name}" acessível publicamente`)
      return { success: true, url: data.publicUrl }
    } else {
      log.warning(`Arquivo não acessível (status ${response.status})`)
      return { success: false, status: response.status }
    }
    
  } catch (error) {
    log.error(`Erro ao testar acesso público: ${error.message}`)
    return { success: false, error }
  }
}

async function testUploadPermission(bucketName) {
  log.section(`4. TESTAR PERMISSÃO DE UPLOAD: ${bucketName}`)
  
  try {
    // Criar arquivo de teste (1KB)
    const testContent = new Blob(['Test file content'], { type: 'text/plain' })
    const testFileName = `test-${Date.now()}.txt`
    
    log.info(`Tentando fazer upload de "${testFileName}"...`)
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testContent)
    
    if (error) {
      // Se for erro de permissão, isso é esperado (anon pode não ter permissão)
      if (error.message.includes('permission') || error.message.includes('policy')) {
        log.info('Upload bloqueado por RLS policy (comportamento esperado para alguns buckets)')
        return { success: true, blocked: true }
      }
      throw error
    }
    
    log.success(`Upload realizado: ${data.path}`)
    
    // Limpar arquivo de teste
    log.info('Removendo arquivo de teste...')
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testFileName])
    
    if (deleteError) {
      log.warning(`Não foi possível remover arquivo de teste: ${deleteError.message}`)
    } else {
      log.success('Arquivo de teste removido')
    }
    
    return { success: true, uploaded: true }
    
  } catch (error) {
    log.error(`Erro ao testar upload: ${error.message}`)
    return { success: false, error }
  }
}

async function testStorageUsage() {
  log.section('5. VERIFICAR USO DE STORAGE')
  
  try {
    const buckets = ['client-uploads', 'briefing-files']
    let totalFiles = 0
    let totalSize = 0
    
    for (const bucketName of buckets) {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 1000 })
      
      if (error) {
        log.warning(`Não foi possível listar arquivos de "${bucketName}": ${error.message}`)
        continue
      }
      
      const bucketSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0)
      
      totalFiles += files.length
      totalSize += bucketSize
      
      console.log(`\nBucket: ${bucketName}`)
      console.log(`  Arquivos: ${files.length}`)
      console.log(`  Tamanho: ${(bucketSize / 1024 / 1024).toFixed(2)} MB`)
    }
    
    console.log(`\n📊 Total Geral:`)
    console.log(`  Arquivos: ${totalFiles}`)
    console.log(`  Tamanho: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Limite (free plan): 1024 MB`)
    console.log(`  Uso: ${((totalSize / 1024 / 1024 / 1024) * 100).toFixed(2)}%`)
    
    if (totalSize > 1024 * 1024 * 1024) {
      log.warning('⚠️  USO DE STORAGE ACIMA DO LIMITE!')
    } else {
      log.success('Uso de storage dentro do limite')
    }
    
    return { 
      success: true, 
      totalFiles, 
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      usagePercent: ((totalSize / 1024 / 1024 / 1024) * 100).toFixed(2)
    }
    
  } catch (error) {
    log.error(`Erro ao verificar uso de storage: ${error.message}`)
    return { success: false, error }
  }
}

// =====================================================
// EXECUÇÃO PRINCIPAL
// =====================================================

async function main() {
  console.log('🧪 Iniciando testes de storage...\n')
  
  const results = {
    listBuckets: null,
    clientUploads: {
      list: null,
      publicAccess: null,
      upload: null
    },
    briefingFiles: {
      list: null,
      publicAccess: null,
      upload: null
    },
    usage: null
  }
  
  // Teste 1: Listar buckets
  results.listBuckets = await testListBuckets()
  
  // Teste 2-4: client-uploads
  results.clientUploads.list = await testListFiles('client-uploads')
  results.clientUploads.publicAccess = await testPublicAccess('client-uploads')
  results.clientUploads.upload = await testUploadPermission('client-uploads')
  
  // Teste 2-4: briefing-files
  results.briefingFiles.list = await testListFiles('briefing-files')
  results.briefingFiles.publicAccess = await testPublicAccess('briefing-files')
  results.briefingFiles.upload = await testUploadPermission('briefing-files')
  
  // Teste 5: Uso de storage
  results.usage = await testStorageUsage()
  
  // Relatório final
  log.section('📊 RELATÓRIO FINAL')
  
  console.log('Buckets:')
  console.log(`  ✓ Listagem: ${results.listBuckets.success ? '✅' : '❌'}`)
  
  console.log('\nClient Uploads:')
  console.log(`  ✓ Listagem: ${results.clientUploads.list.success ? '✅' : '❌'}`)
  console.log(`  ✓ Acesso Público: ${results.clientUploads.publicAccess.success ? '✅' : '❌'}`)
  console.log(`  ✓ Upload: ${results.clientUploads.upload.success ? '✅' : '❌'}`)
  
  console.log('\nBriefing Files:')
  console.log(`  ✓ Listagem: ${results.briefingFiles.list.success ? '✅' : '❌'}`)
  console.log(`  ✓ Acesso Público: ${results.briefingFiles.publicAccess.success ? '✅' : '❌'}`)
  console.log(`  ✓ Upload: ${results.briefingFiles.upload.success ? '✅' : '❌'}`)
  
  console.log('\nUso de Storage:')
  console.log(`  ✓ Verificação: ${results.usage.success ? '✅' : '❌'}`)
  if (results.usage.success) {
    console.log(`  📊 ${results.usage.totalFiles} arquivos`)
    console.log(`  📊 ${results.usage.totalSizeMB} MB`)
    console.log(`  📊 ${results.usage.usagePercent}% do limite`)
  }
  
  console.log('\n✨ Testes de storage concluídos!')
}

// Executar
main().catch(console.error)

