import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
          {/* Left side: back + quick actions + Preview pill */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/app/projects")}
              className="shrink-0 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* Small icon actions bar */}
            <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => loadProject()}
                title="Recarregar conteúdo do site"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleSave}
                title="Salvar configurações"
              >
                <Save className="h-4 w-4" />
              </Button>
              {project?.status === "published" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => window.open(`/p/${project.slug}`, "_blank")}
                  title="Abrir site em nova aba"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Preview pill */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full px-4 text-xs font-medium border-border/60 bg-background/60"
              onClick={() => project?.slug && window.open(`/p/${project.slug}`, "_blank")}
            >
              <Eye className="mr-2 h-3 w-3" />
              Preview
            </Button>

            {/* Mobile project info */}
            <div className="sm:hidden min-w-0">
              <h1 className="font-semibold text-sm truncate">{project?.name}</h1>
              <p className="text-[11px] text-muted-foreground">
                {project?.status === "published" ? "✓ Publicado" : "Rascunho"}
              </p>
            </div>
          </div>

          {/* Center: "address bar" with public URL */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground min-w-0 flex-1 max-w-xl mx-4">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-border/70">
              <span className="h-2 w-2 rounded-[3px] bg-foreground/80" />
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
              className="truncate text-[11px] text-foreground/80 text-center flex-1 hover:text-foreground"
              title="Copiar link público do site"
            >
              /p/{project?.slug}
            </button>
            <button
              type="button"
              className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-foreground/10 text-foreground/70"
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
              className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-foreground/10 text-foreground/70"
              onClick={() => loadProject()}
              title="Recarregar conteúdo do site"
            >
              <RotateCw className="h-3 w-3" />
            </button>
          </div>

          {/* Right: Publish */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setPublishDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full px-5"
            >
              <Upload className="mr-2 h-4 w-4" />
              Publicar
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden bg-black">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r border-border/30 bg-black/90 backdrop-blur-md overflow-y-auto">
          <Tabs defaultValue="sections" className="h-full">
            {/* Header do chat */}
            <div className="h-12 border-b border-white/15 flex items-center px-4 text-xs font-medium text-white/80 tracking-wide uppercase">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary mr-2">
                <Eye className="h-3 w-3" />
              </span>
              Assistente do editor
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
          <div className="relative flex justify-center items-start px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
            <div className="w-full max-w-5xl rounded-[32px] bg-background border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden">
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
