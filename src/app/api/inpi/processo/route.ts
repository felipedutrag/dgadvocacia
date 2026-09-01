import { NextResponse } from 'next/server';
import { inpiConsultarProcesso } from '../inpi-service';
import { checkFeatureQuota, incrementFeatureQuota } from "@/lib/quotas";

export async function GET(req: Request) {
  try {
    // Checagem de Quota: 1 uso grátis para não-pagantes
    const quotaCheck = await checkFeatureQuota("processo");
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        { error: quotaCheck.error, limitReached: true, upgradeRequired: true },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const numero = searchParams.get('numero') || searchParams.get('processo') || searchParams.get('codPedido');

    if (!numero) {
      return NextResponse.json(
        { error: 'Parâmetro ?numero= ou ?codPedido= é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await inpiConsultarProcesso(numero);

    if (!result.success) {
      const isNotFound = result.error?.includes('não encontrado');
      return NextResponse.json({ error: result.error }, { status: isNotFound ? 404 : 503 });
    }

    if (!quotaCheck.isPaid && quotaCheck.userId) {
      await incrementFeatureQuota("processo", quotaCheck.userId);
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'O portal oficial do INPI está temporariamente fora do ar ou inacessível.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const numero = body.numero || body.processo || body.codPedido || body.NumPedido;

    if (!numero) {
      return NextResponse.json(
        { error: 'Campo "numero" ou "codPedido" é obrigatório no corpo da requisição.' },
        { status: 400 }
      );
    }

    const result = await inpiConsultarProcesso(numero);

    if (!result.success) {
      const isNotFound = result.error?.includes('não encontrado');
      return NextResponse.json({ error: result.error }, { status: isNotFound ? 404 : 503 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'O portal oficial do INPI está temporariamente fora do ar ou inacessível.' }, { status: 500 });
  }
}
