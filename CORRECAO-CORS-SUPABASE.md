# 🔧 Correção de Erro CORS - Painel Admin

## 📋 Problema Identificado

O erro de CORS está ocorrendo porque o Supabase está bloqueando requisições do domínio `https://leonardolopes.online`. O erro no console mostra:

```
Access to fetch at 'https://wbtyimthsgdsftgwezop.supabase.co/auth/v1/token?grant_type=password' 
from origin 'https://leonardolopes.online' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solução

### **Passo 1: Configurar URLs Permitidas no Supabase Dashboard**

1. **Acesse o Dashboard do Supabase:**
   ```
   https://supabase.com/dashboard/project/wbtyimthsgdsftgwezop
   ```

2. **Navegue para Authentication:**
   - No menu lateral, clique em **Authentication**
   - Depois clique em **URL Configuration**

3. **Configure as URLs:**
   
   **Site URL:**
   ```
   https://leonardolopes.online
   ```
   
   **Redirect URLs (adicione todas as URLs necessárias):**
   ```
   https://leonardolopes.online/**
   https://leonardolopes.online/admin/**
   https://leonardolopes.online/admin/login
   https://leonardolopes.online/admin/dashboard
   ```
   
   > 💡 **Dica:** Use `/**` no final para permitir todas as rotas do domínio

4. **Salve as alterações**

### **Passo 2: Verificar Configurações Adicionais**

No mesmo painel de **URL Configuration**, verifique:

- ✅ **Site URL** está configurada corretamente
- ✅ **Redirect URLs** inclui todas as rotas necessárias
- ✅ **JWT expiry** está configurado (padrão: 3600 segundos)

### **Passo 3: Limpar Cache e Testar**

Após configurar as URLs:

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Teste o login novamente** em `https://leonardolopes.online/admin/login`

## 🔍 Alterações no Código

### **Arquivo: `src/lib/supabase.ts`**

Atualizado para incluir:
- ✅ Configuração automática de `redirectTo` baseada no domínio atual
- ✅ Flow type PKCE para melhor segurança e compatibilidade com CORS
- ✅ Detecção automática do site URL

### **Configurações Aplicadas:**

```typescript
auth: {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  redirectTo: getSiteUrl(), // Configuração automática
  flowType: 'pkce' // Mais seguro e resolve problemas de CORS
}
```

## 📝 URLs que Devem Estar Configuradas

Certifique-se de que todas estas URLs estão na lista de **Redirect URLs**:

```
https://leonardolopes.online
https://leonardolopes.online/**
https://leonardolopes.online/admin
https://leonardolopes.online/admin/**
https://leonardolopes.online/admin/login
https://leonardolopes.online/admin/dashboard
```

## ⚠️ Importante

- As alterações no Supabase Dashboard podem levar alguns minutos para serem aplicadas
- Após configurar, aguarde 1-2 minutos antes de testar
- Se o problema persistir, verifique se não há cache do navegador interferindo

## 🧪 Teste de Validação

Após configurar, teste:

1. ✅ Login em `https://leonardolopes.online/admin/login`
2. ✅ Redirecionamento após login
3. ✅ Refresh token funcionando
4. ✅ Logout funcionando

## 📞 Suporte

Se o problema persistir após seguir todos os passos:

1. Verifique os logs do console do navegador
2. Verifique os logs do Supabase Dashboard (Logs > Auth)
3. Confirme que todas as URLs estão corretas no dashboard

---

**Data da Correção:** 12 de Fevereiro de 2026  
**Projeto:** Workflow Digital Masterpiece  
**Projeto Supabase:** wbtyimthsgdsftgwezop
