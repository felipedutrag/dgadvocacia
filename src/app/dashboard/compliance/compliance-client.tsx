"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  UserCheck,
  AlertTriangle,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  X,
  Phone,
  Building,
  Check,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ComplianceClient() {
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [servico, setServico] = useState("Adequação LGPD Completa & Inventário (ROPA)");
  const [descricao, setDescricao] = useState("");

  // Logged User Info
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Checklist interativo
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    item_1: true,
    item_2: false,
    item_3: false,
    item_4: false,
    item_5: false,
    item_6: true,
  });

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

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  const totalCompleted = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((totalCompleted / 6) * 100);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── GRID DE SERVIÇOS DE COMPLIANCE & LGPD COM PADRÃO DE CORES HARMONIZADO ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. Adequação LGPD Completa (Esmeralda / Proteção) */}
        <Card
          onClick={() => handleOpenModalWithService("Adequação LGPD Completa & Inventário (ROPA)")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Adequação LGPD & Inventário (ROPA)
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Mapeamento minucioso dos fluxos de dados pessoais (Data Mapping), enquadramento nas bases legais do Art. 7º da Lei 13.709/2018 e Relatório de Impacto (RIPD).
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Lei 13.709/18 & ANPD
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 2. DPO as a Service (Azul / Governança) */}
        <Card
          onClick={() => handleOpenModalWithService("DPO as a Service (Encarregado de Dados Nomeado)")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-105 transition-transform">
                <UserCheck className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                DPO as a Service (Encarregado de Dados)
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Nomeação de Encarregado de Proteção de Dados externo habilitado perante a ANPD e canal direto de atendimento às requisições de titulares (Art. 41).
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              Encarregado • Art. 41
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 3. Políticas de Privacidade & Termos (Roxo / Contratos) */}
        <Card
          onClick={() => handleOpenModalWithService("Políticas de Privacidade & Termos de Uso")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Políticas de Privacidade & Termos SaaS
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Redação e blindagem de Políticas de Privacidade, avisos de cookies granulares e Termos de Uso para plataformas web, e-commerces e aplicativos móveis.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-500 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Termos & Cookies
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 4. Aditivos Contratuais & DPA (Ciano / B2B) */}
        <Card
          onClick={() => handleOpenModalWithService("Aditivos de Proteção de Dados (DPA) com Operadores")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-cyan-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0 group-hover:scale-105 transition-transform">
                <Lock className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Aditivos DPA & Contratos com Operadores
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Elaboração de Data Processing Agreements (DPA), cláusulas de sigilo e aditivos contratuais de conformidade com fornecedores, agências e operadores terceirizados.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Segurança Jurídica B2B
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 5. Auditoria & Incidentes ANPD (Âmbar / Alerta) */}
        <Card
          onClick={() => handleOpenModalWithService("Auditoria de Risco Regulatório & Gestão de Incidentes")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                <AlertTriangle className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Auditoria de Risco & Incidentes ANPD
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Plano de resposta a vazamentos de dados, protocolos de comunicação obrigatória à Autoridade Nacional de Proteção de Dados (ANPD) e defesas em sanções.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Gestão de Crise & Sanções
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 6. Governança e Compliance de IA (Dourado / Primário / IA) */}
        <Card
          onClick={() => handleOpenModalWithService("Governança & Compliance de Inteligência Artificial")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-primary/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Governança & Compliance para IA
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Avaliação de impacto algorítmico, conformidade regulatória para integração de LLMs e mitigação de responsabilidade civil no uso empresarial de Inteligência Artificial.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              AI Act & Governança LLM
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>
      </div>

      {/* ── CHECKLIST INTERATIVO DE CONFORMIDADE (LGPD & ANPD) ── */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-md p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <FileCheck2 className="size-4 text-primary" />
              <span>Diagnóstico de Maturidade Regulatória (Checklist Contínuo)</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Monitore os 6 pilares fundamentais exigidos em fiscalizações da Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-mono font-bold text-muted-foreground">Conformidade:</span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              progressPercent >= 70 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
            }`}>
              {totalCompleted} de 6 Requisitos ({progressPercent}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: "item_1", title: "Mapeamento do Inventário de Dados (ROPA)", desc: "Identificação de todos os fluxos de entrada, armazenamento e descarte de dados nos termos do Art. 37 da LGPD." },
            { id: "item_2", title: "Aviso de Privacidade e Termos de Consentimento", desc: "Cláusulas claras e transparentes de acordo com o Art. 9º da LGPD em todos os formulários e pontos de contato." },
            { id: "item_3", title: "Canal Formal de Atendimento aos Titulares (DSR)", desc: "Procedimento operacional e canal para responder solicitações de titulares em até 15 dias corridos (Art. 18)." },
            { id: "item_4", title: "Aditivo de Proteção de Dados (DPA) com Terceiros", desc: "Cláusulas de responsabilidade solidária e obrigações estritas de segurança para operadores e plataformas SaaS." },
            { id: "item_5", title: "Plano de Resposta a Incidentes & Vazamentos", desc: "Protocolo formal de contenção e comunicação tempestiva à ANPD e aos titulares afetados em caso de incidente." },
            { id: "item_6", title: "Controle de Acesso Lógico & Criptografia", desc: "Autenticação em dois fatores (2FA), política de senhas fortes e isolamento de privilégios administrativos." },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                checkedItems[item.id]
                  ? "bg-primary/5 border-primary/30"
                  : "bg-background/40 border-border/60 hover:border-border"
              }`}
            >
              <div className={`size-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                checkedItems[item.id] ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card"
              }`}>
                {checkedItems[item.id] && <Check className="size-3" />}
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className={`text-xs font-bold ${checkedItems[item.id] ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── CARD DE AGENDAMENTO / CONSULTORIA DE COMPLIANCE & LGPD ── */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-md p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground">Precisa de Adequação LGPD Completa, DPO Dedicado ou Auditoria ANPD?</h4>
            <p className="text-[11px] text-muted-foreground">
              Nossa equipe de advogados especialistas em Proteção de Dados e Governança Corporativa estrutura o programa de conformidade sob medida para sua empresa.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => handleOpenModalWithService()}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm shrink-0 h-10"
          >
            <Send className="size-3.5" />
            <span>Solicitar Diagnóstico de Compliance</span>
          </Button>
        </div>
      </Card>

      {/* ── MODAL / FORMULÁRIO RÁPIDO DE LGPD (RESEND) ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Fechar */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {!success ? (
              <>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase">
                      Compliance & LGPD
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Solicitar Assessoria Regulatória
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Informe os dados abaixo para direcionarmos ao sócio especialista em Direito Digital e Privacidade.
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
                    <Label className="text-xs">Nome da Empresa / Site / App *</Label>
                    <div className="relative">
                      <Building className="size-3.5 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                      <Input
                        required
                        placeholder="Ex: Minha Empresa LTDA ou portal.com.br"
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
                    <Label className="text-xs">Serviço de Privacidade Desejado *</Label>
                    <select
                      value={servico}
                      onChange={(e) => setServico(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background/80 px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Adequação LGPD Completa & Inventário (ROPA)">Adequação LGPD Completa & Inventário (ROPA)</option>
                      <option value="DPO as a Service (Encarregado de Dados Nomeado)">DPO as a Service (Encarregado de Dados Nomeado)</option>
                      <option value="Políticas de Privacidade & Termos SaaS">Políticas de Privacidade & Termos SaaS</option>
                      <option value="Aditivos de Proteção de Dados (DPA) com Operadores">Aditivos de Proteção de Dados (DPA) com Operadores</option>
                      <option value="Auditoria de Risco & Incidentes ANPD">Auditoria de Risco & Incidentes ANPD</option>
                      <option value="Governança & Compliance para IA">Governança & Compliance para IA</option>
                      <option value="Outro / Compliance Digital">Outro / Compliance Digital</option>
                    </select>
                  </div>

                  {/* Descrição / Demanda */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Detalhes da Demanda (Opcional)</Label>
                    <textarea
                      rows={3}
                      placeholder="Descreva brevemente sua operação (ex: e-commerce, software, clínica, número de funcionários)..."
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
                      className="text-xs font-bold h-9 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer"
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
                    Nossa equipe já recebeu os dados da sua empresa <strong>{empresa}</strong> sobre <strong>{servico}</strong> e nosso especialista entrará em contato em breve pelo WhatsApp.
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
