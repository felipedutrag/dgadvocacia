import { NextResponse } from "next/server";
import inpiConsulta from "@/app/api/inpi/inpi-service";
import { saveLeadToNotion } from "@/lib/notion";

type RequestBody = {
  trademark?: string;
  description?: string;
  whatsapp?: string;
  classe?: string;
  exata?: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trademark = searchParams.get("marca") || searchParams.get("trademark");
    const classe = searchParams.get("classe") || "";
    const exata = searchParams.get("exata") || "nao";

    if (!trademark) {
      return NextResponse.json(
        { success: false, error: "O parâmetro ?marca= é obrigatório" },
        { status: 400 }
      );
    }

    const inpiRes = await inpiConsulta({
      marca: trademark.trim(),
      buscaExata: exata === "sim" ? "sim" : "nao",
      classeInter: classe.trim() || undefined,
    });

    return NextResponse.json(inpiRes);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const trademark = body.trademark?.trim();
    const classe = body.classe?.trim() || "25"; // Default para vestuário se não enviado

    if (!trademark) {
      return NextResponse.json(
        {
          success: false,
          error: "O campo 'trademark' (nome da marca) é obrigatório",
        },
        { status: 400 },
      );
    }
    if (trademark && body.description) {
      saveLeadToNotion({
        name: body.description.trim(),
        phone: body.whatsapp?.trim(),
        brandName: trademark,
        segment: `Classe INPI ${classe}`,
        source: "Simulator"
      }).catch(err => console.error("Failed to save simulator lead to Notion:", err));
    }

    const normalizedClass = classe.padStart(2, "0");
    let processes: any[] = [];
    let isSuccess = false;

    // 1. Busca Exata no INPI
    try {
      const inpiExact = await inpiConsulta(
        {
          marca: trademark,
          buscaExata: "sim",
          classeInter: normalizedClass,
        },
        { logging: { log: console.log } }
      );
      if (inpiExact.success) {
        processes = [...(inpiExact.processos || [])];
        isSuccess = true;
      }
    } catch (e) {
      console.error("Erro na busca exata do INPI:", e);
    }

    // 2. Busca Redundante (Radical / Similar) no INPI
    try {
      const inpiSimilar = await inpiConsulta(
        {
          marca: trademark,
          buscaExata: "nao",
          classeInter: normalizedClass,
        },
        { logging: { log: console.log } }
      );
      if (inpiSimilar.success) {
        isSuccess = true;
        const existingNumbers = new Set(processes.map((p) => p.numero));
        for (const proc of (inpiSimilar.processos || [])) {
          if (!existingNumbers.has(proc.numero)) {
            processes.push(proc);
            existingNumbers.add(proc.numero);
          }
        }
      }
    } catch (e) {
      console.error("Erro na busca redundante do INPI:", e);
    }

    return NextResponse.json({
      success: isSuccess,
      marca: trademark,
      buscaExata: "sim e nao (redundante)",
      classeInter: classe,
      processos: processes,
      inferredClass: classe,
    });
  } catch (error: any) {
    let message =
      typeof error?.message === "string"
        ? error.message
        : "Erro inesperado ao consultar marca";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
