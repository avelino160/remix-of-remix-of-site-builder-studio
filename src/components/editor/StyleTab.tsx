import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StyleTabProps {
  config: any;
  onUpdate: (updates: any) => void;
  onPaletteUpdate: (palette: { primary: string; secondary: string }) => void;
}

const COLOR_PALETTES = [
  { name: "Azul Profissional", primary: "221 83% 53%", secondary: "217 91% 60%" },
  { name: "Verde Moderno", primary: "142 76% 36%", secondary: "142 71% 45%" },
  { name: "Roxo Criativo", primary: "262 83% 58%", secondary: "263 70% 50%" },
  { name: "Laranja Vibrante", primary: "25 95% 53%", secondary: "27 96% 61%" },
  { name: "Rosa Elegante", primary: "330 81% 60%", secondary: "340 82% 52%" },
  { name: "Azul Marinho", primary: "217 91% 24%", secondary: "210 100% 45%" },
];

export const StyleTab = ({ config, onUpdate, onPaletteUpdate }: StyleTabProps) => {
  const currentPaletteIndex = COLOR_PALETTES.findIndex(
    (p) => p.primary === config.palette?.primary
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Estilo do site</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Personalize a aparência global do seu site
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Paleta de cores</Label>
        <div className="grid gap-3">
          {COLOR_PALETTES.map((palette, index) => (
            <button
              key={index}
              onClick={() => onPaletteUpdate({ primary: palette.primary, secondary: palette.secondary })}
              className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                index === currentPaletteIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex gap-2">
                <div
                  className="h-10 w-10 rounded"
                  style={{ backgroundColor: `hsl(${palette.primary})` }}
                />
                <div
                  className="h-10 w-10 rounded"
                  style={{ backgroundColor: `hsl(${palette.secondary})` }}
                />
              </div>
              <span className="text-sm font-medium">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="typography" className="text-xs font-semibold">
          Tipografia
        </Label>
        <Select
          value={config.typography}
          onValueChange={(value) => onUpdate({ typography: value })}
        >
          <SelectTrigger id="typography">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Moderna</SelectItem>
            <SelectItem value="classic">Clássica</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="spacing" className="text-xs font-semibold">
          Espaçamento
        </Label>
        <Select
          value={config.spacing}
          onValueChange={(value) => onUpdate({ spacing: value })}
        >
          <SelectTrigger id="spacing">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compacto</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="spacious">Espaçoso</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
