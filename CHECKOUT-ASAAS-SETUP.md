# Configuração do Checkout Asaas

Este guia explica como configurar o checkout integrado com o Asaas.

## Arquitetura de Segurança

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Frontend      │ ───► │  Vercel Serverless │ ───► │  Asaas API  │
│   (React)       │      │  Function (api/)   │      │             │
└─────────────────┘      └──────────────────┘      └─────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  API Key (segura) │
                         │  Variável de Amb. │
                         └──────────────────┘
```

A API Key do Asaas **nunca é exposta no frontend**. Ela fica armazenada como variável de ambiente no servidor da Vercel.

## Configuração Local (Desenvolvimento)

### 1. Criar arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Asaas API Configuration
VITE_ASAAS_API_KEY=$aact_prod_SEU_TOKEN_AQUI
VITE_ASAAS_ENV=production
VITE_APP_URL=http://localhost:8080

# Supabase (existente)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

### 2. Executar em modo desenvolvimento

**Terminal 1** - Servidor de API local:
```bash
npm run dev:api
```

**Terminal 2** - Frontend:
```bash
npm run dev
```

Ou execute ambos simultaneamente:
```bash
npm run dev:full
```

### 3. Testar o checkout

Acesse: http://localhost:8080/checkout/lauren

## Configuração na Vercel (Produção)

### 1. Configurar Variáveis de Ambiente

No painel da Vercel (https://vercel.com/):

1. Vá em **Settings** > **Environment Variables**
2. Adicione as seguintes variáveis:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `ASAAS_API_KEY` | `$aact_prod_SEU_TOKEN` | Production |
| `ASAAS_ENV` | `production` | Production |
| `APP_URL` | `https://seu-dominio.com` | Production |

> ⚠️ **IMPORTANTE**: Na Vercel, use `ASAAS_API_KEY` (sem o prefixo `VITE_`) para que a chave não seja exposta no build do frontend.

### 2. Fazer Deploy

```bash
vercel --prod
```

Ou conecte seu repositório Git para deploys automáticos.

## Estrutura de Arquivos

```
api/
├── checkout.ts      # Serverless function principal
└── dev-server.cjs   # Servidor local para desenvolvimento

src/
├── services/
│   └── asaasService.ts  # Serviço do frontend (não expõe API Key)
└── pages/
    ├── CheckoutLauren.tsx   # Página de checkout
    ├── CheckoutSuccess.tsx  # Página de sucesso
    └── CheckoutCancel.tsx   # Página de cancelamento
```

## Endpoints da API

### POST /api/checkout

Cria uma nova sessão de checkout no Asaas.

**Request:**
```json
{
  "customerData": {
    "name": "João da Silva",
    "email": "joao@email.com",
    "cpfCnpj": "12345678901",
    "phone": "11999999999"
  },
  "product": "lauren"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutId": "abc123",
  "url": "https://www.asaas.com/c/abc123",
  "expiresAt": "2026-01-13T14:30:00.000Z"
}
```

## Produtos Disponíveis

Atualmente configurados em `api/checkout.ts`:

| ID | Nome | Valor |
|----|------|-------|
| `lauren` | Site Lauren Rossarola | R$ 897,00 |

Para adicionar novos produtos, edite o objeto `PRODUCTS` no arquivo `api/checkout.ts`.

## URLs de Callback

Após o pagamento, o cliente é redirecionado para:

- **Sucesso**: `/checkout/sucesso`
- **Cancelado**: `/checkout/cancelado`
- **Expirado**: `/checkout/expirado`

## Segurança

- ✅ API Key armazenada apenas no servidor
- ✅ Validação de dados no frontend e backend
- ✅ CORS configurado corretamente
- ✅ Sanitização de inputs
- ✅ Logs de erro sem exposição de dados sensíveis

## Troubleshooting

### Erro "API Key não configurada"

Verifique se a variável `ASAAS_API_KEY` está configurada corretamente na Vercel.

### Erro 401 - Unauthorized

A API Key está inválida ou expirada. Gere uma nova no painel do Asaas.

### Erro CORS

Verifique se os headers CORS estão configurados em `vercel.json`.

## Suporte

- Documentação Asaas: https://docs.asaas.com/
- Vercel Serverless Functions: https://vercel.com/docs/functions/serverless-functions
