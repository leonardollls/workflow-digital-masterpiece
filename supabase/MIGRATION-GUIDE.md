# 🔄 Guia Completo de Migração - Workflow Services

> **Data**: 2025-11-01  
> **Status**: ✅ Estrutura Migrada | ⏳ Dados Pendentes  
> **Projeto Novo**: `wbtyimthsgdsftgwezop` (Workflow Services 2)  
> **Projeto Antigo**: `sphiqzwnkuzfiwejjlav` (BLOQUEADO)

---

## 📊 Sumário Executivo

### Motivo da Migração
O projeto antigo excedeu o limite de storage do plano gratuito do Supabase:
- **Limite**: 1 GB
- **Uso atual**: 2.742 GB (274%)
- **Consequência**: Serviços bloqueados

### Status da Migração

| Fase | Status | Detalhes |
|------|--------|----------|
| ✅ Estrutura de Tabelas | Completo | 12 tabelas criadas |
| ✅ Migrations | Completo | 4 migrations aplicadas |
| ✅ Buckets de Storage | Completo | 2 buckets criados |
| ✅ Policies RLS | Completo | 19 policies configuradas |
| ✅ Configuração do Código | Completo | Credenciais atualizadas |
| ⏳ Migração de Dados | Pendente | Aguardando acesso |
| ⏳ Arquivos de Storage | Pendente | Aguardando acesso |

---

## 🆕 Novo Projeto: Detalhes

### Informações do Projeto

```json
{
  "name": "Workflow Services 2",
  "id": "wbtyimthsgdsftgwezop",
  "region": "us-east-2",
  "status": "ACTIVE_HEALTHY",
  "database": {
    "host": "db.wbtyimthsgdsftgwezop.supabase.co",
    "version": "17.6.1.032",
    "engine": "PostgreSQL 17"
  }
}
```

### Credenciais

```env
SUPABASE_URL=https://wbtyimthsgdsftgwezop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidHlpbXRoc2dkc2Z0Z3dlem9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjczOTksImV4cCI6MjA3NzU0MzM5OX0.NwG03rbXrRxA8iWWLo9_SxNHcWm6PsKPcYNqs6jc_CQ
```

---

## 🏗️ Estrutura Migrada

### Tabelas Criadas (12)

#### 1️⃣ **Tabelas de Usuários e Ferramentas**
- `users` - Usuários do sistema
- `tools` - Ferramentas disponíveis
- `user_progress` - Progresso dos usuários
- `calculator_data` - Dados de calculadoras

#### 2️⃣ **Tabelas de Localização**
- `states` - Estados do Brasil
- `cities` - Cidades por estado
- `categories` - Categorias de negócios

#### 3️⃣ **Tabelas de Captação**
- `captation_sites` - Sites captados para propostas

#### 4️⃣ **Tabelas de Briefings**
- `client_briefings` - Briefings de clientes (46 campos)
- `institutional_briefings` - Briefings institucionais (50 campos)

#### 5️⃣ **Tabelas de Mídia**
- `client_uploads` - Uploads de clientes (15 campos)
- `portfolio_images` - Imagens do portfólio (18 campos)

### Buckets de Storage (2)

#### `client-uploads`
- **Acesso**: Público
- **Limite**: Sem limite de tamanho por arquivo
- **Uso**: Uploads gerais de clientes

#### `briefing-files`
- **Acesso**: Público
- **Limite**: 50MB por arquivo
- **Uso**: Logos, referências visuais, materiais

### Migrations Aplicadas (4)

1. **`20251101130712_create_initial_schema`**
   - Tabelas base do sistema
   - ENUM `proposal_status`
   - Relacionamentos e constraints

2. **`20251101130737_create_briefings_tables`**
   - Tabelas de briefings
   - Campos opcionais
   - Comentários de documentação

3. **`20251101130757_create_uploads_and_portfolio_tables`**
   - Tabelas de mídia
   - Campos de otimização
   - Índices de performance

4. **`20251101130838_enable_rls_and_policies`**
   - RLS em todas as tabelas
   - 19 policies de segurança
   - Policies de storage

---

## 🔒 Segurança: Policies RLS

### Policies de Tabelas (15)

#### Leitura Pública
- ✅ `tools` - Ferramentas ativas
- ✅ `states` - Todos os estados
- ✅ `cities` - Todas as cidades
- ✅ `categories` - Todas as categorias
- ✅ `portfolio_images` - Imagens ativas

