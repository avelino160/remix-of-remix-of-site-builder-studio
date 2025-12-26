import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Save, Eye, Upload, ArrowLeft, ExternalLink, RotateCw } from "lucide-react";
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
  const [inlineEditing, setInlineEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
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
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-3">
          {/* Voltar + barra de "endereço" do editor */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/app/projects")}
              className="gap-2 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs text-muted-foreground min-w-0">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20">
                <span className="h-2 w-2 rounded-[3px] bg-white/80" />
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!project?.slug) return;
                  const url = `${window.location.origin}/p/${project.slug}`;
                  navigator.clipboard?.writeText(url).then(() => {
                    toast({
                      title: "Link copiado",
                      description: url,
                    });
                  });
                }}
                className="truncate text-[11px] text-white/80 text-left flex-1 hover:text-white/100"
                title="Copiar link público do site"
              >
                /p/{project?.slug}
              </button>
              <button
                type="button"
                className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 text-white/70"
                onClick={() => {
                  if (project?.slug) {
                    window.open(`/p/${project.slug}`, "_blank");
                  }
                }}
                title="Abrir site em nova aba"
              >
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                type="button"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 text-white/70"
                onClick={() => window.location.reload()}
                title="Recarregar editor"
              >
                <RotateCw className="h-3 w-3" />
              </button>
            </div>

            <div className="sm:hidden border-l border-border/40 pl-3 min-w-0">
              <h1 className="font-semibold text-sm truncate">{project?.name}</h1>
              <p className="text-[11px] text-muted-foreground">
                {project?.status === "published" ? "✓ Publicado" : "Rascunho"}
              </p>
            </div>
          </div>

          {/* Ações de salvar / publicar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex flex-col items-end mr-2 text-right">
              <h1 className="font-semibold text-sm leading-tight max-w-[220px] truncate">
                {project?.name}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {project?.status === "published" ? "✓ Publicado" : "Rascunho"}
              </p>
            </div>

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
                onToggleInlineEditing={() => setInlineEditing((prev) => !prev)}
                inlineEditing={inlineEditing}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-muted/10 overflow-auto relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative">
            <SitePreview
              config={config}
              projectName={project?.name}
              editable={inlineEditing}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              onFieldChange={(section, field, value) => {
                setConfig((prev) => ({
                  ...prev,
                  sections: {
                    ...(prev.sections || {}),
                    [section]: {
                      ...(prev.sections?.[section] || {}),
                      enabled: true,
                      [field]: value,
                    },
                  },
                }));
              }}
            />
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