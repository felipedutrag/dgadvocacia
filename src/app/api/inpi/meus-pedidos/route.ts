import { NextResponse } from 'next/server';
import { inpiListarMeusPedidos } from '../inpi-service';

export async function GET() {
  try {
    const result = await inpiListarMeusPedidos();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      total: result.processos ? result.processos.length : 0,
      processos: result.processos || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro interno ao consultar Meus Pedidos' }, { status: 500 });
  }
}
