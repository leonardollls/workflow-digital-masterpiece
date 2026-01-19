import { useTheme } from 'next-themes';
import { MessageCircle, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WorkflowFooterProps {
  hideContact?: boolean;
}

const WorkflowFooter = ({ hideContact = false }: WorkflowFooterProps) => {
  const currentYear = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const handlePrivacyClick = () => {
    window.location.href = '/politica-de-privacidade';
  };

  const handleTermsClick = () => {
    window.location.href = '/termos-de-uso';
  };

  return (
    <footer className={`py-8 relative z-10 transition-colors duration-500 ${
      isDark 
        ? 'bg-workflow-deep text-white' 
        : 'bg-slate-100 text-slate-800 border-t border-purple-100'
    }`}>
      <div className="container mx-auto px-6">
        {/* Simple Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className={`text-sm text-center md:text-left transition-colors duration-300 ${
            isDark ? 'text-white/60' : 'text-slate-500'
          }`}>
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
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isDark 
                      ? 'text-white/60 hover:text-green-400' 
                      : 'text-slate-500 hover:text-green-600'
                  }`}
                  title="WhatsApp"
                >
                  <MessageCircle size={18} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a
                  href="mailto:contato@leonardolopes.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isDark 
                      ? 'text-white/60 hover:text-purple-400' 
                      : 'text-slate-500 hover:text-purple-600'
                  }`}
                  title="Email"
                >
                  <Mail size={18} />
                  <span className="hidden sm:inline">Email</span>
                </a>
              </div>
            )}
            
            {/* Simple Links */}
            <div className={`flex items-center gap-6 text-sm ${
              isDark ? 'text-white/60' : 'text-slate-500'
            }`}>
              <button
                onClick={handlePrivacyClick}
                className={`transition-colors cursor-pointer bg-transparent border-none text-sm hover:underline ${
                  isDark 
                    ? 'text-white/60 hover:text-workflow-zen' 
                    : 'text-slate-500 hover:text-purple-600'
                }`}
                type="button"
              >
                Privacidade
              </button>
              <button
                onClick={handleTermsClick}
                className={`transition-colors cursor-pointer bg-transparent border-none text-sm hover:underline ${
                  isDark 
                    ? 'text-white/60 hover:text-workflow-zen' 
                    : 'text-slate-500 hover:text-purple-600'
                }`}
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
