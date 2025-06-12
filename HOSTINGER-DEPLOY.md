# 🏠 Deploy na Hostinger - Guia Completo

## 📋 Visão Geral

Este guia mostra como hospedar seu projeto React na Hostinger usando duas abordagens diferentes. **A integração com Supabase continuará funcionando normalmente** em qualquer uma das opções.

## 🚀 Método 1: Static Site Hosting (Recomendado)

### ✅ **Vantagens**
- Deploy automático via Git
- SSL gratuito
- CDN global
- Builds automáticos
- Mais rápido e moderno

### **Passo a Passo**

#### 1. **Acessar o Painel da Hostinger**
1. Faça login na sua conta Hostinger
2. Vá para **Websites** → **Static Site Hosting**
3. Clique em **Create New Site**

#### 2. **Conectar com GitHub**
1. Selecione **Connect with Git**
2. Autorize a conexão com GitHub
3. Selecione o repositório: `workflow-digital-masterpiece`
4. Branch: `main`

#### 3. **Configurar Build**
```yaml
# Build Settings
Build Command: npm run build
Output Directory: dist
Node Version: 18.x
```

#### 4. **Configurar Variáveis de Ambiente**
Na seção **Environment Variables**, adicione:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

#### 5. **Deploy**
- Clique em **Deploy**
- Aguarde o build (2-3 minutos)
- Seu site estará disponível em: `https://seu-site.hostinger.app`

#### 6. **Domínio Personalizado (Opcional)**
1. Vá em **Settings** → **Custom Domain**
2. Adicione seu domínio
3. Configure DNS conforme instruções

---

## 🗂️ Método 2: Web Hosting Tradicional

### ✅ **Vantagens**
- Controle total
- Funciona com qualquer plano
- Upload direto via FTP

### **Passo a Passo**

#### 1. **Gerar Build Local**
```bash
npm run build
```

#### 2. **Acessar File Manager**
1. Painel Hostinger → **File Manager**
2. Navegue até `/public_html/`
3. Delete arquivos padrão (se houver)

#### 3. **Upload dos Arquivos**
1. Selecione todos os arquivos da pasta `dist/`
2. Faça upload para `/public_html/`
3. Aguarde conclusão

#### 4. **Configurar Variáveis de Ambiente**
Como não há suporte nativo para variáveis de ambiente no hosting tradicional, você tem duas opções:

**Opção A: Hardcode (Não recomendado para produção)**
```typescript
// src/lib/supabase.ts
const supabaseUrl = 'https://seu-projeto.supabase.co'
const supabaseAnonKey = 'sua_chave_anonima'
```

**Opção B: Arquivo de Configuração**
```typescript
// src/config/environment.ts
export const config = {
  supabase: {
    url: 'https://seu-projeto.supabase.co',
    anonKey: 'sua_chave_anonima'
  }
}
```

#### 5. **Rebuild e Re-upload**
```bash
npm run build
# Upload novamente os arquivos da pasta dist/
```

---

## 🔧 Configurações Importantes

### **Roteamento SPA**
O arquivo `.htaccess` já foi criado para garantir que as rotas funcionem:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### **HTTPS e SSL**
- A Hostinger fornece SSL gratuito
- Ative em **SSL/TLS** no painel
- Force HTTPS para melhor SEO

### **Performance**
- Ative compressão Gzip
- Configure cache headers
- Use CDN se disponível

---

## 🌐 Integração com Supabase

### ✅ **Nada Muda!**
A integração com Supabase funciona **exatamente igual** na Hostinger:
- ✅ Upload de arquivos
- ✅ Salvamento no banco
- ✅ Notificações por email
- ✅ Todas as funcionalidades

### **Configuração das Variáveis**

**Static Site Hosting:**
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

**Web Hosting Tradicional:**
Edite `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'https://seu-projeto.supabase.co'
const supabaseAnonKey = 'sua_chave_anonima'
```

---

## 🚀 Deploy Automático (Static Site)

### **Workflow Automático**
1. Você faz push no GitHub
2. Hostinger detecta mudanças
3. Build automático é executado
4. Site é atualizado automaticamente

### **Monitoramento**
- Logs de build no painel
- Notificações por email
- Rollback automático se build falhar

---

## 📊 Comparação de Métodos

| Aspecto | Static Site | Web Hosting |
|---------|-------------|-------------|
| **Setup** | Mais fácil | Manual |
| **Deploy** | Automático | Manual |
| **Performance** | Melhor | Boa |
| **Custo** | Menor | Padrão |
| **Manutenção** | Menor | Maior |
| **Flexibilidade** | Boa | Total |

---

## 🆘 Troubleshooting

### **Erro 404 nas Rotas**
- Verifique se `.htaccess` está no diretório correto
- Confirme se mod_rewrite está ativo

### **Variáveis de Ambiente Não Funcionam**
- Static Site: Verifique no painel da Hostinger
- Web Hosting: Use configuração hardcoded

### **Build Falha**
- Verifique versão do Node.js (use 18.x)
- Confirme se todas as dependências estão no package.json

### **Supabase Não Conecta**
- Verifique URLs e chaves
- Confirme se domínio está autorizado no Supabase

---

## 📞 Suporte

- **Hostinger**: Chat 24/7 no painel
- **Documentação**: [hostinger.com/tutorials](https://hostinger.com/tutorials)
- **Supabase**: Continua funcionando normalmente

---

## ✅ Checklist Final

- [ ] Build local funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Arquivo .htaccess criado
- [ ] Deploy realizado
- [ ] Rotas testadas
- [ ] Formulário de briefing funcionando
- [ ] Supabase conectado
- [ ] SSL ativado
- [ ] Domínio configurado (se aplicável) 