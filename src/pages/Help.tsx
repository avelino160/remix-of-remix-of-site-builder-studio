import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

        {/* Suporte via tickets */}
        <SupportTicketsSection />
      </div>
    </AppLayout>
  );
};

interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  created_at: string;
}

const SupportTicketsSection = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const loadTickets = async () => {
      if (!user) return;
      setLoadingTickets(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select("id, subject, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast({
          title: "Erro ao carregar tickets",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      } else if (data) {
        setTickets(data as SupportTicket[]);
      }

      setLoadingTickets(false);
    };

    loadTickets();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Faça login para enviar um ticket",
        description: "Entre na sua conta e tente novamente.",
      });
      return;
    }

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      toast({
        title: "Preencha todos os campos",
        description: "Assunto e descrição são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (trimmedSubject.length > 120 || trimmedMessage.length > 2000) {
      toast({
        title: "Texto muito longo",
        description: "Reduza o assunto ou a descrição do problema.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user.id,
        subject: trimmedSubject,
        message: trimmedMessage,
      })
      .select("id, subject, status, created_at")
      .single();

    if (error) {
      console.error(error);
      toast({
        title: "Erro ao enviar ticket",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    if (data) {
      setTickets((prev) => [data as SupportTicket, ...prev]);
      setSubject("");
      setMessage("");

      // Dispara envio de e-mail em background (não bloqueia o usuário)
      supabase.functions
        .invoke("support-ticket-email", {
          body: {
            subject: trimmedSubject,
            message: trimmedMessage,
            userEmail: user.email ?? "sem-email@webly.app",
          },
        })
        .catch((fnError) => {
          console.error("Erro ao chamar função de e-mail", fnError);
        });

      toast({
        title: "Ticket enviado",
        description:
          "Vamos analisar seu pedido o mais rápido possível e você também receberá um e-mail de confirmação.",
      });
    }

    setSubmitting(false);
  };

  return (
    <section className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Enviar um pedido de suporte</h2>
        {!user ? (
          <p className="text-xs text-muted-foreground">
            Faça login para enviar tickets de suporte e acompanhar o andamento dos seus pedidos.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-white" htmlFor="support-subject">
                Assunto
              </label>
              <Input
                id="support-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Problema ao publicar meu site"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-white" htmlFor="support-message">
                Descreva o que está acontecendo
              </label>
              <Textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conte qual página, o que você tentou fazer, mensagens de erro e qualquer outro detalhe relevante."
                className="min-h-[120px] text-xs"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-muted-foreground">
                Não compartilhe senhas ou dados sensíveis neste campo.
              </p>
              <Button
                type="submit"
                size="sm"
                className="text-xs px-3"
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Enviar ticket"}
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#121212] p-5 md:p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white">Seus últimos tickets</h2>
        {!user ? (
          <p className="text-xs text-muted-foreground">
            Entre na sua conta para visualizar o histórico de tickets.
          </p>
        ) : loadingTickets ? (
          <p className="text-xs text-muted-foreground">Carregando tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Você ainda não enviou nenhum ticket. Use o formulário ao lado para abrir o primeiro.
          </p>
        ) : (
          <ul className="space-y-2 text-xs">
            {tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-white line-clamp-2">{ticket.subject}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleString("pt-PT")}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {ticket.status === "open" ? "Aberto" : ticket.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HelpPage;
