import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, ExternalLink, Edit, Copy, Trash2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";


interface Project {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  template: string | null;
  updated_at: string;
}

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  

  const loadProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar projetos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o projeto "${name}"?`)) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Projeto excluído",
        description: `"${name}" foi removido com sucesso.`,
      });
      loadProjects();
    }
  };

  const handleDuplicate = async (project: Project) => {
    const { data: config } = await supabase
      .from("projects")
      .select("config")
      .eq("id", project.id)
      .single();

    const newSlug = `${project.slug}-copia-${Date.now()}`;
    const { error } = await supabase.from("projects").insert({
      user_id: user!.id,
      name: `${project.name} (Cópia)`,
      slug: newSlug,
      type: project.type,
      status: "draft",
      template: project.template,
      config: config?.config || {},
    });

    if (error) {
      toast({
        title: "Erro ao duplicar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Projeto duplicado",
        description: "Uma cópia foi criada com sucesso.",
      });
      loadProjects();
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      landing: "Landing Page",
      portfolio: "Portfólio",
      business: "Empresa",
      restaurant: "Restaurante",
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando projetos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Meus sites</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie e edite todos os seus projetos
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => navigate("/app")}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Criar novo site com IA
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed border-2 glass">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-full bg-muted p-6">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Nenhum site criado ainda</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Crie seu primeiro site agora e comece a construir sua presença online
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/app")}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <Plus className="mr-2 h-5 w-5" />
                Criar meu primeiro site com IA
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="group relative overflow-hidden glass hover:scale-[1.02] transition-all duration-200 cursor-pointer border-border/50"
                onClick={() => navigate(`/app/projects/${project.id}`)}
              >
                {/* Thumbnail placeholder with gradient */}
                <div className="aspect-video w-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 flex items-center justify-center">
                  <Globe className="h-12 w-12 text-muted-foreground/30" />
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base line-clamp-1 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {getTypeLabel(project.type)}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/projects/${project.id}`);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {project.status === "published" && (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/p/${project.slug}`, "_blank");
                          }}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Abrir site
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(project);
                        }}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id, project.name);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={project.status === "published" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {project.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(project.updated_at)}
                    </span>
                  </div>
                </CardContent>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Card>
            ))}
          </div>
        )}
      </div>

    </AppLayout>
  );
};

export default Projects;