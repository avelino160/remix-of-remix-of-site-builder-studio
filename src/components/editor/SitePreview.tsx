interface SitePreviewProps {
  config: any;
  projectName: string;
  editable?: boolean;
  onFieldChange?: (section: string, field: string, value: string) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export const SitePreview = ({ config, projectName, editable = false, onFieldChange, selectedId, onSelect }: SitePreviewProps) => {
  const { palette, sections, typography, spacing } = config;

  const spacingClasses = {
    compact: "space-y-8",
    normal: "space-y-16",
    spacious: "space-y-24",
  };

  const typographyClasses = {
    modern: "font-sans",
    classic: "font-serif",
    tech: "font-mono",
  };

  const primaryColor = `hsl(${palette?.primary || "221 83% 53%"})`;
  const secondaryColor = `hsl(${palette?.secondary || "217 91% 60%"})`;

  return (
    <div
      className={`min-h-full bg-background text-foreground ${
        typographyClasses[typography as keyof typeof typographyClasses] || "font-sans"
      }`}
    >
      <style>{`
        .preview-primary { color: ${primaryColor}; }
        .preview-bg-primary { background-color: ${primaryColor}; }
        .preview-border-primary { border-color: ${primaryColor}; }
        .preview-secondary { color: ${secondaryColor}; }
        .preview-bg-secondary { background-color: ${secondaryColor}; }
      `}</style>

      <div
        className={`max-w-6xl mx-auto px-6 py-12 ${
          spacingClasses[spacing as keyof typeof spacingClasses] || "space-y-16"
        }`}
      >
        {/* Hero Section */}
        {sections.hero?.enabled && (
          <section
            className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground shadow-xl transition-shadow ${
              editable ? "cursor-pointer" : ""
            } ${
              editable && selectedId === "hero"
                ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("hero") : undefined}
          >
            <div className="pointer-events-none absolute inset-0 opacity-40">
              <div className="absolute -top-24 -left-10 h-56 w-56 rounded-full bg-background/10 blur-3xl" />
              <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-10 px-8 py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
              <div className="text-center md:text-left space-y-6">
                <p className="inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  {projectName}
                </p>

                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                  contentEditable={editable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onFieldChange?.("hero", "title", e.currentTarget.textContent || "")
                  }
                >
                  {sections.hero.title || "Bem-vindo ao seu novo site profissional"}
                </h1>

                <p
                  className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto md:mx-0"
                  contentEditable={editable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onFieldChange?.("hero", "subtitle", e.currentTarget.textContent || "")
                  }
                >
                  {sections.hero.subtitle ||
                    "Crie uma presença digital elegante em poucos minutos, com seções prontas para conversão."}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-secondary px-8 py-3 text-sm font-semibold text-secondary-foreground shadow-md transition hover:brightness-110"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onFieldChange?.("hero", "cta", e.currentTarget.textContent || "")
                    }
                  >
                    {sections.hero.cta || "Começar agora"}
                  </button>
                  <span className="text-xs text-primary-foreground/70">
                    Sem código, em poucos cliques.
                  </span>
                </div>
              </div>

              <div className="mx-auto w-full max-w-md rounded-2xl bg-background/10 p-4 shadow-lg ring-1 ring-background/30 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between text-xs text-primary-foreground/70">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Online
                  </div>
                  <span>Prévia do seu site</span>
                </div>
                <div className="space-y-3 rounded-xl bg-background/5 p-4">
                  <div className="h-2 w-24 rounded-full bg-primary/30" />
                  <div className="h-2 w-40 rounded-full bg-primary/20" />
                  <div className="mt-4 grid gap-2">
                    <div className="h-10 rounded-lg bg-background/20" />
                    <div className="h-10 rounded-lg bg-background/15" />
                    <div className="h-10 rounded-lg bg-background/10" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        {sections.about?.enabled && (
          <section
            className={`py-16 px-6 transition-shadow ${editable ? "cursor-pointer" : ""} ${
              editable && selectedId === "about"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("about") : undefined}
          >
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-4xl font-bold mb-6 preview-primary"
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onFieldChange?.("about", "title", e.currentTarget.textContent || "")
                }
              >
                {sections.about.title || "Sobre nós"}
              </h2>
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onFieldChange?.("about", "content", e.currentTarget.textContent || "")
                }
              >
                {sections.about.content ||
                  "Conte sua história aqui. Este é um espaço para você se apresentar e mostrar o que torna seu negócio único."}
              </p>
            </div>
          </section>
        )}

        {/* Services Section */}
        {sections.services?.enabled && (
          <section
            className={`py-16 px-6 bg-muted/30 transition-shadow ${
              editable ? "cursor-pointer" : ""
            } ${
              editable && selectedId === "services"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("services") : undefined}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center preview-primary">
                {sections.services.title || "Nossos serviços"}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-background rounded-lg p-6 border-2 preview-border-primary/20 hover:preview-border-primary transition-colors">
                    <div className="preview-bg-primary/10 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Serviço {i}</h3>
                    <p className="text-muted-foreground">Descrição do serviço que você oferece.</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {sections.testimonials?.enabled && (
          <section
            className={`py-16 px-6 transition-shadow ${editable ? "cursor-pointer" : ""} ${
              editable && selectedId === "testimonials"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("testimonials") : undefined}
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center preview-primary">
                {sections.testimonials.title || "Depoimentos"}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-muted/30 rounded-lg p-6">
                    <p className="text-lg mb-4 italic">"Excelente experiência! Recomendo muito."</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full preview-bg-primary/20"></div>
                      <div>
                        <p className="font-semibold">Cliente {i}</p>
                        <p className="text-sm text-muted-foreground">Empresa XYZ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {sections.contact?.enabled && (
          <section
            className={`py-16 px-6 bg-muted/30 transition-shadow ${
              editable ? "cursor-pointer" : ""
            } ${
              editable && selectedId === "contact"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("contact") : undefined}
          >
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="text-4xl font-bold mb-6 preview-primary"
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onFieldChange?.("contact", "title", e.currentTarget.textContent || "")
                }
              >
                {sections.contact.title || "Entre em contato"}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tem alguma dúvida? Envie um e-mail para:
              </p>
              <a
                href={`mailto:${sections.contact.email || "contato@exemplo.com"}`}
                className="preview-primary text-xl font-semibold hover:underline"
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onFieldChange?.("contact", "email", e.currentTarget.textContent || "")
                }
              >
                {sections.contact.email || "contato@exemplo.com"}
              </a>
            </div>
          </section>
        )}

        {/* Footer */}
        {sections.footer?.enabled && (
          <footer
            className={`preview-bg-primary text-white py-8 px-6 transition-shadow ${
              editable ? "cursor-pointer" : ""
            } ${
              editable && selectedId === "footer"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("footer") : undefined}
          >
            <div className="max-w-6xl mx-auto text-center">
              <p
                className="opacity-90"
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onFieldChange?.("footer", "text", e.currentTarget.textContent || "")
                }
              >
                {sections.footer.text || "© 2024 Todos os direitos reservados"}
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};
