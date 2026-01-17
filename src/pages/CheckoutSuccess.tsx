import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlassBackground } from '@/components/portfolio-v2';
import { 
  CheckCircle, PartyPopper, Mail, MessageCircle, 
  ArrowRight, Sparkles, Gift, Clock, Shield
} from 'lucide-react';
import Confetti from 'react-confetti';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Get payment info from URL params (if available)
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Stop confetti after 5 seconds
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  // Window size for confetti
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Set dark background
  useEffect(() => {
    document.body.style.backgroundColor = '#020617';
    document.documentElement.style.backgroundColor = '#020617';
    document.title = 'Pagamento Confirmado! | Leonardo Lopes';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá Leonardo! Acabei de realizar o pagamento do site Lauren Rossarola.${paymentId ? ` ID: ${paymentId}` : ''}\n\nQuando podemos começar?`
    );
    window.open(`https://wa.me/555199437916?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen relative bg-slate-950 overflow-hidden">
      <GlassBackground />
      
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#D4A574', '#E8C9A9', '#22c55e', '#a855f7', '#3b82f6']}
        />
      )}
      
      <main className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className={`mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <div className="relative inline-block">
              {/* Glow effect */}
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-green-500/30 blur-xl animate-pulse" />
              
              {/* Main icon */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)]">
                <CheckCircle size={64} className="text-white" />
              </div>
              
              {/* Party icon */}
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
                <PartyPopper size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className={`mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Pagamento <span className="text-green-400">Confirmado!</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md mx-auto">
              Parabéns! Seu pagamento foi processado com sucesso. Estamos muito felizes em ter você conosco.
            </p>
          </div>

          {/* Info Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Email Card */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Verifique seu Email</h3>
              <p className="text-white/60 text-sm">
                Você receberá um email com a confirmação e detalhes do pagamento.
              </p>
            </div>

            {/* Timeline Card */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Próximos Passos</h3>
              <p className="text-white/60 text-sm">
                Em até 48h seu site estará pronto e no ar com todas as personalizações.
              </p>
            </div>
          </div>

          {/* What's Included Reminder */}
          <div className={`rounded-2xl bg-gradient-to-br from-[#D4A574]/10 to-[#E8C9A9]/10 border border-[#D4A574]/20 p-6 mb-8 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift size={20} className="text-[#D4A574]" />
              <h3 className="text-[#D4A574] font-semibold">O que você adquiriu:</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Site Completo',
                'Painel Admin',
                'SEO Otimizado',
                'Hospedagem Vitalícia',
                'Suporte Técnico',
                'Garantia 30 dias'
              ].map((item, index) => (
                <div 
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm flex items-center gap-2"
                >
                  <CheckCircle size={14} className="text-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`space-y-4 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-lg transition-all duration-300 hover:from-green-400 hover:to-emerald-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105"
            >
              <MessageCircle size={22} />
              Falar com Leonardo no WhatsApp
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Back to Sales Page */}
            <button
              onClick={() => navigate('/site/lauren-odontologia')}
              className="block w-full sm:w-auto mx-auto text-white/50 hover:text-white text-sm transition-colors"
            >
              Voltar para a página do produto
            </button>
          </div>

          {/* Guarantee Badge */}
          <div className={`mt-12 flex items-center justify-center gap-3 text-white/40 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Shield size={16} />
            <span className="text-sm">
              Lembre-se: você tem 30 dias de garantia total
            </span>
          </div>

          {/* Payment Reference (if available) */}
          {(paymentId || externalReference) && (
            <div className={`mt-8 p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <p className="text-white/40 text-xs">
                Referência do pagamento: {paymentId || externalReference}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess;
