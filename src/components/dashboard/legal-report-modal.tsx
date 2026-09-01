"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Building,
  User,
  Scale,
  Calendar,
  Lock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LegalReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marca: string;
  classe?: string;
  report: {
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
  } | null;
  partnerName?: string;
}

export function LegalReportModal({
  open,
  onOpenChange,
  marca,
  classe,
  report,
  partnerName
}: LegalReportModalProps) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 p-0 text-zinc-100 rounded-2xl shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Parecer Técnico de Viabilidade Marcária</DialogTitle>
        </DialogHeader>

        {/* Barra de Ações Topo */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Scale className="size-4 text-primary" />
            <span>Documento Técnico B2B &bull; INPI / LPI 9.279/96</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs h-8 gap-1.5 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            >
              <Printer className="size-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </Button>
          </div>
        </div>

        {/* ── CORPO DO RELATÓRIO TÉCNICO (IMPRIMÍVEL) ── */}
        <div className="p-8 sm:p-10 space-y-8 bg-zinc-950 print:bg-white print:text-black print:p-0">
          
          {/* Header Institucional */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 print:border-zinc-300">
            <div className="space-y-1">
              <div className="text-xs font-mono text-primary font-bold uppercase tracking-widest">
                DG Advocacia &bull; Propriedade Intelectual
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Parecer Técnico de Registrabilidade
              </h2>
              <p className="text-xs text-zinc-400 print:text-zinc-600">
                Dr. Felipe Dutra Gonçalves — OAB/SP nº 45.925
              </p>
            </div>

            <div className="text-right space-y-1 text-xs font-mono text-zinc-400 print:text-zinc-600 self-start sm:self-auto">
              <div>Data de Emissão: <strong className="text-zinc-200 print:text-black">{currentDate}</strong></div>
              <div>Base Oficial: <strong>INPI / RPI Ativa</strong></div>
              {partnerName && <div>Empresa Parceira: <strong className="text-primary">{partnerName}</strong></div>}
            </div>
          </div>

          {/* Dados do Objeto da Consulta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 print:border-zinc-300 print:bg-zinc-50">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Marca Pretendida</span>
              <div className="text-base font-extrabold text-white print:text-black mt-0.5">{marca}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Classe de Atividade</span>
              <div className="text-sm font-bold text-zinc-200 print:text-black mt-0.5">{classe ? `Classe Nice ${classe}` : "Geral"}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Classificação de Risco</span>
              <div className={`text-sm font-bold font-mono mt-0.5 ${
                report.nivelRisco === "BAIXO" ? "text-emerald-400" : report.nivelRisco === "MÉDIO" ? "text-amber-400" : "text-rose-400"
              }`}>
                {report.score}/100 &bull; Risco {report.nivelRisco}
              </div>
            </div>
          </div>

          {/* Resumo Executivo */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider">
              1. Diagnóstico Executivo
            </h3>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-300 print:text-zinc-800 leading-relaxed">
              {report.resumo}
            </div>
          </div>

          {/* Parecer Jurídico Fundamentado na LPI */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider">
              2. Fundamentação Técnica (Lei nº 9.279/1996)
            </h3>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-300 print:text-zinc-800 leading-relaxed whitespace-pre-line">
              {report.parecerJuridico}
            </div>
          </div>

          {/* Conflitos Críticos Identificados */}
          {report.conflitosCriticos && report.conflitosCriticos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider">
                3. Processos Colidentes Reais na Base do INPI
              </h3>
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden text-xs">
                {report.conflitosCriticos.map((conf, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white print:text-black">{conf.marca}</div>
                      <div className="text-[11px] text-zinc-400">Proc. Nº {conf.numero} &bull; {conf.titular}</div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                      {conf.situacao}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações Estratégicas */}
          {report.recomendacoes?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider">
                4. Recomendações Técnicas
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-300 print:text-zinc-800">
                {report.recomendacoes.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rodapé e Assinatura */}
          <div className="pt-8 border-t border-zinc-800 print:border-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="text-[11px] text-zinc-500 font-mono">
              Documento emitido eletronicamente pela central DG Advocacia.<br/>
              Validação com base nas diretrizes de exame de marcas do INPI.
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-zinc-200 print:text-black">Dr. Felipe Dutra Gonçalves</div>
              <div className="text-[10px] text-primary font-mono font-bold">OAB/SP nº 45.925</div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
