import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Paperclip, ChevronDown, MessageSquare, Mic, ArrowUp, ArrowRight, Globe } from "lucide-react";

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
    <div className="h-screen flex bg-[#0A0A0A]">
      <Sidebar />

      <main className="flex-1 ml-16 relative overflow-hidden">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Gift card banner */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <Button
            variant="ghost"
            className="glass rounded-full px-5 py-2 text-white/90 hover:text-white hover:bg-white/10 gap-2"
          >
            🎁 Buy a Lovable gift card
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-screen flex flex-col">
          {/* Center section */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
            <h1 className="text-7xl font-bold text-white mb-12 tracking-tight">
              Let's create
            </h1>

            {/* Prompt bar */}
            <div className="w-full max-w-3xl">
              <div className="relative rounded-2xl bg-[#2A2A2A] shadow-2xl overflow-hidden">
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

          {/* Bottom section - Projects */}
          <div className="relative bg-[#0A0A0A] border-t border-[#2A2A2A]">
            <div className="px-8 py-6">
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
                  className="text-gray-400 hover:text-white gap-2"
                  onClick={() => navigate("/app/projects")}
                >
                  Browse all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Project cards */}
              <div className="grid grid-cols-3 gap-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                    className="group relative bg-white rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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
      </main>
    </div>
  );
}