import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SettingsTabProps {
  project: any;
  config: any;
  onUpdate: (updates: any) => void;
}

export const SettingsTab = ({ project, config, onUpdate }: SettingsTabProps) => {
  const settings = config.settings || {};

  const updateSettings = (field: string, value: string) => {
    onUpdate({
      settings: {
        ...settings,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Configurações</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Configure metadados e informações do site
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="page-title" className="text-xs font-semibold">
          Título da página (SEO)
        </Label>
        <Input
          id="page-title"
          value={settings.title || project?.name || ""}
          onChange={(e) => updateSettings("title", e.target.value)}
          placeholder="Meu site incrível"
        />
        <p className="text-xs text-muted-foreground">
          Aparece na aba do navegador e nos resultados de busca
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta-description" className="text-xs font-semibold">
          Descrição (meta description)
        </Label>
        <Textarea
          id="meta-description"
          value={settings.description || ""}
          onChange={(e) => updateSettings("description", e.target.value)}
          placeholder="Uma breve descrição do seu site para SEO"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Máximo de 160 caracteres recomendado
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">URL pública</Label>
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm font-mono break-all">
            {window.location.origin}/p/{project?.slug}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          URL onde seu site será publicado
        </p>
      </div>
    </div>
  );
};
