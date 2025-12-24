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

    const systemPrompt = `Você é um especialista em criar configurações de sites profissionais. 
Baseado na descrição do usuário, você deve gerar uma configuração de site completa e profissional.

Retorne um JSON com a seguinte estrutura:
{
  "name": "nome do site",
  "type": "landing" | "portfolio" | "business" | "restaurant",
  "palette": {
    "primary": "221 83% 53%",
    "secondary": "217 91% 60%"
  },
  "sections": {
    "hero": {
      "enabled": true,
      "title": "título chamativo",
      "subtitle": "descrição convincente",
      "cta": "texto do botão"
    },
    "about": {
      "enabled": true/false,
      "title": "título da seção",
      "content": "conteúdo completo"
    },
    "services": {
      "enabled": true/false,
      "title": "título da seção"
    },
    "testimonials": {
      "enabled": true/false,
      "title": "título da seção"
    },
    "contact": {
      "enabled": true,
      "title": "título da seção",
      "email": "email@exemplo.com"
    },
    "footer": {
      "enabled": true,
      "text": "© 2024 Nome do Site"
    }
  },
  "typography": "modern" | "classic" | "tech",
  "spacing": "compact" | "normal" | "spacious",
  "settings": {
    "title": "título SEO",
    "description": "descrição SEO"
  }
}

Escolha cores apropriadas para o tipo de negócio (HSL format: "hue saturation% lightness%").
Escreva textos profissionais, convincentes e específicos para o tipo de negócio descrito.
Ative apenas as seções relevantes para o tipo de site.`;

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
