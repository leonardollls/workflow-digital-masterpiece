import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioV2 = lazy(() => import("./pages/PortfolioV2"));
const ClientBrief = lazy(() => import("./pages/ClientBrief"));
const CustomBrief = lazy(() => import("./pages/CustomBrief"));
const InstitutionalBrief = lazy(() => import("./pages/InstitutionalBrief"));
const LogoBrief = lazy(() => import("./pages/LogoBrief"));
const DentalBrief = lazy(() => import("./pages/DentalBrief"));
const ClientUpload = lazy(() => import("./pages/ClientUpload"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VendasLiddera = lazy(() => import("./pages/VendasLiddera"));
const VendasEnvel = lazy(() => import("./pages/VendasEnvel"));
const VendasInove = lazy(() => import("./pages/VendasInove"));
const VendasLauren = lazy(() => import("./pages/VendasLauren"));
const VendasOrtobom = lazy(() => import("./pages/VendasOrtobom"));
const VendasPrevinir = lazy(() => import("./pages/VendasPrevinir"));
const VendasEstadoDaArte = lazy(() => import("./pages/VendasEstadoDaArte"));
const VendasFlach = lazy(() => import("./pages/VendasFlach"));
const VendasCenter = lazy(() => import("./pages/VendasCenter"));
const VendasEZ = lazy(() => import("./pages/VendasEZ"));
const CheckoutLauren = lazy(() => import("./pages/CheckoutLauren"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to handle redirect from static HTML
const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we came from the static HTML redirect
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    if (redirectPath && location.pathname === '/') {
      navigate(redirectPath, { replace: true });
    }
  }, [location, navigate]);
  
  return null;
};

// Component to aggressively remove ALL unwanted favicons and force Leonardo Lopes favicon
const FaviconCleaner = () => {
  useEffect(() => {
    const leonardoFavicon = '/Images/logos/logo-leonardo-lopes-icone.svg';
    
    const forceLeonardoFavicon = () => {
      // Remover TODOS os links de favicon existentes que não sejam do Leonardo Lopes
      const faviconLinks = document.querySelectorAll('link[rel*="icon"], link[rel*="shortcut"], link[rel*="apple-touch-icon"], link[rel*="mask-icon"]');
      faviconLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        // Manter apenas favicons do Leonardo Lopes, remover todos os outros
        if (!href.includes('logo-leonardo-lopes-icone.svg') && 
            !href.includes('leonardolopes') &&
            (href.toLowerCase().includes('lovable') || 
             href.toLowerCase().includes('workflow.lovable') ||
             href.toLowerCase().includes('favicon.ico') ||
             href.includes('data:image'))) {
          link.remove();
        }
      });
      
      // Verificar se já existe o favicon do Leonardo Lopes
      let hasLeonardoFavicon = false;
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingFavicons.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('logo-leonardo-lopes-icone.svg')) {
          hasLeonardoFavicon = true;
        }
      });
      
      // Adicionar favicon Leonardo Lopes se não existir
      if (!hasLeonardoFavicon && document.head) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = leonardoFavicon;
        link.type = 'image/svg+xml';
        document.head.insertBefore(link, document.head.firstChild);
        
        const shortcutLink = document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.href = leonardoFavicon;
        shortcutLink.type = 'image/svg+xml';
        document.head.insertBefore(shortcutLink, document.head.firstChild);
        
        const appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        appleLink.href = leonardoFavicon;
        document.head.insertBefore(appleLink, document.head.firstChild);
      }
      
      // Remover também qualquer link que possa ser um favicon indesejado
      const allLinks = document.querySelectorAll('link');
      allLinks.forEach(link => {
        const rel = link.getAttribute('rel') || '';
        const href = link.getAttribute('href') || '';
        if (
          (rel.toLowerCase().includes('icon') || rel.toLowerCase().includes('shortcut')) &&
          !href.includes('logo-leonardo-lopes-icone.svg') &&
          !href.includes('leonardolopes') &&
          (href.toLowerCase().includes('lovable') ||
           href.toLowerCase().includes('workflow.lovable') ||
           href.toLowerCase().includes('favicon.ico') ||
           href.includes('data:image') ||
           (href.toLowerCase().includes('.ico') && !href.includes('leonardo')) ||
           (href.toLowerCase().includes('.png') && !href.includes('leonardo')))
        ) {
          link.remove();
        }
      });
    };

    // Executar imediatamente
    forceLeonardoFavicon();
    
    // Usar MutationObserver para monitorar e remover favicons adicionados dinamicamente
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const element = node as Element;
            if (element.tagName === 'LINK') {
              const rel = element.getAttribute('rel') || '';
              const href = element.getAttribute('href') || '';
              if (
                (rel.toLowerCase().includes('icon') || rel.toLowerCase().includes('shortcut')) &&
                !href.includes('logo-leonardo-lopes-icone.svg') &&
                !href.includes('leonardolopes') &&
                (href.toLowerCase().includes('lovable') ||
                 href.toLowerCase().includes('workflow.lovable') ||
                 href.toLowerCase().includes('favicon.ico') ||
                 href.includes('data:image') ||
                 (href.toLowerCase().includes('.ico') && !href.includes('leonardo')) ||
                 (href.toLowerCase().includes('.png') && !href.includes('leonardo')))
              ) {
                element.remove();
              }
            }
          }
        });
      });
      // Verificar novamente após mutações
      forceLeonardoFavicon();
    });

    // Observar mudanças no head
    observer.observe(document.head, {
      childList: true,
      subtree: true,
    });

    // Executar periodicamente para garantir
    const interval = setInterval(forceLeonardoFavicon, 200);
    const timeout = setTimeout(forceLeonardoFavicon, 100);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);
  
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FaviconCleaner />
          <RedirectHandler />
          <Suspense fallback={
            <div 
              className="flex items-center justify-center min-h-screen"
              style={{ 
                background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a12 100%)',
                contain: 'layout style paint'
              }}
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20" 
                  style={{ contain: 'layout' }}
                />
                <div className="h-4 w-32 mx-auto bg-white/10 rounded" />
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<PortfolioV2 />} />
              <Route path="/portfolio-v1" element={<Portfolio />} />
              <Route path="/portfolio-v2" element={<Navigate to="/portfolio" replace />} />
              <Route path="/briefing" element={<Navigate to="/briefing-cliente" replace />} />
              <Route path="/briefing-cliente" element={<ClientBrief />} />
              <Route path="/briefing-personalizado" element={<CustomBrief />} />
              <Route path="/briefing-institucional" element={<InstitutionalBrief />} />
              <Route path="/briefing-logo" element={<LogoBrief />} />
              <Route path="/briefing-odontologia" element={<DentalBrief />} />
              <Route path="/upload-cliente" element={<ClientUpload />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/termos-de-uso" element={<Terms />} />
              <Route path="/politica-de-privacidade" element={<Privacy />} />
              <Route path="/site/liddera" element={<Navigate to="/site/liddera-contabilidade" replace />} />
              <Route path="/site/liddera-contabilidade" element={<VendasLiddera />} />
              <Route path="/site/envel" element={<Navigate to="/site/envel-contabilidade" replace />} />
              <Route path="/site/envel-contabilidade" element={<VendasEnvel />} />
              <Route path="/site/inove" element={<Navigate to="/site/inove-contabilidade" replace />} />
              <Route path="/site/inove-contabilidade" element={<VendasInove />} />
              <Route path="/site/lauren" element={<Navigate to="/site/lauren-odontologia" replace />} />
              <Route path="/site/lauren-odontologia" element={<VendasLauren />} />
              <Route path="/site/ortobom" element={<Navigate to="/site/ortobom-odontologia" replace />} />
              <Route path="/site/ortobom-odontologia" element={<VendasOrtobom />} />
              <Route path="/site/previnir" element={<Navigate to="/site/previnir-odontopediatria" replace />} />
              <Route path="/site/previnir-odontopediatria" element={<VendasPrevinir />} />
              <Route path="/site/estado-da-arte" element={<VendasEstadoDaArte />} />
              <Route path="/site/flach" element={<Navigate to="/site/flach-odontologia" replace />} />
              <Route path="/site/flach-odontologia" element={<VendasFlach />} />
              <Route path="/site/center" element={<Navigate to="/site/center-ortodontia" replace />} />
              <Route path="/site/center-ortodontia" element={<VendasCenter />} />
              <Route path="/site/ez" element={<Navigate to="/site/ez-odontologia" replace />} />
              <Route path="/site/ez-odontologia" element={<VendasEZ />} />
              {/* Checkout Routes */}
              <Route path="/checkout/lauren" element={<CheckoutLauren />} />
              <Route path="/checkout/sucesso" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancelado" element={<CheckoutCancel />} />
              <Route path="/checkout/expirado" element={<CheckoutCancel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
