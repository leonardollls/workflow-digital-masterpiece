# Configuração do Estado da Arte para Permitir Iframe Embedding

## Problema Atual

O site `https://estado-da-arte.vercel.app/` está bloqueando a exibição em iframes devido ao header `X-Frame-Options: DENY` configurado por padrão pela Vercel.

## Solução: Configurar `vercel.json`

### Passo 1: Localizar o Projeto Estado da Arte

Acesse o repositório/código fonte do site Estado da Arte (`estado-da-arte.vercel.app`).

### Passo 2: Criar/Modificar `vercel.json`

Na **raiz do projeto Estado da Arte**, crie ou modifique o arquivo `vercel.json` com o seguinte conteúdo:

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

### Explicação da Configuração

1. **`Content-Security-Policy` com `frame-ancestors`**:
   - `'self'`: Permite o próprio domínio
   - `https://workflow-digital-masterpiece.vercel.app`: Domínio do portfolio de vendas
   - `https://*.vercel.app`: Todos os domínios Vercel (para previews)
   - `http://localhost:*`: Desenvolvimento local
   - `https://workflow-services.online`: Portfolio de produção (se aplicável)

2. **`X-Frame-Options: ""`**:
   - Header vazio remove o valor padrão `DENY` da Vercel
   - O controle passa a ser feito pelo `Content-Security-Policy`

### Passo 3: Deploy no Vercel

Após criar/modificar o arquivo, faça o deploy:

```bash
# Opção 1: Via Vercel CLI
vercel --prod

# Opção 2: Via Git (se usando deploy automático)
git add vercel.json
git commit -m "feat: permitir iframe embedding para preview no portfolio"
git push origin main
```

### Passo 4: Verificação

Após o deploy, teste:

1. Acesse `http://localhost:8080/site/estado-da-arte`
2. Clique em "Visualizar Nova Versão" ou "Ver Site em Tela Cheia"
3. O iframe deve carregar o site completo sem erros

### Verificação Técnica (Opcional)

Você pode verificar os headers HTTP usando:

```bash
# Via curl
curl -I https://estado-da-arte.vercel.app/

# Ou via navegador
# Abra DevTools > Network > Headers > Response Headers
# Procure por:
# - X-Frame-Options: (deve estar ausente ou vazio)
# - Content-Security-Policy: (deve conter frame-ancestors)
```

## Alternativa: Se o Projeto Usar Next.js

Se o projeto Estado da Arte for Next.js, você também pode configurar no `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://workflow-digital-masterpiece.vercel.app https://*.vercel.app http://localhost:* http://127.0.0.1:*"
          },
          {
            key: 'X-Frame-Options',
            value: ''
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

## Alternativa: Se o Projeto Usar Vite/React

Se o projeto usar Vite, você pode criar um arquivo `public/_headers` (mas o `vercel.json` é preferível):

```
/*
  Content-Security-Policy: frame-ancestors 'self' https://workflow-digital-masterpiece.vercel.app https://*.vercel.app http://localhost:* http://127.0.0.1:*
  X-Frame-Options: 
```

**Nota**: O `vercel.json` tem precedência sobre `_headers` na Vercel.

## Segurança

✅ **Seguro**: A configuração permite apenas domínios específicos e conhecidos  
✅ **Controlado**: Você mantém controle sobre quais sites podem incorporar  
✅ **Moderno**: `Content-Security-Policy` é o padrão moderno (X-Frame-Options está deprecated)

## Troubleshooting

### Se ainda não funcionar após o deploy:

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Aguarde alguns minutos** - headers podem levar tempo para propagar
3. **Verifique os headers** usando DevTools > Network
4. **Confirme que o `vercel.json` está na raiz** do projeto

### Erro comum: "X-Frame-Options ainda está como DENY"

- Certifique-se de que o `vercel.json` está na raiz do projeto
- Verifique se fez o deploy após a alteração
- O header vazio `""` remove o padrão da Vercel

## Referências

- [Vercel Headers Documentation](https://vercel.com/docs/concepts/projects/project-configuration#headers)
- [Content-Security-Policy frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors)
