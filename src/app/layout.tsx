import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import Script from "next/script";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DG Advocacia | Direito Imobiliário e Possessório",
  description: "Proteja seu patrimônio com segurança jurídica total. Especialistas em Ações de Despejo, Imissão na Posse e Reintegração de Posse.",
  keywords: ["direito imobiliario", "reintegracao de posse", "acao de despejo", "imissao na posse", "advogado imobiliario", "DG Advocacia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0B0F19] text-[#F3F4F6] font-sans">
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GT-5524WW67"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GT-5524WW67');

            // Global WhatsApp click conversion tracker
            document.addEventListener('click', function(e) {
              var target = e.target;
              while (target && target !== document.body && target.parentNode) {
                if (target.tagName === 'A' && target.href && target.href.indexOf('wa.me') !== -1) {
                  gtag('event', 'conversion', {
                      'send_to': 'AW-18263949464/0H2JCI_vsNAcEJiB94RE',
                      'value': 1.0,
                      'currency': 'BRL'
                  });
                  break;
                }
                target = target.parentNode;
              }
            });
          `}
        </Script>
        
        {children}
        <WhatsAppFloating />
      </body>
    </html>
  );
}
