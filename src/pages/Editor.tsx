import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Save, Eye, Upload } from "lucide-react";
import { SectionsTab } from "@/components/editor/SectionsTab";
import { StyleTab } from "@/components/editor/StyleTab";
import { SettingsTab } from "@/components/editor/SettingsTab";
import { SitePreview } from "@/components/editor/SitePreview";
import { PublishDialog } from "@/components/editor/PublishDialog";

interface ProjectConfig {
  palette: {
    primary: string;
    secondary: string;
  };
  sections: Record<string, any>;
  typography: string;
  spacing: string;
  settings?: {
    title?: string;
    description?: string;
  };
}

const Editor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  
  const [project, setProject] = useState<any>(null);
  const [config, setConfig] = useState<ProjectConfig>({
    palette: { primary: "221 83% 53%", secondary: "217 91% 60%" },
    sections: {},
    typography: "modern",
    spacing: "normal",
  });

  useEffect(() => {
    loadProject();
  }, [id, user]);

  const loadProject = async () => {
    if (!user || !id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      toast({
        title: "Erro ao carregar projeto",
        description: error.message,
        variant: "destructive",
      });
      navigate("/app/projects");
    } else {
      setProject(data);
      setConfig(data.config as any);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!project) return;

    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({ config: config as any })
      .eq("id", project.id);

    setSaving(false);

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Salvo!",
        description: "Suas alterações foram salvas.",
      });
    }
  };

  const updateConfig = (updates: Partial<ProjectConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const updateSections = (sections: Record<string, any>) => {
    setConfig((prev) => ({ ...prev, sections }));
  };

  const updatePalette = (palette: { primary: string; secondary: string }) => {
    setConfig((prev) => ({ ...prev, palette }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando editor...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Editor Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/projects")}>
              ← Voltar
            </Button>
            <div>
              <h1 className="font-semibold">{project?.name}</h1>
              <p className="text-xs text-muted-foreground">
                {project?.status === "published" ? "Publicado" : "Rascunho"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            {project?.status === "published" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/p/${project.slug}`, "_blank")}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver site
              </Button>
            )}
            <Button size="sm" onClick={() => setPublishDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Publicar
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r border-border/40 bg-background overflow-y-auto">
          <Tabs defaultValue="sections" className="h-full">
            <TabsList className="w-full rounded-none border-b border-border/40 bg-transparent p-0">
              <TabsTrigger value="sections" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Seções
              </TabsTrigger>
              <TabsTrigger value="style" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Estilo
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Configurações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sections" className="m-0 p-4">
              <SectionsTab sections={config.sections} onUpdate={updateSections} />
            </TabsContent>
            
            <TabsContent value="style" className="m-0 p-4">
              <StyleTab config={config} onUpdate={updateConfig} onPaletteUpdate={updatePalette} />
            </TabsContent>
            
            <TabsContent value="settings" className="m-0 p-4">
              <SettingsTab project={project} config={config} onUpdate={updateConfig} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-muted/20 overflow-auto">
          <SitePreview config={config} projectName={project?.name} />
        </div>
      </div>

      <PublishDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        project={project}
        onPublished={loadProject}
      />
    </div>
  );
};

export default Editor;
