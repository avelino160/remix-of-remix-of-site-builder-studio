import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SupportEmailPayload {
  subject: string;
  message: string;
  userEmail: string;
}

async function sendSupportEmail({ subject, message, userEmail }: SupportEmailPayload) {
  const apiKey = Deno.env.get("RESEND_API_KEY");

  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return { ok: false, error: "Missing email configuration" };
  }

  const html = `
    <h1>Novo ticket de suporte</h1>
    <p><strong>De:</strong> ${userEmail}</p>
    <p><strong>Assunto:</strong> ${subject}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${message.replace(/\n/g, "<br/>")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Lovable <onboarding@resend.dev>",
      to: ["yuldchissico@gmail.com"],
      subject: `Novo ticket: ${subject}`,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Resend API error", response.status, text);
    return { ok: false, error: "Failed to send email" };
  }

  const data = await response.json();
  console.log("support-ticket-email sent", data);
  return { ok: true };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { subject, message, userEmail }: SupportEmailPayload = await req.json();

    const trimmedSubject = subject?.trim() ?? "";
    const trimmedMessage = message?.trim() ?? "";

    if (!trimmedSubject || !trimmedMessage || !userEmail) {
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (trimmedSubject.length > 120 || trimmedMessage.length > 4000) {
      return new Response(
        JSON.stringify({ error: "Payload too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = await sendSupportEmail({
      subject: trimmedSubject,
      message: trimmedMessage,
      userEmail,
    });

    // Nunca estourar 500 para o cliente: tratar envio de e-mail como "best effort"
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("support-ticket-email error", error);
    // Mesmo em erro inesperado, evitar 500 para não quebrar o app do usuário
    return new Response(
      JSON.stringify({ ok: false, error: "Unexpected error" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
