import OpenAI from 'npm:openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OnboardingContext {
  brandName: string;
  niche: string;
  objective: string;
  audience: string;
  pain: string;
  offerTitle: string;
  offerDescription: string;
  conversionDestination: string;
}

export interface AiGenerationResult {
  shortBio: string;
  diagnosticTitle: string;
  diagnosticQuestion: string;
  diagnosticOptions: string[];
  recommendationReason: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const ctx: OnboardingContext = await req.json();

    const client = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

    const system = `Você é um redator de conversão especializado em negócios brasileiros que vendem pelo Instagram.
Gere copy autêntico, direto e orientado a resultado em português brasileiro.
Responda APENAS com JSON válido, sem texto adicional, sem markdown.`;

    const ctaLabel: Record<string, string> = {
      whatsapp: 'WhatsApp',
      agenda: 'agendamento',
      formulario: 'formulário',
      checkout: 'página de venda',
    };

    const user = `Negócio: ${ctx.brandName}
Nicho: ${ctx.niche}
Objetivo: ${ctx.objective}
Público-alvo: ${ctx.audience}
Dor principal: ${ctx.pain}
Oferta: ${ctx.offerTitle} — ${ctx.offerDescription}
CTA: ${ctaLabel[ctx.conversionDestination] ?? ctx.conversionDestination}

Retorne este JSON exato:
{
  "shortBio": "bio curta em 1-2 frases, orientada a resultado, sem clichês. Terceira pessoa se for marca, primeira se for pessoa.",
  "diagnosticTitle": "título do diagnóstico — convida a descobrir algo (ex: Encontre o próximo passo certo para você)",
  "diagnosticQuestion": "pergunta principal do quiz — direta e relevante ao nicho",
  "diagnosticOptions": ["opção que revela perfil A", "opção que revela perfil B", "opção que revela perfil C"],
  "recommendationReason": "1-2 frases explicando por que ${ctx.offerTitle} é o próximo passo certo, dado o que o visitante respondeu"
}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 600,
    });

    const result = JSON.parse(completion.choices[0].message.content!) as AiGenerationResult;

    // Garantir que diagnosticOptions é sempre array com 3 itens
    if (!Array.isArray(result.diagnosticOptions) || result.diagnosticOptions.length === 0) {
      result.diagnosticOptions = ['Quero entender melhor', 'Estou pronto para começar', 'Preciso de mais informações'];
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('generate-smartbio error:', err);
    return new Response(
      JSON.stringify({ error: 'Falha na geração. O preview será criado com os valores do formulário.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
