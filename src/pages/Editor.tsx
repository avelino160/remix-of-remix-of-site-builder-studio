import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Save, Eye, Upload, ArrowLeft } from "lucide-react";
import { SectionsTab } from "@/components/editor/SectionsTab";
import { StyleTab } from "@/components/editor/StyleTab";
import { SettingsTab } from "@/components/editor/SettingsTab";
import { SitePreview } from "@/components/editor/SitePreview";
import { PublishDialog } from "@/components/editor/PublishDialog";
import { EditorAssistantPanel } from "@/components/editor/EditorAssistantPanel";

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
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Editor Header */}
      <header className="glass border-b border-border/30 sticky top-0 z-50 bg-black">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/app/projects")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="border-l border-border/40 pl-4">
              <h1 className="font-semibold text-base">{project?.name}</h1>
              <p className="text-xs text-muted-foreground">
                {project?.status === "published" ? "✓ Publicado" : "Rascunho"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSave} 
              disabled={saving}
              className="hidden sm:flex"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
            {project?.status === "published" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/p/${project.slug}`, "_blank")}
                className="hidden sm:flex"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver site
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={() => setPublishDialogOpen(true)}
              className="bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              <Upload className="mr-2 h-4 w-4" />
              Publicar
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r border-border/30 bg-black/80 overflow-y-auto">
          <Tabs defaultValue="sections" className="h-full">
            {/* Removido o header de abas, deixamos só o conteúdo do chat */}
            <div className="h-12 border-b border-white/20 flex items-center px-4 text-sm font-medium text-white/80">
              Chat
            </div>
            
            <TabsContent value="sections" className="m-0 h-[calc(100%-3rem)]">
              <EditorAssistantPanel
                config={config}
                project={project}
                onConfigChange={setConfig}
                onSave={handleSave}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-black overflow-auto relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative">
            <SitePreview config={config} projectName={project?.name} />
          </div>
        </div>
 
        {/* AI assistant agora fica na aba "Assistente" à esquerda */}
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