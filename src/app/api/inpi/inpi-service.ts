import * as cheerio from 'cheerio';
import iconv from 'iconv-lite';

export type InpiProcessoDetail = {
  codPedido: string;
  numeroProcesso: string;
  marca: string;
  situacao: string;
  apresentacao?: string;
  natureza?: string;
  titular?: string;
  procurador?: string;
  dataDeposito?: string;
  dataConcessao?: string;
  dataVigencia?: string;
  logoUrl?: string;
  classes?: Array<{
    classe: string;
    subClasse?: string;
    especificacao?: string;
  }>;
  classificacaoViena?: Array<{
    edicao: string;
    codigo: string;
    descricao: string;
  }>;
  despachos: Array<{
    rpi: string;
    dataRpi: string;
    codigoDespacho: string;
    descricaoDespacho?: string;
    complemento?: string;
  }>;
};

type NodeInputs = {
  marca: string;
  buscaExata?: string;
  classeInter?: string; // ex.: "45", "32", "03"
};

type FiguraInputs = {
  viena1: string; // Ex: "26.01.01" ou "25.05.01"
  viena2?: string;
  viena3?: string;
  classeInter?: string;
  registerPerPage?: string;
};

const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
  'Connection': 'keep-alive',
};

/**
 * Formata erros de comunicação com o portal do INPI de forma amigável e profissional
 */
export function formatInpiErrorMessage(statusOrError?: number | string): string {
  if (typeof statusOrError === 'number') {
    if (statusOrError === 503 || statusOrError === 502 || statusOrError === 504) {
      return 'O portal oficial do INPI está temporariamente fora do ar ou em manutenção técnica. Por favor, tente novamente em alguns instantes.';
    }
    if (statusOrError === 500) {
      return 'O servidor do INPI encontrou uma instabilidade interna temporária. Por favor, tente novamente em instantes.';
    }
    if (statusOrError === 429) {
      return 'Limite temporário de requisições ao portal do INPI atingido. Aguarde alguns segundos e tente novamente.';
    }
    return `O sistema de buscas do INPI está temporariamente indisponível no momento. Por favor, tente novamente em instantes.`;
  }

  const errStr = String(statusOrError || '');
  if (
    errStr.includes('503') ||
    errStr.includes('502') ||
    errStr.includes('504') ||
    errStr.includes('fetch failed') ||
    errStr.includes('ECONNREFUSED') ||
    errStr.includes('ENOTFOUND') ||
    errStr.includes('ETIMEDOUT') ||
    errStr.includes('UND_ERR_CONNECT_TIMEOUT')
  ) {
    return 'O portal oficial do INPI está temporariamente fora do ar ou em manutenção técnica. Por favor, tente novamente em alguns instantes.';
  }

  return errStr || 'O portal do INPI está temporariamente indisponível. Tente novamente em instantes.';
}

async function getInpiSessionCookies(user?: string, pass?: string): Promise<string> {
  const inpiUser = user || process.env.INPI_USER;
  const inpiPass = pass || process.env.INPI_PASSWORD;

  // 1. Acesso à raiz
  const initRes = await fetch('https://busca.inpi.gov.br/pePI/', {
    cache: 'no-store',
    headers: COMMON_HEADERS,
  });

  let cookies = '';
  const setCookieHeader = initRes.headers.get('set-cookie');
  if (setCookieHeader) {
    // @ts-ignore
    const cookieArray = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : setCookieHeader.split(',');
    cookies = cookieArray.map(c => c.trim().split(';')[0]).filter(c => c.length > 0).join('; ');
  }

  // 2. Se houver credenciais, faz login autenticado
  if (inpiUser && inpiPass) {
    const loginParams = new URLSearchParams();
    loginParams.append('T_Login', inpiUser);
    loginParams.append('T_Senha', inpiPass);
    loginParams.append('action', 'login');
    loginParams.append('Usuario', '');

    const authRes = await fetch('https://busca.inpi.gov.br/pePI/servlet/LoginController', {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookies,
        Referer: 'https://busca.inpi.gov.br/pePI/',
      },
      body: loginParams.toString(),
    });

    const authSetCookie = authRes.headers.get('set-cookie');
    if (authSetCookie) {
      // @ts-ignore
      const cookieArray = authRes.headers.getSetCookie ? authRes.headers.getSetCookie() : authSetCookie.split(',');
      const newCookies = cookieArray.map(c => c.trim().split(';')[0]).filter(c => c.length > 0).join('; ');
      if (newCookies) cookies = newCookies;
    }
  } else {
    // Login anônimo
    const anonRes = await fetch('https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login', {
      cache: 'no-store',
      headers: COMMON_HEADERS,
    });
    const anonSetCookie = anonRes.headers.get('set-cookie');
    if (anonSetCookie) {
      // @ts-ignore
      const cookieArray = anonRes.headers.getSetCookie ? anonRes.headers.getSetCookie() : anonSetCookie.split(',');
      cookies = cookieArray.map(c => c.trim().split(';')[0]).filter(c => c.length > 0).join('; ');
    }
  }

  return cookies;
}

