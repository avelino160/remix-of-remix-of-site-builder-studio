import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Edit, Home } from "lucide-react";
import { SitePreview } from "@/components/editor/SitePreview";

const PublicSite = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPublicSite();
  }, [slug]);

  const loadPublicSite = async () => {
    if (!slug) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setProject(data);
    }
    setLoading(false);
  };

  const isOwner = user && project && user.id === project.user_id;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando site...</p>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">Site não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O site que você está procurando não existe ou ainda não foi publicado.
          </p>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Ir para início
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const config = project.config || {
    palette: { primary: "221 83% 53%", secondary: "217 91% 60%" },
    sections: {},
    typography: "modern",
    spacing: "normal",
  };

  // Set page title and description
  const pageTitle = config.settings?.title || project.name || "Site";
  const pageDescription = config.settings?.description || "";

  return (
    <>
      <head>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
      </head>

      <div className="min-h-screen bg-background">
        {/* Owner toolbar - only visible to site owner */}
        {isOwner && (
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            <Button variant="secondary" size="sm" asChild className="shadow-lg">
              <Link to={`/app/projects/${project.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar no construtor
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild className="shadow-lg">
              <Link to="/app/projects">
                <Home className="mr-2 h-4 w-4" />
                Voltar ao dashboard
              </Link>
            </Button>
          </div>
        )}

        {/* Site content */}
        <SitePreview config={config} projectName={project.name} />
      </div>
    </>
  );
};

export default PublicSite;
