import { AppLayout } from "@/components/AppLayout";

const HelpPage = () => {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-white">Ajuda</h1>
          <p className="text-sm text-muted-foreground">
            Entenda rapidamente como usar a Webly para criar sites profissionais com IA.
          </p>
        </header>

        {/* FAQ principal */}
        <section className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white">Perguntas rápidas</h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6">
                <h3 className="text-sm font-medium text-white mb-1">
                  Como criar meu primeiro site?
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Vá até a Home, escreva em linguagem natural o que você quer (ex: “site para clínica de estética”)
                  e clique em gerar. A IA monta o layout completo com seções e textos iniciais.
                </p>
                <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                  <li>Abra a página Home.</li>
                  <li>Descreva seu negócio ou projeto no campo de prompt.</li>
                  <li>Clique para gerar o site.</li>
                  <li>Depois, abra o editor para ajustar seções e textos.</li>
                </ol>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6">
                <h3 className="text-sm font-medium text-white mb-1">
                  Como editar seções específicas do site?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Dentro do editor, use o painel de chat da IA para pedir mudanças em linguagem natural
                  (ex: “deixa a hero mais curta e direta”). Você também pode usar o modo de edição visual
                  para clicar em seções e alterar textos direto na página.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6">
                <h3 className="text-sm font-medium text-white mb-1">
                  O que fazer se a geração falhar ou ficar estranha?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tente ser mais específico no prompt, informando público-alvo, objetivo do site e tom desejado.
                  Se o erro for técnico, tente gerar novamente em alguns instantes.
                </p>
              </div>
            </div>
          </div>

          {/* Bloco lateral com passos e contato */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6">
              <h2 className="text-sm font-semibold text-white mb-2">Fluxo recomendado</h2>
              <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                <li>Descreva seu site na Home.</li>
                <li>Gere o primeiro rascunho com a IA.</li>
                <li>Abra o editor para ajustar seções e textos.</li>
                <li>Teste no desktop e no mobile.</li>
                <li>Publique quando estiver satisfeito.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 space-y-3 text-xs">
              <h2 className="text-sm font-semibold text-white">Ainda precisa de ajuda?</h2>
              <p className="text-muted-foreground">
                Se algo não estiver funcionando como esperado ou você tiver uma ideia de melhoria,
                use o próprio campo de chat aqui na Webly para descrever o problema com o máximo
                de detalhes possível.
              </p>
              <p className="text-muted-foreground">
                Quanto mais específico você for (prints, passos, qual página), mais fácil fica resolver.
              </p>
              <p className="text-muted-foreground">
                Se preferir falar direto com alguém, entre em contato pelo WhatsApp:
                <span className="ml-1 font-medium text-white">+258 857245896</span>.
              </p>
              <a
                href="https://wa.me/258857245896"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors mt-1"
              >
                Abrir conversa no WhatsApp
              </a>
            </div>
          </aside>
        </section>
      </div>
    </AppLayout>
  );
};

export default HelpPage;