function parseInpiHtml(html: string) {
  const $ = cheerio.load(html);
  const processos: any[] = [];

  $('table tr').each((i, tr) => {
    const tds = $(tr).find('td');
    if (tds.length < 5) return;

    // Procura o link do processo ou número de 9 dígitos
    const linkProc = $(tr).find('a[href*="CodPedido"], a[href*="MarcasServletController"]');
    let numero = '';
    let codPedido = '';

    if (linkProc.length > 0) {
      const matchNum = linkProc.text().trim().match(/\d{9}/);
      if (matchNum) numero = matchNum[0];
      const matchCod = linkProc.attr('href')?.match(/CodPedido=(\d+)/);
      if (matchCod) codPedido = matchCod[1];
    }

    if (!numero) {
      const text0 = $(tds[0]).text().trim();
      const text1 = $(tds[1]).text().trim();
      if (/^\d{9}$/.test(text0)) numero = text0;
      else if (/^\d{9}$/.test(text1)) numero = text1;
    }

    if (!numero) return;

    // Determina o offset das colunas (com ou sem checkbox de login)
    const hasCheckbox = $(tds[0]).find('input[type="checkbox"]').length > 0;
    const offset = hasCheckbox ? 1 : 0;

    const prioridade = $(tds[offset + 1]).text().replace(/\s+/g, ' ').trim();
    const tipoMarca =
      $(tds[offset + 2]).find('img').attr('alt')?.trim() ||
      $(tds[offset + 2]).text().replace(/\s+/g, ' ').trim();
    const marca = $(tds[offset + 3]).text().replace(/\s+/g, ' ').trim();
    const situacao = $(tds[offset + 5]).text().replace(/\s+/g, ' ').trim() || $(tds[offset + 4]).find('img').attr('alt')?.trim() || '';
    const titular = $(tds[offset + 6]).text().replace(/\s+/g, ' ').trim();
    const classeBruta = $(tds[offset + 7]).text().replace(/\s+/g, ' ').trim();

    let classeInter: string | null = null;
    let nclVersao: string | null = null;

    const m1 = classeBruta.match(/^(\d{2})/);
    if (m1) classeInter = m1[1];

    const m2 = classeBruta.match(/NCL\((\d+)\)\s*(\d{2})/i);
    if (m2) {
      nclVersao = m2[1];
      classeInter = m2[2];
    }

    processos.push({
      numero,
      codPedido,
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

/**
 * Consulta marcas por nome/classe básica no INPI
 */
export default async function inpiConsulta(
  { marca, buscaExata = 'sim', classeInter }: NodeInputs,
  options?: { logging?: { log: (msg: string) => void }; user?: string; password?: string },
) {
  const log = options?.logging?.log || console.log;

  try {
    log('Iniciando consulta INPI...');
    const cookies = await getInpiSessionCookies(options?.user, options?.password);

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
          ...COMMON_HEADERS,
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: cookies,
          Origin: 'https://busca.inpi.gov.br',
          Referer: 'https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_classe_basica.jsp',
        },
        body: params.toString(),
      },
    );

    if (!searchResponse.ok) {
      throw new Error(formatInpiErrorMessage(searchResponse.status));
    }

    const arrayBuffer = await searchResponse.arrayBuffer();
    const resultHtml = iconv.decode(Buffer.from(arrayBuffer), 'ISO-8859-1');
    const processos = parseInpiHtml(resultHtml);

    return {
      success: true,
      marca,
      buscaExata,
      classeInter: classeInter ?? null,
      processos,
    };
  } catch (error: any) {
    const formattedErr = formatInpiErrorMessage(error.message);
    log(`Erro na consulta INPI: ${formattedErr}`);
    return {
      success: false,
      error: formattedErr,
      marca,
      buscaExata,
      classeInter: classeInter ?? null,
    };
  }
}

/**
 * Consulta marcas pela Classificação de Viena (Cód. Figura / CFE)
 * URL: https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_figura.jsp
 */
export async function inpiConsultaFigura(
  { viena1, viena2 = '', viena3 = '', classeInter = '', registerPerPage = '100' }: FiguraInputs,
  options?: { user?: string; password?: string }
): Promise<{ success: boolean; processos?: any[]; error?: string }> {
  try {
    const cookies = await getInpiSessionCookies(options?.user, options?.password);

    const params = new URLSearchParams();
    params.append('viena1', viena1.trim());
    params.append('viena2', viena2.trim());
    params.append('viena3', viena3.trim());
    params.append('classeInter', classeInter.trim());
    params.append('registerPerPage', registerPerPage);
    params.append('botao', ' pesquisar » ');
    params.append('Action', 'searchMarca');
    params.append('tipoPesquisa', 'BY_FIGURA');

    const res = await fetch('https://busca.inpi.gov.br/pePI/servlet/MarcasServletController', {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookies,
        Origin: 'https://busca.inpi.gov.br',
        Referer: 'https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_figura.jsp',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      throw new Error(formatInpiErrorMessage(res.status));
    }

    const html = iconv.decode(Buffer.from(await res.arrayBuffer()), 'ISO-8859-1');
    const processos = parseInpiHtml(html);

    return {
      success: true,
      processos,
    };
  } catch (error: any) {
    return {
      success: false,
      error: formatInpiErrorMessage(error.message),
    };
  }
}

/**
 * Consulta detalhes completos e despachos de um processo específico pelo número ou CodPedido
 */
export async function inpiConsultarProcesso(
  numeroOuCodPedido: string,
  options?: { user?: string; password?: string }
): Promise<{ success: boolean; data?: InpiProcessoDetail; error?: string }> {
  try {
    const cookies = await getInpiSessionCookies(options?.user, options?.password);
    let codPedido = '';

    if (/^\d{1,7}$/.test(numeroOuCodPedido.trim())) {
      codPedido = numeroOuCodPedido.trim();
    } else {
      const params = new URLSearchParams();
      params.append('NumPedido', numeroOuCodPedido.trim());
      params.append('NumGRU', '');
      params.append('NumProtocolo', '');
      params.append('NumInscricaoInternacional', '');
      params.append('botao', ' pesquisar » ');
      params.append('Action', 'searchMarca');
      params.append('tipoPesquisa', 'BY_NUM_PROC');

      const searchRes = await fetch('https://busca.inpi.gov.br/pePI/servlet/MarcasServletController', {
        method: 'POST',
        headers: {
          ...COMMON_HEADERS,
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: cookies,
          Origin: 'https://busca.inpi.gov.br',
          Referer: 'https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_num_processo.jsp',
        },
        body: params.toString(),
      });

      if (!searchRes.ok) {
        throw new Error(formatInpiErrorMessage(searchRes.status));
      }

      const searchHtml = iconv.decode(Buffer.from(await searchRes.arrayBuffer()), 'ISO-8859-1');
      const $s = cheerio.load(searchHtml);
      const detailLink = $s('a[href*="Action=detail"]').first().attr('href');

      if (!detailLink) {
        return {
          success: false,
          error: `Processo ${numeroOuCodPedido} não encontrado no banco de dados do INPI.`
        };
      }

      const matchCod = detailLink.match(/CodPedido=(\d+)/);
      if (matchCod) {
        codPedido = matchCod[1];
      }
    }

    if (!codPedido) {
      return { success: false, error: 'Não foi possível identificar o identificador interno do processo.' };
    }

    const detailUrl = `https://busca.inpi.gov.br/pePI/servlet/MarcasServletController?Action=detail&CodPedido=${codPedido}`;
    const detailRes = await fetch(detailUrl, {
      headers: {
        ...COMMON_HEADERS,
        Cookie: cookies,
        Referer: 'https://busca.inpi.gov.br/pePI/servlet/MarcasServletController',
      }
    });

    if (!detailRes.ok) {
      throw new Error(formatInpiErrorMessage(detailRes.status));
    }

    const detailHtml = iconv.decode(Buffer.from(await detailRes.arrayBuffer()), 'ISO-8859-1');
    const $ = cheerio.load(detailHtml);

    const numeroProcesso = $('input#numeroProcesso').val()?.toString().trim() ||
      $('font:contains("Nº do Processo:")').parent().next().text().replace(/\s+/g, ' ').trim() || numeroOuCodPedido;
    
    const marca = $('font:contains("Marca:")').parent().next().text().replace(/\s+/g, ' ').trim();
    const situacao = $('font:contains("Situação:")').parent().next().text().replace(/\s+/g, ' ').trim();
    const apresentacao = $('font:contains("Apresentação:")').parent().next().text().replace(/\s+/g, ' ').trim();
    const natureza = $('font:contains("Natureza:")').parent().next().text().replace(/\s+/g, ' ').trim();
    const titular = $('font:contains("Titular:")').parent().next().text().replace(/\s+/g, ' ').trim();
    const procurador = $('font:contains("Procurador:")').parent().next().text().replace(/\s+/g, ' ').trim();

    let dataDeposito = '';
    let dataConcessao = '';
    let dataVigencia = '';
    $('th:contains("Data de Depósito")').closest('table').find('tbody tr').each((_, tr) => {
      const ths = $(tr).find('th, td');
      if (ths.length >= 1) dataDeposito = $(ths[0]).text().trim();
      if (ths.length >= 2) dataConcessao = $(ths[1]).text().trim();
      if (ths.length >= 3) dataVigencia = $(ths[2]).text().trim();
    });

    let logoUrl: string | undefined;
    const imgEl = $('img[src*="LogoMarcasServletController"]');
    if (imgEl.length > 0) {
      const src = imgEl.attr('src');
      const codProcessoMatch = src?.match(/codProcesso=(\d+)/);
      if (codProcessoMatch) {
        logoUrl = `/api/inpi/image?codProcesso=${codProcessoMatch[1]}`;
      }
    }

    const classes: Array<{ classe: string; subClasse?: string; especificacao?: string }> = [];
    $('#accordion-classificacao-produto-servico').closest('.accordion-item').find('table tbody tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 3) {
        classes.push({
          classe: $(tds[0]).text().trim(),
          subClasse: $(tds[1]).text().trim(),
          especificacao: $(tds[2]).text().replace(/\s+/g, ' ').trim(),
        });
      }
    });

    const despachos: Array<{
      rpi: string;
      dataRpi: string;
      codigoDespacho: string;
      descricaoDespacho?: string;
      complemento?: string;
    }> = [];

    $('#accordion-2').closest('.accordion-item').find('table tbody tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 3) {
        const rpi = $(tds[0]).text().trim();
        const dataRpi = $(tds[1]).text().trim();
        const codigoDespacho = $(tds[2]).text().replace(/\s+/g, ' ').trim();
        const complemento = tds.length >= 6 ? $(tds[5]).text().replace(/\s+/g, ' ').trim() : undefined;

        if (rpi && codigoDespacho) {
          despachos.push({
            rpi,
            dataRpi,
            codigoDespacho,
            complemento,
          });
        }
      }
    });

    return {
      success: true,
      data: {
        codPedido,
        numeroProcesso,
        marca,
        situacao,
        apresentacao,
        natureza,
        titular,
        procurador,
        dataDeposito,
        dataConcessao,
        dataVigencia,
        logoUrl,
        classes,
        despachos,
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: formatInpiErrorMessage(error.message),
    };
  }
}

