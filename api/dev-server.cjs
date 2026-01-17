/**
 * Servidor de desenvolvimento local para testar as serverless functions
 * 
 * Execute com: node api/dev-server.js
 * 
 * Este servidor simula as Vercel Serverless Functions localmente.
 * Em produção, as funções são executadas diretamente na Vercel.
 */

const http = require('http');
const url = require('url');

// Carregar variáveis de ambiente do .env
require('dotenv').config();

// Configuração
const PORT = process.env.API_PORT || 3000;

// Tipos de produtos disponíveis
const PRODUCTS = {
  lauren: {
    name: 'Site Lauren Rossarola',
    description: 'Site profissional completo com painel administrativo, SEO otimizado e hospedagem vitalícia inclusa.',
    value: 897.00,
    reference: 'site-lauren-rossarola',
  },
};

// Configuração do Asaas
const getAsaasConfig = () => {
  const apiKey = process.env.VITE_ASAAS_API_KEY || process.env.ASAAS_API_KEY;
  const env = process.env.VITE_ASAAS_ENV || process.env.ASAAS_ENV || 'production';
  const appUrl = process.env.VITE_APP_URL || process.env.APP_URL || 'http://localhost:8080';
  
  const apiUrls = {
    sandbox: 'https://api-sandbox.asaas.com',
    production: 'https://api.asaas.com',
  };
  
  const baseUrls = {
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

// Handler do checkout
async function handleCheckout(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Ler body da requisição
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    const data = JSON.parse(body);

    const config = getAsaasConfig();
    
    if (!config.apiKey) {
      console.error('❌ API Key não encontrada! Configure VITE_ASAAS_API_KEY no .env');
      res.writeHead(500);
      res.end(JSON.stringify({ 
        error: 'Configuration error',
        message: 'API Key não configurada' 
      }));
      return;
    }

    console.log('📦 Criando checkout para:', data.customerData?.name);
    console.log('🔑 Usando ambiente:', config.apiUrl.includes('sandbox') ? 'SANDBOX' : 'PRODUÇÃO');

    const { customerData, product = 'lauren' } = data;
    const productInfo = PRODUCTS[product];

    if (!productInfo) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Produto não encontrado' }));
      return;
    }

    // Requisição para o Asaas
    const checkoutRequest = {
      billingTypes: ['PIX', 'CREDIT_CARD'],
      chargeTypes: ['DETACHED', 'INSTALLMENT'],
      minutesToExpire: 30,
      externalReference: `${product}-site-${Date.now()}`,
      callback: {
        successUrl: `${config.appUrl}/checkout/sucesso`,
        cancelUrl: `${config.appUrl}/checkout/cancelado`,
        expiredUrl: `${config.appUrl}/checkout/expirado`,
      },
      items: [{
        name: productInfo.name,
        description: productInfo.description,
        quantity: 1,
        value: productInfo.value,
        externalReference: productInfo.reference,
      }],
      customerData: {
        name: customerData.name.trim(),
        email: customerData.email.trim().toLowerCase(),
        cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
        phone: customerData.phone?.replace(/\D/g, ''),
      },
      installment: {
        maxInstallmentCount: 12,
      },
    };

    console.log('📤 Enviando para Asaas...');

    const asaasResponse = await fetch(`${config.apiUrl}/v3/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': config.apiKey,
      },
      body: JSON.stringify(checkoutRequest),
    });

    const asaasData = await asaasResponse.json();

    if (!asaasResponse.ok) {
      console.error('❌ Erro do Asaas:', asaasData);
      res.writeHead(asaasResponse.status);
      res.end(JSON.stringify({ 
        error: 'Asaas error',
        message: asaasData.errors?.map(e => e.description).join(', ') || 'Erro ao processar pagamento'
      }));
      return;
    }

    const checkoutUrl = `${config.baseUrl}/c/${asaasData.id}`;
    
    console.log('✅ Checkout criado:', asaasData.id);
    console.log('🔗 URL:', checkoutUrl);

    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      checkoutId: asaasData.id,
      url: checkoutUrl,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    }));

  } catch (error) {
    console.error('❌ Erro interno:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ 
      error: 'Internal error',
      message: error.message 
    }));
  }
}

// Criar servidor
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/api/checkout') {
    handleCheckout(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log('');
  console.log('🚀 Servidor de desenvolvimento iniciado!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💳 Endpoint: http://localhost:${PORT}/api/checkout`);
  console.log('');
  console.log('📋 Para testar, execute em outro terminal:');
  console.log('   npm run dev');
  console.log('');
  console.log('🔑 Certifique-se de que VITE_ASAAS_API_KEY está configurada no .env');
  console.log('');
});
