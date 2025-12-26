import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const PlansPage = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Planos em créditos
          </p>
          <h1 className="text-3xl font-semibold text-white">Escolha como quer usar a Webly</h1>
          <p className="text-sm text-muted-foreground">
            Estes planos são apenas uma simulação visual de como ficaria a tela de preços em
            créditos para criação de sites. Você pode adaptar os valores e regras depois.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Starter
            </p>
            <p className="text-2xl font-semibold text-white">5 créditos para começar grátis</p>
            <p className="text-xs text-muted-foreground">Perfeito para dar os primeiros passos criando sites.</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Comece sem compromisso</li>
              <li>• Ideal para testar a criação de sites</li>
            </ul>
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() =>
                toast({
                  title: "Em breve",
                  description: "Compra de créditos ainda não está disponível.",
                })
              }
            >
              Pagar agora
            </Button>
          </div>

          <div className="rounded-2xl border border-blue-400/60 bg-blue-500/10 p-5 space-y-3 relative overflow-hidden">
            <span className="absolute top-3 right-3 rounded-full bg-blue-500 text-[10px] px-2 py-0.5 text-white uppercase tracking-wide">
              Mais usado
            </span>
            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">Pro</p>
            <p className="text-2xl font-semibold text-white">50 créditos</p>
            <p className="text-xs text-blue-100/90">
              Para quem cria sites com frequência ao longo do mês.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-blue-100/90">
              <li>• Várias gerações completas de site</li>
              <li>• Ajustes e iterações com IA</li>
            </ul>
            <Button
              className="w-full mt-3"
              onClick={() =>
                toast({
                  title: "Em breve",
                  description: "Compra de créditos ainda não está disponível.",
                })
              }
            >
              Pagar agora
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Studio
            </p>
            <p className="text-2xl font-semibold text-white">100+ créditos</p>
            <p className="text-xs text-muted-foreground">
              Para agências ou times que geram muitos projetos.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Alto volume de gerações</li>
              <li>• Ideal para uso colaborativo</li>
            </ul>
            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() =>
                toast({
                  title: "Em breve",
                  description: "Compra de créditos ainda não está disponível.",
                })
              }
            >
              Pagar agora
            </Button>
          </div>
        </section>

        <section className="text-xs text-muted-foreground border-t border-white/10 pt-4">
          <p>
            Observação: esta página é apenas um protótipo dentro do seu projeto Lovable. A
            cobrança real de créditos da plataforma continua sendo controlada pelo seu plano
            atual na Lovable.
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

export default PlansPage;
