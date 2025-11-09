import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subjectId, subjectName, count = 5 } = await req.json();
    
    if (!subjectId || !subjectName) {
      return new Response(
        JSON.stringify({ error: "subjectId e subjectName são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    console.log(`Gerando ${count} questões para ${subjectName}...`);

    const prompt = `Gere ${count} questões de múltipla escolha sobre ${subjectName} para o ensino fundamental e médio.

Para cada questão, forneça:
1. O texto da questão
2. Quatro alternativas (A, B, C, D)
3. A resposta correta (A, B, C ou D)
4. Nível de dificuldade (easy, medium ou hard)

Formate a resposta EXATAMENTE assim (JSON válido):
{
  "questions": [
    {
      "question_text": "texto da pergunta aqui",
      "option_a": "primeira alternativa",
      "option_b": "segunda alternativa",
      "option_c": "terceira alternativa",
      "option_d": "quarta alternativa",
      "correct_answer": "A",
      "difficulty": "medium"
    }
  ]
}

Certifique-se de que o JSON está válido e complete.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em criar questões educacionais. Sempre responda com JSON válido no formato especificado.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente mais tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("Erro no AI Gateway:", aiResponse.status, errorText);
      throw new Error("Erro ao gerar questões com IA");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Resposta da IA vazia");
    }

    console.log("Resposta da IA:", content);

    // Parse JSON da resposta
    let parsedQuestions;
    try {
      // Remove markdown code blocks se existirem
      const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedQuestions = JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Erro ao fazer parse do JSON:", e);
      console.error("Conteúdo recebido:", content);
      throw new Error("Resposta da IA não está em formato JSON válido");
    }

    if (!parsedQuestions.questions || !Array.isArray(parsedQuestions.questions)) {
      throw new Error("Formato de resposta inválido");
    }

    // Salvar questões no banco
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const questionsToInsert = parsedQuestions.questions.map((q: any) => ({
      subject_id: subjectId,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      difficulty: q.difficulty,
    }));

    const { data, error } = await supabase
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (error) {
      console.error("Erro ao salvar questões:", error);
      throw new Error(`Erro ao salvar questões: ${error.message}`);
    }

    console.log(`${data.length} questões salvas com sucesso`);

    return new Response(
      JSON.stringify({
        success: true,
        count: data.length,
        questions: data,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro na função generate-questions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
