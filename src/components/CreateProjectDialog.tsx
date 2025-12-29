import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserCredits } from "@/hooks/useUserCredits";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Wand2 } from "lucide-react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (projectId: string) => void;
}

const COLOR_PALETTES = [
  { name: "Azul Profissional", primary: "221 83% 53%", secondary: "217 91% 60%" },
  { name: "Verde Moderno", primary: "142 76% 36%", secondary: "142 71% 45%" },
  { name: "Roxo Criativo", primary: "262 83% 58%", secondary: "263 70% 50%" },
  { name: "Laranja Vibrante", primary: "25 95% 53%", secondary: "27 96% 61%" },
];

const TEMPLATES = [
  { id: "blank", name: "Em branco", type: "landing" },
  { id: "startup", name: "Startup SaaS", type: "landing" },
  { id: "restaurant", name: "Restaurante", type: "restaurant" },
  { id: "portfolio", name: "Portfólio Pessoal", type: "portfolio" },
];

export const CreateProjectDialog = ({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) => {
  const { user } = useAuth();
  const { credits, deductCredit } = useUserCredits();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiProgressStep, setAiProgressStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    type: "landing",
    template: "blank",
      palette: 0,
  });

  useEffect(() => {
    if (!aiLoading) {
      setAiProgressStep(0);
      return;
    }

    const steps = 3;
    const interval = setInterval(() => {
      setAiProgressStep((prev) => (prev + 1) % steps);
    }, 1800);

    return () => clearInterval(interval);
  }, [aiLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      + "-" + Date.now();

    const selectedPalette = COLOR_PALETTES[formData.palette];
    const config = {
      palette: {
        primary: selectedPalette.primary,
        secondary: selectedPalette.secondary,
      },
      sections: {
        hero: { enabled: true, title: "Bem-vindo", subtitle: "Comece a editar seu site" },
        about: { enabled: false },
        services: { enabled: false },
        contact: { enabled: true },
        footer: { enabled: true },
      },
      typography: "modern",
      spacing: "normal",
    };

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: formData.name,
        slug,
        type: formData.type,
        status: "draft",
        template: formData.template,
        config,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao criar projeto",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Projeto criado!",
        description: "Você será redirecionado para o editor.",
      });
      onProjectCreated(data.id);
      setFormData({ name: "", type: "landing", template: "blank", palette: 0 });
    }
  };

  const handleCreateWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedPrompt = aiPrompt.trim();
    if (!trimmedPrompt) {
      toast({
        title: "Descreva o site que você quer criar",
        description: "Escreva alguns detalhes para que a IA possa gerar o layout.",
        variant: "destructive",
      });
      return;
    }

    if (trimmedPrompt.length > 500) {
      toast({
        title: "Texto muito longo",
        description: "Resuma a descrição em até 500 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Verificar se tem créditos suficientes
    if (credits === null || credits <= 0) {
      toast({
        title: "Créditos insuficientes",
        description: "Você precisa de créditos para gerar um site. Veja os planos disponíveis.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);

    // Descontar 1 crédito antes de gerar
    const deducted = await deductCredit();
    if (!deducted) {
      toast({
        title: "Erro ao descontar crédito",
        description: "Não foi possível processar seu crédito. Tente novamente.",
        variant: "destructive",
      });
      setAiLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-site-config", {
        body: { prompt: trimmedPrompt },
      });

      if (error) {
        const message =
          error.message?.includes("402") || error.message?.includes("Payment")
            ? "Créditos de IA insuficientes. Adicione créditos no workspace e tente novamente."
            : error.message?.includes("429")
              ? "Muitas requisições em pouco tempo. Aguarde alguns instantes e tente novamente."
              : error.message || "Não foi possível gerar a configuração do site.";

        toast({
          title: "Erro ao usar IA",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const config = data?.config;
      if (!config) {
        toast({
          title: "Resposta inválida da IA",
          description: "Tente novamente com uma descrição um pouco diferente.",
          variant: "destructive",
        });
        return;
      }

      const nameFromConfig = typeof config.name === "string" && config.name.trim() ? config.name.trim() : "Site AI";
      const baseSlug = nameFromConfig
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "site-ai";

      const slug = `${baseSlug}-${Date.now()}`;

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: nameFromConfig,
          slug,
          type: config.type || "landing",
          status: "draft",
          template: "ai-generated",
          config,
        })
        .select()
        .single();

      if (projectError) {
        toast({
          title: "Erro ao salvar projeto",
          description: projectError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Site criado com IA!",
        description: "Abrindo o editor para você finalizar os detalhes.",
      });

      onProjectCreated(project.id);
      setAiPrompt("");
      onOpenChange(false);
    } catch (err) {
      console.error("Erro ao gerar site com IA:", err);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível falar com a IA agora. Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar novo site</DialogTitle>
          <DialogDescription>
            Configure as informações básicas ou use IA para criar automaticamente
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => {
              const textarea = document.getElementById("ai-description");
              if (textarea) textarea.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <div className="text-center">
              <div className="font-semibold">Criar com IA</div>
              <div className="text-xs text-muted-foreground">Descreva e a IA cria</div>
            </div>
          </Button>

          <Button type="button" variant="outline" className="h-24 flex flex-col gap-2">
            <Wand2 className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Criar manualmente</div>
              <div className="text-xs text-muted-foreground">Configurar tudo</div>
            </div>
          </Button>
        </div>

        <form onSubmit={handleCreateWithAI} className="space-y-4 border rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="ai-description">Descreva o site que você quer criar</Label>
            <Textarea
              id="ai-description"
              placeholder="Ex: Site para salão de beleza moderno em São Paulo, com seções de serviços, depoimentos e formulário de contato."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{aiPrompt.length}/500 caracteres</p>
          </div>

          <Button type="submit" className="w-full" disabled={aiLoading}>
            {aiLoading ? "Gerando com IA..." : "Gerar site com IA"}
          </Button>

          {aiLoading && (
            <div className="mt-3 space-y-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <p className="font-medium text-[11px] uppercase tracking-wide text-foreground/70">
                Progresso da criação
              </p>
              <ol className="space-y-1">
                <li className={aiProgressStep >= 0 ? "text-foreground" : "text-muted-foreground"}>
                  • Entendendo seu nicho e estilo
                </li>
                <li className={aiProgressStep >= 1 ? "text-foreground" : "text-muted-foreground"}>
                  • Desenhando o layout (hero, seções, cores)
                </li>
                <li className={aiProgressStep >= 2 ? "text-foreground" : "text-muted-foreground"}>
                  • Finalizando textos e salvando o projeto
                </li>
              </ol>
            </div>
          )}
        </form>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do site</Label>
            <Input
              id="name"
              placeholder="Meu site incrível"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template inicial</Label>
            <Select
              value={formData.template}
              onValueChange={(value) => {
                const template = TEMPLATES.find((t) => t.id === value);
                setFormData({
                  ...formData,
                  template: value,
                  type: template?.type || "landing",
                });
              }}
            >
              <SelectTrigger id="template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de site</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landing">Landing Page</SelectItem>
                <SelectItem value="portfolio">Portfólio</SelectItem>
                <SelectItem value="business">Empresa</SelectItem>
                <SelectItem value="restaurant">Restaurante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Paleta de cores</Label>
            <div className="grid grid-cols-2 gap-3">
              {COLOR_PALETTES.map((palette, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData({ ...formData, palette: index })}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    formData.palette === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="mb-2 flex gap-2">
                    <div
                      className="h-8 w-8 rounded"
                      style={{ backgroundColor: `hsl(${palette.primary})` }}
                    />
                    <div
                      className="h-8 w-8 rounded"
                      style={{ backgroundColor: `hsl(${palette.secondary})` }}
                    />
                  </div>
                  <p className="text-sm font-medium">{palette.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Criando..." : "Criar e ir para o editor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
