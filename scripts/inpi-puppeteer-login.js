const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runInpiLogin() {
  console.log('Iniciando navegador Puppeteer...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    console.log('Acessando página inicial do INPI (pePI)...');
    await page.goto('https://busca.inpi.gov.br/pePI/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Preenchendo credenciais...');
    await page.type('input[name="T_Login"]', 'felipedgon');
    await page.type('input[name="T_Senha"]', 'VTyeTjzsg');

    console.log('Clicando no botão de continuar/login...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
      page.click('input[type="submit"]')
    ]);

    const currentUrl = page.url();
    console.log('URL após login:', currentUrl);

    const content = await page.content();
    fs.writeFileSync(path.join(__dirname, 'inpi-logged-puppeteer.html'), content);

    const cookies = await page.cookies();
    console.log('Cookies obtidos após login:');
    console.log(JSON.stringify(cookies, null, 2));

    await page.screenshot({ path: path.join(__dirname, 'inpi-login-result.png'), fullPage: true });
    console.log('Screenshot salva em scripts/inpi-login-result.png');

    // Checar se o login foi bem sucedido
    if (content.includes('senha inv') || content.includes('Senha inv') || content.includes('inválid') || content.includes('invalido')) {
      console.log('RESULTADO: Falha de autenticação (usuário/senha incorretos ou erro no portal).');
    } else if (content.includes('Principal.jsp') || content.includes('Marcas') || content.includes('Patentes') || content.includes('Sair')) {
      console.log('RESULTADO: Login efetuado com SUCESSO!');
    } else {
      console.log('RESULTADO: Página carregada. Analisando conteúdo...');
    }

  } catch (error) {
    console.error('Erro durante o fluxo:', error.message);
  } finally {
    await browser.close();
    console.log('Navegador finalizado.');
  }
}

runInpiLogin();
