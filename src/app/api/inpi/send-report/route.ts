import { NextResponse } from "next/server";
import inpiConsulta from "@/app/api/inpi/inpi-service";
import { Resend } from "resend";
import { saveLeadToNotion } from "@/lib/notion";

type RequestBody = {
  marca: string;
  classe: string;
  email?: string;
  whatsapp?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const { marca, classe, email, whatsapp } = body;

    if (!marca || !classe || (!email && !whatsapp)) {
      return NextResponse.json(
        { success: false, error: "Parâmetros 'marca', 'classe' e ('email' ou 'whatsapp') são obrigatórios." },
        { status: 400 }
      );
    }

    // Save lead to Notion in the background
    if (marca && (email || whatsapp)) {
      saveLeadToNotion({
        name: `Lead Voz - ${marca}`,
        email: email,
        phone: whatsapp,
        brandName: marca,
        segment: `Classe INPI ${classe}`,
        source: "Voice Search"
      }).catch(err => console.error("Failed to save voice search lead to Notion:", err));
    }

    const normalizedClass = classe.padStart(2, "0");
    let processes: any[] = [];
    let searchSuccess = false;

    // 1. Consulta Exata no INPI
    try {
      const inpiExact = await inpiConsulta({
        marca,
        buscaExata: "sim",
        classeInter: normalizedClass,
      });
      if (inpiExact.success) {
        processes = [...(inpiExact.processos || [])];
        searchSuccess = true;
      }
    } catch (e) {
      console.error("Erro na busca exata:", e);
    }

    // 2. Consulta Redundante no INPI
    try {
      const inpiSimilar = await inpiConsulta({
        marca,
        buscaExata: "nao",
        classeInter: normalizedClass,
      });
      if (inpiSimilar.success) {
        searchSuccess = true;
        const existingNumbers = new Set(processes.map((p) => p.numero));
        for (const proc of (inpiSimilar.processos || [])) {
          if (!existingNumbers.has(proc.numero)) {
            processes.push(proc);
            existingNumbers.add(proc.numero);
          }
        }
      }
    } catch (e) {
      console.error("Erro na busca redundante:", e);
    }

    const isBrandAvailable = processes.length === 0;

    // 3. Configura o Resend para envio do e-mail
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("Chave RESEND_API_KEY não configurada no .env");
      return NextResponse.json(
        { success: false, error: "Serviço de e-mail não configurado." },
        { status: 500 }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    // Constrói o HTML do e-mail
    let processosHtml = "";
    if (!isBrandAvailable) {
      processosHtml = `
        <h3 style="color: #c29d53; font-family: sans-serif;">Processos Semelhantes / Conflitantes Encontrados:</h3>
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 14px; margin-top: 10px;">
          <thead>
            <tr style="background-color: #0d1322; color: #ffffff; text-align: left;">
              <th style="padding: 10px; border: 1px solid #accent; font-weight: bold;">Nº Processo</th>
              <th style="padding: 10px; border: 1px solid #accent; font-weight: bold;">Marca</th>
              <th style="padding: 10px; border: 1px solid #accent; font-weight: bold;">Titular</th>
              <th style="padding: 10px; border: 1px solid #accent; font-weight: bold;">Situação</th>
            </tr>
          </thead>
          <tbody>
            ${processes
              .slice(0, 10)
              .map(
                (p) => `
              <tr style="border-bottom: 1px solid #eaeaea;">
                <td style="padding: 10px; font-weight: bold; color: #1e3a8a;">${p.numero}</td>
                <td style="padding: 10px;">${p.marca}</td>
                <td style="padding: 10px; color: #555555;">${p.titular}</td>
                <td style="padding: 10px;">
                  <span style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: #374151;">
                    ${p.situacao}
                  </span>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        ${processes.length > 10 ? `<p style="font-family: sans-serif; font-size: 12px; color: #666;">Exibindo os primeiros 10 de ${processes.length} processos encontrados.</p>` : ""}
      `;
    }

    const emailHtml = `
      <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0b0f19; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; font-family: serif; margin: 0; font-size: 28px; letter-spacing: 2px;">DG ADVOCACIA</h1>
          <p style="color: #c29d53; font-family: sans-serif; font-size: 12px; letter-spacing: 3px; margin: 5px 0 0 0; text-transform: uppercase;">Propriedade Intelectual</p>
        </div>
        <div style="padding: 30px; font-family: sans-serif; line-height: 1.6; color: #333333;">
          <h2 style="font-family: serif; color: #0b0f19; margin-top: 0;">Relatório de Viabilidade de Marca</h2>
          <p>Olá,</p>
          <p>Fizemos a pesquisa em tempo real na base de dados do INPI para a sua marca <strong>"${marca}"</strong> na <strong>Classe ${classe}</strong>.</p>
          
          <div style="margin: 25px 0; padding: 20px; border-radius: 8px; border-left: 5px solid ${isBrandAvailable ? "#10b981" : "#f59e0b"}; background-color: ${isBrandAvailable ? "#f0fdf4" : "#fffbeb"};">
            <h3 style="margin-top: 0; color: ${isBrandAvailable ? "#047857" : "#b45309"}; font-size: 18px;">
              ${isBrandAvailable ? "✓ Alta Viabilidade de Registro" : "⚠ Conflito Potencial Encontrado"}
            </h3>
            <p style="margin-bottom: 0; font-size: 14px;">
              ${
                isBrandAvailable
                  ? "Nenhum processo idêntico ou semelhante foi localizado nesta classe. Recomendamos iniciar o pedido de registro o quanto antes para garantir a propriedade da marca."
                  : "Identificamos processos que exigem atenção e análise aprofundada por um advogado especialista antes de depositar a marca."
              }
            </p>
          </div>

          ${processosHtml}

          <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p><strong>Deseja assegurar sua marca agora ou tirar dúvidas?</strong></p>
            <p>Dr. Felipe Dutra Gonçalves e equipe jurídica estão à disposição para formalizar seu processo e dar segurança ao seu negócio.</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="https://wa.me/5511972667778?text=Olá,+recebi+meu+relatório+da+marca+${encodeURIComponent(marca)}+e+gostaria+de+prosseguir+com+a+análise." 
                 style="background-color: #c29d53; color: #0b0f19; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 30px; display: inline-block; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                Falar com Especialista
              </a>
            </div>
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; font-family: sans-serif; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">DG Advocacia - Dr. Felipe Dutra Gonçalves - OAB/SP 459.254</p>
        </div>
      </div>
    `;

    let emailSent = false;
    let emailId = undefined;

    if (email) {
      const { data: emailResult, error: emailError } = await resend.emails.send({
        from: "DG Advocacia <contato@dgadvocacia.online>",
        to: [email],
        subject: `Relatório de Viabilidade: Marca "${marca}" - DG Advocacia`,
        html: emailHtml,
      });

      if (emailError) {
        console.error("Erro ao enviar e-mail via Resend:", emailError);
        return NextResponse.json({ success: false, error: emailError.message }, { status: 500 });
      }
      
      emailSent = true;
      emailId = emailResult?.id;
    }

    return NextResponse.json({
      success: true,
      emailSent,
      message: emailSent 
        ? "Pesquisa realizada e relatório enviado com sucesso por e-mail." 
        : "Pesquisa realizada e lead salvo com sucesso no Notion.",
      processosCount: processes.length,
      emailId,
    });
  } catch (error: any) {
    console.error("Erro excepcional na rota de envio de relatório:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
