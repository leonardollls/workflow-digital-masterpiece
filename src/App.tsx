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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
              <Route path="/upload-cliente" element={<ClientUpload />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/termos-de-uso" element={<Terms />} />
              <Route path="/politica-de-privacidade" element={<Privacy />} />
              <Route path="/site/liddera" element={<VendasLiddera />} />
              <Route path="/site/envel" element={<VendasEnvel />} />
              <Route path="/site/inove" element={<VendasInove />} />
              <Route path="/site/lauren" element={<VendasLauren />} />
              <Route path="/site/ortobom" element={<VendasOrtobom />} />
              <Route path="/site/previnir" element={<VendasPrevinir />} />
              <Route path="/site/estado-da-arte" element={<VendasEstadoDaArte />} />
              <Route path="/site/flach" element={<VendasFlach />} />
              <Route path="/site/center" element={<VendasCenter />} />
              <Route path="/site/ez" element={<VendasEZ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
