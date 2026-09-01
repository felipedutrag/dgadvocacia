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
      ? `ATENÇÃO ESPECIAL (MODO VARIAÇÕES): O usuário selecionou a marca base "${variacaoDe}". Crie 3 variações sofisticadas mantendo a raiz, sonoridade ou essência de "${variacaoDe}", aplicando prefixos modernos, sufixos corporativos ou fusões sonoras elegantes.`
      : `MISSÃO: Criar exatamente 3 opções de nomes comerciais de padrão internacional, com sonoridade impecável, forte conexão com o nicho de mercado e altíssimo valor percebido.`;

    const prompt = `Você é um Diretor de Branding e Naming Corporativo de padrão global (com a expertise de agências como Pentagram, Landor e Lexicon Branding) e especialista em Propriedade Industrial (Lei 9.279/96 - LPI).

${variationClause}

CRITÉRIOS INEGOCIÁVEIS DE QUALIDADE (LEIA COM EXTREMA ATENÇÃO):
1. **NOMES REAIS, ELEGANTES E MERCADOLOGICAMENTE IMPECÁVEIS**:
   - Os nomes devem soar como marcas reais, sólidas e consagradas do mercado corporativo (exemplos do padrão esperado: *Vértice, Opus, Lumina, Veltis, Primare, Strata, Solvo, Omnia, Argos, Nexo, Veris, Síntese, Aliança, Vectra, Actos, Vanguard*).
   - **PROIBIDO NOMES CARICATOS, ESTRANHOS OU ARTIFICIAIS**: Não crie palavras que pareçam remédios, desenhos animados ou deuses mitológicos literais (ex: NUNCA crie nomes como "Egilex", "Clypeo", "Baluarte Magno", "Zeus Jurídico", "LexoTron").
   - O nome precisa passar no "Teste da Fachada Executiva": soaria respeitável, sóbrio e imponente em uma placa de aço escovado, cartão corporativo ou contrato de alto valor?

2. **CONEXÃO COM O SEGMENTO INFORMADO**:
   - Se for Advocacia / Jurídico: sobriedade, autoridade, peso institucional, ética, segurança e estratégia.
   - Se for Tecnologia / SaaS / Startups: moderno, dinâmico, curto, memorável e escalável.
   - Se for Saúde / Clínicas: precisão, acolhimento nobre, confiança e rigor científico.
   - Se for Varejo / Serviços / Outros: atrativo, sonoro e memorável no boca a boca.

3. **DISTINTIVIDADE LEGAL E REGISTRABILIDADE (Art. 124 da Lei 9.279/96)**:
   - Afaste termos descritivos genéricos ou vulgares (ex: não usar "Direito Rápido", "Super Advogados").
   - Crie termos com distintividade intrínseca (Evocativos nobres, Neologismos fonéticos elegantes ou Fantasia pura).

4. **ESTRUTURA DAS 3 PROPOSTAS EXCLUSIVAS**:
   - **Opção 1:** *Neologismo Corporativo Nobre* (fusão sutil de termos com sonoridade fluida e moderna).
   - **Opção 2:** *Evocativo Institucional* (palavra real ou derivada com raiz semântica de autoridade, solidez e prestígio).
   - **Opção 3:** *Curto, Punchy & Premium* (nome conciso de 4 a 7 letras, de altíssimo impacto e fácil memorização).

BRIEFING DO CLIENTE:
- **Segmento / Nicho:** "${segmento || 'Não especificado'}"
- **Proposta de Valor / Atividade:** "${descricao || 'Não especificado'}"

Retorne APENAS um JSON válido no formato abaixo, sem markdown adicional fora do json:
{
  "sugestoes": [
    {
      "nome": "NomeDaMarca",
      "slogan": "Slogan maduro e direto de posicionamento",
      "racional": "Explicação clara e profissional da origem da palavra e por que ela posiciona o negócio com autoridade no seu nicho.",
      "estilo": "Neologismo Corporativo / Evocativo Institucional / Curto & Punchy",
      "classeSugerida": "Classe Nice indicada para o segmento (ex: Classe 45 para Jurídico, Classe 35 para Negócios, etc.)",
      "distintividadeScore": 95,
      "analiseJuridicaLPI": "Análise técnica sucinta sobre o Art. 124 da LPI e registrabilidade perante o INPI.",
      "pontosFortes": [
        "Sonoridade executiva e fácil pronúncia",
        "Alta diferenciação frente aos concorrentes do setor",
        "Excelente adaptabilidade para identidade visual e digital"
      ],
      "sugestoesDominio": [
        "nomedamarca.com.br",
        "nomedamarca.com",
        "gruponomedamarca.com.br"
      ],
      "paletaRecomendada": {
        "nome": "Harmonia Corporativa Premium",
        "cores": ["#D4AF37", "#09090B", "#F4F4F5"]
      },
      "simboloSugerido": "Conceito visual clean e minimalista adequado para o segmento"
    }
  ]
}`;

    // 1. Tentar Gemini (gemini-3.6-flash na geração de marcas)
    if (GEMINI_API_KEY) {
      const models = [
        "gemini-3.6-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
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
