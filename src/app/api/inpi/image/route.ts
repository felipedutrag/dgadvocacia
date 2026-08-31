import { NextResponse } from 'next/server';
import { inpiDownloadLogo } from '../inpi-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const codProcesso = searchParams.get('codProcesso') || searchParams.get('codPedido') || searchParams.get('id');

    if (!codProcesso) {
      return NextResponse.json({ error: 'Parâmetro ?codProcesso= é obrigatório.' }, { status: 400 });
    }

    const result = await inpiDownloadLogo(codProcesso);

    if (!result || !result.buffer || result.buffer.length === 0) {
      return NextResponse.json({ error: 'Imagem não disponível para este processo no INPI.' }, { status: 404 });
    }

    const uint8 = new Uint8Array(result.buffer);

    return new Response(uint8, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erro ao carregar imagem' }, { status: 500 });
  }
}
