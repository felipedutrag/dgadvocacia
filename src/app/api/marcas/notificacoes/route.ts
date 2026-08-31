import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("movimentacoes_inpi")
      .select(`
        id, 
        rpi, 
        codigo_despacho, 
        descricao_despacho, 
        created_at,
        marcas!inner(id, numero_inpi, nome_marca, user_id)
      `)
      .eq("marcas.user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const formatted = data.map((m: any) => ({
      id: m.id,
      processo_id: m.marcas.id,
      numero_processo: m.marcas.numero_inpi,
      title: m.marcas.nome_marca,
      description: m.descricao_despacho || m.codigo_despacho,
      time: new Date(m.created_at).toLocaleDateString("pt-BR"),
      read: false,
    }));

    return NextResponse.json({ notifications: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  return NextResponse.json({ ok: true });
}
