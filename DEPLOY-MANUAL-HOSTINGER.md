# 🚀 Deploy Manual na Hostinger - Guia Passo a Passo

## 📋 Pré-requisitos

- ✅ Conta na Hostinger com plano de Web Hosting
- ✅ Projeto Supabase configurado
- ✅ Build do projeto gerado (`npm run build`)

## 🛠️ Passo a Passo Completo

### **1. 🔧 Configurar Credenciais do Supabase**

#### **1.1 Obter Credenciais do Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Entre no seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** (ex: `https://xyzabc123.supabase.co`)
   - **Anon public key** (chave longa começando com `eyJ...`)

#### **1.2 Configurar no Projeto**
1. Abra o arquivo `src/lib/supabase.production.ts`
2. Substitua:
   ```typescript
   const supabaseUrl = 'https://SEU_PROJETO.supabase.co'
   const supabaseAnonKey = 'SUA_CHAVE_ANONIMA_AQUI'
   ```
   
   Por suas credenciais reais:
   ```typescript
   const supabaseUrl = 'https://xyzabc123.supabase.co'
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   ```

3. **Renomeie o arquivo:**
   - De: `supabase.production.ts`
   - Para: `supabase.ts` (substitua o arquivo original)

#### **1.3 Gerar Build Final**
```bash
npm run build
```

### **2. 📁 Acessar File Manager da Hostinger**

