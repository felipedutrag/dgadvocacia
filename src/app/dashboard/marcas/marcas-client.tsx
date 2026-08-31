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

export function MarcasClient() {
  const supabase = createClient();
  const [marcas, setMarcas] = useState<MarcaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNumero, setNewNumero] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal de Raio-X
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchMarcas = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("marcas")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      if (data) setMarcas(data as MarcaItem[]);
    } catch (err: any) {
      console.error("Erro ao buscar marcas:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMarcas();
  }, [fetchMarcas]);

  const handleAddMarca = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = newNumero.trim();
    if (!cleanNum) return;

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

      // 2. Insere ou atualiza via UPSERT no Supabase
      const { error } = await supabase.from("marcas").upsert(
        {
          user_id: user.id,
          numero_inpi: cleanNum,
          nome_marca: nomeMarca,
          titular: titular,
          classe_nice: classeNice,
          status_ipas: statusIpas,
          imagem_url: logoUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, numero_inpi" }
      );

      if (error) throw error;

      setNewNumero("");
      setSuccessMsg(`Processo ${cleanNum} (${nomeMarca}) adicionado e sincronizado com o Radar!`);
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchMarcas();
    } catch (err: any) {
      if (err.message?.includes("duplicate key") || err.code === "23505") {
        setErrorMsg(`O processo nº ${cleanNum} já está cadastrado no seu Radar.`);
      } else {
        setErrorMsg("Erro ao rastrear processo: " + err.message);
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
      const { error } = await supabase.from("marcas").delete().eq("id", id);
      if (error) throw error;

      setMarcas(prev => prev.filter(m => m.id !== id));
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

  return (
    <div className="space-y-3.5">
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

      {/* Card de Adição Rápida ao Radar */}
      <Card className="bg-card/60 backdrop-blur-md border-border/70">
        <CardHeader className="py-2.5 px-4 sm:px-6 border-b border-border/40">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Plus className="size-4 text-primary" />
            Rastrear Novo Processo no Radar
          </CardTitle>
          <CardDescription className="text-xs">
            Insira o número do processo do INPI (9 dígitos). O sistema irá consultar a base oficial, puxar a marca, status, titular e monitorar despachos toda terça-feira.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3 px-4 sm:px-6 pb-4">
          <form onSubmit={handleAddMarca} className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Ex: 934821902 ou 790330172"
              value={newNumero}
              onChange={(e) => setNewNumero(e.target.value)}
              className="max-w-xs text-xs font-mono h-9 bg-card/80"
            />
            <Button type="submit" disabled={adding || !newNumero.trim()} className="text-xs font-bold h-9 px-5 gap-1.5">
              {adding ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              <span>{adding ? "Consultando & Rastreando..." : "Rastrear no Radar"}</span>
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
          onClick={fetchMarcas}
          disabled={loading}
          className="text-xs font-semibold h-8 gap-1.5 border-border/70 bg-card/40"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Atualizar Lista</span>
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div className="font-mono text-[10px] uppercase text-muted-foreground mb-1">Datas & Prazos</div>
                  <div className="font-mono text-[11px] text-foreground">
                    Depósito: <strong>{selectedProcesso.dataDeposito || "N/A"}</strong>
                    {selectedProcesso.dataVigencia && <span> • Vigência: <strong>{selectedProcesso.dataVigencia}</strong></span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 bg-muted/20 text-center">
              <div className="size-36 rounded-xl border border-border/60 bg-background flex items-center justify-center overflow-hidden p-2 shadow-inner">
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
              <span className="font-mono text-[9px] text-muted-foreground mt-1.5">Logotipo Oficial INPI</span>
            </div>
          </div>

          {/* Despachos RPI */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <Clock className="size-3.5 text-primary" />
              Histórico de Despachos na RPI ({selectedProcesso.despachos?.length || 0})
            </h3>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {selectedProcesso.despachos?.map((desp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg border border-border/60 bg-muted/20 text-[11px]">
                  <span className="font-mono font-bold bg-muted px-1.5 py-0.2 rounded border border-border/60 shrink-0">
                    RPI {desp.rpi}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-foreground">{desp.codigoDespacho}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground shrink-0">{desp.dataRpi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid de Marcas Monitoradas */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-32 animate-pulse bg-card/40 rounded-xl border border-border/70" />)}
        </div>
      ) : filteredMarcas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/80 rounded-2xl bg-card/30">
          <Shield className="size-8 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-bold text-foreground">Nenhuma marca monitorada no Radar</h3>
          <p className="text-xs text-muted-foreground mt-1">Adicione o número de um processo acima ou pesquise na aba Consultas INPI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
