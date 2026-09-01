"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  Plus,
  Trash2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  Clock,
  Bell,
  Loader2,
  RefreshCw,
  Eye,
  X,
  CheckCircle2,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface MarcaItem {
  id: string;
  numero_inpi: string;
  nome_marca: string;
  titular: string;
  classe_nice: string;
  status_ipas: string;
  data_deposito: string;
  imagem_url: string;
  updated_at: string;
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

// ── Global In-Memory & LocalStorage Cache (Zero-Loading Navigation) ──
let memoryCacheMarcas: MarcaItem[] | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos
const LOCAL_STORAGE_CACHE_KEY = "dg_carteira_marcas_cache_v1";

function getStoredCache(): MarcaItem[] | null {
  if (memoryCacheMarcas && memoryCacheMarcas.length > 0) {
    return memoryCacheMarcas;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.data)) {
          memoryCacheMarcas = parsed.data;
          lastCacheTimestamp = parsed.timestamp || Date.now();
          return parsed.data;
        }
      }
    } catch (e) {
      console.warn("Erro ao ler cache do localStorage:", e);
    }
  }
  return null;
}

function setStoredCache(data: MarcaItem[]) {
  memoryCacheMarcas = data;
  lastCacheTimestamp = Date.now();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (e) {
      console.warn("Erro ao salvar cache no localStorage:", e);
    }
  }
}

