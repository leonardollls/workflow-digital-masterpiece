import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ClientBrief = lazy(() => import("./pages/ClientBrief"));
const CustomBrief = lazy(() => import("./pages/CustomBrief"));
const InstitutionalBrief = lazy(() => import("./pages/InstitutionalBrief"));
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
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/briefing" element={<Navigate to="/briefing-cliente" replace />} />
              <Route path="/briefing-cliente" element={<ClientBrief />} />
              <Route path="/briefing-personalizado" element={<CustomBrief />} />
              <Route path="/briefing-institucional" element={<InstitutionalBrief />} />
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
