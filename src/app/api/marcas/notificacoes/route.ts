import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Buscar movimentações e despachos reais do INPI vinculados às marcas do usuário
    const { data: movs, error: movsError } = await supabase
      .from("movimentacoes_inpi")
      .select(`
        id, 
        rpi, 
        codigo_despacho, 
        descricao_despacho, 
        created_at,
        marcas!inner(id, numero_inpi, nome_marca, user_id, status_inpi)
      `)
      .eq("marcas.user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(15);

    // 2. Buscar marcas cadastradas para telemetria de status e prazos
    const { data: userMarcas } = await supabase
      .from("marcas")
      .select("id, numero_inpi, nome_marca, status_inpi, updated_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const notifications: any[] = [];

    // Formatar movimentações reais
    if (movs && movs.length > 0) {
      movs.forEach((m: any) => {
        const isPrazo = m.codigo_despacho?.toLowerCase().includes("exigência") || 
                        m.codigo_despacho?.toLowerCase().includes("oposição") || 
                        m.descricao_despacho?.toLowerCase().includes("prazo");
        const isConcedido = m.descricao_despacho?.toLowerCase().includes("concessão") || 
                            m.descricao_despacho?.toLowerCase().includes("deferimento");

        notifications.push({
          id: `mov-${m.id}`,
          titulo: `RPI ${m.rpi || "Oficial"} • ${m.marcas?.nome_marca || "Processo INPI"}`,
          descricao: m.descricao_despacho || `Despacho ${m.codigo_despacho} publicado na Revista do INPI.`,
          tipo: isPrazo ? "prazo" : isConcedido ? "sucesso" : "despacho",
          tempo: new Date(m.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
          lida: false,
          processoNumero: m.marcas?.numero_inpi,
        });
      });
    }

    // Se tiver marcas ativas, adicionar status do Radar RPI
    if (userMarcas && userMarcas.length > 0) {
      notifications.push({
        id: "radar-active-status",
        titulo: "Radar RPI Ativo",
        descricao: `${userMarcas.length} ${userMarcas.length === 1 ? "marca monitorada" : "marcas monitoradas"} em tempo real na Revista da Propriedade Industrial.`,
        tipo: "info",
        tempo: "Em tempo real",
        lida: true,
      });
    } else {
      notifications.push({
        id: "radar-onboarding",
        titulo: "Adicione sua 1ª Marca",
        descricao: "Cadastre seus processos do INPI na aba 'Acompanhamento' para ativar a vigilância automática da RPI.",
        tipo: "info",
        tempo: "Agora",
        lida: false,
      });
    }

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error("Erro em /api/marcas/notificacoes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH() {
  return NextResponse.json({ ok: true });
}
