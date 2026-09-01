import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email";

const VALID_NORMALIZED_CODES = [
  "PARCEIROINPI",
  "PARCEIRO",
  "PARCERIA",
  "CONVITE",
  "MARCAS",
  "DG2026",
  "PARCEIRO2026",
  "DGPARTNER",
  "FOUNDERB2B",
  "DGEXCLUSIVO",
  "DGCONVITE",
  "VIPDG2026",
  "DG23423"
];

function normalizeInviteCode(code: string): string {
  return (code || "").trim().toUpperCase().replace(/[\s\-_.]/g, "");
}

export async function POST(request: Request) {
  try {
    const { email, password, name, inviteCode } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
    }

    const rawCode = (inviteCode || "").trim().toUpperCase();
    const normalized = normalizeInviteCode(rawCode);

    if (!normalized || !VALID_NORMALIZED_CODES.includes(normalized)) {
      return NextResponse.json(
        { error: "Código de Convite inválido ou expirado. O cadastro é restrito a empresas convidadas." },
        { status: 403 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Cria o usuário com email já auto-confirmado (sem necessidade de verificação por email)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name?.trim() || "Parceiro B2B",
        invite_code: rawCode,
        partner_tier: "CONVIDADO"
      },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // Envia e-mail de boas-vindas com link para login via Resend (de forma não-bloqueante)
    try {
      sendWelcomeEmail({
        email: email.trim(),
        name: name?.trim() || "Advogado(a)",
      }).catch((e) => console.error("[REGISTER] Erro no envio de boas-vindas:", e));
    } catch (e) {
      console.error("[REGISTER] Falha ao invocar sendWelcomeEmail:", e);
    }

    return NextResponse.json({ user: userData.user });
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: err?.message || "Erro ao criar conta." }, { status: 500 });
  }
}
