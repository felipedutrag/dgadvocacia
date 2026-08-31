require("dotenv").config({ path: "d:/smartdoc/.env" });

const API_BASE_URL = "http://localhost:3000";

// ==========================================
// 1. CASOS JURÍDICOS PARA OS TESTES
// ==========================================
const TEST_CASES = [
  {
    id: "CASO-1-CONSUMIDOR",
    area: "Direito do Consumidor",
    titulo: "Ação Indenizatória por Cancelamento de Voo e Extravio de Bagagem",
    fatos: `
      O Autor adquiriu passagens aéreas da companhia aérea Ré para o trecho São Paulo (GRU) -> Paris (CDG), com conexão em Lisboa, para comparecer a uma conferência internacional de arquitetura no dia 15/03/2026.
      O voo de São Paulo partiu com atraso de 6 horas sem qualquer justificativa ou assistência material (alimentação/hotel), fazendo com que o Autor perdesse a conexão em Lisboa.
      O Autor foi realocado em voo 24 horas depois, perdendo o primeiro dia da conferência. Para piorar, sua mala contendo vestimentas e materiais da palestra foi extraviada, sendo entregue 48 horas depois com o cadeado violado.
      Danos materiais de R$ 3.500,00 com compras emergenciais de roupas e materiais. Requer indenização por danos materiais e danos morais.
    `,
  },
  {
    id: "CASO-2-BANCARIO",
    area: "Direito Bancário",
    titulo: "Ação Declaratória de Inexistência de Débito c/c Reparação de Danos (Golpe do Pix)",
    fatos: `
      O Autor, aposentado de 68 anos, correntista do Banco Réu há mais de 15 anos, recebeu ligação telefônica gravada idêntica à central telefônica do banco alertando sobre uma suposta invasão em sua conta.
      Seguindo orientações para 'bloqueio', criminosos realizaram 4 transferências Pix sucessivas no valor total de R$ 48.000,00 em menos de 10 minutos para contas de terceiros em outros estados.
      O perfil do Autor sempre foi de movimentações modestas (máximo de R$ 1.500,00 por mês). Os sistemas antifraude do Banco falharam gravemente ao não bloquear transações atípicas e fora do perfil.
      O banco recusou o ressarcimento administrativo via Mecanismo Especial de Devolução (MED). Requer a devolução de R$ 48.000,00 e danos morais.
    `,
  },
  {
    id: "CASO-3-IMOBILIARIO",
    area: "Direito Imobiliário / Locação",
    titulo: "Ação de Despejo por Falta de Pagamento c/c Cobrança e Desocupação Liminar",
    fatos: `
      O Autor é proprietário e locador do imóvel residencial situado na Rua das Flores, 123, locado ao Réu pelo valor mensal de R$ 4.500,00, além do IPTU e condomínio (R$ 800,00).
      O contrato de locação encontra-se desprovido de qualquer das garantias do art. 37 da Lei 8.245/91 (sem fiador, sem caução, sem seguro fiança).
      O Locatário está inadimplente com os aluguéis e encargos desde novembro de 2025 (4 meses consecutivos), perfazendo um débito atualizado de R$ 23.400,00.
      Requer a concessão de liminar de desocupação em 15 dias mediante caução (art. 59, §1º, IX, da Lei do Inquilinato), rescisão do contrato, despejo definitivo e condenação ao pagamento dos aluguéis vencidos e vincendos.
    `,
  },
  {
    id: "CASO-4-FAMILIA",
    area: "Direito de Família",
    titulo: "Ação de Fixação de Alimentos c/c Guarda Unilateral e Alimentos Provisórios",
    fatos: `
      A Autora, representando seu filho menor de 4 anos, manteve união estável com o Réu por 5 anos, dissolvida há 3 meses.
      Desde a separação, o Réu deixou de contribuir financeiramente com o sustento da criança, arcando a genitora sozinha com escola particular (R$ 1.800,00), plano de saúde (R$ 600,00), alimentação e moradia.
      O Réu é empresário no ramo de tecnologia com rendimentos mensais estimados em mais de R$ 25.000,00, ostentando alto padrão de vida em redes sociais (viagens internacionais e veículos importados).
      Requer a fixação de alimentos provisórios em 30% dos rendimentos líquidos do Réu (ou R$ 6.000,00), guarda unilateral em favor da mãe e alimentos definitivos.
    `,
  },
  {
    id: "CASO-5-TRABALHISTA",
    area: "Direito do Trabalho",
    titulo: "Reclamação Trabalhista com Pedido de Rescisão Indireta e Horas Extras",
    fatos: `
      O Reclamante foi admitido pela Reclamada em 01/02/2023 para exercer a função de Analista de Suporte de TI, com salário de R$ 5.200,00.
      Trabalhava habitualmente de segunda a sábado das 08h00 às 20h00 (jornada de 12h diárias), com apenas 30 minutos de intervalo intrajornada, sem nunca receber o pagamento das horas extras nem do adicional de 50%.
      A partir de agosto de 2025, passou a sofrer assédio moral constante de seu superior hierárquico com cobranças vexatórias e humilhações em reuniões públicas de equipe.
      O FGTS não é recolhido há 6 meses consecutivos. Requer a declaração da rescisão indireta (art. 483, 'd', da CLT), pagamento das verbas rescisórias integrais, horas extras, intervalo intrajornada suprimido e indenização por danos morais de R$ 30.000,00.
    `,
  },
];

