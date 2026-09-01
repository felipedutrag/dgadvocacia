import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const externalId = searchParams.get("externalId");

    if (!externalId && !id) {
      return NextResponse.json({ error: "ID externo ou ID da transação ausente" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Verificar primeiro no banco de dados
    let paymentRecord: any = null;
    if (externalId) {
      const { data } = await supabase
        .from("payments")
        .select("*")
        .eq("external_id", externalId)
        .maybeSingle();
      paymentRecord = data;
    }

    if (paymentRecord && paymentRecord.status === "PAID") {
      return NextResponse.json({ status: "COMPLETE", paid: true });
    }

    // 2. Consultar a API do GG Pix caso ainda esteja pendente
    if (id) {
      const ggResponse = await fetch(`https://ggpixapi.com/api/v1/transactions/${id}`, {
        method: "GET",
        headers: {
          "X-API-Key": process.env.GGPIX_API_KEY || "",
        },
      });
      
      if (ggResponse.ok) {
        const ggData = await ggResponse.json();
        if (ggData.status === "COMPLETE" || ggData.status === "PAID") {
          // Atualizar banco de dados
          if (externalId) {
            await supabase
              .from("payments")
              .update({
                status: "PAID",
                paid_at: new Date().toISOString(),
              })
              .eq("external_id", externalId);

            // Se temos o registro do pagamento e o usuário associado, atualiza o plano no profile
            let targetUserId = paymentRecord?.user_id;
            if (!targetUserId && paymentRecord?.payer_email) {
              try {
                const { data: userProfile } = await supabase
                  .from("profiles")
                  .select("id")
                  .ilike("email", paymentRecord.payer_email)
                  .maybeSingle();
                if (userProfile?.id) {
                  targetUserId = userProfile.id;
                }
              } catch (e) {
                console.warn("Aviso ao buscar perfil por e-mail no status:", e);
              }
            }

            if (targetUserId) {
              let marcasToAdd = 3;
              let packName = "Radar RPI (3 Marcas)";
              const dynamicMatch = externalId.match(/radar_(\d+)_marcas/i);
              if (dynamicMatch && dynamicMatch[1]) {
                const qty = parseInt(dynamicMatch[1], 10);
                if (!isNaN(qty) && qty > 0) {
                  marcasToAdd = qty;
                  packName = `Radar RPI (${qty} ${qty === 1 ? "Marca" : "Marcas"})`;
                }
              }

              await supabase
                .from("profiles")
                .update({
                  marcas_limit: marcasToAdd,
                  plan: packName,
                  plan_status: "active",
                  updated_at: new Date().toISOString(),
                })
                .eq("id", targetUserId);
            }
          }

          return NextResponse.json({ status: "COMPLETE", paid: true });
        }
      } else {
        console.error("Erro ao consultar status na GG Pix:", await ggResponse.text().catch(() => ""));
      }
    }

    return NextResponse.json({ status: "PENDING", paid: false });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Status Check Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
