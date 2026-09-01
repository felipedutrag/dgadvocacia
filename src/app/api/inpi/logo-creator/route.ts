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
Industry: ${segmento || 'Modern Business, Legal, Technology'}.
Design Style: ${estilo || 'Minimalist Luxury, Modern Monogram, Geometric emblem'}.
Color Palette: ${cores || 'Gold, Deep Charcoal, Obsidian, Pure White'}.
Key Symbolism: ${simbolo || 'Abstract shield, geometric symmetry, high authority'}.
Visual requirements: Clean solid dark background, centered composition, sharp edges, no realistic noise, flat vector icon with bold typography, high definition, luxury aesthetic, trademarkable design.`;

    // 1. Chamar Imagen 3 / Gemini Image Generation via Google Generative Language API
    // Endpoint oficial do Imagen 3 na Gemini API: imagen-3.0-generate-002
    try {
      const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;
      const imagenRes = await fetch(imagenUrl, {
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
      });

      if (imagenRes.ok) {
        const data = await imagenRes.json();
        const b64Image = data.predictions?.[0]?.bytesBase64Encoded;
        if (b64Image) {
          return NextResponse.json({
            imageUrl: `data:image/png;base64,${b64Image}`,
            promptUsed: visualPrompt,
            model: "imagen-3.0-generate-002"
          });
        }
      } else {
        const errText = await imagenRes.text();
        console.warn("Imagen 3 API direct error:", errText);
      }
    } catch (imgErr) {
      console.warn("Falha no Imagen 3:", imgErr);
    }

    // 2. Fallback de Geração SVG Direta Ultraclara com Gemini 2.5 Flash
    const svgPrompt = `Crie o código SVG completo e profissional de uma logomarca vetorial para a marca "${nomeMarca}".
Segmento: ${segmento || 'Tecnologia / Jurídico / Corporativo'}.
Estilo: ${estilo || 'Minimalista, Luxo e Geométrico'}.
Cores: ${cores || 'Dourado (#D4AF37), Branco (#FFFFFF) e Grafite Escuro (#18181B)'}.
Símbolo: ${simbolo || 'Monograma estilizado com escudo ou linhas dinâmicas'}.

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
        }),
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
        model: "gemini-2.5-flash-svg"
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
