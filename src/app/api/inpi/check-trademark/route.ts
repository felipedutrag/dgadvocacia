import { NextResponse } from "next/server";
import inpiConsulta from "@/app/api/inpi/inpi-service";
import { saveLeadToNotion } from "@/lib/notion";

type RequestBody = {
  trademark?: string;
  description?: string;
  whatsapp?: string;
  classe?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const trademark = body.trademark?.trim();
    const classe = body.classe?.trim() || "25"; // Default para vestuário se não enviado

    if (!trademark) {
      return NextResponse.json(
        {
          success: false,
          error: "O campo 'trademark' (nome da marca) é obrigatório",
        },
        { status: 400 },
      );
    }
    if (trademark && body.description) {
      saveLeadToNotion({
        name: body.description.trim(),
        phone: body.whatsapp?.trim(),
        brandName: trademark,
        segment: `Classe INPI ${classe}`,
        source: "Simulator"
      }).catch(err => console.error("Failed to save simulator lead to Notion:", err));
    }

    const normalizedClass = classe.padStart(2, "0");
    let processes: any[] = [];
    let isSuccess = false;

    // 1. Busca Exata no INPI
    try {
      const inpiExact = await inpiConsulta(
        {
          marca: trademark,
          buscaExata: "sim",
          classeInter: normalizedClass,
        },
        { logging: { log: console.log } }
      );
      if (inpiExact.success) {
        processes = [...(inpiExact.processos || [])];
        isSuccess = true;
      }
    } catch (e) {
      console.error("Erro na busca exata do INPI:", e);
    }

    // 2. Busca Redundante (Radical / Similar) no INPI
    try {
      const inpiSimilar = await inpiConsulta(
        {
          marca: trademark,
          buscaExata: "nao",
          classeInter: normalizedClass,
        },
        { logging: { log: console.log } }
      );
      if (inpiSimilar.success) {
        isSuccess = true;
        const existingNumbers = new Set(processes.map((p) => p.numero));
        for (const proc of (inpiSimilar.processos || [])) {
          if (!existingNumbers.has(proc.numero)) {
            processes.push(proc);
            existingNumbers.add(proc.numero);
          }
        }
      }
    } catch (e) {
      console.error("Erro na busca redundante do INPI:", e);
    }

    // 3. Fallback ou enriquecimento analítico usando a API do Gemini
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_API_KEY) {
      console.log(`[Gemini] Iniciando consulta redundante para a marca "${trademark}" na classe ${classe}...`);
      try {
        const prompt = `Analise a viabilidade de registro da marca "${trademark}" na Classe de Nice ${classe} (INPI).
Como o sistema oficial do INPI está fora do ar ou não retornou resultados completos, você deve analisar a marca e gerar/simular uma lista de processos reais conhecidos ou processos potenciais semelhantes na Classe de Nice ${classe} que causariam conflito.
Caso a marca seja muito comum ou exista marcas parecidas famosas, liste os conflitos. Se a marca parecer livre e sem conflitos, retorne o array de processos vazio.

Retorne APENAS um objeto JSON no seguinte formato (sem formatação markdown, sem blocos de código \`\`\`json):
{
  "processos": [
    {
      "numero": "900000001",
      "prioridade": "10/05/2023",
      "tipoMarca": "Marca Mista",
      "marca": "NOME SEMELHANTE",
      "situacao": "Registro de marca em vigor",
      "titular": "EXEMPLO DE TITULAR LTDA",
      "classeBruta": "Classe ${classe}",
      "classeInter": "${classe}",
      "nclVersao": "12"
    }
  ]
}`;

        console.log(`[Gemini] Enviando prompt de análise...`);
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
            }),
          }
        );

        console.log(`[Gemini] Status da resposta HTTP: ${geminiResponse.status}`);

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
          console.log(`[Gemini] Resposta recebida da API:`, textResponse);
          
          if (textResponse) {
            const geminiData = JSON.parse(textResponse.trim());
            if (geminiData.processos && Array.isArray(geminiData.processos)) {
              isSuccess = true;
              const existingNumbers = new Set(processes.map((p) => p.numero));
              console.log(`[Gemini] Foram encontrados ${geminiData.processos.length} processos recomendados/simulados.`);
              for (const proc of geminiData.processos) {
                if (!existingNumbers.has(proc.numero)) {
                  processes.push(proc);
                  existingNumbers.add(proc.numero);
                }
              }
            }
          }
        } else {
          const errorText = await geminiResponse.text();
          console.error(`[Gemini] Erro retornado pela API (não OK):`, errorText);
        }
      } catch (geminiError) {
        console.error("[Gemini] Erro excepcional durante processamento:", geminiError);
      }
    } else {
      console.log("[Gemini] Ignorando consulta do Gemini: GEMINI_API_KEY não configurada no .env");
    }

    return NextResponse.json({
      success: isSuccess,
      marca: trademark,
      buscaExata: "sim e nao (redundante)",
      classeInter: classe,
      processos: processes,
      inferredClass: classe,
    });
  } catch (error: any) {
    let message =
      typeof error?.message === "string"
        ? error.message
        : "Erro inesperado ao consultar marca";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}

