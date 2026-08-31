import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text || "";

      if (text.startsWith("/start")) {
        const email = text.split(" ")[1]; // Espera /start email@usuario.com
        
        if (!email) {
          await sendTelegramMessage(chatId, "Bem-vindo ao MarcaShield AI. Para vincular sua conta, digite: /start SEU_EMAIL");
          return NextResponse.json({ ok: true });
        }

        // Buscar usuário pelo email
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("email", email.trim())
          .single();

        if (error || !profile) {
          await sendTelegramMessage(chatId, "E-mail não encontrado no sistema. Verifique e tente novamente.");
          return NextResponse.json({ ok: true });
        }

        // Atualizar o chat ID no banco
        await supabase
          .from("profiles")
          .update({ telegram_chat_id: chatId.toString() })
          .eq("id", profile.id);

        await sendTelegramMessage(chatId, `✅ Olá, ${profile.name}! Sua conta foi vinculada com sucesso ao MarcaShield AI. Você receberá atualizações do INPI (RPI) aqui.`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Erro no webhook do Telegram:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
