import { NextResponse } from "next/server";

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
    const body = await req.json();
    const {
      segmento,
      descricao,
      publicoAlvo,
      tomVoz,
      estilo,
      idiomaOrigem,
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
      ? `ATENÇÃO ESPECIAL (MODO VARIAÇÕES): O usuário gostou do nome "${variacaoDe}". Crie 3 novas variações e desdobramentos inteligentes mantendo a raiz semântica, fonética ou o conceito central de "${variacaoDe}", mas explorando sufixos nobres, prefixos dinâmicos, fusões morfológicas ou sinônimos refinados.`
      : `MISSÃO: Criar 3 nomes de marcas comerciais de altíssimo nível, altamente memoráveis, foneticamente elegantes, modernos e com CONEXÃO DIRETA e PROFUNDA com o segmento e proposta de valor do cliente.`;

    const prompt = `Você é o MarcaShield Naming & Brand Strategy AI, autoridade máxima em Naming Corporativo, Branding Executivo, Semiótica e Direito da Propriedade Industrial (Lei 9.279/96 - LPI).

${variationClause}

DIRETRIZES CRÍTICAS DE BRANDING E QUALIDADE MERCADOLÓGICA:
1. **NOMES REAIS, ELEGANTES E DE ALTO VALOR PERCEBIDO**:
   - Crie nomes que soem como marcas reais, sólidas e consagradas do mercado nacional e global (ex: Veltis, Primus, Lumina, Vertice, Opus, Kestra, Nexa, Audax, Vanguarda, Legis, etc.).
   - PROIBIDO NOMES CARICATOS OU MITOLÓGICOS LITERAIS (não use clichês forçados como Zeus, Atena, deuses gregos/romanos literais ou traduções infantis como "Clypeo", "Egilex", etc., a menos que haja um contexto semiótico impecável).
   - Para escritórios de advocacia / sociedades jurídicas / consultorias: crie nomes que transmitam imensa sobriedade, sofisticação institucional, peso executivo, rigor e autoridade.
2. **DISTINTIVIDADE LEGAL (Art. 124, VI e XIX da Lei 9.279/96)**:
   - Afaste termos descritivos óbvios (ex: não usar "Advocacia Express" ou "Direito Fácil").
   - Crie termos com excelente distintividade intrínseca (Evocativos de prestígio, Neologismos fonéticos nobres ou Nomes de fantasia corporativa) com altíssima probabilidade de deferimento no INPI.
3. **FONÉTICA E RITMO COMERCIAL**:
   - Nomes fluídos, fáceis de pronunciar, memoráveis no boca a boca e elegantes no cartão de visitas ou fachada corporativa.
4. **DIVERSIDADE ESTRATÉGICA DAS 3 SUGESTÕES**:
   - Sugestão 1: **Neologismo Corporativo / Fusão Nobre** (moderno, sofisticado, sonoro).
   - Sugestão 2: **Evocativo & Institucional** (expressa valor, solidez, liderança e autoridade).
   - Sugestão 3: **Fantasioso Premium / Curto & Punchy** (impactante, exclusivo e fácil de registrar).

BRIEFING DETALHADO DO PROJETO:
- **Segmento / Nicho de Atuação:** "${segmento || 'Não especificado'}"
- **Proposta de Valor / O que o negócio faz:** "${descricao || 'Não especificado'}"
- **Público-Alvo / ICP:** "${publicoAlvo || 'B2B & Corporativo'}"
- **Tom de Voz / Personalidade:** "${tomVoz || 'Autoritário & Nobre'}"
- **Estilo de Naming Preferido:** "${estilo || 'Equilibrado (Mix Estratégico)'}"
- **Idioma / Raiz Fonética:** "${idiomaOrigem || 'Português e Raiz Latina'}"

Retorne APENAS um JSON válido e estritamente formatado conforme este schema (a classe Nice deve ser identificada automaticamente por você com base no segmento):
{
  "sugestoes": [
    {
      "nome": "NomeDaMarca",
      "slogan": "Tagline ou slogan potente de posicionamento",
      "racional": "Explicação profunda de como este nome foi construído: sua raiz fonética/semântica e por que ele expressa autoridade e posicionamento no segmento.",
      "estilo": "Neologismo Corporativo",
      "classeSugerida": "Classe Nice 35 (Serviços de Negócios e Gestão) ou Classe 45 (Serviços Jurídicos)",
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
      "simboloSugerido": "Monograma geométrico minimalista com traços ascendentes que simbolizam solidez e autoridade"
    }
  ]
}`;

    // 1. Tentar Gemini (Primário gemini-3.1-pro-preview)
    if (GEMINI_API_KEY) {
      const models = [
        "gemini-3.1-pro-preview",
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
