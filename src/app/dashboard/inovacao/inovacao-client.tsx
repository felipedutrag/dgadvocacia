"use client";

import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  Cpu,
  Lock,
  Code2,
  Rocket,
  FileCode2,
  Send,
  Coins,
  Loader2,
  CheckCircle2,
  X,
  Phone,
  Building,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function InovacaoClient() {
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [servico, setServico] = useState("Patente de Invenção (PI)");
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
      setErrorMsg("Por favor, preencha o Nome da Empresa/Projeto e o WhatsApp.");
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
      {/* ── GRID DE SERVIÇOS & INOVAÇÃO TECNOLÓGICA ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* 1. Patente de Invenção */}
        <Card
          onClick={() => handleOpenModalWithService("Patente de Invenção (PI)")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-primary/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                <Lightbulb className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Patente de Invenção (PI)
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Proteção para produtos, processos ou composições inéditas no mundo que apresentem atividade inventiva e aplicação industrial. Validade de 20 anos.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Monopólio Tecnológico Global
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 2. Modelo de Utilidade */}
        <Card
          onClick={() => handleOpenModalWithService("Modelo de Utilidade (MU)")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                <Cpu className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Modelo de Utilidade (MU)
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Aperfeiçoamento ou melhoria funcional de objeto de uso prático que resulte em melhor utilização ou fabricação. Validade de 15 anos.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Inovações Incrementais
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 3. Segredo Industrial & NDAs */}
        <Card
          onClick={() => handleOpenModalWithService("Segredo Industrial & NDAs")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                <Lock className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Segredo Industrial & NDAs
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Proteção de fórmulas, algoritmos e know-how estratégico sem necessidade de publicação aberta, resguardado por acordos de sigilo com penalidades estritas.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Proteção por Tempo Indeterminado
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 4. Registro de Software no INPI */}
        <Card
          onClick={() => handleOpenModalWithService("Registro de Software no INPI")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-105 transition-transform">
                <Code2 className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Registro de Software no INPI
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Depósito do resumo criptográfico (Hash SHA-512) do código-fonte para garantia de anterioridade e proteção internacional por 50 anos (Lei 9.609/98).
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              Proteção de Código-Fonte
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 5. Startups & Vesting */}
        <Card
          onClick={() => handleOpenModalWithService("Vesting, Cliff & Mútuo Conversível")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 group-hover:scale-105 transition-transform">
                <Rocket className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Vesting, Cliff & Mútuo Conversível
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Contratos para atração e retenção de talentos (equity), termos de Cliff e instrumentos de captação anjo/seed segundo o Marco Legal das Startups (LC 182/21).
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-500 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Marco Legal das Startups
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>

        {/* 6. Cessão de Tecnologia & IP */}
        <Card
          onClick={() => handleOpenModalWithService("Cessão de Propriedade Intelectual & IP")}
          className="border-border/70 bg-card/60 backdrop-blur-md p-4 flex flex-col justify-between gap-3 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                <FileCode2 className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-foreground leading-tight">
                Cessão de Propriedade Intelectual & IP
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Blindagem contratual com prestadores de serviço e desenvolvedores para transferência irrestrita e definitiva de direitos patrimoniais para a empresa.
            </p>
          </div>
          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Titularidade Integral
            </span>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
              Solicitar &rarr;
            </span>
          </div>
        </Card>
      </div>

      {/* ── CARD DE AGENDAMENTO / CONSULTA DE INOVAÇÃO ── */}
      <Card className="border-border/70 bg-card/60 backdrop-blur-md p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground">Precisa de Registro de Software, Patente ou Assessoria para Startups?</h4>
            <p className="text-[11px] text-muted-foreground">
              Nossos especialistas em Propriedade Intelectual e Direito de Tecnologia realizam a busca de anterioridade e conduzem seu processo no INPI.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => handleOpenModalWithService()}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm shrink-0 h-10"
          >
            <span>Consultar Especialista em Inovação</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </Card>

      {/* ── MODAL / FORMULÁRIO RÁPIDO DE INOVAÇÃO (RESEND) ── */}
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
                      Inovação & Startups Tech
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Solicitar Consultoria Tecnológica
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Informe os dados abaixo para direcionarmos ao perito/sócio em Propriedade Intelectual e Startups.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                  {/* Nome da Empresa / Startup */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome da Startup / Empresa / Projeto *</Label>
                    <div className="relative">
                      <Building className="size-3.5 absolute left-3 top-3 text-muted-foreground pointer-events-none" />
                      <Input
                        required
                        placeholder="Ex: Nexus Tech ou Meu App"
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
                    <Label className="text-xs">Serviço de Inovação Desejado *</Label>
                    <select
                      value={servico}
                      onChange={(e) => setServico(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background/80 px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Patente de Invenção (PI)">Patente de Invenção (PI)</option>
                      <option value="Modelo de Utilidade (MU)">Modelo de Utilidade (MU)</option>
                      <option value="Segredo Industrial & NDAs">Segredo Industrial & NDAs</option>
                      <option value="Registro de Software no INPI">Registro de Software no INPI</option>
                      <option value="Vesting, Cliff & Mútuo Conversível">Vesting, Cliff & Mútuo Conversível</option>
                      <option value="Cessão de Propriedade Intelectual & IP">Cessão de Propriedade Intelectual & IP</option>
                      <option value="Outro / Assessoria Tecnológica">Outro / Assessoria Tecnológica</option>
                    </select>
                  </div>

                  {/* Descrição / Demanda */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Detalhes da Invenção / Demanda (Opcional)</Label>
                    <textarea
                      rows={3}
                      placeholder="Descreva brevemente a tecnologia, stack do software, protótipo ou estágio da startup..."
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
                    Nossa equipe já recebeu os dados do seu projeto <strong>{empresa}</strong> sobre <strong>{servico}</strong> e nosso especialista em Patentes & Tech entrará em contato em breve pelo WhatsApp.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/5513988658518?text=Olá,%20acabei%20de%20enviar%20uma%20solicitação%20no%20painel%20sobre%20${encodeURIComponent(servico)}.%20Projeto/Empresa:%20${encodeURIComponent(empresa)}.`}
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
