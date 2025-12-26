import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AttachmentSidebarProvider } from "@/hooks/useAttachmentSidebar";
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
import Plans from "./pages/Plans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AttachmentSidebarProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/app" element={<AppShell />}>
                <Route index element={<Home />} />
                <Route
                  path="projects"
                  element=
                    {<ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>}
                />
                <Route
                  path="projects/:id"
                  element=
                    {<ProtectedRoute>
                      <Editor />
                    </ProtectedRoute>}
                />
                <Route
                  path="search"
                  element=
                    {<ProtectedRoute>
                      <Search />
                    </ProtectedRoute>}
                />
                <Route
                  path="favorites"
                  element=
                    {<ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>}
                />
                <Route
                  path="team"
                  element=
                    {<ProtectedRoute>
                      <Team />
                    </ProtectedRoute>}
                />
                <Route
                  path="docs"
                  element=
                    {<ProtectedRoute>
                      <Docs />
                    </ProtectedRoute>}
                />
                <Route
                  path="help"
                  element=
                    {<ProtectedRoute>
                      <Help />
                    </ProtectedRoute>}
                />
                <Route
                  path="settings"
                  element=
                    {<ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>}
                />
                <Route
                  path="plans"
                  element=
                    {<ProtectedRoute>
                      <Plans />
                    </ProtectedRoute>}
                />
              </Route>
              <Route path="/" element={<Navigate to="/app" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/p/:slug" element={<PublicSite />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AttachmentSidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;