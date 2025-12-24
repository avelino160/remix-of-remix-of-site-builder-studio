import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Paperclip, ChevronDown, MessageSquare, Mic, ArrowUp } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;

    setGenerating(true);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        "generate-site-config",
        { body: { prompt } }
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
          user_id: user!.id,
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
        title: "Site criado!",
        description: "Redirecionando para o editor...",
      });

      setTimeout(() => {
        navigate(`/app/projects/${project.id}`);
      }, 500);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erro",
        description: "Erro ao gerar site. Tente novamente.",
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient background exactly like Lovable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,hsl(217_91%_60%),transparent_55%),radial-gradient(circle_at_100%_0,hsl(262_83%_58%),transparent_55%),radial-gradient(circle_at_50%_100%,hsl(330_81%_60%),transparent_55%)]" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-24">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-10 tracking-tight text-center">
          Let's create
        </h1>

        {/* Prompt bar */}
        <div className="w-full max-w-3xl">
          <div className="relative rounded-2xl bg-[#202124] shadow-2xl overflow-hidden">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Lovable to help you with coding..."
              disabled={generating}
              className="min-h-[56px] max-h-[200px] resize-none border-0 bg-transparent px-6 py-4 text-base text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/10 h-8 gap-2"
                >
                  <Paperclip className="h-4 w-4" />
                  Attach
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/10 h-8 gap-1"
                >
                  Theme
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || generating}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 gap-2 rounded-lg"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || generating}
                  size="icon"
                  className="h-9 w-9 bg-white/10 hover:bg-white/20 text-white rounded-full"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
