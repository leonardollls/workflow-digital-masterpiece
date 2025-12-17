import { useState, useEffect, useCallback } from 'react';
import { Smartphone, Scan, ExternalLink, CheckCircle, RefreshCw } from 'lucide-react';

interface QRCodePreviewProps {
  url: string;
}

const QRCodePreview = ({ url }: QRCodePreviewProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Gerar QR Code usando API alternativa (QR Server API - gratuita e confiável)
  const generateQRCode = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Usar QR Server API (mais confiável que Google Charts)
    const encodedUrl = encodeURIComponent(url);
    const size = 150;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&format=svg&qzone=1&margin=0`;
    
    setQrCodeUrl(qrApiUrl);
    setIsLoading(false);
  }, [url]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  // Animação de scanning periódica
  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const displayUrl = url.replace('https://', '').substring(0, 25);

  return (
    <div className="relative flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group h-full">
      {/* Icon header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Smartphone size={20} className="text-[#D4A574]" />
        <span className="text-white font-medium text-sm">Visualizar no Celular</span>
      </div>

      {/* QR Code Container */}
      <div className="relative p-4 bg-white rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
        {/* Loading state */}
        {isLoading && (
          <div className="w-[120px] h-[120px] flex items-center justify-center">
            <RefreshCw size={24} className="text-gray-400 animate-spin" />
          </div>
        )}

        {/* Error state */}
        {hasError && !isLoading && (
          <div className="w-[120px] h-[120px] flex flex-col items-center justify-center gap-2">
            <span className="text-gray-400 text-xs text-center">Erro ao carregar</span>
            <button
              onClick={generateQRCode}
              className="text-[#D4A574] text-xs underline hover:no-underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* QR Code Image */}
        {qrCodeUrl && !hasError && (
          <img 
            src={qrCodeUrl}
            alt="QR Code para acessar o site"
            className={`w-[120px] h-[120px] transition-opacity duration-300 ${isLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}

        {/* Scan animation overlay */}
        {!isLoading && !hasError && (
          <div className="absolute inset-4 overflow-hidden rounded-lg pointer-events-none">
            <div 
              className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4A574] to-transparent transition-all duration-1000 ${
                isScanning ? 'opacity-80' : 'opacity-0'
              }`}
              style={{
                animation: isScanning ? 'scanLine 2s ease-in-out' : 'none',
              }}
            />
          </div>
        )}

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[#D4A574] rounded-tl opacity-60" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[#D4A574] rounded-tr opacity-60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[#D4A574] rounded-bl opacity-60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[#D4A574] rounded-br opacity-60" />
      </div>

      {/* Instructions */}
      <div className="mt-4 flex items-center gap-2 text-white/60 flex-shrink-0">
        <Scan size={16} className={`transition-colors ${isScanning ? 'text-[#D4A574]' : ''}`} />
        <span className="text-xs">Escaneie com a câmera</span>
      </div>

      {/* URL preview with link and copy */}
      <div className="mt-2 flex items-center gap-2 flex-shrink-0">
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 max-w-full overflow-hidden group/link"
        >
          <span className="text-white/40 text-xs truncate group-hover/link:text-white/60 transition-colors">
            {displayUrl}...
          </span>
          <ExternalLink size={12} className="text-white/40 group-hover/link:text-white/60 flex-shrink-0" />
        </a>
        
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors relative"
          title="Copiar link"
        >
          {showCopied ? (
            <CheckCircle size={14} className="text-green-400" />
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white/40 hover:text-white/60"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-[#D4A574]/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl rounded-2xl transition-opacity duration-300 -z-10" />

      {/* Keyframe animation */}
      <style>{`
        @keyframes scanLine {
          0% {
            top: 0;
          }
          50% {
            top: calc(100% - 4px);
          }
          100% {
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default QRCodePreview;
