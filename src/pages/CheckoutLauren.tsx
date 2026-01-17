import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassBackground } from '@/components/portfolio-v2';
import { 
  createLaurenPix,
  processLaurenCreditCard,
  formatCPFOrCNPJ,
  formatPhone,
  validateCPFOrCNPJ,
  type PixCustomerData,
  type CreditCardCustomerData,
  type CreditCardData,
  type PixResponse,
  type CreditCardResponse 
} from '@/services/asaasService';
import {
  Shield, Lock, CreditCard, QrCode, CheckCircle, 
  ArrowLeft, Loader2, AlertCircle, User, Mail, Phone,
  FileText, Award, Gift, Monitor, Copy, Check, Clock,
  Calendar, MapPin, Hash, ChevronDown, ChevronUp
} from 'lucide-react';

type PaymentMethod = 'pix' | 'credit_card';

interface FormData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
  postalCode: string;
  addressNumber: string;
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  cpfCnpj?: string;
  phone?: string;
  postalCode?: string;
  addressNumber?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

interface FieldValidation {
  name: boolean;
  email: boolean;
  cpfCnpj: boolean;
  phone: boolean;
  postalCode: boolean;
  addressNumber: boolean;
  cardNumber: boolean;
  cardHolder: boolean;
  cardExpiry: boolean;
  cardCvv: boolean;
}

const STORAGE_KEY = 'checkout_lauren_form_data';

