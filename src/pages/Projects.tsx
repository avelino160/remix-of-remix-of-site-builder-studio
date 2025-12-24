import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreVertical, ExternalLink, Edit, Copy, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";

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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus sites</h1>
            <p className="text-muted-foreground">
              Gerencie e edite todos os seus projetos
            </p>
          </div>
          <Button size="lg" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar novo site
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-2">Nenhum site criado ainda</CardTitle>
              <CardDescription className="mb-4 max-w-sm">
                Crie seu primeiro site agora e comece a construir sua presença online
              </CardDescription>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Criar meu primeiro site
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {getTypeLabel(project.type)}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/app/projects/${project.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {project.status === "published" && (
                          <DropdownMenuItem onClick={() => window.open(`/p/${project.slug}`, "_blank")}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Abrir site
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDuplicate(project)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(project.id, project.name)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={project.status === "published" ? "default" : "secondary"}>
                        {project.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Atualizado em {formatDate(project.updated_at)}
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/app/projects/${project.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar projeto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onProjectCreated={(projectId) => {
          setCreateDialogOpen(false);
          navigate(`/app/projects/${projectId}`);
        }}
      />
    </AppLayout>
  );
};

export default Projects;
