import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      notificanteNome,
      notificanteDocumento,
      marcaRegistrada,
      processoInpi,
      notificadoNome,
      notificadoUsoIndevido,
      plataformaInfracao,
      prazoDias
    } = body;

    if (!marcaRegistrada || !notificadoNome) {
      return NextResponse.json({ error: "Preencha os dados da marca e do notificado" }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const prompt = `Você é um Advogado Especialista em Propriedade Intelectual da DG Advocacia (Dr. Felipe Dutra Gonçalves - OAB/MG 45.925).
Elabore uma NOTIFICAÇÃO EXTRAJUDICIAL DE CESSAÇÃO DE USO INDEVIDO DE MARCA E CONCORRÊNCIA DESLEAL completa, formal, rigorosa e juridicamente irrefutável com base na Lei Federal nº 9.279/1996 (LPI) e no Código Civil.

DADOS DA NOTIFICAÇÃO:
- Notificante (Titular): ${notificanteNome || 'Titular da Marca'} (Doc: ${notificanteDocumento || 'Inscrito sob as normas da LPI'})
- Marca Registrada no INPI: "${marcaRegistrada}" (Processo Nº ${processoInpi || 'Certificado Oficial'})
- Notificado (Infrator): ${notificadoNome}
- Local da Infração / Uso Indevido: ${plataformaInfracao || 'Instagram / Website / Estabelecimento Comercial'}
- Descrição da Infração: ${notificadoUsoIndevido || 'Utilização de elemento nominativo/figurativo idêntico ou similar gerando confusão ao consumidor'}
- Prazo para Cessação: ${prazoDias || 5} (cinco) dias úteis.

ESTRUTURA OBRIGATÓRIA DA PEÇA:
1. CABEÇALHO FORMAL COM NOTIFICANTE E NOTIFICADO
2. DOS FATOS (Propriedade exclusiva da marca, Art. 129 da LPI e uso indevido)
3. DO DIREITO (Art. 129, Art. 189 - Crime contra Registro de Marca, Art. 195 - Concorrência Desleal e Art. 209 da LPI - Danos Materiais e Morais)
4. DAS DETERMINAÇÕES (Cessação imediata, remoção de domínios/perfis, descarte de material gráfico sob pena de Ação Cominatória e Indenizatória)
5. PRAZO FATAL E ADVERTÊNCIA
6. FECHAMENTO com localidade e assinatura.

Retorne APENAS um JSON válido no formato:
{
  "titulo": "NOTIFICAÇÃO EXTRAJUDICIAL — CESSAÇÃO DE USO INDEVIDO DE MARCA",
  "notificacaoTexto": "Texto completo e formal da peça em markdown com parágrafos bem espaçados...",
  "resumoJuridico": "Notificação formal fundamentada nos Arts. 129, 189 e 209 da LPI com prazo de 5 dias.",
  "artigosCitados": ["Art. 129 da LPI", "Art. 189 da LPI", "Art. 195 da LPI", "Art. 209 da LPI", "Art. 186 do Código Civil"]
}`;

    if (GEMINI_API_KEY) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
            }),
          }
        );
        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) return NextResponse.json(JSON.parse(raw));
        }
      } catch (err) {
        console.warn("Gemini CeaseDesist fallback:", err);
      }
    }

    if (GROQ_API_KEY) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });
      if (groqRes.ok) {
        const data = await groqRes.json();
        const raw = data.choices?.[0]?.message?.content;
        if (raw) return NextResponse.json(JSON.parse(raw));
      }
    }

    return NextResponse.json({ error: "Erro ao redigir notificação extrajudicial" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro interno" }, { status: 500 });
  }
}
