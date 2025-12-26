import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  name: string;
  status: string;
  updated_at: string;
}

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, status, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Erro ao carregar projetos", error);
      toast({
        title: "Erro ao carregar projetos",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      setDeletingId(projectId);
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast({
        title: "Projeto deletado",
        description: "Seu projeto foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao deletar projeto", error);
      toast({
        title: "Erro ao deletar projeto",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Meus projetos</h1>
          <p className="text-sm text-muted-foreground">
            Aqui você enxerga todos os sites que já criou com a IA, em ordem dos mais
            recentes.
          </p>
        </header>

        <section className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Lista de projetos
              </p>
              {projects.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {projects.length} projeto{projects.length !== 1 && "s"}
                </p>
              )}
            </div>

            <div className="border border-white/5 rounded-xl bg-black/40 divide-y divide-white/5">
              {loading && (
                <div className="p-6 text-sm text-muted-foreground">
                  Carregando projetos...
                </div>
              )}

              {!loading && projects.length === 0 && (
                <div className="p-6 text-sm text-muted-foreground">
                  Você ainda não criou nenhum site. Volte para a tela inicial para gerar o
                  seu primeiro projeto.
                </div>
              )}

              {!loading &&
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/app/projects/${project.id}`)}
                      className="flex-1 text-left flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium leading-none text-white">{project.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Atualizado em {new Date(project.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={project.status === "published" ? "default" : "secondary"}
                      >
                        {project.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deletar projeto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso irá remover
                            permanentemente o projeto "{project.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                          >
                            {deletingId === project.id ? "Deletando..." : "Deletar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}

            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
