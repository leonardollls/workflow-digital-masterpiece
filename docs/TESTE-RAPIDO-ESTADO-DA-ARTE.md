# 🧪 Teste Rápido - Estado da Arte Iframe

## ✅ Verificação Rápida dos Headers

### 1. Verificar Headers HTTP

Execute no terminal:

```bash
curl -I https://estado-da-arte.vercel.app/ 2>&1 | grep -i "content-security-policy\|x-frame-options"
```

**Resultado esperado:**
```
content-security-policy: frame-ancestors *
```

**NÃO deve aparecer:**
```
x-frame-options: DENY
```

---

### 2. Teste no Navegador

1. **Limpe o cache completamente:**
   - Chrome: Ctrl+Shift+Delete → Marque "Imagens e arquivos em cache" → Limpar dados
   - Ou use modo anônimo: Ctrl+Shift+N

2. **Acesse:** `http://localhost:8080/site/estado-da-arte`

3. **Clique em:** "Visualizar Nova Versão" ou "Ver Site em Tela Cheia"

4. **Resultado esperado:**
   - ✅ Iframe carrega o site completo (se headers configurados corretamente)
   - ✅ OU mostra mensagem com botão "Abrir Site em Nova Aba" (se ainda bloqueado)

---

### 3. Verificar no Console do Navegador

Abra DevTools (F12) → Console

**Se funcionando:**
- ✅ Não deve ter erros de "X-Frame-Options" ou "Refused to display"
- ✅ Iframe carrega normalmente

**Se ainda bloqueado:**
- ❌ Vários erros: "Refused to display 'https://estado-da-arte.vercel.app/' in a frame"
- ❌ Mensagem de erro aparece no modal

---

## 🔍 Verificação Detalhada

### Verificar Headers Completos

```bash
curl -I https://estado-da-arte.vercel.app/
```

Procure por:
- ✅ `Content-Security-Policy: frame-ancestors *` (ou domínios específicos)
- ✅ **NÃO** deve ter `X-Frame-Options: DENY`

### Verificar no DevTools

1. Abra `https://estado-da-arte.vercel.app/`
2. DevTools (F12) → Network
3. Recarregue (F5)
4. Clique no primeiro item (documento HTML)
5. Vá em Headers → Response Headers
6. Procure por `Content-Security-Policy` e `X-Frame-Options`

---

## ⚠️ Troubleshooting

### Problema: Ainda mostra erro após configurar

**Soluções:**
1. ✅ Aguarde 2-5 minutos após deploy
2. ✅ Limpe cache completamente (Ctrl+Shift+Delete)
3. ✅ Teste em modo anônimo
4. ✅ Verifique se o deploy foi concluído na Vercel

### Problema: Headers não aparecem

**Verifique:**
1. ✅ `vercel.json` está na raiz do projeto Estado da Arte
2. ✅ JSON está válido (sem erros de sintaxe)
3. ✅ Deploy foi feito após adicionar o arquivo
4. ✅ Não há outros arquivos sobrescrevendo (`_headers`, `next.config.js`)

### Problema: Iframe carrega mas está em branco

**Verifique:**
1. ✅ Site funciona normalmente quando aberto diretamente
2. ✅ Console do navegador para outros erros
3. ✅ Pode ser problema de CORS ou recursos externos

---

## ✅ Checklist Final

- [ ] Headers verificados via curl
- [ ] Cache do navegador limpo
- [ ] Teste realizado em modo anônimo
- [ ] Console verificado (sem erros de X-Frame-Options)
- [ ] Iframe carrega corretamente OU mostra mensagem de fallback

---

**Status:** Após configurar `Content-Security-Policy: frame-ancestors *` e fazer deploy, o iframe deve funcionar automaticamente. O código atual detecta erros e mostra fallback quando necessário.
