import { resend } from "@/lib/resend";

const FROM_EMAIL = "DG Advocacia <contato@dgadvocacia.online>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dgadvocacia.online";

/**
 * 1. E-MAIL DE BOAS-VINDAS (REGISTRO DE CONTA)
 */
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  try {
    const firstName = name ? name.split(" ")[0] : "Cliente";
    const loginUrl = `${APP_URL}/login`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Bem-vindo à DG Advocacia — Gestão & Blindagem de Marcas no INPI",
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="color-scheme" content="dark light">
          <meta name="supported-color-schemes" content="dark light">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000 !important; width: 100% !important; min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 16px; background-color: #000000 !important;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #000000 !important; border: 1px solid #262626; border-radius: 16px;">
                  <tr>
                    <td style="padding: 36px 28px; background-color: #000000 !important; border-radius: 16px;">
                      
                      <!-- Logo Header -->
                      <div style="text-align: center; margin-bottom: 28px;">
                        <span style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #c5a880; letter-spacing: 0.05em;">
                          DG <span style="color: #444; font-weight: 300;">|</span> <span style="font-family: sans-serif; font-size: 13px; letter-spacing: 0.25em; color: #8e9aa8; text-transform: uppercase;">ADVOCACIA</span>
                        </span>
                      </div>

                      <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; text-align: center; margin: 0 0 16px; letter-spacing: -0.02em;">
                        Bem-vindo(a), ${firstName}! ⚖️
                      </h1>

                      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 20px; text-align: center; line-height: 1.6;">
                        Sua conta na <strong style="color: #ffffff;">DG Advocacia</strong> foi criada com sucesso. Agora você tem acesso ao nosso ecossistema de inteligência marcária, acompanhamento e registro oficial no INPI.
                      </p>

                      <!-- Recursos em Destaque -->
                      <div style="background-color: #0d0d0d !important; border: 1px solid #222222; border-radius: 12px; padding: 20px; margin: 24px 0;">
                        <h3 style="color: #c5a880; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">
                          Seus Serviços Disponíveis:
                        </h3>
                        <ul style="margin: 0; padding-left: 18px; color: #d4d4d8; font-size: 13px; line-height: 1.8;">
                          <li><strong>Consultas & Raio-X INPI:</strong> Pesquisa de anterioridades e análise de colidência com Inteligência Artificial.</li>
                          <li><strong>Radar de Monitoramento RPI:</strong> Acompanhamento semanal de despachos e publicações oficiais.</li>
                          <li><strong>Gestão de Processos & Prazos:</strong> Controle de vigência decenal e cumprimento de exigências.</li>
                        </ul>
                      </div>

                      <!-- Botão de Ação -->
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${loginUrl}" style="background-color: #c5a880; color: #000000; padding: 14px 34px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block;">
                          Acessar Meu Painel na DG Advocacia &rarr;
                        </a>
                      </div>

                      <p style="font-size: 12px; color: #71717a; text-align: center; margin: 24px 0 0;">
                        Link direto para login: <a href="${loginUrl}" style="color: #c5a880; text-decoration: underline;">${loginUrl}</a>
                      </p>

                      <hr style="border: none; border-top: 1px solid #222222; margin: 28px 0;" />
                      <p style="font-size: 11px; color: #52525b; text-align: center; margin: 0;">
                        DG Advocacia &bull; contato@dgadvocacia.online &bull; Proteção Marcária Especializada
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[RESEND] Erro ao enviar e-mail de boas-vindas:", error);
      return { success: false, error };
    }

    console.log("[RESEND] E-mail de boas-vindas enviado com sucesso para:", email);
    return { success: true, data };
  } catch (err: any) {
    console.error("[RESEND] Falha no envio de boas-vindas:", err);
    return { success: false, error: err.message };
  }
}

/**
 * 2. E-MAIL DE RECUPERAÇÃO DE SENHA
 */
export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  try {
    const firstName = name ? name.split(" ")[0] : "Cliente";

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: "Recuperação de Senha — DG Advocacia",
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="color-scheme" content="dark light">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000 !important; width: 100% !important; min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 16px; background-color: #000000 !important;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #000000 !important; border: 1px solid #262626; border-radius: 16px;">
                  <tr>
                    <td style="padding: 36px 28px; background-color: #000000 !important; border-radius: 16px;">
                      
                      <!-- Logo Header -->
                      <div style="text-align: center; margin-bottom: 28px;">
                        <span style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #c5a880; letter-spacing: 0.05em;">
                          DG <span style="color: #444; font-weight: 300;">|</span> <span style="font-family: sans-serif; font-size: 13px; letter-spacing: 0.25em; color: #8e9aa8; text-transform: uppercase;">ADVOCACIA</span>
                        </span>
                      </div>

                      <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; text-align: center; margin: 0 0 16px; letter-spacing: -0.02em;">
                        Redefinição de Senha
                      </h1>

                      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px; text-align: center; line-height: 1.6;">
                        Olá, <strong style="color: #ffffff;">${firstName}</strong>. Recebemos uma solicitação para redefinir a senha de acesso à sua conta na DG Advocacia.
                      </p>

                      <!-- Botão de Ação -->
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetUrl}" style="background-color: #c5a880; color: #000000; padding: 14px 34px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block;">
                          Criar Nova Senha &rarr;
                        </a>
                      </div>

                      <div style="background-color: #0d0d0d !important; border: 1px solid #222222; border-radius: 10px; padding: 16px; margin: 24px 0; font-size: 12px; color: #a1a1aa; line-height: 1.6;">
                        <strong style="color: #f4f4f5;">Segurança:</strong> Se você não solicitou a redefinição de senha, por favor ignore este e-mail.
                      </div>

                      <p style="font-size: 12px; color: #71717a; text-align: center; margin: 20px 0 0; line-height: 1.5;">
                        Link alternativo:<br />
                        <a href="${resetUrl}" style="color: #c5a880; word-break: break-all;">${resetUrl}</a>
                      </p>

                      <hr style="border: none; border-top: 1px solid #222222; margin: 28px 0;" />
                      <p style="font-size: 11px; color: #52525b; text-align: center; margin: 0;">
                        DG Advocacia &bull; contato@dgadvocacia.online &bull; Suporte Especializado
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[RESEND] Erro ao enviar e-mail de recuperação:", error);
      return { success: false, error };
    }

    console.log("[RESEND] E-mail de recuperação enviado com sucesso para:", email);
    return { success: true, data };
  } catch (err: any) {
    console.error("[RESEND] Falha no envio de recuperação:", err);
    return { success: false, error: err.message };
  }
}

