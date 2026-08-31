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
              Compromisso com a Privacidade e Segurança
            </h2>
            <p>
              A <strong>DG Advocacia</strong> (acessível através do endereço <a href="https://dgadvocacia.online" className="text-primary underline">https://dgadvocacia.online</a>) preza pelo mais absoluto rigor no tratamento de dados pessoais e sigilo das informações empresariais de seus clientes.
            </p>
            <p>
              Esta Política de Privacidade descreve como coletamos, armazenamos, utilizamos, processamos e protegemos os seus dados durante a navegação, consultas de marcas e contratação de serviços jurídicos em nosso ambiente digital.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">2</span>
              Dados Coletados e Finalidades do Tratamento
            </h2>
            <p>
              Em conformidade com o Art. 7º da LGPD, os dados tratados possuem finalidades legítimas e específicas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li><strong>Dados de Cadastro e Identificação:</strong> Nome completo, endereço de e-mail, número de telefone/WhatsApp e CPF/CNPJ. Finalidade: Criação da conta de acesso, autenticação segura, emissão de cobranças Pix e qualificação de peças para protocolo no INPI.</li>
              <li><strong>Dados de Processos e Marcas:</strong> Termos de busca de marcas, classes Nice pesquisadas, números de processos e histórico de anterioridades consultadas. Finalidade: Execução do diagnóstico de viabilidade com IA e acompanhamento no Radar RPI.</li>
              <li><strong>Dados de Pagamento:</strong> Informações de transação Pix geradas via gateway seguro. A DG Advocacia não armazena dados bancários sensíveis ou senhas financeiras.</li>
              <li><strong>Registros de Conexão (Logs):</strong> Endereço IP, data e hora de acesso, tipo de navegador e dispositivo. Finalidade: Cumprimento de obrigação legal prevista no Marco Civil da Internet (Lei nº 12.965/2014, Art. 15).</li>
            </ul>
          </section>

          {/* Seção 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">3</span>
              Segurança da Informação e Criptografia
            </h2>
            <p>
              Adotamos medidas técnicas, administrativas e organizacionais de padrão bancário para proteger seus dados contra acessos não autorizados, vazamentos ou alterações ilícitas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-primary" />
                  Criptografia de Ponta a Ponta
                </div>
                <p className="text-xs text-muted-foreground">
                  Todas as comunicações e tráfego de rede são protegidos por protocolo HTTPS com certificado SSL/TLS de 256 bits.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-1">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <EyeOff className="size-3.5 text-primary" />
                  Sigilo Profissional OAB
                </div>
                <p className="text-xs text-muted-foreground">
                  Seus projetos e nomes de marca antes do protocolo são tratados sob dever legal de sigilo da advocacia brasileira.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">4</span>
              Compartilhamento de Dados com Terceiros
            </h2>
            <p>
              A DG Advocacia <strong>não comercializa, vende ou aluga</strong> dados pessoais de clientes em hipótese alguma. O compartilhamento ocorre exclusivamente nas seguintes hipóteses estritas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li><strong>Órgãos Oficiais Governamentais:</strong> Instituto Nacional da Propriedade Industrial (INPI) e Receita Federal do Brasil para fins de protocolo oficial de pedidos de registro;</li>
              <li><strong>Provedores de Infraestrutura e Pagamento:</strong> Supabase (banco de dados em nuvem criptografado), GGPIX (processamento seguro de Pix) e Resend (disparo de e-mails transacionais);</li>
              <li><strong>Requisições Judiciais:</strong> Cumprimento de ordens judiciais ou determinações de autoridades competentes.</li>
            </ul>
          </section>

          {/* Seção 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">5</span>
              Direitos dos Titulares de Dados (Art. 18 da LGPD)
            </h2>
            <p>
              Você, como titular dos dados, pode exercer a qualquer momento os seguintes direitos mediante simples solicitação por nossos canais de suporte:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-foreground/90">
              <li>Confirmação da existência de tratamento e acesso aos dados pessoais cadastrados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
              <li>Portabilidade dos dados para outro fornecedor de serviços;</li>
              <li>Revogação do consentimento, ressalvadas as hipóteses de guarda obrigatória por lei.</li>
            </ul>
          </section>

          {/* Seção 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-mono font-bold">6</span>
              Uso de Cookies e Tecnologias de Sessão
            </h2>
            <p>
              Utilizamos cookies essenciais e identificadores de sessão unicamente para manter o usuário autenticado de forma segura no painel do cliente, registrar preferências de tema (modo escuro/claro) e garantir o funcionamento adequado da aplicação.
            </p>
          </section>

          {/* Encarregado DPO & Contato */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-md space-y-2 mt-8">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Canal do Encarregado de Dados (DPO)
            </h3>
            <p className="text-xs text-muted-foreground">
              Para exercer seus direitos de privacidade ou esclarecer dúvidas sobre esta Política, entre em contato diretamente com o nosso Encarregado de Proteção de Dados:{" "}
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
