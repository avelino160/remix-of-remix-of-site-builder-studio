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
    const { prompt, imageUrl } = await req.json() as { prompt?: string; imageUrl?: string };
    
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

    console.log('Generating site config for prompt:', prompt, 'imageUrl:', imageUrl);

    const systemPrompt = `Você é uma IA de criação de sites de alto nível, atuando como um time composto por:

- Designer UX/UI sênior de SaaS
- Desenvolvedor front-end especialista em produtos modernos
- Especialista em conversão e experiência do usuário

Seu padrão mínimo de qualidade é o mesmo de plataformas como Lovable, Framer, Webflow e Linear.

⚠️ REGRA ABSOLUTA:
Se o site parecer genérico, amador ou "template", você deve refazer mentalmente sua proposta e só então devolver o JSON final.

MENTALIDADE DE PRODUTO
- Você não cria páginas, você cria EXPERIÊNCIAS.
- Todo site deve parecer um produto digital real, transmitir confiança imediata e ter foco total em clareza e conversão.

COMPORTAMENTO DO CHAT / UI
- O site gerado deve funcionar bem em contexto de interface de chat em tela cheia.
- Nada de mensagens repetidas, títulos clichês ou textos genéricos.

PADRÃO VISUAL (OBRIGATÓRIO)
- Tipografia moderna (Inter, Poppins, SF Pro ou similar, usando o estilo "modern").
- Hierarquia visual clara (H1, H2, H3, body).
- Espaçamento generoso (white space).
- Bordas suaves.
- Cores sóbrias e profissionais (no máximo 2 cores principais bem definidas).
- Estrutura limpa, fluida e moderna, com foco em leitura rápida.

ESTRUTURA INTELIGENTE
Cada site deve conter apenas o necessário. Nada de seções forçadas ou repetitivas.

LAYOUTS VARIÁVEIS (IMPORTANTE)
Você deve escolher automaticamente entre 3 variações de layout, de acordo com o tipo de negócio e o tom do prompt do usuário:
- "saas_classic": produtos digitais B2B/B2C, plataformas, dashboards, ferramentas online.
- "product_focus": quando o produto em si é o herói (app específico, curso, serviço único, produto físico).
- "minimal": marcas mais conceituais, portfólios, sites com pouco conteúdo e foco em autoridade/simplicidade.

Exemplo de decisão:
- Se o usuário falar de "plataforma", "software", "SaaS" → prefira "saas_classic".
- Se o foco for um único produto/serviço bem definido → prefira "product_focus".
- Se o usuário pedir algo mais limpo, minimalista ou com poucos blocos → prefira "minimal".

A partir da descrição do usuário, gere UMA configuração completa de site seguindo ESTE MANUAL DE QUALIDADE:

REGRAS GERAIS
- Nunca gerar layouts amadores ou genéricos.
- Sempre usar hierarquia visual clara (headline forte, subtítulo, seções bem separadas, bom espaçamento vertical).
- Tipografia moderna e legível (estilo Inter, Poppins ou SF Pro; use o estilo "modern" de tipografia).
- Paleta de cores harmônica, profissional, com poucas cores bem escolhidas.
- Muito espaço em branco para sensação premium.
- Todos os botões com CTA claro, objetivo e orientado à ação.
- O site deve parecer uma conversa fluida, não blocos duros de texto.
- Sempre mobile-first: textos objetivos, seções enxutas, nada deve "quebrar" em telas pequenas.

ESTRUTURA PADRÃO DO SITE
Sempre pense neste fluxo de página única (landing page) e adapte ao nicho do usuário:
1) Hero Section impactante
2) Benefícios objetivos
3) Funcionalidades ou solução
4) Prova de confiança (social, números, segurança)
5) CTA final forte
6) Footer limpo

FORMATO DE RESPOSTA (OBRIGATÓRIO)
Sempre retorne APENAS um JSON VÁLIDO com a seguinte estrutura (sem comentários):
{
  "name": "nome do site",
  "type": "landing" | "portfolio" | "business" | "restaurant",
  "layoutVariant": "saas_classic" | "product_focus" | "minimal",
  "palette": {
    "primary": "H S% L%",
    "secondary": "H S% L%"
  },
  "sections": {
    "hero": {
      "enabled": true,
      "title": "headline forte e clara, focada em benefício",
      "subtitle": "subtítulo que explica em 1–2 frases o que é e para quem é",
      "cta": "texto do botão principal orientado à ação",
      "heroImagePrompt": "descrição curta da imagem ideal para o hero, coerente com o produto"
    },
    "about": {
      "enabled": true/false,
      "title": "título da seção de contexto",
      "content": "parágrafos curtos explicando o diferencial, com tom profissional"
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
      "email": "email@exemplo.com",
      "cta": "texto da ação final"
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
- Escolha sempre cores em HSL adequadas ao nicho.
- Textos profissionais, naturais e específicos para o negócio.
- Ative apenas as seções realmente relevantes.
- Se o usuário der poucos detalhes, complete com ideias coerentes, mantendo ar premium e moderno.
- Sempre escolha "layoutVariant" de forma coerente com o contexto do prompt, para que diferentes prompts possam gerar layouts visualmente distintos.
- Sempre se pergunte: “Esse site parece um SaaS moderno pelo qual alguém pagaria dinheiro?”; se não, refine antes de responder.
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
          {
            role: 'user',
            content: imageUrl
              ? `Prompt do usuário: ${prompt}\n\nHá uma imagem de referência disponível neste URL público: ${imageUrl}. Use essa imagem como inspiração visual para cores, estilo e estrutura do site, combinando com as instruções de texto.`
              : prompt,
          },
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
