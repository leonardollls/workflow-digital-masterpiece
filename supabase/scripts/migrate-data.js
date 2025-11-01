/**
 * =====================================================
 * SCRIPT DE MIGRAÇÃO DE DADOS VIA API
 * =====================================================
 * 
 * Este script usa a API do Supabase para migrar dados
 * do projeto antigo para o novo projeto.
 * 
 * USO:
 * 1. npm install @supabase/supabase-js
 * 2. Configure as credenciais abaixo
 * 3. node supabase/scripts/migrate-data.js
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// =====================================================
// CONFIGURAÇÕES
// =====================================================

// Projeto ANTIGO (origem)
const OLD_PROJECT = {
  url: 'https://sphiqzwnkuzfiwejjlav.supabase.co',
  serviceKey: 'SEU_SERVICE_ROLE_KEY_ANTIGO' // ⚠️ IMPORTANTE: Use service_role key
}

// Projeto NOVO (destino)
const NEW_PROJECT = {
  url: 'https://wbtyimthsgdsftgwezop.supabase.co',
  serviceKey: 'SEU_SERVICE_ROLE_KEY_NOVO' // ⚠️ IMPORTANTE: Use service_role key
}

// =====================================================
// CLIENTES SUPABASE
// =====================================================

const oldSupabase = createClient(OLD_PROJECT.url, OLD_PROJECT.serviceKey)
const newSupabase = createClient(NEW_PROJECT.url, NEW_PROJECT.serviceKey)

// =====================================================
// FUNÇÕES DE MIGRAÇÃO
// =====================================================

/**
 * Migra uma tabela do projeto antigo para o novo
 */
async function migrateTable(tableName, options = {}) {
  console.log(`\n🔄 Migrando tabela: ${tableName}`)
  
  try {
    // 1. Exportar dados do projeto antigo
    console.log(`  📤 Exportando dados de ${tableName}...`)
    const { data: oldData, error: exportError } = await oldSupabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (exportError) {
      console.error(`  ❌ Erro ao exportar ${tableName}:`, exportError)
      return { success: false, error: exportError }
    }
    
    if (!oldData || oldData.length === 0) {
      console.log(`  ℹ️  Nenhum dado encontrado em ${tableName}`)
      return { success: true, count: 0 }
    }
    
    console.log(`  ✅ ${oldData.length} registros exportados`)
    
    // 2. Salvar backup local
    const backupDir = path.join(process.cwd(), 'supabase', 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }
    
    const backupFile = path.join(backupDir, `${tableName}_${Date.now()}.json`)
    fs.writeFileSync(backupFile, JSON.stringify(oldData, null, 2))
    console.log(`  💾 Backup salvo: ${backupFile}`)
    
    // 3. Importar para o novo projeto
    console.log(`  📥 Importando dados para ${tableName}...`)
    
    // Importar em lotes de 100 registros por vez
    const batchSize = 100
    let importedCount = 0
    
    for (let i = 0; i < oldData.length; i += batchSize) {
      const batch = oldData.slice(i, i + batchSize)
      
      const { error: importError } = await newSupabase
        .from(tableName)
        .insert(batch)
      
      if (importError) {
        console.error(`  ❌ Erro ao importar lote ${i / batchSize + 1}:`, importError)
        
        // Tentar importar um por um se o lote falhar
        for (const record of batch) {
          const { error: singleError } = await newSupabase
            .from(tableName)
            .insert([record])
          
          if (singleError) {
            console.error(`    ⚠️  Erro ao importar registro ${record.id}:`, singleError)
          } else {
            importedCount++
          }
        }
      } else {
        importedCount += batch.length
      }
    }
    
    console.log(`  ✅ ${importedCount}/${oldData.length} registros importados com sucesso`)
    
    return { success: true, count: importedCount, total: oldData.length }
    
  } catch (error) {
    console.error(`  ❌ Erro geral ao migrar ${tableName}:`, error)
    return { success: false, error }
  }
}

/**
 * Migra storage files entre projetos
 */
