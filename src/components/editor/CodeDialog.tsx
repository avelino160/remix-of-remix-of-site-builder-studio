import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";

interface CodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: any;
  project: any;
}

export const CodeDialog = ({ open, onOpenChange, config, project }: CodeDialogProps) => {
  const [copiedTab, setCopiedTab] = useState<"html" | "config" | null>(null);

  const htmlSnippet = `<!DOCTYPE html>\n<html lang="pt-BR">\n  <head>\n    <meta charset="utf-8" />\n    <title>${config?.settings?.title || project?.name || "Landing page"}</title>\n    <meta name="description" content="${config?.settings?.description || "Landing page gerada no editor."}" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <style>\n      :root {\n        --primary: hsl(${config?.palette?.primary || "221 83% 53%"});\n        --secondary: hsl(${config?.palette?.secondary || "217 91% 60%"});\n      }\n      body {\n        margin: 0;\n        font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;\n        background: #020817;\n        color: #f9fafb;\n      }\n      main {\n        min-height: 100vh;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 3rem 1.5rem;\n      }\n      .page {\n        max-width: 1120px;\n        width: 100%;\n        border-radius: 1.75rem;\n        background: #020617;\n        box-shadow: 0 24px 80px rgba(0,0,0,0.8);\n        border: 1px solid rgba(148,163,184,0.35);\n        padding: 2.5rem 2rem;\n      }\n    </style>\n  </head>\n  <body>\n    <main>\n      <div class="page">\n        <!-- Estrutura gerada pelo editor vai aqui -->\n      </div>\n    </main>\n  </body>\n</html>`;

  const configSnippet = JSON.stringify(config ?? {}, null, 2);

  const handleCopy = async (value: string, tab: "html" | "config") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTab(tab);
      toast({
        title: "Copiado!",
        description: tab === "html" ? "HTML/CSS copiados para a área de transferência." : "Config JSON copiada para a área de transferência.",
      });
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (value: string, filename: string) => {
    try {
      const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({
        title: "Download iniciado",
        description: filename,
      });
    } catch (err) {
      toast({
        title: "Erro ao baixar arquivo",
        description: "Não foi possível iniciar o download.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-background">
        <DialogHeader>
          <DialogTitle className="text-base">Código do site</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Veja e copie o HTML/CSS base e a configuração JSON usada para gerar este site.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="html" className="mt-3">
          <div className="flex items-center justify-between gap-2 mb-3">
            <TabsList className="bg-muted/40">
              <TabsTrigger value="html" className="text-xs">
                HTML / CSS
              </TabsTrigger>
              <TabsTrigger value="config" className="text-xs">
                Config JSON
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-[11px]"
                onClick={() => handleCopy(htmlSnippet, "html")}
              >
                {copiedTab === "html" ? (
                  <>
                    <Check className="h-3 w-3 mr-1" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" /> Copiar HTML
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-[11px]"
                onClick={() => handleDownload(htmlSnippet, `${project?.slug || "landing-page"}.html`)}
              >
                <Download className="h-3 w-3 mr-1" /> Baixar .html
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-[11px]"
                onClick={() => handleCopy(configSnippet, "config")}
              >
                {copiedTab === "config" ? (
                  <>
                    <Check className="h-3 w-3 mr-1" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" /> Copiar JSON
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-[11px]"
                onClick={() => handleDownload(configSnippet, `${project?.slug || "landing-page-config"}.json`)}
              >
                <Download className="h-3 w-3 mr-1" /> Baixar .json
              </Button>
            </div>
          </div>

          <TabsContent value="html" className="mt-0">
            <ScrollArea className="h-80 rounded-md border border-border/40 bg-muted/40">
              <pre className="p-3 text-[11px] leading-relaxed font-mono text-muted-foreground whitespace-pre">
                {htmlSnippet}
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <ScrollArea className="h-80 rounded-md border border-border/40 bg-muted/40">
              <pre className="p-3 text-[11px] leading-relaxed font-mono text-muted-foreground whitespace-pre">
                {configSnippet}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
