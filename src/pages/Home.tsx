import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  Paperclip,
  ChevronDown,
  MessageSquare,
  Mic,
  ArrowUp,
  ArrowRight,
  Globe,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  slug: string;
  updated_at: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadRecentProjects();
  }, [user]);

  const loadRecentProjects = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3);

    if (data) setRecentProjects(data);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;

    // Se o usuário não estiver logado, redireciona para a página de login
    if (!user) {
      navigate("/auth");
      return;
    }

    setGenerating(true);

    try {
      const { data: functionData, error: functionError } =
        await supabase.functions.invoke("generate-site-config", {
          body: { prompt },
        });

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

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "Arquivo anexado",
      description: file.name,
    });

    // limpa seleção para poder anexar o mesmo arquivo de novo se quiser
    event.target.value = "";
  };

  return (
    <>
      {/* Fundo com gradiente azul e branco */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-400 to-white">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>


      {/* Conteúdo principal */}
      <div className="relative z-10 min-h-[140vh] flex flex-col">
        {/* Centro */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 pb-40 gap-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight text-center">
            Let's create
          </h1>

          {/* Barra de prompt */}
          <div className="w-full max-w-4xl">
            <div className="relative rounded-[32px] bg-[#202124] shadow-2xl overflow-hidden px-1 pt-1 pb-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Lovable to help you with coding..."
                disabled={generating}
                className="min-h-[64px] max-h-[220px] resize-none border-0 bg-transparent px-6 py-4 text-base text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              <div className="mt-1 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-blue-700 hover:bg-blue-50 h-8 gap-2"
                    type="button"
                    onClick={handleAttachClick}
                  >
                    <Paperclip className="h-4 w-4" />
                    Attach
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-blue-700 hover:bg-blue-50 h-8 gap-1"
                    type="button"
                    onClick={() =>
                      toast({
                        title: "Tema em breve",
                        description:
                          "Aqui você vai poder escolher variações de cor para a página inicial.",
                      })
                    }
                  >
                    Theme
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                    type="button"
                    onClick={() =>
                      toast({
                        title: "Microfone em breve",
                        description:
                          "No futuro você vai poder falar o prompt em vez de digitar.",
                      })
                    }
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
                    className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção inferior de projetos recentes */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="relative bg-[#0A0A0A] border-t border-[#2A2A2A] mt-6">
          <div className="px-10 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-6">
                <button className="text-white font-medium border-b-2 border-white pb-2">
                  Recently viewed
                </button>
                <button className="text-gray-500 hover:text-white pb-2">
                  My projects
                </button>
                <button className="text-gray-500 hover:text-white pb-2">
                  Templates
                </button>
              </div>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-black gap-2"
                onClick={() => navigate("/app/projects")}
              >
                Browse all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                  className="group relative bg-black rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <Globe className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))}

              {recentProjects.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  Nenhum projeto recente. Comece criando seu primeiro site!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
