import { Link, useLocation } from "react-router-dom";
import { Home, Search, Star, HelpCircle, Settings, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, path: "/app", label: "Home" },
    { icon: Search, path: "/app/search", label: "Search" },
    { icon: Star, path: "/app/favorites", label: "Favorites" },
  ];

  const bottomItems = [
    { icon: HelpCircle, path: "/app/help", label: "Help" },
    { icon: Settings, path: "/app/settings", label: "Settings" },
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

      {/* User avatar genérico */}
      <Avatar className="w-10 h-10">
        <AvatarFallback className="bg-purple-600 text-white text-sm flex items-center justify-center">
          <UserIcon className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
    </aside>
  );
};