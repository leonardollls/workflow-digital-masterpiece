# Configuracao do GynFood no Vercel

## Instrucoes para permitir iframe embedding

O projeto GynFood precisa ser configurado para permitir que seja exibido em iframes.

### Passo 1: Criar/Modificar `vercel.json`

Crie ou modifique o arquivo `vercel.json` na raiz do projeto GynFood com o seguinte conteudo:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://workflow.com.br https://*.vercel.app http://localhost:* http://127.0.0.1:*"
        }
      ]
    }
  ]
}
```

### Passo 2: Deploy

Apos criar/modificar o arquivo, faca o deploy no Vercel:

```bash
vercel --prod
```

Ou simplesmente faca push para o repositorio se estiver usando deploy automatico.

### Notas

- **NAO use `X-Frame-Options: ALLOW-FROM`** - Este header esta deprecated e nao funciona em navegadores modernos.
- A solucao moderna e usar `Content-Security-Policy: frame-ancestors`.
- Ajuste os dominios permitidos conforme necessario (substitua `workflow.com.br` pelo seu dominio real).
- `localhost:*` permite testes locais em desenvolvimento.

