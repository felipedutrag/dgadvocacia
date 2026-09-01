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
  Eye,
  ShieldCheck,
  FileText
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
  const [activeSubTab, setActiveSubTab] = useState<"naming" | "logos">("naming");

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Seletor de Sub-Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Estúdio IA de Criação & Identidade Marcária</span>
            <span className="font-mono text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-0.5 rounded-full font-bold">
              Gemini 2.5 Intelligence
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Crie nomes com alta distintividade perante o Art. 124 da LPI, verifique conflitos na hora e gere conceitos de logomarcas com IA.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl border border-border/60 self-start sm:self-auto">
          <Button
            type="button"
            variant={activeSubTab === "naming" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSubTab("naming")}
            className="text-xs font-bold h-8 gap-1.5"
          >
            <Lightbulb className="size-3.5" />
            <span>Gerador de Nomes</span>
          </Button>
          <Button
            type="button"
            variant={activeSubTab === "logos" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSubTab("logos")}
            className="text-xs font-bold h-8 gap-1.5"
          >
            <Palette className="size-3.5" />
            <span>Criador de Logomarcas</span>
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
    </div>
  );
}
