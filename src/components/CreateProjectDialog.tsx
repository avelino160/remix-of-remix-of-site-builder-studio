import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "landing",
    template: "blank",
    palette: 0,
  });

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
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => {
                onOpenChange(false);
                navigate('/app/ai-create');
              }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="text-center">
                <div className="font-semibold">Criar com IA</div>
                <div className="text-xs text-muted-foreground">Descreva e a IA cria</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => {}}
            >
              <Wand2 className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Criar manualmente</div>
                <div className="text-xs text-muted-foreground">Configurar tudo</div>
              </div>
            </Button>
          </div>

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
