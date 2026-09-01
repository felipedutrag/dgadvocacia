import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Busca marcas e perfil do usuário para quotas
    const [{ data: marcas, error: marcasErr }, { data: profile }] = await Promise.all([
      supabase
        .from("marcas")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("marcas_limit, plan, plan_status")
        .eq("id", user.id)
        .maybeSingle(),
    ]);

    if (marcasErr) throw marcasErr;

    const marcasLimit = profile?.marcas_limit ?? 3;
    const isPaid = profile?.plan && profile.plan !== "free" && !profile.plan.toLowerCase().includes("gratuito") && profile.plan_status === "active";

    return NextResponse.json({
      marcas: marcas || [],
      quota: {
        total: marcasLimit,
        used: (marcas || []).length,
        remaining: Math.max(0, marcasLimit - (marcas || []).length),
        plan: isPaid ? (profile?.plan || "Radar RPI Ativo") : `Plano Base (${marcasLimit} ${marcasLimit === 1 ? "Marca" : "Marcas"})`,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { numero_inpi, nome_marca, titular, classe_nice, status_ipas, imagem_url } = body;

    if (!numero_inpi) {
      return NextResponse.json({ error: "Número INPI obrigatório" }, { status: 400 });
    }

    const cleanNum = numero_inpi.trim();

    // 1. Verifica se esta marca já existe para o usuário (caso de atualização)
    const { data: existingMarca } = await supabase
      .from("marcas")
      .select("id")
      .eq("user_id", user.id)
      .eq("numero_inpi", cleanNum)
      .maybeSingle();

    // 2. Se for uma nova marca, checar limite do plano
    if (!existingMarca) {
      const [{ count }, { data: profile }] = await Promise.all([
        supabase
          .from("marcas")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("marcas_limit, plan, plan_status")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      const marcasLimit = profile?.marcas_limit ?? 3;
      const isPaid = profile?.plan && profile.plan !== "free" && !profile.plan.toLowerCase().includes("gratuito") && profile.plan_status === "active";
      const currentActiveCount = count || 0;

      if (currentActiveCount >= marcasLimit) {
        return NextResponse.json(
          {
            error: `Limite de marcas atingido. Seu plano atual permite acompanhar ${marcasLimit} marca(s) ativa(s). Exclua uma marca para liberar vaga ou aumente o limite contratando novas marcas no Radar.`,
            limitReached: true,
            currentLimit: marcasLimit,
            activeCount: currentActiveCount,
            plan: isPaid ? (profile?.plan || "Radar RPI Ativo") : `Plano Base (${marcasLimit} ${marcasLimit === 1 ? "Marca" : "Marcas"})`,
          },
          { status: 403 }
        );
      }
    }

    // 3. Upsert da marca
    const { data, error } = await supabase
      .from("marcas")
      .upsert({
        user_id: user.id,
        numero_inpi: cleanNum,
        nome_marca: nome_marca || "Processo INPI",
        titular: titular || "",
        classe_nice: classe_nice || "",
        status_ipas: status_ipas || "Em Acompanhamento",
        imagem_url: imagem_url || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id, numero_inpi" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ marca: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const numero_inpi = searchParams.get("numero_inpi");

    if (!id && !numero_inpi) {
      return NextResponse.json({ error: "Parâmetro id ou numero_inpi é obrigatório" }, { status: 400 });
    }

    let query = supabase.from("marcas").delete().eq("user_id", user.id);
    if (id) query = query.eq("id", id);
    if (numero_inpi) query = query.eq("numero_inpi", numero_inpi);

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
