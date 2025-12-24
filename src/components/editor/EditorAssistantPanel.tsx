import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";

interface EditorAssistantPanelProps {
  config: any;
  project: any;
  onConfigChange: (config: any) => void;
  onSave: () => Promise<void> | void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const EditorAssistantPanel = ({
  config,
  project,
  onConfigChange,
  onSave,
}: EditorAssistantPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Oi! Eu sou o assistente do editor. Me diga em português o que você quer mudar no site (cores, textos, seções, etc.) e eu ajusto a configuração pra você.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const historyForBackend = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke(
        "editor-assistant",
        {
          body: {
            config,
            instruction: userMessage.content,
            history: historyForBackend,
            project: project
              ? { id: project.id, name: project.name, type: project.type }
              : null,
          },
        },
      );

      if (error) throw error;

      if (!data?.config) {
        throw new Error("Resposta inválida do assistente");
      }

      onConfigChange(data.config);

      // opcionalmente salvar automaticamente
      try {
        await onSave();
      } catch (e) {
        console.error("Erro ao salvar depois da IA:", e);
      }

      const replyText: string =
        typeof data.reply === "string" && data.reply.trim().length > 0
          ? data.reply
          : "Ajustei a configuração do site com base na sua instrução.";

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Editor assistant error", err);
      let description =
        err?.message || "Erro ao falar com o assistente. Tente novamente.";

      if (err?.status === 429) {
        description =
          "Limite de requisições de IA excedido. Aguarde um pouco e tente de novo.";
      }
      if (err?.status === 402) {
        description =
          "Créditos de IA esgotados neste workspace. Adicione créditos para continuar usando o assistente.";
      }

      toast({
        title: "Erro no assistente",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">

      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "assistant"
                  ? "flex justify-start"
                  : "flex justify-end"
              }
            >
              <div
                className={
                  msg.role === "assistant"
                    ? "max-w-[80%] rounded-2xl bg-white/5 px-3 py-2 text-sm text-white"
                    : "max-w-[80%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                }
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-white/20 p-3">
        <div className="relative rounded-2xl bg-black/80 border border-white/15 px-3 py-2 flex items-end gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite o que quer mudar no site..."
            className="min-h-[44px] max-h-[120px] flex-1 resize-none border-0 bg-transparent text-sm text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={loading}
          />

          <div className="flex items-center gap-2 pb-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
              disabled={loading}
            >
              <span className="text-xs font-medium">+</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-3 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-xs"
              disabled={loading}
            >
              Chat
            </Button>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="h-9 w-9 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
