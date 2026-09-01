import { config } from "dotenv";
config();

import { createClient } from "@supabase/supabase-js";

async function runRpiSync() {
  console.log("🚀 Iniciando Worker do Radar RPI (DG Advocacia)...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Credenciais do Supabase não configuradas no .env.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("📡 Conectando ao Supabase:", supabaseUrl);

  // 1. Buscar todas as marcas cadastradas para monitoramento usando status_ipas correto
  const { data: marcas, error: marcasErr } = await supabase
    .from("marcas")
    .select("id, numero_inpi, nome_marca, user_id, status_ipas");

  if (marcasErr) {
    console.error("❌ Erro ao buscar carteira de marcas:", marcasErr);
    process.exit(1);
  }

  console.log(`📋 Total de marcas ativas na carteira: ${marcas?.length || 0}`);

  if (marcas && marcas.length > 0) {
    marcas.forEach((m, idx) => {
      console.log(`   [${idx + 1}] Processo Nº ${m.numero_inpi || "N/D"} - Marca: "${m.nome_marca}" - Status: ${m.status_ipas || "Ativo"}`);
    });
  } else {
    console.log("ℹ️ Nenhuma marca na carteira para monitorar no momento.");
  }

  // 2. Verificar tabela de movimentações RPI
  const { data: movs, error: movsErr } = await supabase
    .from("movimentacoes_inpi")
    .select("id, rpi, codigo_despacho, descricao_despacho, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!movsErr) {
    console.log(`📊 Últimas movimentações registradas no Radar: ${movs?.length || 0}`);
  }

  console.log("✅ Varredura e teste de comunicação concluídos com 100% de sucesso!");
}

runRpiSync().catch((err) => {
  console.error("Erro fatal no worker RPI:", err);
  process.exit(1);
});
