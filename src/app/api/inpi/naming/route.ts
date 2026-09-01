import { NextResponse } from "next/server";
import { checkFeatureQuota, incrementFeatureQuota } from "@/lib/quotas";

export type NamingSuggestion = {
  nome: string;
  slogan?: string;
  racional: string;
  estilo: string;
  classeSugerida: string;
  distintividadeScore: number;
  analiseJuridicaLPI?: string;
  pontosFortes: string[];
  sugestoesDominio?: string[];
  paletaRecomendada?: {
    nome: string;
    cores: string[];
  };
  simboloSugerido?: string;
};

export async function POST(req: Request) {
  try {
    // Checagem de Quota: 1 uso grátis para não-pagantes
    const quotaCheck = await checkFeatureQuota("naming");
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.error, limitReached: true, upgradeRequired: true },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      segmento,
      descricao,
      palavrasChave,
      publicoAlvo,
      tomVoz,
      estilo,
      idiomaOrigem,
      classe,
      variacaoDe,
    } = body;

    if (!segmento && !descricao && !variacaoDe) {
      return NextResponse.json(
        { error: "Informe o segmento, a proposta de valor ou a marca base para variações." },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const variationClause = variacaoDe
      ? `ATENÇÃO ESPECIAL (MODO VARIAÇÕES): O usuário gostou do nome "${variacaoDe}". Crie 3 novas variações e desdobramentos inteligentes mantendo a raiz semântica, fonética ou o conceito central de "${variacaoDe}", explorando sufixos nobres, prefixos dinâmicos, fusões morfológicas ou sinônimos refinados de alto valor.`
      : `MISSÃO: Criar exatamente 3 nomes comerciais de altíssimo nível, altamente contextuais, memoráveis, foneticamente elegantes e com CONEXÃO DIRETA e PROFUNDA com o nicho e a proposta de valor informada.`;

    const prompt = `Você é o Diretor Criativo e Estrategista Sênior de Naming do MarcaShield AI, autoridade máxima em Naming Corporativo, Semiótica de Marca, Linguística Aplicada e Direito da Propriedade Industrial (Lei nº 9.279/96 - LPI).

${variationClause}

DIRETRIZES DE EXCELÊNCIA CONTEXTUAL & JURÍDICA:
1. **CONEXÃO CONTEXTUAL PROFUNDA (SEM NOMES GENÉRICOS OU ALEATÓRIOS)**:
   - Cada nome deve ser construído a partir de metáforas vivas do segmento, raízes etimológicas latinas/gregas/anglo pertinentes, ou fusões semânticas precisas que transmitam autoridade, confiança e transformação.
   - O nome DEVE refletir o público-alvo, a proposta de valor e a atmosfera do negócio informado.

2. **BLINDAGEM JURÍDICA & DISTINTIVIDADE NO INPI (Art. 124 da LPI)**:
   - Proibido termos meramente descritivos ou de uso comum que possam sofrer exigência ou indeferimento por falta de distintividade (Art. 124, VI e XIX).
   - Foque em nomes com alta registrabilidade, probabilidade de deferimento sem oposição e facilidade de registro de domínios (.com.br e .com).

3. **ESTRUTURA DAS 3 SUGESTÕES ESTRATÉGICAS**:
   - **Sugestão 1: Neologismo Inteligente / Fusão Morfológica (Portmanteau)**: União de dois conceitos centrais do nicho em uma palavra única, fluida e marcante (ex: estilo Nubank, Spotify, Omie).
   - **Sugestão 2: Evocativo & Semiótico de Alto Impacto**: Nome que evoca a transformação, liderança, precisão ou o resultado que o negócio entrega.
   - **Sugestão 3: Fantasioso Nobre / Conceitual Premium**: Nome curto, punchy e sofisticado com raiz fonética setorial, transmitindo status e escala.

BRIEFING DETALHADO DO PROJETO:
- **Segmento / Nicho de Atuação:** "${segmento || 'Não especificado'}"
- **Proposta de Valor / Diferenciais:** "${descricao || 'Não especificado'}"
- **Palavras-Chave de Inspiração:** "${palavrasChave || 'Livre'}"
- **Público-Alvo / ICP:** "${publicoAlvo || 'Público Geral e Corporativo'}"
- **Tom de Voz / Personalidade:** "${tomVoz || 'Inovador, Autoritário e Sofisticado'}"
- **Estilo de Naming Preferido:** "${estilo || 'Equilibrado e Moderno'}"
- **Idioma / Raiz Fonética:** "${idiomaOrigem || 'Português e Raiz Latina / Universal'}"
- **Classe Nice Pretendida:** "${classe || 'Identificar automaticamente a classe ideal'}"

Retorne APENAS um JSON válido e estritamente formatado com exatamente 3 sugestões conforme este schema:
{
  "sugestoes": [
    {
      "nome": "NomeDaMarca",
      "slogan": "Tagline ou slogan potente e contextual de posicionamento",
      "racional": "Explicação profunda e contextual de como este nome foi construído: raízes lexicais, significado semiótico e por que ele expressa com precisão cirúrgica a proposta do negócio.",
      "estilo": "Neologismo Inteligente",
      "classeSugerida": "Classe Nice 35 (Serviços de Negócios e Gestão)",
      "distintividadeScore": 96,
      "analiseJuridicaLPI": "Excelente distintividade intrínseca perante o Art. 124 da LPI. Alta probabilidade de concessão decenal sem colidência com marcas registradas.",
      "pontosFortes": [
        "Conexão contextual imediata com a proposta de valor do nicho",
        "Fonética agradável e memorização instantânea",
        "Elevada probabilidade de domínios e redes sociais livres"
      ],
      "sugestoesDominio": [
        "nomedamarca.com.br",
        "nomedamarca.com",
        "usenomedamarca.com.br"
      ],
      "paletaRecomendada": {
        "nome": "Dark Luxury & Ouro",
        "cores": ["#D4AF37", "#09090B", "#F4F4F5"]
      },
      "simboloSugerido": "Símbolo geométrico minimalista e moderno que reforça o conceito central da marca"
    }
  ]
}`;

    // 1. Tentar Gemini (Primário: gemini-3.1-pro-preview)
    if (GEMINI_API_KEY) {
      const models = [
        "gemini-3.1-pro-preview",
        "gemini-2.5-pro",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash"
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
                  temperature: 0.65,
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
              if (parsed.sugestoes && Array.isArray(parsed.sugestoes) && parsed.sugestoes.length > 0) {
                if (!quotaCheck.isPaid && quotaCheck.userId) {
                  await incrementFeatureQuota("naming", quotaCheck.userId);
                }
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
            temperature: 0.65,
            response_format: { type: "json_object" },
          }),
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const rawContent = groqData.choices?.[0]?.message?.content;
          if (rawContent) {
            const cleanJson = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.sugestoes && Array.isArray(parsed.sugestoes) && parsed.sugestoes.length > 0) {
              if (!quotaCheck.isPaid && quotaCheck.userId) {
                await incrementFeatureQuota("naming", quotaCheck.userId);
              }
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
