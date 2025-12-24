import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Editor from "./pages/Editor";
import PublicSite from "./pages/PublicSite";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Team from "./pages/Team";
import Docs from "./pages/Docs";
import Help from "./pages/Help";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<Editor />} />
              <Route path="search" element={<Search />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="team" element={<Team />} />
              <Route path="docs" element={<Docs />} />
              <Route path="help" element={<Help />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/p/:slug" element={<PublicSite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;