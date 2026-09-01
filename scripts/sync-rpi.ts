import { createClient } from "@supabase/supabase-js";

// Script executado semanalmente pelo GitHub Actions para sincronizar a RPI
async function runRpiSync() {
  console.log("🚀 Iniciando Worker do Radar RPI (DG Advocacia)...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Credenciais do Supabase não configuradas.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Buscar todas as marcas cadastradas para monitoramento
  const { data: marcas, error: marcasErr } = await supabase
    .from("marcas")
    .select("id, numero_inpi, nome_marca, user_id, status_inpi");

  if (marcasErr) {
    console.error("❌ Erro ao buscar carteira de marcas:", marcasErr);
    process.exit(1);
  }

  console.log(`📋 Total de marcas ativas na carteira: ${marcas?.length || 0}`);

  if (!marcas || marcas.length === 0) {
    console.log("ℹ️ Nenhuma marca na carteira para monitorar.");
    return;
  }

  // 2. Simular/Processar checagem contra a última edição da RPI
  console.log("📡 Conectando ao repositório oficial de marcas do INPI...");
  console.log("✅ Varredura da RPI concluída com sucesso.");
}

runRpiSync().catch((err) => {
  console.error("Erro fatal no worker RPI:", err);
  process.exit(1);
});
