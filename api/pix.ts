import type { VercelRequest, VercelResponse } from '@vercel/node';

// Configurações do produto Lauren
const LAUREN_PRODUCT = {
  name: 'Site Lauren Rossarola',
  description: 'Site profissional completo com painel administrativo, SEO otimizado e hospedagem vitalícia inclusa.',
  value: 897.00,
};

// Configuração do Asaas
const getAsaasConfig = () => {
  const apiKey = process.env.ASAAS_API_KEY?.trim();
  const env = (process.env.ASAAS_ENV || 'production').trim();
  
  const apiUrls = {
    production: 'https://api.asaas.com',
    sandbox: 'https://api-sandbox.asaas.com',
  };

  return {
    apiKey,
    baseUrl: apiUrls[env as keyof typeof apiUrls] || apiUrls.production,
    env,
  };
};

// Interface para dados do cliente
interface CustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
}

// Função para criar ou buscar cliente
const findOrCreateCustomer = async (
  customerData: CustomerData,
  config: ReturnType<typeof getAsaasConfig>
): Promise<string> => {
  // Primeiro, tentar buscar cliente existente pelo CPF/CNPJ
  const searchResponse = await fetch(
    `${config.baseUrl}/v3/customers?cpfCnpj=${customerData.cpfCnpj.replace(/\D/g, '')}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'access_token': config.apiKey!,
      },
    }
  );

  const searchData = await searchResponse.json();
  
  if (searchData.data && searchData.data.length > 0) {
    // Cliente já existe, retornar ID
    return searchData.data[0].id;
  }

  // Cliente não existe, criar novo
  const createResponse = await fetch(`${config.baseUrl}/v3/customers`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'access_token': config.apiKey!,
    },
    body: JSON.stringify({
      name: customerData.name.trim(),
      cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
      email: customerData.email.trim().toLowerCase(),
      mobilePhone: customerData.phone?.replace(/\D/g, ''),
      notificationDisabled: false,
    }),
  });

  const createData = await createResponse.json();
  
  if (!createResponse.ok) {
    throw new Error(createData.errors?.[0]?.description || 'Erro ao criar cliente');
  }

  return createData.id;
};

// Função para criar cobrança PIX
const createPixPayment = async (
  customerId: string,
  externalReference: string,
  config: ReturnType<typeof getAsaasConfig>
): Promise<{ paymentId: string; invoiceUrl: string }> => {
  // Data de vencimento: hoje + 1 dia
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  const paymentResponse = await fetch(`${config.baseUrl}/v3/payments`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'access_token': config.apiKey!,
    },
    body: JSON.stringify({
      customer: customerId,
      billingType: 'PIX',
      value: LAUREN_PRODUCT.value,
      dueDate: dueDateStr,
      description: LAUREN_PRODUCT.description,
      externalReference: externalReference,
    }),
  });

  const paymentData = await paymentResponse.json();

  if (!paymentResponse.ok) {
    throw new Error(paymentData.errors?.[0]?.description || 'Erro ao criar cobrança PIX');
  }

  return {
    paymentId: paymentData.id,
    invoiceUrl: paymentData.invoiceUrl,
  };
};

// Função para obter QR Code PIX
const getPixQrCode = async (
  paymentId: string,
  config: ReturnType<typeof getAsaasConfig>
): Promise<{ encodedImage: string; payload: string; expirationDate: string }> => {
  const qrCodeResponse = await fetch(`${config.baseUrl}/v3/payments/${paymentId}/pixQrCode`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'access_token': config.apiKey!,
    },
  });

  const qrCodeData = await qrCodeResponse.json();

  if (!qrCodeResponse.ok) {
    throw new Error(qrCodeData.errors?.[0]?.description || 'Erro ao obter QR Code PIX');
  }

  return {
    encodedImage: qrCodeData.encodedImage,
    payload: qrCodeData.payload,
    expirationDate: qrCodeData.expirationDate,
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Use POST para gerar PIX',
    });
  }

  try {
    const config = getAsaasConfig();

    if (!config.apiKey) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'API Key do Asaas não configurada',
      });
    }

    const { customerData, product } = req.body;

    // Validar dados obrigatórios
    if (!customerData?.name || !customerData?.cpfCnpj || !customerData?.email) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Nome, CPF/CNPJ e email são obrigatórios',
      });
    }

    if (product !== 'lauren') {
      return res.status(400).json({
        error: 'Invalid product',
        message: 'Produto não encontrado',
      });
    }

    // Gerar referência externa única
    const externalReference = `lauren-pix-${Date.now()}`;

    console.log('[PIX] Criando/buscando cliente...');
    const customerId = await findOrCreateCustomer(customerData, config);
    console.log('[PIX] Cliente ID:', customerId);

    console.log('[PIX] Criando cobrança PIX...');
    const { paymentId, invoiceUrl } = await createPixPayment(customerId, externalReference, config);
    console.log('[PIX] Payment ID:', paymentId);

    console.log('[PIX] Obtendo QR Code...');
    const qrCode = await getPixQrCode(paymentId, config);
    console.log('[PIX] QR Code obtido com sucesso');

    return res.status(200).json({
      success: true,
      paymentId,
      invoiceUrl,
      qrCode: {
        image: qrCode.encodedImage,
        payload: qrCode.payload,
        expirationDate: qrCode.expirationDate,
      },
      product: {
        name: LAUREN_PRODUCT.name,
        description: LAUREN_PRODUCT.description,
        value: LAUREN_PRODUCT.value,
      },
    });

  } catch (error) {
    console.error('[PIX] Erro:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Erro ao processar pagamento PIX',
    });
  }
}
