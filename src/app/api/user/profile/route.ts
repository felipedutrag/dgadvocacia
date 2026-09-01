import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/user/profile - Retorna os dados do perfil do usuário autenticado com auto-reset mensal
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({
        profile: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || "Parceiro B2B",
          company_name: user.user_metadata?.company_name || "",
          marcas_limit: 10,
          marcas_used: 0,
          consultorias_creditos: 5,
          is_admin: false,
        },
      });
    }

    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}
