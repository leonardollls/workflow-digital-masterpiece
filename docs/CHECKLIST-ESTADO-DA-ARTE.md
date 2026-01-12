# ✅ Checklist: Configuração Completa do Estado da Arte

## 📋 Verificações Necessárias

### 1. ✅ Arquivo `vercel.json` no Projeto Estado da Arte

**Localização:** Raiz do projeto Estado da Arte

**Conteúdo necessário:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://workflow-digital-masterpiece.vercel.app https://*.vercel.app http://localhost:* http://127.0.0.1:* https://workflow-services.online https://www.workflow-services.online"
        },
        {
          "key": "X-Frame-Options",
          "value": ""
        }
      ]
    }
  ]
}
```

**Status:** [ ] Configurado | [ ] Deploy realizado

---

### 2. ✅ Verificação de Headers HTTP

**Como verificar:**

```bash
curl -I https://estado-da-arte.vercel.app/
```

**O que procurar:**
- ✅ `Content-Security-Policy` com `frame-ancestors`
- ✅ **NÃO** deve ter `X-Frame-Options: DENY`

**Status:** [ ] Verificado | [ ] Headers corretos

---

### 3. ✅ Verificação no Código Atual

**Arquivo:** `src/pages/VendasEstadoDaArte.tsx`

**Funcionalidades implementadas:**
- ✅ Detecção automática de erro de iframe (3 segundos)
- ✅ Mensagem de fallback quando bloqueado
- ✅ Botão para abrir em nova aba
- ✅ Loading state durante carregamento
- ✅ Background escuro garantido

**Status:** [ ] Código atualizado | [ ] Testado localmente

---

### 4. ✅ Teste Final

**Passos:**
1. Limpar cache do navegador (Ctrl+Shift+Delete)
2. Acessar `http://localhost:8080/site/estado-da-arte`
3. Clicar em "Visualizar Nova Versão"
4. Verificar se o iframe carrega

**Resultado esperado:**
- ✅ Iframe carrega o site completo (se headers configurados)
- ✅ OU mostra mensagem com botão para nova aba (se ainda bloqueado)

**Status:** [ ] Testado | [ ] Funcionando

---

## 🔧 Troubleshooting

### Problema: Ainda mostra erro após configurar `vercel.json`

**Soluções:**
1. **Aguarde 2-5 minutos** - Headers podem levar tempo para propagar
2. **Limpe cache do navegador** completamente
3. **Verifique se o deploy foi concluído** no dashboard da Vercel
4. **Confirme que o arquivo está na raiz** do projeto
5. **Verifique se não há outro arquivo** sobrescrevendo (`_headers`, `next.config.js`)

### Problema: Headers não aparecem

**Soluções:**
1. Valide o JSON do `vercel.json` (use validador online)
2. Verifique se o deploy foi feito após adicionar o arquivo
3. Confirme que não há erros no deploy da Vercel

### Problema: Iframe carrega mas mostra em branco

**Soluções:**
1. Verifique se o site Estado da Arte está funcionando normalmente
2. Verifique console do navegador para outros erros
3. Teste abrir o site diretamente em nova aba

---

## 📝 Notas Importantes

1. **Cache**: Headers podem levar alguns minutos para propagar após deploy
2. **Desenvolvimento**: O código funciona mesmo sem headers configurados (mostra fallback)
3. **Produção**: Após configurar headers, o iframe funcionará automaticamente
4. **Segurança**: A configuração permite apenas domínios específicos e conhecidos

---

## ✅ Status Final

- [ ] `vercel.json` configurado no projeto Estado da Arte
- [ ] Deploy realizado na Vercel
- [ ] Headers verificados via curl/DevTools
- [ ] Cache do navegador limpo
- [ ] Teste local realizado
- [ ] Iframe funcionando corretamente

---

**Última atualização:** Após configurar o `vercel.json` e fazer deploy, aguarde alguns minutos e teste novamente. O código atual já está preparado para funcionar automaticamente quando os headers estiverem corretos.
