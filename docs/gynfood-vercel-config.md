# Configuracao do GynFood no Vercel

## Instrucoes para permitir iframe embedding

O projeto GynFood precisa ser configurado para permitir que seja exibido em iframes no portfolio da Workflow.

### Problema

Por padrao, a Vercel define o header `X-Frame-Options: DENY` que bloqueia a exibicao em iframes.
Sites React/Vite nao podem usar proxy devido a complexidade de client-side rendering e CORS.

### Solucao: Criar/Modificar `vercel.json`

Crie ou modifique o arquivo `vercel.json` na **raiz do projeto GynFood** com o seguinte conteudo:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://workflow-services.online https://www.workflow-services.online https://*.vercel.app http://localhost:* http://127.0.0.1:*"
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

### Deploy

Apos criar/modificar o arquivo, faca o deploy no Vercel:

```bash
# Via Vercel CLI
vercel --prod

# Ou via Git (se usando deploy automatico)
git add vercel.json
git commit -m "feat: permitir iframe embedding no portfolio"
git push
```

### Por que nao usar proxy?

Sites React/Vite (SPAs) fazem requisicoes client-side para APIs e CDNs.
Quando servidos via blob URL de um proxy, essas requisicoes falham por:

1. **CORS**: Requisicoes cross-origin sao bloqueadas
2. **Base URL**: Caminhos relativos nao funcionam em contexto blob://
3. **Hidratacao React**: O estado do servidor e cliente pode divergir

### Verificacao

Apos o deploy, teste acessando:
- https://www.workflow-services.online/portfolio
- Clique em "Visualizar" no card do GynFood App
- O iframe deve carregar o site completo

### Notas Tecnicas

- **NAO use `X-Frame-Options: ALLOW-FROM`** - deprecated e ignorado por navegadores modernos
- O header vazio `"X-Frame-Options": ""` remove o valor padrao da Vercel
- `frame-ancestors` e a solucao moderna e segura
- O dominio `workflow-services.online` e o portfolio de producao

