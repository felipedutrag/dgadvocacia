import { NextResponse } from "next/server";

export type NamingSuggestion = {
  nome: string;
  slogan?: string;
  racional: string;
  estilo: string;
  classeSugerida: string;
  distintividadeScore: number;
  pontosFortes: string[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { segmento, descricao, palavrasChave, estilo, classe } = body;

    if (!segmento && !descricao) {
      return NextResponse.json(
        { error: "Informe o segmento ou a descrição do negócio" },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const prompt = `Você é o MarcaShield Naming AI, especialista sênior em Naming Corporativo, Branding e Direito da Propriedade Industrial (Lei 9.279/96 - LPI).
Sua missão é criar 6 sugestões de nomes de marcas comerciais de alto impacto, modernas e com ALTA DISTINTIVIDADE JURÍDICA perante o INPI.

DIRETRIZES DA LPI (Art. 124 da Lei 9.279/96):
- EVITE termos genéricos, descritivos, vulgares ou de uso comum para o segmento (ex: se for advocacia, não use "Justiça", se for café, não use "Grão").
- PRIORIZE marcas Fantasiosas (palavras inventadas) ou Evocativas/Sugestivas sutis.
- Os nomes devem ser fáceis de pronunciar, memoráveis, sonoros e com potencial de registro e concessão no INPI.

BRIEFING DO PROJETO:
- Segmento/Nicho: "${segmento || 'Não especificado'}"
- Descrição da Proposta de Valor: "${descricao || 'Não especificado'}"
- Palavras-Chave de Inspiração: "${palavrasChave || 'Livre'}"
- Estilo Desejado: "${estilo || 'Moderno, Tecnológico e Sofisticado'}"
- Classe Nice Pretendida: "${classe || 'Não especificada'}"

Retorne APENAS um JSON válido seguindo estritamente este formato:
{
  "sugestoes": [
    {
      "nome": "NomeDaMarca",
      "slogan": "Slogan curto de alto impacto",
      "racional": "Explicação linguística e semiótica da criação do nome",
      "estilo": "Fantasiosa",
      "classeSugerida": "Classe Nice 35",
      "distintividadeScore": 95,
      "pontosFortes": [
        "Forte distintividade perante a LPI",
        "Fonética fluida e internacional",
        "Baixa probabilidade de colidência direta"
      ]
    }
  ]
}`;

    // 1. Tentar Gemini (Flash Lite e Flash)
    if (GEMINI_API_KEY) {
      const models = [
        "gemini-2.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-1.5-flash"
      ];

      for (const model of models) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  responseMimeType: "application/json",
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(cleanJson);
              if (parsed.sugestoes && Array.isArray(parsed.sugestoes)) {
                return NextResponse.json(parsed);
              }
            }
          }
        } catch (geminiErr) {
          console.warn(`Erro no Gemini (${model}) Naming:`, geminiErr);
        }
      }
    }

    // 2. Fallback Robusto com Groq
    if (GROQ_API_KEY) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const rawContent = groqData.choices?.[0]?.message?.content;
          if (rawContent) {
            const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.sugestoes && Array.isArray(parsed.sugestoes)) {
              return NextResponse.json(parsed);
            }
          }
        }
      } catch (groqErr) {
        console.warn("Erro no Groq Naming:", groqErr);
      }
    }

    return NextResponse.json(
      { error: "Não foi possível gerar nomes no momento. Verifique as credenciais de IA." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Erro na rota de naming:", error);
    return NextResponse.json({ error: error?.message || "Erro interno" }, { status: 500 });
  }
}