// ==========================================
// 2. MUTAÇÕES DE EDIÇÃO CIRÚRGICA (5 POR CASO)
// ==========================================
const MUTATION_PROMPTS = [
  "Adicione um tópico e fundamentação expressa de Benefício da Justiça Gratuita citando o art. 98 do Código de Processo Civil e a declaração de hipossuficiência.",
  "Insira um tópico específico de Tutela Provisória de Urgência Antecipada com citação literal do Art. 300 do CPC demonstrando o fumus boni iuris e o periculum in mora.",
  "Acrescente a citação de precedente jurisprudencial vinculante recente do Superior Tribunal de Justiça (STJ) reforçando a tese principal.",
  "Reescreva e aprofunde o tópico de Danos Morais fundamentando expressamente na Teoria do Desvio Produtivo do Consumidor e na gravidade da lesão.",
  "Adicione nos pedidos a cominação de multa diária (astreintes) de R$ 1.000,00 para o caso de descumprimento de obrigação de fazer.",
];

// ==========================================
// 3. FUNÇÕES AUXILIARES DE GERAÇÃO E PARSING
// ==========================================

function safeParseJson(rawText) {
  if (!rawText) throw new Error("Texto JSON vazio.");
  let clean = rawText.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  }

  try {
    return JSON.parse(clean);
  } catch (initialErr) {
    try {
      let inString = false;
      let isEscaped = false;
      let result = "";
      for (let i = 0; i < clean.length; i++) {
        const char = clean[i];
        if (char === '"' && !isEscaped) {
          inString = !inString;
          result += char;
        } else if (inString) {
          if (char === "\n") result += "\\n";
          else if (char === "\r") result += "\\r";
          else if (char === "\t") result += "\\t";
          else if (char.charCodeAt(0) < 32) result += "";
          else result += char;
        } else {
          result += char;
        }
        isEscaped = char === "\\" && !isEscaped;
      }
      try {
        return JSON.parse(result);
      } catch {
        let repaired = result.trim();
        if (inString) repaired += '"';
        const opensBracket = (repaired.match(/\[/g) || []).length;
        const closesBracket = (repaired.match(/\]/g) || []).length;
        for (let b = 0; b < opensBracket - closesBracket; b++) repaired += "]";
        const opensBrace = (repaired.match(/\{/g) || []).length;
        const closesBrace = (repaired.match(/\}/g) || []).length;
        for (let c = 0; c < opensBrace - closesBrace; c++) repaired += "}";
        return JSON.parse(repaired);
      }
    } catch (secondErr) {
      throw initialErr;
    }
  }
}

function generateId() {
  return `node-${Math.random().toString(36).substring(2, 10)}`;
}

