"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  PenTool,
  Bot,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Zap,
  Palette,
  Layers,
  ArrowRight,
  Loader2,
  RefreshCw,
  Globe,
  Scale,
  ShieldAlert,
  Send,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NamingSuggestion } from "@/app/api/inpi/naming/route";

interface NamingClientProps {
  onVerifyTrademark?: (marca: string, classe?: string) => void;
}

export function NamingClient({ onVerifyTrademark }: NamingClientProps) {
  const [activeSubTab, setActiveSubTab] = useState<"naming" | "logos" | "nice" | "domains" | "cease_desist">("naming");

  // Naming Form State
  const [segmento, setSegmento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [palavrasChave, setPalavrasChave] = useState("");
  const [estilo, setEstilo] = useState("Moderno e Tecnológico");
  const [classeNice, setClasseNice] = useState("35");
  const [namingLoading, setNamingLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState<NamingSuggestion[]>([]);
  const [namingError, setNamingError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Logo Creator State
  const [logoMarca, setLogoMarca] = useState("");
  const [logoSegmento, setLogoSegmento] = useState("");
  const [logoEstilo, setLogoEstilo] = useState("Minimalista & Luxo");
  const [logoCores, setLogoCores] = useState("Dourado, Preto Obsidiana e Branco");
  const [logoSimbolo, setLogoSimbolo] = useState("Escudo geométrico abstrato");
  const [logoLoading, setLogoLoading] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<{ imageUrl: string; model: string } | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Smart Nice Classifier State
  const [niceInput, setNiceInput] = useState("");
  const [niceLoading, setNiceLoading] = useState(false);
  const [niceResult, setNiceResult] = useState<any | null>(null);
  const [niceError, setNiceError] = useState<string | null>(null);

  // Domain & Socials Check State
  const [domainInput, setDomainInput] = useState("");
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainResult, setDomainResult] = useState<any | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);

  // Cease & Desist State
  const [cdNotificante, setCdNotificante] = useState("");
  const [cdDoc, setCdDoc] = useState("");
  const [cdMarca, setCdMarca] = useState("");
  const [cdProcesso, setCdProcesso] = useState("");
  const [cdNotificado, setCdNotificado] = useState("");
  const [cdUso, setCdUso] = useState("");
  const [cdPlataforma, setCdPlataforma] = useState("Instagram / Web");
  const [cdPrazo, setCdPrazo] = useState("5");
  const [cdLoading, setCdLoading] = useState(false);
  const [cdResult, setCdResult] = useState<any | null>(null);
  const [cdError, setCdError] = useState<string | null>(null);

  // Geração de Nomes com Gemini
  const handleGenerateNames = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!segmento.trim() && !descricao.trim()) {
      setNamingError("Preencha ao menos o segmento ou a proposta de valor do negócio.");
      return;
    }

    setNamingLoading(true);
    setNamingError(null);

    try {
      const res = await fetch("/api/inpi/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segmento,
          descricao,
          palavrasChave,
          estilo,
          classe: classeNice ? `NCL ${classeNice}` : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar nomes");
      }

      setSugestoes(data.sugestoes || []);
    } catch (err: any) {
      setNamingError(err.message || "Falha na geração de nomes com IA");
    } finally {
      setNamingLoading(false);
    }
  };

  // Geração de Logomarca com Gemini / Nano Banana
  const handleGenerateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoMarca.trim()) {
      setLogoError("Informe o nome da marca para gerar a logo.");
      return;
    }

    setLogoLoading(true);
    setLogoError(null);

    try {
      const res = await fetch("/api/inpi/logo-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeMarca: logoMarca,
          segmento: logoSegmento || segmento,
          estilo: logoEstilo,
          cores: logoCores,
          simbolo: logoSimbolo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar logo");
      }

      setGeneratedLogo({ imageUrl: data.imageUrl, model: data.model });
    } catch (err: any) {
      setLogoError(err.message || "Falha na geração da logomarca.");
    } finally {
      setLogoLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Enquadramento Nice com IA
  const handleClassifyNice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niceInput.trim()) return;
    setNiceLoading(true);
    setNiceError(null);
    try {
      const res = await fetch("/api/inpi/nice-classifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atividade: niceInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao classificar");
      setNiceResult(data);
    } catch (err: any) {
      setNiceError(err.message);
    } finally {
      setNiceLoading(false);
    }
  };

  // Checagem de Domínios
  const handleCheckDomains = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setDomainLoading(true);
    setDomainError(null);
    try {
      const res = await fetch(`/api/inpi/domain-check?domain=${encodeURIComponent(domainInput.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao checar domínios");
      setDomainResult(data);
    } catch (err: any) {
      setDomainError(err.message);
    } finally {
      setDomainLoading(false);
    }
  };

  // Notificação Extrajudicial
  const handleGenerateCeaseDesist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cdMarca.trim() || !cdNotificado.trim()) return;
    setCdLoading(true);
    setCdError(null);
    try {
      const res = await fetch("/api/inpi/cease-desist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificanteNome: cdNotificante,
          notificanteDocumento: cdDoc,
          marcaRegistrada: cdMarca,
          processoInpi: cdProcesso,
          notificadoNome: cdNotificado,
          notificadoUsoIndevido: cdUso,
          plataformaInfracao: cdPlataforma,
          prazoDias: cdPrazo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao redigir notificação");
      setCdResult(data);
    } catch (err: any) {
      setCdError(err.message);
    } finally {
      setCdLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Seletor de Sub-Abas */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Central IA de Naming, Proteção & Ativos Marcários</span>
            <span className="font-mono text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-0.5 rounded-full font-bold">
              Suíte Jurídica & IA
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Crie marcas com distintividade, enquadre classes Nice, gere logomarcas, verifique domínios e redija notificações extrajudiciais.
          </p>
        </div>

        {/* 5 Ferramentas B2B */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted rounded-xl border border-border/60">
          <Button
            type="button"
            variant={activeSubTab === "naming" ? "default" : "ghost"}
            size="xs"
            onClick={() => setActiveSubTab("naming")}
            className="text-xs font-bold h-8 gap-1.5"
          >
            <Lightbulb className="size-3.5" />
            <span>Naming</span>
          </Button>

          <Button
            type="button"
            variant={activeSubTab === "logos" ? "default" : "ghost"}
            size="xs"
            onClick={() => setActiveSubTab("logos")}
            className="text-xs font-bold h-8 gap-1.5"
          >
            <Palette className="size-3.5" />
            <span>Logomarcas</span>
          </Button>

          <Button
            type="button"
            variant={activeSubTab === "nice" ? "default" : "ghost"}
            size="xs"
            onClick={() => setActiveSubTab("nice")}
            className="text-xs font-bold h-8 gap-1.5"
          >
            <Layers className="size-3.5" />
            <span>Enquadrador Nice</span>
          </Button>

          <Button
            type="button"
            variant={activeSubTab === "domains" ? "default" : "ghost"}
            size="xs"
            onClick={() => setActiveSubTab("domains")}
            className="text-xs font-bold h-8 gap-1.5"
          >
            <Globe className="size-3.5" />
            <span>Domínios & @</span>
          </Button>

          <Button
            type="button"
            variant={activeSubTab === "cease_desist" ? "default" : "ghost"}
            size="xs"
            onClick={() => setActiveSubTab("cease_desist")}
            className="text-xs font-bold h-8 gap-1.5"
          >
            <ShieldAlert className="size-3.5" />
            <span>Notificação Extrajudicial</span>
          </Button>
        </div>
      </div>

      {/* ── SUB-ABA 1: NAMING & CRIAÇÃO DE MARCAS ── */}
      {activeSubTab === "naming" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Formulário de Briefing */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Bot className="size-4 text-primary" />
                  <span>Briefing do Projeto de Naming</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  A IA focará em nomes com distintividade legal (LPI).
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <form onSubmit={handleGenerateNames} className="space-y-3.5">
                  {namingError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span>{namingError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs">Segmento / Nicho de Mercado *</Label>
                    <Input
                      placeholder="Ex: SaaS Jurídico, Cafeteria Artesanal, FinTech..."
                      value={segmento}
                      onChange={(e) => setSegmento(e.target.value)}
                      className="text-xs h-9 bg-card/80"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Proposta de Valor / Descrição</Label>
                    <textarea
                      placeholder="Ex: Plataforma para automação de processos, rápida, elegante e segura..."
                      value={descricao}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescricao(e.target.value)}
                      className="w-full rounded-md border border-input bg-card/80 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Palavras-Chave</Label>
                      <Input
                        placeholder="Ex: escudo, fluxo, luz"
                        value={palavrasChave}
                        onChange={(e) => setPalavrasChave(e.target.value)}
                        className="text-xs h-9 bg-card/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Classe Nice (NCL)</Label>
                      <Input
                        placeholder="Ex: 35, 42, 09..."
                        value={classeNice}
                        onChange={(e) => setClasseNice(e.target.value)}
                        className="text-xs h-9 bg-card/80 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Estilo da Marca</Label>
                    <select
                      value={estilo}
                      onChange={(e) => setEstilo(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-card/80 px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Moderno e Tecnológico">Moderno e Tecnológico (Fantasioso)</option>
                      <option value="Luxo e Sofisticação">Luxo, Minimalista & Premium</option>
                      <option value="Curto e Impactante">Curto (4 a 6 letras / Monossílabo)</option>
                      <option value="Evocativo e Conceitual">Evocativo & Conceitual</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={namingLoading}
                    className="w-full text-xs font-bold h-10 gap-2 mt-2 bg-primary text-primary-foreground"
                  >
                    {namingLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Criando Nomes Estratégicos...</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="size-4" />
                        <span>Gerar 6 Sugestões de Nomes com IA</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resultados de Nomes */}
          <div className="lg:col-span-7 space-y-4">
            {sugestoes.length === 0 ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Bot className="size-10 mx-auto text-primary/60" />
                <h3 className="text-sm font-bold text-foreground">Aguardando Briefing de Naming</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Preencha o nicho ao lado e a IA criará nomes exclusivos com alta distintividade perante o INPI.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                    Sugestões Geradas ({sugestoes.length})
                  </span>
                  <span className="text-[11px] text-emerald-500 font-mono font-bold">
                    Pronto para Verificação no INPI
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {sugestoes.map((sug, idx) => (
                    <div
                      key={idx}
                      className="group p-4 rounded-2xl border border-border/70 bg-card/70 hover:border-primary/50 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                              {sug.nome}
                            </h4>
                            <span className="font-mono text-[9px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                              {sug.estilo}
                            </span>
                            <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                              Score LPI: {sug.distintividadeScore}%
                            </span>
                          </div>
                          {sug.slogan && (
                            <p className="text-xs text-primary/80 font-medium italic">
                              "{sug.slogan}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => copyToClipboard(sug.nome, idx)}
                            className="size-8 rounded-lg"
                            title="Copiar Nome"
                          >
                            {copiedIndex === idx ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {sug.racional}
                      </p>

                      {sug.pontosFortes?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {sug.pontosFortes.map((pt, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[10px] bg-muted/80 text-foreground/80 px-2 py-0.5 rounded-md border border-border/40 font-mono"
                            >
                              &bull; {pt}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Botões de Ação Imediata */}
                      <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {sug.classeSugerida || "Classe Nice Sugerida"}
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="xs"
                            onClick={() => {
                              setLogoMarca(sug.nome);
                              setActiveSubTab("logos");
                            }}
                            variant="outline"
                            className="text-[11px] h-7 gap-1 font-bold"
                          >
                            <Palette className="size-3 text-amber-500" />
                            <span>Gerar Logo</span>
                          </Button>

                          <Button
                            type="button"
                            size="xs"
                            onClick={() => {
                              if (onVerifyTrademark) {
                                onVerifyTrademark(sug.nome, classeNice);
                              }
                            }}
                            className="text-[11px] h-7 gap-1 font-bold bg-primary text-primary-foreground"
                          >
                            <Search className="size-3" />
                            <span>Verificar Conflitos no INPI</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── SUB-ABA 2: ESTÚDIO DE LOGOMARCAS ── */}
      {activeSubTab === "logos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Formulário de Criação da Logo */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Palette className="size-4 text-amber-500" />
                  <span>Configuração da Logomarca IA</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Geração de vetor e imagem com o modelo do Gemini.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <form onSubmit={handleGenerateLogo} className="space-y-3.5">
                  {logoError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span>{logoError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome da Marca *</Label>
                    <Input
                      placeholder="Ex: DG Advocacia, MarcaShield, NexaPay..."
                      value={logoMarca}
                      onChange={(e) => setLogoMarca(e.target.value)}
                      className="text-xs h-9 bg-card/80 font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Segmento do Negócio</Label>
                    <Input
                      placeholder="Ex: Advocacia Corporativa, FinTech, IA..."
                      value={logoSegmento}
                      onChange={(e) => setLogoSegmento(e.target.value)}
                      className="text-xs h-9 bg-card/80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Estilo Visual da Logomarca</Label>
                    <select
                      value={logoEstilo}
                      onChange={(e) => setLogoEstilo(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-card/80 px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Minimalista & Luxo">Minimalista & Luxo (Dark Luxury)</option>
                      <option value="Monograma Geométrico">Monograma Geométrico Elegante</option>
                      <option value="Emblema com Escudo">Emblema de Autoridade com Escudo</option>
                      <option value="Tipografia Futurista">Tipografia Moderna & Futurista</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Paleta de Cores</Label>
                    <Input
                      placeholder="Ex: Dourado e Preto Obsidiana, Azul Navy..."
                      value={logoCores}
                      onChange={(e) => setLogoCores(e.target.value)}
                      className="text-xs h-9 bg-card/80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Símbolo / Ícone Pretendido</Label>
                    <Input
                      placeholder="Ex: Escudo abstrato com balança, linhas dinâmicas..."
                      value={logoSimbolo}
                      onChange={(e) => setLogoSimbolo(e.target.value)}
                      className="text-xs h-9 bg-card/80"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={logoLoading}
                    className="w-full text-xs font-bold h-10 gap-2 mt-2 bg-primary text-primary-foreground"
                  >
                    {logoLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Renderizando Logomarca com IA...</span>
                      </>
                    ) : (
                      <>
                        <Palette className="size-4" />
                        <span>Gerar Logomarca Profissional</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Visualizador da Logo Gerada */}
          <div className="lg:col-span-7 space-y-4">
            {!generatedLogo ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Palette className="size-10 mx-auto text-amber-500/60" />
                <h3 className="text-sm font-bold text-foreground">Nenhuma Logomarca Gerada Ainda</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Configure o nome da marca e paleta ao lado para criar o conceito visual.
                </p>
              </div>
            ) : (
              <Card className="border-border/70 bg-card/60 backdrop-blur-md overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold">Conceito de Logomarca Gerado</CardTitle>
                    <CardDescription className="text-xs">Modelo: {generatedLogo.model}</CardDescription>
                  </div>
                  <a
                    href={generatedLogo.imageUrl}
                    download={`logo-${logoMarca.toLowerCase().replace(/\s+/g, "-")}.png`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Download className="size-3.5" />
                    <span>Baixar Logo</span>
                  </a>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-border/80 bg-zinc-950 flex items-center justify-center p-4 shadow-2xl">
                    <img
                      src={generatedLogo.imageUrl}
                      alt={`Logomarca ${logoMarca}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                      <span className="text-[10px] text-muted-foreground font-mono">Resolução</span>
                      <div className="font-bold text-foreground mt-0.5">Ultra Definição Vetorial</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                      <span className="text-[10px] text-muted-foreground font-mono">Uso no INPI</span>
                      <div className="font-bold text-emerald-500 mt-0.5">Apta para Depósito Misto</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── SUB-ABA 3: ENQUADRADOR INTELIGENTE DE CLASSES NICE ── */}
      {activeSubTab === "nice" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  <span>Enquadrador de Classes Nice com IA</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Mapeia as 45 classes de Nice e especificações pré-aprovadas pelo INPI.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleClassifyNice} className="space-y-3.5">
                  {niceError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      {niceError}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Descreva as atividades do negócio *</Label>
                    <textarea
                      placeholder="Ex: Fabricamos suplementos esportivos e vendemos no atacado e através de loja virtual própria..."
                      value={niceInput}
                      onChange={(e) => setNiceInput(e.target.value)}
                      className="w-full rounded-md border border-input bg-card/80 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[90px] resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={niceLoading}
                    className="w-full text-xs font-bold h-10 gap-2 bg-primary text-primary-foreground"
                  >
                    {niceLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Consultando Diretrizes do INPI...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="size-4" />
                        <span>Enquadrar Classes de Nice</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {!niceResult ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Layers className="size-10 mx-auto text-primary/60" />
                <h3 className="text-sm font-bold text-foreground">Aguardando Descrição das Atividades</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Descreva os produtos ou serviços ao lado para a IA indicar as classes exatas e especificações para o e-Marcas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Classe Principal */}
                <div className="p-5 rounded-2xl border-2 border-primary/40 bg-card/80 shadow-lg shadow-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                      Classe Principal Recomendada: NCL {niceResult.classePrincipal?.numero}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-500">Prioridade Alta</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{niceResult.classePrincipal?.titulo}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{niceResult.classePrincipal?.justificativa}</p>
                  <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">Especificação Pré-Aprovada INPI:</span>
                    <p className="text-xs text-foreground font-mono">{niceResult.classePrincipal?.especificacaoSugerida}</p>
                  </div>
                </div>

                {/* Classes Secundárias */}
                {niceResult.classesSecundarias?.map((sec: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-muted-foreground uppercase bg-muted px-2.5 py-0.5 rounded-full">
                        Classe Secundária Estratégica: NCL {sec.numero}
                      </span>
                      <span className="text-xs font-mono text-amber-500 font-bold">Blindagem Adicional</span>
                    </div>
                    <h5 className="text-xs font-bold text-foreground">{sec.titulo}</h5>
                    <p className="text-xs text-muted-foreground">{sec.justificativa}</p>
                    <div className="p-2.5 rounded-lg bg-background/40 border border-border/40 text-[11px] font-mono text-foreground">
                      {sec.especificacaoSugerida}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SUB-ABA 4: VERIFICADOR DE DOMÍNIOS & REDES SOCIAIS ── */}
      {activeSubTab === "domains" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  <span>Checador de Domínios & @ Social</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Consulta de disponibilidade no Registro.br, .com e redes sociais.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleCheckDomains} className="space-y-3.5">
                  {domainError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      {domainError}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome da Marca para Consulta *</Label>
                    <Input
                      placeholder="Ex: DG Advocacia, MarcaShield, NexaPay..."
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      className="text-xs h-9 bg-card/80 font-mono"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={domainLoading}
                    className="w-full text-xs font-bold h-10 gap-2 bg-primary text-primary-foreground"
                  >
                    {domainLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Consultando Registro.br e DNS...</span>
                      </>
                    ) : (
                      <>
                        <Search className="size-4" />
                        <span>Verificar Domínios e Redes</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {!domainResult ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Globe className="size-10 mx-auto text-primary/60" />
                <h3 className="text-sm font-bold text-foreground">Aguardando Nome de Domínio</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Consulte se a marca possui o domínio nacional (.com.br), internacional (.com) e perfis livres.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Domínios Web */}
                <div className="p-5 rounded-2xl border border-border/70 bg-card/70 space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-muted-foreground">
                    Status de Domínios Oficiais
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {domainResult.domains?.map((dom: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="size-4 text-primary" />
                          <span className="font-mono font-bold text-xs text-foreground">{dom.fqdn}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[11px] font-bold ${dom.available ? "text-emerald-500" : "text-amber-500"}`}>
                            {dom.available ? "Disponível para Registro" : "Registrado / Em Uso"}
                          </span>
                          <a
                            href={dom.registrationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20 transition-colors"
                          >
                            Registrar
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="p-5 rounded-2xl border border-border/70 bg-card/70 space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-muted-foreground">
                    Handles de Redes Sociais
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {domainResult.socials?.map((soc: any, idx: number) => (
                      <a
                        key={idx}
                        href={soc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors block text-center space-y-1"
                      >
                        <div className="text-[10px] font-mono text-muted-foreground">{soc.network}</div>
                        <div className="text-xs font-mono font-bold text-primary truncate">{soc.handle}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SUB-ABA 5: GERADOR DE NOTIFICAÇÃO EXTRAJUDICIAL COM IA ── */}
      {activeSubTab === "cease_desist" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="size-4 text-rose-500" />
                  <span>Notificação Extrajudicial por Uso Indevido</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Peça técnica com base nos Arts. 129, 189 e 209 da Lei nº 9.279/96 (LPI).
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleGenerateCeaseDesist} className="space-y-3">
                  {cdError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      {cdError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Sua Empresa (Notificante) *</Label>
                      <Input
                        placeholder="Nome / Razão Social"
                        value={cdNotificante}
                        onChange={(e) => setCdNotificante(e.target.value)}
                        className="text-xs h-8 bg-card/80"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">CNPJ / CPF</Label>
                      <Input
                        placeholder="00.000.000/0001-00"
                        value={cdDoc}
                        onChange={(e) => setCdDoc(e.target.value)}
                        className="text-xs h-8 bg-card/80 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Marca Registrada *</Label>
                      <Input
                        placeholder="Nome da sua marca"
                        value={cdMarca}
                        onChange={(e) => setCdMarca(e.target.value)}
                        className="text-xs h-8 bg-card/80 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Nº Processo INPI</Label>
                      <Input
                        placeholder="Ex: 934812345"
                        value={cdProcesso}
                        onChange={(e) => setCdProcesso(e.target.value)}
                        className="text-xs h-8 bg-card/80 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Nome do Infrator (Notificado) *</Label>
                    <Input
                      placeholder="Empresa ou perfil infrator"
                      value={cdNotificado}
                      onChange={(e) => setCdNotificado(e.target.value)}
                      className="text-xs h-8 bg-card/80"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Descrição do Uso Indevido</Label>
                    <textarea
                      placeholder="Ex: Utilização do mesmo nome e logo em perfil comercial no Instagram vendendo produtos no mesmo segmento..."
                      value={cdUso}
                      onChange={(e) => setCdUso(e.target.value)}
                      className="w-full rounded-md border border-input bg-card/80 p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[50px] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={cdLoading}
                    className="w-full text-xs font-bold h-9 gap-2 bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {cdLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Redigindo Peça Jurídica...</span>
                      </>
                    ) : (
                      <>
                        <Scale className="size-4" />
                        <span>Gerar Notificação Extrajudicial</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {!cdResult ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <ShieldAlert className="size-10 mx-auto text-rose-500/60" />
                <h3 className="text-sm font-bold text-foreground">Aguardando Dados da Notificação</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Preencha os dados do infrator para gerar a notificação formal de cessação de uso indevido e concorrência desleal.
                </p>
              </div>
            ) : (
              <Card className="border-border/70 bg-card/60 backdrop-blur-md overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">{cdResult.titulo}</CardTitle>
                    <CardDescription className="text-xs">{cdResult.resumoJuridico}</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(cdResult.notificacaoTexto);
                      alert("Notificação copiada com sucesso!");
                    }}
                    className="text-xs h-8 gap-1.5 font-bold"
                  >
                    <Copy className="size-3.5" />
                    <span>Copiar Peça</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-6 max-h-[500px] overflow-y-auto font-mono text-xs text-foreground/90 whitespace-pre-line leading-relaxed bg-background/50">
                  {cdResult.notificacaoTexto}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
