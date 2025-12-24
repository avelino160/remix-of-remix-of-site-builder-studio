import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

interface AICreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (projectId: string) => void;
}

export const AICreateDialog = ({ open, onOpenChange, onProjectCreated }: AICreateDialogProps) => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!user || !prompt.trim()) return;

    setGenerating(true);

    try {
      // Call AI to generate site config
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-site-config',
        { body: { prompt } }
      );

      if (functionError) {
        throw functionError;
      }

      if (!functionData?.config) {
        throw new Error('Configuração inválida retornada pela IA');
      }

      const config = functionData.config;

      // Create slug from name
      const slug = (config.name || 'site')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        + "-" + Date.now();

      // Create project with AI-generated config
      const { data: project, error: createError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: config.name || "Novo Site",
          slug,
          type: config.type || "landing",
          status: "draft",
          template: "ai-generated",
          config: {
            palette: config.palette || { primary: "221 83% 53%", secondary: "217 91% 60%" },
            sections: config.sections || {},
            typography: config.typography || "modern",
            spacing: config.spacing || "normal",
            settings: config.settings || {},
          },
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      toast({
        title: "Site criado com IA! ✨",
        description: "Seu site foi gerado automaticamente e está pronto para editar.",
      });

      onProjectCreated(project.id);
      setPrompt("");
    } catch (error: any) {
      console.error('Error generating site:', error);
      toast({
        title: "Erro ao gerar site",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const examplePrompts = [
    "Crie um site para uma cafeteria artesanal moderna",
    "Quero um portfólio para fotógrafo profissional",
    "Preciso de uma landing page para app de fitness",
    "Site para restaurante italiano tradicional",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Criar site com IA
          </DialogTitle>
          <DialogDescription>
            Descreva o site que você quer e nossa IA criará tudo automaticamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Descreva seu site</Label>
            <Textarea
              id="prompt"
              placeholder="Ex: Crie um site para minha academia moderna com foco em crossfit..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              disabled={generating}
            />
            <p className="text-xs text-muted-foreground">
              Seja específico: tipo de negócio, estilo desejado, seções importantes
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Exemplos para inspirar:</Label>
            <div className="space-y-1">
              {examplePrompts.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  disabled={generating}
                  className="block w-full rounded-md bg-muted/50 p-2 text-left text-xs hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={generating}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleGenerate}
              disabled={!prompt.trim() || generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar site
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