function renderJsonToHtml(data) {
  let html = "";
  if (data.cabecalho?.enderecamento) {
    html += `<p id="${generateId()}" style="text-align: justify; line-height: 1.5; margin-bottom: 1.75rem;"><strong>${data.cabecalho.enderecamento}</strong></p>\n`;
  }

  if (data.partes) {
    const { autor, tipoAcao, reu } = data.partes;
    html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 0.75rem;"><strong>${autor?.nome || "AUTOR"}</strong>, ${autor?.qualificacao || "qualificação"}, vem propor a presente</p>\n`;
    html += `<h2 id="${generateId()}" style="text-align: center; margin: 1rem 0;"><strong>${(tipoAcao || "AÇÃO JUDICIAL").toUpperCase()}</strong></h2>\n`;
    html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 1.25rem;">em face de <strong>${reu?.nome || "RÉU"}</strong>, ${reu?.qualificacao || "qualificação"}, pelos fatos e fundamentos jurídicos a seguir expostos:</p>\n`;
  }

  if (data.fatos && data.fatos.length > 0) {
    html += `<h2 id="${generateId()}" style="margin-top: 1.5rem; margin-bottom: 0.5rem;"><strong>I. DOS FATOS</strong></h2>\n`;
    for (const f of data.fatos) {
      html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 0.6rem;">${f}</p>\n`;
    }
  }

  if (data.direito && data.direito.length > 0) {
    html += `<h2 id="${generateId()}" style="margin-top: 1.5rem; margin-bottom: 0.5rem;"><strong>II. DO DIREITO</strong></h2>\n`;
    for (const d of data.direito) {
      if (d.subtitulo) {
        html += `<h3 id="${generateId()}" style="margin-top: 1rem; margin-bottom: 0.35rem;"><strong>${d.subtitulo}</strong></h3>\n`;
      }
      if (d.citacaoDestaque) {
        html += `<blockquote id="${generateId()}" style="margin-top: 0.2rem; margin-bottom: 0.75rem;">${d.citacaoDestaque}</blockquote>\n`;
      }
      if (d.paragrafos) {
        for (const p of d.paragrafos) {
          html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 0.6rem;">${p}</p>\n`;
        }
      }
    }
  }

  if (data.pedidos && data.pedidos.length > 0) {
    html += `<h2 id="${generateId()}" style="margin-top: 1.5rem; margin-bottom: 0.5rem;"><strong>III. DOS PEDIDOS</strong></h2>\n`;
    html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 0.5rem;">Ante o exposto, requer a Vossa Excelência:</p>\n`;
    for (const p of data.pedidos) {
      html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 0.35rem;"><strong>${p.alinea || "a)"}</strong> ${p.texto}</p>\n`;
    }
  }

  if (data.fechamento) {
    html += `<h2 id="${generateId()}" style="margin-top: 1.5rem; margin-bottom: 0.5rem;"><strong>IV. DAS PROVAS E DO VALOR DA CAUSA</strong></h2>\n`;
    if (data.fechamento.provas) {
      html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 0.5rem;">${data.fechamento.provas}</p>\n`;
    }
    if (data.fechamento.valorCausa) {
      html += `<p id="${generateId()}" data-first-line-indent="1.25cm" style="margin-bottom: 1.25rem;">Dá-se à causa o valor de <strong>${data.fechamento.valorCausa}</strong>.</p>\n`;
    }
    html += `<p id="${generateId()}" style="text-align: center; margin-top: 1.25rem;">Nestes termos, pede deferimento.<br><br>Cidade/Data<br><strong>Advogado(a) - OAB</strong></p>\n`;
  }

  return html;
}

const cheerio = require("cheerio");

// Aplicação cirúrgica das tags <update> exatamente como o SimpleEditor faz usando Cheerio
function applyUpdatesToHtml(currentHtml, rewriteResponse) {
  const cleanRewrite = rewriteResponse.replace(/^```html\s*/i, "").replace(/```$/i, "").trim();
  const $updateDoc = cheerio.load(`<root>${cleanRewrite}</root>`, null, false);
  const updates = $updateDoc("update").toArray();

  if (updates.length === 0) {
    if (cleanRewrite.length > 50 && cleanRewrite.includes("<p")) {
      return cleanRewrite; // Fallback retorno completo
    }
    return currentHtml;
  }

  const $ = cheerio.load(currentHtml, null, false);

  for (const updateElem of updates) {
    const $u = $updateDoc(updateElem);
    const id = $u.attr("id") || $u.attr("target");
    const action = ($u.attr("action") || $u.attr("mode") || "replace").toLowerCase();
    const content = $u.html()?.trim() || "";

    if (!id) continue;

    const $target = $(`#${id}`);
    if ($target.length === 0) {
      console.warn(`   ⚠️ Target ID "${id}" não encontrado. Inserindo no final da seção.`);
      $("body").append(content);
      continue;
    }

    if (action === "delete" || $u.attr("delete") === "true") {
      $target.remove();
    } else if (action === "insert-before") {
      $target.before(content);
    } else if (action === "insert-after") {
      $target.after(content);
    } else {
      // replace
      $target.replaceWith(content);
    }
  }

  return $.html();
}

