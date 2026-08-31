"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Scale,
  FileText,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Lock,
  Menu,
  Sun,
  Moon,
  BookOpen,
  Building2,
  HelpCircle,
  Layers,
  AlertCircle,
  CalendarCheck,
  Award
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SmartDocBrand } from "@/components/brand-logo";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const current = document.documentElement.classList.contains("dark");
    if (current) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full max-w-[100vw] overflow-x-hidden flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary font-sans">
      {/* ── Ambient Background Glow & Grids (Matching Login/Register) ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle, var(--grid-color) 1.2px, transparent 1.2px),
            linear-gradient(to right, var(--grid-color) 0.8px, transparent 0.8px),
            linear-gradient(to bottom, var(--grid-color) 0.8px, transparent 0.8px)
          `,
          backgroundSize: "36px 36px, 72px 72px, 72px 72px",
        }}
      />

      <div
        className="pointer-events-none fixed -top-24 left-1/2 z-0 h-80 w-[700px] -translate-x-1/2 blur-3xl opacity-50"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--primary) 25%, transparent), transparent 70%)"
        }}
      />
      
      {/* ── Linear Navigation Bar ── */}
      <header className="fixed top-0 inset-x-0 z-50 flex w-full items-center justify-center border-b border-border/60 bg-background/80 px-4 sm:px-8 py-3 backdrop-blur-xl transition-all">
        <div className="flex w-full max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="group flex items-center shrink-0 transition-transform hover:opacity-95">
            <SmartDocBrand size="lg" />
          </Link>

          <nav className="hidden md:flex items-center text-xs font-semibold text-muted-foreground gap-6">
            <a href="#fundamentos" className="transition-colors hover:text-foreground">Fundamentos Legais</a>
            <a href="#riscos" className="transition-colors hover:text-foreground">Riscos Sem Registro</a>
            <a href="#etapas" className="transition-colors hover:text-foreground">Etapas no INPI</a>
            <a href="#faq" className="transition-colors hover:text-foreground">Dúvidas Frequentes</a>
          </nav>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleTheme}
              className="size-8 rounded-md text-muted-foreground hover:text-foreground"
              title="Alternar Tema"
            >
              {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4" />}
            </Button>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs font-semibold")}
            >
              Acessar Painel
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "sm" }), "text-xs font-bold bg-primary text-primary-foreground h-9 px-4 rounded-lg")}
            >
              Pesquisar Marca
            </Link>
          </div>

          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="size-9 text-foreground">
                  <Menu className="size-5" />
                </Button>
              } />
              <SheetContent side="right" className="w-[280px] p-6 bg-card/95 border-l border-border backdrop-blur-xl">
                <div className="space-y-6 pt-4">
                  <nav className="flex flex-col space-y-4">
                    <a href="#fundamentos" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Fundamentos Legais</a>
                    <a href="#riscos" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Riscos Sem Registro</a>
                    <a href="#etapas" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Etapas no INPI</a>
                    <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Dúvidas Frequentes</a>
                  </nav>
                  <div className="pt-6 border-t border-border/50 space-y-2">
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(buttonVariants({ size: "default" }), "w-full text-sm font-bold bg-primary text-primary-foreground")}
                    >
                      Pesquisar Marca
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full text-sm")}
                    >
                      Acessar Painel
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION (Educativo & Sóbrio) ── */}
      <section className="relative z-10 flex w-full flex-col items-center px-4 pt-32 sm:pt-36 pb-16 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center mx-auto">
          <div className="animate-slide-up mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary tracking-wide backdrop-blur-md">
            <BookOpen className="size-3.5" />
            Guia Jurídico & Inteligência em Propriedade Intelectual
          </div>

          {/* Headline magnética e calibrada */}
          <h1 className="animate-slide-up delay-100 mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15] max-w-3xl mx-auto">
            Proteja o ativo mais valioso do seu negócio: <span className="text-primary">a sua marca</span>
          </h1>

          {/* Subheadline sem negrito */}
          <p className="animate-slide-up delay-200 mb-8 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
            No Brasil, a exclusividade e a propriedade legal de um nome pertencem a quem registra primeiro no INPI. Compreenda as etapas, previna disputas e consulte a viabilidade jurídica da sua marca.
          </p>

          <div className="animate-slide-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-11 sm:h-12 px-6 text-sm font-semibold bg-primary text-primary-foreground rounded-xl gap-2")}
            >
              <span>Consultar Viabilidade do Nome</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#fundamentos"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto h-11 sm:h-12 px-6 text-sm font-medium border-border/80")}
            >
              Conhecer as Regras da Lei
            </a>
          </div>

          <div className="animate-fade-in delay-500 mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Lei Federal nº 9.279/1996</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Proteção Nacional por 10 Anos</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Diagnóstico com IA Especializada</div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 1: FUNDAMENTOS LEGAIS ── */}
      <section id="fundamentos" className="relative z-10 flex w-full flex-col items-center px-4 py-20 bg-card/40 border-y border-border/60">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Scale className="size-3.5" />
              Legislação Brasileira
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Os 3 Pilares Legais da Propriedade Marcária
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Entenda os princípios jurídicos que regem a exclusividade de nomes e sinais distintivos no Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/70 border-border/70 p-6 flex flex-col justify-between space-y-4 backdrop-blur-md">
              <div className="space-y-3">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-foreground">Princípio Atributivo</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  No Brasil, o direito sobre a marca só nasce com a <strong>concessão oficial pelo INPI</strong> (Art. 129 da LPI). Ter empresa aberta na Junta Comercial, CNPJ ou domínio .com.br não garante a posse jurídica do nome.
                </p>
              </div>
              <div className="text-[11px] text-primary/80 font-mono pt-2 border-t border-border/40">
                LPI Art. 129, Caput
              </div>
            </Card>

            <Card className="bg-card/70 border-border/70 p-6 flex flex-col justify-between space-y-4 backdrop-blur-md">
              <div className="space-y-3">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-foreground">Regra da Anterioridade</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  Havendo disputa entre duas empresas pelo mesmo nome comercial, a preferência legal pertence a quem <strong>depositou o pedido primeiro</strong> no INPI (princípio do <em>prior in tempore, potior in jure</em>).
                </p>
              </div>
              <div className="text-[11px] text-primary/80 font-mono pt-2 border-t border-border/40">
                LPI Art. 124, XIX
              </div>
            </Card>

            <Card className="bg-card/70 border-border/70 p-6 flex flex-col justify-between space-y-4 backdrop-blur-md">
              <div className="space-y-3">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-foreground">Princípio da Especialidade</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  A proteção é concedida dentro das <strong>Classes de Nice (NCL)</strong> específicas da sua atividade (produtos ou serviços de 01 a 45). Empresas em setores totalmente distintos podem, em regra, coexistir pacificamente.
                </p>
              </div>
              <div className="text-[11px] text-primary/80 font-mono pt-2 border-t border-border/40">
                Classificação Internacional NCL
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2: RISCOS DE OPERAR SEM REGISTRO ── */}
      <section id="riscos" className="relative z-10 flex w-full flex-col items-center px-4 py-20">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive uppercase tracking-wider">
              <ShieldAlert className="size-3.5" />
              Análise de Riscos
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Os riscos de atuar sem registro no INPI
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Construir um negócio sobre um nome desprotegido gera riscos reais:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center font-bold">
                  <ShieldAlert className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Notificação Extrajudicial & Perda do Nome</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Se outra empresa registrar o mesmo nome primeiro, ela pode notificá-lo formalmente exigindo a interrupção imediata do uso da marca, troca de logotipo, domínio, embalagens e redes sociais em prazos curtos (ex: 48 horas).
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center font-bold">
                  <AlertCircle className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Processos Judiciais e Indenizações</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                O titular legal da marca pode mover ação cominatória cumulada com perdas e danos por concorrência desleal ou contrafação, cobrando percentuais sobre o faturamento obtido com o uso indevido do nome.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Building2 className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Impedimento para Franquias e Licenciamento</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                A Lei de Franquias (Lei nº 13.966/2019) exige expressamente que a franqueadora detenha o pedido ou o registro definitivo da marca no INPI. Sem registro, a expansão comercial fica juridicamente inviabilizada.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Layers className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Desvalorização Patrimonial da Empresa</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Em rodadas de investimento, fusões e aquisições (M&A), a ausência de registro marcário é apontada como passivo crítico em auditorias jurídicas (<em>due diligence</em>), depreciando o valor de mercado do negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: ETAPAS DO PROCESSO NO INPI ── */}
      <section id="etapas" className="relative z-10 flex w-full flex-col items-center px-4 py-20 bg-card/40 border-y border-border/60">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <CalendarCheck className="size-3.5" />
              Processo Administrativo
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              O Passo a Passo do Registro no INPI
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Conheça as 4 fases essenciais pelas quais um pedido de marca tramita na autarquia federal:
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 sm:gap-6 items-start p-5 rounded-2xl border border-border/70 bg-background/60">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground">1. Pesquisa Prévia de Anterioridades & Diagnóstico</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  Antes de recolher taxas federais, é realizada uma varredura na base de dados do INPI para identificar eventuais colidências fonéticas, visuais ou ideológicas com processos já protocolados na mesma classe de mercado.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 items-start p-5 rounded-2xl border border-border/70 bg-background/60">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground">2. Depósito do Pedido & Publicação na RPI</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  O pedido é formalizado com emissão da Guia de Recolhimento da União (GRU) e descrição detalhada de produtos/serviços. Após o exame formal preliminar, o pedido é publicado na Revista da Propriedade Industrial (RPI), abrindo o prazo de 60 dias para oposição de terceiros.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 items-start p-5 rounded-2xl border border-border/70 bg-background/60">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground">3. Exame Substantivo de Mérito</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  Os examinadores federais do INPI analisam se a marca respeita as proibições legais do Art. 124 da LPI (não ser puramente descritiva, genérica ou conflitante com marcas anteriores). Havendo exigências ou oposições, a defesa jurídica é apresentada.
                </p>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 items-start p-5 rounded-2xl border border-border/70 bg-background/60">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                4
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-foreground">4. Deferimento e Certificado de Registro Decenal</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  Com a decisão de deferimento publicada e recolhida a taxa do primeiro decênio, o INPI emite o <strong>Certificado Oficial de Registro de Marca</strong>, válido por 10 anos em todo o Brasil e renovável indefinidamente por períodos iguais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: TECNOLOGIA MARCA SHIELD AI ── */}
      <section className="relative z-10 flex w-full flex-col items-center px-4 py-20">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Search className="size-3.5" />
              Tecnologia DG Advocacia
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              Análise Preditiva de Viabilidade com Inteligência Artificial
            </h2>
            <p className="text-sm text-muted-foreground font-normal leading-relaxed">
              Para tornar a consulta prévia mais ágil e fundamentada, desenvolvemos um módulo de inteligência artificial treinado nas diretrizes de exame de marcas do INPI e na jurisprudência do Art. 124 da Lei 9.279/96.
            </p>
            <ul className="space-y-3 pt-1 text-xs sm:text-sm text-foreground/90 font-normal">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Avaliação de risco de colidência fonética, visual e semântica.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Cálculo de probabilidade de deferimento por classe de atividade.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Recomendações estratégicas para mitigar riscos de oposição de terceiros.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card/70 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="text-xs font-bold text-foreground">Simulação de Diagnóstico</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                MarcaShield AI
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-normal">Resultado da Análise Preliminar:</div>
              <div className="text-sm font-semibold text-foreground">
                Score de Viabilidade: <span className="text-emerald-600 dark:text-emerald-400 font-bold">88/100 (Baixo Risco)</span>
              </div>
              <p className="text-xs text-muted-foreground font-normal leading-relaxed pt-1">
                "Não foram localizadas anterioridades idênticas na Classe 35 (NCL). O sinal distintivo possui densidade conceitual suficiente para registro, com baixo potencial de indeferimento por colidência fonética."
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }), "w-full text-xs font-semibold bg-primary text-primary-foreground")}
              >
                Fazer Consulta Gratuita da Sua Marca
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="relative z-10 flex w-full flex-col items-center px-4 py-20 bg-card/40 border-t border-border/60">
        <div className="w-full max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <HelpCircle className="size-3.5" />
              Perguntas Frequentes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Esclarecimentos Jurídicos sobre o INPI
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Ter o CNPJ registrado na Junta Comercial protege a minha marca?",
                a: "Não. A Junta Comercial protege apenas o Nome Empresarial (Razão Social) no âmbito estadual. A posse exclusiva da Marca (nome fantasia, logotipo ou sinal distintivo) em âmbito nacional só é outorgada pelo registro no INPI (Art. 129 da Lei 9.279/96)."
              },
              {
                q: "Quanto tempo dura o registro de uma marca?",
                a: "O registro da marca tem vigência de 10 (dez) anos contados a partir da data de expedição do Certificado pelo INPI. Ele pode ser prorrogado por períodos sucessivos de 10 anos mediante o pagamento da taxa decenal de manutenção."
              },
              {
                q: "Qual a diferença entre registrar como Pessoa Física ou Jurídica?",
                a: "O registro pode ser feito por Pessoa Física (desde que comprove atividade profissional compatível com o ramo, como profissional autônomo) ou por Pessoa Jurídica (MEI, ME, EPP, LTDA, S/A). Microempresas e pessoas físicas contam com descontos de até 60% nas taxas oficiais do INPI."
              },
              {
                q: "O que acontece se outra empresa tentar registrar um nome semelhante?",
                a: "Durante o trâmite, quando o pedido do terceiro for publicado na Revista da Propriedade Industrial (RPI), o titular legítimo tem o prazo legal de 60 dias para apresentar Oposição Administrativa, demonstrando a colidência e impedindo o registro indevido."
              },
              {
                q: "Quanto tempo costuma durar o processo completo no INPI?",
                a: "Em média, um pedido de marca sem oposição leva entre 10 e 16 meses para alcançar a decisão final de concessão. No entanto, a partir do momento em que o protocolo é gerado, o requerente já possui expectativa de direito e prioridade temporal sobre o nome."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border bg-card overflow-hidden transition-all duration-300 ease-out",
                  openFaq === i
                    ? "border-primary/40 shadow-xs bg-card/90"
                    : "border-border/80 hover:border-border"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out",
                      openFaq === i ? "rotate-180 text-primary" : ""
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed border-t border-border/40 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA (Educativo & Consultivo) ── */}
      <section className="relative z-10 flex w-full flex-col items-center px-4 py-16 sm:py-24 text-center bg-card/60 border-y border-border/70 backdrop-blur-md">
        <div className="flex w-full max-w-3xl flex-col items-center mx-auto space-y-6">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Lock className="size-6 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Consulte a disponibilidade da sua marca
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-normal max-w-xl mx-auto">
            Faça uma consulta prévia em nossa plataforma, verifique anterioridades na base do INPI e receba um diagnóstico de viabilidade jurídica antes de protocolar o seu pedido.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "h-11 sm:h-12 px-8 text-sm font-semibold bg-primary text-primary-foreground rounded-xl gap-2")}
            >
              <span>Acessar Consulta de Viabilidade</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 w-full border-t border-border/70 bg-background">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <SmartDocBrand size="sm" showIcon={true} />
            <span className="hidden md:inline text-border/80 select-none">|</span>
            <span className="font-medium text-foreground/80">
              DG Advocacia — Assessoria Jurídica em Propriedade Intelectual
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-medium">
            <Link href="/termos-de-uso" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <span className="text-muted-foreground/30 select-none">&bull;</span>
            <Link href="/politica-de-privacidade" className="hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
            <span className="text-muted-foreground/30 select-none">&bull;</span>
            <span className="text-muted-foreground/60 font-mono">
              © {new Date().getFullYear()} DG Advocacia.
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
