"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Shield,
  Crown,
  User,
  Lightbulb,
  Command,
  FileText,
  Palette,
  ArrowRight,
  Zap,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateTab: (tab: "consultas" | "marcas" | "naming" | "plans" | "profile") => void;
  onSearchProcesso?: (numero: string) => void;
  onSearchMarca?: (termo: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onNavigateTab,
  onSearchProcesso,
  onSearchMarca,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const handleSelectTab = (tab: "consultas" | "marcas" | "naming" | "plans" | "profile") => {
    onNavigateTab(tab);
    onOpenChange(false);
  };

  const handleAction = () => {
    const clean = query.trim();
    if (!clean) return;

    // Se forem apenas dígitos, busca por processo
    if (/^\d{6,10}$/.test(clean)) {
      if (onSearchProcesso) onSearchProcesso(clean);
      onNavigateTab("consultas");
    } else {
      // Busca textual de marca
      if (onSearchMarca) onSearchMarca(clean);
      onNavigateTab("consultas");
    }
    onOpenChange(false);
  };

  const isProcessNumber = /^\d{6,10}$/.test(query.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-card/95 border-border/80 backdrop-blur-2xl shadow-2xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>

        {/* Input de Busca estilo Spotlight / Raycast */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60 bg-muted/30">
          <Search className="size-5 text-primary shrink-0" />
          <input
            type="text"
            placeholder="Digite o nome da marca, número do processo (9 dígitos) ou comando..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAction();
              }
            }}
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground bg-muted border border-border/60 px-1.5 py-0.5 rounded">
            <span>ESC</span>
          </kbd>
        </div>

        {/* Sugestões & Atalhos Rápidos */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
          {query.trim() && (
            <div
              onClick={handleAction}
              className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between cursor-pointer hover:bg-primary/15 transition-all text-primary font-bold"
            >
              <div className="flex items-center gap-2">
                <Zap className="size-4" />
                <span>
                  {isProcessNumber
                    ? `Consultar Raio-X do Processo Nº ${query.trim()} no INPI`
                    : `Pesquisar Anterioridades da Marca "${query.trim()}"`}
                </span>
              </div>
              <ArrowRight className="size-4" />
            </div>
          )}

          <div className="px-2 py-1 text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Navegação Rápida
          </div>

          <button
            onClick={() => handleSelectTab("consultas")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left text-foreground"
          >
            <div className="flex items-center gap-2.5">
              <Search className="size-4 text-primary" />
              <span>Pesquisa de Anterioridades & Viabilidade IA</span>
            </div>
            <kbd className="font-mono text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
              Ctrl+K
            </kbd>
          </button>

          <button
            onClick={() => handleSelectTab("naming")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left text-foreground"
          >
            <div className="flex items-center gap-2.5">
              <Lightbulb className="size-4 text-amber-500" />
              <span>Estúdio IA de Naming & Criação de Logos</span>
            </div>
            <kbd className="font-mono text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
              Ctrl+N
            </kbd>
          </button>

          <button
            onClick={() => handleSelectTab("marcas")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left text-foreground"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="size-4 text-primary" />
              <span>Radar RPI & Monitoramento de Carteira</span>
            </div>
            <kbd className="font-mono text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
              Ctrl+M
            </kbd>
          </button>

          <button
            onClick={() => handleSelectTab("plans")}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left text-foreground"
          >
            <div className="flex items-center gap-2.5">
              <Crown className="size-4 text-amber-500" />
              <span>Calculadora de Carteira & Serviços B2B</span>
            </div>
            <kbd className="font-mono text-[10px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
              Ctrl+L
            </kbd>
          </button>
        </div>

        {/* Footer do Command Palette */}
        <div className="p-2.5 bg-muted/40 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><strong>Enter</strong> para selecionar</span>
            <span><strong>↑↓</strong> para navegar</span>
          </div>
          <span>DG Advocacia 2.0</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
