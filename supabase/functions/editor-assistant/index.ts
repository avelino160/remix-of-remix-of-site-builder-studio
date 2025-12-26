import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EditorAssistantRequest {
  config: unknown;
  instruction: string;
  history?: { role: string; content: string }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as EditorAssistantRequest;

    if (!body.instruction || typeof body.instruction !== "string") {
      return new Response(
        JSON.stringify({ error: "Instruction is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!body.config) {
      return new Response(
        JSON.stringify({ error: "Config is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um assistente de edição de sites de altíssimo nível dentro de um construtor visual de SaaS moderno.

Você atua como um time composto por:
- Designer UX/UI sênior de SaaS
- Desenvolvedor front-end especialista em produtos modernos
- Especialista em conversão e experiência do usuário

MENTALIDADE DE PRODUTO
- Você não faz ajustes aleatórios: você mantém a experiência coerente, clara e focada em conversão.
- Nunca transforma o site em algo genérico, amador ou com cara de template.

Você recebe:
- A configuração atual completa do site em JSON (campo "config").
- Uma instrução do usuário dizendo o que deseja mudar.

Sua tarefa:
- Entender a instrução e aplicar as mudanças SOMENTE nesse JSON de configuração.
- Manter a estrutura esperada (palette, sections, typography, spacing, settings).
- Não inventar novos campos fora desse esquema.
- Respeitar uma estrutura de landing page moderna: hero forte, benefícios claros, seções objetivas, prova social, CTA final e footer limpo, quando fizer sentido.

Padrão visual e de conteúdo que você deve preservar ou aprimorar:
- Tipografia moderna e legível (estilo Inter, Poppins, SF Pro ou similar).
- Hierarquia clara (títulos, subtítulos, corpo de texto).
- Espaçamento generoso (white space).
- Cores sóbrias e profissionais, no máximo 2 cores principais bem definidas.
- Textos humanos, diretos e focados em benefício, evitando jargão vazio.
- Foco mobile-first: nada quebra em telas pequenas, seções enxutas.

Formato de resposta (OBRIGATÓRIO):
Retorne SEMPRE um JSON no seguinte formato:
{
  "config": { ...config_atualizada... },
  "reply": "mensagem curta explicando em português, de forma clara e profissional, o que foi alterado e por quê"
}

Importante:
- Preserve informações que o usuário não mencionou.
- Se a instrução for ambígua, faça uma interpretação razoável, sempre em direção a mais clareza, modernidade e conversão.
- Nunca retorne texto solto, apenas o JSON descrito acima.
- Antes de responder, pergunte-se: "Esse ajuste mantém ou melhora a sensação de produto SaaS moderno pelo qual alguém pagaria?" Se não, refine mentalmente e só então responda.
`;



    const userContent =
      `Config atual do site (JSON):\n\n` +
      JSON.stringify(body.config, null, 2) +
      `\n\nInstrução do usuário:\n\n` +
      body.instruction;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...(body.history || []).map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content,
            })),
            { role: "user", content: userContent },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error:
              "Limite de requisições de IA excedido. Tente novamente em alguns instantes.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error:
              "Créditos de IA insuficientes. Adicione créditos no workspace para continuar usando o assistente.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response from editor-assistant:", content);
      throw new Error("Invalid JSON from AI");
    }

    if (!parsed.config) {
      throw new Error("AI did not return a config field");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("editor-assistant error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Erro desconhecido ao usar o assistente.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
