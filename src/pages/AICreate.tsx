import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2, ArrowLeft, Lightbulb } from "lucide-react";

const AICreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!user || !prompt.trim()) return;

    setGenerating(true);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-site-config',
        { body: { prompt } }
      );

      if (functionError) throw functionError;
      if (!functionData?.config) throw new Error('Configuração inválida retornada pela IA');

      const config = functionData.config;

      const slug = (config.name || 'site')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        + "-" + Date.now();

      const { data: project, error: createError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: config.name || "Novo Site",
          slug,
          type: config.type || "landing",
          status: "draft",
          template: "ai-generated",
          config: {
            palette: config.palette || { primary: "221 83% 53%", secondary: "217 91% 60%" },
            sections: config.sections || {},
            typography: config.typography || "modern",
            spacing: config.spacing || "normal",
            settings: config.settings || {},
          },
        })
        .select()
        .single();

      if (createError) throw createError;

      toast({
        title: "Site criado com IA! ✨",
        description: "Seu site foi gerado automaticamente e está pronto para editar.",
      });

      navigate(`/app/projects/${project.id}`);
    } catch (error: any) {
      console.error('Error generating site:', error);
      toast({
        title: "Erro ao gerar site",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setGenerating(false);
    }
  };

  const examplePrompts = [
    "Crie um site para uma cafeteria artesanal moderna",
    "Quero um portfólio para fotógrafo profissional",
    "Preciso de uma landing page para app de fitness",
    "Site para restaurante italiano tradicional",
    "Landing page para startup de tecnologia",
    "Site para escritório de advocacia",
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && prompt.trim()) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 animate-gradient" />
      
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/app/projects')}
          className="text-white/90 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl space-y-8 text-center">
          {/* Title */}
          <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Vamos criar
          </h1>

          {/* Prompt input bar */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="relative rounded-2xl bg-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Descreva o site que você quer criar..."
                disabled={generating}
                className="min-h-[120px] resize-none border-0 bg-transparent px-6 py-6 text-lg text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                    disabled={generating}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Exemplos
                  </Button>
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || generating}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando site...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Criar com IA
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Example prompts */}
          {!generating && (
            <div className="mx-auto max-w-2xl space-y-3 pt-4">
              <p className="text-sm text-white/70">Ou experimente um destes:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {examplePrompts.slice(0, 4).map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="rounded-lg bg-white/10 px-4 py-3 text-left text-sm text-white/90 backdrop-blur transition-all hover:bg-white/20 hover:scale-[1.02]"
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
};

export default AICreate;
