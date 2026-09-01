import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { atividade } = body;

    if (!atividade) {
      return NextResponse.json({ error: "Descreva a atividade do negócio" }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const prompt = `Você é o Especialista Oficial em Classificação Internacional de Nice (NCL) do INPI e Direito Marcário brasileiro.
Analise a atividade econômica descrita pelo usuário e enquadre nas Classes de Nice ideais e forneça a especificação técnica recomendada para o e-Marcas.

ATIVIDADE INFORMADA:
"${atividade}"

DIRETRIZES:
1. Identifique a classe principal (1 a 45) e até 2 classes secundárias correlatas/estratégicas (ex: se for loja de roupas, Classe 25 de vestuário + Classe 35 de e-commerce).
2. Forneça especificações pré-aprovadas pelo INPI que evitem exigências formais.
3. Alerte sobre proteções adicionais importantes.

Retorne APENAS um JSON válido, sem markdown:
{
  "classePrincipal": {
    "numero": 35,
    "titulo": "Propaganda; Gestão de negócios comerciais; Administração comercial; Funções de escritório.",
    "justificativa": "Enquadramento obrigatório para comércio, intermediação, marketing e prestação de serviços a terceiros.",
    "especificacaoSugerida": "Comércio eletrônico de mercadorias em geral; assessoria em gestão empresarial; publicidade e propaganda."
  },
  "classesSecundarias": [
    {
      "numero": 42,
      "titulo": "Serviços científicos e tecnológicos; Desenvolvimento de software e hardware.",
      "justificativa": "Estratégica se a operação envolver plataforma SaaS, tecnologia ou aplicativo próprio.",
      "especificacaoSugerida": "Desenvolvimento e hospedagem de software; fornecimento de software como serviço (SaaS)."
    }
  ],
  "dicaEstrategica": "Recomendamos o depósito multissetorial nas classes 35 e 42 para blindar tanto o modelo comercial quanto a tecnologia."
}`;

    if (GEMINI_API_KEY) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
            }),
          }
        );
        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) return NextResponse.json(JSON.parse(raw));
        }
      } catch (err) {
        console.warn("Gemini Nice fallback:", err);
      }
    }

    if (GROQ_API_KEY) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" },
        }),
      });
      if (groqRes.ok) {
        const data = await groqRes.json();
        const raw = data.choices?.[0]?.message?.content;
        if (raw) return NextResponse.json(JSON.parse(raw));
      }
    }

    return NextResponse.json({ error: "Erro ao enquadrar classes" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro interno" }, { status: 500 });
  }
}
