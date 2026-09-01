"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  PenTool,
  Bot,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Zap,
  Palette,
  Layers,
  ArrowRight,
  Loader2,
  RefreshCw,
  Globe,
  Scale,
  ShieldAlert,
  Send,
  Star,
  Sparkles,
  Eye,
  Share2,
  FileText,
  Bookmark,
  Briefcase,
  X,
  ExternalLink,
  ShieldCheck,
  Shield,
  Lock,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NamingSuggestion } from "@/app/api/inpi/naming/route";

// Presets Rápidos de Nicho para 1-clique
const NICHO_PRESETS = [
  {
    label: "SaaS & IA B2B",
    segmento: "Software SaaS e Inteligência Artificial B2B",
    descricao: "Automação inteligente de processos operacionais e análise preditiva",
    publico: "Diretores de Tecnologia, Gestores e Startups",
    tom: "Inovador & Tecnológico",
  },
  {
    label: "Advocacia & Tributário",
    segmento: "Sociedade de Advogados e Direito Tributário",
    descricao: "Assessoria jurídica de alto valor, planejamento tributário e blindagem",
    publico: "Empresários, C-Levels e Grandes Corporações",
    tom: "Autoritário & Nobre",
  },
  {
    label: "FinTech & Crédito",
    segmento: "FinTech de Meios de Pagamento e Crédito Digital",
    descricao: "Soluções de liquidez instantânea, split de pagamentos e banking ágil",
    publico: "PMEs, Lojistas e Empresas Digitais",
    tom: "Inovador & Tecnológico",
  },
  {
    label: "Estética & Saúde Premium",
    segmento: "Clínica de Dermatologia e Estética Avançada",
    descricao: "Tratamentos de alta performance, laser moderno e rejuvenescimento",
    publico: "Público Exigente e Mercado de Luxo",
    tom: "Luxo & Sofisticação",
  },
  {
    label: "Café & Gastronomia",
    segmento: "Torrefação e Cafeteria de Cafés Especiais",
    descricao: "Grãos selecionados de alta pontuação com torra artesanal sob demanda",
    publico: "Apreciadores de Gastronomia e Cafés Especiais",
    tom: "Acolhedor & Experiencial",
  },
  {
    label: "Moda & Streetwear",
    segmento: "Marca de Roupas e Vestuário Urbano Autoral",
    descricao: "Estilo autêntico, peças oversized e coleções com tiragem limitada",
    publico: "Jovens e Geração Z",
    tom: "Audacioso & Disruptivo",
  },
];



// Presets de Símbolos Marcários
const SYMBOL_PRESETS = [
  { id: "shield", label: "Escudo de Autoridade", icon: "🛡️", desc: "Escudo geométrico com monograma e linhas de proteção" },
  { id: "crown", label: "Coroa & Brasão Nobre", icon: "👑", desc: "Coroa minimalista imperial com linhas lapidadas" },
  { id: "justice", label: "Balança & Justiça", icon: "⚖️", desc: "Balança estilizada moderna de precisão jurídica" },
  { id: "quantum", label: "Nó Neural & Tech", icon: "🌐", desc: "Rede neural quântica e conexões em malha geométrica" },
  { id: "thunder", label: "Raio & Alta Voltagem", icon: "⚡", desc: "Raio geométrico dinâmico com vetor futurista" },
  { id: "infinity", label: "Infinito & Möbius", icon: "♾️", desc: "Fita de Möbius tridimensional contínua" },
  { id: "eagle", label: "Águia & Predador", icon: "🦅", desc: "Silhueta de águia imponente com asas geométricas" },
  { id: "diamond", label: "Diamante Lapidado", icon: "💎", desc: "Facetas poligonais lapidadas em alta precisão" },
  { id: "cube", label: "Cubo Isométrico 3D", icon: "🔷", desc: "Cubo arquitetônico tridimensional em perspectiva" },
  { id: "botanical", label: "Folha & Orgânico", icon: "🌿", desc: "Folha botânica estilizada e sustentável" }
];

interface NamingClientProps {
  initialTab?: "naming" | "logos" | "nice" | "domains";
  onVerifyTrademark?: (marca: string, classe?: string) => void;
  onGoToPlans?: () => void;
}

