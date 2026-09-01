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
              Objeto e Natureza da Parceria B2B
            </h2>
            <p>
              Estes Termos e Condições de Uso regulam o acesso, a utilização e a cooperação técnico-institucional fornecida pela <strong>DG Advocacia</strong> (patronada pelo <strong>Dr. Felipe Dutra Gonçalves — OAB/MG nº 45.925</strong>, disponível no endereço eletrônico <a href="https://dgadvocacia.online" className="text-primary underline">https://dgadvocacia.online</a>) para empresas parceiras, agências de branding, contabilidades e escritórios que gerenciam carteiras de registro de marcas perante o Instituto Nacional da Propriedade Industrial (INPI).
            </p>
            <p>
              A plataforma disponibiliza infraestrutura tecnológica de apoio e suporte jurídico especializado, compreendendo:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li><strong>Dashboard Operacional de Gestão:</strong> Painel para cadastro e acompanhamento centralizado de protocolos e processos no INPI;</li>
              <li><strong>Inteligência e Viabilidade com IA:</strong> Ferramentas de pesquisa prévia, análise fonética e diagnóstico técnico preliminar de colidência (Lei nº 9.279/1996 - LPI);</li>
              <li><strong>Radar RPI Automatizado:</strong> Monitoramento contínuo de publicações semanais na Revista da Propriedade Industrial com alertas de prazos fatais;</li>
              <li><strong>Backend Jurídico Especializado:</strong> Assessoria jurídica corporativa sob demanda para elaboração e protocolo de manifestações, oposições, recursos e defesas administrativas assinadas por advogado habilitado.</li>
            </ul>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">2</span>
              Cadastro da Empresa Parceira e Responsabilidade das Informações
            </h2>
            <p>
              O acesso à área restrita do parceiro é concedido mediante cadastro com informações verídicas, incluindo Razão Social / Nome do Responsável, e-mail corporativo e telefone de contato.
            </p>
            <p>
              A empresa parceira é a única responsável pelas informações dos processos e clientes que cadastrar em seu painel, bem como pela custódia segura de suas credenciais de autenticação.
            </p>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">3</span>
              Diagnóstico de Viabilidade e Inteligência Artificial
            </h2>
            <p>
              Os relatórios e scores de viabilidade gerados pelas ferramentas de inteligência artificial constituem análises técnico-probabilísticas de suporte, baseadas nos dados públicos do INPI e nos critérios do Art. 124 da LPI.
            </p>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-foreground/90 space-y-1.5">
              <div className="font-bold flex items-center gap-2 text-primary">
                <AlertCircle className="size-4" />
                <span>Competência do INPI e Atuação Jurídica:</span>
              </div>
              <p>
                A concessão final do registro de marca é ato discricionário exclusivo da autarquia federal (INPI). A DG Advocacia atua com elevado rigor técnico e zelo profissional em todas as etapas processuais, assegurando a melhor defesa dos direitos do parceiro e de seus clientes.
              </p>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">4</span>
              Honorários, Pacotes de Carteira e Pagamentos
            </h2>
            <p>
              A contratação de pacotes de acompanhamento de carteira (marcas ativas no Radar) e serviços jurídicos avulsos (defesas, oposições, recursos) rege-se pelos valores vigentes na plataforma:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li><strong>Taxas Oficiais (GRU do INPI):</strong> Os honorários de assessoria e tecnologia não compreendem as taxas federais devidas diretamente à União/INPI, cabendo à empresa parceira ou ao cliente final o recolhimento das respectivas guias oficiais;</li>
              <li><strong>Início da Execução Técnica:</strong> As peças técnicas e monitoramentos são ativados imediatamente após a confirmação da transação e envio dos subsídios necessários.</li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">5</span>
              Sigilo Profissional e Conformidade com o Provimento CFOAB 205/2021
            </h2>
            <p>
              A relação entre a DG Advocacia e a empresa parceira é pautada pelo <strong>estrito sigilo profissional</strong>, confidencialidade de projetos de marca e respeito integral às normas do Código de Ética e Disciplina da OAB e do Provimento CFOAB nº 205/2021.
            </p>
            <p>
              A tecnologia e os algoritmos empregados constituem ferramentas auxiliares de produtividade e governança, sendo todas as peças processuais e atos privativos da advocacia submetidos à rigorosa revisão e assinatura do advogado responsável.
            </p>
          </section>

          {/* Seção 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">6</span>
              Foro e Legislação Aplicável
            </h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial a Lei de Propriedade Industrial (Lei nº 9.279/1996), o Código Civil e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
            <p>
              Fica eleito o Foro da Comarca da sede jurídica da DG Advocacia para dirimir eventuais controvérsias decorrentes deste instrumento.
            </p>
          </section>

          {/* Contato Suporte */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-md space-y-2 mt-8">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Canal Institucional de Parcerias & Suporte
            </h3>
            <p className="text-xs text-muted-foreground">
              Para esclarecimentos sobre estes Termos de Parceria ou questões operacionais, contate nossa assessoria institucional pelo e-mail:{" "}
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
