import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nomeMarca,
      segmento,
      estilo,
      cores,
      simbolo,
      instrucoes,
      fundoTransparente = true,
      formatoDesejado = "vetor_svg"
    } = body;

    if (!nomeMarca) {
      return NextResponse.json(
        { error: "Nome da marca é obrigatório" },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Chave GEMINI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const bgInstruction = fundoTransparente
      ? "FUNDO 100% TRANSPARENTE (sem <rect> opaco de fundo, viewBox limpo para isolamento total da marca e tipografia)."
      : 'Fundo escuro nobre com acabamento Dark Luxury (<rect width="100%" height="100%" rx="28" fill="#09090B"/>).';

    const customInstructionsText = instrucoes?.trim()
      ? `- Instruções e Preferências Especiais do Usuário: "${instrucoes.trim()}"`
      : "";

    const symbolGuideline = simbolo
      ? `Símbolo / Elemento Gráfico Desejado: ${simbolo}`
      : `Identidade Visual: Monograma geométrico minimalista e lapidado com a letra inicial de "${nomeMarca}", linhas limpas de alta autoridade, proporção áurea e equilíbrio visual absoluto.`;

    // ── 1. MOTOR PRIMÁRIO ABSOLUTO: VETOR SVG MATEMÁTICO DE ALTA DEFINIÇÃO ──
    // Garante tipografia 100% nítida e legível, sem artefatos ou letras distorcidas de IA de imagem.
    const svgPrompt = `Você é um Diretor de Arte Sênior especializado em Identidade Visual Corporativa de Luxo e Engenheiro Especialista em SVG nativo.
Crie um código SVG autônomo, ultra-refinado e matematicamente perfeito para a logomarca oficial de: "${nomeMarca}".

INFORMAÇÕES DE BRANDING:
- Nome da Marca: "${nomeMarca}"
- Segmento / Mercado: ${segmento || "Corporativo / Tecnologia / Advocacia / Negócios de Alto Padrão"}
- Estilo Visual: ${estilo || "Minimalista & Luxo (Dark Luxury, Tipografia Nobre, Geometria Suíça)"}
- Cores Selecionadas: ${cores || "Dourado Nobre (#D4AF37), Preto Obsidiana (#09090B)"}
- ${symbolGuideline}
${customInstructionsText}
- Fundo: ${bgInstruction}

DIRETRIZES TÉCNICAS E ESTÉTICAS DE DESIGN (ESTRITAMENTE OBRIGATÓRIAS):
1. **Dimensões & ViewBox:** Use viewBox="0 0 800 600" com proporções centralizadas horizontal e verticalmente.
2. **Definições (<defs>):**
   - Crie gradientes lineares e radiais refinados com IDs únicos (ex: <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">...) para dar efeito metálico (ouro, cromo, titânio, neon ou esmeralda).
   - Se aplicável, adicione filtro de sombra suave (<filter id="softGlow" ...> ou <filter id="dropShadow" ...>) para profundidade premium.
3. **Ícone / Monograma Central (Topo / Centro Superior):**
   - Construa um ícone vetorial lapidado através de <path>, <polygon> ou <circle> geométricos com espessuras de traço elegantes (stroke-width) ou preenchimentos com gradiente.
   - O símbolo deve ser icônico, moderno, simétrico e memorável (ex: escudo estilizado, coroa lapidada, nó neural, monograma interligado).
   - Posicione o símbolo centralizado em torno de y: 140 a 280.
4. **Tipografia do Nome da Marca (Centro Inferior):**
   - Use tag <text> com font-family="system-ui, -apple-system, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif".
   - text-anchor="middle", x="400", y="390 a 430".
   - font-size entre 44 e 58, font-weight="800" ou "900", letter-spacing="3px" a "6px" para elegância e legibilidade máxima.
   - fill com gradiente ou cor de alto contraste.
5. **Subtítulo / Segmento de Apoio (Opcional refinado):**
   - Adicione o segmento ou uma descrição curta em <text x="400" y="450 a 470" font-size="14" font-weight="600" letter-spacing="4px" fill="#A1A1AA" text-anchor="middle" text-transform="uppercase">.
6. **Formato de Saída:**
   - Responda EXCLUSIVAMENTE com o elemento SVG válido (iniciando em <svg ...> e terminando em </svg>).
   - NÃO inclua explicações, comentários fora da tag ou blocos de markdown (\`\`\`xml ou \`\`\`svg).`;

    const svgModels = [
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-1.5-flash"
    ];

    for (const model of svgModels) {
      try {
        const geminiSvgRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: svgPrompt }] }],
              generationConfig: {
                temperature: 0.25,
                maxOutputTokens: 8192
              }
            })
          }
        );

        if (geminiSvgRes.ok) {
          const geminiData = await geminiSvgRes.json();
          let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          rawText = rawText
            .replace(/```xml/gi, "")
            .replace(/```svg/gi, "")
            .replace(/```/g, "")
            .trim();

          const svgMatch = rawText.match(/<svg[\s\S]*<\/svg>/i);
          let svgCode = "";
          if (svgMatch) {
            svgCode = svgMatch[0];
          } else if (rawText.startsWith("<svg")) {
            svgCode = rawText;
          }

          if (svgCode && svgCode.includes("</svg>")) {
            const svgBase64 = Buffer.from(svgCode).toString("base64");
            const dataUri = `data:image/svg+xml;base64,${svgBase64}`;

            return NextResponse.json({
              success: true,
              imageUrl: dataUri,
              svgContent: svgCode,
              isVector: true,
              fundoTransparente,
              model: `${model} (Vector Engine)`,
              promptUsed: svgPrompt
            });
          }
        } else {
          console.warn(`Tentativa SVG com ${model} status ${geminiSvgRes.status}`);
        }
      } catch (svgErr) {
        console.warn(`Erro ao gerar SVG com ${model}:`, svgErr);
      }
    }

    // ── 2. FALLBACK DE CONTINGÊNCIA (Caso a síntese vetorial falhe) ──
    const visualPrompt = `Vector style logo icon for brand "${nomeMarca}", industry: ${segmento || "Corporate Business"}, style: ${estilo || "Minimalist Luxury"}, colors: ${cores || "Gold and Black"}, isolated on pure black background, flat graphic design, clean crisp edges, 4k.`;

    try {
      const imgRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: visualPrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "1:1",
              outputOptions: { mimeType: "image/png" }
            }
          })
        }
      );

      if (imgRes.ok) {
        const data = await imgRes.json();
        const b64Image = data.predictions?.[0]?.bytesBase64Encoded;
        if (b64Image) {
          return NextResponse.json({
            success: true,
            imageUrl: `data:image/png;base64,${b64Image}`,
            isVector: false,
            fundoTransparente: false,
            model: "Imagen 3.0 (Raster Fallback)",
            promptUsed: visualPrompt
          });
        }
      }
    } catch (imgErr) {
      console.warn("Erro no fallback do Imagen 3:", imgErr);
    }

    return NextResponse.json(
      { error: "Não foi possível renderizar a logomarca no momento. Tente novamente." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Erro na rota de logo-creator:", error);
    return NextResponse.json({ error: error?.message || "Erro interno" }, { status: 500 });
  }
}