#### Acesso Total (service_role)
- ✅ `users` - CRUD completo
- ✅ `tools` - CRUD completo
- ✅ `user_progress` - CRUD completo
- ✅ `calculator_data` - CRUD completo
- ✅ `captation_sites` - CRUD completo
- ✅ `client_briefings` - CRUD completo
- ✅ `institutional_briefings` - CRUD completo
- ✅ `client_uploads` - CRUD completo
- ✅ `portfolio_images` - CRUD completo

### Policies de Storage (8)

#### `client-uploads`
- ✅ **SELECT**: Leitura pública
- ✅ **INSERT**: Upload por anônimos
- ✅ **DELETE**: Apenas service_role
- ✅ **UPDATE**: Apenas service_role

#### `briefing-files`
- ✅ **SELECT**: Leitura pública
- ✅ **INSERT**: Upload por anônimos
- ✅ **DELETE**: Apenas service_role
- ✅ **UPDATE**: Apenas service_role

---

## 📝 Migração de Dados

### Scripts Disponíveis

#### 1. Export SQL (Projeto Antigo)
```bash
# Localização: supabase/migrations/export-data-from-old-project.sql
# Execute no SQL Editor do projeto ANTIGO
```

Exporta dados para arquivos JSON:
- `client_briefings_export.json`
- `institutional_briefings_export.json`
- `client_uploads_export.json` (metadados)
- `portfolio_images_export.json`

#### 2. Import SQL (Projeto Novo)
```bash
# Localização: supabase/migrations/import-data-to-new-project.sql
# Execute no SQL Editor do projeto NOVO
```

Template para importar dados exportados.

#### 3. Script JavaScript Automatizado
```bash
# Localização: supabase/scripts/migrate-data.js
# Instalação: npm install @supabase/supabase-js
# Execução: node supabase/scripts/migrate-data.js
```

Migra dados automaticamente via API:
- ✅ Backup local automático
- ✅ Importação em lotes
- ✅ Tratamento de erros
- ✅ Relatório detalhado
- ⚠️ Requer service_role keys

### Como Usar os Scripts

#### Opção 1: SQL Manual

1. **No Projeto Antigo** (quando desbloqueado):
   ```sql
   -- Execute: export-data-from-old-project.sql
   -- Baixe os arquivos JSON gerados
   ```

2. **No Projeto Novo**:
   ```sql
   -- Edite: import-data-to-new-project.sql
   -- Adicione os dados dos JSONs
   -- Execute o script
   ```

#### Opção 2: Script Automatizado

1. **Configure as credenciais**:
   ```javascript
   // Em: supabase/scripts/migrate-data.js
   const OLD_PROJECT = {
     url: 'https://sphiqzwnkuzfiwejjlav.supabase.co',
     serviceKey: 'SEU_SERVICE_ROLE_KEY_ANTIGO'
   }
   ```

2. **Execute**:
   ```bash
   node supabase/scripts/migrate-data.js
   ```

3. **Verifique backups**:
   ```bash
   ls supabase/backups/
   ```

---

## 📊 Dados a Migrar

### Estatísticas do Projeto Antigo

| Tabela | Registros | Status |
|--------|-----------|--------|
| `client_briefings` | 2 | ⏳ Pendente |
| `institutional_briefings` | 3 | ⏳ Pendente |
| `client_uploads` | 156 | ⏳ Pendente |
| `portfolio_images` | 15 | ⏳ Pendente |
| **TOTAL** | **176** | **⏳ Pendente** |

### Arquivos de Storage

| Bucket | Arquivos | Tamanho | Status |
|--------|----------|---------|--------|
| `client-uploads` | ~178 | ~455 MB | ⏳ Pendente |
| `briefing-files` | ~257 | ~232 MB | ⏳ Pendente |
| **TOTAL** | **~435** | **~687 MB** | **⏳ Pendente** |

---

## 🧪 Testes de Validação

### Checklist Pós-Migração

#### Estrutura
- [x] Todas as tabelas criadas
- [x] Relacionamentos funcionando
- [x] Índices criados
- [x] RLS habilitado

#### Dados (Quando Migrados)
- [ ] Contagem de registros OK
- [ ] Integridade referencial OK
- [ ] Dados completos (sem NULL indevido)
- [ ] Datas e timestamps OK

