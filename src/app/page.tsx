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
  Building2,
  HelpCircle,
  Layers,
  AlertCircle,
  CalendarCheck,
  Briefcase,
  Users,
  Cpu,
  TrendingUp,
  Handshake,
  Check,
  Sparkles,
  Bot,
  Eye,
  BellRing,
  ArrowUpRight
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SmartDocBrand } from "@/components/brand-logo";
import { FloatingAiChat } from "@/components/dashboard/floating-ai-chat";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
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
      {/* ── Ambient Background Glow & Grids ── */}
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

          <nav className="hidden md:flex items-center text-xs font-semibold text-muted-foreground gap-4">
            <a href="#hero" className="transition-colors hover:text-foreground">Home</a>
            <span className="text-border/60 select-none text-[10px] font-light">|</span>
            <a href="#como-funciona" className="transition-colors hover:text-foreground">Como Funciona</a>
            <span className="text-border/60 select-none text-[10px] font-light">|</span>
            <a href="#dashboard" className="transition-colors hover:text-foreground">Dashboard</a>
            <span className="text-border/60 select-none text-[10px] font-light">|</span>
            <a href="#vantagens" className="transition-colors hover:text-foreground">Vantagens</a>
            <span className="text-border/60 select-none text-[10px] font-light">|</span>
            <a href="#servicos" className="transition-colors hover:text-foreground">Serviços</a>
            <span className="text-border/60 select-none text-[10px] font-light">|</span>
            <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
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
              className={cn(buttonVariants({ size: "sm" }), "text-xs font-bold bg-primary text-primary-foreground h-9 px-4 rounded-lg")}
            >
              Painel do Parceiro
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
                  <nav className="flex flex-col space-y-3">
                    <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Home</a>
                    <div className="h-px bg-border/40 w-full" />
                    <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Como Funciona</a>
                    <div className="h-px bg-border/40 w-full" />
                    <a href="#dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Dashboard</a>
                    <div className="h-px bg-border/40 w-full" />
                    <a href="#vantagens" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Vantagens</a>
                    <div className="h-px bg-border/40 w-full" />
                    <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">Serviços</a>
                    <div className="h-px bg-border/40 w-full" />
                    <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-foreground">FAQ</a>
                  </nav>
                  <div className="pt-6 border-t border-border/50 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(buttonVariants({ size: "default" }), "w-full text-sm font-bold bg-primary text-primary-foreground")}
                    >
                      Painel do Parceiro
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION (B2B Parceria Estratégica) ── */}
      <section id="hero" className="relative z-10 flex w-full flex-col items-center px-4 pt-24 sm:pt-36 pb-12 sm:pb-16 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center mx-auto">
          <div className="mb-4 sm:mb-5 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-primary tracking-wide backdrop-blur-md">
            <Handshake className="size-3.5" />
            <span className="sm:hidden">Parceria Jurídica B2B</span>
            <span className="hidden sm:inline">Parceria Jurídica B2B & Backend de Registro de Marcas</span>
          </div>

          <h1 className="mb-3 sm:mb-4 text-[22px] xs:text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2] sm:leading-[1.15] max-w-3xl mx-auto">
            Sua empresa atende os clientes. <br className="hidden sm:inline" />
            Nós fornecemos o <span className="text-primary">suporte jurídico especializado no INPI</span>.
          </h1>

          <p className="mb-6 sm:mb-8 max-w-2xl mx-auto text-xs sm:text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
            Acordo de cooperação e assessoria com a DG Advocacia: otimize a operação do seu negócio enquanto nossa banca especializada assume pareceres, protocolos, defesas e recursos com o apoio de uma dashboard em tempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-11 sm:h-12 px-6 text-sm font-semibold bg-primary text-primary-foreground rounded-xl gap-2")}
            >
              <span>Seja um Parceiro Homologado</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto h-11 sm:h-12 px-6 text-sm font-medium border-border/80")}
            >
              Conhecer a Dashboard
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Cadastro Simplificado por Protocolo</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Defesas, Oposições & Recursos Especializados</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Ferramentas de Consulta & IA para Análise</div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 1: COMO FUNCIONA O ACORDO DE PARCERIA ── */}
      <section id="como-funciona" className="relative z-10 flex w-full flex-col items-center px-4 py-20 bg-card/40 border-y border-border/60">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Layers className="size-3.5" />
              Modelo Operacional
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Como Funciona a Parceria B2B
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Suporte jurídico completo para sua empresa atender mais clientes e focar no atendimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/70 border-border/70 p-6 flex flex-col justify-between backdrop-blur-md">
              <div className="space-y-3 pb-2">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-foreground">1. Atendimento ao Cliente</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  Sua empresa prospecta e atende o cliente, utilizando nossa ferramenta de pesquisa prévia e inteligência para qualificar a demanda.
                </p>
              </div>
              <div className="text-[11px] text-primary/80 font-mono pt-3 border-t border-border/40">
                Relacionamento Direto
              </div>
            </Card>

            <Card className="bg-card/70 border-border/70 p-6 flex flex-col justify-between backdrop-blur-md">
              <div className="space-y-3 pb-2">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-foreground">2. Cadastro do Protocolo</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  Basta lançar o número do processo na sua dashboard de parceiro. Em segundos, o sistema sincroniza os dados do INPI e ativa o pipeline de acompanhamento contínuo.
                </p>
              </div>
              <div className="text-[11px] text-primary/80 font-mono pt-3 border-t border-border/40">
                Sincronização Instantânea
              </div>
            </Card>

            <Card className="bg-card/70 border-border/70 p-6 flex flex-col justify-between backdrop-blur-md">
              <div className="space-y-3 pb-2">
                <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-foreground">3. Suporte Jurídico Especializado</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                  Nossa advocacia atua na assessoria técnica: análise de anterioridades, cumprimento de exigências, manifestações, oposições, recursos e peticionamentos oficiais.
                </p>
              </div>
              <div className="text-[11px] text-primary/80 font-mono pt-3 border-t border-border/40">
                Rigor Técnico & Ético
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2: A DASHBOARD DO PARCEIRO ── */}
      <section id="dashboard" className="relative z-10 flex w-full flex-col items-center px-4 py-20">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Cpu className="size-3.5" />
              Tecnologia Integrada
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Dashboard de Gestão e Acompanhamento
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Controle centralizado dos pedidos e processos da sua carteira em uma única interface inteligente.
            </p>
          </div>

          {/* Grid de Recursos da Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <CalendarCheck className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Cadastro e Gestão por Protocolo</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Adicione o número do protocolo do pedido e tenha acesso imediato a titulares, despachos, classes de Nice, datas de vigência e histórico detalhado direto da base do INPI.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Search className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Ferramentas de Consulta & Viabilidade</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Acesse ferramentas avançadas de busca de anterioridades e diagnósticos de inteligência preditiva (MarcaShield) para fundamentar relatórios preliminares de viabilidade.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Radar Automático da RPI</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Vigilância semanal em todas as edições da Revista da Propriedade Industrial (RPI) para monitorar publicações de despachos, prazos de exigência e eventuais colidências de terceiros.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <FileText className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">Solicitação de Peças Jurídicas</h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Havendo necessidade de oposição, manifestação ou recurso administrativo, solicite a elaboração da peça técnica especializada com fluxo simplificado pela plataforma.
              </p>
            </div>
          </div>

          {/* ── PAINEL DE TELEMETRIA & GRÁFICOS ANALÍTICOS (SHADCN UI) ── */}
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-8 backdrop-blur-md space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Telemetria da Carteira B2B</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mt-1">
                  Radar de Risco Marcário & Volume de Processos
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] font-mono bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-bold">
                  RPI Nº 2825 &bull; Atualizado
                </span>
              </div>
            </div>

            {/* Grid 2 Gráficos / Indicadores */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Gráfico 1: Curva de Monitoramento e Varredura Semanal (SVG Chart) */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4 rounded-xl border border-border/60 bg-background/50 p-3.5 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">Volume de Publicações Analisadas</span>
                    <div className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">14.890 <span className="text-xs font-normal text-emerald-500 font-mono">+18.4%</span></div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    Últimas 6 RPIs
                  </div>
                </div>

                {/* SVG Line / Area Sparkline Chart com Animação de Desenho e Preenchimento */}
                <div className="h-28 sm:h-36 w-full relative pt-2 sm:pt-4 overflow-hidden rounded-lg">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Linhas de Grade de Fundo */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
                    
                    {/* Área Preenchida com Gradiente (Animação Fade-In Preenchendo) */}
                    <path
                      d="M0,80 Q60,65 100,50 T200,60 T300,25 T400,10 L400,100 L0,100 Z"
                      fill="url(#chartGradient)"
                      className="animate-fill-area"
                    />

                    {/* Linha Principal do Gráfico (Animação de Desenho do Traço) */}
                    <path
                      d="M0,80 Q60,65 100,50 T200,60 T300,25 T400,10"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="animate-draw-line"
                    />

                    {/* Pontos de Destaque no Gráfico */}
                    <circle cx="100" cy="50" r="3" className="fill-background stroke-primary" strokeWidth="2" />
                    <circle cx="200" cy="60" r="3" className="fill-background stroke-primary" strokeWidth="2" />
                    <circle cx="300" cy="25" r="3" className="fill-background stroke-primary" strokeWidth="2" />
                    <circle cx="400" cy="10" r="4.5" className="fill-primary stroke-background" strokeWidth="2" />
                  </svg>
                </div>

                {/* Eixo X das RPIs */}
                <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-muted-foreground border-t border-border/40 pt-2">
                  <span>RPI 2820</span>
                  <span>RPI 2821</span>
                  <span>RPI 2822</span>
                  <span>RPI 2823</span>
                  <span>RPI 2824</span>
                  <span className="text-primary font-bold">RPI 2825</span>
                </div>
              </div>

              {/* Gráfico 2: Barra de Status da Carteira & Saúde Jurídica */}
              <div className="lg:col-span-5 space-y-3 sm:space-y-4 rounded-xl border border-border/60 bg-background/50 p-3.5 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold text-foreground">Score de Blindagem da Carteira</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">98.2% Seguro</span>
                  </div>
                  
                  {/* Barra de Progresso Segmentada */}
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex gap-1 p-0.5 border border-border/40">
                    <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: "74%" }} title="Processos Sem Oposição (74%)" />
                    <div className="bg-amber-500 h-full" style={{ width: "18%" }} title="Em Exame Formal (18%)" />
                    <div className="bg-primary h-full rounded-r-full" style={{ width: "8%" }} title="Concedidos Decenal (8%)" />
                  </div>
                </div>

                {/* Legendas & Métricas */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-lg bg-card/60 border border-border/40">
                    <div className="text-[10px] text-muted-foreground">Monitoradas</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">100%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-card/60 border border-border/40">
                    <div className="text-[10px] text-muted-foreground">Prazos Salvos</div>
                    <div className="text-sm font-bold text-emerald-500 mt-0.5">0 Perdas</div>
                  </div>
                  <div className="p-2 rounded-lg bg-card/60 border border-border/40">
                    <div className="text-[10px] text-muted-foreground">Defesas LPI</div>
                    <div className="text-sm font-bold text-primary mt-0.5">60 Dias</div>
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground leading-relaxed flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="size-3.5 text-primary shrink-0" />
                  <span>Sua empresa e clientes protegidos 24/7 contra perdas de prazo no INPI.</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: VANTAGENS DA PARCERIA ── */}
      <section id="vantagens" className="relative z-10 flex w-full flex-col items-center px-4 py-20 bg-card/40 border-y border-border/60">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <TrendingUp className="size-3.5" />
              Eficiência Operacional
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Vantagens da Cooperação Jurídica B2B
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Otimização de custos, previsibilidade e rigor técnico para respaldar a atuação da sua empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-border/70 bg-background/60 space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center">
                <Briefcase className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Otimização de Estrutura</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Conte com suporte jurídico especializado sob demanda, reduzindo custos com contratações fixas e infraestrutura técnica dedicada.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-background/60 space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center">
                <ShieldAlert className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Acompanhamento Rigoroso</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Controle dos prazos processuais da Lei nº 9.279/96 (LPI), com monitoramento sistemático de cada publicação na RPI.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/70 bg-background/60 space-y-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center">
                <Users className="size-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Previsibilidade Financeira</h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                Tabelas e condições estruturadas para parcerias institucionais, permitindo planejamento orçamentário transparente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: BACKEND JURÍDICO & DEFESAS ── */}
      <section id="servicos" className="relative z-10 flex w-full flex-col items-center px-4 py-20">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Scale className="size-3.5" />
                Expertise Técnica
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                Propriedade Industrial
              </h2>
              <p className="text-sm text-muted-foreground font-normal leading-relaxed">
                Atuação técnica nas diversas fases do trâmite administrativo marcário, com peças fundamentadas nas diretrizes de exame do INPI e na legislação marcária.
              </p>
            </div>
            <ul className="space-y-3 pt-1 text-xs sm:text-sm text-foreground/90 font-normal">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Depósito e Protocolo:</strong> Enquadramento adequado nas Classes e Especificações de Nice.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Oposições e Manifestações:</strong> Fundamentação jurídica em casos de colidência com marcas de terceiros.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Cumprimento de Exigências:</strong> Atendimento a despachos formais e exigências de mérito do INPI.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Recursos Administrativos:</strong> Peças recursais técnicas contra decisões e indeferimentos.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 sm:p-8 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-md space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-border/40">
              <span className="text-xs font-bold text-foreground">Fluxo de Protocolo & Radar</span>
              <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md font-bold">
                Acompanhamento Técnico
              </span>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="p-2.5 sm:p-3 rounded-xl bg-background/50 border border-border/60 text-xs space-y-1">
                <div className="font-bold text-foreground flex items-center justify-between">
                  <span>Protocolo Nº 934812345</span>
                  <span className="text-emerald-500 font-mono text-[10px]">Ativo</span>
                </div>
                <div className="text-muted-foreground text-[11px]">Sincronização RPI automática &bull; Monitoramento 24/7</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-background/50 border border-border/60 text-xs space-y-1">
                <div className="font-bold text-foreground flex items-center justify-between">
                  <span>Peça Técnica: Oposição (Art. 158 LPI)</span>
                  <span className="text-amber-500 font-mono text-[10px]">Em Elaboração</span>
                </div>
                <div className="text-muted-foreground text-[11px]">Petição técnica de oposição na Classe 35</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-background/50 border border-border/60 text-xs space-y-1">
                <div className="font-bold text-foreground flex items-center justify-between">
                  <span>Parecer Técnico: Concessão Decenal</span>
                  <span className="text-primary font-mono text-[10px]">Certificado Emitido</span>
                </div>
                <div className="text-muted-foreground text-[11px]">Vigência de 10 anos deferida • Felipe Dutra Gonçalves (OAB/SP)</div>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }), "w-full text-xs font-semibold bg-primary text-primary-foreground")}
              >
                Cadastrar Empresa Parceira
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 5: ESTEIRA OPERACIONAL & PIPELINE DE BLINDAGEM (VISUAL HIGH-TECH) ── */}
      <section className="relative z-10 flex w-full flex-col items-center px-4 py-20 bg-card/40 border-y border-border/60">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Esteira de Governança
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ciclo Completo de Proteção Marcária
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Acompanhe a evolução de cada ativo desde a análise fonética preliminar até a blindagem decenal definitiva.
            </p>
          </div>

          {/* Stepper / Timeline Visual de 4 Estágios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Passo 1: Triagem & Raio-X */}
            <div className="relative group p-5 rounded-2xl border border-border/70 bg-background/60 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-mono">
                    01
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Fase Prévia</span>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <Bot className="size-4 text-primary" />
                  Triagem & Raio-X IA
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Varredura de colidências na base de marcas registradas, enquadramento nas 45 classes de Nice e cálculo de probabilidade de deferimento.
                </p>
              </div>
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-emerald-500">
                <span>Parecer Instantâneo</span>
                <CheckCircle2 className="size-3.5" />
              </div>
            </div>

            {/* Passo 2: Depósito & Exame Formal */}
            <div className="relative group p-5 rounded-2xl border border-border/70 bg-background/60 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-mono">
                    02
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Protocolo</span>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <FileText className="size-4 text-primary" />
                  Depósito Oficial
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Peticionamento eletrônico no e-Marcas com qualificação jurídica, recolhimento de GRUs oficiais e emissão do número do protocolo.
                </p>
              </div>
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-primary">
                <span>Prioridade Unionista</span>
                <CheckCircle2 className="size-3.5" />
              </div>
            </div>

            {/* Passo 3: Radar RPI & Defesa Ativa */}
            <div className="relative group p-5 rounded-2xl border border-border/70 bg-background/60 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-mono">
                    03
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Vigilância</span>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <Eye className="size-4 text-primary" />
                  Vigilância na RPI
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Monitoramento semanal contra oposições de terceiros ou exigências formais, com elaboração de manifestações no prazo estrito de 60 dias.
                </p>
              </div>
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-amber-500">
                <span>Prazo Fatal 60d</span>
                <BellRing className="size-3.5" />
              </div>
            </div>

            {/* Passo 4: Concessão & Certificado Decenal */}
            <div className="relative group p-5 rounded-2xl border border-primary/40 bg-card/80 shadow-lg shadow-primary/5 hover:border-primary transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs font-mono">
                    04
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider font-bold">Ativo Blindado</span>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  Certificado Decenal
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Deferimento publicado e emissão do Certificado de Registro pelo INPI, garantindo exclusividade de uso em território nacional por 10 anos.
                </p>
              </div>
              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-emerald-500 font-bold">
                <span>Vigência 10 Anos</span>
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </div>
            </div>

          </div>

          {/* Banner Interativo B2B com CTA */}
          <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-card/80 via-card/50 to-background/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-xs font-mono uppercase tracking-wider text-primary font-bold">Automação com Rigor Jurídico</div>
              <h4 className="text-base sm:text-lg font-bold text-foreground">
                Toda a complexidade processual do INPI resolvida no seu backend.
              </h4>
              <p className="text-xs text-muted-foreground max-w-xl">
                Você foca em captar e atender clientes; nossa banca cuida dos despachos, prazos e petições técnicas.
              </p>
            </div>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "default" }), "shrink-0 text-xs font-bold bg-primary text-primary-foreground gap-1.5 h-10 px-5 rounded-xl")}
            >
              <span>Cadastrar Carteira</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── FAQ SECTION (B2B) ── */}
      <section id="faq" className="relative z-10 flex w-full flex-col items-center px-4 py-20 bg-card/40 border-t border-border/60">
        <div className="w-full max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <HelpCircle className="size-3.5" />
              Perguntas Frequentes da Parceria
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Dúvidas Sobre o Acordo B2B
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Como se dá a relação com o cliente final e a assessoria jurídica?",
                a: "A sua empresa realiza o atendimento e a gestão de relacionamento com o cliente. A DG Advocacia atua na assessoria técnico-jurídica dos processos sob sua gestão ou mediante regular procuração/substabelecimento, em estrita conformidade com as normas éticas da OAB."
              },
              {
                q: "Como acompanhamos os processos da nossa carteira?",
                a: "Pela nossa Dashboard exclusiva para parceiros. Basta inserir o número do protocolo do pedido no INPI. O sistema sincroniza todos os dados, publica alertas de novas edições da RPI e permite solicitar peças jurídicas com poucos cliques."
              },
              {
                q: "Existe taxa de adesão ou contrato de fidelidade?",
                a: "Não há taxa de adesão oculta. A cooperação pode funcionar por demanda de atos processuais específicos ou por pacotes mensais de monitoramento de carteira."
              },
              {
                q: "Como são elaboradas as oposições e defesas em caso de colidência?",
                a: "Quando uma marca da sua carteira sofre oposição ou requer atuação perante terceiros, nossos advogados redigem a peça técnica fundamentada na Lei 9.279/96 e protocolam perante o INPI dentro do prazo legal improrrogável de 60 dias."
              },
              {
                q: "Como utilizar as ferramentas de busca e viabilidade com IA?",
                a: "Dentro da dashboard você tem acesso ao nosso módulo de busca e diagnósticos preditivos (MarcaShield). Seu time pode emitir relatórios preliminares de viabilidade para orientar seus clientes com mais embasamento."
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

      {/* ── FINAL CTA (Parceria B2B) ── */}
      <section className="relative z-10 flex w-full flex-col items-center px-4 py-16 sm:py-24 text-center bg-card/60 border-y border-border/70 backdrop-blur-md">
        <div className="flex w-full max-w-3xl flex-col items-center mx-auto space-y-6">
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Handshake className="size-6 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Pronto para expandir sua capacidade operacional em marcas?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-normal max-w-xl mx-auto">
            Crie sua conta de parceiro hoje mesmo, acesse a dashboard operacional e conte com assessoria jurídica especializada em cada etapa do processo no INPI.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "h-11 sm:h-12 px-8 text-sm font-semibold bg-primary text-primary-foreground rounded-xl gap-2")}
            >
              <span>Criar Conta de Parceiro</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER DE ALTO PADRÃO (Dark Occult Luxury & Legal Compliance) ── */}
      <footer className="relative z-10 w-full border-t border-border/70 bg-card/40 backdrop-blur-xl">
        {/* Bloco Superior do Rodapé */}
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Coluna 1: Branding & Identificação do Escritório */}
            <div className="md:col-span-5 space-y-4">
              <Link href="/" className="inline-block transition-transform hover:opacity-95">
                <SmartDocBrand size="lg" />
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                Assessoria e suporte técnico-jurídico especializado em Propriedade Industrial perante o INPI. Inteligência processual e infraestrutura de acompanhamento para escritórios e empresas parceiras.
              </p>
              
              <div className="pt-2 flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Scale className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Felipe Dutra Gonçalves</div>
                  <div className="text-[11px] font-mono text-primary font-medium">OAB/SP nº 459.254</div>
                </div>
              </div>
            </div>

            {/* Coluna 2: Navegação & Plataforma */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Plataforma B2B
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a href="#como-funciona" className="hover:text-primary transition-colors">
                    Modelo de Parceria
                  </a>
                </li>
                <li>
                  <a href="#dashboard" className="hover:text-primary transition-colors">
                    Dashboard Operacional
                  </a>
                </li>
                <li>
                  <a href="#servicos" className="hover:text-primary transition-colors">
                    Defesas & Peças Técnicas
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary transition-colors">
                    Dúvidas Frequentes
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Acesso & Legal */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Área do Parceiro & Segurança
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Acesse o painel para cadastrar protocolos, acompanhar despachos da RPI e solicitar suporte técnico em processos.
              </p>
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs font-semibold h-8 border-border/80 bg-background/50 hover:bg-muted/80 w-full sm:w-auto")}
                >
                  Entrar no Painel
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "sm" }), "text-xs font-bold bg-primary text-primary-foreground h-8 w-full sm:w-auto")}
                >
                  Nova Parceria
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Barra Inferior (Copyright & Termos) */}
        <div className="w-full border-t border-border/60 bg-background/60 py-6">
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span>© {new Date().getFullYear()} DG Advocacia.</span>
              <span className="hidden sm:inline text-border select-none">&bull;</span>
              <span className="text-[11px]">Todos os direitos reservados.</span>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <Link href="/termos-de-uso" className="hover:text-foreground transition-colors">
                Termos de Parceria
              </Link>
              <Link href="/politica-de-privacidade" className="hover:text-foreground transition-colors">
                Privacidade & Sigilo
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── CHAT FLUTUANTE IA NO MODO VENDAS & CONSULTORIA (DRA. SOFIA) ── */}
      <FloatingAiChat mode="sales" />
    </main>
  );
}
