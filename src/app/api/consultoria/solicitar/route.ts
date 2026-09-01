import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { empresa, whatsapp, servico, descricao, userEmail, userName } = body;

    if (!empresa || !whatsapp || !servico) {
      return NextResponse.json(
        { error: "Nome da Empresa, WhatsApp e Serviço são campos obrigatórios." },
        { status: 400 }
      );
    }

    const recipientEmail = "fdgoncalves.adv@gmail.com";
    const dataHora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    const clientEmail = userEmail || "E-mail da Conta Logada";
    const clientName = userName || empresa;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="color-scheme" content="dark light">
      </head>
      <body style="margin: 0; padding: 0; background-color: #050505 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505 !important; width: 100% !important; min-height: 100vh;">
          <tr>
            <td align="center" style="padding: 40px 16px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0d0d0d !important; border: 1px solid #262626; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                <tr>
                  <td style="padding: 36px 28px;">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 24px;">
                      <span style="font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #c5a880; letter-spacing: 0.05em;">
                        DG <span style="color: #555;">|</span> <span style="font-size: 12px; letter-spacing: 0.25em; color: #8e9aa8; text-transform: uppercase;">ADVOCACIA</span>
                      </span>
                      <div style="display: inline-block; margin-top: 12px; background-color: #1a1408; border: 1px solid #c5a880; color: #c5a880; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 20px; text-transform: uppercase;">
                        Novo Lead B2B &bull; Assessoria Jurídica
                      </div>
                    </div>

                    <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; text-align: center; margin: 0 0 20px; letter-spacing: -0.02em;">
                      Solicitação: ${servico}
                    </h1>

                    <!-- Tabela de Dados do Cliente -->
                    <div style="background-color: #141414; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <table style="width: 100%; font-size: 13px; color: #d4d4d8; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 8px 0; color: #a1a1aa; width: 35%;">🏢 <strong>Nome da Empresa / Startup:</strong></td>
                          <td style="padding: 8px 0; font-weight: 800; color: #ffffff;">${empresa}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #a1a1aa;">📱 <strong>WhatsApp:</strong></td>
                          <td style="padding: 8px 0; font-weight: 700; color: #22c55e;">
                            <a href="https://wa.me/55${whatsapp.replace(/\D/g, '')}" style="color: #22c55e; text-decoration: underline;">
                              ${whatsapp}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #a1a1aa;">✉️ <strong>E-mail da Conta:</strong></td>
                          <td style="padding: 8px 0; color: #c5a880;">${clientEmail}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #a1a1aa;">👤 <strong>Usuário da Conta:</strong></td>
                          <td style="padding: 8px 0; color: #ffffff;">${clientName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #a1a1aa;">⚖️ <strong>Serviço Solicitado:</strong></td>
                          <td style="padding: 8px 0; font-weight: 800; color: #c5a880;">${servico}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #a1a1aa;">🕒 <strong>Data / Hora:</strong></td>
                          <td style="padding: 8px 0; color: #71717a; font-size: 12px;">${dataHora}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Mensagem / Descrição -->
                    <div style="background-color: #141414; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <h3 style="color: #c5a880; font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px;">
                        📝 Detalhes da Demanda / Observações:
                      </h3>
                      <p style="color: #f4f4f5; font-size: 13px; line-height: 1.6; margin: 0; white-space: pre-wrap;">
                        ${descricao ? descricao : "O cliente não adicionou observações extras."}
                      </p>
                    </div>

                    <!-- Botão de Ação WhatsApp Direto -->
                    <div style="text-align: center; margin: 28px 0;">
                      <a href="https://wa.me/55${whatsapp.replace(/\D/g, '')}?text=Olá%20da%20${encodeURIComponent(empresa)},%20sou%20da%20DG%20Advocacia.%20Recebemos%20sua%20solicitação%20sobre%20${encodeURIComponent(servico)}." 
                         style="background-color: #25D366; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                        Abrir WhatsApp do Cliente &rarr;
                      </a>
                    </div>

                    <hr style="border: none; border-top: 1px solid #222222; margin: 28px 0;" />
                    <p style="font-size: 11px; color: #71717a; text-align: center; margin: 0;">
                      Notificação Automática &bull; Plataforma DG Advocacia 2.0
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "DG Advocacia Leads <contato@dgadvocacia.online>",
      to: [recipientEmail],
      replyTo: userEmail || "contato@dgadvocacia.online",
      subject: `🚨 Novo Lead B2B: ${servico} — ${empresa}`,
      html: htmlContent,
    });

    if (error) {
      console.error("[RESEND] Erro ao enviar e-mail:", error);
      return NextResponse.json({ error: error.message || "Erro no envio" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("[RESEND] Exceção ao enviar solicitação:", err);
    return NextResponse.json({ error: err.message || "Erro interno do servidor" }, { status: 500 });
  }
}
