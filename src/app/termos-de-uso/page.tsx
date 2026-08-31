"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Lock, CheckCircle2, Scale, AlertCircle } from "lucide-react";
import { SmartDocBrand } from "@/components/brand-logo";

export default function TermosDeUsoPage() {
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
            <FileText className="size-3.5" />
            <span>Condições Gerais de Prestação de Serviços</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Termos e Condições de Uso
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: Agosto de 2026 &bull; DG Advocacia &bull; Vigência Imediata
          </p>
        </div>

        {/* Conteúdo Legal */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-6">
          
          {/* Seção 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">1</span>
              Objeto dos Serviços
            </h2>
            <p>
              Estes Termos e Condições de Uso regulam o acesso e a utilização dos serviços jurídicos, tecnológicos e de inteligência em propriedade intelectual fornecidos pela <strong>DG Advocacia</strong> (disponível no endereço eletrônico <a href="https://dgadvocacia.online" className="text-primary underline">https://dgadvocacia.online</a>).
            </p>
            <p>
              A plataforma disponibiliza ferramentas para:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li>Consulta de anterioridades e análise de colidências na base pública do Instituto Nacional da Propriedade Industrial (INPI);</li>
              <li>Diagnóstico automatizado de viabilidade e risco marcário assistido por Inteligência Artificial (MarcaShield AI) com fundamentação na Lei de Propriedade Industrial (Lei nº 9.279/1996 - LPI);</li>
              <li>Monitoramento contínuo de despachos publicados na Revista da Propriedade Industrial (RPI - Radar INPI);</li>
              <li>Contratação de assessoria jurídica especializada para protocolo de pedidos de registro, manifestações, oposições, recursos e defesas administrativas perante o INPI.</li>
            </ul>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">2</span>
              Cadastro e Responsabilidade das Informações
            </h2>
            <p>
              Para utilizar as funcionalidades do painel do cliente e contratar serviços, o Usuário deverá fornecer informações cadastrais verídicas, exatas e completas (nome, e-mail, telefone e documento de identificação).
            </p>
            <p>
              O Usuário é o único responsável pela guarda e confidencialidade de suas credenciais de acesso, devendo notificar imediatamente a DG Advocacia caso identifique qualquer acesso não autorizado.
            </p>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">3</span>
              Diagnóstico de Viabilidade e Inteligência Artificial
            </h2>
            <p>
              O relatório de viabilidade emitido pelo <strong>MarcaShield AI</strong> constitui parecer técnico-estratégico preliminar fundamentado nos critérios do Art. 124, XIX da Lei 9.279/1996 e nos dados públicos disponibilizados pelo INPI no momento da busca.
            </p>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-foreground/90 space-y-1.5">
              <div className="font-bold flex items-center gap-2 text-primary">
                <AlertCircle className="size-4" />
                <span>Natureza da Avaliação:</span>
              </div>
              <p>
                Embora o sistema utilize algoritmos de alta precisão e bases oficiais, o deferimento ou indeferimento final de um registro é ato discricionário exclusivo dos examinadores do INPI. A aprovação prévia no sistema reduz significativamente o risco, mas não substitui as decisões soberanas da autarquia federal.
              </p>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">4</span>
              Contratação de Serviços e Pagamentos
            </h2>
            <p>
              Os valores dos serviços de assessoria (Registro de Marca, Defesa/Oposição e Radar de Monitoramento) estão expressos na moeda corrente nacional (BRL) e podem ser quitados instantaneamente via Pix por meio de gateway de pagamento seguro integrado.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li><strong>Taxas Federais Oficiais do INPI:</strong> Os honorários de assessoria profissional contratados não incluem eventuais Guia de Recolhimento da União (GRU) cobradas diretamente pelo INPI (ex: taxa de protocolo de pedido, concessão de registro decenal, etc.), as quais são recolhidas em favor da União conforme a tabela oficial do governo federal;</li>
              <li><strong>Início da Prestação:</strong> Os serviços técnicos e elaboração de peças têm início imediato após a confirmação do pagamento e envio dos documentos necessários pelo contratante.</li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">5</span>
              Prazos, Notificações e Radar INPI
            </h2>
            <p>
              O serviço <strong>Radar INPI</strong> realiza varreduras automatizadas semanais a cada edição da Revista da Propriedade Industrial (RPI). As notificações enviadas por e-mail ou Telegram possuem caráter informativo e de alerta de prazo processual.
            </p>
            <p>
              O cliente deve manter seus canais de contato sempre atualizados para o recebimento tempestivo de comunicações urgentes referentes a prazos legais do INPI.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">6</span>
              Sigilo Profissional e Propriedade Intelectual
            </h2>
            <p>
              Todas as informações, marcas em segredo de negócio, documentos societários e estratégias compartilhadas pelos clientes são protegidas por <strong>estrito sigilo profissional e confidencialidade</strong>, em conformidade com o Código de Ética e Disciplina da OAB.
            </p>
          </section>

          {/* Seção 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">7</span>
              Foro e Legislação Aplicável
            </h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil, especialmente a Lei de Propriedade Industrial (Lei nº 9.279/1996), o Código Civil e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
            <p>
              Para dirimir quaisquer dúvidas decorrentes deste instrumento, fica eleito o Foro da Comarca de domicílio da sede jurídica da DG Advocacia.
            </p>
          </section>

          {/* Contato Suporte */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-md space-y-2 mt-8">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Canal de Atendimento Jurídico
            </h3>
            <p className="text-xs text-muted-foreground">
              Dúvidas ou solicitações relativas a estes Termos de Uso podem ser encaminhadas diretamente ao nosso time através do e-mail oficial:{" "}
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
