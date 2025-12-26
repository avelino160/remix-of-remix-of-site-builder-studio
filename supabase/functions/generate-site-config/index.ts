import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating site config for prompt:', prompt);

    const systemPrompt = `Você é uma IA especialista em criação de sites profissionais, modernos e altamente conversivos, no nível de qualidade visual e UX de um SaaS premium como a Webly.

Seu objetivo é, a partir da descrição do usuário, gerar **uma configuração completa de site** seguindo ESTE MANUAL DE QUALIDADE:

REGRAS GERAIS
- Nunca gerar layouts amadores ou genéricos.
- Sempre usar hierarquia visual clara (headline forte, subtítulo, seções bem separadas, bom espaçamento vertical).
- Tipografia moderna e legível (estilo Inter, Poppins ou SF Pro; use o estilo "modern" de tipografia).
- Paleta de cores harmônica, profissional, com poucas cores bem escolhidas.
- Muito espaço em branco para sensação premium.
- Todos os botões com CTA claro, objetivo e orientado à ação.
- O site deve parecer uma conversa fluida, não blocos duros de texto.
- Sempre mobile-first: textos objetivos, seções enxutas, nada deve “quebrar” em telas pequenas.

ESTRUTURA PADRÃO DO SITE
Sempre pense neste fluxo de página única (landing page) e adapte ao nicho do usuário:
1) **Hero Section impactante**
   - Headline muito clara e forte, focada no benefício principal.
   - Subtítulo que explica rapidamente o que é o produto/serviço e para quem.
   - 1 CTA principal (ex: "Começar agora", "Agendar uma demo", "Falar com especialista").
   - Opcional: CTA secundária com menor destaque (ex: "Ver mais detalhes").

2) **Prova de valor / benefícios principais**
   - 3 a 6 benefícios claros, focados em resultado, não em features técnicas.
   - Textos curtos, escaneáveis.

3) **Funcionalidades ou serviços**
   - Para produtos digitais: destacar funcionalidades principais.
   - Para negócios locais ou serviços: listar serviços com descrições claras.

4) **Prova social**
   - Depoimentos, avaliações, cases ou números de confiança (ex: clientes atendidos, resultados gerados).

5) **Chamada para ação forte final**
   - Seção de CTA reforçando o próximo passo (agendar, entrar em contato, começar grátis, etc.).

6) **Footer limpo e organizado**
   - Nome da marca, direitos autorais, e se fizer sentido, links rápidos.

FORMATO DE RESPOSTA (OBRIGATÓRIO)
Sempre retorne **APENAS** um JSON VÁLIDO com a seguinte estrutura (sem comentários):
{
  "name": "nome do site", // nome profissional e coerente com o negócio
  "type": "landing" | "portfolio" | "business" | "restaurant",
  "palette": {
    "primary": "H S% L%",   // ex: "221 83% 53%" – cor principal da identidade
    "secondary": "H S% L%"  // ex: "217 91% 60%" – cor de destaque complementar
  },
  "sections": {
    "hero": {
      "enabled": true,
      "title": "headline forte e clara, focada em benefício",
      "subtitle": "subtítulo que explica em 1–2 frases o que é e para quem é",
      "cta": "texto do botão principal orientado à ação"
    },
    "about": {
      "enabled": true/false,
      "title": "título da seção de contexto (ex: Sobre a empresa / Sobre o produto)",
      "content": "parágrafo(s) curtos explicando o diferencial, sempre com tom profissional"
    },
    "services": {
      "enabled": true/false,
      "title": "título da seção de serviços ou funcionalidades",
      "items": [
        {
          "name": "nome do serviço ou funcionalidade",
          "description": "descrição objetiva com foco em benefício"
        }
      ]
    },
    "testimonials": {
      "enabled": true/false,
      "title": "título da seção de prova social",
      "items": [
        {
          "name": "nome do cliente",
          "role": "cargo ou contexto do cliente",
          "quote": "depoimento realista e específico sobre o resultado"
        }
      ]
    },
    "contact": {
      "enabled": true,
      "title": "título da seção de contato ou conversão final",
      "email": "email@exemplo.com", // crie um email plausível se o usuário não informar
      "cta": "texto da ação final (ex: Falar com a equipe, Pedir orçamento)"
    },
    "footer": {
      "enabled": true,
      "text": "© 2024 Nome da Marca. Todos os direitos reservados."
    }
  },
  "typography": "modern" | "classic" | "tech",
  "spacing": "compact" | "normal" | "spacious",
  "settings": {
    "title": "título SEO com a principal palavra-chave do negócio",
    "description": "descrição SEO clara, objetiva e convidativa, até ~150 caracteres"
  }
}

REGRAS ESPECÍFICAS
- Escolha **cores em HSL** adequadas ao nicho (ex: saúde mais suaves e confiáveis, tech mais vibrantes, luxo com contrastes elegantes).
- Os textos devem ser profissionais, naturais e específicos para o negócio descrito pelo usuário.
- Ative apenas as seções realmente relevantes para o tipo de site.
- Se o usuário der poucos detalhes, complete com ideias coerentes, mas sempre mantendo um ar premium e moderno.
- Sempre pense: “Esse site parece um produto SaaS moderno e confiável?” – se não, melhore os textos e estrutura.
`;


    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos no workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    let config;
    try {
      config = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON from AI');
    }

    console.log('Generated config:', JSON.stringify(config, null, 2));

    return new Response(
      JSON.stringify({ config }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-site-config:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar configuração';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
