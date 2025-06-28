
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EditBillPage from "./pages/EditBillPage";
import EditWorkerPage from "./pages/EditWorkerPage";
import TodayTotalPage from "./pages/TodayTotalPage";
import TotalExpenditurePage from "./pages/TotalExpenditurePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/edit-bill/:id" element={<EditBillPage />} />
            <Route path="/edit-worker/:id" element={<EditWorkerPage />} />
            <Route path="/today-total" element={<TodayTotalPage />} />
            <Route path="/total-expenditure" element={<TotalExpenditurePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
