interface SitePreviewProps {
  config: any;
  projectName: string;
  editable?: boolean;
  onFieldChange?: (section: string, field: string, value: string) => void;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export const SitePreview = ({ config, projectName, editable = false, onFieldChange, selectedId, onSelect }: SitePreviewProps) => {
  const { palette, sections, typography, spacing, layoutVariant } = config;

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
  const currentLayout = (layoutVariant as string) || "saas_modular_grid";

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
            className={`relative overflow-hidden rounded-2xl border shadow-xl transition-shadow ${
              currentLayout.startsWith("creator_")
                ? "bg-background text-foreground"
                : currentLayout.startsWith("saas_")
                ? "bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground"
                : currentLayout.startsWith("clinic_")
                ? "bg-background text-foreground"
                : "bg-gradient-to-br from-background via-background to-muted text-foreground"
            } ${
              editable ? "cursor-pointer" : ""
            } ${
              editable && selectedId === "hero"
                ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                : ""
            }`}
            onClick={editable ? () => onSelect?.("hero") : undefined}
          >
            {/* Glow / background accents apenas para alguns layouts */}
            {currentLayout.startsWith("saas_") && (
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -top-24 -left-10 h-56 w-56 rounded-full bg-background/10 blur-3xl" />
                <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
              </div>
            )}

            {/* BEAUTY / ESTÉTICA – hero mais fluido, imagem forte */}
            {currentLayout.startsWith("beauty_") && (
              <div className="relative z-10 grid gap-10 px-8 py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] md:items-center">
                <div className="space-y-6 text-center md:text-left">
                  <p className="inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                    Estética & Bem-estar
                  </p>
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onFieldChange?.("hero", "title", e.currentTarget.textContent || "")
                    }
                  >
                    {sections.hero.title ||
                      "Beleza, experiência e confiança em cada detalhe do seu negócio"}
                  </h1>
                  <p
                    className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onFieldChange?.("hero", "subtitle", e.currentTarget.textContent || "")
                    }
                  >
                    {sections.hero.subtitle ||
                      "Crie uma presença digital elegante, com fotos em destaque, textos suaves e foco total na experiência da sua cliente."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <button
                      className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-110"
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onFieldChange?.("hero", "cta", e.currentTarget.textContent || "")
                      }
                    >
                      {sections.hero.cta || "Ver portfólio"}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      Layout pensado para destacar suas melhores imagens.
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-40 sm:h-48 rounded-2xl bg-card/60 shadow-md" />
                  <div className="h-40 sm:h-56 rounded-2xl bg-card/40 shadow-md translate-y-4" />
                  <div className="hidden sm:block h-28 rounded-2xl bg-card/30 col-span-2 shadow-sm" />
                </div>
              </div>
            )}

            {/* SAAS / TECH – layouts modulares e com preview de produto */}
            {currentLayout.startsWith("saas_") && (
              <div
                className={`relative z-10 grid gap-10 px-8 py-16 ${
                  currentLayout === "saas_focus_split"
                    ? "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]"
                    : "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)]"
                } md:items-center`}
              >
                <div className="space-y-6 text-center md:text-left">
                  <p className="inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground/80">
                    Plataforma digital
                  </p>
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onFieldChange?.("hero", "title", e.currentTarget.textContent || "")
                    }
                  >
                    {sections.hero.title ||
                      "Seu produto SaaS com a mesma cara de ferramentas que você admira"}
                  </h1>
                  <p
                    className="text-base md:text-lg text-primary-foreground/85 max-w-xl mx-auto md:mx-0"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onFieldChange?.("hero", "subtitle", e.currentTarget.textContent || "")
                    }
                  >
                    {sections.hero.subtitle ||
                      "Explique em poucas linhas o problema que você resolve, para quem é e qual resultado concreto você entrega."}
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

                {/* Variação de visual conforme o tipo de SaaS */}
                <div className="mx-auto w-full max-w-md rounded-2xl bg-background/10 p-4 shadow-lg ring-1 ring-background/30 backdrop-blur-md">
                  <div className="mb-4 flex items-center justify-between text-xs text-primary-foreground/70">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                      Online
                    </div>
                    <span>
                      {currentLayout === "saas_modular_grid"
                        ? "Painel em tempo real"
                        : currentLayout === "saas_dark_pro"
                        ? "Modo Pro"
                        : "Seu produto em ação"}
                    </span>
                  </div>
                  <div
                    className={`space-y-3 rounded-xl bg-background/5 p-4 ${
                      currentLayout === "saas_dark_pro" ? "bg-background/80" : ""
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 rounded-md bg-primary/30" />
                      <div className="h-10 rounded-md bg-primary/20" />
                      <div className="h-10 rounded-md bg-primary/10" />
                    </div>
                    <div className="mt-4 grid gap-2">
                      <div className="h-8 rounded-lg bg-background/20" />
                      <div className="h-8 rounded-lg bg-background/15" />
                      <div className="h-8 rounded-lg bg-background/10" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CLÍNICA / SAÚDE – visual clínico e/ou humano */}
            {currentLayout.startsWith("clinic_") && (
              <div className="relative z-10 grid gap-10 px-8 py-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
                <div className="space-y-6 text-center md:text-left">
                  <p className="inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                    Saúde & Confiança
                  </p>
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onFieldChange?.("hero", "title", e.currentTarget.textContent || "")
                    }
                  >
                    {sections.hero.title ||
                      "Clareza, confiança e cuidado desde o primeiro contato do paciente"}
                  </h1>
                  <p
                    className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onFieldChange?.("hero", "subtitle", e.currentTarget.textContent || "")
                    }
                  >
                    {sections.hero.subtitle ||
                      "Mostre especialidades, credenciais e diferenciais com um tom humano, profissional e acolhedor."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <button
                      className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-110"
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onFieldChange?.("hero", "cta", e.currentTarget.textContent || "")
                      }
                    >
                      {sections.hero.cta || "Agendar consulta"}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      Destaque segurança, estrutura e facilidade de contato.
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-40 rounded-2xl bg-card/70 shadow-md" />
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="rounded-xl border bg-card/60 p-3">
                      Estrutura moderna
                    </div>
                    <div className="rounded-xl border bg-card/60 p-3">
                      Equipe especializada
                    </div>
                    <div className="rounded-xl border bg-card/60 p-3 col-span-2">
                      Atendimento humano e próximo em cada etapa.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CRIADORES / COMUNIDADE – editorial, solto, mais texto humano */}
            {currentLayout.startsWith("creator_") && (
              <div className="relative z-10 px-6 py-16 md:px-10">
                <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-start">
                  <div className="space-y-6">
                    <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground">
                      Criadores & Comunidades
                    </p>
                    <h1
                      className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight md:leading-[1.05]"
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onFieldChange?.("hero", "title", e.currentTarget.textContent || "")
                      }
                    >
                      {sections.hero.title ||
                        "Conte uma história forte o bastante para virar comunidade"}
                    </h1>
                    <p
                      className="text-base md:text-lg text-muted-foreground max-w-xl"
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onFieldChange?.("hero", "subtitle", e.currentTarget.textContent || "")
                      }
                    >
                      {sections.hero.subtitle ||
                        "Use este espaço para explicar em linguagem simples quem você é, o que publica e por que as pessoas deveriam acompanhar você de perto."}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button
                        className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-110"
                        contentEditable={editable}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onFieldChange?.("hero", "cta", e.currentTarget.textContent || "")
                        }
                      >
                        {sections.hero.cta || "Entrar na comunidade"}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        Layout pensado para newsletters, podcasts, cursos e hubs de conteúdo.
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 md:pt-4">
                    <div className="h-32 rounded-2xl bg-card/70 shadow-sm" />
                    <div className="rounded-2xl border bg-card/60 p-4 text-sm leading-relaxed">
                      "Use este bloco como um destaque de episódio, newsletter ou história que representa bem o seu trabalho."
                    </div>
                  </div>
                </div>
              </div>
            )}
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
