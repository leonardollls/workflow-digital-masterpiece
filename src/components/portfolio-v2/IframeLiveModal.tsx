import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ExternalLink, Monitor, Tablet, Smartphone, RefreshCw, Shield, AlertTriangle, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail_url?: string | null;
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface IframeLiveModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

// Supabase Edge Function proxy config
const SUPABASE_URL = 'https://wbtyimthsgdsftgwezop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidHlpbXRoc2dkc2Z0Z3dlem9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjczOTksImV4cCI6MjA3NzU0MzM5OX0.NwG03rbXrRxA8iWWLo9_SxNHcWm6PsKPcYNqs6jc_CQ';
const PROXY_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/iframe-proxy`;

// Sites que precisam passar pelo proxy (bloqueiam X-Frame-Options ou tem CORS issues)
const SITES_REQUIRING_PROXY = [
  'liviarosaadvocacia.com.br',
  'reidocreditoficial.com.br',
  'sandrasouzaacademy.com',
  'dxlub.com',
  'conexaai.com.br',
  'bidixpay.com.br',
  'horadosonocolchoes.com.br',
  'jamesprodutor.com.br',
  'maieradvocacia.com.br',
  'mraadvogadosassociados.com.br', // Envia postMessage com reload:yes causando loop
  'suacasatechome.com.br', // PixelYourSite plugin causa reload infinito em iframes
  'semiglobe.com.br', // Fontes em dominio diferente (agenciareally.com.br) causam CORS + Lenis scroll lib
  'promptizi.com.br', // Site Framer com erros de hidratacao React + n8n webhook CORS
  'hazaempreendimentos.com.br', // WordPress/Elementor com UE Slider e erros cross-origin
  'gynfood.vercel.app', // Vercel default X-Frame-Options DENY bloqueia iframe embedding
];

// Sites que nao podem ser exibidos de forma alguma
const COMPLETELY_BLOCKED_SITES = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'linkedin.com',
];

const IframeLiveModal = ({ project, isOpen, onClose }: IframeLiveModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isUsingProxy, setIsUsingProxy] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Verifica se o site precisa de proxy
  const needsProxy = useCallback((url: string): boolean => {
    try {
      const hostname = new URL(url).hostname;
      return SITES_REQUIRING_PROXY.some(site => hostname.includes(site));
    } catch {
      return false;
    }
  }, []);

  // Verifica se o site e completamente bloqueado
  const isCompletelyBlocked = useCallback((url: string): boolean => {
    try {
      const hostname = new URL(url).hostname;
      return COMPLETELY_BLOCKED_SITES.some(blocked => hostname.includes(blocked));
    } catch {
      return false;
    }
  }, []);

  // Carrega conteudo via proxy com fallback de fontes
  const loadViaProxy = useCallback(async (targetUrl: string) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage('');
      
      const proxyUrl = `${PROXY_FUNCTION_URL}?url=${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      let html = await response.text();
      
      // Adiciona estilos extras para garantir fallback de fontes
      const extraStyles = `
<style>
/* Fallback fonts - Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Tenor+Sans&display=swap');

/* Force system fonts as ultimate fallback */
* {
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Tenor Sans', 'Montserrat', Georgia, serif !important;
}

/* Hide broken images from blocked resources */
img[src*="liviarosaadvocacia"]:not([src*="data:"]) {
  min-height: 100px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}
</style>
`;
      
      // Injeta os estilos extras no head
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${extraStyles}</head>`);
      } else {
        html = extraStyles + html;
      }
      
      // Cria blob URL para o conteudo HTML
      const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
      const newUrl = URL.createObjectURL(blob);
      
      // Limpa URL anterior se existir usando ref para evitar dependência
      setBlobUrl(prevUrl => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return newUrl;
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar via proxy:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
      setIsLoading(false);
    }
  }, []); // Sem dependências para evitar loop infinito

  const handleClose = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    setDevice('desktop');
    setIsUsingProxy(false);
    
    // Limpa blob URL
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    onClose();
  }, [onClose, blobUrl]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Listener para mensagens do iframe (navegacao via proxy)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ignora mensagens de reload que alguns sites enviam (causa loop infinito)
      if (event.data?.reload === 'yes' || event.data?.type === 'reload') {
        console.log('Ignorando mensagem de reload do iframe');
        return;
      }
      
      if (event.data?.type === 'proxy-navigate' && event.data?.url && project) {
        // Navega para nova URL via proxy
        loadViaProxy(event.data.url);
      } else if (event.data?.type === 'proxy-loaded') {
        // Iframe carregou com sucesso
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [project, loadViaProxy]);

  // Carrega conteudo quando projeto muda
  useEffect(() => {
    if (project && isOpen) {
      // Verifica se o site e completamente bloqueado
      if (isCompletelyBlocked(project.url)) {
        setHasError(true);
        setErrorMessage('Este site não permite visualização incorporada.');
        setIsLoading(false);
        return;
      }

      // Verifica se precisa de proxy
      const usesProxy = needsProxy(project.url);
      setIsUsingProxy(usesProxy);
      
      if (usesProxy) {
        loadViaProxy(project.url);
      } else {
        // Carrega diretamente no iframe
        setBlobUrl(null);
        setIsLoading(true);
        
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        
        loadTimeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 10000);
      }
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [project?.id, project?.url, isOpen, needsProxy, isCompletelyBlocked, loadViaProxy]);

  // Cleanup blob URL quando componente desmonta
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleIframeLoad = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsLoading(false);
  };

  const handleIframeError = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Não foi possível carregar o site.');
  };

  const handleRefresh = () => {
    if (!project) return;
    
    if (isUsingProxy) {
      loadViaProxy(project.url);
    } else {
      setIsLoading(true);
      setHasError(false);
      
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      
      loadTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 10000);
      
      // Force iframe refresh
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = '';
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc;
          }
        }, 100);
      }
    }
  };

  const handleOpenInNewTab = () => {
    if (project) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getDeviceWidth = (): string => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-[1440px]';
    }
  };

  // URL para o iframe - Quando usa proxy, so usa blobUrl (evita tentativa de carregar URL direta)
  const iframeSrc = isUsingProxy ? (blobUrl || '') : (project?.url || '');

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full h-full max-h-[95vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/5 backdrop-blur-xl border-b border-white/10 rounded-t-2xl">
          {/* Left side - Project info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">{project.title.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <h2 id="modal-title" className="text-white font-semibold truncate">
                {project.title}
              </h2>
              <p className="text-white/50 text-xs truncate">{project.url}</p>
            </div>
          </div>

          {/* Center - Device selector (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                device === 'desktop' 
                  ? 'bg-purple-500/30 text-purple-300' 
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Visualizar em desktop"
              title="Desktop"
            >
              <Monitor size={18} />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                device === 'tablet' 
                  ? 'bg-purple-500/30 text-purple-300' 
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Visualizar em tablet"
              title="Tablet"
            >
              <Tablet size={18} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                device === 'mobile' 
                  ? 'bg-purple-500/30 text-purple-300' 
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Visualizar em mobile"
              title="Mobile"
            >
              <Smartphone size={18} />
            </button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Recarregar página"
              title="Recarregar"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Abrir em nova aba"
              title="Abrir em nova aba"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-red-500/20 transition-all duration-200"
              aria-label="Fechar modal"
              title="Fechar (ESC)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 bg-slate-900 flex items-center justify-center overflow-hidden rounded-b-2xl">
          <div 
            className={`relative w-full h-full ${getDeviceWidth()} transition-all duration-500 ease-out mx-auto`}
            style={{
              boxShadow: device !== 'desktop' ? '0 0 60px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {/* Loading state */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-violet-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                </div>
                <p className="mt-4 text-white/50 text-sm">
                  {isUsingProxy ? 'Carregando via proxy seguro...' : `Carregando ${project.title}...`}
                </p>
                {isUsingProxy && (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <p className="text-white/30 text-xs">
                      Processando conteúdo e aplicando correções
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                      <Loader2 size={12} className="text-green-400 animate-spin" />
                      <span className="text-green-400 text-xs font-medium">Proxy Ativo</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error state */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-10 p-8">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
                    <AlertTriangle size={32} className="text-amber-400" />
                  </div>
                  
                  <h3 className="text-white font-semibold text-xl mb-3">
                    Não foi possível carregar
                  </h3>
                  
                  <p className="text-white/60 text-sm leading-relaxed mb-2">
                    {errorMessage || 'Ocorreu um erro ao carregar o site.'}
                  </p>
                  
                  <p className="text-white/40 text-xs mb-6">
                    Tente abrir o site em uma nova aba.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleOpenInNewTab}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium hover:from-purple-500 hover:to-violet-500 transition-all duration-200"
                    >
                      <ExternalLink size={18} />
                      Abrir em nova aba
                    </button>
                    <button
                      onClick={handleRefresh}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-200"
                    >
                      <RefreshCw size={16} />
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Iframe - Nao renderiza enquanto proxy esta carregando para evitar erro X-Frame-Options */}
            {!hasError && iframeSrc && !(isUsingProxy && !blobUrl) && (
              <iframe
                ref={iframeRef}
                id="project-iframe"
                src={iframeSrc}
                title={project.title}
                className={`w-full h-full bg-white transition-opacity duration-500 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm text-white/40 text-xs">
          <span>Pressione</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">ESC</kbd>
          <span>para fechar</span>
        </div>
      </div>
    </div>
  );
};

export default IframeLiveModal;