/**
 * 3. E-MAIL DE CONFIRMAÇÃO DE PAGAMENTO
 */
export async function sendPaymentSuccessEmail({
  email,
  name,
  planName,
  amountCents,
  externalId,
}: {
  email: string;
  name: string;
  planName: string;
  amountCents: number;
  externalId?: string;
}) {
  try {
    const firstName = name ? name.split(" ")[0] : "Cliente";
    const dashboardUrl = `${APP_URL}/dashboard`;
    const formattedAmount = (amountCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      cc: ["felipedutra@outlook.com"],
      subject: `Confirmação de Pagamento: ${planName} — DG Advocacia`,
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="utf-8">
          <meta name="color-scheme" content="dark light">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000 !important; width: 100% !important; min-height: 100vh;">
            <tr>
              <td align="center" style="padding: 40px 16px; background-color: #000000 !important;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #000000 !important; border: 1px solid #262626; border-radius: 16px;">
                  <tr>
                    <td style="padding: 36px 28px; background-color: #000000 !important; border-radius: 16px;">
                      
                      <!-- Logo Header -->
                      <div style="text-align: center; margin-bottom: 28px;">
                        <span style="font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #c5a880; letter-spacing: 0.05em;">
                          DG <span style="color: #444; font-weight: 300;">|</span> <span style="font-family: sans-serif; font-size: 13px; letter-spacing: 0.25em; color: #8e9aa8; text-transform: uppercase;">ADVOCACIA</span>
                        </span>
                      </div>

                      <!-- Header de Sucesso -->
                      <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background-color: #1a1408; border: 1px solid #c5a880; border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px; margin-bottom: 12px;">
                          🛡️
                        </div>
                        <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.02em;">
                          Pagamento Confirmado!
                        </h1>
                        <p style="color: #c5a880; font-weight: 700; font-size: 14px; margin-top: 4px;">
                          Seu ${planName} já está ativo na DG Advocacia
                        </p>
                      </div>

                      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 20px; line-height: 1.6;">
                        Olá, <strong style="color: #ffffff;">${firstName}</strong>. Confirmamos o recebimento do seu Pix. Seu serviço de assessoria e monitoramento no INPI foi iniciado com sucesso.
                      </p>

                      <!-- Resumo da Transação -->
                      <div style="background-color: #0d0d0d !important; border: 1px solid #222222; border-radius: 12px; padding: 20px; margin: 24px 0;">
                        <h3 style="color: #c5a880; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 14px; border-bottom: 1px solid #222222; padding-bottom: 8px;">
                          Detalhes do Pagamento
                        </h3>
                        <table style="width: 100%; font-size: 13px; color: #d4d4d8;">
                          <tr>
                            <td style="padding: 6px 0; color: #a1a1aa;">Serviço / Plano:</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #ffffff;">${planName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #a1a1aa;">Valor Pago:</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #c5a880;">${formattedAmount}</td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #a1a1aa;">Forma de Pagamento:</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #ffffff;">Pix Instantâneo</td>
                          </tr>
                          ${externalId ? `
                          <tr>
                            <td style="padding: 6px 0; color: #a1a1aa;">Identificador:</td>
                            <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 11px; color: #71717a;">${externalId}</td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>

                      <!-- Botão de Ação -->
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${dashboardUrl}" style="background-color: #c5a880; color: #000000; padding: 14px 34px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block;">
                          Acessar Meu Painel Agora &rarr;
                        </a>
                      </div>

                      <hr style="border: none; border-top: 1px solid #222222; margin: 28px 0;" />
                      <p style="font-size: 11px; color: #52525b; text-align: center; margin: 0;">
                        DG Advocacia &bull; contato@dgadvocacia.online &bull; Agradecemos a confiança!
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[RESEND] Erro ao enviar confirmação de pagamento:", error);
      return { success: false, error };
    }

    console.log("[RESEND] Confirmação de pagamento enviada com sucesso para:", email);
    return { success: true, data };
  } catch (err: any) {
    console.error("[RESEND] Falha no envio de confirmação de pagamento:", err);
    return { success: false, error: err.message };
  }
}