const CheckoutLauren = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [installments, setInstallments] = useState(12); // Pré-selecionado em 12x conforme página de vendas
  
  // Estado para accordion do resumo no mobile
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  
  // Estado para PIX gerado
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Estado para cartão aprovado
  const [cardResult, setCardResult] = useState<CreditCardResponse | null>(null);
  
  // Estado para validação em tempo real
  const [fieldValidation, setFieldValidation] = useState<FieldValidation>({
    name: false,
    email: false,
    cpfCnpj: false,
    phone: false,
    postalCode: false,
    addressNumber: false,
    cardNumber: false,
    cardHolder: false,
    cardExpiry: false,
    cardCvv: false,
  });
  
  // Carregar dados do localStorage
  const loadSavedData = (): FormData => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || '',
          email: parsed.email || '',
          cpfCnpj: parsed.cpfCnpj || '',
          phone: parsed.phone || '',
          postalCode: parsed.postalCode || '',
          addressNumber: parsed.addressNumber || '',
          cardNumber: '',
          cardHolder: '',
          cardExpiry: '',
          cardCvv: '',
        };
      }
    } catch {
      // Ignore parse errors
    }
    return {
      name: '',
      email: '',
      cpfCnpj: '',
      phone: '',
      postalCode: '',
      addressNumber: '',
      cardNumber: '',
      cardHolder: '',
      cardExpiry: '',
      cardCvv: '',
    };
  };
  
  const [formData, setFormData] = useState<FormData>(loadSavedData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Product info
  const product = {
    name: 'Site Lauren Rossarola',
    description: 'Site profissional completo com painel administrativo',
    price: 897.00,
    originalPrice: 1597.00,
    maxInstallments: 12,
    image: '/Images/mockups-paineis-ediçao/Image_202601121144.jpeg',
    logo: '/Images/logos/logo lauren odontologia.png',
    features: [
      'Site completo e funcional',
      'Design moderno e premium',
      'Painel Administrativo',
      'Integração WhatsApp',
      'SEO otimizado',
      '100% responsivo',
      'Suporte Técnico',
      'Garantia de 30 dias',
      'Hospedagem Vitalícia',
    ],
  };

  // Generate installment options
  const installmentOptions = Array.from({ length: product.maxInstallments }, (_, i) => {
    const count = i + 1;
    const value = (product.price / count).toFixed(2);
    return { count, value: parseFloat(value) };
  });

  // Salvar dados no localStorage (exceto dados de cartão)
  useEffect(() => {
    const dataToSave = {
      name: formData.name,
      email: formData.email,
      cpfCnpj: formData.cpfCnpj,
      phone: formData.phone,
      postalCode: formData.postalCode,
      addressNumber: formData.addressNumber,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [formData.name, formData.email, formData.cpfCnpj, formData.phone, formData.postalCode, formData.addressNumber]);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Set dark background
  useEffect(() => {
    document.body.style.backgroundColor = '#020617';
    document.documentElement.style.backgroundColor = '#020617';
    document.title = 'Checkout - Site Lauren Rossarola | Leonardo Lopes';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  // Validação em tempo real de cada campo
  const validateFieldRealTime = useCallback((field: keyof FormData, value: string): boolean => {
    switch (field) {
      case 'name':
        return value.trim().length >= 3;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'cpfCnpj':
        return validateCPFOrCNPJ(value);
      case 'phone':
        return value.replace(/\D/g, '').length >= 10;
      case 'postalCode':
        return value.replace(/\D/g, '').length === 8;
      case 'addressNumber':
        return value.trim().length > 0;
      case 'cardNumber':
        return value.replace(/\D/g, '').length >= 13;
      case 'cardHolder':
        return value.trim().length >= 3;
      case 'cardExpiry': {
        const [month, year] = value.split('/');
        if (!month || !year) return false;
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const m = parseInt(month);
        const y = parseInt(year);
        return m >= 1 && m <= 12 && (y > currentYear || (y === currentYear && m >= currentMonth));
      }
      case 'cardCvv':
        return value.length >= 3;
      default:
        return false;
    }
  }, []);

  // Verificar se formulário básico está válido
  const isBasicFormValid = useMemo(() => {
    return fieldValidation.name && fieldValidation.email && fieldValidation.cpfCnpj && fieldValidation.phone;
  }, [fieldValidation]);

  // Verificar se formulário de cartão está válido
  const isCardFormValid = useMemo(() => {
    if (selectedPayment !== 'credit_card') return true;
    return fieldValidation.cardNumber && fieldValidation.cardHolder && 
           fieldValidation.cardExpiry && fieldValidation.cardCvv &&
           fieldValidation.postalCode && fieldValidation.addressNumber;
  }, [selectedPayment, fieldValidation]);

  // Verificar se pode finalizar compra
  const canCheckout = useMemo(() => {
    return selectedPayment && isBasicFormValid && (selectedPayment === 'pix' || isCardFormValid);
  }, [selectedPayment, isBasicFormValid, isCardFormValid]);

  // Format card number
  const formatCardNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
  };

  // Format card expiry
  const formatCardExpiry = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };

  // Format CEP
  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Form validation
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.cpfCnpj.trim()) {
      errors.cpfCnpj = 'CPF/CNPJ é obrigatório';
    } else if (!validateCPFOrCNPJ(formData.cpfCnpj)) {
      errors.cpfCnpj = 'CPF/CNPJ inválido';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Telefone inválido';
    }
    
    if (selectedPayment === 'credit_card') {
      if (!formData.postalCode.trim()) {
        errors.postalCode = 'CEP é obrigatório';
      } else if (formData.postalCode.replace(/\D/g, '').length !== 8) {
        errors.postalCode = 'CEP inválido';
      }

      if (!formData.addressNumber.trim()) {
        errors.addressNumber = 'Número é obrigatório';
      }

      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Número do cartão é obrigatório';
      } else if (formData.cardNumber.replace(/\D/g, '').length < 13) {
        errors.cardNumber = 'Número do cartão inválido';
      }

      if (!formData.cardHolder.trim()) {
        errors.cardHolder = 'Nome no cartão é obrigatório';
      }

      if (!formData.cardExpiry.trim()) {
        errors.cardExpiry = 'Validade é obrigatória';
      } else {
        const [month, year] = formData.cardExpiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
          errors.cardExpiry = 'Validade inválida';
        } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          errors.cardExpiry = 'Cartão expirado';
        }
      }

      if (!formData.cardCvv.trim()) {
        errors.cardCvv = 'CVV é obrigatório';
      } else if (formData.cardCvv.length < 3) {
        errors.cardCvv = 'CVV inválido';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, selectedPayment]);

  // Handle input change com validação em tempo real
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cpfCnpj') {
      formattedValue = formatCPFOrCNPJ(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'postalCode') {
      formattedValue = formatCEP(value);
    } else if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'cardExpiry') {
      formattedValue = formatCardExpiry(value);
    } else if (field === 'cardCvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'cardHolder') {
      formattedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Validação em tempo real
    const isValid = validateFieldRealTime(field, formattedValue);
    setFieldValidation(prev => ({ ...prev, [field]: isValid }));
    
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  }, [validateFieldRealTime]);

  // Copy PIX code
  const handleCopyPixCode = async () => {
    if (pixData?.qrCode.payload) {
      try {
        await navigator.clipboard.writeText(pixData.qrCode.payload);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 3000);
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = pixData.qrCode.payload;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 3000);
      }
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedPayment) {
      setError('Selecione uma forma de pagamento');
      return;
    }
    
    if (!validateForm()) {
      setError('Preencha todos os campos corretamente');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (selectedPayment === 'pix') {
        const customerData: PixCustomerData = {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
          phone: formData.phone.replace(/\D/g, ''),
        };
        const pixResponse = await createLaurenPix(customerData);
        setPixData(pixResponse);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const customerData: CreditCardCustomerData = {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''),
          phone: formData.phone.replace(/\D/g, ''),
          postalCode: formData.postalCode.replace(/\D/g, ''),
          addressNumber: formData.addressNumber.trim(),
        };
        
        const [month, year] = formData.cardExpiry.split('/');
        const creditCardData: CreditCardData = {
          holderName: formData.cardHolder.trim(),
          number: formData.cardNumber.replace(/\D/g, ''),
          expiryMonth: month,
          expiryYear: year,
          ccv: formData.cardCvv,
        };
        
        const cardResponse = await processLaurenCreditCard(customerData, creditCardData, installments);
        setCardResult(cardResponse);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      let errorMessage = 'Erro ao processar pagamento. Tente novamente.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Go back
  const handleGoBack = () => {
    if (pixData || cardResult) {
      setPixData(null);
      setCardResult(null);
    } else {
      navigate('/site/lauren-odontologia');
    }
  };

  // Helper function to get input styling
  const getInputClassName = (field: keyof FormData) => {
    const hasError = formErrors[field];
    const isValid = fieldValidation[field];
    return `w-full pl-12 pr-10 py-3 rounded-xl bg-white/5 border transition-all duration-300 ${
      hasError 
        ? 'border-red-500/50 focus:border-red-500' 
        : isValid 
          ? 'border-green-500/50 focus:border-green-500'
          : 'border-white/10 focus:border-[#D4A574]/50'
    } text-white placeholder-white/30 focus:outline-none`;
  };

  // Helper function to get icon color
  const getIconClassName = (field: keyof FormData) => {
    const hasError = formErrors[field];
    const isValid = fieldValidation[field];
    return `absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
      hasError ? 'text-red-400' : isValid ? 'text-green-400' : 'text-white/40'
    }`;
  };

  // Render success screen (for card payment)
  if (cardResult) {
    return (
      <div className="min-h-screen relative bg-slate-950">
        <GlassBackground />
        
        <main className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {cardResult.approved ? (
                <>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-4">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Pagamento Aprovado!</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Compra Realizada com Sucesso!
                  </h1>
                  <p className="text-white/60">
                    Obrigado pela sua compra. Você receberá um email com os próximos passos.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 mb-4">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">{cardResult.statusMessage}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Pagamento em Processamento
                  </h1>
                  <p className="text-white/60">
                    Seu pagamento está sendo processado. Você receberá um email com a confirmação.
                  </p>
                </>
              )}
            </div>

            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800/80 flex items-center justify-center">
                  <img 
                    src={product.logo} 
                    alt="Logo Lauren Rossarola"
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<span class="text-white font-bold text-xl">LR</span>';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{cardResult.product.name}</h3>
                  <p className="text-white/60 text-sm">
                    {cardResult.product.installments > 1 
                      ? `${cardResult.product.installments}x de R$ ${cardResult.product.installmentValue.toFixed(2)}`
                      : `R$ ${cardResult.product.value.toFixed(2)}`
                    }
                  </p>
                </div>
                {cardResult.approved && (
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                )}
              </div>

              <div className="py-6">
                <h4 className="text-white font-semibold mb-4">Próximos passos:</h4>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 text-sm font-bold">1</span>
                    <span className="text-white/70 text-sm">Você receberá um email de confirmação em breve</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 text-sm font-bold">2</span>
                    <span className="text-white/70 text-sm">Entraremos em contato pelo WhatsApp para alinhar os próximos passos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 text-sm font-bold">3</span>
                    <span className="text-white/70 text-sm">Iniciaremos o desenvolvimento do seu site</span>
                  </li>
                </ol>
              </div>

              <button
                onClick={() => navigate('/site/lauren-odontologia')}
                className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-400 hover:to-violet-400 transition-all"
              >
                Voltar para a Página Inicial
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render PIX QR Code screen
  if (pixData) {
    return (
      <div className="min-h-screen relative bg-slate-950">
        <GlassBackground />
        
        <main className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-all"
            >
              <ArrowLeft size={20} />
              <span>Voltar ao formulário</span>
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-4">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">PIX Gerado com Sucesso</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Realize o Pagamento
              </h1>
              <p className="text-white/60">
                Escaneie o QR Code ou copie o código PIX
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800/80 flex items-center justify-center">
                  <img 
                    src={product.logo} 
                    alt="Logo Lauren Rossarola"
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '<span class="text-white font-bold text-xl">LR</span>';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{pixData.product.name}</h3>
                  <p className="text-white/60 text-sm">{pixData.product.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-2xl font-bold">
                    R$ {pixData.product.value.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="py-8 flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
                  <img 
                    src={`data:image/png;base64,${pixData.qrCode.image}`} 
                    alt="QR Code PIX"
                    className="w-56 h-56 sm:w-64 sm:h-64"
                  />
                </div>

                <div className="flex items-center gap-2 text-amber-400 mb-6">
                  <Clock size={18} />
                  <span className="text-sm">
                    Válido até: {new Date(pixData.qrCode.expirationDate).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="w-full max-w-md">
                  <p className="text-white/60 text-sm text-center mb-3">
                    Ou copie o código PIX Copia e Cola:
                  </p>
                  <button
                    onClick={handleCopyPixCode}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                      copiedCode
                        ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {copiedCode ? (
                      <>
                        <Check size={20} />
                        Código Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={20} />
                        Copiar Código PIX
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <QrCode size={18} className="text-green-400" />
                  Como pagar:
                </h4>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 text-sm font-bold">1</span>
                    <span className="text-white/70 text-sm">Abra o app do seu banco ou carteira digital</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 text-sm font-bold">2</span>
                    <span className="text-white/70 text-sm">Escolha pagar via PIX e escaneie o QR Code ou cole o código</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 text-sm font-bold">3</span>
                    <span className="text-white/70 text-sm">Confirme o pagamento e pronto!</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render checkout form
  return (
    <div className="min-h-screen relative bg-slate-950">
      <GlassBackground />
      
      <main className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleGoBack}
            className={`flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-all duration-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <ArrowLeft size={20} />
            <span>Voltar para a página do produto</span>
          </button>

          <div className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-4">
              <Lock size={16} className="text-green-400" />
              <span className="text-green-400 text-sm font-medium">Ambiente 100% Seguro</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Finalizar Compra
            </h1>
            <p className="text-white/60">
              <span className="hidden lg:inline">Complete seus dados para prosseguir com o pagamento</span>
              <span className="lg:hidden">
                Complete seus dados para prosseguir<br />
                com o pagamento
              </span>
            </p>
          </div>

          {/* Mobile Order Summary - Visível apenas em telas menores que lg */}
          <div className={`lg:hidden mb-6 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Summary Header - Always visible */}
              <button
                onClick={() => setShowMobileSummary(!showMobileSummary)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800/90 flex items-center justify-center">
                    <img 
                      src={product.logo} 
                      alt="Logo"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<span class="text-white font-bold text-sm">LR</span>';
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                    <p className="text-green-400 font-bold text-lg">R$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-xs">
                    {showMobileSummary ? 'Ocultar' : 'Ver detalhes'}
                  </span>
                  {showMobileSummary ? (
                    <ChevronUp size={20} className="text-white/50" />
                  ) : (
                    <ChevronDown size={20} className="text-white/50" />
                  )}
                </div>
              </button>
              
              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-300 ${
                showMobileSummary ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Preço original:</span>
                      <span className="text-white/50 line-through">R$ {product.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Desconto:</span>
                      <span className="text-red-400">-44%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-white">Total:</span>
                      <span className="text-green-400">R$ {product.price.toFixed(2)}</span>
                    </div>
                    <div className="text-center text-white/40 text-xs pt-2">
                      ou {product.maxInstallments}x de R$ {(product.price / product.maxInstallments).toFixed(2)} sem juros
                    </div>
                  </div>
                  
                  {/* Compact Features */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs mb-2">Inclui:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Site completo', 'Painel Admin', 'SEO', 'Responsivo', 'Garantia de 30 dias', 'Suporte'].map((item, i) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px]">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bonus Badge */}
                  <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Gift size={14} className="text-amber-400" />
                      <span className="text-amber-400 text-xs font-semibold">BÔNUS: Hospedagem Vitalícia Grátis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className={`space-y-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Customer Data Form */}
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <User size={20} className="text-[#D4A574]" />
                  Dados do Comprador
                  {isBasicFormValid && (
                    <CheckCircle size={18} className="text-green-400 ml-auto" />
                  )}
                </h2>
                
                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Nome completo</label>
                    <div className="relative">
                      <User size={18} className={getIconClassName('name')} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Seu nome completo"
                        className={getInputClassName('name')}
                      />
                      {formData.name.length > 0 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {fieldValidation.name ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : formErrors.name ? (
                            <AlertCircle size={16} className="text-red-400" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {formErrors.name && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail size={18} className={getIconClassName('email')} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        inputMode="email"
                        className={getInputClassName('email')}
                      />
                      {formData.email.length > 0 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {fieldValidation.email ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : formErrors.email ? (
                            <AlertCircle size={16} className="text-red-400" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {formErrors.email && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* CPF/CNPJ and Phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">CPF ou CNPJ</label>
                      <div className="relative">
                        <FileText size={18} className={getIconClassName('cpfCnpj')} />
                        <input
                          type="text"
                          value={formData.cpfCnpj}
                          onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                          placeholder="000.000.000-00"
                          maxLength={18}
                          inputMode="numeric"
                          className={getInputClassName('cpfCnpj')}
                        />
                        {formData.cpfCnpj.length > 0 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {fieldValidation.cpfCnpj ? (
                              <CheckCircle size={16} className="text-green-400" />
                            ) : formErrors.cpfCnpj ? (
                              <AlertCircle size={16} className="text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {formErrors.cpfCnpj && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.cpfCnpj}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-2">Telefone</label>
                      <div className="relative">
                        <Phone size={18} className={getIconClassName('phone')} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          inputMode="tel"
                          className={getInputClassName('phone')}
                        />
                        {formData.phone.length > 0 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {fieldValidation.phone ? (
                              <CheckCircle size={16} className="text-green-400" />
                            ) : formErrors.phone ? (
                              <AlertCircle size={16} className="text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {formErrors.phone && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-[#D4A574]" />
                  Forma de Pagamento
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* PIX Option */}
                  <button
                    onClick={() => setSelectedPayment('pix')}
                    className={`group relative overflow-hidden p-4 rounded-xl border transition-all duration-300 ${
                      selectedPayment === 'pix'
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedPayment === 'pix' ? 'bg-green-500/30' : 'bg-white/10'
                      }`}>
                        <QrCode size={24} className={selectedPayment === 'pix' ? 'text-green-400' : 'text-white/70'} />
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${selectedPayment === 'pix' ? 'text-green-400' : 'text-white'}`}>
                          PIX
                        </p>
                        <p className="text-white/50 text-xs">Aprovação instantânea</p>
                      </div>
                    </div>
                    {selectedPayment === 'pix' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle size={18} className="text-green-400" />
                      </div>
                    )}
                  </button>

                  {/* Credit Card Option */}
                  <button
                    onClick={() => setSelectedPayment('credit_card')}
                    className={`group relative overflow-hidden p-4 rounded-xl border transition-all duration-300 ${
                      selectedPayment === 'credit_card'
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedPayment === 'credit_card' ? 'bg-purple-500/30' : 'bg-white/10'
                      }`}>
                        <CreditCard size={24} className={selectedPayment === 'credit_card' ? 'text-purple-400' : 'text-white/70'} />
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${selectedPayment === 'credit_card' ? 'text-purple-400' : 'text-white'}`}>
                          Cartão
                        </p>
                        <p className="text-white/50 text-xs">Até 12x sem juros</p>
                      </div>
                    </div>
                    {selectedPayment === 'credit_card' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle size={18} className="text-purple-400" />
                      </div>
                    )}
                  </button>
                </div>

                {/* PIX Info */}
                {selectedPayment === 'pix' && (
                  <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-green-300 text-sm text-center">
                      Pague à vista por <strong>R$ {product.price.toFixed(2)}</strong> via PIX
                      <br />
                      <span className="text-xs text-green-400/70">QR Code gerado na hora • Aprovação instantânea</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Credit Card Form */}
              {selectedPayment === 'credit_card' && (
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 animate-in slide-in-from-top-4 duration-300">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-purple-400" />
                    Dados do Cartão
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Número do cartão</label>
                      <div className="relative">
                        <CreditCard size={18} className={getIconClassName('cardNumber')} />
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          inputMode="numeric"
                          className={getInputClassName('cardNumber')}
                        />
                        {formData.cardNumber.length > 0 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {fieldValidation.cardNumber ? (
                              <CheckCircle size={16} className="text-green-400" />
                            ) : formErrors.cardNumber ? (
                              <AlertCircle size={16} className="text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {formErrors.cardNumber && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    {/* Card Holder */}
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Nome impresso no cartão</label>
                      <div className="relative">
                        <User size={18} className={getIconClassName('cardHolder')} />
                        <input
                          type="text"
                          value={formData.cardHolder}
                          onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                          placeholder="NOME COMO ESTÁ NO CARTÃO"
                          className={`${getInputClassName('cardHolder')} uppercase`}
                        />
                        {formData.cardHolder.length > 0 && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {fieldValidation.cardHolder ? (
                              <CheckCircle size={16} className="text-green-400" />
                            ) : formErrors.cardHolder ? (
                              <AlertCircle size={16} className="text-red-400" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      {formErrors.cardHolder && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.cardHolder}
                        </p>
                      )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Validade</label>
                        <div className="relative">
                          <Calendar size={18} className={getIconClassName('cardExpiry')} />
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                            placeholder="MM/AA"
                            maxLength={5}
                            inputMode="numeric"
                            className={getInputClassName('cardExpiry')}
                          />
                          {formData.cardExpiry.length > 0 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {fieldValidation.cardExpiry ? (
                                <CheckCircle size={16} className="text-green-400" />
                              ) : formErrors.cardExpiry ? (
                                <AlertCircle size={16} className="text-red-400" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {formErrors.cardExpiry && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {formErrors.cardExpiry}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">CVV</label>
                        <div className="relative">
                          <Lock size={18} className={getIconClassName('cardCvv')} />
                          <input
                            type="text"
                            value={formData.cardCvv}
                            onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            inputMode="numeric"
                            className={getInputClassName('cardCvv')}
                          />
                          {formData.cardCvv.length > 0 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {fieldValidation.cardCvv ? (
                                <CheckCircle size={16} className="text-green-400" />
                              ) : formErrors.cardCvv ? (
                                <AlertCircle size={16} className="text-red-400" />
                              ) : null}
                            </div>
                          )}
                        </div>
                        {formErrors.cardCvv && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} />
                            {formErrors.cardCvv}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address for card */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/50 text-xs mb-4">Endereço de cobrança (obrigatório para cartão)</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-white/70 text-sm mb-2">CEP</label>
                          <div className="relative">
                            <MapPin size={18} className={getIconClassName('postalCode')} />
                            <input
                              type="text"
                              value={formData.postalCode}
                              onChange={(e) => handleInputChange('postalCode', e.target.value)}
                              placeholder="00000-000"
                              maxLength={9}
                              inputMode="numeric"
                              className={getInputClassName('postalCode')}
                            />
                            {formData.postalCode.length > 0 && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {fieldValidation.postalCode ? (
                                  <CheckCircle size={16} className="text-green-400" />
                                ) : formErrors.postalCode ? (
                                  <AlertCircle size={16} className="text-red-400" />
                                ) : null}
                              </div>
                            )}
                          </div>
                          {formErrors.postalCode && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {formErrors.postalCode}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-white/70 text-sm mb-2">Nº</label>
                          <div className="relative">
                            <Hash size={18} className={getIconClassName('addressNumber')} />
                            <input
                              type="text"
                              value={formData.addressNumber}
                              onChange={(e) => handleInputChange('addressNumber', e.target.value)}
                              placeholder="123"
                              inputMode="numeric"
                              className={getInputClassName('addressNumber')}
                            />
                          </div>
                          {formErrors.addressNumber && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {formErrors.addressNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Installments - Select */}
                    <div className="pt-4">
                      <label className="block text-white/70 text-sm mb-2">Parcelamento</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
                      >
                        {installmentOptions.map((opt) => (
                          <option key={opt.count} value={opt.count} className="bg-slate-900">
                            {opt.count}x de R$ {opt.value.toFixed(2)} sem juros
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading || !selectedPayment}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isLoading || !selectedPayment
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : selectedPayment === 'pix'
                      ? `bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:scale-[1.02] ${canCheckout ? 'animate-pulse' : ''}`
                      : `bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-400 hover:to-violet-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] ${canCheckout ? 'animate-pulse' : ''}`
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    {selectedPayment === 'pix' ? 'Gerando PIX...' : 'Processando pagamento...'}
                  </>
                ) : (
                  <>
                    {selectedPayment === 'pix' ? <QrCode size={20} /> : <Lock size={20} />}
                    {selectedPayment === 'pix' ? 'Gerar PIX Agora' : 'Pagar com Cartão'}
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Shield size={14} />
                  <span>Pagamento Seguro</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Lock size={14} />
                  <span>Dados Criptografados</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Award size={14} />
                  <span>Garantia 30 dias</span>
                </div>
              </div>

              {/* Asaas Payment Badge */}
              <div className="p-4 rounded-xl bg-[#0023FF]/10 border border-[#0023FF]/30">
                <div className="flex items-center justify-center gap-4">
                  <img 
                    src="/Images/logos/logo-asaas-azul-.png" 
                    alt="Asaas - Pagamento Seguro"
                    className="h-10 object-contain"
                  />
                  <div className="h-10 w-px bg-white/20" />
                  <div className="flex flex-col">
                    <span className="text-white/80 text-sm font-medium">Pagamento seguro e transparente</span>
                    <div className="text-white/50 text-xs">
                      <span className="hidden lg:inline">Processado via Asaas • Checkout Transparente</span>
                      <div className="lg:hidden flex flex-col">
                        <span>Processado via Asaas •</span>
                        <span>Checkout Transparente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="sticky top-8 space-y-6">
                {/* Product Summary Card */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
                  {/* Full width background image */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <img 
                      src={product.image} 
                      alt="Preview do Site Lauren Rossarola"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay gradients for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
                    
                    {/* Product Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
                          <img 
                            src={product.logo} 
                            alt="Logo Lauren Rossarola"
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = '<span class="text-white font-bold text-lg">LR</span>';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg drop-shadow-lg">{product.name}</h3>
                          <p className="text-white/90 text-sm drop-shadow-md">{product.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-white/50 text-lg line-through">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                          -44%
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-green-400">
                        R$ {product.price.toFixed(2)}
                      </div>
                      <p className="text-white/50 text-sm mt-1">
                        ou {product.maxInstallments}x de R$ {(product.price / product.maxInstallments).toFixed(2)} sem juros
                      </p>
                    </div>

                    <div className="h-px bg-white/10 my-6" />

                    <div className="space-y-3">
                      <h4 className="text-white/70 text-sm font-medium mb-3">O que está incluso:</h4>
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={12} className="text-green-400" />
                          </div>
                          <span className="text-white/70 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Gift size={18} />
                        <span className="font-semibold text-sm">BÔNUS EXCLUSIVO</span>
                      </div>
                      <p className="text-amber-300/80 text-xs mt-1">
                        Hospedagem Vitalícia Grátis (Zero Mensalidade)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guarantee Badge */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                      <Shield size={24} className="text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Garantia de 30 Dias</h4>
                      <p className="text-white/60 text-sm">
                        Se você não ficar satisfeito, devolvemos 100% do seu dinheiro.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Monitor size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Leonardo Lopes</h4>
                      <p className="text-white/60 text-sm">UX/UI Designer & Developer</p>
                      <p className="text-[#D4A574] text-xs mt-1">+150 sites entregues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutLauren;
