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
      .from("marcas")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ marcas: data });
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

    const { data, error } = await supabase
      .from("marcas")
      .upsert({
        user_id: user.id,
        numero_inpi: numero_inpi.trim(),
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
