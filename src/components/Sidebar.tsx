import { Link, useLocation } from "react-router-dom";
import { Home, Search, Star, HelpCircle, Settings, User as UserIcon, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useAttachmentSidebar } from "@/hooks/useAttachmentSidebar";
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
          <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-white/40 hover:ring-offset-2 hover:ring-offset-[#1A1A1A] transition-all">
            <AvatarFallback className="bg-purple-600 text-white text-sm flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="z-50 w-56 bg-black border border-white/10 text-sm shadow-lg"
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Conta
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <div className="px-3 py-2 space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              E-mail
            </p>
            <p className="text-xs text-white break-words">
              {user?.email || "sem e-mail"}
            </p>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <div className="px-3 py-2 space-y-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Créditos
            </p>
            <p className="text-xs text-white">
              Em breve: exibição de créditos da sua conta.
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
};