import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nomeMarca, segmento, estilo, cores, simbolo } = body;

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

    // Prompt de Engenharia Visual para Logomarca de Alto Nível
    const visualPrompt = `Professional vector logo design for brand named "${nomeMarca}".
Industry: ${segmento || "Modern Business, Technology, Legal"}.
Design Style: ${estilo || "Minimalist Luxury, Modern Monogram, Geometric emblem"}.
Color Palette: ${cores || "Gold (#D4AF37), Obsidian Black (#09090b), Pure White"}.
Key Symbolism: ${simbolo || "Abstract shield, geometric symmetry, high authority icon"}.
Visual requirements: Clean dark background, centered composition, sharp vector edges, no photo noise, bold typography with trademarkable aesthetic, 4k ultra definition.`;

    // 1. Chamada para o modelo Gemini 3.1 Flash Image Generation
    const imageModels = [
      "gemini-3.1-flash-lite-image",
      "imagen-3.0-generate-002"
    ];

    for (const model of imageModels) {
      try {
        let apiUrl = "";
        let requestBody: any = {};

        if (model.startsWith("imagen-")) {
          apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${GEMINI_API_KEY}`;
          requestBody = {
            instances: [{ prompt: visualPrompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "1:1",
              outputOptions: { mimeType: "image/png" }
            }
          };
        } else {
          apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          requestBody = {
            contents: [
              {
                parts: [
                  { text: visualPrompt }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "image/png"
            }
          };
        }

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        if (res.ok) {
          const data = await res.json();
          // Imagen 3 format
          const b64Image = data.predictions?.[0]?.bytesBase64Encoded;
          if (b64Image) {
            return NextResponse.json({
              imageUrl: `data:image/png;base64,${b64Image}`,
              promptUsed: visualPrompt,
              model
            });
          }

          // Gemini inlineData image format
          const inlinePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
          if (inlinePart?.inlineData?.data) {
            const mime = inlinePart.inlineData.mimeType || "image/png";
            return NextResponse.json({
              imageUrl: `data:${mime};base64,${inlinePart.inlineData.data}`,
              promptUsed: visualPrompt,
              model
            });
          }
        }
      } catch (err) {
        console.warn(`Erro ao gerar imagem com ${model}:`, err);
      }
    }

    // 2. Fallback de Geração SVG Direta Ultraclara com Gemini 2.5 Flash
    const svgPrompt = `Crie o código SVG completo e profissional de uma logomarca vetorial para a marca "${nomeMarca}".
Segmento: ${segmento || "Tecnologia / Corporativo / Jurídico"}.
Estilo: ${estilo || "Minimalista, Luxo e Geométrico"}.
Cores: ${cores || "Dourado (#D4AF37), Branco (#FFFFFF) e Grafite Escuro (#18181B)"}.
Símbolo: ${simbolo || "Monograma estilizado com escudo ou linhas dinâmicas"}.

DIRETRIZES TÉCNICAS:
- Retorne APENAS o código <svg ...>...</svg> válido.
- ViewBox "0 0 500 500", fundo com <rect width="500" height="500" rx="40" fill="#09090b"/>
- Inclua elementos gráficos de alto nível (gradientes lineares com defs, linhas nítidas, tipografia elegante com <text>).
- Sem markdown, sem \`\`\`xml, sem \`\`\`svg. Apenas o SVG puro.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: svgPrompt }] }],
          generationConfig: { temperature: 0.4 }
        })
      }
    );

    if (geminiRes.ok) {
      const geminiData = await geminiRes.json();
      let svgCode = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      svgCode = svgCode.replace(/```xml/g, "").replace(/```svg/g, "").replace(/```/g, "").trim();

      const svgBase64 = Buffer.from(svgCode).toString("base64");
      return NextResponse.json({
        imageUrl: `data:image/svg+xml;base64,${svgBase64}`,
        svgContent: svgCode,
        promptUsed: visualPrompt,
        model: "gemini-3.1-flash-lite-image"
      });
    }

    return NextResponse.json(
      { error: "Não foi possível gerar a logo no momento." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Erro na rota de logo-creator:", error);
    return NextResponse.json({ error: error?.message || "Erro interno" }, { status: 500 });
  }
}
