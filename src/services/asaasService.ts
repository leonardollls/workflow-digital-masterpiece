/**
 * Asaas Payment Gateway Integration Service
 * 
 * Este serviço se comunica com o backend serverless para criar sessões de checkout.
 * A API Key do Asaas é mantida segura no servidor (Vercel Serverless Functions).
 * 
 * Documentação Asaas: https://docs.asaas.com/
 */

// Tipos para o serviço Asaas
export interface AsaasCustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  province?: string;
}

export interface CheckoutResponse {
  success: boolean;
  checkoutId: string;
  url: string;
  expiresAt: string;
}

export interface CheckoutError {
  error: string;
  message: string;
}

// Tipos para PIX direto
export interface PixCustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
}

export interface PixResponse {
  success: boolean;
  paymentId: string;
  invoiceUrl: string;
  qrCode: {
    image: string; // Base64
    payload: string; // Copia e cola
    expirationDate: string;
  };
  product: {
    name: string;
    description: string;
    value: number;
  };
}

// Tipos para Cartão de Crédito (Checkout Transparente)
export interface CreditCardCustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  postalCode: string;
  addressNumber: string;
}

export interface CreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CreditCardResponse {
  success: boolean;
  approved: boolean;
  pending: boolean;
  paymentId: string;
  status: string;
  statusMessage: string;
  invoiceUrl: string;
  product: {
    name: string;
    description: string;
    value: number;
    installments: number;
    installmentValue: number;
  };
}

/**
 * Cria uma sessão de checkout através do backend seguro
 * 
 * A API Key do Asaas é mantida no servidor, nunca exposta no frontend.
 */
export const createCheckoutSession = async (
  customerData: AsaasCustomerData,
  product: string = 'lauren'
): Promise<CheckoutResponse> => {
  // Determinar a URL base (local vs produção)
  const baseUrl = import.meta.env.DEV 
    ? 'http://localhost:3000' // URL do servidor local para desenvolvimento
    : ''; // Em produção, usa o mesmo domínio
  
  const response = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerData,
      product,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Mostrar erro completo para debug
    console.error('Checkout API Error:', data);
    let errorMessage = data.message || 'Erro ao criar sessão de checkout';
    
    // Se houver debug info, adicionar à mensagem
    if (data.debug) {
      const debugInfo = data.debug;
      if (debugInfo.asaasError) {
        const asaasErrors = debugInfo.asaasError.errors;
        if (asaasErrors && asaasErrors.length > 0) {
          errorMessage = asaasErrors.map((e: { description: string }) => e.description).join('; ');
        }
      }
      console.error('Debug info:', debugInfo);
    }
    
    throw new Error(errorMessage);
  }

  return data as CheckoutResponse;
};

/**
 * Cria uma sessão de checkout para o produto Lauren Rossarola
 */
export const createLaurenCheckout = async (
  customerData: AsaasCustomerData
): Promise<CheckoutResponse> => {
  return createCheckoutSession(customerData, 'lauren');
};

/**
 * Cria um pagamento PIX direto com QR Code
 * 
 * Esta função gera o PIX diretamente, sem passar pelo checkout intermediário.
 * O QR Code é exibido na própria página para o cliente pagar.
 */
export const createPixPayment = async (
  customerData: PixCustomerData,
  product: string = 'lauren'
): Promise<PixResponse> => {
  // Determinar a URL base (local vs produção)
  const baseUrl = import.meta.env.DEV 
    ? 'http://localhost:3000' // URL do servidor local para desenvolvimento
    : ''; // Em produção, usa o mesmo domínio
  
  const response = await fetch(`${baseUrl}/api/pix`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerData,
      product,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('PIX API Error:', data);
    throw new Error(data.message || 'Erro ao gerar PIX');
  }

  return data as PixResponse;
};

/**
 * Cria pagamento PIX para o produto Lauren Rossarola
 */
export const createLaurenPix = async (
  customerData: PixCustomerData
): Promise<PixResponse> => {
  return createPixPayment(customerData, 'lauren');
};

/**
 * Processa pagamento com cartão de crédito (Checkout Transparente)
 * 
 * Esta função processa o pagamento diretamente com os dados do cartão,
 * sem redirecionar para o checkout do Asaas.
 */
export const processCreditCardPayment = async (
  customerData: CreditCardCustomerData,
  creditCardData: CreditCardData,
  installments: number = 1,
  product: string = 'lauren'
): Promise<CreditCardResponse> => {
  const baseUrl = import.meta.env.DEV 
    ? 'http://localhost:3000'
    : '';
  
  const response = await fetch(`${baseUrl}/api/credit-card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerData,
      creditCardData,
      installments,
      product,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Credit Card API Error:', data);
    throw new Error(data.message || 'Erro ao processar pagamento com cartão');
  }

  return data as CreditCardResponse;
};

/**
 * Processa pagamento com cartão para o produto Lauren Rossarola
 */
export const processLaurenCreditCard = async (
  customerData: CreditCardCustomerData,
  creditCardData: CreditCardData,
  installments: number = 1
): Promise<CreditCardResponse> => {
  return processCreditCardPayment(customerData, creditCardData, installments, 'lauren');
};

/**
 * Valida CPF
 */
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

/**
 * Valida CNPJ
 */
export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) return false;
  
  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

/**
 * Valida CPF ou CNPJ
 */
export const validateCPFOrCNPJ = (document: string): boolean => {
  const cleanDoc = document.replace(/\D/g, '');
  
  if (cleanDoc.length === 11) {
    return validateCPF(cleanDoc);
  } else if (cleanDoc.length === 14) {
    return validateCNPJ(cleanDoc);
  }
  
  return false;
};

/**
 * Formata CPF
 */
export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

/**
 * Formata CNPJ
 */
export const formatCNPJ = (cnpj: string): string => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

/**
 * Formata CPF ou CNPJ automaticamente
 */
export const formatCPFOrCNPJ = (document: string): string => {
  const cleanDoc = document.replace(/\D/g, '');
  
  if (cleanDoc.length <= 11) {
    return formatCPF(cleanDoc);
  } else {
    return formatCNPJ(cleanDoc);
  }
};

/**
 * Formata telefone
 */
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length <= 10) {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return cleanPhone
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

export default {
  createCheckoutSession,
  createLaurenCheckout,
  createPixPayment,
  createLaurenPix,
  processCreditCardPayment,
  processLaurenCreditCard,
  validateCPF,
  validateCNPJ,
  validateCPFOrCNPJ,
  formatCPF,
  formatCNPJ,
  formatCPFOrCNPJ,
  formatPhone,
};
