import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://dgadvocacia.online"),
  title: {
    default: "DG Advocacia | Registro de Marcas & Blindagem no INPI",
    template: "%s | DG Advocacia",
  },
  description: "Escritório de advocacia especializado em registro, assessoria e blindagem de marcas no INPI com inteligência artificial e acompanhamento contínuo da RPI.",
  keywords: [
    "registro de marca",
    "inpi",
    "advogado especialista em marcas",
    "busca inpi",
    "registrar marca",
    "dg advocacia",
    "propriedade intelectual",
    "oposição inpi",
    "recursos inpi",
    "pesquisa de marcas"
  ],
  authors: [{ name: "DG Advocacia" }],
  creator: "DG Advocacia",
  publisher: "DG Advocacia",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" }
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "DG Advocacia | Registro de Marcas & Blindagem no INPI",
    description: "Escritório de advocacia especializado em registro, assessoria e blindagem de marcas no INPI com inteligência artificial.",
    url: "https://dgadvocacia.online",
    siteName: "DG Advocacia",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "DG Advocacia - Registro de Marcas no INPI",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DG Advocacia | Registro de Marcas & Blindagem no INPI",
    description: "Escritório de advocacia especializado em registro e blindagem de marcas no INPI com inteligência artificial.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("dark font-sans", geist.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18263949464"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-18263949464');
          `}
        </Script>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
