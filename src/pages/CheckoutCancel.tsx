import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassBackground } from '@/components/portfolio-v2';
import { 
  XCircle, ArrowLeft, MessageCircle, HelpCircle,
  RefreshCw, Shield, Clock
} from 'lucide-react';

const CheckoutCancel = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Set dark background
  useEffect(() => {
    document.body.style.backgroundColor = '#020617';
    document.documentElement.style.backgroundColor = '#020617';
    document.title = 'Pagamento Cancelado | Leonardo Lopes';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      'Olá Leonardo! Tive um problema ao tentar finalizar a compra do site Lauren Rossarola. Pode me ajudar?'
    );
    window.open(`https://wa.me/555199437916?text=${message}`, '_blank');
  };

  const handleTryAgain = () => {
    navigate('/checkout/lauren');
  };

  const handleBackToSales = () => {
    navigate('/site/lauren-odontologia');
  };

  return (
    <div className="min-h-screen relative bg-slate-950">
      <GlassBackground />
      
      <main className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className={`mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            <div className="relative inline-block">
              {/* Glow effect */}
              <div className="absolute inset-0 w-28 h-28 rounded-full bg-amber-500/20 blur-xl" />
              
              {/* Main icon */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                <XCircle size={56} className="text-amber-400" />
              </div>
            </div>
          </div>

          {/* Cancel Message */}
          <div className={`mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Pagamento <span className="text-amber-400">Não Concluído</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md mx-auto">
              Parece que o pagamento foi cancelado ou não foi finalizado. Não se preocupe, você pode tentar novamente.
            </p>
          </div>

          {/* Reasons Card */}
          <div className={`rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 mb-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle size={20} className="text-white/60" />
              <h3 className="text-white font-semibold">Possíveis razões:</h3>
            </div>
            <div className="space-y-3 text-left max-w-md mx-auto">
              {[
                'O pagamento foi cancelado voluntariamente',
                'A sessão de checkout expirou',
                'Houve um problema técnico durante o processo',
                'Os dados do cartão não foram aceitos'
              ].map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400/50 mt-2 flex-shrink-0" />
                  <p className="text-white/60 text-sm">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* No Charge Card */}
            <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-green-400" />
              </div>
              <h3 className="text-green-400 font-semibold mb-2">Sem Cobrança</h3>
              <p className="text-white/60 text-sm">
                Nenhum valor foi cobrado. Seu cartão ou conta estão seguros.
              </p>
            </div>

            {/* Offer Still Valid */}
            <div className="rounded-2xl bg-purple-500/10 border border-purple-500/20 p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-purple-400" />
              </div>
              <h3 className="text-purple-400 font-semibold mb-2">Oferta Válida</h3>
              <p className="text-white/60 text-sm">
                A oferta especial ainda está disponível. Aproveite!
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`space-y-4 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Try Again Button */}
            <button
              onClick={handleTryAgain}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-lg transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-105"
            >
              <RefreshCw size={22} />
              Tentar Novamente
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              <MessageCircle size={20} />
              Preciso de Ajuda
            </button>

            {/* Back to Sales Page */}
            <button
              onClick={handleBackToSales}
              className="flex items-center justify-center gap-2 mx-auto text-white/50 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para a página do produto
            </button>
          </div>

          {/* Support Message */}
          <div className={`mt-12 p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-700 delay-600 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-white/50 text-sm">
              Está com dificuldades? Entre em contato pelo WhatsApp que ajudo você a finalizar a compra.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutCancel;
