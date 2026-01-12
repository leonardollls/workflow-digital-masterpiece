# Verificação dos Headers do Estado da Arte

## Como Verificar se o `vercel.json` Está Funcionando

### Passo 1: Verificar Headers HTTP

Após fazer o deploy do `vercel.json` no projeto Estado da Arte, verifique os headers:

#### Via Navegador (Chrome DevTools):

1. Abra `https://estado-da-arte.vercel.app/`
2. Abra DevTools (F12)
3. Vá para a aba **Network**
4. Recarregue a página (F5)
5. Clique no primeiro item (geralmente o documento HTML)
6. Vá para **Headers** > **Response Headers**
7. Procure por:

**✅ CORRETO:**
```
Content-Security-Policy: frame-ancestors 'self' https://workflow-digital-masterpiece.vercel.app ...
X-Frame-Options: (ausente ou vazio)
```

**❌ INCORRETO:**
```
X-Frame-Options: DENY
```

#### Via Terminal (curl):

```bash
curl -I https://estado-da-arte.vercel.app/
```

Procure nas linhas de resposta:
- Deve ter `Content-Security-Policy` com `frame-ancestors`
- **NÃO** deve ter `X-Frame-Options: DENY`

### Passo 2: Verificar se o `vercel.json` Está Correto

No projeto Estado da Arte, confirme que o arquivo `vercel.json` na raiz tem:

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

### Passo 3: Problemas Comuns

#### Problema: Headers ainda mostram `X-Frame-Options: DENY`

**Soluções:**
1. **Cache do Vercel**: Aguarde 2-5 minutos após o deploy
2. **Cache do navegador**: Limpe o cache (Ctrl+Shift+Delete)
3. **Verifique o arquivo**: Confirme que `vercel.json` está na raiz do projeto
4. **Deploy**: Certifique-se de que fez deploy após adicionar o arquivo

#### Problema: `Content-Security-Policy` não aparece

**Soluções:**
1. Verifique a sintaxe do JSON (use um validador JSON online)
2. Confirme que o `source` está como `"/(.*)"` (com aspas)
3. Verifique se não há outro arquivo sobrescrevendo (como `_headers` ou `next.config.js`)

#### Problema: Outro arquivo está configurando headers

Se o projeto Estado da Arte tiver:
- `public/_headers` → Remova ou modifique para não ter `X-Frame-Options: DENY`
- `next.config.js` → Verifique se não tem configuração de headers conflitante

### Passo 4: Teste Final

1. Acesse `http://localhost:8080/site/estado-da-arte`
2. Clique em "Visualizar Nova Versão"
3. O iframe deve carregar o site completo
4. Se ainda mostrar erro, aguarde mais alguns minutos e limpe o cache

### Comando Rápido para Verificar

```bash
# Verifica headers
curl -I https://estado-da-arte.vercel.app/ | grep -i "frame\|csp"

# Deve mostrar algo como:
# content-security-policy: frame-ancestors 'self' ...
# (sem X-Frame-Options: DENY)
```
