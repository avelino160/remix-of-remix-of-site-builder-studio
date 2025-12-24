import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.substring(0, 2).toUpperCase() || "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full glass border-b border-border/30">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/app/projects" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
              SiteBuilder
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link 
                to="/app/projects" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Meus sites
              </Link>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:scale-105 transition-transform">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-foreground/10 text-foreground text-xs font-medium">
                    {getInitials(user?.user_metadata?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 glass">
              <div className="flex flex-col space-y-1 p-3 border-b border-border/30">
                <p className="text-sm font-medium">{user?.user_metadata?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem onClick={signOut} className="m-1">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
};