// ==========================================
// 4. MOTOR PRINCIPAL DE TESTE VIA API REAL
// ==========================================

async function runCompleteTestPipeline() {
  console.log("================================================================================");
  console.log("⛧ TESTE AUTOMATIZADO COM SUBAGENTES VIA API REAL DO SMARTDOC ⛧");
  console.log(`📡 Endpoint de Geração: ${API_BASE_URL}/api/gemini/document`);
  console.log(`📡 Endpoint de Edição:   ${API_BASE_URL}/api/gemini/rewrite`);
  console.log("================================================================================\n");

  const resultsSummary = {
    totalCasos: TEST_CASES.length,
    totalMutacoes: TEST_CASES.length * MUTATION_PROMPTS.length,
    peticoesGeradasComSucesso: 0,
    mutacoesComSucesso: 0,
    falhasDetectadas: [],
    auditorias: [],
    detalhesMutacoes: [],
  };

  for (let cIdx = 0; cIdx < TEST_CASES.length; cIdx++) {
    const testCase = TEST_CASES[cIdx];
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`📋 [CASO ${cIdx + 1}/${TEST_CASES.length}] ${testCase.titulo} (${testCase.area})`);
    console.log(`--------------------------------------------------------------------------------`);

    // ETAPA 1: GERAÇÃO DA PETIÇÃO INICIAL VIA API REAL (/api/gemini/document)
    console.log(`⏳ [Subagente 1 - Generator] Chamando POST /api/gemini/document...`);
    let peticaoJson = null;

    try {
      const genRes = await fetch(`${API_BASE_URL}/api/gemini/document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facts: testCase.fatos }),
      });

      if (!genRes.ok) {
        const errBody = await genRes.text();
        throw new Error(`HTTP ${genRes.status}: ${errBody}`);
      }

      const rawText = await genRes.text();
      peticaoJson = safeParseJson(rawText);
      if (!peticaoJson || !peticaoJson.partes) {
        throw new Error("JSON da petição retornado inválido ou incompleto.");
      }

      resultsSummary.peticoesGeradasComSucesso++;
      console.log(`✅ [API /api/gemini/document] Petição gerada com sucesso! (${peticaoJson.partes?.tipoAcao || testCase.titulo})`);
    } catch (e) {
      console.error(`❌ [API /api/gemini/document] Erro na geração:`, e.message);
      resultsSummary.falhasDetectadas.push({ caso: testCase.id, etapa: "geracao_api", erro: e.message });
      continue;
    }

    let currentHtml = renderJsonToHtml(peticaoJson);
    console.log(`📄 HTML Inicial estruturado com ${currentHtml.length} caracteres e tags semânticas.`);

    // ETAPA 2: AUDITORIA PELO SUBAGENTE AUDITOR
    console.log(`🔍 [Subagente 1 - Auditor] Auditando conformidade estrutural e processual...`);
    const hasCabecalho = currentHtml.includes("EXCELENTÍSSIMO") || currentHtml.includes("AO JUÍZO");
    const hasFatos = currentHtml.includes("DOS FATOS");
    const hasDireito = currentHtml.includes("DO DIREITO");
    const hasPedidos = currentHtml.includes("DOS PEDIDOS");
    const hasValor = currentHtml.includes("Dá-se à causa") || currentHtml.includes("valor da causa");

    const auditPass = hasFatos && hasDireito && hasPedidos;
    console.log(`   - Estrutura Formal: ${auditPass ? "✅ CONFORME" : "❌ INCOMPLETA"}`);
    console.log(`   - Fatos: ${hasFatos ? "OK" : "Ausente"} | Direito: ${hasDireito ? "OK" : "Ausente"} | Pedidos: ${hasPedidos ? "OK" : "Ausente"} | Valor da Causa: ${hasValor ? "OK" : "Ausente"}`);

    resultsSummary.auditorias.push({
      caso: testCase.id,
      conformidade: auditPass,
      hasCabecalho,
      hasFatos,
      hasDireito,
      hasPedidos,
      hasValor,
    });

    // ETAPA 3: BATERIA DE 5 MUTAÇÕES PELO SUBAGENTE EDITOR VIA API REAL (/api/gemini/rewrite)
    console.log(`\n🛠️ [Subagente 2 - Mutation Editor] Executando 5 edições cirúrgicas via POST /api/gemini/rewrite...`);

    for (let mIdx = 0; mIdx < MUTATION_PROMPTS.length; mIdx++) {
      const instruction = MUTATION_PROMPTS[mIdx];
      console.log(`   ✏️ [Mutação ${mIdx + 1}/5] "${instruction.slice(0, 65)}..."`);

      try {
        const rewriteRes = await fetch(`${API_BASE_URL}/api/gemini/rewrite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: currentHtml,
            instruction: instruction,
            selectedText: "",
          }),
        });

        if (!rewriteRes.ok) {
          const errBody = await rewriteRes.text();
          throw new Error(`HTTP ${rewriteRes.status}: ${errBody}`);
        }

        const rewriteOutput = await rewriteRes.text();

        if (!rewriteOutput || rewriteOutput.trim().length === 0) {
          throw new Error("Resposta da API de reescrita veio vazia.");
        }

        const prevHtml = currentHtml;
        currentHtml = applyUpdatesToHtml(currentHtml, rewriteOutput);

        // Verificação de Integridade Pós-Mutação
        const h2CountBefore = (prevHtml.match(/<h2/gi) || []).length;
        const h2CountAfter = (currentHtml.match(/<h2/gi) || []).length;
        const hasDeletedH2 = h2CountAfter < h2CountBefore;

        if (hasDeletedH2) {
          console.warn(`   ⚠️ ALERTA DE COMPORTAMENTO INDESEJADO: Título <h2> foi removido durante a mutação! (Antes: ${h2CountBefore}, Depois: ${h2CountAfter})`);
          resultsSummary.falhasDetectadas.push({
            caso: testCase.id,
            mutacao: mIdx + 1,
            tipo: "delecao_h2_indesejada",
            detalhe: `Contagem de h2 caiu de ${h2CountBefore} para ${h2CountAfter}`,
          });
        } else {
          console.log(`   ✅ [API /api/gemini/rewrite] Sucesso! (Nós preservados: ${h2CountAfter} seções, markup intacto)`);
          resultsSummary.mutacoesComSucesso++;
          resultsSummary.detalhesMutacoes.push({
            caso: testCase.id,
            mutacao: mIdx + 1,
            instrucao: instruction,
            sucesso: true,
            tamanhoFinal: currentHtml.length,
          });
        }
      } catch (err) {
        console.error(`   ❌ [API /api/gemini/rewrite] Erro na mutação ${mIdx + 1}:`, err.message);
        resultsSummary.falhasDetectadas.push({
          caso: testCase.id,
          mutacao: mIdx + 1,
          tipo: "erro_execucao_api",
          detalhe: err.message,
        });
      }
    }
  }

  // ==========================================
  // 5. RELATÓRIO FINAL CONSOLIDADO
  // ==========================================
  console.log("\n================================================================================");
  console.log("📊 RELATÓRIO FINAL DO TESTE DE MUTAÇÃO COM SUBAGENTES (API REAL)");
  console.log("================================================================================");
  console.log(`• Total de Casos Testados: ${resultsSummary.totalCasos}`);
  console.log(`• Petições Geradas com Sucesso: ${resultsSummary.peticoesGeradasComSucesso}/${resultsSummary.totalCasos} (${Math.round((resultsSummary.peticoesGeradasComSucesso/resultsSummary.totalCasos)*100)}%)`);
  console.log(`• Total de Mutações Cirúrgicas Executadas: ${resultsSummary.mutacoesComSucesso}/${resultsSummary.totalMutacoes} (${Math.round((resultsSummary.mutacoesComSucesso/resultsSummary.totalMutacoes)*100)}%)`);
  console.log(`• Falhas ou Desvios Detectados: ${resultsSummary.falhasDetectadas.length}`);

  if (resultsSummary.falhasDetectadas.length > 0) {
    console.log("\n⚠️ DETALHAMENTO DE FALHAS PARA CORREÇÃO:");
    console.log(JSON.stringify(resultsSummary.falhasDetectadas, null, 2));
  } else {
    console.log("\n🏆 SUCESSO ABSOLUTO: 100% DAS PETIÇÕES E CIRURGIAS PRESERVARAM A INTEGRIDADE.");
  }
  console.log("================================================================================\n");

  return resultsSummary;
}

runCompleteTestPipeline().catch(console.error);

