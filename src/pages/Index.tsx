import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h2 className="text-xl font-bold">SiteBuilder</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Entrar
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Começar grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Crie sites completos
            <br />
            <span className="text-primary">em poucos cliques</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Construa landing pages, portfólios e sites institucionais profissionais sem precisar
            escrever código. Editor visual com preview em tempo real.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg">
            Começar agora →
          </Button>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="mb-12 text-center text-3xl font-bold">Como funciona</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border/50 bg-card p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary mx-auto">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Escolha um template</h3>
              <p className="text-muted-foreground">
                Comece do zero ou escolha entre templates profissionais para diferentes tipos de
                negócio
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary mx-auto">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Personalize o conteúdo</h3>
              <p className="text-muted-foreground">
                Edite textos, cores, imagens e seções com preview em tempo real do resultado
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary mx-auto">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Publique e compartilhe</h3>
              <p className="text-muted-foreground">
                Com um clique, seu site fica online com URL única para compartilhar
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="rounded-2xl border border-border/50 bg-card p-12">
            <h2 className="mb-4 text-3xl font-bold">Pronto para criar seu site?</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Junte-se a milhares de usuários que já criaram sites incríveis
            </p>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Criar minha conta grátis
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 SiteBuilder. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
