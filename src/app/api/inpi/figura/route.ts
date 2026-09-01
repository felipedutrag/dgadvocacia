import { NextResponse } from 'next/server';
import { inpiConsultaFigura } from '../inpi-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const viena1 = searchParams.get('viena') || searchParams.get('viena1') || searchParams.get('codigo');
    const viena2 = searchParams.get('viena2') || '';
    const viena3 = searchParams.get('viena3') || '';
    const classeInter = searchParams.get('classe') || searchParams.get('classeInter') || '';
    const registerPerPage = searchParams.get('limit') || '100';

    if (!viena1) {
      return NextResponse.json(
        { error: 'Parâmetro ?viena= ou ?viena1= (Código da Classificação de Viena / CFE) é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await inpiConsultaFigura({
      viena1,
      viena2,
      viena3,
      classeInter,
      registerPerPage,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      total: result.processos ? result.processos.length : 0,
      viena1,
      viena2: viena2 || null,
      viena3: viena3 || null,
      classeInter: classeInter || null,
      processos: result.processos || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno ao consultar figura no INPI' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const viena1 = body.viena1 || body.viena || body.codigo;

    if (!viena1) {
      return NextResponse.json(
        { error: 'Campo "viena1" ou "codigo" é obrigatório no corpo da requisição.' },
        { status: 400 }
      );
    }

    const result = await inpiConsultaFigura({
      viena1,
      viena2: body.viena2 || '',
      viena3: body.viena3 || '',
      classeInter: body.classe || body.classeInter || '',
      registerPerPage: body.limit || body.registerPerPage || '100',
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      total: result.processos ? result.processos.length : 0,
      viena1,
      viena2: body.viena2 || null,
      viena3: body.viena3 || null,
      classeInter: body.classe || body.classeInter || null,
      processos: result.processos || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno ao consultar figura no INPI' }, { status: 500 });
  }
}
