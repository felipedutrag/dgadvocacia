import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPaymentSuccessEmail } from "@/lib/email";
import crypto from "crypto";

function validateWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const parts = signature.split(",");
    const timestamp = parts[0]?.replace("t=", "") || "";
    const receivedSig = parts[1]?.replace("v1=", "") || "";
    
    // Verificar se não é replay attack (máximo 5 min = 300s)
    const age = Date.now() / 1000 - parseInt(timestamp, 10);
    if (age > 300) return false;

    // Assinatura esperada: HMAC-SHA256(timestamp.rawBody)
    const signedPayload = timestamp + "." + rawBody;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(receivedSig),
      Buffer.from(expectedSig)
    );
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "GG Pix Webhook endpoint is active and listening for POST callbacks.",
  });
}

export async function POST(request: Request) {
  console.log("===> [WEBHOOK INCOMING] Recebida chamada POST no webhook");
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature");
    const authHeader = request.headers.get("authorization");

    console.log("===> [WEBHOOK BODY]:", rawBody);

    let payload: Record<string, any> = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    const isTestWebhook = payload.test === true || payload.type === "TEST" || payload.event === "test" || !authHeader;

    // 1. Validação por Bearer Token no Header de Autorização (ignora se for teste explícito)
    const expectedBearer = process.env.GGPIX_BEARER_TOKEN || "83380259fd8ead3107b71f27e2c8f7ab4d22528bbe3e6f102c8014b48baecd98";
    if (expectedBearer && authHeader && !isTestWebhook) {
      const token = authHeader.replace(/^Bearer\s+/i, "").trim();
      if (token !== expectedBearer) {
        console.warn("Webhook: Bearer token inválido. Recebido:", token);
        return NextResponse.json({ error: "Invalid Bearer Token" }, { status: 401 });
      }
    }

    // 2. Validação opcional por Assinatura HMAC (se configurado na env)
    if (process.env.GGPIX_WEBHOOK_SECRET && signature && !isTestWebhook) {
      const isValid = validateWebhookSignature(rawBody, signature, process.env.GGPIX_WEBHOOK_SECRET);
      if (!isValid) {
        console.warn("Webhook: Assinatura HMAC inválida.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    console.log("GG Pix Webhook recebido:", JSON.stringify(payload));

    // Identificar external_id ou transaction_id
    const externalId = payload.externalId || payload.external_id || payload.data?.externalId || `test_hook_${Date.now()}`;
    const transactionId = payload.transactionId || payload.id || payload.data?.id || `txn_${Date.now()}`;
    const status = payload.status || payload.event || payload.data?.status || "PAID";
    const eventType = payload.type || payload.eventType || "PIX_IN";

    if (!externalId && !transactionId) {
      return NextResponse.json({ error: "External ID ou Transaction ID não encontrado" }, { status: 400 });
    }

    const supabase = createAdminClient();

    let marcasToAdd = 3;
    let packName = "Radar RPI (3 Marcas)";

    // 3. Processar Confirmação de Pagamento
    if (status === "COMPLETE" || status === "PAID" || status === "COMPLETED" || status === "payment.succeeded") {
      // 1. Verificar idempotência: se o pagamento já foi confirmado anteriormente, ignora retry
      let existingRecord = null;
      try {
        let checkQuery = supabase.from("payments").select("*");
        if (externalId) {
          checkQuery = checkQuery.eq("external_id", externalId);
        } else if (transactionId) {
          checkQuery = checkQuery.eq("ggpix_transaction_id", String(transactionId));
        }
        const { data } = await checkQuery.maybeSingle();
        existingRecord = data;
      } catch (err) {
        console.warn("Aviso ao verificar pagamento existente:", err);
      }

      if (existingRecord?.status === "PAID") {
        console.log(`[WEBHOOK IDEMPOTENCY] Pagamento ${externalId || transactionId} já foi processado anteriormente. Ignorando duplicata.`);
        return NextResponse.json({ success: true, message: "Pagamento já processado" });
      }

      let query = supabase.from("payments").update({
        status: "PAID",
        paid_at: payload.paidAt || new Date().toISOString(),
        payer_name: payload.payer?.name || null,
        payer_document: payload.payer?.document || null,
      });

      if (externalId) {
        query = query.eq("external_id", externalId);
      } else if (transactionId) {
        query = query.eq("ggpix_transaction_id", String(transactionId));
      }

      let paymentRecord = null;
      try {
        const { data } = await query.select().maybeSingle();
        paymentRecord = data || existingRecord;
      } catch (err) {
        console.warn("Aviso ao atualizar transação existente:", err);
      }

      // Resolução segura e prioritária do usuário associado
      let targetUserId = paymentRecord?.user_id;
      if (!targetUserId && (paymentRecord?.payer_email || payload.payer?.email)) {
        try {
          const emailToFind = paymentRecord?.payer_email || payload.payer?.email;
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("id")
            .ilike("email", emailToFind)
            .maybeSingle();
          if (userProfile?.id) {
            targetUserId = userProfile.id;
          }
        } catch (e) {
          console.warn("Aviso ao buscar perfil por e-mail no webhook:", e);
        }
      }

      if (!targetUserId) {
        try {
          const { data: firstProfile } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
          targetUserId = firstProfile?.id || null;
        } catch {
          targetUserId = null;
        }
      }

      // Se a transação não existia previamente no banco (ex: teste manual do painel da GG Pix), registrar agora
      if (!paymentRecord && (externalId || transactionId)) {
        try {
          const insertPayload: any = {
            external_id: externalId || String(transactionId),
            ggpix_transaction_id: transactionId ? String(transactionId) : null,
            amount_cents: payload.amount ? Math.round(payload.amount * 100) : 100,
            status: "PAID",
            payer_name: payload.payer?.name || "Teste Painel GG Pix",
            paid_at: payload.paidAt || new Date().toISOString(),
          };
          if (targetUserId) {
            insertPayload.user_id = targetUserId;
          }
          await supabase.from("payments").insert(insertPayload);
        } catch (insertErr) {
          console.warn("Aviso ao registrar pagamento de teste:", insertErr);
        }
      }

      const paidAmount = payload.amount ? Math.round(payload.amount * 100) : (paymentRecord?.amount_cents || 9700);

      // 1. Extração dinâmica de quantidade do ID (ex: radar_5_marcas, pack_10, etc.)
      const dynamicMatch = externalId ? externalId.match(/radar_(\d+)_marcas/i) : null;
      if (dynamicMatch && dynamicMatch[1]) {
        const qty = parseInt(dynamicMatch[1], 10);
        if (!isNaN(qty) && qty > 0) {
          marcasToAdd = qty;
          packName = `Radar RPI (${qty} ${qty === 1 ? "Marca" : "Marcas"})`;
        }
      } else if (externalId && (externalId.includes("pack_10") || externalId.includes("start"))) {
        marcasToAdd = 10;
        packName = "Radar RPI (10 Marcas)";
      } else if (externalId && (externalId.includes("pack_80") || externalId.includes("office") || externalId.includes("scale"))) {
        marcasToAdd = 80;
        packName = "Radar RPI (80 Marcas)";
      } else if (paidAmount === 14700 || payload.amount === 147) {
        marcasToAdd = 5;
        packName = "Radar RPI (5 Marcas)";
      } else if (paidAmount === 29700 || payload.amount === 297) {
        marcasToAdd = 15;
        packName = "Radar RPI (15 Marcas)";
      } else if (paidAmount === 49700 || payload.amount === 497) {
        marcasToAdd = 30;
        packName = "Radar RPI (30 Marcas)";
      } else if (paidAmount === 4700 || payload.amount === 47) {
        marcasToAdd = 1;
        packName = "Radar RPI (1 Marca)";
      } else if (paidAmount === 9700 || payload.amount === 97) {
        marcasToAdd = 3;
        packName = "Radar RPI (3 Marcas)";
      }

      // Ativar / Adicionar Limite de Processos ao Usuário
      if (targetUserId) {
        // 1. Atualizar user_metadata no Supabase Auth
        try {
          await supabase.auth.admin.updateUserById(targetUserId, {
            user_metadata: { plan: packName, plan_status: "active" }
          });
        } catch (authErr) {
          console.error("Erro ao atualizar user_metadata no Auth:", authErr);
        }

        // 2. Atualizar limite de marcas e plano na tabela profiles
        try {
          const newLimit = marcasToAdd;

          await supabase
            .from("profiles")
            .update({
              marcas_limit: newLimit,
              plan: packName,
              plan_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("id", targetUserId);

          console.log(`[WEBHOOK] Plano ativado com sucesso para ${targetUserId}: ${packName} com limite de ${newLimit} marcas.`);
        } catch (profileErr) {
          console.warn("Aviso ao atualizar profiles:", profileErr);
        }

        // 3. Enviar e-mail de confirmação de pagamento via Resend
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(targetUserId);
          const userEmail = userData?.user?.email || paymentRecord?.payer_email || payload.payer?.email;
          const userName = userData?.user?.user_metadata?.name || paymentRecord?.payer_name || payload.payer?.name || "Doutor(a)";
          const amountCents = payload.amount ? Math.round(payload.amount * 100) : (paymentRecord?.amount_cents || 19700);

          if (userEmail) {
            sendPaymentSuccessEmail({
              email: userEmail,
              name: userName,
              planName: packName,
              amountCents,
              externalId: externalId || paymentRecord?.external_id,
            }).catch((e) => console.error("[WEBHOOK] Erro no envio de e-mail de pagamento:", e));
          }
        } catch (mailErr) {
          console.error("[WEBHOOK] Falha ao disparar e-mail de pagamento:", mailErr);
        }
      }
    }

    // Emitir broadcast em tempo real para qualquer dashboard aberta
    try {
      const channel = supabase.channel("global-dashboard-events");
      await channel.send({
        type: "broadcast",
        event: "webhook_received",
        payload: {
          externalId,
          transactionId,
          status,
          amount: payload.amount || 47,
          payerName: payload.payer?.name || "Cliente / Teste Webhook",
          planName: packName,
          test: isTestWebhook,
        },
      });
      supabase.removeChannel(channel);
    } catch (bErr) {
      console.warn("Aviso ao emitir broadcast Realtime:", bErr);
    }

    return NextResponse.json({ received: true, broadcasted: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}
