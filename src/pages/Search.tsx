import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  slug: string;
  status: string;
  updated_at: string;
}

const SearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (user) {
      // Carrega projetos recentes inicialmente
      fetchProjects("");
    }
  }, [user]);

  const fetchProjects = async (search: string) => {
    if (!user) return;

    setLoading(true);
    try {
      let queryBuilder = supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(50);

      if (search.trim()) {
        queryBuilder = queryBuilder.ilike("name", `%${search.trim()}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Erro ao buscar projetos", error);
      toast({
        title: "Erro ao buscar projetos",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasSearched(true);
    fetchProjects(query);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Buscar projetos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pesquise entre os sites que você já criou pelo nome.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite parte do nome do projeto..."
          />
          <Button type="submit" disabled={loading} className="whitespace-nowrap">
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Resultados
            </p>
            {projects.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {projects.length} projeto{projects.length !== 1 && "s"} encontrado{projects.length !== 1 && "s"}
              </p>
            )}
          </div>

          <div className="border rounded-lg divide-y bg-background">
            {loading && (
              <div className="p-6 text-sm text-muted-foreground">Carregando projetos...</div>
            )}

            {!loading && projects.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">
                {hasSearched
                  ? "Nenhum projeto encontrado para essa busca."
                  : "Você ainda não tem projetos ou eles ainda estão sendo carregados."}
              </div>
            )}

            {!loading &&
              projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium leading-none">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Atualizado em {new Date(project.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.status === "published" ? "default" : "secondary"}>
                      {project.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SearchPage;

