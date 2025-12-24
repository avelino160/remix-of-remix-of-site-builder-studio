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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Publicar site</DialogTitle>
          <DialogDescription>
            Seu site será atualizado e ficará disponível publicamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">URL pública:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-md bg-muted p-3">
                <p className="text-sm font-mono break-all">{publicUrl}</p>
              </div>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {project?.status === "published" && (
            <div className="rounded-lg bg-primary/10 p-4 text-sm">
              <p className="font-medium text-primary mb-1">Site já publicado</p>
              <p className="text-muted-foreground">
                Ao publicar novamente, você criará uma nova versão com as últimas alterações.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publicando..." : "Publicar agora"}
          </Button>
        </div>

        {project?.status === "published" && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => window.open(publicUrl, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver site publicado
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
