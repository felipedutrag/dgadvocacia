"use client";

import React, { useState } from "react";
import {
  Search,
  FileText,
  Sparkles,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Layers,
  Image as ImageIcon,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Loader2,
  Calendar,
  User,
  Building,
  CheckCircle2,
  Plus,
  RefreshCw,
  X,
  AlertTriangle,
  Award,
  Zap,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { LegalReportModal } from "@/components/dashboard/legal-report-modal";

interface ProcessoSummary {
  numero: string;
  codPedido?: string;
  prioridade?: string;
  tipoMarca?: string;
  marca: string;
  situacao: string;
  titular: string;
  classeBruta?: string;
  classeInter?: string | null;
  nclVersao?: string | null;
}

interface ProcessoDetail {
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
  despachos?: Array<{
    rpi: string;
    dataRpi: string;
    codigoDespacho: string;
    descricaoDespacho?: string;
    complemento?: string;
  }>;
}

interface AiViabilityReport {
  score: number;
  nivelRisco: "BAIXO" | "MÉDIO" | "ALTO";
  titulo: string;
  resumo: string;
  motivosColidencia: string[];
  recomendacoes: string[];
  parecerJuridico: string;
  conflitosCriticos?: Array<{
    numero: string;
    marca: string;
    situacao: string;
    titular: string;
    risco: string;
  }>;
}

interface ConsultasClientProps {
  initialQuery?: string;
  initialProcesso?: string;
  initialClasse?: string;
  initialSubTab?: "marca" | "processo" | "figura" | "meus_pedidos";
  onSubTabChange?: (tab: "marca" | "processo" | "figura" | "meus_pedidos") => void;
}

export function ConsultasClient({
  initialQuery,
  initialProcesso,
  initialClasse,
  initialSubTab = "marca",
  onSubTabChange,
}: ConsultasClientProps) {
  const supabase = createClient();
  const [activeSubTab, setActiveSubTab] = useState<"marca" | "processo" | "figura" | "meus_pedidos">(
    initialSubTab || (initialProcesso ? "processo" : "marca")
  );
  const [resultsActiveType, setResultsActiveType] = useState<"marca" | "processo" | "figura" | "meus_pedidos" | null>(null);

  React.useEffect(() => {
    if (initialSubTab && initialSubTab !== activeSubTab) {
      setActiveSubTab(initialSubTab);
      setResultsList([]);
      setSelectedProcesso(null);
      setErrorMsg(null);
      setSuccessMsg(null);
      setAiReport(null);
    }
  }, [initialSubTab]);

  React.useEffect(() => {
    if (initialProcesso) {
      setNumeroProcesso(initialProcesso);
      setActiveSubTab("processo");
    }
  }, [initialProcesso]);

  React.useEffect(() => {
    if (initialQuery) {
      setNomeMarca(initialQuery);
      setActiveSubTab("marca");
    }
    if (initialClasse) {
      setClasseNice(initialClasse);
    }
  }, [initialQuery, initialClasse]);

  const switchTab = (tab: "marca" | "processo" | "figura" | "meus_pedidos") => {
    setActiveSubTab(tab);
    setResultsList([]);
    setSelectedProcesso(null);
    setErrorMsg(null);
    setAiReport(null);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  // Form States
  const [nomeMarca, setNomeMarca] = useState(initialQuery || "");
  const [classeNice, setClasseNice] = useState(initialClasse || "");
  const [buscaExata, setBuscaExata] = useState(false);

  const [numeroProcesso, setNumeroProcesso] = useState(initialProcesso || "");

  const [vienaCodigo, setVienaCodigo] = useState("");
  const [vienaClasse, setVienaClasse] = useState("");

  // UI / Status States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resultsList, setResultsList] = useState<ProcessoSummary[]>([]);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState<string | null>(null);

  // AI Diagnostic State & Modal PDF
  const [aiReport, setAiReport] = useState<AiViabilityReport | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Histórico de Pesquisas Salvas
  const [savedSearches, setSavedSearches] = useState<Array<{
    id: string;
    termo: string;
    classe?: string;
    tipo: "marca" | "processo" | "figura";
    totalResultados: number;
    dataHora: string;
  }>>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("dg_saved_searches_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedSearches(parsed);
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar histórico de buscas:", e);
    }
  }, []);

  const addSearchToHistory = (item: {
    termo: string;
    classe?: string;
    tipo: "marca" | "processo" | "figura";
    totalResultados: number;
  }) => {
    const newItem = {
      ...item,
      id: "search_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      dataHora: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setSavedSearches((prev) => {
      const updated = [newItem, ...prev.filter((s) => s.termo !== item.termo || s.tipo !== item.tipo)].slice(0, 20);
      try {
        localStorage.setItem("dg_saved_searches_v1", JSON.stringify(updated));
      } catch (e) {
        console.warn("Erro ao salvar histórico:", e);
      }
      return updated;
    });
  };

  const removeSearchHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedSearches((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem("dg_saved_searches_v1", JSON.stringify(updated));
      } catch (e) {
        console.warn("Erro ao salvar histórico:", e);
      }
      return updated;
    });
  };

  // 1. Busca por Nome
  const handleSearchMarca = async (e: React.FormEvent, overrideName?: string, overrideClass?: string) => {
    if (e) e.preventDefault();
    const targetName = overrideName || nomeMarca;
    const targetClass = overrideClass !== undefined ? overrideClass : classeNice;
    if (!targetName.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResultsList([]);
    setSelectedProcesso(null);
    setAiReport(null);

    try {
      const params = new URLSearchParams({
        marca: targetName.trim(),
        exata: buscaExata ? "sim" : "nao",
      });
      if (targetClass.trim()) params.append("classe", targetClass.trim());

      const res = await fetch(`/api/inpi/check-trademark?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao consultar o INPI");
      }

      const procs = data.processos || [];
      setResultsList(procs);
      setResultsActiveType("marca");

      // Salva no histórico de pesquisas
      addSearchToHistory({
        termo: targetName.trim(),
        classe: targetClass.trim(),
        tipo: "marca",
        totalResultados: procs.length,
      });

      // Dispara automaticamente a análise de viabilidade por IA
      triggerAiAnalysis(targetName.trim(), targetClass.trim(), procs);

      if (procs.length === 0) {
        setSuccessMsg(`Nenhuma anterioridade idêntica encontrada para "${targetName.trim()}". Caminho livre!`);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Disparar análise de IA
  const triggerAiAnalysis = async (marcaStr: string, classeStr: string, procs: ProcessoSummary[]) => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/inpi/ai-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marca: marcaStr,
          classe: classeStr,
          processos: procs,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          setAiReport(data.analysis);
        }
      }
    } catch (err) {
      console.warn("Erro ao gerar score com IA:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  // 2. Busca por Número / Raio-X Detalhado
  const handleSearchProcesso = async (e: React.FormEvent, numOverride?: string) => {
    if (e) e.preventDefault();
    const targetNum = numOverride || numeroProcesso;
    if (!targetNum.trim()) return;

    setLoadingDetail(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/inpi/processo?numero=${targetNum.trim()}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Processo não encontrado no INPI");
      }

      setSelectedProcesso(data);
      setResultsActiveType("processo");

      addSearchToHistory({
        termo: targetNum.trim(),
        tipo: "processo",
        totalResultados: 1,
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  // 3. Busca por Figura (Viena / CFE)
  const handleSearchFigura = async (e: React.FormEvent, overrideViena?: string, overrideClasse?: string) => {
    if (e) e.preventDefault();
    const targetViena = overrideViena || vienaCodigo;
    const targetClasse = overrideClasse !== undefined ? overrideClasse : vienaClasse;
    if (!targetViena.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResultsList([]);
    setSelectedProcesso(null);
    setAiReport(null);

    try {
      const params = new URLSearchParams({
        viena: targetViena.trim(),
      });
      if (targetClasse.trim()) params.append("classe", targetClasse.trim());

      const res = await fetch(`/api/inpi/figura?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao consultar figura no INPI");
      }

      const procs = data.processos || [];
      setResultsList(procs);
      setResultsActiveType("figura");

      addSearchToHistory({
        termo: targetViena.trim(),
        classe: targetClasse.trim(),
        tipo: "figura",
        totalResultados: procs.length,
      });

      if (procs.length === 0) {
        setErrorMsg("Nenhuma marca encontrada com este Código de Viena.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Meus Pedidos INPI
  const handleFetchMeusPedidos = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResultsList([]);
    setSelectedProcesso(null);
    setAiReport(null);

    try {
      const res = await fetch("/api/inpi/meus-pedidos");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao sincronizar Meus Pedidos do INPI");
      }

      setResultsList(data.processos || []);
      setResultsActiveType("meus_pedidos");
      if ((data.processos || []).length === 0) {
        setErrorMsg("Você ainda não possui processos marcados na lista 'Meus Pedidos' da sua conta oficial do INPI.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar ao Radar (Monitoramento Supabase)
  const handleTrackProcess = async (processo: { numero: string; marca: string; titular?: string; situacao?: string; classe?: string }) => {
    setTrackingLoading(processo.numero);
    setSuccessMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("marcas").upsert({
        user_id: user.id,
        numero_inpi: processo.numero,
        nome_marca: processo.marca || "Marca INPI",
        titular: processo.titular || "",
        classe_nice: processo.classe || "",
        status_ipas: processo.situacao || "Em Acompanhamento",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id, numero_inpi" });

      if (error) throw error;

      setSuccessMsg(`Processo ${processo.numero} (${processo.marca}) adicionado ao Radar INPI com sucesso!`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setTrackingLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("concessão") || s.includes("vigor") || s.includes("deferimento") || s.includes("registrada")) {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    }
    if (s.includes("extinto") || s.includes("indeferimento") || s.includes("arquivamento")) {
      return "bg-destructive/10 text-destructive border-destructive/30";
    }
    if (s.includes("exame") || s.includes("aguardando") || s.includes("publicação") || s.includes("oposição")) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    }
    return "bg-muted text-muted-foreground border-border/60";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 50) return "text-amber-500 border-amber-500/40 bg-amber-500/10";
    return "text-destructive border-destructive/40 bg-destructive/10";
  };

  return (
    <div className="space-y-6">
      {/* ── Feedback Alerts ── */}
      {errorMsg && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={() => setErrorMsg(null)} className="size-5 text-destructive hover:bg-destructive/20 rounded">
            <X className="size-3" />
          </Button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={() => setSuccessMsg(null)} className="size-5 text-emerald-600 hover:bg-emerald-500/20 rounded">
            <X className="size-3" />
          </Button>
        </div>
      )}

      {/* ── Histórico de Pesquisas Salvas da Modalidade Ativa ── */}
      {savedSearches.filter(s => s.tipo === (activeSubTab === "processo" ? "processo" : activeSubTab === "figura" ? "figura" : "marca")).length > 0 && (
        <div className="p-3 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-primary" />
              <span className="text-xs font-bold text-foreground">
                Pesquisas Recentes ({savedSearches.filter(s => s.tipo === (activeSubTab === "processo" ? "processo" : activeSubTab === "figura" ? "figura" : "marca")).length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSavedSearches(prev => prev.filter(s => s.tipo !== (activeSubTab === "processo" ? "processo" : activeSubTab === "figura" ? "figura" : "marca")));
                try {
                  const remaining = savedSearches.filter(s => s.tipo !== (activeSubTab === "processo" ? "processo" : activeSubTab === "figura" ? "figura" : "marca"));
                  localStorage.setItem("dg_saved_searches_v1", JSON.stringify(remaining));
                } catch {}
              }}
              className="text-[10px] text-muted-foreground hover:text-destructive font-mono transition-colors"
            >
              Limpar
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {savedSearches
              .filter(s => s.tipo === (activeSubTab === "processo" ? "processo" : activeSubTab === "figura" ? "figura" : "marca"))
              .map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    if (s.tipo === "processo") {
                      setNumeroProcesso(s.termo);
                      setActiveSubTab("processo");
                      handleSearchProcesso(null as any, s.termo);
                    } else if (s.tipo === "figura") {
                      setVienaCodigo(s.termo);
                      if (s.classe) setVienaClasse(s.classe);
                      setActiveSubTab("figura");
                      handleSearchFigura(null as any, s.termo, s.classe);
                    } else {
                      setNomeMarca(s.termo);
                      if (s.classe) setClasseNice(s.classe);
                      setActiveSubTab("marca");
                      handleSearchMarca(null as any, s.termo, s.classe);
                    }
                  }}
                  className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border/70 bg-muted/30 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all text-xs cursor-pointer shadow-xs"
                >
                  <span className="font-bold text-foreground group-hover:text-primary">
                    {s.termo}
                  </span>
                  {s.classe && (
                    <span className="text-[10px] font-mono text-muted-foreground bg-background/80 px-1 py-0.2 rounded border border-border/50">
                      NCL {s.classe}
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-muted-foreground">
                    {s.dataHora}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => removeSearchHistoryItem(s.id, e)}
                    className="size-4 inline-flex items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                    title="Remover do histórico"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── TAB 1: BUSCA POR NOME / CLASSE ── */}
      {activeSubTab === "marca" && (
        <Card className="border-border/70 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Search className="size-4 text-primary" />
                  Pesquisa de Marca por Denominação & Classe Nice
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Consulte anterioridades e receba um Score de Viabilidade instantâneo emitido pelo MarcaShield AI.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFetchMeusPedidos}
                disabled={loading}
                className="text-xs font-semibold h-8 gap-1.5 border-border/70 bg-card/60 hover:bg-card shrink-0 self-start sm:self-auto"
              >
                <Bookmark className="size-3.5 text-primary" />
                <span>Sincronizar Meus Pedidos INPI</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSearchMarca} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Nome da marca (ex: NEXUS, DG SHIELD...)"
                  value={nomeMarca}
                  onChange={(e) => setNomeMarca(e.target.value)}
                  className="text-xs h-9 bg-card/80"
                />
              </div>
              <div className="w-full sm:w-36">
                <Input
                  placeholder="Classe NCL (ex: 45)"
                  value={classeNice}
                  onChange={(e) => setClasseNice(e.target.value)}
                  className="text-xs h-9 bg-card/80 font-mono"
                />
              </div>
              <div className="flex items-center gap-2 px-1">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={buscaExata}
                    onChange={(e) => setBuscaExata(e.target.checked)}
                    className="rounded border-border size-3.5 text-primary"
                  />
                  <span>Busca Exata</span>
                </label>
              </div>
              <Button type="submit" disabled={loading || !nomeMarca.trim()} className="text-xs font-bold h-9 px-5 gap-2">
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
                <span>{loading ? "Consultando..." : "Consultar INPI"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 2: BUSCA POR NÚMERO DO PROCESSO (RAIO-X) ── */}
      {activeSubTab === "processo" && (
        <Card className="border-border/70 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Raio-X de Processo por Número
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Informe os 9 dígitos do processo para extrair o histórico completo de despachos da RPI, titular e logotipo.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFetchMeusPedidos}
                disabled={loadingDetail}
                className="text-xs font-semibold h-8 gap-1.5 border-border/70 bg-card/60 hover:bg-card shrink-0 self-start sm:self-auto"
              >
                <Bookmark className="size-3.5 text-primary" />
                <span>Sincronizar Meus Pedidos INPI</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSearchProcesso} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Ex: 934821902 ou 790330172"
                  value={numeroProcesso}
                  onChange={(e) => setNumeroProcesso(e.target.value)}
                  className="text-xs h-9 bg-card/80 font-mono"
                />
              </div>
              <Button type="submit" disabled={loadingDetail || !numeroProcesso.trim()} className="text-xs font-bold h-9 px-5 gap-2">
                {loadingDetail ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
                <span>{loadingDetail ? "Carregando Raio-X..." : "Ver Detalhes do Processo"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 3: BUSCA POR CÓDIGO DE FIGURA (VIENA - CFE) ── */}
      {activeSubTab === "figura" && (
        <Card className="border-border/70 bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  Busca por Elementos Figurativos (Classificação de Viena - CFE)
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Pesquise logotipos e marcas figurativas pelo código CFE (ex: 26.01.01 para Círculos, 01.01.01 para Estrelas).
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFetchMeusPedidos}
                disabled={loading}
                className="text-xs font-semibold h-8 gap-1.5 border-border/70 bg-card/60 hover:bg-card shrink-0 self-start sm:self-auto"
              >
                <Bookmark className="size-3.5 text-primary" />
                <span>Sincronizar Meus Pedidos INPI</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSearchFigura} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Código de Viena (ex: 26.01.01 ou 25.05.01)"
                  value={vienaCodigo}
                  onChange={(e) => setVienaCodigo(e.target.value)}
                  className="text-xs h-9 bg-card/80 font-mono"
                />
              </div>
              <div className="w-full sm:w-36">
                <Input
                  placeholder="Classe Nice (opcional)"
                  value={vienaClasse}
                  onChange={(e) => setVienaClasse(e.target.value)}
                  className="text-xs h-9 bg-card/80 font-mono"
                />
              </div>
              <Button type="submit" disabled={loading || !vienaCodigo.trim()} className="text-xs font-bold h-9 px-5 gap-2">
                {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
                <span>{loading ? "Buscando Figuras..." : "Pesquisar Figuras"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── AI VIABILITY & RISK SCORE CARD (Apenas na pesquisa de Marca) ── */}
      {activeSubTab === "marca" && loadingAi && (
        <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-center gap-3 text-xs text-primary font-semibold animate-pulse">
          <Sparkles className="size-4 animate-spin" />
          <span>MarcaShield AI está calculando o Score de Viabilidade e cruzando a LPI...</span>
        </div>
      )}

      {activeSubTab === "marca" && aiReport && !loadingAi && (
        <div className="rounded-2xl border-2 border-primary/40 bg-card/90 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden animate-slide-up space-y-6">
          <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
            <Shield className="size-64 text-primary" />
          </div>

          {/* Top Bar with Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary mb-2">
                <Sparkles className="size-3.5" />
                Diagnóstico de Viabilidade MarcaShield AI
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {aiReport.titulo}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Marca avaliada: <strong className="text-foreground">{nomeMarca.toUpperCase()}</strong> {classeNice ? `(Classe NCL ${classeNice})` : ""}
              </p>
            </div>

            {/* Score Circle / Badge */}
            <div className="flex items-center gap-3">
              <div className={`flex flex-col items-center justify-center size-20 sm:size-24 rounded-2xl border-2 ${getScoreColor(aiReport.score)} shadow-lg`}>
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tighter">
                  {aiReport.score}
                </span>
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest opacity-80">
                  / 100 PTS
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-muted-foreground">Nível de Risco:</div>
                <Badge className={`text-xs font-extrabold px-2.5 py-0.5 ${getScoreColor(aiReport.score)}`}>
                  RISCO {aiReport.nivelRisco}
                </Badge>
              </div>
            </div>
          </div>

          {/* Resumo e Parecer Jurídico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-2">
              <div className="font-bold text-foreground flex items-center gap-2">
                <FileText className="size-3.5 text-primary" />
                Resumo Analítico dos Fatos
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {aiReport.resumo}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-2">
              <div className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-primary" />
                Parecer Jurídico Fundamentado (Art. 124 da LPI)
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {aiReport.parecerJuridico}
              </p>
            </div>
          </div>

          {/* Motivos e Recomendações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-2">
              <div className="font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-amber-500" />
                Pontos Críticos & Colidências
              </div>
              <ul className="space-y-1.5 text-muted-foreground">
                {aiReport.motivosColidencia.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card/60 space-y-2">
              <div className="font-bold text-foreground flex items-center gap-2">
                <Zap className="size-3.5 text-emerald-500" />
                Recomendações Estratégicas da IA
              </div>
              <ul className="space-y-1.5 text-muted-foreground">
                {aiReport.recomendacoes.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Botão de Exportação de Parecer em PDF */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground font-mono">
              Validação técnica com base nas diretrizes de exame de marcas do INPI
            </span>
            <Button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="w-full sm:w-auto text-xs font-bold gap-2 bg-primary text-primary-foreground h-9 px-4"
            >
              <FileText className="size-3.5" />
              <span>Exportar Parecer Técnico em PDF</span>
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Relatório Jurídico em PDF */}
      <LegalReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        marca={nomeMarca}
        classe={classeNice}
        report={aiReport}
      />

      {/* ── MODAL / DETALHE DO PROCESSO SELECIONADO (RAIO-X) ── */}
      {activeSubTab === "processo" && selectedProcesso && (
        <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-xl space-y-6 relative animate-slide-up">
          <div className="flex items-start justify-between border-b border-border/60 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-extrabold bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-md">
                  Processo nº {selectedProcesso.numeroProcesso}
                </span>
                <span className={`inline-flex items-center font-mono text-[10px] px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedProcesso.situacao)}`}>
                  {selectedProcesso.situacao}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                {selectedProcesso.marca}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTrackProcess({
                  numero: selectedProcesso.numeroProcesso,
                  marca: selectedProcesso.marca,
                  titular: selectedProcesso.titular,
                  situacao: selectedProcesso.situacao,
                  classe: selectedProcesso.classes?.[0]?.classe
                })}
                disabled={trackingLoading === selectedProcesso.numeroProcesso}
                className="text-xs font-bold h-8 gap-1.5 bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {trackingLoading === selectedProcesso.numeroProcesso ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Plus className="size-3.5" />
                )}
                <span>Rastrear no Radar</span>
              </Button>

              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setSelectedProcesso(null)}
                className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* ── LINHA DO TEMPO VISUAL DO TRÂMITE NO INPI ── */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-muted-foreground">
                Linha do Tempo Oficial &bull; Trâmite Administrativo INPI
              </span>
              <span className="text-[10px] font-mono text-primary font-bold">
                {selectedProcesso.dataDeposito ? `Depositado em ${selectedProcesso.dataDeposito}` : "Em Processamento"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
              {/* Etapa 1 */}
              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                <div className="size-5 rounded-full bg-emerald-500 text-black text-[10px] font-bold mx-auto flex items-center justify-center">1</div>
                <div className="text-[11px] font-bold text-foreground">Depósito</div>
                <div className="text-[9px] font-mono text-emerald-500">Concluído</div>
              </div>

              {/* Etapa 2 */}
              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                <div className="size-5 rounded-full bg-emerald-500 text-black text-[10px] font-bold mx-auto flex items-center justify-center">2</div>
                <div className="text-[11px] font-bold text-foreground">Exame Formal</div>
                <div className="text-[9px] font-mono text-emerald-500">Superado</div>
              </div>

              {/* Etapa 3 */}
              <div className={`p-2.5 rounded-xl border space-y-1 ${
                selectedProcesso.situacao.toLowerCase().includes("oposição") || selectedProcesso.situacao.toLowerCase().includes("publica")
                  ? "border-amber-500/50 bg-amber-500/15"
                  : "border-border/60 bg-background/40"
              }`}>
                <div className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold mx-auto flex items-center justify-center">3</div>
                <div className="text-[11px] font-bold text-foreground">RPI 60 Dias</div>
                <div className="text-[9px] font-mono text-amber-500">Prazo Legal</div>
              </div>

              {/* Etapa 4 */}
              <div className={`p-2.5 rounded-xl border space-y-1 ${
                selectedProcesso.situacao.toLowerCase().includes("exame") || selectedProcesso.situacao.toLowerCase().includes("deferi")
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/60 bg-background/40"
              }`}>
                <div className="size-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold mx-auto flex items-center justify-center">4</div>
                <div className="text-[11px] font-bold text-foreground">Exame Mérito</div>
                <div className="text-[9px] font-mono text-muted-foreground">Art. 124 LPI</div>
              </div>

              {/* Etapa 5 */}
              <div className={`p-2.5 rounded-xl border space-y-1 ${
                selectedProcesso.situacao.toLowerCase().includes("conced") || selectedProcesso.situacao.toLowerCase().includes("registro")
                  ? "border-emerald-500/50 bg-emerald-500/20"
                  : "border-border/60 bg-background/40"
              }`}>
                <div className="size-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold mx-auto flex items-center justify-center">5</div>
                <div className="text-[11px] font-bold text-foreground">Decenal</div>
                <div className="text-[9px] font-mono text-muted-foreground">10 Anos</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Info Column */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-border/70 bg-card/40">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground mb-1">Titular</div>
                  <div className="font-bold text-foreground">{selectedProcesso.titular || "Não informado"}</div>
                </div>

                <div className="p-3 rounded-xl border border-border/70 bg-card/40">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground mb-1">Procurador / Advogado</div>
                  <div className="font-bold text-foreground">{selectedProcesso.procurador || "Sem procurador"}</div>
                </div>

                <div className="p-3 rounded-xl border border-border/70 bg-card/40">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground mb-1">Apresentação / Natureza</div>
                  <div className="font-semibold text-foreground">
                    {selectedProcesso.apresentacao || "Nominativa"} • {selectedProcesso.natureza || "De Produto/Serviço"}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border/70 bg-card/40">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground mb-1">Prazos & Datas</div>
                  <div className="font-mono text-[11px] text-foreground">
                    Depósito: <strong>{selectedProcesso.dataDeposito || "N/A"}</strong>
                    {selectedProcesso.dataVigencia && <span> • Vigência: <strong>{selectedProcesso.dataVigencia}</strong></span>}
                  </div>
                </div>
              </div>

              {/* Classes & Especificações */}
              {selectedProcesso.classes && selectedProcesso.classes.length > 0 && (
                <div className="p-3.5 rounded-xl border border-border/70 bg-card/40 space-y-2">
                  <div className="font-mono text-[10px] uppercase text-muted-foreground font-bold">
                    Classificação de Nice (NCL) & Produtos / Serviços
                  </div>
                  {selectedProcesso.classes.map((cls, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 mr-2">
                        Classe {cls.classe} {cls.subClasse ? `(${cls.subClasse})` : ""}
                      </span>
                      <span className="text-muted-foreground leading-relaxed">{cls.especificacao}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Logo Column */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl border border-border/70 bg-muted/20 text-center">
              <div className="size-44 rounded-xl border border-border/60 bg-background flex items-center justify-center overflow-hidden p-2 shadow-inner">
                {selectedProcesso.logoUrl ? (
                  <img
                    src={selectedProcesso.logoUrl}
                    alt={selectedProcesso.marca}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImageIcon className="size-10 text-muted-foreground/40" />
                )}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground mt-2">Logotipo Oficial INPI</span>
            </div>
          </div>

          {/* Timeline de Despachos da RPI */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              Histórico de Despachos & Publicações na RPI ({selectedProcesso.despachos?.length || 0})
            </h3>

            {(!selectedProcesso.despachos || selectedProcesso.despachos.length === 0) ? (
              <p className="text-xs text-muted-foreground">Nenhum despacho publicado na RPI para este processo.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {selectedProcesso.despachos.map((desp, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20 text-xs">
                    <div className="font-mono text-[11px] font-bold bg-muted px-2 py-0.5 rounded border border-border/60 shrink-0">
                      RPI {desp.rpi}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{desp.codigoDespacho}</div>
                      {desp.complemento && <p className="text-muted-foreground mt-0.5">{desp.complemento}</p>}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground shrink-0">
                      {desp.dataRpi}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TABELA DE RESULTADOS DA BUSCA (Isolada para marca, figura ou meus pedidos) ── */}
      {activeSubTab !== "processo" && (resultsActiveType === activeSubTab || (activeSubTab === "meus_pedidos" && resultsActiveType === "meus_pedidos")) && resultsList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Resultados Encontrados no INPI</span>
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                {resultsList.length} processos
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resultsList.map((proc, index) => (
              <div
                key={index}
                className="flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                        {proc.numero}
                      </span>
                      {proc.classeInter && (
                        <span className="font-mono text-[9px] text-muted-foreground bg-card px-1.5 py-0.5 rounded border border-border/60">
                          NCL {proc.classeInter}
                        </span>
                      )}
                    </div>

                    <span className={`inline-flex items-center font-mono text-[9px] px-2 py-0.5 rounded-full border ${getStatusBadge(proc.situacao)}`}>
                      {proc.situacao}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {proc.marca}
                  </h4>

                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    Titular: <span className="font-semibold text-foreground/80">{proc.titular || "Não informado"}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50 text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNumeroProcesso(proc.numero);
                      handleSearchProcesso(null as any, proc.numero);
                    }}
                    disabled={loadingDetail}
                    className="text-xs font-semibold h-7 px-2.5 text-primary hover:text-primary hover:bg-primary/10 gap-1"
                  >
                    <span>Raio-X Completo</span>
                    <ChevronRight className="size-3.5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTrackProcess({
                      numero: proc.numero,
                      marca: proc.marca,
                      titular: proc.titular,
                      situacao: proc.situacao,
                      classe: proc.classeInter || undefined
                    })}
                    disabled={trackingLoading === proc.numero}
                    className="text-xs font-semibold h-7 px-2.5 border-border/70 hover:bg-primary hover:text-primary-foreground gap-1"
                  >
                    {trackingLoading === proc.numero ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Plus className="size-3" />
                    )}
                    <span>Monitorar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
