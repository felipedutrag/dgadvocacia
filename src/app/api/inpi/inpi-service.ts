import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

type NodeInputs = {
  marca: string;
  buscaExata?: string;
  classeInter?: string; // ex.: "45", "32", "03"
};

function parseInpiHtml(html: string) {
  const $ = cheerio.load(html);
  const processos: any[] = [];

  const tabela = $('table[width="780"]').last();
  if (!tabela || tabela.length === 0) return processos;

  const linhas = tabela.find('tr');

  linhas.each((i, tr) => {
    if (i === 0) return;

    const tds = $(tr).find('td');
    if (tds.length < 8) return;

    const numero = $(tds[0]).text().replace(/\s+/g, ' ').trim();
    if (!numero || !/^\d{9}$/.test(numero)) return;

    const prioridade = $(tds[1]).text().replace(/\s+/g, ' ').trim();
    const tipoMarca =
      $(tds[2]).find('img').attr('alt')?.trim() ||
      $(tds[2]).text().replace(/\s+/g, ' ').trim();
    const marca = $(tds[3]).text().replace(/\s+/g, ' ').trim();
    const situacao = $(tds[5]).text().replace(/\s+/g, ' ').trim();
    const titular = $(tds[6]).text().replace(/\s+/g, ' ').trim();
    const classeBruta = $(tds[7]).text().replace(/\s+/g, ' ').trim();

    let classeInter: string | null = null;
    let nclVersao: string | null = null;

    const m1 = classeBruta.match(/^(\d{2})/);
    if (m1) {
      classeInter = m1[1];
    }

    const m2 = classeBruta.match(/NCL\((\d+)\)\s*(\d{2})/i);
    if (m2) {
      nclVersao = m2[1];
      classeInter = m2[2];
    }

    processos.push({
      numero,
      prioridade,
      tipoMarca,
      marca,
      situacao,
      titular,
      classeBruta,
      classeInter,
      nclVersao,
    });
  });

  return processos;
}

export default async function inpiConsulta(
  { marca, buscaExata = 'sim', classeInter }: NodeInputs,
  options?: { logging?: { log: (msg: string) => void } },
) {
  const log = options?.logging?.log || console.log;

  try {
    log('Iniciando consulta INPI...');

    const commonHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Connection': 'keep-alive',
    };

    const loginResponse = await fetch(
      'https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login',
      { 
        cache: 'no-store',
        headers: commonHeaders
      }
    );

    if (!loginResponse.ok) {
      throw new Error(`Erro ao acessar página de login: ${loginResponse.status}`);
    }

    // Extrair cookies de forma robusta
    let cookies = '';
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    
    if (setCookieHeader) {
      // O fetch nativo do Next.js/Node 18+ pode retornar múltiplos cookies separados por vírgula
      // ou permitir o uso de getSetCookie() se disponível no ambiente
      // @ts-ignore - getSetCookie é novo no Node e pode não estar no tipo global ainda
      const cookieArray = loginResponse.headers.getSetCookie ? loginResponse.headers.getSetCookie() : setCookieHeader.split(',');
      
      cookies = cookieArray
        .map(c => c.trim().split(';')[0])
        .filter(c => c.length > 0)
        .join('; ');
    }

    if (!cookies) {
      log('Aviso: Nenhum cookie encontrado na resposta do INPI, tentando prosseguir...');
    } else {
      log(`Cookies formatados: ${cookies}`);
    }

    const params = new URLSearchParams();
    params.append('buscaExata', buscaExata);
    params.append('txt', 'marca');
    params.append('marca', marca);
    params.append('classeInter', classeInter ?? '');
    params.append('registerPerPage', '100');
    params.append('botao', '');
    params.append('Action', 'searchMarca');
    params.append('tipoPesquisa', 'BY_MARCA_CLASSIF_BASICA');

    const searchResponse = await fetch(
      'https://busca.inpi.gov.br/pePI/servlet/MarcasServletController',
      {
        method: 'POST',
        headers: {
          ...commonHeaders,
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: cookies,
          Origin: 'https://busca.inpi.gov.br',
          Referer: 'https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_classe_basica.jsp',
        },
        body: params.toString(),
      },
    );

    if (!searchResponse.ok) {
      throw new Error(`Erro na busca INPI: ${searchResponse.status}`);
    }

    const arrayBuffer = await searchResponse.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const resultHtml = iconv.decode(buf, 'ISO-8859-1');

    const processos = parseInpiHtml(resultHtml);

    return {
      success: true,
      marca,
      buscaExata,
      classeInter: classeInter ?? null,
      processos,
    };
  } catch (error: any) {
    log(`Erro na consulta INPI: ${error.message}`);
    return {
      success: false,
      error: error.message,
      marca,
      buscaExata,
      classeInter: classeInter ?? null,
    };
  }
}

