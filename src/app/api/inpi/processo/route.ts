import { NextResponse } from 'next/server';
import { inpiConsultarProcesso } from '../inpi-service';

export async function GET(req: Request) {
  try {
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
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno ao consultar INPI' }, { status: 500 });
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
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno ao consultar INPI' }, { status: 500 });
  }
}