#### **2.1 Login no Painel**
1. Acesse [hostinger.com.br](https://hostinger.com.br)
2. Faça login na sua conta
3. Vá em **Hospedagem** → **Gerenciar**

#### **2.2 Abrir File Manager**
1. No painel de controle, clique em **File Manager**
2. Navegue até a pasta `/public_html/`
3. **Importante:** Esta é a pasta raiz do seu site

### **3. 🗑️ Limpar Pasta de Destino**

#### **3.1 Remover Arquivos Padrão**
Na pasta `/public_html/`, delete:
- `index.html` (se existir)
- `default.htm` (se existir)
- Qualquer arquivo de exemplo da Hostinger

#### **3.2 Manter Arquivos Importantes**
**NÃO delete:**
- `.htaccess` (se já existir)
- Pastas como `cgi-bin/`, `logs/`, etc.

### **4. 📤 Upload dos Arquivos**

#### **4.1 Selecionar Arquivos do Build**
Na sua máquina, vá até a pasta `dist/` do projeto e selecione **TODOS** os arquivos:

```
dist/
├── assets/
│   ├── briefingService-DX_GGWfH.js
│   ├── index-Boj9C8Sf.js
│   ├── index-fB74OWLC.css
│   ├── logo-workflow-CkGbx7Cd.png
│   └── vendor-Divjyx1E.js
├── Images/
├── .htaccess
├── _redirects
├── favicon.ico
├── index.html
├── logo-workflow.png
├── placeholder.svg
└── robots.txt
```

#### **4.2 Fazer Upload**
1. No File Manager da Hostinger, clique em **Upload**
2. Selecione **todos** os arquivos da pasta `dist/`
3. Aguarde o upload completar (pode demorar alguns minutos)
4. **Importante:** Mantenha a estrutura de pastas

#### **4.3 Verificar Upload**
Após o upload, sua pasta `/public_html/` deve ter:
```
/public_html/
├── assets/
├── Images/
├── .htaccess
├── _redirects
├── favicon.ico
├── index.html
├── logo-workflow.png
├── placeholder.svg
└── robots.txt
```

### **5. 🔒 Configurar SSL (Importante)**

#### **5.1 Ativar SSL**
1. No painel da Hostinger, vá em **SSL/TLS**
2. Clique em **Gerenciar SSL**
3. Ative o **SSL gratuito**
4. Aguarde a ativação (pode demorar até 24h)

#### **5.2 Forçar HTTPS**
1. Vá em **Avançado** → **Forçar HTTPS**
2. Ative a opção
3. Isso redirecionará HTTP para HTTPS automaticamente

### **6. 🧪 Testar o Site**

#### **6.1 Acessar o Site**
1. Abra seu domínio no navegador
2. Teste as seguintes URLs:
   - `https://seudominio.com/` (página inicial)
   - `https://seudominio.com/briefing` (formulário)

#### **6.2 Testar Funcionalidades**
- ✅ Navegação entre páginas
- ✅ Formulário de briefing carrega
- ✅ Upload de arquivos funciona
- ✅ Envio do formulário funciona
- ✅ Dados salvam no Supabase

### **7. 🔍 Verificar Integração Supabase**

#### **7.1 Testar Conexão**
1. Preencha o formulário de briefing
2. Faça upload de alguns arquivos
3. Envie o formulário
4. Verifique se aparece mensagem de sucesso

#### **7.2 Verificar no Supabase**
1. Acesse seu projeto no Supabase
2. Vá em **Table Editor** → **client_briefings**
3. Verifique se os dados foram salvos
4. Vá em **Storage** → **briefing-files**
5. Verifique se os arquivos foram enviados

## 🆘 Troubleshooting

### **❌ Erro 404 nas Rotas**
**Problema:** Página inicial carrega, mas `/briefing` dá erro 404

**Solução:**
1. Verifique se o arquivo `.htaccess` está na pasta `/public_html/`
2. Conteúdo do `.htaccess`:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

### **❌ Supabase Não Conecta**
**Problema:** Formulário não envia ou dá erro de conexão

**Soluções:**
1. **Verificar credenciais:**
   - URL do Supabase está correta?
   - Chave anônima está correta?

2. **Verificar CORS no Supabase:**
   - Vá em **Authentication** → **URL Configuration**
   - Adicione seu domínio em **Site URL**

3. **Verificar RLS:**
   - Confirme se as políticas estão configuradas
   - Teste inserção manual no Supabase

### **❌ Arquivos Não Carregam**
**Problema:** CSS/JS não carrega, site aparece sem estilo

**Soluções:**
1. **Verificar estrutura de pastas:**
   - Pasta `assets/` está na raiz?
   - Arquivos CSS/JS estão dentro de `assets/`?

2. **Verificar permissões:**
   - Arquivos têm permissão 644
   - Pastas têm permissão 755

3. **Limpar cache:**
   - Ctrl+F5 no navegador
   - Teste em aba anônima

### **❌ Upload de Arquivos Falha**
**Problema:** Formulário envia mas arquivos não fazem upload

**Soluções:**
1. **Verificar bucket no Supabase:**
   - Bucket `briefing-files` existe?
   - Políticas de upload estão configuradas?

2. **Verificar tamanho dos arquivos:**
   - Arquivos são menores que 50MB?
   - Tipos de arquivo são permitidos?

## 📊 Checklist Final

### **Antes do Deploy:**
- [ ] Credenciais do Supabase configuradas
- [ ] Build gerado com `npm run build`
- [ ] Arquivos da pasta `dist/` prontos

### **Durante o Deploy:**
- [ ] Pasta `/public_html/` limpa
- [ ] Todos os arquivos enviados
- [ ] Estrutura de pastas mantida
- [ ] SSL ativado

### **Após o Deploy:**
- [ ] Site carrega na URL principal
- [ ] Rota `/briefing` funciona
- [ ] Formulário carrega corretamente
- [ ] Upload de arquivos funciona
- [ ] Dados salvam no Supabase
- [ ] HTTPS funcionando

## 🔄 Atualizações Futuras

### **Para Atualizar o Site:**
1. Faça as alterações no código
2. Execute `npm run build`
3. Substitua os arquivos na `/public_html/`
4. **Dica:** Use FTP para uploads mais rápidos

### **Backup:**
- Sempre mantenha backup da pasta `dist/`
- Considere usar Git para versionamento
- Backup das credenciais do Supabase

## 📞 Suporte

- **Hostinger:** Chat 24/7 no painel
- **Supabase:** [docs.supabase.com](https://docs.supabase.com)
- **Projeto:** Documentação no repositório GitHub

---

🎉 **Parabéns! Seu site está no ar na Hostinger com integração completa ao Supabase!** 