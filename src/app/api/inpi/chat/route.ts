import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, mode = "dashboard" } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Mensagens inválidas" }, { status: 400 });
    }

    const isSales = mode === "sales";
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    // Ferramentas do INPI declaradas como Tool Declarations
    const tools = [
      {
        functionDeclarations: [
          {
            name: "consultarMarcaINPI",
            description: "Consulta marcas na base de dados oficial do INPI por denominação e classe de Nice opcional.",
            parameters: {
              type: "OBJECT",
              properties: {
                marca: { type: "STRING", description: "Nome exato ou termo da marca a pesquisar no INPI." },
                classe: { type: "STRING", description: "Classe de Nice de 1 a 45 (opcional)." },
                exata: { type: "STRING", description: "'sim' para busca exata ou 'nao' para aproximada." }
              },
              required: ["marca"]
            }
          },
          {
            name: "obterRaioXProcesso",
            description: "Busca o Raio-X completo e despachos de um processo do INPI pelo número (ex: 934812345).",
            parameters: {
              type: "OBJECT",
              properties: {
                numeroProcesso: { type: "STRING", description: "Número de 9 dígitos do processo do INPI." }
              },
              required: ["numeroProcesso"]
            }
          },
          {
            name: "verificarDominioWeb",
            description: "Verifica se um domínio (.com.br / .com) está livre para registro ou ocupado.",
            parameters: {
              type: "OBJECT",
              properties: {
                dominio: { type: "STRING", description: "Nome do domínio sem extensão (ex: minharmarca)." }
              },
              required: ["dominio"]
            }
          }
        ]
      }
    ];

    const systemInstruction = isSales
      ? `Você é a Dra. Sofia, Especialista em Inteligência Marcária e Estrategista B2B da DG Advocacia (Dr. Felipe Dutra Gonçalves - OAB/MG nº 45.925).
Você está na página inicial (landing page) da plataforma e seu objetivo é demonstrar autoridade, tirar dúvidas sobre o registro de marcas e INCENTIVAR O USUÁRIO A CRIAR UMA CONTA GRATUITA OU CONTRATAR O RADAR RPI.

SEUS CONHECIMENTOS SOBRE O ECOSSISTEMA DG ADVOCACIA:
1. **Radar RPI Automático:** Monitoramento contínuo da Revista Oficial do INPI por apenas R$ 47/mês (cobre até 3 marcas).
2. **Estúdio de Naming com IA:** Geração de marcas de alto valor e distintividade jurídica (Art. 124 LPI).
3. **Criador de Logomarcas:** Geração de marcas mistas e monogramas aptos para depósito no INPI.
4. **Enquadrador Nice com IA:** Classificação automática nas 45 classes de Nice com termos pré-aprovados pelo INPI.
5. **Checador de Domínios e Redes:** Consulta instantânea de .com.br no Registro.br, .com e @ de redes sociais.
6. **Gerador de Notificação Extrajudicial:** Minutas formais baseadas nos Arts. 129, 189 e 209 da LPI.
7. **Exportação de Parecer em PDF:** Laudo técnico assinado pelo Dr. Felipe Dutra para fechar clientes na hora.

DIRETRIZES DE VENDAS:
- Seja acolhedora, executiva, elegante e convincente.
- Use as tools do INPI para demonstrar o poder da plataforma em tempo real se o cliente perguntar de uma marca.
- Ao final de explicações, convide gentilmente o usuário a se cadastrar gratuitamente (/register) para liberar todas as ferramentas no painel.`
      : `Você é a Dra. Sofia, Especialista em Inteligência Marcária da DG Advocacia (Dr. Felipe Dutra Gonçalves - OAB/MG nº 45.925).
Você é assistente de IA integrada diretamente ao INPI e à LPI (Lei nº 9.279/1996).
Suas respostas devem ser precisas, diretas, elegantes e com fundamentação jurídica sólida.

SEMPRE QUE O USUÁRIO PERGUNTAR SOBRE UMA MARCA OU PROCESSO:
1. Use as tools do INPI para consultar os dados reais antes de responder.
2. Explique a situação, o risco de colidência com base no Art. 124 da LPI e os prazos legais de 60 dias.
3. Não invente dados do INPI, utilize as tools disponíveis.`;

    if (GEMINI_API_KEY) {
      // 1. Converte histórico para formato do Gemini
      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }));

      // Chamada Gemini com Tools
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          tools,
          generationConfig: { temperature: 0.3 }
        })
      });

      if (res.ok) {
        const geminiData = await res.json();
        const candidate = geminiData.candidates?.[0];
        const functionCalls = candidate?.content?.parts?.filter((p: any) => p.functionCall);

        // Se o modelo invocou uma ferramenta
        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0].functionCall;
          const { name, args } = call;
          let toolResult: any = {};

          // Executar Tool Function
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

          if (name === "consultarMarcaINPI") {
            const params = new URLSearchParams({
              marca: args.marca,
              exata: args.exata || "nao"
            });
            if (args.classe) params.append("classe", args.classe);
            const inpiRes = await fetch(`${baseUrl}/api/inpi/check-trademark?${params.toString()}`);
            toolResult = inpiRes.ok ? await inpiRes.json() : { error: "Falha na consulta INPI" };
          } else if (name === "obterRaioXProcesso") {
            const inpiRes = await fetch(`${baseUrl}/api/inpi/processo?numero=${args.numeroProcesso}`);
            toolResult = inpiRes.ok ? await inpiRes.json() : { error: "Processo não encontrado" };
          } else if (name === "verificarDominioWeb") {
            const domRes = await fetch(`${baseUrl}/api/inpi/domain-check?domain=${encodeURIComponent(args.dominio)}`);
            toolResult = domRes.ok ? await domRes.json() : { error: "Falha ao checar domínios" };
          }

          // 2ª rodada: Enviar o retorno da tool para o Gemini sintetizar a resposta jurídica
          const followUpContents = [
            ...contents,
            candidate.content,
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    name,
                    response: { result: toolResult }
                  }
                }
              ]
            }
          ];

          const secondRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents: followUpContents,
              generationConfig: { temperature: 0.3 }
            })
          });

          if (secondRes.ok) {
            const secondData = await secondRes.json();
            const textResponse = secondData.candidates?.[0]?.content?.parts?.[0]?.text;
            return NextResponse.json({
              response: textResponse || "Não foi possível processar os dados.",
              toolUsed: { name, args, result: toolResult }
            });
          }
        }

        // Resposta direta de texto
        const text = candidate?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ response: text });
        }
      }
    }

    // Fallback Groq Llama 3.3
    if (GROQ_API_KEY) {
      const groqMessages = [
        { role: "system", content: systemInstruction },
        ...messages.map((m: any) => ({ role: m.role, content: m.content }))
      ];

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: groqMessages,
          temperature: 0.3
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const text = groqData.choices?.[0]?.message?.content;
        if (text) return NextResponse.json({ response: text });
      }
    }

    return NextResponse.json({ error: "Erro ao processar consulta IA" }, { status: 500 });
  } catch (error: any) {
    console.error("Erro no Chat IA:", error);
    return NextResponse.json({ error: error?.message || "Erro interno" }, { status: 500 });
  }
}
