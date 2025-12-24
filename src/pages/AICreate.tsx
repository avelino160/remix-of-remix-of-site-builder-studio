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
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Back button */}
      <div className="absolute top-8 left-8 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/app/projects')}
          className="text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl space-y-12">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold text-white md:text-7xl lg:text-8xl tracking-tight">
              O que vamos criar?
            </h1>
            <p className="text-xl text-gray-400">
              Descreva seu projeto e a IA irá criar para você
            </p>
          </div>

          {/* Prompt input bar */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity" />
              <div className="relative rounded-2xl bg-[#1A1A1A] border border-white/10 shadow-2xl overflow-hidden">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ex: Um site para uma cafeteria moderna com galeria de fotos..."
                  disabled={generating}
                  className="min-h-[140px] resize-none border-0 bg-transparent px-6 py-6 text-lg text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                
                <div className="flex items-center justify-end border-t border-white/10 px-4 py-4 bg-[#141414]">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || generating}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 font-semibold px-8"
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
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap gap-2 justify-center">
                {examplePrompts.slice(0, 4).map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="rounded-full bg-white/5 px-5 py-2.5 text-sm text-gray-400 border border-white/10 backdrop-blur transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
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
