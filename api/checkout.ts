import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function para criar sessões de checkout no Asaas
 * 
 * Esta função protege a API Key do Asaas, mantendo-a apenas no servidor.
 * A chave deve ser configurada como variável de ambiente na Vercel.
 * 
 * Endpoint: POST /api/checkout
 */

// Tipos
interface AsaasCustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  province?: string;
}

interface CheckoutRequestBody {
  customerData: AsaasCustomerData;
  product?: string; // Identificador do produto (ex: 'lauren', 'ortobom', etc.)
}

interface AsaasCheckoutRequest {
  billingTypes: string[];
  chargeTypes: string[];
  minutesToExpire?: number;
  externalReference?: string;
  callback: {
    successUrl: string;
    cancelUrl?: string;
    expiredUrl?: string;
  };
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    value: number;
  }>;
  customerData: AsaasCustomerData;
  maxInstallmentCount?: number;
}

// Configuração dos produtos disponíveis
const PRODUCTS: Record<string, { name: string; description: string; value: number; reference: string }> = {
  lauren: {
    name: 'Site Lauren Rossarola',
    description: 'Site profissional completo com painel administrativo, SEO otimizado e hospedagem vitalícia inclusa.',
    value: 897.00,
    reference: 'site-lauren-rossarola',
  },
  // Adicione outros produtos aqui conforme necessário
};

// Configuração do ambiente Asaas
const getAsaasConfig = () => {
  // Trim para remover possíveis quebras de linha (\r\n) das variáveis de ambiente
  const apiKey = process.env.ASAAS_API_KEY?.trim();
  const env = (process.env.ASAAS_ENV || 'production').trim();
  const appUrl = (process.env.APP_URL || 'https://leonardolopes.online').trim();
  
  const apiUrls: Record<string, string> = {
    sandbox: 'https://api-sandbox.asaas.com',
    production: 'https://api.asaas.com',
  };
  
  const baseUrls: Record<string, string> = {
    sandbox: 'https://sandbox.asaas.com',
    production: 'https://www.asaas.com',
  };

  return {
    apiKey,
    apiUrl: apiUrls[env] || apiUrls.production,
    baseUrl: baseUrls[env] || baseUrls.production,
    appUrl,
  };
};

// Handler principal
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Use POST para criar um checkout' 
    });
  }

  try {
    const config = getAsaasConfig();
    
    // Log de debug
    console.log('[Checkout] Iniciando...', {
      env: process.env.ASAAS_ENV,
      apiUrl: config.apiUrl,
      hasApiKey: !!config.apiKey,
      apiKeyPrefix: config.apiKey?.substring(0, 20) + '...',
    });
    
    // Verificar se a API Key está configurada
    if (!config.apiKey) {
      console.error('[Checkout] ASAAS_API_KEY não configurada nas variáveis de ambiente da Vercel');
      return res.status(500).json({ 
        error: 'Configuration error',
        message: 'Serviço de pagamento não configurado corretamente' 
      });
    }

    // Validar body da requisição
    const body = req.body as CheckoutRequestBody;
    
    if (!body.customerData) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Dados do cliente são obrigatórios' 
      });
    }

    const { customerData, product = 'lauren' } = body;

    // Validar dados do cliente
    if (!customerData.name || !customerData.email || !customerData.cpfCnpj) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Nome, email e CPF/CNPJ são obrigatórios' 
      });
    }

    // Obter informações do produto
    const productInfo = PRODUCTS[product];
    if (!productInfo) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Produto não encontrado' 
      });
    }

    // Montar requisição para o Asaas
    const checkoutRequest: AsaasCheckoutRequest = {
      billingTypes: ['PIX', 'CREDIT_CARD'],
      chargeTypes: ['DETACHED'],
      minutesToExpire: 30,
      externalReference: `${product}-site-${Date.now()}`,
      callback: {
        successUrl: `${config.appUrl}/checkout/sucesso`,
        cancelUrl: `${config.appUrl}/checkout/cancelado`,
        expiredUrl: `${config.appUrl}/checkout/expirado`,
      },
      items: [
        {
          name: productInfo.name,
          description: productInfo.description,
          quantity: 1,
          value: productInfo.value,
        },
      ],
      customerData: {
        name: customerData.name.trim(),
        email: customerData.email.trim().toLowerCase(),
        cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
        phone: customerData.phone?.replace(/\D/g, ''),
        postalCode: customerData.postalCode?.replace(/\D/g, ''),
        address: customerData.address?.trim(),
        addressNumber: customerData.addressNumber?.trim(),
        province: customerData.province?.trim().toUpperCase(),
      },
      maxInstallmentCount: 12,
    };

    // Fazer requisição para o Asaas
    const asaasUrl = `${config.apiUrl}/v3/checkouts`;
    console.log('[Checkout] Chamando Asaas API:', asaasUrl);
    console.log('[Checkout] Request body:', JSON.stringify(checkoutRequest, null, 2));
    
    const asaasResponse = await fetch(asaasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': config.apiKey,
      },
      body: JSON.stringify(checkoutRequest),
    });

    // Obter o texto da resposta primeiro para debug
    const responseText = await asaasResponse.text();
    console.log('[Checkout] Asaas response status:', asaasResponse.status);
    console.log('[Checkout] Asaas response text:', responseText);
    
    // Tentar fazer parse do JSON
    let asaasData;
    try {
      asaasData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('[Checkout] Erro ao parsear resposta do Asaas:', parseError);
      return res.status(502).json({
        error: 'Asaas response error',
        message: 'Resposta inválida da API de pagamento',
        debug: {
          responseText: responseText.substring(0, 500), // Primeiros 500 chars
          status: asaasResponse.status,
          env: config.apiUrl,
        }
      });
    }

    // Verificar se houve erro na API do Asaas
    if (!asaasResponse.ok) {
      console.error('[Checkout] Erro na API do Asaas:', asaasData);
      const errorMessage = asaasData.errors
        ?.map((e: { description: string }) => e.description)
        .join(', ') || asaasData.message || 'Erro ao processar pagamento';
      
      // Retornar detalhes do erro para debug
      return res.status(asaasResponse.status).json({ 
        error: 'Asaas API error',
        message: errorMessage,
        debug: {
          status: asaasResponse.status,
          asaasError: asaasData,
          env: process.env.ASAAS_ENV,
        }
      });
    }

    // Usar a URL retornada pelo Asaas (campo 'link')
    // O formato correto é /checkoutSession/show/{id}, não /c/{id}
    const checkoutUrl = asaasData.link || `${config.baseUrl}/checkoutSession/show/${asaasData.id}`;
    
    console.log('[Checkout] Checkout URL:', checkoutUrl);

    // Retornar resposta de sucesso
    return res.status(200).json({
      success: true,
      checkoutId: asaasData.id,
      url: checkoutUrl,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });

  } catch (error) {
    console.error('Erro interno:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.',
      debug: {
        errorType: error instanceof Error ? error.name : typeof error,
        errorMessage: errorMessage,
        env: process.env.ASAAS_ENV,
      }
    });
  }
}
