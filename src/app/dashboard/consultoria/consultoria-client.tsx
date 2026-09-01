"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  Handshake,
  SearchCheck,
  Building2,
  Lock,
  FileCheck,
  Send,
  Loader2,
  CheckCircle2,
  X,
  Phone,
  Building
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ConsultoriaClient() {
  const [modalOpen, setModalOpen] = useState(false);

  // Form State (Simplificado: Apenas Empresa e WhatsApp)
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [servico, setServico] = useState("Planejamento Tributário & Elisão Fiscal");
  const [descricao, setDescricao] = useState("");
  
  // Logged User Info
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "");
          setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "");
        }
      } catch (e) {
        console.error("Erro ao carregar usuário logado:", e);
      }
    }
    loadUser();
  }, []);

  const handleOpenModalWithService = (servicoName?: string) => {
    if (servicoName) {
      setServico(servicoName);
    }
    setSuccess(false);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa.trim() || !whatsapp.trim()) {
      setErrorMsg("Por favor, preencha o Nome da Empresa e o WhatsApp.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/consultoria/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa,
          whatsapp,
          servico,
          descricao,
          userEmail,
          userName,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Erro ao enviar solicitação.");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao enviar sua solicitação.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── GRID DE SERVIÇOS & CONSULTORIA EMPRESARIAL ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. Planejamento Tributário */}
        <Card
          onClick={() => handleOpenModalWithService("Planejamento Tributário & Elisão Fiscal")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                <Coins className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Planejamento Tributário & Elisão Fiscal
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Estruturação lícita de operações para redução da carga fiscal, aproveitamento de regimes especiais, recuperação de créditos e isenções sobre distribuição de lucros.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Eficiência Fiscal
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 2. Fusões e Aquisições (M&A) */}
        <Card
          onClick={() => handleOpenModalWithService("Fusões & Aquisições (M&A)")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-105 transition-transform">
                <Handshake className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Fusões & Aquisições (M&A)
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Assessoria jurídica completa em compra e venda de empresas, joint ventures, cisões, incorporações societárias e minutas de Term Sheet e MoU.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              Transações & Equity
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 3. Due Diligence Estratégica */}
        <Card
          onClick={() => handleOpenModalWithService("Due Diligence & Auditoria de Ativos")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-105 transition-transform">
                <SearchCheck className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Due Diligence & Auditoria de Ativos
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Auditoria investigativa e minuciosa de contingências fiscais, passivos trabalhistas, contratos críticos e titularidade de marcas antes de investimentos ou rodadas.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-500 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Mitigação de Riscos
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 4. Holding Patrimonial */}
        <Card
          onClick={() => handleOpenModalWithService("Holding Patrimonial Familiar")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-primary/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Holding Patrimonial Familiar
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Centralização de imóveis e bens em PJ própria. Redução de custos de inventário em até 80%, proteção contra penhoras operacionais e planejamento sucessório em vida.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Economia ITCMD
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 5. Segregação de Riscos */}
        <Card
          onClick={() => handleOpenModalWithService("Segregação de Riscos (PJ Operacional)")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                <Lock className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Segregação de Riscos (PJ Operacional)
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Isolamento do CNPJ operacional (com passivos trabalhistas e fiscais) do patrimônio consolidado dos sócios e dos ativos imobiliários da família.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Blindagem Anti-Execução
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 6. Acordo de Quotistas */}
        <Card
          onClick={() => handleOpenModalWithService("Acordo de Quotistas & Lock-Up")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-primary/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Acordo de Quotistas & Lock-Up
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Regramento estrito para impedir a entrada de terceiros ou herdeiros sem afinidade societária, estipulando quóruns qualificados e cláusulas de recompra.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Estabilidade Societária
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>
      </div>

      {/* ── CARD DE AGENDAMENTO / ESTRUTURAÇÃO PERSONALIZADA ── */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-md p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground">Deseja uma Consultoria Empresarial ou Estruturação Customizada?</h4>
            <p className="text-[11px] text-muted-foreground">
              Nossos advogados especialistas em Direito Societário, M&A e Planejamento Tributário desenham a estratégia jurídica sob medida para sua empresa.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => handleOpenModalWithService()}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm shrink-0 h-10"
          >
            <Send className="size-3.5" />
            <span>Solicitar Consultoria Estratégica</span>
          </Button>
        </div>
      </Card>

      {/* ── MODAL / FORMULÁRIO RÁPIDO DE CONSULTORIA (RESEND) ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Fechar */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>

            {!success ? (
              <>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase">
                      Atendimento B2B Especializado
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Solicitar Consultoria Empresarial
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Informe os dados abaixo para direcionarmos ao sócio especialista.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                  {/* Nome da Empresa */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome da Empresa / Grupo *</Label>
                    <div className="relative">
                      <Building className="size-3.5 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                      <Input
                        required
                        placeholder="Ex: Nexus Participações LTDA ou Minha Empresa"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        className="text-xs pl-8 h-9 bg-background/80"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">WhatsApp para Retorno *</Label>
                    <div className="relative">
                      <Phone className="size-3.5 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                      <Input
                        required
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="text-xs pl-8 h-9 bg-background/80"
                      />
                    </div>
                  </div>

                  {/* Serviço Desejado */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Serviço de Interesse *</Label>
                    <select
                      value={servico}
                      onChange={(e) => setServico(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background/80 px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Planejamento Tributário & Elisão Fiscal">Planejamento Tributário & Elisão Fiscal</option>
                      <option value="Fusões & Aquisições (M&A)">Fusões & Aquisições (M&A)</option>
                      <option value="Due Diligence & Auditoria de Ativos">Due Diligence & Auditoria de Ativos</option>
                      <option value="Holding Patrimonial Familiar">Holding Patrimonial Familiar</option>
                      <option value="Segregação de Riscos (PJ Operacional)">Segregação de Riscos (PJ Operacional)</option>
                      <option value="Acordo de Quotistas & Lock-Up">Acordo de Quotistas & Lock-Up</option>
                      <option value="Outro / Consultoria Personalizada">Outro / Consultoria Personalizada</option>
                    </select>
                  </div>

                  {/* Descrição / Demanda */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Detalhes da Demanda (Opcional)</Label>
                    <textarea
                      rows={3}
                      placeholder="Descreva brevemente a necessidade da sua empresa..."
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      className="w-full rounded-md border border-input bg-background/80 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  {userEmail && (
                    <div className="text-[10px] font-mono text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border/50">
                      Notificação será vinculada à sua conta: <span className="text-foreground font-bold">{userEmail}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setModalOpen(false)}
                      className="text-xs h-9"
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="text-xs font-bold h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin mr-1.5" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="size-3.5 mr-1.5" />
                          <span>Enviar Solicitação</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              /* Sucesso */
              <div className="text-center py-6 space-y-4">
                <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">
                    Solicitação Enviada com Sucesso!
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Nossa equipe já recebeu os dados da sua empresa <strong>{empresa}</strong> sobre <strong>{servico}</strong> e nosso advogado especialista entrará em contato em breve pelo WhatsApp.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/5513988658518?text=Olá,%20acabei%20de%20enviar%20uma%20solicitação%20no%20painel%20sobre%20${encodeURIComponent(servico)}.%20Empresa:%20${encodeURIComponent(empresa)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm w-full sm:w-auto justify-center"
                  >
                    <Send className="size-3.5" />
                    <span>Falar Imediatamente no WhatsApp</span>
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    className="text-xs h-9 w-full sm:w-auto"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
