import { NextResponse } from "next/server";

export type AiViabilityReport = {
  score: number; // 0 to 100
  nivelRisco: "BAIXO" | "MÉDIO" | "ALTO";
  titulo: string;
  resumo: string;
  motivosColidencia: string[];
  recomendacoes: string[];
  parecerJuridico: string;
  conflitosCriticos: Array<{
    numero: string;
    marca: string;
    situacao: string;
    titular: string;
    risco: string;
  }>;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { marca, classe, processos } = body;

    if (!marca) {
      return NextResponse.json({ error: "Nome da marca é obrigatório" }, { status: 400 });
    }

    const procsList = Array.isArray(processos) ? processos.slice(0, 30) : [];
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const prompt = `Você é o MarcaShield AI, um sistema sênior de inteligência em Propriedade Intelectual e Direito Marcário brasileiro (Lei 9.279/96 - LPI).
Analise a viabilidade de registro da marca pretendida com base nos processos reais retornados da consulta ao banco de dados do INPI.

DADOS DA CONSULTA:
- Marca pretendida: "${marca}"
- Classe Nice (NCL): "${classe || 'Não especificada'}"
- Total de processos colidentes/encontrados no INPI: ${procsList.length}

LISTA DE PROCESSOS REAIS DO INPI ENCONTRADOS:
${JSON.stringify(procsList.map(p => ({
  numero: p.numero,
  marca: p.marca,
  situacao: p.situacao,
  titular: p.titular,
  classe: p.classeInter || p.classeBruta
})), null, 2)}

DIRETRIZES DE AVALIAÇÃO:
1. Art. 124, XIX da LPI: É proibido o registro de marca que reproduza ou imite marca alheia registrada ou com prioridade, para distinguir produto ou serviço idêntico, semelhante ou afim, suscetível de causar confusão ou associação.
2. Status dos processos: Processos com status "Registro de marca em vigor", "Deferido" ou "Aguardando prazo de oposição" são ameaças ativas. Processos "Extinto", "Arquivado", "Indeferido" ou "Nulo" NÃO impedem novo registro.
3. Semelhança Fonética, Gráfica e Ideológica: Se houver marcas com fonética idêntica ou radical idêntico no mesmo segmento/classe, o risco é ALTO. Se forem classes distintas ou marcas já extintas, o risco é BAIXO.
4. Defina uma pontuação de Viabilidade (SCORE de 0 a 100):
   - 80 a 100: ALTA VIABILIDADE (Baixo Risco). Caminho livre para registro imediato.
   - 50 a 79: MÉDIA VIABILIDADE (Risco Moderado). Possíveis oposições, necessita de estratégia de especificação ou elemento distintivo.
   - 0 a 49: BAIXA VIABILIDADE (Alto Risco de Indeferimento/Oposição). Conflito frontal com marca ativa.

Retorne APENAS um objeto JSON válido (sem blocos de código \`\`\`json, sem textos antes ou depois):
{
  "score": 85,
  "nivelRisco": "BAIXO",
  "titulo": "Caminho Livre para Registro no INPI",
  "resumo": "Análise sintética dos fatos marcários...",
  "motivosColidencia": [
    "Ponto 1...",
    "Ponto 2..."
  ],
  "recomendacoes": [
    "Recomendação prática 1...",
    "Recomendação prática 2..."
  ],
  "parecerJuridico": "Parecer fundamentado nos termos do Art. 124 da LPI...",
  "conflitosCriticos": [
    {
      "numero": "999999999",
      "marca": "NOME",
      "situacao": "Registro em vigor",
      "titular": "EMPRESA",
      "risco": "Explicação do conflito"
    }
  ]
}`;

    let aiResult: AiViabilityReport | null = null;

    // 1. Tenta Gemini API
    if (GEMINI_API_KEY) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            aiResult = JSON.parse(text.trim());
          }
        } else {
          console.warn("Gemini retornou erro, tentando fallback:", await geminiRes.text());
        }
      } catch (geminiErr) {
        console.warn("Erro ao chamar Gemini:", geminiErr);
      }
    }

    // 2. Fallback para Groq (Llama 3) se Gemini falhar
    if (!aiResult && GROQ_API_KEY) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" },
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            aiResult = JSON.parse(text.trim());
          }
        }
      } catch (groqErr) {
        console.warn("Erro ao chamar Groq:", groqErr);
      }
    }

    // 3. Fallback Heurístico caso as IAs estejam indisponíveis
    if (!aiResult) {
      const activeConflitos = procsList.filter((p: any) => {
        const s = (p.situacao || "").toLowerCase();
        return s.includes("vigor") || s.includes("defer") || s.includes("registrad");
      });

      const score = activeConflitos.length === 0 ? 95 : activeConflitos.length <= 2 ? 65 : 30;
      const nivelRisco = score >= 80 ? "BAIXO" : score >= 50 ? "MÉDIO" : "ALTO";

      aiResult = {
        score,
        nivelRisco,
        titulo: nivelRisco === "BAIXO" ? "Alta Viabilidade de Registro" : nivelRisco === "MÉDIO" ? "Viabilidade com Restrições" : "Alto Risco de Colidência",
        resumo: `Detectados ${procsList.length} processos no INPI, sendo ${activeConflitos.length} ativos na base oficial.`,
        motivosColidencia: activeConflitos.length > 0
          ? activeConflitos.map((c: any) => `Processo nº ${c.numero} (${c.marca}) registrado para ${c.titular}.`)
          : ["Não foram identificadas marcas idênticas ativas que impeçam o protocolo."],
        recomendacoes: [
          "Protocolar pedido com especificação detalhada de produtos e serviços.",
          "Monitorar a Revista da Propriedade Industrial após o depósito."
        ],
        parecerJuridico: `Análise preliminar conforme Art. 124, XIX da LPI. ${activeConflitos.length > 0 ? "Recomenda-se cautela estratégica quanto aos registros anteriores." : "Caminho desimpedido para proteção marcária."}`,
        conflitosCriticos: activeConflitos.slice(0, 3).map((c: any) => ({
          numero: c.numero,
          marca: c.marca,
          situacao: c.situacao,
          titular: c.titular,
          risco: "Marca registrada com vigência ativa no INPI"
        }))
      };
    }

    return NextResponse.json({
      success: true,
      marca,
      classe: classe || null,
      analysis: aiResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao processar análise com IA" }, { status: 500 });
  }
}
