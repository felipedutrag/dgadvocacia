"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Shield,
  Crown,
  User,
  Lightbulb,
  FileText,
  Palette,
  Layers,
  Globe,
  Building2,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TabKey =
  | "consultas"
  | "consultas-nome"
  | "consultas-processo"
  | "consultas-figura"
  | "marcas"
  | "naming"
  | "logos"
  | "nice"
  | "domains"
  | "plans"
  | "profile"
  | "consultoria"
  | "compliance"
  | "inovacao";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: "Consultas INPI & Vigilância" | "Ferramentas Inteligentes" | "Assessoria & Inovação B2B" | "Conta & Gestão";
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  tab: TabKey;
  keywords: string[];
}

const COMMAND_ITEMS: CommandItem[] = [
  // 1. Consultas & Vigilância INPI
  {
    id: "marcas",
    title: "Vigilância de Marcas (Radar RPI)",
    description: "Monitoramento semanal da Revista da Propriedade Industrial",
    category: "Consultas INPI & Vigilância",
    icon: Shield,
    shortcut: "Ctrl+M",
    tab: "marcas",
    keywords: ["radar", "rpi", "vigilancia", "colidencias", "carteira", "monitoramento", "marcas"],
  },
  {
    id: "consultas-nome",
    title: "Pesquisar Marca no INPI",
    description: "Busca de anterioridades e Score de Viabilidade com IA",
    category: "Consultas INPI & Vigilância",
    icon: Search,
    shortcut: "Ctrl+B",
    tab: "consultas-nome",
    keywords: ["busca", "pesquisa", "marca", "nome", "score", "inpi", "viabilidade", "fonetica"],
  },
  {
    id: "consultas-processo",
    title: "Consultar Processo (Raio-X)",
    description: "Despachos, titularidade e telemetria de 9 dígitos",
    category: "Consultas INPI & Vigilância",
    icon: FileText,
    shortcut: "Ctrl+P",
    tab: "consultas-processo",
    keywords: ["processo", "raio-x", "numero", "despachos", "protocolo", "titular", "inpi"],
  },
  {
    id: "consultas-figura",
    title: "Elementos Figurativos (CFE Viena)",
    description: "Pesquisa de logotipos e símbolos por código de Viena",
    category: "Consultas INPI & Vigilância",
    icon: Layers,
    shortcut: "Ctrl+F",
    tab: "consultas-figura",
    keywords: ["figura", "viena", "cfe", "logo", "simbolo", "desenho", "logotipo"],
  },

  // 2. Ferramentas Inteligentes
  {
    id: "naming",
    title: "Gerador de Marcas com IA (Naming)",
    description: "Criação de nomes registráveis e distintivos segundo a LPI",
    category: "Ferramentas Inteligentes",
    icon: Lightbulb,
    shortcut: "Ctrl+N",
    tab: "naming",
    keywords: ["naming", "gerador", "nomes", "ia", "lpi", "marca", "ideias"],
  },
  {
    id: "logos",
    title: "Estúdio de Logomarcas & Vetorização",
    description: "Geração de logos escaláveis em vetor (SVG) e PNG transparente",
    category: "Ferramentas Inteligentes",
    icon: Palette,
    shortcut: "Ctrl+L",
    tab: "logos",
    keywords: ["logo", "estudio", "logotipo", "svg", "vetor", "vetorizacao", "design", "imagem"],
  },
  {
    id: "nice",
    title: "Enquadrador de Classes Nice com IA",
    description: "Mapeamento das 45 classes de Nice e especificações pré-aprovadas",
    category: "Ferramentas Inteligentes",
    icon: Layers,
    shortcut: "Ctrl+I",
    tab: "nice",
    keywords: ["nice", "classe", "ncl", "especificacao", "enquadrador", "atividades", "produtos"],
  },
  {
    id: "domains",
    title: "Domínios (.com.br) & Redes Sociais",
    description: "Checador de disponibilidade no Registro.br e @ social",
    category: "Ferramentas Inteligentes",
    icon: Globe,
    shortcut: "Ctrl+D",
    tab: "domains",
    keywords: ["dominio", "registro.br", "whois", "redes", "social", "instagram", "site"],
  },

  // 3. Assessoria & Inovação B2B
  {
    id: "consultoria",
    title: "Consultoria Empresarial & Governança",
    description: "Holding Patrimonial, Planejamento Tributário, M&A e Contratos",
    category: "Assessoria & Inovação B2B",
    icon: Building2,
    shortcut: "Ctrl+E",
    tab: "consultoria",
    keywords: ["consultoria", "holding", "tributario", "m&a", "societario", "due diligence", "blindagem"],
  },
  {
    id: "inovacao",
    title: "Patentes & Startups Tech",
    description: "Patentes de Invenção, Registro de Software INPI (Hash SHA-512) e Vesting",
    category: "Assessoria & Inovação B2B",
    icon: Rocket,
    shortcut: "Ctrl+T",
    tab: "inovacao",
    keywords: ["patente", "inovacao", "software", "inpi", "startups", "vesting", "sha-512", "codigo"],
  },
  {
    id: "compliance",
    title: "Compliance & Adequação LGPD",
    description: "Inventário de dados (ROPA), DPO as a Service e Governança ANPD",
    category: "Assessoria & Inovação B2B",
    icon: ShieldCheck,
    shortcut: "Ctrl+G",
    tab: "compliance",
    keywords: ["lgpd", "compliance", "dpo", "privacidade", "anpd", "dados", "seguranca"],
  },

  // 4. Gestão & Planos
  {
    id: "plans",
    title: "Proteção de Marcas",
    description: "Contratação de cotas do Radar RPI e backend jurídico sob demanda",
    category: "Conta & Gestão",
    icon: Crown,
    shortcut: "Ctrl+U",
    tab: "plans",
    keywords: ["protecao", "marcas", "planos", "calculadora", "preco", "b2b", "radar", "assinatura", "pix"],
  },
  {
    id: "profile",
    title: "Minha Conta & Segurança",
    description: "Dados cadastrais do titular e alteração de senha",
    category: "Conta & Gestão",
    icon: User,
    shortcut: "Ctrl+O",
    tab: "profile",
    keywords: ["conta", "perfil", "senha", "dados", "titular", "seguranca"],
  },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateTab: (tab: TabKey) => void;
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

  const handleSelectTab = (tab: TabKey) => {
    onNavigateTab(tab);
    onOpenChange(false);
  };

  const handleAction = () => {
    const clean = query.trim();
    if (!clean) return;

    // Se forem apenas dígitos (6 a 10), busca por processo
    if (/^\d{6,10}$/.test(clean)) {
      if (onSearchProcesso) onSearchProcesso(clean);
      onNavigateTab("consultas-processo");
    } else {
      // Busca textual de marca
      if (onSearchMarca) onSearchMarca(clean);
      onNavigateTab("consultas-nome");
    }
    onOpenChange(false);
  };

  const isProcessNumber = /^\d{6,10}$/.test(query.trim());

  // Filtragem dinâmica de comandos
  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_ITEMS;

    return COMMAND_ITEMS.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.shortcut.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query]);

  // Agrupamento por categorias
  const categories = useMemo(() => {
    const map: Record<string, CommandItem[]> = {};
    for (const item of filteredCommands) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    }
    return map;
  }, [filteredCommands]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-xl p-0 overflow-hidden bg-card/95 border-border/80 backdrop-blur-2xl shadow-2xl rounded-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>

        {/* Input de Busca estilo Spotlight / Raycast */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60 bg-muted/30">
          <Search className="size-5 text-primary shrink-0" />
          <input
            type="text"
            placeholder="Digite um comando, marca ou nº de processo (ex: 934821902)..."
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
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground bg-muted hover:bg-muted/80 hover:text-foreground border border-border/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors shrink-0"
            title="Fechar (ESC)"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Sugestões & Atalhos Rápidos */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Ação Dinâmica Inteligente */}
          {query.trim() && (
            <div
              onClick={handleAction}
              className="p-3 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-between cursor-pointer hover:bg-primary/20 transition-all text-primary font-bold shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="size-4 shrink-0 text-primary animate-pulse" />
                <span className="truncate">
                  {isProcessNumber
                    ? `Consultar Raio-X do Processo Nº ${query.trim()} no INPI`
                    : `Pesquisar Anterioridades da Marca "${query.trim()}"`}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono font-semibold opacity-90">
                <span>Enter</span>
                <ArrowRight className="size-3.5" />
              </div>
            </div>
          )}

          {/* Listagem Agrupada por Categorias */}
          {Object.entries(categories).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold text-muted-foreground tracking-wider">
                {categoryName}
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.tab)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors text-left text-foreground group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className="size-7 rounded-lg bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/10 transition-all shrink-0">
                          <Icon className="size-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-foreground text-xs leading-snug group-hover:text-primary transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate leading-none mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <kbd className="font-mono text-[10px] font-bold text-muted-foreground bg-muted/80 border border-border/70 px-1.5 py-0.5 rounded shrink-0 group-hover:border-primary/40 group-hover:text-primary transition-colors">
                        {item.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-muted-foreground space-y-1">
              <p className="text-xs font-semibold text-foreground">Nenhum comando ou ferramenta encontrada</p>
              <p className="text-[11px]">Pressione <strong>Enter</strong> para pesquisar "{query.trim()}" no INPI.</p>
            </div>
          )}
        </div>

        {/* Footer do Command Palette */}
        <div className="p-2.5 bg-muted/30 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><strong>Enter</strong> executar</span>
            <span><strong>Ctrl+K</strong> abrir</span>
            <span><strong>ESC</strong> fechar</span>
          </div>
          <span className="text-primary font-bold">DG Advocacia 2.0</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
