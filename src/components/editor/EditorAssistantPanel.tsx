import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserCredits } from "@/hooks/useUserCredits";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Send, Loader2, Plus, MessageCircle } from "lucide-react";

interface EditorAssistantPanelProps {
  config: any;
  project: any;
  onConfigChange: (config: any) => void;
  onSave: () => Promise<void> | void;
  onToggleInlineEditing: () => void;
  inlineEditing: boolean;
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
  onToggleInlineEditing,
  inlineEditing,
}: EditorAssistantPanelProps) => {
  const { credits, deductCredit } = useUserCredits();
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Verificar se tem créditos suficientes
    if (credits === null || credits <= 0) {
      toast({
        title: "Créditos insuficientes",
        description: "Você precisa de créditos para usar o assistente de edição. Veja os planos disponíveis.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Descontar 1 crédito antes de enviar para a IA
    const deducted = await deductCredit();
    if (!deducted) {
      toast({
        title: "Erro ao descontar crédito",
        description: "Não foi possível processar seu crédito. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

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
          {!messages.length && (
            <div className="animate-fade-in rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/80">
              <div className="flex items-center gap-2 mb-1.5">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">Como você quer transformar este site?</span>
              </div>
              <p className="text-xs text-white/60">
                Escreva em linguagem natural o que deseja mudar (cores, textos, seções, foco em conversão, tom de voz, etc.). A partir da primeira mensagem, a conversa passa a ser contínua aqui.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.role === "assistant" ? "flex justify-start" : "flex justify-end"
              }
            >
              <div
                className={`animate-fade-in max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  msg.role === "assistant"
                    ? "bg-white/5 text-white"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="px-4 py-4 pt-6">
        <div className="relative flex flex-col gap-3 rounded-3xl border border-white/20 bg-white/5 px-5 py-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Webly..."
            className="min-h-[24px] max-h-[72px] flex-1 resize-none border-0 bg-transparent text-[13px] leading-5 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0"
            disabled={loading}
          />

          <div className="flex items-center justify-between gap-4 pt-0.5">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length) {
                    setUploadedFiles((prev) => [...prev, ...files]);
                    toast({
                      title: "Arquivos carregados",
                      description: `${files.length} arquivo(s) selecionado(s) para usar no seu site dentro do editor.`,
                    });
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant={inlineEditing ? "default" : "ghost"}
                size="sm"
                className="h-8 px-4 rounded-full border border-white/20 text-xs flex items-center gap-1.5"
                disabled={loading}
                onClick={onToggleInlineEditing}
              >
                <span className={inlineEditing ? "text-primary-foreground" : "text-white/80"}>
                  Visual edits
                </span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-4 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-xs"
                disabled={loading}
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                Chat
              </Button>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="h-8 w-8 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center shadow-sm"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