export function MarcasClient() {
  const supabase = createClient();

  const [marcas, setMarcas] = useState<MarcaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNumero, setNewNumero] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [quota, setQuota] = useState<{ total: number; used: number; remaining: number; plan: string }>({
    total: 1,
    used: 0,
    remaining: 1,
    plan: "Gratuito (1 Marca)",
  });

  // Modal de Raio-X
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchMarcas = useCallback(async (isManual = false) => {
    try {
      if (isManual) {
        setIsSyncing(true);
      }

      // 1. Tenta buscar via endpoint seguro da API
      const res = await fetch("/api/marcas");
      if (res.ok) {
        const json = await res.json();
        if (json.marcas) {
          const list = json.marcas as MarcaItem[];
          setMarcas(list);
          setStoredCache(list);
          if (json.quota) {
            setQuota(json.quota);
          }
          return;
        }
      }

      // 2. Fallback direto no Supabase Client caso a API não responda
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const [{ data, error }, { data: profile }] = await Promise.all([
        supabase
          .from("marcas")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("marcas_limit, plan, plan_status")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      if (error) {
        console.warn("Aviso ao buscar marcas no Supabase:", error);
      }

      if (data) {
        const list = data as MarcaItem[];
        setMarcas(list);
        setStoredCache(list);

        const limit = profile?.marcas_limit ?? 1;
        const used = list.length;
        const isPaid = profile?.plan && profile.plan !== "free" && !profile.plan.toLowerCase().includes("gratuito") && profile.plan_status === "active";
        setQuota({
          total: limit,
          used: used,
          remaining: Math.max(0, limit - used),
          plan: isPaid ? (profile?.plan || `Radar RPI (${limit} ${limit === 1 ? "Marca" : "Marcas"})`) : `Gratuito (${limit} ${limit === 1 ? "Marca" : "Marcas"})`,
        });
      }
    } catch (err: any) {
      console.warn("Aviso de sincronização de marcas:", err?.message || err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [supabase]);

  useEffect(() => {
    const cached = getStoredCache();
    if (cached) {
      setMarcas(cached);
      setLoading(false);
      // Se o cache tiver mais de 5 minutos, revalida silenciosamente em background
      if (Date.now() - lastCacheTimestamp > 5 * 60 * 1000) {
        fetchMarcas(false);
      }
    } else {
      fetchMarcas(false);
    }
  }, [fetchMarcas]);

  const handleAddMarca = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = newNumero.trim();
    if (!cleanNum) return;

    // Checagem de limite no frontend
    const alreadyExists = marcas.some(m => m.numero_inpi === cleanNum);
    if (!alreadyExists && marcas.length >= quota.total) {
      setErrorMsg(
        `Limite de acompanhamento atingido (${marcas.length}/${quota.total} marca ativa). Exclua o processo abaixo para liberar sua vaga gratuita ou contrate o Radar RPI para monitorar mais marcas.`
      );
      return;
    }

    setAdding(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      // 1. Tenta buscar os dados reais do processo no INPI
      let nomeMarca = "Processo INPI";
      let titular = "";
      let classeNice = "";
      let statusIpas = "Em Acompanhamento";
      let logoUrl: string | null = null;

      try {
        const inpiRes = await fetch(`/api/inpi/processo?numero=${cleanNum}`);
        if (inpiRes.ok) {
          const inpiData: ProcessoDetail = await inpiRes.json();
          if (inpiData.marca) nomeMarca = inpiData.marca;
          if (inpiData.titular) titular = inpiData.titular;
          if (inpiData.situacao) statusIpas = inpiData.situacao;
          if (inpiData.classes?.[0]?.classe) classeNice = inpiData.classes[0].classe;
          if (inpiData.logoUrl) logoUrl = inpiData.logoUrl;
        }
      } catch (inpiErr) {
        console.warn("Consulta ao INPI falhou, inserindo registro base:", inpiErr);
      }

      // 2. Chama a API protegida /api/marcas que valida cotas e permissões
      const apiRes = await fetch("/api/marcas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero_inpi: cleanNum,
          nome_marca: nomeMarca,
          titular: titular,
          classe_nice: classeNice,
          status_ipas: statusIpas,
          imagem_url: logoUrl,
        }),
      });

      const apiData = await apiRes.json();

      if (!apiRes.ok || apiData.error) {
        throw new Error(apiData.error || "Erro ao adicionar processo");
      }

      setNewNumero("");
      setSuccessMsg(`Processo ${cleanNum} (${nomeMarca}) adicionado e sincronizado com o Radar!`);
      setTimeout(() => setSuccessMsg(null), 5000);
      
      // Atualiza o cache e quotas imediatamente
      fetchMarcas(false);
    } catch (err: any) {
      if (err.message?.includes("duplicate key") || err.code === "23505") {
        setErrorMsg(`O processo nº ${cleanNum} já está cadastrado no seu Radar.`);
      } else {
        setErrorMsg(err.message || "Erro ao rastrear processo");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteMarca = async (id: string, numero: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Deseja remover o processo ${numero} do Radar de Monitoramento?`)) return;

    setDeletingId(id);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/marcas?id=${id}`, { method: "DELETE" });
      const resData = await res.json();
      if (!res.ok || resData.error) {
        throw new Error(resData.error || "Erro ao remover processo");
      }

      setMarcas(prev => {
        const filtered = prev.filter(m => m.id !== id);
        setStoredCache(filtered);
        setQuota(q => ({
          ...q,
          used: filtered.length,
          remaining: Math.max(0, q.total - filtered.length),
        }));
        return filtered;
      });
      setSuccessMsg(`Processo ${numero} removido do Radar.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg("Erro ao excluir: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenRaioX = async (numero: string) => {
    setLoadingDetail(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/inpi/processo?numero=${numero}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erro ao consultar processo no INPI");
      setSelectedProcesso(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("deferimento") || s.includes("concessão") || s.includes("vigor") || s.includes("registrada")) {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    }
    if (s.includes("oposição") || s.includes("indeferimento") || s.includes("extinto") || s.includes("arquivamento")) {
      return "bg-destructive/10 text-destructive border-destructive/30";
    }
    if (s.includes("exame") || s.includes("aguardando") || s.includes("publicação")) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    }
    return "bg-muted text-muted-foreground border-border/60";
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("deferimento") || s.includes("concessão") || s.includes("vigor")) return <ShieldCheck className="size-3.5" />;
    if (s.includes("oposição") || s.includes("indeferimento") || s.includes("extinto")) return <ShieldAlert className="size-3.5" />;
    return <Clock className="size-3.5" />;
  };

  const filteredMarcas = marcas.filter(m => 
    m.numero_inpi.includes(searchQuery) || 
    m.nome_marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.titular && m.titular.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isAtLimit = marcas.length >= quota.total;

  return (
    <div className="space-y-6">
      {/* Feedback Alerts */}
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

      {/* Card de Cadastro do Protocolo do Pedido com Indicador de Em Uso */}
      <Card className="bg-card/60 backdrop-blur-md border-border/70">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Plus className="size-4 text-primary" />
              <span>Acompanhar Processo no Radar RPI</span>
            </CardTitle>

            <div className="inline-flex items-center gap-1.5 text-xs font-mono bg-muted/60 border border-border/70 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              <span className="text-muted-foreground">Em uso:</span>
              <span className={`font-bold ${isAtLimit ? "text-amber-500" : "text-emerald-500"}`}>
                {marcas.length}
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="font-bold text-foreground">{quota.total}</span>
              <span className="text-muted-foreground">{quota.total === 1 ? "marca" : "marcas"}</span>
            </div>
          </div>
          <CardDescription className="text-xs">
            Insira o número do processo para monitoramento contínuo na RPI e controle automático de prazos e despachos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleAddMarca} className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Ex: 934821902 ou 790330172"
              value={newNumero}
              onChange={(e) => setNewNumero(e.target.value)}
              className="max-w-xs text-xs font-mono h-9 bg-card/80"
            />
            <Button
              type="submit"
              disabled={adding || !newNumero.trim()}
              className="text-xs font-bold h-9 px-5 gap-1.5"
            >
              {adding ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              <span>{adding ? "Sincronizando Processo..." : "Cadastrar Protocolo"}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Barra de Filtro e Busca Local */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Filtrar por número, marca ou titular..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-card/60 border-border/70 rounded-lg"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMarcas(true)}
          disabled={isSyncing}
          className="text-xs font-semibold h-8 gap-1.5 border-border/70 bg-card/40 hover:bg-card/70"
        >
          <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin text-primary" : ""}`} />
          <span>{isSyncing ? "Sincronizando..." : "Atualizar Lista"}</span>
        </Button>
      </div>

      {/* Modal de Raio-X Detalhado */}
      {selectedProcesso && (
        <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-xl space-y-6 relative animate-slide-up">
          <div className="flex items-start justify-between border-b border-border/60 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-extrabold bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-md">
                  Processo nº {selectedProcesso.numeroProcesso}
                </span>
                <span className={`inline-flex items-center font-mono text-[10px] px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedProcesso.situacao)}`}>
                  {selectedProcesso.situacao}
                </span>
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  Sincronizado no Radar
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                {selectedProcesso.marca}
              </h2>
            </div>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setSelectedProcesso(null)}
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </Button>
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

            {(() => {
              const sit = (selectedProcesso.situacao || "").toLowerCase();
              const despachosText = (selectedProcesso.despachos || [])
                .map(d => `${d.descricaoDespacho || ''} ${d.complemento || ''} ${d.codigoDespacho || ''}`)
                .join(' ')
                .toLowerCase();

              // Determina o estágio atual (1 a 5)
              let currentStep = 1;
              if (
                sit.includes("conced") || 
                sit.includes("registro de marca em vigor") || 
                sit.includes("prorrog") ||
                sit.includes("decenal") ||
                despachosText.includes("concessão")
              ) {
                currentStep = 5;
              } else if (
                sit.includes("deferi") || 
                sit.includes("indeferi") || 
                sit.includes("exame de mérito") || 
                sit.includes("mérito") ||
                despachosText.includes("deferimento") ||
                despachosText.includes("indeferimento") ||
                despachosText.includes("exigência de mérito")
              ) {
                currentStep = 4;
              } else if (
                sit.includes("oposição") || 
                sit.includes("publica") || 
                sit.includes("aguardando prazo") || 
                despachosText.includes("publicação de pedido") ||
                despachosText.includes("oposição")
              ) {
                currentStep = 3;
              } else if (
                sit.includes("exame formal") || 
                sit.includes("exigência formal") ||
                despachosText.includes("exame formal")
              ) {
                currentStep = 2;
              } else {
                currentStep = 1;
              }

              const steps = [
                { num: 1, title: "Depósito", sub: "Concluído", desc: "Protocolo inicial no INPI" },
                { num: 2, title: "Exame Formal", sub: "Superado", desc: "Análise de taxas e documentos" },
                { num: 3, title: "RPI 60 Dias", sub: "Prazo Legal", desc: "Prazo para manifestação de terceiros" },
                { num: 4, title: "Exame Mérito", sub: "Art. 124 LPI", desc: "Análise de registrabilidade" },
                { num: 5, title: "Decenal", sub: "10 Anos", desc: "Concessão e vigência decenal" },
              ];

              return (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
                  {steps.map((step) => {
                    const isCompleted = step.num < currentStep;
                    const isCurrent = step.num === currentStep;

                    let statusLabel = step.sub;
                    if (isCompleted) {
                      statusLabel = step.num === 1 ? "Concluído" : step.num === 2 ? "Superado" : "Concluído";
                    } else if (isCurrent) {
                      statusLabel = currentStep === 5 ? "Vigente (Ativo)" : "Em Andamento";
                    } else {
                      statusLabel = "Aguardando";
                    }

                    return (
                      <div
                        key={step.num}
                        className={`p-2.5 rounded-xl border transition-all space-y-1 ${
                          isCompleted
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                            : isCurrent
                            ? "border-primary/80 bg-primary/15 shadow-sm shadow-primary/10 ring-1 ring-primary/40"
                            : "border-border/50 bg-background/30 opacity-60"
                        }`}
                      >
                        <div
                          className={`size-5 rounded-full text-[10px] font-bold mx-auto flex items-center justify-center ${
                            isCompleted
                              ? "bg-emerald-500 text-black font-bold"
                              : isCurrent
                              ? "bg-primary text-primary-foreground font-extrabold animate-pulse"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? "✓" : step.num}
                        </div>
                        <div className={`text-[11px] font-bold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                          {step.title}
                        </div>
                        <div
                          className={`text-[9px] font-mono font-bold ${
                            isCompleted
                              ? "text-emerald-500"
                              : isCurrent
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {statusLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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
              <div className="size-44 rounded-xl border border-border/60 bg-background flex flex-col items-center justify-center overflow-hidden p-3 shadow-inner">
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
                  <div className="flex flex-col items-center justify-center text-center p-3">
                    <span className="font-mono text-xs uppercase font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md shadow-xs">
                      Processo Nominativo
                    </span>
                  </div>
                )}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground mt-2">
                {selectedProcesso.logoUrl ? "Logotipo Oficial INPI" : "Apresentação Oficial INPI"}
              </span>
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

      {/* Grid de Marcas Monitoradas (1/3 de largura - 3 colunas) */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-32 animate-pulse bg-card/40 rounded-xl border border-border/70" />)}
        </div>
      ) : filteredMarcas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/80 rounded-2xl bg-card/30">
          <Shield className="size-8 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-bold text-foreground">Nenhuma marca monitorada no Radar</h3>
          <p className="text-xs text-muted-foreground mt-1">Adicione o número de um processo acima ou pesquise na aba Consultas INPI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMarcas.map(marca => (
            <div key={marca.id} className="relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-md group">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-foreground tracking-tight bg-muted px-2 py-0.5 rounded-md">
                      {marca.numero_inpi}
                    </span>
                    {marca.classe_nice && (
                      <span className="font-mono text-[9px] text-muted-foreground bg-card px-1.5 py-0.5 rounded border border-border/50">
                        NCL {marca.classe_nice}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={deletingId === marca.id}
                    onClick={(e) => handleDeleteMarca(marca.id, marca.numero_inpi, e)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-6 rounded-md transition-opacity"
                    title="Remover do Radar"
                  >
                    {deletingId === marca.id ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                  </Button>
                </div>
                
                <h3 className="mt-2.5 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                  {marca.nome_marca}
                </h3>

                {marca.titular && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    Titular: <span className="font-semibold text-foreground/80">{marca.titular}</span>
                  </p>
                )}
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-full border ${getStatusColor(marca.status_ipas)}`}>
                    {getStatusIcon(marca.status_ipas)}
                    {marca.status_ipas}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-muted-foreground border-t border-border/50 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenRaioX(marca.numero_inpi)}
                  disabled={loadingDetail}
                  className="text-[11px] h-6 px-2 text-primary hover:text-primary hover:bg-primary/10 gap-1 font-sans font-semibold"
                >
                  <Eye className="size-3" />
                  <span>Raio-X do Processo</span>
                </Button>

                <a
                  href={`https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-sans font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  INPI <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
