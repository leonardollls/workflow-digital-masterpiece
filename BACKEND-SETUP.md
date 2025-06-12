# 🚀 Setup do Backend - Supabase Integration

## 📋 Visão Geral

Este projeto utiliza **Supabase** como backend para:
- ✅ Armazenamento dos dados do formulário de briefing
- ✅ Upload e gerenciamento de arquivos (logos, imagens, materiais)
- ✅ Notificações por email
- ✅ API automática para futuras funcionalidades

## 🛠️ Setup Inicial

### 1. Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Anote a **URL** e **Anon Key** do projeto

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3. Criar Tabela no Banco de Dados

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela para briefings
CREATE TABLE client_briefings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  business_segment TEXT NOT NULL,
  company_description TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  competitive_advantage TEXT NOT NULL,
  landing_page_goal TEXT NOT NULL,
  responsible_name TEXT NOT NULL,
  current_website TEXT,
  product_name TEXT NOT NULL,
  product_description TEXT NOT NULL,
  main_benefits TEXT NOT NULL,
  price_range TEXT,
  guarantees TEXT,
  call_to_action TEXT NOT NULL,
  lead_destination TEXT NOT NULL,
  brand_colors TEXT,
  has_logo TEXT NOT NULL,
  logo_files TEXT[],
  visual_references TEXT,
  visual_files TEXT[],
  content_materials TEXT,
  material_files TEXT[],
  domain_info TEXT NOT NULL,
  integrations TEXT,
  analytics_tracking TEXT,
  deadline TEXT NOT NULL,
  budget TEXT NOT NULL,
  start_date TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_client_briefings_created_at ON client_briefings(created_at DESC);
CREATE INDEX idx_client_briefings_company_name ON client_briefings(company_name);

-- Habilitar RLS (Row Level Security)
ALTER TABLE client_briefings ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (formulário)
CREATE POLICY "Allow public insert" ON client_briefings
  FOR INSERT WITH CHECK (true);

-- Política para leitura autenticada (futuro painel admin)
CREATE POLICY "Allow authenticated read" ON client_briefings
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 4. Configurar Storage para Arquivos

No painel do Supabase, vá em **Storage** e:

1. Crie um bucket chamado `briefing-files`
2. Configure como **público** para facilitar acesso
3. Configure políticas de upload:

```sql
-- Política para upload público
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'briefing-files');

-- Política para leitura pública
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'briefing-files');
```

## 📧 Configurar Notificações por Email (Opcional)

### Opção 1: Supabase Edge Functions

1. Instale a CLI do Supabase:
```bash
npm install -g supabase
```

2. Crie uma Edge Function:
```bash
supabase functions new send-briefing-notification
```

3. Implemente a função para enviar emails via Resend/SendGrid

### Opção 2: Webhook Simples

Configure um webhook no Zapier/Make.com para receber os dados e enviar email.

## 🔧 Funcionalidades Implementadas

### ✅ Upload de Arquivos
- **Logos**: PNG, JPG, PDF, AI, EPS, SVG
- **Referências Visuais**: PNG, JPG, PDF
- **Materiais Próprios**: Imagens, vídeos, documentos
- **Limite**: 50MB por arquivo

### ✅ Validação e Segurança
- Validação de tipos de arquivo
- Sanitização de nomes de arquivo
- URLs únicos com timestamp
- RLS habilitado no banco

### ✅ Tratamento de Erros
- Retry automático para uploads
- Mensagens de erro amigáveis
- Logs detalhados para debug

## 🚀 Deploy e Produção

### Variáveis de Ambiente na Vercel

1. Acesse o painel da Vercel
2. Vá em **Settings > Environment Variables**
3. Adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Monitoramento

- **Logs**: Supabase Dashboard > Logs
- **Storage**: Supabase Dashboard > Storage
- **Database**: Supabase Dashboard > Table Editor

## 📊 Próximos Passos

1. **Painel Admin**: Criar interface para visualizar briefings
2. **Email Templates**: Melhorar notificações por email
3. **Analytics**: Adicionar métricas de conversão
4. **Backup**: Configurar backup automático dos dados

## 🆘 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se as variáveis estão no `.env.local`
- Reinicie o servidor de desenvolvimento

### Erro de Upload
- Verifique se o bucket `briefing-files` existe
- Confirme as políticas de storage

### Erro de Inserção no Banco
- Verifique se a tabela foi criada corretamente
- Confirme as políticas RLS

## 📞 Suporte

Para dúvidas sobre a implementação:
- Documentação Supabase: [docs.supabase.com](https://docs.supabase.com)
- Discord Supabase: [discord.supabase.com](https://discord.supabase.com) 