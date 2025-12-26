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
      <DialogContent className="sm:max-w-[520px] bg-black text-foreground border border-border/80 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Publicar seu app</DialogTitle>
          <DialogDescription className="text-base text-foreground/80">
            Defina a URL pública, domínio e quem pode acessar antes de publicar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Published URL */}
          <section className="space-y-3">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              URL publicada
            </p>
            <div className="rounded-2xl border border-border bg-muted/60 px-4 py-3 shadow-sm">
              <p className="text-[11px] text-foreground/70 mb-1.5">
                Insira sua URL ou deixe em branco para gerar automaticamente.
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={publicUrl}
                  className="w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm font-mono text-foreground shadow-inner focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0 h-9 w-9 rounded-full border-border/80 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 rounded-full border-dashed border-border/80 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
                  onClick={() =>
                    toast({
                      title: "Domínio personalizado",
                      description: "Você pode configurar domínios em Configurações → Domínios.",
                    })
                  }
                >
                  Adicionar domínio personalizado
                </Button>
                <button
                  type="button"
                  onClick={() => window.open(publicUrl, "_blank")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Ver site atual
                </button>
              </div>
            </div>
          </section>

          {/* Visibility */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Quem pode visitar a URL?
              </p>
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
                <span className="text-foreground/70">Visibilidade atual</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Anyone
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Informações do site
              </p>
              <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-xs text-foreground/75">
                Configure título, descrição e SEO na página do editor para melhorar a aparência do seu site publicado.
              </div>
            </div>
          </section>

          {/* Security scan */}
          <section className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 rounded-full bg-background flex items-center justify-center border border-border">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-amber-400 top-1 right-1" />
                <span className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wide">
                  Scan
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-foreground/80 uppercase">
                  Verificação de segurança
                </p>
                <p className="text-xs text-foreground/70 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Atualizando
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                    1 erro
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <Button variant="outline" className="w-full md:w-auto text-sm">
                Revisar segurança
              </Button>
            </div>
          </section>
        </div>

        <div className="mt-2 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 font-semibold"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "Publicando..." : "Publicar"}
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