/**
 * Consulta a lista "Meus Pedidos" salvos diretamente na conta do INPI
 */
export async function inpiListarMeusPedidos(
  options?: { user?: string; password?: string }
): Promise<{ success: boolean; processos?: any[]; error?: string }> {
  try {
    const cookies = await getInpiSessionCookies(options?.user, options?.password);
    const meusPedidosUrl = 'https://busca.inpi.gov.br/pePI/servlet/MarcasServletController?Action=searchMarca&tipoPesquisa=BY_MARCA_CLASSIF_BASICA&MeusPedidos=MeusPedidos';

    const res = await fetch(meusPedidosUrl, {
      headers: {
        ...COMMON_HEADERS,
        Cookie: cookies,
        Referer: 'https://busca.inpi.gov.br/pePI/jsp/marcas/Pesquisa_classe_basica.jsp',
      },
    });

    if (!res.ok) {
      throw new Error(formatInpiErrorMessage(res.status));
    }

    const html = iconv.decode(Buffer.from(await res.arrayBuffer()), 'ISO-8859-1');
    const processos = parseInpiHtml(html);

    return {
      success: true,
      processos,
    };
  } catch (error: any) {
    return {
      success: false,
      error: formatInpiErrorMessage(error.message),
    };
  }
}

/**
 * Baixa a imagem oficial do logotipo no INPI usando a sessão autenticada
 */
export async function inpiDownloadLogo(
  codProcesso: string,
  options?: { user?: string; password?: string }
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const cookies = await getInpiSessionCookies(options?.user, options?.password);
    const imgUrl = `https://busca.inpi.gov.br/pePI/servlet/LogoMarcasServletController?Action=image&codProcesso=${codProcesso.trim()}`;

    const res = await fetch(imgUrl, {
      headers: {
        ...COMMON_HEADERS,
        Cookie: cookies,
        Referer: 'https://busca.inpi.gov.br/pePI/servlet/MarcasServletController',
      },
    });

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 50) return null; // Imagem vazia ou placeholder

    return { buffer, contentType };
  } catch (err) {
    console.error('Erro ao baixar logo do INPI:', err);
    return null;
  }
}
