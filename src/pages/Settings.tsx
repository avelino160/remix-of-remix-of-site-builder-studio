import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface UserPreferences {
  theme: string;
  ai_style: string;
  ai_tone: string;
}

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>({
    theme: "dark",
    ai_style: "SaaS premium",
    ai_tone: "Profissional",
  });

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("user_preferences")
        .select("theme, ai_style, ai_tone")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
      } else if (data) {
        setPrefs(data as UserPreferences);
      }
      setLoading(false);
    };

    loadPreferences();
  }, [user]);

  const savePreferences = async () => {
    if (!user) return;
    const { error } = await supabase.from("user_preferences").upsert(
      {
        user_id: user.id,
        ...prefs,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Preferências salvas",
        description: "Usaremos essas escolhas como padrão ao gerar novos sites.",
      });
    }
  };

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
                Ajuste rapidamente as principais preferências da sua conta. Suas escolhas são salvas no
                seu perfil e usadas como padrão ao criar novos sites.
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                Estas configurações valem apenas para a sua conta e podem ser ajustadas a qualquer momento.
              </p>
              {loading && <p>Carregando preferências...</p>}
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
                  <span className="text-xs text-muted-foreground">E-mail</span>
                  <div className="inline-flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                    <span className="text-white/90 truncate">{user?.email}</span>
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
            <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">Preferências da IA</h2>
                <p className="text-xs text-muted-foreground">
                  Defina o estilo padrão que a IA deve usar ao gerar novos sites.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Estilo visual</span>
                  <div className="flex flex-wrap gap-2">
                    {["SaaS premium", "Minimalista", "Criativo", "Corporativo"].map(
                      (label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setPrefs((p) => ({ ...p, ai_style: label }))}
                          className={
                            "rounded-full border px-3 py-1 text-xs " +
                            (prefs.ai_style === label
                              ? "border-white/90 bg-white/20 text-white"
                              : "border-white/10 bg-white/5 text-white/80")
                          }
                        >
                          {label}
                        </button>
                      ),
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Essas escolhas serão usadas como referência quando a IA montar novos layouts.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Tom de voz dos textos</span>
                  <div className="flex flex-wrap gap-2">
                    {["Profissional", "Amigável", "Direto ao ponto", "Inspirador"].map(
                      (label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setPrefs((p) => ({ ...p, ai_tone: label }))}
                          className={
                            "rounded-full border px-3 py-1 text-xs " +
                            (prefs.ai_tone === label
                              ? "border-white/90 bg-white/10 text-white"
                              : "border-white/10 bg-black/40 text-white/80")
                          }
                        >
                          {label}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={savePreferences}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                  >
                    Salvar preferências
                  </button>
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
