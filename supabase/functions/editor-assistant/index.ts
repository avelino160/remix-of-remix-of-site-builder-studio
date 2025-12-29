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

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const systemPrompt = `Você é um assistente de edição de sites de altíssimo nível dentro de um construtor visual de SaaS moderno.

Você atua como um time composto por:
- Designer UX/UI sênior de SaaS
- Desenvolvedor front-end especialista em produtos modernos
- Especialista em conversão e experiência do usuário

━━━━━━━━━━━━━━━━━━
⚠️ REGRA CRÍTICA DE VARIAÇÃO VISUAL
━━━━━━━━━━━━━━━━━━

Ao editar sites, você DEVE manter a identidade visual única do nicho.

Se a edição resultar em um layout genérico que serve para qualquer nicho, você ERROU.

Mantenha sempre:
- Estrutura do hero específica do nicho
- Estilo emocional coerente (luxo, tech, humano, criativo, etc.)
- Paleta de cores adequada ao contexto
- Direção visual consistente

MENTALIDADE DE PRODUTO
- Você não faz ajustes aleatórios: você mantém a experiência coerente, clara e focada em conversão.
- Nunca transforma o site em algo genérico, amador ou com cara de template.
- Preserve a identidade visual única do nicho ao fazer mudanças.

Você recebe:
- A configuração atual completa do site em JSON (campo "config").
- Uma instrução do usuário dizendo o que deseja mudar.

Sua tarefa:
- Entender a instrução e aplicar as mudanças SOMENTE nesse JSON de configuração.
- Manter a estrutura esperada (palette, sections, typography, spacing, settings).
- Não inventar novos campos fora desse esquema.
- Respeitar uma estrutura de landing page moderna: hero forte, benefícios claros, seções objetivas, prova social, CTA final e footer limpo, quando fizer sentido.
- PRESERVAR a identidade visual do nicho mesmo ao fazer mudanças.

Padrão visual e de conteúdo que você deve preservar ou aprimorar:
- Tipografia moderna e legível (estilo Inter, Poppins, SF Pro ou similar).
- Hierarquia clara (títulos, subtítulos, corpo de texto).
- Espaçamento generoso (white space).
- Cores sóbrias e profissionais, no máximo 2 cores principais bem definidas.
- Textos humanos, diretos e focados em benefício, evitando jargão vazio.
- Foco mobile-first: nada quebra em telas pequenas, seções enxutas.
- Visual específico do nicho, não genérico.

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
- Sempre se pergunte: "Mantive a identidade visual específica do nicho após essa edição?" Se não, refine.
`;



    const userContent =
      `Config atual do site (JSON):\n\n` +
      JSON.stringify(body.config, null, 2) +
      `\n\nInstrução do usuário:\n\n` +
      body.instruction;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Limite de requisições do OpenRouter excedido. Tente novamente em alguns instantes.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const firstChoice = data.choices?.[0];
    const message = firstChoice?.message;
    let content: unknown = message?.content;

    // Handle content returned as array of parts (some providers/models)
    if (Array.isArray(content)) {
      try {
        content = (content as any[])
          .map((part) => {
            if (typeof part === "string") return part;
            if (typeof part === "object" && part !== null) {
              if ("text" in part && typeof (part as any).text === "string") return (part as any).text;
              if ("output_text" in part) {
                const output = (part as any).output_text;
                if (typeof output === "string") return output;
                try {
                  return JSON.stringify(output);
                } catch {
                  return "";
                }
              }
            }
            return "";
          })
          .join("\n")
          .trim();
      } catch (e) {
        console.error("Failed to normalize array content from AI:", e, content);
      }
    }

    // Fallback: some providers may put JSON in tool calls instead of content
    if (!content && (message as any)?.tool_calls?.length) {
      try {
        const toolArgs = (message as any).tool_calls[0]?.function?.arguments;
        if (typeof toolArgs === "string") {
          content = toolArgs;
        } else if (toolArgs) {
          content = JSON.stringify(toolArgs);
        }
      } catch (e) {
        console.error("Failed to extract content from tool_calls:", e, (message as any)?.tool_calls);
      }
    }

    // Final fallback: stringify full message if still nothing
    if (!content && message) {
      try {
        content = JSON.stringify(message);
      } catch (e) {
        console.error("Failed to stringify full message from AI:", e, message);
      }
    }

    if (!content) {
      console.error("No content in AI response after all normalization attempts. Full payload:", JSON.stringify(data, null, 2));
      throw new Error("No content in AI response");
    }

    let parsed;
    try {
      if (typeof content === "string") {
        let cleaned = content.trim();

        // Remove possible Markdown code fences
        cleaned = cleaned.replace(/```json/gi, "").replace(/```/g, "");

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
          console.error("AI response does not contain JSON braces:", cleaned);
          throw new Error("AI response did not contain a valid JSON object");
        }

        const jsonSegment = cleaned.slice(firstBrace, lastBrace + 1);

        // Strip JS-style comments that models sometimes add
        const withoutLineComments = jsonSegment.replace(/\/\/.*$/gm, "");
        const withoutBlockComments = withoutLineComments.replace(/\/\*[\s\S]*?\*\//g, "");

        parsed = JSON.parse(withoutBlockComments);
      } else if (typeof content === "object") {
        // Some models may already return a structured JSON object
        parsed = content;
      } else {
        console.error("Unexpected AI response content type:", typeof content, content);
        throw new Error("Unexpected AI response format");
      }
    } catch (e) {
      console.error("Failed to parse AI response from editor-assistant:", content, "Error:", e);
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
