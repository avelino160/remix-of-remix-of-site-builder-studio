import { Link, useLocation } from "react-router-dom";
import { Home, Search, Star, HelpCircle, Settings, User as UserIcon, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useAttachmentSidebar } from "@/hooks/useAttachmentSidebar";
import { useUserCredits } from "@/hooks/useUserCredits";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { attachedFileName } = useAttachmentSidebar();
  const { credits, loading } = useUserCredits();


  const navItems = [
    { icon: Home, path: "/app", label: "Início" },
    { icon: Search, path: "/app/search", label: "Buscar" },
    { icon: Star, path: "/app/favorites", label: "Favoritos" },
  ];

  const bottomItems = [
    { icon: HelpCircle, path: "/app/help", label: "Ajuda" },
    { icon: Settings, path: "/app/settings", label: "Configurações" },
  ];

  const getInitials = () => {
    return user?.email?.substring(0, 1).toUpperCase() || "U";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col items-center py-4 z-50">


      {/* Main navigation */}
      <nav className="flex-1 flex flex-col gap-1 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="flex flex-col gap-1 w-full px-2 mb-4">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-gray-400 hover:text-white hover:bg-white/5"
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </Button>
            </Link>
          );
        })}
      </div>

      {/* User avatar com menu de conta */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary/40 hover:ring-offset-2 hover:ring-offset-background transition-all">
            <AvatarFallback className="bg-primary/80 text-primary-foreground text-sm flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="z-50 w-64 rounded-lg bg-background border border-border text-sm shadow-lg animate-fade-in p-3 space-y-3"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-border/60">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
              {getInitials()}
            </div>
            <div className="flex flex-col overflow-hidden leading-tight">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Conta</span>
              <span className="text-sm font-medium truncate">{user?.email || "sem e-mail"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              E-mail
            </p>
            <p className="text-xs text-foreground/90 break-words">
              {user?.email || "sem e-mail"}
            </p>
          </div>

          <div className="space-y-2 pt-1 border-t border-border/60">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Créditos
              </p>
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {loading
                  ? "Carregando..."
                  : credits !== null
                  ? `${credits} créditos`
                  : "Erro"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/80">
              {loading
                ? "Buscando seu saldo de créditos."
                : credits !== null
                ? "Créditos são usados para gerar e editar sites com a IA."
                : "Não foi possível carregar seus créditos agora."}
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
};