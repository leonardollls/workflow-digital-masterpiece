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
  const appUrl = (process.env.APP_URL || 'https://leonardolopes.online').trim();
  
  const apiUrls = {
    production: 'https://api.asaas.com',
    sandbox: 'https://api-sandbox.asaas.com',
  };

  return {
    apiKey,
    baseUrl: apiUrls[env as keyof typeof apiUrls] || apiUrls.production,
    appUrl,
    env,
  };
};

// Interface para dados do cliente
interface CustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  postalCode: string;
  addressNumber: string;
}

// Interface para dados do cartão
interface CreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
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
      postalCode: customerData.postalCode.replace(/\D/g, ''),
      addressNumber: customerData.addressNumber,
      notificationDisabled: false,
    }),
  });

  const createData = await createResponse.json();
  
  if (!createResponse.ok) {
    throw new Error(createData.errors?.[0]?.description || 'Erro ao criar cliente');
  }

  return createData.id;
};

// Função para criar cobrança com cartão de crédito
const createCreditCardPayment = async (
  customerId: string,
  customerData: CustomerData,
  creditCardData: CreditCardData,
  installments: number,
  remoteIp: string,
  config: ReturnType<typeof getAsaasConfig>
): Promise<{ paymentId: string; status: string; invoiceUrl: string }> => {
  // Data de vencimento: hoje
  const dueDate = new Date();
  const dueDateStr = dueDate.toISOString().split('T')[0];

  // Calcular valor total ou parcela
  const totalValue = LAUREN_PRODUCT.value;
  
  const paymentBody: Record<string, unknown> = {
    customer: customerId,
    billingType: 'CREDIT_CARD',
    value: installments > 1 ? undefined : totalValue,
    totalValue: installments > 1 ? totalValue : undefined,
    installmentCount: installments > 1 ? installments : undefined,
    installmentValue: installments > 1 ? parseFloat((totalValue / installments).toFixed(2)) : undefined,
    dueDate: dueDateStr,
    description: LAUREN_PRODUCT.description,
    externalReference: `lauren-card-${Date.now()}`,
    creditCard: {
      holderName: creditCardData.holderName.trim().toUpperCase(),
      number: creditCardData.number.replace(/\D/g, ''),
      expiryMonth: creditCardData.expiryMonth.padStart(2, '0'),
      expiryYear: creditCardData.expiryYear.length === 2 ? `20${creditCardData.expiryYear}` : creditCardData.expiryYear,
      ccv: creditCardData.ccv,
    },
    creditCardHolderInfo: {
      name: customerData.name.trim(),
      email: customerData.email.trim().toLowerCase(),
      cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
      postalCode: customerData.postalCode.replace(/\D/g, ''),
      addressNumber: customerData.addressNumber,
      phone: customerData.phone?.replace(/\D/g, ''),
    },
    remoteIp: remoteIp,
  };

  // Remove campos undefined
  Object.keys(paymentBody).forEach(key => {
    if (paymentBody[key] === undefined) {
      delete paymentBody[key];
    }
  });

  console.log('[CreditCard] Creating payment...');
  
  const paymentResponse = await fetch(`${config.baseUrl}/v3/payments`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'access_token': config.apiKey!,
    },
    body: JSON.stringify(paymentBody),
  });

  const paymentData = await paymentResponse.json();

  if (!paymentResponse.ok) {
    console.error('[CreditCard] Payment error:', paymentData);
    const errorMessage = paymentData.errors?.[0]?.description || 'Erro ao processar pagamento';
    throw new Error(errorMessage);
  }

  console.log('[CreditCard] Payment created:', paymentData.id, 'Status:', paymentData.status);

  return {
    paymentId: paymentData.id,
    status: paymentData.status,
    invoiceUrl: paymentData.invoiceUrl,
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
      message: 'Use POST para processar pagamento com cartão',
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

    const { customerData, creditCardData, installments, product } = req.body;

    // Validar dados obrigatórios
    if (!customerData?.name || !customerData?.cpfCnpj || !customerData?.email) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Nome, CPF/CNPJ e email são obrigatórios',
      });
    }

    if (!customerData?.postalCode || !customerData?.addressNumber) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'CEP e número do endereço são obrigatórios para pagamento com cartão',
      });
    }

    if (!creditCardData?.number || !creditCardData?.holderName || 
        !creditCardData?.expiryMonth || !creditCardData?.expiryYear || !creditCardData?.ccv) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Dados do cartão incompletos',
      });
    }

    if (product !== 'lauren') {
      return res.status(400).json({
        error: 'Invalid product',
        message: 'Produto não encontrado',
      });
    }

    // Obter IP do cliente
    const remoteIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.headers['x-real-ip'] as string || 
                     '127.0.0.1';

    const installmentCount = installments || 1;

    console.log('[CreditCard] Processing payment for:', customerData.email);
    
    // Criar ou buscar cliente
    const customerId = await findOrCreateCustomer(customerData, config);
    console.log('[CreditCard] Customer ID:', customerId);

    // Processar pagamento
    const payment = await createCreditCardPayment(
      customerId,
      customerData,
      creditCardData,
      installmentCount,
      remoteIp,
      config
    );

    // Verificar status do pagamento
    const isApproved = ['CONFIRMED', 'RECEIVED'].includes(payment.status);
    const isPending = payment.status === 'PENDING';
    const isAnalysis = payment.status === 'AWAITING_RISK_ANALYSIS';

    let statusMessage = 'Pagamento processado';
    if (isApproved) {
      statusMessage = 'Pagamento aprovado com sucesso!';
    } else if (isPending) {
      statusMessage = 'Pagamento em processamento';
    } else if (isAnalysis) {
      statusMessage = 'Pagamento em análise de segurança';
    }

    return res.status(200).json({
      success: true,
      approved: isApproved,
      pending: isPending || isAnalysis,
      paymentId: payment.paymentId,
      status: payment.status,
      statusMessage,
      invoiceUrl: payment.invoiceUrl,
      product: {
        name: LAUREN_PRODUCT.name,
        description: LAUREN_PRODUCT.description,
        value: LAUREN_PRODUCT.value,
        installments: installmentCount,
        installmentValue: parseFloat((LAUREN_PRODUCT.value / installmentCount).toFixed(2)),
      },
    });

  } catch (error) {
    console.error('[CreditCard] Erro:', error);
    
    return res.status(500).json({
      error: 'Payment error',
      message: error instanceof Error ? error.message : 'Erro ao processar pagamento com cartão',
    });
  }
}
