# 👤 Configuração de Usuários Administrativos

> Guia para gerenciar usuários do painel administrativo

---

## 🔐 **Credenciais do Usuário Principal**

### **Usuário Administrativo Criado**

| Campo | Valor |
|-------|-------|
| **Email** | `admin@workflowdigital.com` |
| **Senha** | `AdminWorkflow2024!` |
| **ID** | `c8390e6d-4961-4f7d-8cec-5502aa2a0b80` |
| **Status** | ✅ Email confirmado |
| **Criado em** | 2025-11-01 13:31:37 UTC |
| **Provider** | Email/Password |

### **URL de Login**

```
https://workflow-digital-masterpiece-zvug.vercel.app/admin
```

ou (se hospedado na Hostinger):

```
https://seudominio.com/admin/login
```

---

## 🆕 **Criar Novos Usuários Administrativos**

### **Opção 1: Via Dashboard do Supabase (Recomendado)**

1. **Acesse o dashboard:**
   ```
   https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop
   ```

2. **Navegue para:**
   - Authentication → Users

3. **Clique em:**
   - "Add User"

4. **Preencha:**
   - **Email**: Email do novo administrador
   - **Password**: Senha forte (mínimo 8 caracteres)
   - **Auto Confirm User**: ✅ Marcar

5. **Salve**

### **Opção 2: Via SQL**

Execute no SQL Editor do Supabase:

```sql
-- Criar novo usuário administrativo
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'novo-admin@workflowdigital.com', -- ALTERE AQUI
  crypt('SuaSenhaSegura123!', gen_salt('bf')), -- ALTERE AQUI
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Nome do Admin"}' -- ALTERE AQUI
)
RETURNING id, email, email_confirmed_at;

-- Criar identidade associada
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  id::text,
  id,
  jsonb_build_object(
    'sub', id::text,
    'email', email,
    'email_verified', true
  ),
  'email',
  NOW(),
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'novo-admin@workflowdigital.com' -- ALTERE AQUI
RETURNING provider, user_id;
```

---

## 🔍 **Listar Usuários Existentes**

Execute no SQL Editor:

```sql
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  u.last_sign_in_at,
  i.provider
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
ORDER BY u.created_at DESC;
```

---

## 🔄 **Redefinir Senha de Usuário**

### **Via SQL:**

```sql
-- Redefinir senha para um usuário específico
UPDATE auth.users
SET 
  encrypted_password = crypt('NovaSenhaSegura123!', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'admin@workflowdigital.com'
RETURNING email, updated_at;
```

### **Via Dashboard:**

1. Acesse: Authentication → Users
2. Encontre o usuário
3. Clique nos três pontos (⋮)
4. "Reset Password"
5. Insira nova senha

---

## 🗑️ **Remover Usuário**

### **Via SQL:**

```sql
-- Remover identidade primeiro
DELETE FROM auth.identities
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'usuario@remover.com'
);

-- Depois remover usuário
DELETE FROM auth.users
WHERE email = 'usuario@remover.com'
RETURNING email;
```

### **Via Dashboard:**

1. Acesse: Authentication → Users
2. Encontre o usuário
3. Clique nos três pontos (⋮)
4. "Delete User"
5. Confirme

---

## 🧪 **Testar Login**

### **1. Acessar página de login:**

```
https://workflow-digital-masterpiece-zvug.vercel.app/admin
```

### **2. Usar credenciais:**

- Email: `admin@workflowdigital.com`
- Senha: `AdminWorkflow2024!`

### **3. Verificar:**

- ✅ Login deve ser bem-sucedido
- ✅ Deve redirecionar para `/admin/dashboard`
- ✅ Dashboard deve carregar corretamente

---

## ⚠️ **Problemas Comuns**

### **Erro 400: Invalid login credentials**

**Causas:**
- Email ou senha incorretos
- Usuário não existe no banco
- Email não confirmado

**Soluções:**
```sql
-- Verificar se usuário existe
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email = 'seu-email@aqui.com';

-- Confirmar email manualmente
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'seu-email@aqui.com';
```

### **Erro 400: Email not confirmed**

**Solução:**
```sql
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'seu-email@aqui.com';
```

### **Usuário não consegue fazer login**

**Verificações:**
```sql
-- 1. Verificar se existe
SELECT * FROM auth.users WHERE email = 'seu-email@aqui.com';

-- 2. Verificar identidade
SELECT * FROM auth.identities 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@aqui.com');

-- 3. Recriar identidade se necessário
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  id::text,
  id,
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
  'email',
  NOW(),
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'seu-email@aqui.com'
ON CONFLICT DO NOTHING;
```

---

## 🔒 **Melhores Práticas de Segurança**

### **Senhas:**
- ✅ Mínimo 12 caracteres
- ✅ Combinar letras maiúsculas e minúsculas
- ✅ Incluir números e símbolos
- ✅ Não usar palavras do dicionário
- ✅ Trocar periodicamente

### **Emails:**
- ✅ Usar emails corporativos
- ✅ Não usar emails pessoais para produção
- ✅ Manter lista de administradores atualizada

### **Acesso:**
- ✅ Criar usuários separados para cada admin
- ✅ Não compartilhar credenciais
- ✅ Remover usuários de funcionários desligados
- ✅ Revisar lista de usuários mensalmente

---

## 📊 **Monitoramento**

### **Última atividade dos usuários:**

```sql
SELECT 
  email,
  last_sign_in_at,
  created_at,
  CASE 
    WHEN last_sign_in_at IS NULL THEN 'Nunca fez login'
    WHEN last_sign_in_at < NOW() - INTERVAL '30 days' THEN 'Inativo há 30+ dias'
    WHEN last_sign_in_at < NOW() - INTERVAL '7 days' THEN 'Inativo há 7+ dias'
    ELSE 'Ativo'
  END as status
FROM auth.users
ORDER BY last_sign_in_at DESC NULLS LAST;
```

### **Contagem de logins por usuário:**

```sql
-- Se tiver tabela de audit/logs
SELECT 
  u.email,
  COUNT(*) as login_count,
  MAX(created_at) as last_login
FROM auth.audit_log_entries a
JOIN auth.users u ON a.user_id = u.id
WHERE a.action = 'user_signedin'
GROUP BY u.email
ORDER BY login_count DESC;
```

---

## 📞 **Suporte**

Em caso de problemas:

1. Verificar logs do Supabase: https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop/logs
2. Testar queries SQL acima
3. Verificar credenciais do projeto em `src/lib/supabase.ts`
4. Consultar documentação: `supabase/MIGRATION-GUIDE.md`

---

**Última atualização**: 2025-11-01  
**Projeto**: Workflow Services 2 (wbtyimthsgdsftgwezop)

