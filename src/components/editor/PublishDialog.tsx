import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Copy, ExternalLink } from "lucide-react";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onPublished: () => void;
}

export const PublishDialog = ({ open, onOpenChange, project, onPublished }: PublishDialogProps) => {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    if (!project) return;

    setPublishing(true);

    // Create a version snapshot
    const { data: latestVersion } = await supabase
      .from("project_versions")
      .select("version_number")
      .eq("project_id", project.id)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    const nextVersion = (latestVersion?.version_number || 0) + 1;

    const { error: versionError } = await supabase.from("project_versions").insert({
      project_id: project.id,
      version_number: nextVersion,
      config: project.config,
    });

    if (versionError) {
      toast({
        title: "Erro ao criar versão",
        description: versionError.message,
        variant: "destructive",
      });
      setPublishing(false);
      return;
    }

    // Update project status
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    setPublishing(false);

    if (updateError) {
      toast({
        title: "Erro ao publicar",
        description: updateError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Site publicado!",
        description: "Seu site está online e pronto para ser compartilhado.",
      });
      onPublished();
      onOpenChange(false);
    }
  };

  const publicUrl = `${window.location.origin}/p/${project?.slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] glass">
        <DialogHeader>
          <DialogTitle className="text-2xl">Publicar site</DialogTitle>
          <DialogDescription className="text-base">
            Seu site será atualizado e ficará disponível publicamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">URL pública:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl bg-card/50 border border-border/50 p-4">
                <p className="text-sm font-mono break-all text-muted-foreground">{publicUrl}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyToClipboard}
                className="h-10 w-10 hover:scale-105 transition-transform"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {project?.status === "published" && (
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm">
              <p className="font-medium text-foreground mb-1">Site já publicado</p>
              <p className="text-muted-foreground">
                Ao publicar novamente, você criará uma nova versão com as últimas alterações.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button 
            variant="ghost" 
            className="flex-1" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-semibold" 
            onClick={handlePublish} 
            disabled={publishing}
          >
            {publishing ? "Publicando..." : "Publicar agora"}
          </Button>
        </div>

        {project?.status === "published" && (
          <Button
            variant="ghost"
            className="w-full mt-2 group"
            onClick={() => window.open(publicUrl, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Ver site publicado
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