#### Storage (Quando Migrado)
- [ ] Arquivos acessíveis
- [ ] URLs públicas funcionando
- [ ] Metadados corretos
- [ ] Tamanhos corretos

#### Aplicação
- [ ] Conexão com novo projeto OK
- [ ] Queries funcionando
- [ ] Uploads funcionando
- [ ] RLS não bloqueando operações

### Scripts de Teste

Localização: `supabase/tests/`
- `test-structure.sql` - Valida estrutura
- `test-data-integrity.sql` - Valida dados
- `test-permissions.sql` - Valida RLS
- `test-storage.js` - Valida storage

---

## ⚙️ Otimizações Implementadas

### Índices Adicionais

```sql
-- Briefings
CREATE INDEX idx_client_briefings_created ON client_briefings(created_at DESC);
CREATE INDEX idx_institutional_briefings_created ON institutional_briefings(created_at DESC);

-- Uploads
CREATE INDEX idx_client_uploads_client ON client_uploads(client_name);
CREATE INDEX idx_client_uploads_created ON client_uploads(created_at DESC);
CREATE INDEX idx_client_uploads_status ON client_uploads(upload_status);

-- Portfolio
CREATE INDEX idx_portfolio_images_active ON portfolio_images(is_active);
CREATE INDEX idx_portfolio_images_category ON portfolio_images(project_category);
CREATE INDEX idx_portfolio_images_priority ON portfolio_images(priority);

-- Captação
CREATE INDEX idx_captation_sites_city ON captation_sites(city_id);
CREATE INDEX idx_captation_sites_category ON captation_sites(category_id);
CREATE INDEX idx_captation_sites_status ON captation_sites(proposal_status);
```

### Performance

- ✅ Índices em campos mais consultados
- ✅ ENUM para status (mais rápido que strings)
- ✅ Timestamps com timezone
- ✅ Foreign keys com cascata
- ✅ RLS otimizado

---

## 🚀 Deploy e Uso

### Atualizar Aplicação

1. **Verificar arquivos alterados**:
   - `src/lib/supabase.ts` ✅
   - `src/lib/supabase.production.ts` ✅

2. **Build da aplicação**:
   ```bash
   npm run build
   ```

3. **Testar localmente**:
   ```bash
   npm run dev
   ```

4. **Deploy**:
   ```bash
   # Hostinger ou outro provedor
   # Upload dos arquivos da pasta dist/
   ```

### Variáveis de Ambiente

Para ambientes diferentes:

```env
# .env.development
VITE_SUPABASE_URL=https://wbtyimthsgdsftgwezop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# .env.production
VITE_SUPABASE_URL=https://wbtyimthsgdsftgwezop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 📞 Suporte e Troubleshooting

### Problemas Comuns

#### 1. "Service role key required"
**Solução**: Configure a service_role key no script de migração

#### 2. "Table doesn't exist"
**Solução**: Execute as migrations na ordem correta

#### 3. "RLS policy blocking"
**Solução**: Verifique se está usando service_role ou policies corretas

#### 4. "Storage bucket not found"
**Solução**: Verifique se os buckets foram criados

### Contatos

- **Supabase Dashboard**: https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop
- **Supabase Support**: https://supabase.help
- **Documentação**: https://supabase.com/docs

---

## 📋 Checklist de Ativação

### Imediato (✅ Completo)
- [x] Criar projeto novo no Supabase
- [x] Criar estrutura de tabelas
- [x] Aplicar migrations
- [x] Configurar RLS e policies
- [x] Criar buckets de storage
- [x] Atualizar credenciais no código
- [x] Gerar TypeScript types
- [x] Documentar migração

### Quando Projeto Antigo Desbloquear
- [ ] Exportar dados das tabelas
- [ ] Importar dados no novo projeto
- [ ] Copiar arquivos de storage essenciais
- [ ] Validar integridade dos dados
- [ ] Testar aplicação completa
- [ ] Desativar projeto antigo

### Pós-Migração
- [ ] Monitorar uso de storage
- [ ] Configurar backups automáticos
- [ ] Documentar processo para futuras migrações
- [ ] Criar política de limpeza de arquivos

---

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL 17 Docs](https://www.postgresql.org/docs/17/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Management](https://supabase.com/docs/guides/storage)

---

**Última atualização**: 2025-11-01  
**Versão**: 1.0.0  
**Autor**: AI Assistant (via Cursor)

