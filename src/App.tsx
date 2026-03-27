import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Session from "./pages/Session";
import Onboard from "./pages/Onboard";
import Admin from "./pages/Admin";
import Story from "./pages/Story";
import Festin from "./pages/Festin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<Create />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/session" element={<Session />} />
            <Route path="/onboard" element={<Onboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/story" element={<Story />} />
            <Route path="/festin" element={<Festin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
