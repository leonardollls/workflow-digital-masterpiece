import { MessageCircle, Mail } from 'lucide-react';

interface WorkflowFooterProps {
  hideContact?: boolean;
}

const WorkflowFooter = ({ hideContact = false }: WorkflowFooterProps) => {
  const currentYear = new Date().getFullYear();

  const handlePrivacyClick = () => {
    window.location.href = '/politica-de-privacidade';
  };

  const handleTermsClick = () => {
    window.location.href = '/termos-de-uso';
  };

  return (
    <footer className="bg-workflow-deep text-white py-8 relative z-10">
      <div className="container mx-auto px-6">
        {/* Simple Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-white/60 text-sm text-center md:text-left">
            <span className="block md:inline">Dev. Leonardo Lopes © {currentYear}</span>
            <span className="hidden md:inline"> </span>
            <span className="block md:inline">Todos os direitos reservados.</span>
          </div>
          
          {/* Links and Contact */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Contact Links - Ocultos se hideContact for true */}
            {!hideContact && (
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/555199437916"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-green-400 transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle size={18} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                  href="mailto:contato@leonardolopes.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-purple-400 transition-colors"
                  title="Email"
                >
                  <Mail size={18} />
                  <span className="hidden sm:inline">Email</span>
                </a>
              </div>
            )}
            
            {/* Simple Links */}
            <div className="flex items-center gap-6 text-sm text-white/60">
              <button
                onClick={handlePrivacyClick}
                className="hover:text-workflow-zen transition-colors cursor-pointer bg-transparent border-none text-sm text-white/60 hover:underline"
                type="button"
              >
                Privacidade
              </button>
              <button
                onClick={handleTermsClick}
                className="hover:text-workflow-zen transition-colors cursor-pointer bg-transparent border-none text-sm text-white/60 hover:underline"
                type="button"
              >
                Termos
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WorkflowFooter;
