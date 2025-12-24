import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface SectionsTabProps {
  sections: Record<string, any>;
  onUpdate: (sections: Record<string, any>) => void;
}

const DEFAULT_SECTIONS = {
  hero: { enabled: true, title: "Bem-vindo ao seu site", subtitle: "Comece a editar agora", cta: "Saiba mais" },
  about: { enabled: false, title: "Sobre nós", content: "Conte sua história aqui" },
  services: { enabled: false, title: "Nossos serviços", items: [] },
  testimonials: { enabled: false, title: "Depoimentos", items: [] },
  contact: { enabled: false, title: "Entre em contato", email: "contato@exemplo.com" },
  footer: { enabled: true, text: "© 2024 Todos os direitos reservados" },
};

export const SectionsTab = ({ sections, onUpdate }: SectionsTabProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["hero"]);

  const currentSections = { ...DEFAULT_SECTIONS, ...sections };

  const toggleSection = (key: string) => {
    onUpdate({
      ...currentSections,
      [key]: { ...currentSections[key], enabled: !currentSections[key].enabled },
    });
  };

  const updateSectionField = (key: string, field: string, value: any) => {
    onUpdate({
      ...currentSections,
      [key]: { ...currentSections[key], [field]: value },
    });
  };

  const moveSection = (key: string, direction: "up" | "down") => {
    const keys = Object.keys(currentSections);
    const index = keys.indexOf(key);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === keys.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newKeys = [...keys];
    [newKeys[index], newKeys[newIndex]] = [newKeys[newIndex], newKeys[index]];

    const reordered: Record<string, any> = {};
    newKeys.forEach((k) => {
      reordered[k] = currentSections[k];
    });
    onUpdate(reordered);
  };

  const sectionLabels: Record<string, string> = {
    hero: "Hero",
    about: "Sobre",
    services: "Serviços",
    testimonials: "Depoimentos",
    contact: "Contato",
    footer: "Rodapé",
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Seções do site</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Ative/desative e organize as seções do seu site
        </p>
      </div>

      <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
        {Object.entries(currentSections).map(([key, section]) => (
          <AccordionItem key={key} value={key} className="border rounded-lg px-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveSection(key, "up")}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveSection(key, "down")}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
              
              <Switch
                checked={section.enabled}
                onCheckedChange={() => toggleSection(key)}
                className="shrink-0"
              />
              
              <AccordionTrigger className="flex-1 py-3 hover:no-underline">
                <span className="text-sm font-medium">{sectionLabels[key]}</span>
              </AccordionTrigger>
            </div>

            <AccordionContent className="pb-3">
              <div className="space-y-3 pt-2">
                {key === "hero" && (section as any).title !== undefined && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Título</Label>
                      <Input
                        value={(section as any).title || ""}
                        onChange={(e) => updateSectionField(key, "title", e.target.value)}
                        placeholder="Título principal"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Subtítulo</Label>
                      <Textarea
                        value={(section as any).subtitle || ""}
                        onChange={(e) => updateSectionField(key, "subtitle", e.target.value)}
                        placeholder="Descrição do hero"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Texto do botão</Label>
                      <Input
                        value={(section as any).cta || ""}
                        onChange={(e) => updateSectionField(key, "cta", e.target.value)}
                        placeholder="Saiba mais"
                      />
                    </div>
                  </>
                )}

                {key === "about" && (section as any).content !== undefined && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Título</Label>
                      <Input
                        value={(section as any).title || ""}
                        onChange={(e) => updateSectionField(key, "title", e.target.value)}
                        placeholder="Sobre nós"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Conteúdo</Label>
                      <Textarea
                        value={(section as any).content || ""}
                        onChange={(e) => updateSectionField(key, "content", e.target.value)}
                        placeholder="Conte sua história..."
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {key === "services" && (section as any).items !== undefined && (
                  <div className="space-y-1">
                    <Label className="text-xs">Título</Label>
                    <Input
                      value={(section as any).title || ""}
                      onChange={(e) => updateSectionField(key, "title", e.target.value)}
                      placeholder="Nossos serviços"
                    />
                  </div>
                )}

                {key === "contact" && (section as any).email !== undefined && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Título</Label>
                      <Input
                        value={(section as any).title || ""}
                        onChange={(e) => updateSectionField(key, "title", e.target.value)}
                        placeholder="Entre em contato"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">E-mail</Label>
                      <Input
                        type="email"
                        value={(section as any).email || ""}
                        onChange={(e) => updateSectionField(key, "email", e.target.value)}
                        placeholder="contato@exemplo.com"
                      />
                    </div>
                  </>
                )}

                {key === "footer" && (section as any).text !== undefined && (
                  <div className="space-y-1">
                    <Label className="text-xs">Texto do rodapé</Label>
                    <Input
                      value={(section as any).text || ""}
                      onChange={(e) => updateSectionField(key, "text", e.target.value)}
                      placeholder="© 2024 Seu site"
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
