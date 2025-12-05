import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-workflow-50 via-white to-workflow-100">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-workflow-energy/10 skeleton"></div>
                <div className="h-4 w-32 mx-auto bg-gray-200 rounded skeleton"></div>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
