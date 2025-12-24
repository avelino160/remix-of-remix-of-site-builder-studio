import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2, ArrowLeft } from "lucide-react";

const examplePrompts = [
  "Criar um site para uma cafeteria moderna com menu e galeria",
  "Landing page para startup de tecnologia com seção de recursos",
  "Portfolio minimalista para fotógrafo profissional",
  "Site institucional para consultoria empresarial",
];

export default function AICreate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;

    setGenerating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para criar sites",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        "generate-site-config",
        {
          body: { prompt },
        }
      );

      if (functionError) throw functionError;
      if (!functionData?.config) throw new Error("No config returned");

      const config = functionData.config;
      const slug = config.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: config.name,
          slug,
          type: config.type || "landing",
          status: "draft",
          config,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      toast({
        title: "Site criado com sucesso!",
        description: "Redirecionando para o editor...",
      });

      setTimeout(() => {
        navigate(`/app/projects/${project.id}`);
      }, 500);

    } catch (error: any) {
      console.error("Error generating site:", error);
      
      let errorMessage = "Erro ao gerar site. Tente novamente.";
      if (error.message?.includes("429")) {
        errorMessage = "Limite de requisições excedido. Tente novamente em alguns instantes.";
      } else if (error.message?.includes("402")) {
        errorMessage = "Créditos insuficientes. Adicione créditos no workspace.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background dark">
      {/* Animated mesh gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-mesh-1" />
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-mesh-2" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] animate-mesh-3" />
      </div>
      
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/app/projects')}
          className="glass text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl space-y-12">
          {/* Title */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-6xl font-bold text-foreground md:text-7xl lg:text-[5.5rem] tracking-tight leading-tight">
              O que vamos criar?
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Descreva seu projeto e a IA irá criar para você
            </p>
          </div>

          {/* Prompt input bar */}
          <div className="mx-auto w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/50 to-blue-600/50 rounded-2xl opacity-0 blur group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative glass rounded-2xl shadow-2xl overflow-hidden">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: Um site para uma cafeteria moderna com galeria de fotos..."
                  disabled={generating}
                  className="min-h-[140px] resize-none border-0 bg-transparent px-6 py-6 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                
                <div className="flex items-center justify-end border-t border-border/50 px-4 py-4 bg-card/30">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || generating}
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 font-semibold px-6 transition-all duration-200"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Criar site
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Example prompts */}
          {!generating && (
            <div className="mx-auto w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-wrap gap-2 justify-center">
                {examplePrompts.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="rounded-full glass px-4 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:scale-105"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}