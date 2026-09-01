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
      ? `ATENÇÃO ESPECIAL (MODO VARIAÇÕES): O usuário gostou do nome "${variacaoDe}". Crie 6 novas variações e desdobramentos inteligentes mantendo a raiz semântica, fonética ou o conceito central de "${variacaoDe}", mas explorando sufixos nobres, prefixos dinâmicos, fusões morfológicas ou sinônimos refinados.`
      : `MISSÃO: Criar 6 nomes de marcas comerciais de altíssimo nível, altamente memoráveis, foneticamente elegantes e com CONEXÃO DIRETA e PROFUNDA com o segmento e proposta de valor do cliente.`;

    const prompt = `Você é o MarcaShield Naming & Brand Strategy AI, autoridade máxima em Naming Corporativo, Semiótica, Linguística Aplicada e Direito da Propriedade Industrial (Lei 9.279/96 - LPI).

${variationClause}

DIRETRIZES CRÍTICAS DE CONEXÃO E RELEVÂNCIA (LEIA COM EXTREMA ATENÇÃO):
1. **PROIBIDO GERAR NOMES ALEATÓRIOS OU DESCONECTADOS**: Cada nome DEVE nascer de raízes etimológicas, metáforas do nicho, analogias reais de valor ou fusões morfológicas (portmanteau) que façam total sentido para o cliente final.
2. **DISTINTIVIDADE LEGAL (Art. 124, VI e XIX da Lei 9.279/96)**:
   - Evite termos genéricos puros ou meramente descritivos (ex: não usar "Café Bom" para café ou "Advocacia Rápida" para direito).
   - Crie nomes **Evocativos/Sugestivos de Alto Impacto**, **Neologismos/Fusões Inteligentes** ou **Fantasiosos com Raízes Léxicas Setoriais** que garantam registro e exclusividade no INPI com risco quase nulo de colidência.
3. **SONORIDADE E FONÉTICA COMERCIAL**: Nomes fáceis de pronunciar, sem encontros consonantais desagradáveis, com excelente ritmo verbal, sem duplo sentido cômico ou pejorativo.
4. **DIVERSIDADE ESTRATÉGICA DAS 6 SUGESTÕES**:
   - Sugestão 1: **Neologismo / Fusão Inteligente (Portmanteau)** (ex: estilo Netflix, Nubank, Spotify, Omie).
   - Sugestão 2: **Evocativo & Metafórico** (remete à sensação, poder, transformação ou resultado gerado).
   - Sugestão 3: **Fantasioso Premium com Raiz Setorial** (palavra exclusiva mas que soa natural e respeitada no nicho).
   - Sugestão 4: **Curto & Punchy (4 a 6 letras)** (impacto rápido, fácil de digitar e viralizar).
   - Sugestão 5: **Moderno & Autoridade Composta** (posicionamento de liderança de mercado).
   - Sugestão 6: **Global / Internacional Fluido** (soa impecável tanto em português quanto internacionalmente).

BRIEFING DETALHADO DO PROJETO:
- **Segmento / Nicho de Atuação:** "${segmento || 'Não especificado'}"
- **Proposta de Valor / Diferenciais:** "${descricao || 'Não especificado'}"
- **Palavras-Chave de Inspiração:** "${palavrasChave || 'Livre'}"
- **Público-Alvo / ICP:** "${publicoAlvo || 'Público Geral e Corporativo'}"
- **Tom de Voz / Personalidade:** "${tomVoz || 'Inovador, Autoritário e Sofisticado'}"
- **Estilo de Naming Preferido:** "${estilo || 'Equilibrado e Moderno'}"
- **Idioma / Raiz Fonética:** "${idiomaOrigem || 'Português e Raiz Latina / Universal'}"
- **Classe Nice Pretendida:** "${classe || 'Identificar automaticamente a classe ideal'}"

Retorne APENAS um JSON válido e estritamente formatado conforme este schema:
{
  "sugestoes": [
    {
      "nome": "NomeDaMarca",
      "slogan": "Tagline ou slogan potente de posicionamento",
      "racional": "Explicação profunda e clara de como este nome foi construído: suas raízes de palavras, significado semiótico e por que ele expressa com precisão o negócio do cliente.",
      "estilo": "Neologismo Inteligente",
      "classeSugerida": "Classe Nice 35 (Serviços de Negócios e Gestão)",
      "distintividadeScore": 95,
      "analiseJuridicaLPI": "Alta registrabilidade perante o Art. 124 da LPI. Não possui caráter genérico direto e ostenta distintividade intrínseca favorável ao deferimento no INPI.",
      "pontosFortes": [
        "Conexão imediata com a proposta de valor do nicho",
        "Fonética fluida de fácil memorização",
        "Alta probabilidade de domínio e handles disponíveis"
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
      "simboloSugerido": "Escudo geométrico minimalista com traços ascendentes que simbolizam crescimento e segurança"
    }
  ]
}`;

    // 1. Tentar Gemini (Flash Models - Primário 3.1 Flash Lite)
    if (GEMINI_API_KEY) {
      const models = [
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash",
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
