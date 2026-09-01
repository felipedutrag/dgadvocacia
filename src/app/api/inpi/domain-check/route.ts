import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ error: "Domínio não informado" }, { status: 400 });
    }

    const cleanName = domain.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");

    // 1. Checar Registro.br oficial via API pública RDAP / DNS
    let brAvailable = false;
    try {
      const resBr = await fetch(`https://rdap.registro.br/domain/${cleanName}.com.br`, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 }
      });
      // Se der 404 significa que o domínio está livre para registro
      if (resBr.status === 404) {
        brAvailable = true;
      } else if (resBr.status === 200) {
        brAvailable = false;
      }
    } catch (e) {
      console.warn("Erro ao checar Registro.br:", e);
    }

    // 2. Checar .com via DNS lookup over HTTPS (Google DoH)
    let comAvailable = false;
    try {
      const resCom = await fetch(`https://dns.google/resolve?name=${cleanName}.com&type=A`, {
        next: { revalidate: 60 }
      });
      if (resCom.ok) {
        const dohData = await resCom.json();
        // Se status === 3 (NXDOMAIN) ou sem resposta, provavelmente disponível
        if (dohData.Status === 3 || !dohData.Answer) {
          comAvailable = true;
        }
      }
    } catch (e) {
      console.warn("Erro ao checar .com:", e);
    }

    return NextResponse.json({
      name: cleanName,
      domains: [
        {
          tld: ".com.br",
          fqdn: `${cleanName}.com.br`,
          available: brAvailable,
          registrationUrl: `https://registro.br/busca-dominio/?fqdn=${cleanName}.com.br`
        },
        {
          tld: ".com",
          fqdn: `${cleanName}.com`,
          available: comAvailable,
          registrationUrl: `https://br.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${cleanName}.com`
        },
        {
          tld: ".online",
          fqdn: `${cleanName}.online`,
          available: true,
          registrationUrl: `https://www.hostinger.com.br/verificador-de-dominios?domain=${cleanName}.online`
        }
      ],
      socials: [
        { network: "Instagram", handle: `@${cleanName}`, url: `https://instagram.com/${cleanName}` },
        { network: "LinkedIn", handle: `company/${cleanName}`, url: `https://linkedin.com/company/${cleanName}` },
        { network: "TikTok", handle: `@${cleanName}`, url: `https://tiktok.com/@${cleanName}` }
      ]
    });
  } catch (error: any) {
    console.error("Erro na verificação de domínios:", error);
    return NextResponse.json({ error: error?.message || "Erro ao consultar domínios" }, { status: 500 });
  }
}
