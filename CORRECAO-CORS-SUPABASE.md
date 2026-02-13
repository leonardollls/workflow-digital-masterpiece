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
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  storageKey: 'sb-wbtyimthsgdsftgwezop-auth-token'
  // Removido flowType PKCE - usando fluxo padrão que funciona melhor com CORS
}
```

**Nota:** O `flowType: 'pkce'` foi removido porque pode causar problemas com CORS em alguns casos. O fluxo padrão funciona melhor para chamadas diretas de API.

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
- Após configurar, aguarde **5-10 minutos** antes de testar (pode levar mais tempo)
- Se o problema persistir, verifique se não há cache do navegador interferindo
- **CRÍTICO:** O domínio deve estar configurado na **Site URL**, não apenas nas Redirect URLs
- As Redirect URLs são para fluxos OAuth, mas a Site URL é necessária para chamadas diretas de API

## 🔴 Problema Persistente - Troubleshooting Avançado

Se o erro de CORS **ainda persistir** após configurar as URLs corretamente:

### **Verificação 1: Confirmar Site URL**
1. No Supabase Dashboard > Authentication > URL Configuration
2. Verifique que **Site URL** está exatamente como: `https://leonardolopes.online`
3. **NÃO use** `http://` ou `www.` - use exatamente o domínio que aparece no erro
4. Clique em **Save changes** mesmo que já esteja salvo

### **Verificação 2: Limpar Tudo**
1. **Limpe o cache do navegador completamente:**
   - Chrome: Ctrl+Shift+Delete > Marque "Imagens e arquivos em cache" > Limpar
   - Ou use modo anônimo (Ctrl+Shift+N)
2. **Limpe localStorage e sessionStorage:**
   - Abra DevTools (F12) > Console
   - Execute: `localStorage.clear(); sessionStorage.clear();`
   - Recarregue a página (Ctrl+R)

### **Verificação 3: Verificar Logs do Supabase**
1. No Supabase Dashboard > Logs > Auth Logs
2. Verifique se há tentativas de login sendo registradas
3. Se não houver logs, o problema é CORS antes mesmo de chegar ao servidor

### **Verificação 4: Testar com Outro Domínio**
Se você tem acesso a outro domínio ou subdomínio, teste para ver se o problema é específico deste domínio.

### **Solução Alternativa: Aguardar Propagação**
O Supabase pode levar até **15-30 minutos** para propagar mudanças de CORS em alguns casos. Se você acabou de configurar:
1. Aguarde pelo menos 15 minutos
2. Teste novamente
3. Se ainda não funcionar, continue com as verificações abaixo

### **Última Alternativa: Verificar Configuração de Projeto**
1. No Supabase Dashboard > Settings > API
2. Verifique se o projeto está ativo e saudável
3. Verifique se há alguma restrição de IP ou configuração adicional

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
