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

        {/* Benefits Section */}
        {sections.about?.enabled && (
          <section
            className={`py-20 px-6 transition-shadow ${editable ? "cursor-pointer" : ""} ${
              editable && selectedId === "about"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("about") : undefined}
          >
            <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
              <div className="space-y-6">
                <p className="text-xs font-semibold tracking-[0.28em] uppercase text-muted-foreground">
                  Benefícios
                </p>
                <h2
                  className="text-3xl md:text-4xl font-semibold tracking-tight preview-primary"
                  contentEditable={editable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onFieldChange?.("about", "title", e.currentTarget.textContent || "")
                  }
                >
                  {sections.about.title || "Benefícios que seu produto entrega de forma clara"}
                </h2>
                <p
                  className="text-base md:text-lg text-muted-foreground leading-relaxed"
                  contentEditable={editable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onFieldChange?.("about", "content", e.currentTarget.textContent || "")
                  }
                >
                  {sections.about.content ||
                    "Explique, em linguagem simples, como você reduz atrito, economiza tempo e gera resultado concreto para o usuário final."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                <div className="rounded-xl border bg-card/40 p-4 shadow-sm">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Benefício 01
                  </p>
                  <p className="text-sm text-foreground/90">
                    Destaque o ganho principal (ex.: menos cliques, mais clareza, fluxo mais rápido).
                  </p>
                </div>
                <div className="rounded-xl border bg-card/40 p-4 shadow-sm">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Benefício 02
                  </p>
                  <p className="text-sm text-foreground/90">
                    Mostre como você reduz risco, dúvida ou esforço mental para o usuário.
                  </p>
                </div>
                <div className="rounded-xl border bg-card/40 p-4 shadow-sm sm:col-span-2 md:col-span-1">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Benefício 03
                  </p>
                  <p className="text-sm text-foreground/90">
                    Conecte o produto ao resultado final do negócio (mais receita, retenção, satisfação).
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Benefits Grid Section (complementar) */}
        {sections.services?.enabled && (
          <section
            className={`py-20 px-6 bg-muted/30 transition-shadow ${
              editable ? "cursor-pointer" : ""
            } ${
              editable && selectedId === "services"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("services") : undefined}
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-10 flex flex-col items-center gap-3 text-center">
                <p className="text-xs font-semibold tracking-[0.28em] uppercase text-muted-foreground">
                  Principais pontos fortes
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight preview-primary">
                  {sections.services.title || "Por que pessoas escolhem seu produto"}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border bg-card/60 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-base">{i === 1 ? "⚡" : i === 2 ? "✨" : "🎯"}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {i === 1 && "Onboarding sem fricção"}
                      {i === 2 && "Interface que explica sozinha"}
                      {i === 3 && "Foco total em conversão"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {i === 1 &&
                        "Mostre como o usuário consegue entender e usar o produto em poucos minutos."}
                      {i === 2 &&
                        "Destaque clareza visual, hierarquia e mensagens diretas que reduzem dúvida."}
                      {i === 3 &&
                        "Conecte layout, CTA e fluxo a métricas reais de negócio (leads, vendas, retenção)."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Social Proof Section */}
        {sections.testimonials?.enabled && (
          <section
            className={`py-20 px-6 transition-shadow ${editable ? "cursor-pointer" : ""} ${
              editable && selectedId === "testimonials"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("testimonials") : undefined}
          >
            <div className="max-w-6xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <p className="text-xs font-semibold tracking-[0.28em] uppercase text-muted-foreground">
                  Prova social
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight preview-primary">
                  {sections.testimonials.title || "O que clientes reais dizem"}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                  Use depoimentos curtos, específicos e objetivos, conectando sempre a um ganho mensurável.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <article
                    key={i}
                    className="relative overflow-hidden rounded-2xl border bg-card/60 p-6 shadow-sm"
                  >
                    <div className="mb-4 text-4xl leading-none text-primary">“</div>
                    <p className="mb-4 text-base md:text-lg text-foreground/90">
                      "Excelente experiência. Time entendeu rápido nosso contexto e o produto ficou com cara de algo pronto para ir ao ar."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/15" />
                      <div>
                        <p className="text-sm font-semibold">Cliente {i}</p>
                        <p className="text-xs text-muted-foreground">Cargo / Empresa</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA Section */}
        {sections.contact?.enabled && (
          <section
            className={`py-20 px-6 bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 transition-shadow ${
              editable ? "cursor-pointer" : ""
            } ${
              editable && selectedId === "contact"
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("contact") : undefined}
          >
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <p className="text-xs font-semibold tracking-[0.28em] uppercase text-muted-foreground">
                Próximo passo
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold tracking-tight preview-primary"
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onFieldChange?.("contact", "title", e.currentTarget.textContent || "")
                }
              >
                {sections.contact.title || "Pronto para tirar essa ideia do papel?"}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Use este espaço como um convite direto e específico: qual é a ação clara que o usuário deve tomar agora?
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`mailto:${sections.contact.email || "contato@exemplo.com"}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-110"
                  contentEditable={editable}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onFieldChange?.("contact", "email", e.currentTarget.textContent || "")
                  }
                >
                  {sections.contact.email || "Falar com o time"}
                </a>
                <span className="text-xs text-muted-foreground">
                  Resposta rápida, linguagem simples e próxima.
                </span>
              </div>
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
