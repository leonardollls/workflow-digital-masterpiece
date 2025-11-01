# 🗄️ Supabase - Workflow Services 2

> Database as a Service para Workflow Digital Masterpiece

---

## 📋 Informações do Projeto

| Propriedade | Valor |
|-------------|-------|
| **Nome** | Workflow Services 2 |
| **Project ID** | `wbtyimthsgdsftgwezop` |
| **Região** | us-east-2 (Ohio) |
| **Status** | ✅ ACTIVE_HEALTHY |
| **Database** | PostgreSQL 17.6 |
| **Criado em** | 2025-11-01 |

---

## 🚀 Quick Start

### Configuração Inicial

```bash
# 1. Instalar dependências
npm install @supabase/supabase-js

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Atualizar credenciais em .env
VITE_SUPABASE_URL=https://wbtyimthsgdsftgwezop.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### Uso Básico

```javascript
import { supabase } from './src/lib/supabase'

// Consultar dados
const { data, error } = await supabase
  .from('client_briefings')
  .select('*')
  .order('created_at', { ascending: false })

// Upload de arquivo
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('client-uploads')
  .upload('path/to/file.pdf', file)
```

---

## 📚 Estrutura do Banco

### Diretórios

```
supabase/
├── migrations/           # Migrations do banco de dados
│   ├── 20251101130712_create_initial_schema.sql
│   ├── 20251101130737_create_briefings_tables.sql
│   ├── 20251101130757_create_uploads_and_portfolio_tables.sql
│   ├── 20251101130838_enable_rls_and_policies.sql
│   ├── export-data-from-old-project.sql
│   └── import-data-to-new-project.sql
├── scripts/             # Scripts de automação
│   └── migrate-data.js
├── tests/               # Testes de validação
│   ├── test-structure.sql
│   ├── test-data-integrity.sql
│   ├── test-permissions.sql
│   └── test-storage.js
├── backups/             # Backups locais (git-ignored)
├── config.json          # Configuração do projeto
├── MIGRATION-GUIDE.md   # Guia completo de migração
└── README.md            # Este arquivo
```

### Tabelas (12)

#### 👥 Usuários e Ferramentas
- **users** - Cadastro de usuários
- **tools** - Ferramentas disponíveis
- **user_progress** - Progresso dos usuários
- **calculator_data** - Dados salvos de calculadoras

#### 📍 Localização
- **states** - Estados do Brasil
- **cities** - Cidades por estado

#### 🎯 Negócios
- **categories** - Categorias de negócios
- **captation_sites** - Sites captados para propostas

#### 📝 Briefings
- **client_briefings** - Briefings de clientes (46 campos)
- **institutional_briefings** - Briefings institucionais (50 campos)

#### 📁 Mídia
- **client_uploads** - Uploads de clientes
- **portfolio_images** - Imagens do portfólio

---

## 🔐 Segurança

### Row Level Security (RLS)

RLS está habilitado em todas as tabelas. Políticas configuradas:

#### Leitura Pública
- Tools ativos
- States, cities, categories
- Portfolio images ativas

#### Acesso Total (service_role)
- Todas as operações CRUD
- Gerenciamento de dados

### Storage Policies

#### client-uploads
- 📖 Leitura: Pública
- ✍️ Escrita: Anônimos
- 🗑️ Exclusão: Service role

#### briefing-files
- 📖 Leitura: Pública
- ✍️ Escrita: Anônimos (limite 50MB)
- 🗑️ Exclusão: Service role

---

## 🛠️ Migrations

### Criar Nova Migration

```bash
# Via SQL Editor do Supabase
# Ou criar arquivo manualmente:
# supabase/migrations/[timestamp]_[nome_da_migration].sql
```

### Aplicar Migration

Via Supabase Dashboard:
1. Ir para SQL Editor
2. Copiar conteúdo da migration
3. Executar

---

## 📊 Índices e Performance

### Índices Criados

```sql
-- Briefings (ordenação temporal)
idx_client_briefings_created
idx_institutional_briefings_created

-- Uploads (busca e filtros)
idx_client_uploads_client
idx_client_uploads_created
idx_client_uploads_status

-- Portfolio (filtros comuns)
idx_portfolio_images_active
idx_portfolio_images_category
idx_portfolio_images_priority

-- Captação (relacionamentos)
idx_captation_sites_city
idx_captation_sites_category
idx_captation_sites_status
```

### Otimizações

- ✅ ENUM para status (mais eficiente que strings)
- ✅ Timestamps com timezone
- ✅ Foreign keys com índices
- ✅ Policies RLS otimizadas
- ✅ Campos opcionais (flexibilidade)

---

## 🧪 Testes

### Executar Testes

```bash
# Estrutura
psql -f supabase/tests/test-structure.sql

# Integridade de dados
psql -f supabase/tests/test-data-integrity.sql

# Permissões RLS
psql -f supabase/tests/test-permissions.sql

# Storage
node supabase/tests/test-storage.js
```

### Cobertura de Testes

- ✅ Existência de tabelas
- ✅ Relacionamentos (foreign keys)
- ✅ Índices
- ✅ RLS policies
- ✅ Storage buckets
- ✅ Permissions

---

## 📦 Backup e Restore

### Backup Manual

```bash
# Via script automatizado
node supabase/scripts/migrate-data.js

# Backups salvos em:
supabase/backups/
```

### Restore

```sql
-- Importar de backup JSON
-- Use: supabase/migrations/import-data-to-new-project.sql
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### "Failed to fetch buckets"
- **Causa**: Projeto bloqueado ou sem permissões
- **Solução**: Verificar status do projeto no dashboard

#### "Row level security policy violation"
- **Causa**: RLS bloqueando operação
- **Solução**: Usar service_role key ou ajustar policy

#### "Storage quota exceeded"
- **Causa**: Limite de 1GB atingido (plano free)
- **Solução**: Fazer upgrade ou limpar arquivos antigos

#### "Migration failed"
- **Causa**: Erro de sintaxe ou dependência
- **Solução**: Verificar ordem das migrations

### Debug

```javascript
// Habilitar logs detalhados
const supabase = createClient(url, key, {
  global: {
    headers: {
      'X-Client-Info': 'debug'
    }
  }
})

// Ver queries executadas
supabase.from('table')
  .select()
  .then(console.log)
  .catch(console.error)
```

---

## 📞 Links Úteis

- **Dashboard**: https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop
- **Table Editor**: https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop/editor
- **SQL Editor**: https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop/sql
- **Storage**: https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop/storage/buckets
- **Docs**: https://supabase.com/docs
- **Support**: https://supabase.help

---

## 📝 Changelog

### 2025-11-01 - v1.0.0
- ✅ Projeto criado (Workflow Services 2)
- ✅ Estrutura completa migrada do projeto antigo
- ✅ 12 tabelas criadas
- ✅ 4 migrations aplicadas
- ✅ RLS e policies configuradas
- ✅ 2 buckets de storage criados
- ✅ TypeScript types gerados
- ⏳ Migração de dados pendente

---

**Projeto**: Workflow Services 2  
**Última atualização**: 2025-11-01  
**Versão**: 1.0.0

