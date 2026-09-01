"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, EyeOff, CheckCircle2, FileText } from "lucide-react";
import { SmartDocBrand } from "@/components/brand-logo";

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-background text-foreground relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header / Navegação */}
        <div className="flex items-center justify-between border-b border-border/70 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para o Início</span>
          </Link>

          <Link href="/" className="group flex items-center transition-transform hover:opacity-90">
            <SmartDocBrand size="sm" />
          </Link>
        </div>

        {/* Título */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <Shield className="size-3.5" />
            <span>Privacidade & Proteção de Dados (LGPD)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: Agosto de 2026 &bull; Em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)
          </p>
        </div>

        {/* Conteúdo Legal */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-6">
          
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">1</span>
              Compromisso com a Privacidade, LGPD e Sigilo Institucional
            </h2>
            <p>
              A <strong>DG Advocacia</strong> (acessível através do endereço <a href="https://dgadvocacia.online" className="text-primary underline">https://dgadvocacia.online</a>), sob responsabilidade técnica do <strong>Dr. Felipe Dutra Gonçalves — OAB/SP nº 45.925</strong>, preza pelo mais absoluto rigor no tratamento de dados pessoais e no sigilo das informações empresariais de seus parceiros comerciais e clientes.
            </p>
            <p>
              Esta Política de Privacidade estabelece as diretrizes de coleta, custódia, processamento e proteção de dados durante o acesso ao painel do parceiro, uso das ferramentas de IA e contratação de serviços técnicos no INPI.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">2</span>
              Dados Tratados e Finalidades Específicas
            </h2>
            <p>
              Em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), tratamos apenas os dados estritamente necessários para a execução dos serviços de parceria:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li><strong>Dados Cadastrais da Empresa Parceira:</strong> Razão Social, nome do responsável legal, e-mail corporativo, telefone e dados de qualificação para formalização da cooperação;</li>
              <li><strong>Dados de Processos e Protocolos INPI:</strong> Números de pedidos, termos pesquisados, classes Nice e históricos de marcas cadastrados pelo parceiro para monitoramento no Radar RPI e elaboração de defesas;</li>
              <li><strong>Dados de Transações:</strong> Registros das operações de liquidação via Pix processadas por gateway seguro. Não mantemos custódia de dados bancários confidenciais ou senhas de pagamento;</li>
              <li><strong>Logs de Segurança e Acesso:</strong> Endereço IP, data e hora de conexão, em conformidade com o Marco Civil da Internet (Lei nº 12.965/2014).</li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">3</span>
              Segurança da Informação e Blindagem Ética (OAB)
            </h2>
            <p>
              Adotamos mecanismos robustos de segurança cibernética e governança corporativa:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-primary" />
                  Criptografia & Isolamento de Dados
                </div>
                <p className="text-xs text-muted-foreground">
                  Tráfego protegido por SSL/TLS de 256 bits e banco de dados isolado com políticas rigorosas de Row Level Security (RLS).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <EyeOff className="size-3.5 text-primary" />
                  Sigilo Profissional da Advocacia
                </div>
                <p className="text-xs text-muted-foreground">
                  Todas as marcas e estratégias processuais estão resguardadas pelo sigilo profissional inalienável assegurado pela OAB.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">4</span>
              Compartilhamento Restrito de Informações
            </h2>
            <p>
              A DG Advocacia <strong>não comercializa, não transfere e não compartilha</strong> dados com terceiros para fins publicitários. O compartilhamento restringe-se a:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li><strong>Instituto Nacional da Propriedade Industrial (INPI):</strong> Para formalização e protocolo oficial de atos processuais públicos;</li>
              <li><strong>Provedores de Infraestrutura:</strong> Supabase (hospedagem de banco de dados criptografado), GGPIX (processamento Pix) e Resend (comunicações transacionais essenciais).</li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">5</span>
              Direitos dos Titulares de Dados
            </h2>
            <p>
              Em atendimento ao Art. 18 da LGPD, os parceiros e usuários podem solicitar a qualquer momento a confirmação de tratamento, correção, anonimização, atualização ou portabilidade de seus dados cadastrais.
            </p>
          </section>

          {/* Encarregado DPO & Contato */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-md space-y-2 mt-8">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Canal do Encarregado de Dados (DPO) & Governança
            </h3>
            <p className="text-xs text-muted-foreground">
              Para exercer seus direitos de titular ou sanar dúvidas sobre a proteção de dados na plataforma, contate nosso canal oficial:{" "}
              <a href="mailto:contato@dgadvocacia.online" className="text-primary font-bold underline">
                contato@dgadvocacia.online
              </a>.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