export function NamingClient({ initialTab = "naming", onVerifyTrademark, onGoToPlans }: NamingClientProps) {
  const [activeSubTab, setActiveSubTab] = useState<"naming" | "logos" | "nice" | "domains">(initialTab);

  React.useEffect(() => {
    if (initialTab) setActiveSubTab(initialTab);
  }, [initialTab]);

  // Naming Form State
  const [segmento, setSegmento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState("B2B & Corporativo");
  const [tomVoz, setTomVoz] = useState("Autoritário & Nobre");
  const [estilo, setEstilo] = useState("Equilibrado (Mix Estratégico)");
  const [idiomaOrigem, setIdiomaOrigem] = useState("Português e Raiz Latina");

  const [namingLoading, setNamingLoading] = useState(false);
  const [variationLoadingFor, setVariationLoadingFor] = useState<string | null>(null);
  const [sugestoes, setSugestoes] = useState<NamingSuggestion[]>([]);
  const [favoritos, setFavoritos] = useState<NamingSuggestion[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "favoritos">("all");
  const [namingError, setNamingError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedPitchIndex, setCopiedPitchIndex] = useState<number | null>(null);

  // Mockup Modal State
  const [selectedMockupBrand, setSelectedMockupBrand] = useState<NamingSuggestion | null>(null);
  const [mockupTab, setMockupTab] = useState<"facade" | "card" | "app" | "stationery">("facade");

  // Logo Creator State
  const [logoMarca, setLogoMarca] = useState("");
  const [logoSegmento, setLogoSegmento] = useState("");
  const [logoEstilo, setLogoEstilo] = useState("Minimalista & Luxo (Dark Luxury)");
  const [corPrimaria, setCorPrimaria] = useState("#D4AF37");
  const [corSecundaria, setCorSecundaria] = useState("#09090B");
  const [logoInstrucoes, setLogoInstrucoes] = useState("");
  const [logoSimbolo, setLogoSimbolo] = useState("Escudo geométrico abstrato de alta autoridade e linhas dinâmicas");
  const [selectedSymbolId, setSelectedSymbolId] = useState("shield");
  const [fundoTransparente, setFundoTransparente] = useState(true);
  const [previewBg, setPreviewBg] = useState<"facade" | "card" | "glass" | "transparent" | "dark" | "light">("facade");
  const [logoLoading, setLogoLoading] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<{
    imageUrl: string;
    svgContent?: string;
    isVector?: boolean;
    fundoTransparente?: boolean;
    model: string;
  } | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [savedLogos, setSavedLogos] = useState<Array<{
    id: string;
    marca: string;
    segmento: string;
    estilo: string;
    cores: string;
    imageUrl: string;
    svgContent?: string;
    isVector?: boolean;
    fundoTransparente?: boolean;
    createdAt: string;
  }>>([]);

  // Carregar logos salvos do LocalStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("dg_saved_logos_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedLogos(parsed);
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar logos salvas:", e);
    }
  }, []);

  const saveLogoToGallery = (logoItem: {
    marca: string;
    segmento: string;
    estilo: string;
    cores: string;
    imageUrl: string;
    svgContent?: string;
    isVector?: boolean;
    fundoTransparente?: boolean;
  }) => {
    const newItem = {
      ...logoItem,
      id: "logo_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setSavedLogos((prev) => {
      const updated = [newItem, ...prev.filter((l) => l.marca !== logoItem.marca || l.imageUrl !== logoItem.imageUrl)].slice(0, 30);
      try {
        localStorage.setItem("dg_saved_logos_v1", JSON.stringify(updated));
      } catch (e) {
        console.warn("Erro ao salvar logos no storage:", e);
      }
      return updated;
    });
  };

  const removeSavedLogo = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedLogos((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem("dg_saved_logos_v1", JSON.stringify(updated));
      } catch (e) {
        console.warn("Erro ao salvar logos no storage:", e);
      }
      return updated;
    });
  };

  // Smart Nice Classifier State
  const [niceInput, setNiceInput] = useState("");
  const [niceLoading, setNiceLoading] = useState(false);
  const [niceResult, setNiceResult] = useState<any | null>(null);
  const [niceError, setNiceError] = useState<string | null>(null);

  // Domain & Socials Check State
  const [domainInput, setDomainInput] = useState("");
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainResult, setDomainResult] = useState<any | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);

  // Cease & Desist State
  const [cdNotificante, setCdNotificante] = useState("");
  const [cdDoc, setCdDoc] = useState("");
  const [cdMarca, setCdMarca] = useState("");
  const [cdProcesso, setCdProcesso] = useState("");
  const [cdNotificado, setCdNotificado] = useState("");
  const [cdUso, setCdUso] = useState("");
  const [cdPlataforma, setCdPlataforma] = useState("Instagram / Web");
  const [cdPrazo, setCdPrazo] = useState("5");
  const [cdLoading, setCdLoading] = useState(false);
  const [cdResult, setCdResult] = useState<any | null>(null);
  const [cdError, setCdError] = useState<string | null>(null);

  // ── PERSISTÊNCIA AUTOMÁTICA EM LOCALSTORAGE (PRESERVAÇÃO TOTAL AO NAVEGAR OU F5) ──
  React.useEffect(() => {
    try {
      const savedNaming = localStorage.getItem("marcashield_naming_state");
      if (savedNaming) {
        const parsed = JSON.parse(savedNaming);
        if (parsed.segmento) setSegmento(parsed.segmento);
        if (parsed.descricao) setDescricao(parsed.descricao);
        if (parsed.publicoAlvo) setPublicoAlvo(parsed.publicoAlvo);
        if (parsed.tomVoz) setTomVoz(parsed.tomVoz);
        if (parsed.estilo) setEstilo(parsed.estilo);
        if (parsed.idiomaOrigem) setIdiomaOrigem(parsed.idiomaOrigem);
        if (parsed.sugestoes?.length) setSugestoes(parsed.sugestoes);
        if (parsed.favoritos?.length) setFavoritos(parsed.favoritos);
      }

      const savedLogo = localStorage.getItem("marcashield_logo_state");
      if (savedLogo) {
        const parsed = JSON.parse(savedLogo);
        if (parsed.logoMarca) setLogoMarca(parsed.logoMarca);
        if (parsed.logoSegmento) setLogoSegmento(parsed.logoSegmento);
        if (parsed.logoEstilo) setLogoEstilo(parsed.logoEstilo);
        if (parsed.corPrimaria) setCorPrimaria(parsed.corPrimaria);
        if (parsed.corSecundaria) setCorSecundaria(parsed.corSecundaria);
        if (parsed.logoInstrucoes) setLogoInstrucoes(parsed.logoInstrucoes);
        if (parsed.logoSimbolo) setLogoSimbolo(parsed.logoSimbolo);
        if (parsed.generatedLogo) setGeneratedLogo(parsed.generatedLogo);
      }

      const savedNice = localStorage.getItem("marcashield_nice_state");
      if (savedNice) {
        const parsed = JSON.parse(savedNice);
        if (parsed.niceInput) setNiceInput(parsed.niceInput);
        if (parsed.niceResult) setNiceResult(parsed.niceResult);
      }

      const savedDomain = localStorage.getItem("marcashield_domain_state");
      if (savedDomain) {
        const parsed = JSON.parse(savedDomain);
        if (parsed.domainInput) setDomainInput(parsed.domainInput);
        if (parsed.domainResult) setDomainResult(parsed.domainResult);
      }
    } catch (e) {
      console.warn("Erro ao recuperar estado do NamingClient:", e);
    }
  }, []);

  // Salvar automaticamente alterações de Naming
  React.useEffect(() => {
    try {
      localStorage.setItem(
        "marcashield_naming_state",
        JSON.stringify({
          segmento,
          descricao,
          publicoAlvo,
          tomVoz,
          estilo,
          idiomaOrigem,
          sugestoes,
          favoritos,
        })
      );
    } catch (e) {}
  }, [segmento, descricao, publicoAlvo, tomVoz, estilo, idiomaOrigem, sugestoes, favoritos]);

  // Salvar automaticamente alterações do Estúdio de Logos
  React.useEffect(() => {
    try {
      localStorage.setItem(
        "marcashield_logo_state",
        JSON.stringify({
          logoMarca,
          logoSegmento,
          logoEstilo,
          corPrimaria,
          corSecundaria,
          logoInstrucoes,
          logoSimbolo,
          generatedLogo,
        })
      );
    } catch (e) {}
  }, [logoMarca, logoSegmento, logoEstilo, corPrimaria, corSecundaria, logoInstrucoes, logoSimbolo, generatedLogo]);

  // Salvar Nice & Domínios
  React.useEffect(() => {
    try {
      localStorage.setItem("marcashield_nice_state", JSON.stringify({ niceInput, niceResult }));
    } catch (e) {}
  }, [niceInput, niceResult]);

  React.useEffect(() => {
    try {
      localStorage.setItem("marcashield_domain_state", JSON.stringify({ domainInput, domainResult }));
    } catch (e) {}
  }, [domainInput, domainResult]);

  // Limpar projeto atual
  const handleResetProject = () => {
    if (window.confirm("Deseja limpar todos os dados do briefing e nomes gerados para iniciar um novo projeto?")) {
      setSegmento("");
      setDescricao("");
      setSugestoes([]);
      setFavoritos([]);
      localStorage.removeItem("marcashield_naming_state");
    }
  };

  // Geração de Nomes com IA e Suporte a Variações Específicas
  const handleGenerateNames = async (e?: React.FormEvent, customVariacaoDe?: string) => {
    if (e) e.preventDefault();
    if (!customVariacaoDe && !segmento.trim() && !descricao.trim()) {
      setNamingError("Preencha ao menos o segmento ou a proposta de valor do negócio.");
      return;
    }

    if (customVariacaoDe) {
      setVariationLoadingFor(customVariacaoDe);
    } else {
      setNamingLoading(true);
    }
    setNamingError(null);

    try {
      const res = await fetch("/api/inpi/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segmento,
          descricao,
          publicoAlvo,
          tomVoz,
          estilo,
          idiomaOrigem,
          variacaoDe: customVariacaoDe,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar nomes");
      }

      if (customVariacaoDe) {
        setSugestoes((prev) => [...(data.sugestoes || []), ...prev]);
      } else {
        setSugestoes(data.sugestoes || []);
      }
    } catch (err: any) {
      setNamingError(err.message || "Falha na geração de nomes com IA");
    } finally {
      setNamingLoading(false);
      setVariationLoadingFor(null);
    }
  };

  // Toggle Favoritos
  const toggleFavorito = (sug: NamingSuggestion) => {
    setFavoritos((prev) => {
      const exists = prev.some((item) => item.nome === sug.nome);
      if (exists) {
        return prev.filter((item) => item.nome !== sug.nome);
      }
      return [...prev, sug];
    });
  };

  const isFavorito = (nome: string) => {
    return favoritos.some((item) => item.nome === nome);
  };

  // Copiar Pitch Completo Formatado
  const handleCopyPitch = (sug: NamingSuggestion, idx: number) => {
    const pitch = `🏛️ PROPOSTA DE NAMING & IDENTIDADE MARCÁRIA

🏷️ Marca: ${sug.nome}
✨ Slogan: "${sug.slogan || 'Posicionamento Estratégico'}"
🎯 Tipologia: ${sug.estilo} (Score LPI: ${sug.distintividadeScore}%)
📦 Classe Nice Sugerida: ${sug.classeSugerida}

💡 Racional Estratégico & Etimologia:
${sug.racional}

⚖️ Análise Jurídica LPI (Art. 124 Lei 9.279/96):
${sug.analiseJuridicaLPI || 'Alta distintividade e viabilidade de deferimento no INPI.'}

🌐 Sugestões de Domínios Oficiais:
${sug.sugestoesDominio ? sug.sugestoesDominio.map((d) => `• ${d}`).join('\n') : `• ${sug.nome.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`}

🚀 Diferenciais Competitivos:
${sug.pontosFortes?.map((pt) => `• ${pt}`).join('\n')}

Gerado pelo MarcaShield Naming AI.`;

    navigator.clipboard.writeText(pitch);
    setCopiedPitchIndex(idx);
    setTimeout(() => setCopiedPitchIndex(null), 2500);
  };

  // Filtragem de Nomes
  const filteredSugestoes = sugestoes.filter((sug) => {
    if (activeFilter === "favoritos") return isFavorito(sug.nome);
    return true;
  });

  // Geração de Logomarca com Gemini 2.5 Flash Vector Engine
  const handleGenerateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoMarca.trim()) {
      setLogoError("Informe o nome da marca para gerar a logo.");
      return;
    }

    setLogoLoading(true);
    setLogoError(null);

    try {
      const coresFormatadas = `Cor Primária (${corPrimaria}), Cor Secundária (${corSecundaria})`;
      const res = await fetch("/api/inpi/logo-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeMarca: logoMarca.trim(),
          segmento: logoSegmento.trim() || segmento.trim(),
          estilo: logoEstilo,
          cores: coresFormatadas,
          instrucoes: logoInstrucoes.trim(),
          fundoTransparente: fundoTransparente,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao gerar logomarca");
      }

      const newLogoData = {
        imageUrl: data.imageUrl,
        svgContent: data.svgContent,
        isVector: data.isVector,
        fundoTransparente: data.fundoTransparente,
        model: data.model || "Gemini 3.1 Flash Vector Engine",
      };
      setGeneratedLogo(newLogoData);
      setPreviewBg("facade");

      saveLogoToGallery({
        marca: logoMarca.trim(),
        segmento: logoSegmento.trim() || segmento.trim(),
        estilo: logoEstilo,
        cores: coresFormatadas,
        imageUrl: data.imageUrl,
        svgContent: data.svgContent,
        isVector: data.isVector,
        fundoTransparente: data.fundoTransparente,
      });
    } catch (err: any) {
      setLogoError(err.message || "Falha na geração da logomarca.");
    } finally {
      setLogoLoading(false);
    }
  };

  // Download direto do arquivo Vetor SVG (.svg) - Sem fundo / Isolado
  const handleDownloadSvg = () => {
    if (!generatedLogo) return;
    let content = generatedLogo.svgContent;
    if (!content && generatedLogo.imageUrl.startsWith("data:image/svg+xml;base64,")) {
      try {
        const b64 = generatedLogo.imageUrl.split(",")[1];
        content = atob(b64);
      } catch (e) {
        console.warn("Erro ao decodificar SVG base64:", e);
      }
    }

    if (content) {
      const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `logomarca-vetor-${logoMarca.toLowerCase().replace(/\s+/g, "-") || "marca"}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement("a");
      link.href = generatedLogo.imageUrl;
      link.download = `logomarca-${logoMarca.toLowerCase().replace(/\s+/g, "-") || "marca"}.png`;
      link.click();
    }
  };

  // Download do arquivo PNG Isolado em Alta Resolução (com ou sem transparência)
  const handleDownloadPng = (transparent = true) => {
    if (!generatedLogo) return;

    if (generatedLogo.imageUrl.startsWith("data:image/png;base64,")) {
      const link = document.createElement("a");
      link.href = generatedLogo.imageUrl;
      link.download = `logomarca-${transparent ? "transparente" : "dark"}-${logoMarca.toLowerCase().replace(/\s+/g, "-") || "marca"}.png`;
      link.click();
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 2400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (!transparent) {
        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `logomarca-hd-${transparent ? "transparente" : "fundo-escuro"}-${logoMarca.toLowerCase().replace(/\s+/g, "-") || "marca"}.png`;
      link.click();
    };
    img.src = generatedLogo.imageUrl;
  };

  // Download do Mockup Comercial em Alta Resolução (2400x1800 HD com Cenário 3D)
  const handleDownloadMockupPng = (mockupType: "facade" | "card" | "glass" = "facade") => {
    if (!generatedLogo) return;

    const canvas = document.createElement("canvas");
    canvas.width = 2400;
    canvas.height = 1800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Renderização do Fundo do Cenário 3D
    if (mockupType === "facade") {
      // Fachada 3D Dark Luxury
      const bgGrad = ctx.createRadialGradient(1200, 700, 100, 1200, 900, 1500);
      bgGrad.addColorStop(0, "#1c1917");
      bgGrad.addColorStop(0.4, "#0f0e0d");
      bgGrad.addColorStop(1, "#050505");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2400, 1800);

      // Luz de Palco Superior Dourada / Quente
      const topLight = ctx.createRadialGradient(1200, 0, 50, 1200, 700, 1000);
      topLight.addColorStop(0, "rgba(212, 175, 55, 0.25)");
      topLight.addColorStop(0.5, "rgba(212, 175, 55, 0.04)");
      topLight.addColorStop(1, "transparent");
      ctx.fillStyle = topLight;
      ctx.fillRect(0, 0, 2400, 1800);

      // Piso de Mármore Negro com Reflexo
      const floorGrad = ctx.createLinearGradient(0, 1400, 0, 1800);
      floorGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      floorGrad.addColorStop(0.05, "rgba(0, 0, 0, 0.6)");
      floorGrad.addColorStop(1, "#050505");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 1400, 2400, 400);
    } else if (mockupType === "card") {
      // Cartão de Visita Black & Gold
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, 2400, 1800);

      // Cartão 3D
      const cardX = 300;
      const cardY = 250;
      const cardW = 1800;
      const cardH = 1300;

      // Sombra profunda de elevação
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 100;
      ctx.shadowOffsetY = 50;

      // Corpo do cartão
      const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      cardGrad.addColorStop(0, "#18181b");
      cardGrad.addColorStop(0.7, "#09090b");
      cardGrad.addColorStop(1, "#040405");
      ctx.fillStyle = cardGrad;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 40);
      ctx.fill();

      // Borda Dourada Imperial
      ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.shadowColor = "transparent";
    } else {
      // Painel Corporativo 3D
      const bgGrad = ctx.createLinearGradient(0, 0, 2400, 1800);
      bgGrad.addColorStop(0, "#09090b");
      bgGrad.addColorStop(1, "#1c1917");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2400, 1800);
    }

    // 2. Desenhar a Logo centralizada
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const logoW = 1500;
      const logoH = 1125;
      const logoX = (canvas.width - logoW) / 2;
      const logoY = (canvas.height - logoH) / 2 - (mockupType === "facade" ? 60 : 0);

      ctx.drawImage(img, logoX, logoY, logoW, logoH);

      // Marca d'água / Assinatura de Apresentação sutil
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("PROPOSTA DE IDENTIDADE VISUAL", 2320, 1730);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `mockup-apresentacao-${mockupType}-${logoMarca.toLowerCase().replace(/\s+/g, "-") || "marca"}.png`;
      link.click();
    };
    img.src = generatedLogo.imageUrl;
  };

  // Copiar código SVG para o clipboard (Figma, Illustrator, Canva)
  const handleCopySvgCode = () => {
    if (!generatedLogo?.svgContent) return;
    navigator.clipboard.writeText(generatedLogo.svgContent);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2500);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Enquadramento Nice com IA
  const handleClassifyNice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niceInput.trim()) return;
    setNiceLoading(true);
    setNiceError(null);
    try {
      const res = await fetch("/api/inpi/nice-classifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ atividade: niceInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao classificar");
      setNiceResult(data);
    } catch (err: any) {
      setNiceError(err.message);
    } finally {
      setNiceLoading(false);
    }
  };

  // Checagem de Domínios
  const handleCheckDomains = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    setDomainLoading(true);
    setDomainError(null);
    try {
      const res = await fetch(`/api/inpi/domain-check?domain=${encodeURIComponent(domainInput.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao checar domínios");
      setDomainResult(data);
    } catch (err: any) {
      setDomainError(err.message);
    } finally {
      setDomainLoading(false);
    }
  };

  // Notificação Extrajudicial
  const handleGenerateCeaseDesist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cdMarca.trim() || !cdNotificado.trim()) return;
    setCdLoading(true);
    setCdError(null);
    try {
      const res = await fetch("/api/inpi/cease-desist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificanteNome: cdNotificante,
          notificanteDocumento: cdDoc,
          marcaRegistrada: cdMarca,
          processoInpi: cdProcesso,
          notificadoNome: cdNotificado,
          notificadoUsoIndevido: cdUso,
          plataformaInfracao: cdPlataforma,
          prazoDias: cdPrazo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao redigir notificação");
      setCdResult(data);
    } catch (err: any) {
      setCdError(err.message);
    } finally {
      setCdLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── SUB-ABA 1: NAMING & CRIAÇÃO DE MARCAS ── */}
      {activeSubTab === "naming" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Formulário de Briefing Estratégico */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3.5 border-b border-border/40 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 shrink-0">
                    <Bot className="size-4 text-primary shrink-0" />
                    <span>Briefing de Naming & Branding</span>
                  </CardTitle>

                  <div className="flex items-center gap-2 shrink-0">
                    {(segmento || sugestoes.length > 0) && (
                      <button
                        type="button"
                        onClick={handleResetProject}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive px-2.5 py-1 rounded-lg border border-border/70 hover:border-destructive/40 hover:bg-destructive/10 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                        title="Limpar campos e começar novo projeto"
                      >
                        <RefreshCw className="size-3 shrink-0" />
                        <span>Novo Briefing</span>
                      </button>
                    )}
                  </div>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  A IA constrói nomes com alta conexão semântica e distintividade jurídica para concessão no INPI.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2 space-y-4">
                {/* Presets Rápidos de Nicho */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">
                      Preenchimento Rápido (Nichos)
                    </Label>
                    <span className="text-[10px] text-primary flex items-center gap-1 font-semibold">
                      <Sparkles className="size-3" /> 1-Clique
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {NICHO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSegmento(preset.segmento);
                          setDescricao(preset.descricao);
                          setPublicoAlvo(preset.publico);
                          setTomVoz(preset.tom);
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg border border-border/60 bg-muted/30 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all text-muted-foreground font-medium"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => handleGenerateNames(e)} className="space-y-3.5 pt-1">
                  {namingError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span>{namingError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs">Segmento / Nicho de Atuação *</Label>
                    <Input
                      placeholder="Ex: Sociedade de Advogados, Clínica Médica, Software B2B..."
                      value={segmento}
                      onChange={(e) => setSegmento(e.target.value)}
                      className="text-xs h-9 bg-card/80"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Proposta de Valor / O que o negócio faz</Label>
                    <textarea
                      placeholder="Ex: Assessoria jurídica corporativa de alto padrão focada em planejamento tributário estratégico e governança..."
                      value={descricao}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescricao(e.target.value)}
                      className="w-full rounded-md border border-input bg-card/80 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={namingLoading}
                    className="w-full text-xs font-bold h-10 gap-2 mt-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                  >
                    {namingLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Criando Nomes Estratégicos com IA...</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="size-4" />
                        <span>Gerar 3 Sugestões de Nomes com IA</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resultados de Nomes & Ferramentas Ricas */}
          <div className="lg:col-span-7 space-y-4">
            {sugestoes.length === 0 ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Bot className="size-10 mx-auto text-primary/60" />
                <h3 className="text-sm font-bold text-foreground">Aguardando Briefing de Naming</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Preencha o nicho ao lado ou clique em um dos nichos rápidos para a IA gerar nomes exclusivos com ancoragem semântica real e alta registrabilidade na LPI.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Barra de Filtros e Ações Executivas */}
                <div className="p-3 rounded-2xl border border-border/60 bg-card/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveFilter("all")}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                        activeFilter === "all"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Todas ({sugestoes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter("favoritos")}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                        activeFilter === "favoritos"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Star className="size-3.5 fill-current" />
                      <span>Favoritas ({favoritos.length})</span>
                    </button>
                  </div>
                </div>

                {/* Lista de Cards de Nomes Gerados */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredSugestoes.map((sug, idx) => {
                    const favorited = isFavorito(sug.nome);
                    const isVariationLoading = variationLoadingFor === sug.nome;

                    return (
                      <div
                        key={idx}
                        className={`group p-5 rounded-2xl border transition-all space-y-3.5 bg-card/80 shadow-md ${
                          favorited ? "border-amber-500/40 bg-amber-500/[0.02]" : "border-border/70 hover:border-primary/50"
                        }`}
                      >
                        {/* Header do Card */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <h4 className="text-lg font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                                {sug.nome}
                              </h4>
                              <span className="font-mono text-[9px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                                {sug.estilo}
                              </span>
                              <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <ShieldCheck className="size-3" /> Score LPI: {sug.distintividadeScore}%
                              </span>
                            </div>
                            {sug.slogan && (
                              <p className="text-xs text-amber-500 font-medium italic">
                                "{sug.slogan}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Botão Favoritar */}
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => toggleFavorito(sug)}
                              className={`size-8 rounded-lg ${favorited ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground"}`}
                              title={favorited ? "Remover dos Favoritos" : "Favoritar Marca"}
                            >
                              <Star className={`size-4 ${favorited ? "fill-amber-500" : ""}`} />
                            </Button>

                            {/* Botão Copiar Nome */}
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => copyToClipboard(sug.nome, idx)}
                              className="size-8 rounded-lg"
                              title="Copiar Nome"
                            >
                              {copiedIndex === idx ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                            </Button>
                          </div>
                        </div>

                        {/* Racional Estratégico */}
                        <div className="p-3 rounded-xl bg-background/50 border border-border/40 space-y-1">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold flex items-center gap-1">
                            <Lightbulb className="size-3 text-primary" /> Racional Criativo & Etimologia:
                          </span>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            {sug.racional}
                          </p>
                        </div>

                        {/* Análise Jurídica LPI & Paleta Recomendada */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Análise Jurídica LPI */}
                          <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1">
                            <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold flex items-center gap-1">
                              <Scale className="size-3" /> Parecer LPI (Art. 124):
                            </span>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              {sug.analiseJuridicaLPI || "Nome com forte distintividade intrínseca e baixo risco de indeferimento."}
                            </p>
                          </div>

                          {/* Paleta & Símbolo Recomendados */}
                          <div className="p-3 rounded-xl bg-background/40 border border-border/40 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold flex items-center gap-1">
                                <Palette className="size-3 text-amber-500" /> Paleta Sugerida:
                              </span>
                              <span className="text-[10px] font-medium text-foreground/80">
                                {sug.paletaRecomendada?.nome || "Dark Luxury"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {sug.paletaRecomendada?.cores?.map((hex, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="size-5 rounded-full border border-white/20 shadow-sm flex items-center justify-center text-[8px] font-mono font-bold"
                                  style={{ backgroundColor: hex }}
                                  title={hex}
                                />
                              ))}
                              <span className="text-[10px] text-muted-foreground font-mono truncate pl-1">
                                {sug.simboloSugerido || "Escudo de autoridade geométrica"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Sugestões de Domínios Oficiais */}
                        {sug.sugestoesDominio && sug.sugestoesDominio.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[10px] font-mono text-muted-foreground font-bold flex items-center gap-1">
                              <Globe className="size-3 text-primary" /> Domínios:
                            </span>
                            {sug.sugestoesDominio.map((dom, dIdx) => (
                              <button
                                key={dIdx}
                                type="button"
                                onClick={() => {
                                  setDomainInput(dom.split(".")[0]);
                                  setActiveSubTab("domains");
                                }}
                                className="text-[10px] font-mono bg-muted/60 hover:bg-primary/20 text-foreground px-2 py-0.5 rounded-md border border-border/50 transition-colors flex items-center gap-1"
                                title="Checar este domínio na aba de domínios"
                              >
                                <span>{dom}</span>
                                <ExternalLink className="size-2.5 opacity-60" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Pontos Fortes */}
                        {sug.pontosFortes?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {sug.pontosFortes.map((pt, pIdx) => (
                              <span
                                key={pIdx}
                                className="text-[10px] bg-muted/80 text-foreground/80 px-2 py-0.5 rounded-md border border-border/40 font-mono"
                              >
                                &bull; {pt}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Botões de Ação Imediata & Integrações */}
                        <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                            {sug.classeSugerida || "Classe Nice Sugerida"}
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Botão Variações Deste Nome */}
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              disabled={isVariationLoading}
                              onClick={() => handleGenerateNames(undefined, sug.nome)}
                              className="text-[11px] h-7 px-2.5 gap-1.5 font-medium border-border/70 bg-card/40 hover:bg-card hover:text-foreground text-muted-foreground rounded-lg transition-all"
                              title="Gerar 3 variações inteligentes mantendo a raiz deste nome"
                            >
                              {isVariationLoading ? (
                                <>
                                  <Loader2 className="size-3 animate-spin" />
                                  <span>Desdobrando...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="size-3 opacity-80" />
                                  <span>+ Variações</span>
                                </>
                              )}
                            </Button>

                            {/* Botão Simulador de Aplicação / Mockup */}
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              onClick={() => setSelectedMockupBrand(sug)}
                              className="text-[11px] h-7 px-2.5 gap-1.5 font-medium border-border/70 bg-card/40 hover:bg-card hover:text-foreground text-muted-foreground rounded-lg transition-all"
                            >
                              <Eye className="size-3 opacity-80" />
                              <span>Simular Mockup</span>
                            </Button>

                            {/* Botão Copiar Pitch */}
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              onClick={() => handleCopyPitch(sug, idx)}
                              className="text-[11px] h-7 px-2.5 gap-1.5 font-medium border-border/70 bg-card/40 hover:bg-card hover:text-foreground text-muted-foreground rounded-lg transition-all"
                              title="Copiar briefing completo formatado para WhatsApp/Proposta"
                            >
                              {copiedPitchIndex === idx ? (
                                <>
                                  <Check className="size-3 text-emerald-400" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="size-3 opacity-80" />
                                  <span>Copiar Pitch</span>
                                </>
                              )}
                            </Button>

                            {/* Botão Radar INPI */}
                            <Button
                              type="button"
                              size="xs"
                              variant="outline"
                              onClick={() => {
                                if (onVerifyTrademark) {
                                  const match = sug.classeSugerida?.match(/\d+/);
                                  onVerifyTrademark(sug.nome, match ? match[0] : undefined);
                                }
                              }}
                              className="text-[11px] h-7 px-2.5 gap-1.5 font-semibold border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all"
                            >
                              <Search className="size-3" />
                              <span>Verificar no INPI</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── MODAL INTERATIVO DE SIMULADOR DE MOCKUPS ── */}
      {selectedMockupBrand && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-950 border border-border/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header do Modal */}
            <div className="p-4 px-6 border-b border-border/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-cyan-400" />
                  <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                    Simulador de Aplicação de Marca: {selectedMockupBrand.nome}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Visualização em ambientes corporativos e digitais de alto luxo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMockupBrand(null)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Abas de Tipos de Mockup */}
            <div className="flex items-center gap-2 p-3 px-6 bg-zinc-900/60 border-b border-border/40">
              <button
                type="button"
                onClick={() => setMockupTab("facade")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  mockupTab === "facade" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                🏢 Letreiro 3D / Fachada
              </button>
              <button
                type="button"
                onClick={() => setMockupTab("card")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  mockupTab === "card" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                💳 Cartão Executivo Gold
              </button>
              <button
                type="button"
                onClick={() => setMockupTab("app")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  mockupTab === "app" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                📱 App Icon & Favicon
              </button>
              <button
                type="button"
                onClick={() => setMockupTab("stationery")}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  mockupTab === "stationery" ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                📄 Papelaria & Assinatura
              </button>
            </div>

            {/* Conteúdo do Mockup Renderizado em CSS Ultra-Refinado */}
            <div className="p-8 flex-1 overflow-y-auto flex items-center justify-center bg-zinc-950/80">
              {/* 1. FACHADA / LETREIRO 3D LUXURY */}
              {mockupTab === "facade" && (
                <div className="w-full max-w-md aspect-[16/10] rounded-2xl bg-gradient-to-b from-zinc-900 via-black to-zinc-950 border border-zinc-800 p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                  <div className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)] uppercase">
                    {selectedMockupBrand.nome}
                  </div>
                  {selectedMockupBrand.slogan && (
                    <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase mt-2 font-bold">
                      {selectedMockupBrand.slogan}
                    </div>
                  )}
                  <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-4">
                    &bull; SEDE CORPORATIVA &bull;
                  </div>
                </div>
              )}

              {/* 2. CARTÃO DE VISITA EXECUTIVO BLACK & GOLD */}
              {mockupTab === "card" && (
                <div className="w-full max-w-md aspect-[1.75/1] rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/30 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 uppercase tracking-wider">
                        {selectedMockupBrand.nome}
                      </div>
                      <div className="text-[10px] text-zinc-400 italic">
                        "{selectedMockupBrand.slogan || 'Autoridade & Exclusividade'}"
                      </div>
                    </div>
                    <div className="size-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500 text-xs">
                      {selectedMockupBrand.nome.charAt(0)}
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 flex justify-between items-end text-[10px] font-mono text-zinc-400">
                    <div>
                      <div className="font-bold text-zinc-200">DR. FELIPE DUTRA GOMES</div>
                      <div>Diretoria Executiva</div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-500/90">{selectedMockupBrand.nome.toLowerCase().replace(/\s+/g, '')}.com.br</div>
                      <div>contato@{selectedMockupBrand.nome.toLowerCase().replace(/\s+/g, '')}.com.br</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. APP ICON & FAVICON */}
              {mockupTab === "app" && (
                <div className="flex items-center justify-center gap-8">
                  {/* App Icon iOS */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="size-24 rounded-3xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 border border-amber-500/40 shadow-2xl flex flex-col items-center justify-center p-3 relative group">
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600">
                        {selectedMockupBrand.nome.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="text-[8px] font-mono text-amber-500/80 font-bold tracking-tighter uppercase mt-0.5">
                        APP
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-foreground font-mono">{selectedMockupBrand.nome}</span>
                  </div>

                  {/* Favicon Browser Tab Preview */}
                  <div className="w-48 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 space-y-1.5 shadow-lg">
                    <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                      <div className="size-4 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-[9px] font-black">
                        {selectedMockupBrand.nome.charAt(0)}
                      </div>
                      <span className="text-[10px] text-zinc-300 font-bold truncate">
                        {selectedMockupBrand.nome} &bull; Portal
                      </span>
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 truncate px-1">
                      https://{selectedMockupBrand.nome.toLowerCase().replace(/\s+/g, '')}.com.br
                    </div>
                  </div>
                </div>
              )}

              {/* 4. PAPELARIA & ASSINATURA */}
              {mockupTab === "stationery" && (
                <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs font-mono">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <div className="font-extrabold text-sm text-foreground uppercase tracking-wider">
                      {selectedMockupBrand.nome}
                    </div>
                    <span className="text-[10px] text-amber-500 font-bold">NCL {selectedMockupBrand.classeSugerida}</span>
                  </div>
                  <div className="space-y-1 text-zinc-400 text-[11px]">
                    <p>Prezado cliente,</p>
                    <p className="leading-relaxed">
                      Apresentamos o relatório estratégico de concessão e governança marcária referente à marca <strong className="text-zinc-200">{selectedMockupBrand.nome}</strong>.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between">
                    <span>Protocolo INPI: Em conformidade</span>
                    <span>MarcaShield Naming AI</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer do Modal com Ações */}
            <div className="p-4 px-6 border-t border-border/40 flex items-center justify-between bg-zinc-900/40">
              <span className="text-xs font-mono text-muted-foreground">
                Score LPI: <strong className="text-emerald-500">{selectedMockupBrand.distintividadeScore}%</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="xs"
                  onClick={() => setSelectedMockupBrand(null)}
                  className="text-xs font-bold bg-primary text-primary-foreground"
                >
                  Concluído
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-ABA 2: ESTÚDIO DE LOGOMARCAS & VETORIZAÇÃO ── */}
      {activeSubTab === "logos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Formulário de Criação da Logo */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Palette className="size-4 text-amber-500" />
                    <span>Estúdio de Logomarcas & Vetorização IA</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    SVG & PNG Transparente
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Crie logotipos profissionais escaláveis em vetor (SVG) com fundo transparente e pronta para registro no INPI.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <form onSubmit={handleGenerateLogo} className="space-y-4">
                  {logoError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span>{logoError}</span>
                    </div>
                  )}

                  {/* Nome da Marca & Segmento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Nome da Marca *</Label>
                      <Input
                        placeholder="Ex: DG Advocacia, MarcaShield..."
                        value={logoMarca}
                        onChange={(e) => setLogoMarca(e.target.value)}
                        className="text-xs h-9 bg-card/80 font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Segmento / Ramo</Label>
                      <Input
                        placeholder="Ex: Advocacia, FinTech, IA..."
                        value={logoSegmento}
                        onChange={(e) => setLogoSegmento(e.target.value)}
                        className="text-xs h-9 bg-card/80"
                      />
                    </div>
                  </div>

                  {/* Estilo Visual */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Estilo Visual da Logomarca</Label>
                    <select
                      value={logoEstilo}
                      onChange={(e) => setLogoEstilo(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-card/80 px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Minimalista & Luxo (Dark Luxury)">Minimalista & Luxo (Dark Occult Luxury & Ouro)</option>
                      <option value="Monograma Heraldico & Brasão">Monograma Heraldico Nobre & Brasão de Autoridade</option>
                      <option value="Geométrico Moderno & 3D">Geométrico Moderno (Linhas Puras & Isometria)</option>
                      <option value="Tech Futurista & Linhas Dinâmicas">Tech Futurista & Redes Neurais</option>
                      <option value="Tipográfico & Flat Vector">Tipográfico & Flat Vector Editorial</option>
                    </select>
                  </div>

                  {/* Cores da Marca: 2 Color Pickers Interativos */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-foreground">Cores da Identidade Visual</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Cor Primária */}
                      <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border/70 bg-card/80">
                        <input
                          type="color"
                          value={corPrimaria}
                          onChange={(e) => setCorPrimaria(e.target.value)}
                          className="size-8 rounded-lg cursor-pointer border-0 bg-transparent p-0 shrink-0"
                          title="Selecione a Cor Primária"
                        />
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-foreground block truncate">Cor Primária (Destaque)</span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">{corPrimaria}</span>
                        </div>
                      </div>

                      {/* Cor Secundária */}
                      <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border/70 bg-card/80">
                        <input
                          type="color"
                          value={corSecundaria}
                          onChange={(e) => setCorSecundaria(e.target.value)}
                          className="size-8 rounded-lg cursor-pointer border-0 bg-transparent p-0 shrink-0"
                          title="Selecione a Cor Secundária"
                        />
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-foreground block truncate">Cor Secundária (Apoio)</span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">{corSecundaria}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campo de Instruções Adicionais (Opcional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-foreground">Instruções Personalizadas (Opcional)</Label>
                      <span className="text-[10px] text-muted-foreground font-mono">Direcionamento extra</span>
                    </div>
                    <textarea
                      placeholder="Ex: Quero um símbolo em formato de leão geométrico minimalista, tipografia imponente e traços finos..."
                      value={logoInstrucoes}
                      onChange={(e) => setLogoInstrucoes(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-input bg-card/80 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Opção de Fundo Transparente */}
                  <div className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <span>Fundo 100% Transparente (Alpha)</span>
                        <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.2 rounded-full font-bold">
                          Recomendado
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Gera vetor e imagem isolados sem fundo opaco para aplicação sobre qualquer mídia ou documento.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-3">
                      <input
                        type="checkbox"
                        checked={fundoTransparente}
                        onChange={(e) => setFundoTransparente(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={logoLoading || !logoMarca.trim()}
                    className="w-full text-xs font-bold h-10 gap-2 mt-2 bg-primary text-primary-foreground shadow-md"
                  >
                    {logoLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Sintetizando Vetor & Logomarca com IA...</span>
                      </>
                    ) : (
                      <>
                        <Palette className="size-4" />
                        <span>Gerar Logomarca Vetorial em Alta Definição</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Visualizador da Logo Gerada & Ferramentas de Exportação */}
          <div className="lg:col-span-6 space-y-4">
            {!generatedLogo ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Palette className="size-10 mx-auto text-amber-500/60" />
                <h3 className="text-sm font-bold text-foreground">Nenhuma Logomarca Gerada Ainda</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Configure o nome da marca e selecione a paleta ao lado para renderizar o logotipo vetorial com fundo transparente.
                </p>
              </div>
            ) : (
              <Card className="border border-border/80 bg-card/80 backdrop-blur-md overflow-hidden shadow-2xl rounded-2xl space-y-0">
                {/* Header Elegante e Responsivo */}
                <CardHeader className="p-4 sm:p-5 border-b border-border/50 bg-muted/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <span>Logomarca Vetorial Oficial</span>
                        {generatedLogo.isVector && (
                          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                            Vetor SVG Puro
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Motor: {generatedLogo.model} &bull; Apto para Registro Misto no INPI
                      </CardDescription>
                    </div>
                  </div>

                  {/* Seletor de Cenários / Fundos com abas limpas */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-background/90 p-1.5 rounded-xl border border-border/70">
                    <span className="text-[10px] font-mono text-muted-foreground px-1.5 hidden sm:inline-block">Fundo:</span>
                    <button
                      type="button"
                      onClick={() => setPreviewBg("transparent")}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        previewBg === "transparent"
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      title="Fundo Transparente (Grid)"
                    >
                      <span>Transparente (Alpha)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg("facade")}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        previewBg === "facade"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      title="Fachada 3D Dark Luxury"
                    >
                      <span>🏢 Fachada 3D</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg("card")}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        previewBg === "card"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      title="Cartão Executivo Black & Gold"
                    >
                      <span>💳 Cartão Luxo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg("light")}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        previewBg === "light"
                          ? "bg-white text-zinc-950 font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      title="Fundo Claro"
                    >
                      <span>Claro</span>
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-5">
                  {/* Container do Logotipo com Mockup / Visualizador */}
                  <div
                    className={`w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border/80 flex items-center justify-center p-6 sm:p-10 shadow-2xl transition-all relative ${
                      previewBg === "facade"
                        ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-950 to-black ring-1 ring-amber-500/20"
                        : previewBg === "card"
                        ? "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black ring-1 ring-border"
                        : previewBg === "glass"
                        ? "bg-gradient-to-tr from-zinc-950 via-slate-900 to-zinc-900"
                        : previewBg === "transparent"
                        ? "bg-[linear-gradient(45deg,#18181b_25%,transparent_25%),linear-gradient(-45deg,#18181b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18181b_75%),linear-gradient(-45deg,transparent_75%,#18181b_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-zinc-950"
                        : previewBg === "dark"
                        ? "bg-zinc-950"
                        : "bg-white"
                    }`}
                  >
                    {/* Elementos visuais opcionais */}
                    {previewBg === "facade" && (
                      <>
                        <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.3)_0%,_transparent_70%)] pointer-events-none" />
                        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/80 to-transparent border-t border-white/5 pointer-events-none" />
                      </>
                    )}

                    {previewBg === "card" && (
                      <div className="absolute inset-4 rounded-xl border border-amber-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 shadow-2xl pointer-events-none" />
                    )}

                    {/* Logotipo Renderizado */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center [&>svg]:max-w-[85%] [&>svg]:max-h-[85%] [&>svg]:w-auto [&>svg]:h-auto drop-shadow-2xl">
                      {generatedLogo.svgContent ? (
                        <div
                          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                          dangerouslySetInnerHTML={{ __html: generatedLogo.svgContent }}
                        />
                      ) : (
                        <img
                          src={generatedLogo.imageUrl}
                          alt={`Logomarca ${logoMarca}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>

                  {/* ── BOTÕES DE DOWNLOAD E EXPORTAÇÃO DIRETA ── */}
                  <div className="w-full space-y-3 pt-2 border-t border-border/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <Button
                        type="button"
                        onClick={handleDownloadSvg}
                        className="w-full text-xs font-bold gap-2 bg-primary text-primary-foreground h-11 px-4 shadow-sm cursor-pointer"
                      >
                        <Download className="size-4 shrink-0" />
                        <span>Baixar Vetor SVG Puro (.svg)</span>
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleDownloadPng(true)}
                        variant="outline"
                        className="w-full text-xs font-bold gap-2 border-border/80 bg-card/80 hover:bg-card h-11 px-4 cursor-pointer"
                      >
                        <Download className="size-4 shrink-0" />
                        <span>Baixar PNG Transparente HD</span>
                      </Button>
                    </div>

                    {/* Ferramentas Rápidas Extras */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCopySvgCode}
                        className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5"
                      >
                        {copiedSvg ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                        <span>{copiedSvg ? "Código SVG Copiado!" : "Copiar Código SVG (Figma / Canva)"}</span>
                      </Button>

                      {onVerifyTrademark && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onVerifyTrademark(logoMarca)}
                          className="text-xs text-primary hover:text-primary hover:bg-primary/10 h-8 gap-1.5 font-bold"
                        >
                          <Search className="size-3.5" />
                          <span>Verificar Marca no INPI</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Galeria de Logomarcas Salvas */}
          {savedLogos.length > 0 && (
            <div className="lg:col-span-12 space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <Palette className="size-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-foreground">
                    Minha Galeria de Logomarcas Salvas ({savedLogos.length})
                  </h3>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Salvo automaticamente no navegador
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedLogos.map((item) => (
                  <Card
                    key={item.id}
                    onClick={() => {
                      setLogoMarca(item.marca);
                      setLogoSegmento(item.segmento);
                      setLogoEstilo(item.estilo);
                      setGeneratedLogo({
                        imageUrl: item.imageUrl,
                        svgContent: item.svgContent,
                        isVector: item.isVector,
                        fundoTransparente: item.fundoTransparente,
                        model: "Logomarca Salva",
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group border-border/60 bg-card/60 hover:border-primary/50 transition-all cursor-pointer overflow-hidden flex flex-col"
                  >
                    <div className="w-full aspect-video bg-zinc-950 flex items-center justify-center p-3 relative overflow-hidden border-b border-border/40">
                      {item.svgContent ? (
                        <div
                          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                          dangerouslySetInnerHTML={{ __html: item.svgContent }}
                        />
                      ) : (
                        <img
                          src={item.imageUrl}
                          alt={item.marca}
                          className="w-full h-full object-contain"
                        />
                      )}
                      <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-background/80 backdrop-blur px-1.5 py-0.5 rounded text-muted-foreground">
                        {item.isVector ? "SVG" : "PNG"}
                      </span>
                    </div>

                    <CardContent className="p-3 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {item.marca}
                        </h4>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {item.segmento || item.estilo}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {item.createdAt}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => removeSavedLogo(item.id, e)}
                            className="size-6 inline-flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="Remover da galeria"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SUB-ABA 3: ENQUADRADOR INTELIGENTE DE CLASSES NICE ── */}
      {activeSubTab === "nice" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  <span>Enquadrador de Classes Nice com IA</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Mapeia as 45 classes de Nice e especificações pré-aprovadas pelo INPI.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <form onSubmit={handleClassifyNice} className="space-y-3.5">
                  {niceError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      {niceError}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Descreva as atividades do negócio *</Label>
                    <textarea
                      placeholder="Ex: Fabricamos suplementos esportivos e vendemos no atacado e através de loja virtual própria..."
                      value={niceInput}
                      onChange={(e) => setNiceInput(e.target.value)}
                      className="w-full rounded-md border border-input bg-card/80 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[90px] resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={niceLoading}
                    className="w-full text-xs font-bold h-10 gap-2 bg-primary text-primary-foreground"
                  >
                    {niceLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Consultando Diretrizes do INPI...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="size-4" />
                        <span>Enquadrar Classes de Nice</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {!niceResult ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Layers className="size-10 mx-auto text-primary/60" />
                <h3 className="text-sm font-bold text-foreground">Aguardando Descrição das Atividades</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Descreva os produtos ou serviços ao lado para a IA indicar as classes exatas e especificações para o e-Marcas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Classe Principal */}
                <div className="p-5 rounded-2xl border-2 border-primary/40 bg-card/80 shadow-lg shadow-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                      Classe Principal Recomendada: NCL {niceResult.classePrincipal?.numero}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-500">Prioridade Alta</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{niceResult.classePrincipal?.titulo}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{niceResult.classePrincipal?.justificativa}</p>
                  <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">Especificação Pré-Aprovada INPI:</span>
                    <p className="text-xs text-foreground font-mono">{niceResult.classePrincipal?.especificacaoSugerida}</p>
                  </div>
                </div>

                {/* Classes Secundárias */}
                {niceResult.classesSecundarias?.map((sec: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-muted-foreground uppercase bg-muted px-2.5 py-0.5 rounded-full">
                        Classe Secundária Estratégica: NCL {sec.numero}
                      </span>
                      <span className="text-xs font-mono text-amber-500 font-bold">Blindagem Adicional</span>
                    </div>
                    <h5 className="text-xs font-bold text-foreground">{sec.titulo}</h5>
                    <p className="text-xs text-muted-foreground">{sec.justificativa}</p>
                    <div className="p-2.5 rounded-lg bg-background/40 border border-border/40 text-[11px] font-mono text-foreground">
                      {sec.especificacaoSugerida}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SUB-ABA 4: VERIFICADOR DE DOMÍNIOS & REDES SOCIAIS ── */}
      {activeSubTab === "domains" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  <span>Checador de Domínios & @ Social</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Consulta de disponibilidade no Registro.br, .com e redes sociais.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <form onSubmit={handleCheckDomains} className="space-y-3.5">
                  {domainError && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                      {domainError}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome da Marca para Consulta *</Label>
                    <Input
                      placeholder="Ex: DG Advocacia, MarcaShield, NexaPay..."
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      className="text-xs h-9 bg-card/80 font-mono"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={domainLoading}
                    className="w-full text-xs font-bold h-10 gap-2 bg-primary text-primary-foreground"
                  >
                    {domainLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Consultando Registro.br e DNS...</span>
                      </>
                    ) : (
                      <>
                        <Search className="size-4" />
                        <span>Verificar Domínios e Redes</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {!domainResult ? (
              <div className="p-12 rounded-2xl border-2 border-dashed border-border/70 text-center space-y-3 bg-muted/20">
                <Globe className="size-10 mx-auto text-primary/60" />
                <h3 className="text-sm font-bold text-foreground">Aguardando Nome de Domínio</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Consulte se a marca possui o domínio nacional (.com.br), internacional (.com) e perfis livres.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Domínios Web */}
                <div className="p-5 rounded-2xl border border-border/70 bg-card/70 space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-muted-foreground">
                    Status de Domínios Oficiais
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {domainResult.domains?.map((dom: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="size-4 text-primary" />
                          <span className="font-mono font-bold text-xs text-foreground">{dom.fqdn}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[11px] font-bold ${dom.available ? "text-emerald-500" : "text-amber-500"}`}>
                            {dom.available ? "Disponível para Registro" : "Registrado / Em Uso"}
                          </span>
                          <a
                            href={dom.registrationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20 transition-colors"
                          >
                            Registrar
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="p-5 rounded-2xl border border-border/70 bg-card/70 space-y-3">
                  <div className="text-xs font-mono font-bold uppercase text-muted-foreground">
                    Handles de Redes Sociais
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {domainResult.socials?.map((soc: any, idx: number) => (
                      <a
                        key={idx}
                        href={soc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-colors block text-center space-y-1"
                      >
                        <div className="text-[10px] font-mono text-muted-foreground">{soc.network}</div>
                        <div className="text-xs font-mono font-bold text-primary truncate">{soc.handle}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
