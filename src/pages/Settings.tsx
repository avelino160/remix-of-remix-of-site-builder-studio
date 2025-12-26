import { AppLayout } from "@/components/AppLayout";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Configurações</h1>
          <p className="text-sm text-muted-foreground">
            Personalize sua experiência na Webly: conta, aparência do app e preferências da IA.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[1.2fr_2fr]">
          {/* Coluna esquerda: navegação/resumo */}
          <section className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-white/5/5 p-4">
              <h2 className="text-sm font-medium text-white/80 tracking-wide uppercase mb-3">
                Visão geral
              </h2>
              <p className="text-xs text-muted-foreground">
                Ajuste rapidamente as principais preferências da sua conta. Somos minimalistas
                aqui: apenas controles que realmente impactam sua criação de sites.
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                Todas as mudanças são locais por enquanto – futuras versões poderão sincronizar
                preferências avançadas por dispositivo.
              </p>
            </div>
          </section>

          {/* Coluna direita: blocos de configuração */}
          <section className="space-y-6">
            {/* Conta */}
            <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-white mb-1">Conta</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Informações básicas usadas para identificar você dentro da plataforma.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Nome</span>
                  <div className="inline-flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                    <span className="text-white/90 truncate">{`{email do usuário}`}</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                      Em breve
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Idioma preferido</span>
                  <div className="inline-flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                    <span className="text-white/90">Português (Brasil)</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                      Fixo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aparência */}
            <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-white mb-1">Aparência</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Controle o visual do painel da Webly. O tema escuro é o padrão para foco total no conteúdo.
              </p>

              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">Tema</span>
                  <button className="group w-full rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 px-3 py-3 text-left hover-scale transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm">Escuro</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/80">
                        Ativo
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Fundo preto, contraste alto e foco no conteúdo. Ideal para criação contínua.
                    </p>
                  </button>
                </div>

                <div className="space-y-2 opacity-60 cursor-not-allowed">
                  <span className="text-xs text-muted-foreground flex items-center justify-between">
                    Claro
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                      Em breve
                    </span>
                  </span>
                  <div className="w-full rounded-xl border border-dashed border-white/10 bg-black/40 px-3 py-3 text-[11px] text-muted-foreground">
                    Em versões futuras você poderá alternar entre temas e salvar presets visuais.
                  </div>
                </div>
              </div>
            </div>

            {/* Preferências de IA */}
            <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-white mb-1">Preferências da IA</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Defina o estilo padrão que a IA deve usar ao gerar novos sites.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Estilo visual</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "SaaS premium",
                      "Minimalista",
                      "Criativo",
                      "Corporativo",
                    ].map((label) => (
                      <button
                        key={label}
                        className={`rounded-full border border-white/10 px-3 py-1 text-xs text-white/80 bg-white/5`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    No momento isso é apenas indicativo – a IA já foi treinada para priorizar um visual
                    moderno, limpo e altamente conversivo.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Tom de voz dos textos</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Profissional",
                      "Amigável",
                      "Direto ao ponto",
                      "Inspirador",
                    ].map((label) => (
                      <button
                        key={label}
                        className={`rounded-full border border-white/10 px-3 py-1 text-xs text-white/80 bg-black/40`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