async function migrateStorage(bucketName) {
  console.log(`\n🗄️  Migrando bucket: ${bucketName}`)
  
  try {
    // 1. Listar arquivos do bucket antigo
    console.log(`  📤 Listando arquivos de ${bucketName}...`)
    const { data: files, error: listError } = await oldSupabase.storage
      .from(bucketName)
      .list()
    
    if (listError) {
      console.error(`  ❌ Erro ao listar arquivos:`, listError)
      return { success: false, error: listError }
    }
    
    if (!files || files.length === 0) {
      console.log(`  ℹ️  Nenhum arquivo encontrado em ${bucketName}`)
      return { success: true, count: 0 }
    }
    
    console.log(`  ✅ ${files.length} arquivos encontrados`)
    
    // 2. Copiar cada arquivo
    let copiedCount = 0
    
    for (const file of files) {
      try {
        // Download do arquivo antigo
        const { data: fileData, error: downloadError } = await oldSupabase.storage
          .from(bucketName)
          .download(file.name)
        
        if (downloadError) {
          console.error(`    ⚠️  Erro ao baixar ${file.name}:`, downloadError)
          continue
        }
        
        // Upload para o novo bucket
        const { error: uploadError } = await newSupabase.storage
          .from(bucketName)
          .upload(file.name, fileData, {
            contentType: file.metadata?.mimetype || 'application/octet-stream',
            upsert: true
          })
        
        if (uploadError) {
          console.error(`    ⚠️  Erro ao fazer upload de ${file.name}:`, uploadError)
          continue
        }
        
        copiedCount++
        
        if (copiedCount % 10 === 0) {
          console.log(`    📦 Progresso: ${copiedCount}/${files.length} arquivos copiados`)
        }
        
      } catch (error) {
        console.error(`    ⚠️  Erro ao processar ${file.name}:`, error)
      }
    }
    
    console.log(`  ✅ ${copiedCount}/${files.length} arquivos copiados com sucesso`)
    
    return { success: true, count: copiedCount, total: files.length }
    
  } catch (error) {
    console.error(`  ❌ Erro geral ao migrar ${bucketName}:`, error)
    return { success: false, error }
  }
}

// =====================================================
// EXECUÇÃO PRINCIPAL
// =====================================================

async function main() {
  console.log('🚀 Iniciando migração de dados...\n')
  console.log('⚠️  IMPORTANTE: Certifique-se de ter configurado as SERVICE_ROLE_KEYS\n')
  
  const results = {
    tables: {},
    storage: {}
  }
  
  // Migrar tabelas
  const tables = [
    'client_briefings',
    'institutional_briefings',
    'client_uploads',
    'portfolio_images'
  ]
  
  for (const table of tables) {
    results.tables[table] = await migrateTable(table)
    
    // Pequena pausa entre migrações
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Migrar storage buckets (opcional - comentado por padrão devido ao tamanho)
  // Descomente se quiser migrar os arquivos
  /*
  const buckets = ['client-uploads', 'briefing-files']
  
  for (const bucket of buckets) {
    results.storage[bucket] = await migrateStorage(bucket)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  */
  
  // Relatório final
  console.log('\n' + '='.repeat(60))
  console.log('📊 RELATÓRIO DE MIGRAÇÃO')
  console.log('='.repeat(60))
  
  console.log('\n📋 Tabelas:')
  for (const [table, result] of Object.entries(results.tables)) {
    if (result.success) {
      console.log(`  ✅ ${table}: ${result.count}/${result.total || result.count} registros`)
    } else {
      console.log(`  ❌ ${table}: FALHOU`)
    }
  }
  
  if (Object.keys(results.storage).length > 0) {
    console.log('\n🗄️  Storage:')
    for (const [bucket, result] of Object.entries(results.storage)) {
      if (result.success) {
        console.log(`  ✅ ${bucket}: ${result.count}/${result.total || result.count} arquivos`)
      } else {
        console.log(`  ❌ ${bucket}: FALHOU`)
      }
    }
  }
  
  console.log('\n✨ Migração concluída!')
}

// Executar
main().catch(console.error)

