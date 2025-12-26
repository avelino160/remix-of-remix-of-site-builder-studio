import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

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
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects("");
      loadFavorites();
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

  const loadFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("project_id")
        .eq("user_id", user.id);

      if (error) throw error;

      setFavoriteProjectIds(data ? data.map((fav) => fav.project_id) : []);
    } catch (error) {
      console.error("Erro ao carregar favoritos", error);
      toast({
        title: "Erro ao carregar favoritos",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (projectId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const isFavorited = favoriteProjectIds.includes(projectId);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("project_id", projectId);

        if (error) throw error;

        setFavoriteProjectIds((prev) => prev.filter((id) => id !== projectId));
      } else {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          project_id: projectId,
        });

        if (error) throw error;

        setFavoriteProjectIds((prev) => [...prev, projectId]);
      }
    } catch (error) {
      console.error("Erro ao atualizar favorito", error);
      toast({
        title: "Erro ao atualizar favorito",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setHasSearched(true);
    fetchProjects(query);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Buscar projetos</h1>
          <p className="text-sm text-muted-foreground">
            Pesquise entre os sites que você já criou pelo nome.
          </p>
        </header>

        <section className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6">
            <h2 className="text-sm font-semibold text-white mb-3">Pesquisar pelo nome</h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite parte do nome do projeto..."
              />
              <Button
                type="submit"
                disabled={loading}
                className="whitespace-nowrap"
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </form>
          </div>
          <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Resultados
              </p>
              {projects.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {projects.length} projeto
                  {projects.length !== 1 && "s"} encontrado
                  {projects.length !== 1 && "s"}
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
                  {hasSearched
                    ? "Nenhum projeto encontrado para essa busca."
                    : "Você ainda não tem projetos ou eles ainda estão sendo carregados."}
                </div>
              )}

              {!loading &&
                projects.map((project) => {
                  const isFavorited = favoriteProjectIds.includes(project.id);

                  return (
                    <div
                      key={project.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/app/projects/${project.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigate(`/app/projects/${project.id}`);
                        }
                      }}
                      className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium leading-none text-white">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Atualizado em {""}
                          {new Date(project.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(project.id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-gray-300 hover:text-yellow-400 hover:bg-black/90 transition-colors"
                          aria-label={
                            isFavorited
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isFavorited
                                ? "fill-yellow-400 text-yellow-400"
                                : ""
                            }`}
                          />
                        </button>
                        <Badge
                          variant={
                            project.status === "published" ? "default" : "secondary"
                          }
                        >
                          {project.status === "published"
                            ? "Publicado"
                            : "Rascunho"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default SearchPage;

