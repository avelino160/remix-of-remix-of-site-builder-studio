import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors"
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
                ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
