"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { MarcasClient } from "./marcas/marcas-client";
import { ConsultasClient } from "./consultas/consultas-client";
import { NamingClient } from "./naming/naming-client";
import { ConsultoriaClient } from "./consultoria/consultoria-client";
import { ComplianceClient } from "./compliance/compliance-client";
import { InovacaoClient } from "./inovacao/inovacao-client";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { NotificationsPopover } from "@/components/dashboard/notifications-popover";
import { FloatingAiChat } from "@/components/dashboard/floating-ai-chat";
import {
  Search,
  Clock,
  CheckCircle2,
  Trash2,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Radio,
  ShieldCheck,
  Sun,
  Moon,
  User,
  KeyRound,
  Mail,
  Shield,
  FileText,
  Lock,
  Menu,
  Crown,
  Check,
  Briefcase,
  AlertCircle,
  Bell,
  ExternalLink,
  Copy,
  CheckCheck,
  QrCode,
  Loader2,
  Zap,
  Lightbulb,
  Layers,
  Scale,
  Palette,
  Globe,
  Building2,
  Rocket,
  ShieldAlert,
  Minus,
  Plus,
  Command,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { SmartDocLogo, SmartDocBrand } from "@/components/brand-logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  marcas_limit?: number;
  marcas_used?: number;
  consultorias_creditos?: number;
  is_admin?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const isMobileRaw = useIsBreakpoint("max", 900);
  const isMobile = isMobileRaw ?? false;

  // Layout & Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
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
    | "inovacao"
  >("marcas");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [injectedQuery, setInjectedQuery] = useState<{ query?: string; processo?: string; classe?: string } | null>(null);

  // User & Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // Listener Global de Teclas de Atalho (Ctrl+K, Ctrl+M, Ctrl+B, Ctrl+P, Ctrl+F, Ctrl+N, Ctrl+L, Ctrl+I, Ctrl+D, Ctrl+E, Ctrl+T, Ctrl+G, Ctrl+U, Ctrl+O)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      const key = e.key.toLowerCase();

      if (key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (key === "m") {
        e.preventDefault();
        setActiveTab("marcas");
      } else if (key === "b") {
        e.preventDefault();
        setActiveTab("consultas-nome");
      } else if (key === "p") {
        e.preventDefault();
        setActiveTab("consultas-processo");
      } else if (key === "f") {
        e.preventDefault();
        setActiveTab("consultas-figura");
      } else if (key === "n") {
        e.preventDefault();
        setActiveTab("naming");
      } else if (key === "l") {
        e.preventDefault();
        setActiveTab("logos");
      } else if (key === "i") {
        e.preventDefault();
        setActiveTab("nice");
      } else if (key === "d") {
        e.preventDefault();
        setActiveTab("domains");
      } else if (key === "e") {
        e.preventDefault();
        setActiveTab("consultoria");
      } else if (key === "t") {
        e.preventDefault();
        setActiveTab("inovacao");
      } else if (key === "g") {
        e.preventDefault();
        setActiveTab("compliance");
      } else if (key === "u") {
        e.preventDefault();
        setActiveTab("plans");
      } else if (key === "o") {
        e.preventDefault();
        setActiveTab("profile");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Profile Edit State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Edit State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passSaving, setPassSaving] = useState(false);

  // Pix Payment State
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number; description: string } | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixData, setPixData] = useState<{ id: string; pixCode: string; pixQrCode: string; externalId: string } | null>(null);
  const [pixError, setPixError] = useState<string | null>(null);
  const [pixSuccess, setPixSuccess] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Calculadora de Processos B2B (Radar RPI - Base R$ 97 até 3 marcas + adicional)
  const [calcProcessos, setCalcProcessos] = useState<number>(3);

  const getRadarPricing = (qty: number) => {
    const count = Math.max(1, qty);
    if (count <= 3) {
      return { total: 97, unit: 97 / count, isBase: true };
    }
    // A partir da 4ª marca: R$ 97 base (cobre 3 marcas) + R$ 20 por marca extra (com desconto para volumes grandes)
    const extra = count - 3;
    let extraRate = 20;
    if (count > 50) extraRate = 12.00;
    else if (count > 20) extraRate = 15.00;
    
    const total = 97 + Math.round(extra * extraRate);
    return { total, unit: total / count, isBase: false };
  };

  const { total: calcTotalPrice, unit: calcUnitPrice } = getRadarPricing(calcProcessos);

  // Toast de Pagamento
  const [paymentToast, setPaymentToast] = useState<{ show: boolean; title: string; message: string; planName?: string; time?: string } | null>(null);

  // Dark Mode Toggle
  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fetch Profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao carregar perfil:", error);
      }

      // Conta a quantidade real de marcas cadastradas pelo usuário
      const { count: marcasCount } = await supabase
        .from("marcas_monitoradas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const userProfile: UserProfile = {
        id: user.id,
        name: data?.name || user.user_metadata?.name || user.email?.split("@")[0] || "Parceiro B2B",
        email: user.email || "",
        company_name: data?.company_name || "",
        marcas_limit: data?.marcas_limit ?? 1,
        marcas_used: marcasCount ?? data?.marcas_used ?? 0,
        consultorias_creditos: data?.consultorias_creditos ?? 5,
        is_admin: data?.is_admin ?? false,
      };

      setProfile(userProfile);
      setEditName(userProfile.name);
      setEditEmail(userProfile.email);
    } catch (err) {
      console.error("Erro geral no dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Realtime Pix Payment Listener
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel(`user-payments-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "payments",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.status === "paid") {
            setPixSuccess(true);
            setPixLoading(false);
            setPaymentToast({
              show: true,
              title: "Pagamento Confirmado!",
              message: `O serviço ${payload.new.plan_name || "adquirido"} foi ativado com sucesso.`,
              planName: payload.new.plan_name,
              time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            });
            fetchProfile();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, supabase, fetchProfile]);

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    try {
      if (!profile?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: profile.id,
          name: editName.trim(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { name: editName.trim() },
      });

      setProfile(prev => prev ? { ...prev, name: editName.trim() } : null);
      setProfileMsg({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Erro ao salvar perfil" });
    } finally {
      setProfileSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaving(true);
    setPassMsg(null);

    try {
      if (newPassword.length < 6) {
        throw new Error("A nova senha deve ter no mínimo 6 caracteres");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      setPassMsg({ type: "success", text: "Senha alterada com sucesso!" });
    } catch (err: any) {
      setPassMsg({ type: "error", text: err.message || "Erro ao alterar senha" });
    } finally {
      setPassSaving(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Open Pix Checkout Modal
  const handleOpenPixModal = async (plan: { id: string; name: string; price: number; description: string }) => {
    setSelectedPlan(plan);
    setIsPixModalOpen(true);
    setPixLoading(true);
    setPixError(null);
    setPixData(null);
    setPixSuccess(false);
    setCopiedPix(false);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          description: plan.description,
          customerName: profile?.name || "Cliente DG Advocacia",
          customerEmail: profile?.email || "",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Falha ao gerar Pix");
      }

      setPixData({
        id: data.id,
        pixCode: data.pixCode,
        pixQrCode: data.pixQrCode,
        externalId: data.externalId,
      });
    } catch (err: any) {
      setPixError(err.message || "Erro ao conectar com gateway de pagamentos");
    } finally {
      setPixLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixData?.pixCode) return;
    navigator.clipboard.writeText(pixData.pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Sidebar Component
  const renderSidebarNavigation = (isDrawer = false) => (
    <div className="flex flex-col h-full justify-between bg-card/60 backdrop-blur-xl border-r border-border/70 overflow-hidden select-none font-sans">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Sidebar Header - Perfeitamente alinhado com o h-14 do Navbar */}
        <div className="relative flex h-14 shrink-0 items-center justify-between border-b border-border/70 px-3">
          {(sidebarOpen || isDrawer) ? (
            <>
              {/* Logomarca Oficial Centralizada */}
              <div className="flex flex-1 items-center justify-center min-w-0">
                <Link
                  href="/"
                  className="flex items-center justify-center transition-all hover:opacity-90 group"
                >
                  <SmartDocBrand size="md" />
                </Link>
              </div>

              {/* Quick Actions (Search & Collapse) */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setCommandPaletteOpen(true)}
                  className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                  title="Buscar ou comandos (Ctrl+K)"
                >
                  <Search className="size-3.5" />
                </button>

                {!isMobile && !isDrawer && (
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                    title="Recolher menu"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              {!isMobile && !isDrawer && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="size-8.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary flex items-center justify-center transition-all cursor-pointer shadow-xs group"
                  title="Expandir menu lateral"
                >
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Linear Navigation Menu with Indented Sub-items */}
        <div className="p-2 space-y-3 flex-1">
          {/* GRUPO 1: CONSULTAS & VIGILÂNCIA */}
          <div className="space-y-0.5">
            {(sidebarOpen || isDrawer) && (
              <div className="px-2 pt-1 pb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/80 tracking-tight">
                <span>Consultas & Vigilância</span>
                <ChevronDown className="size-2.5 opacity-60" />
              </div>
            )}

            <button
              onClick={() => { setActiveTab("marcas"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "marcas"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Vigilância de Marcas (RPI)"
            >
              <Shield className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && (
                <div className="flex items-center justify-between flex-1">
                  <span>Vigilância RPI</span>
                  <span className="size-1.5 rounded-full bg-emerald-400"></span>
                </div>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("consultas-nome"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                (activeTab === "consultas-nome" || activeTab === "consultas")
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Pesquisar Marca no INPI"
            >
              <Search className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Pesquisar Marca</span>}
            </button>

            <button
              onClick={() => { setActiveTab("consultas-processo"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "consultas-processo"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Consultar Processo"
            >
              <FileText className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Consultar Processo</span>}
            </button>

            <button
              onClick={() => { setActiveTab("consultas-figura"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "consultas-figura"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Elementos Figurativos (Viena)"
            >
              <Layers className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Elementos Figurativos</span>}
            </button>
          </div>

          {/* GRUPO 2: FERRAMENTAS & IA */}
          <div className="space-y-0.5">
            {(sidebarOpen || isDrawer) && (
              <div className="px-2 pt-1 pb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/80 tracking-tight">
                <span>Ferramentas & IA</span>
                <ChevronDown className="size-2.5 opacity-60" />
              </div>
            )}

            <button
              onClick={() => { setActiveTab("nice"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "nice"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Enquadrador Nice"
            >
              <Layers className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Enquadrador Nice</span>}
            </button>

            <button
              onClick={() => { setActiveTab("naming"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "naming"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Gerador de Marcas"
            >
              <Lightbulb className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Gerador de Marcas</span>}
            </button>

            <button
              onClick={() => { setActiveTab("domains"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "domains"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Domínios & @"
            >
              <Globe className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Domínios & @</span>}
            </button>
          </div>

          {/* GRUPO 3: ASSESSORIA & B2B */}
          <div className="space-y-0.5">
            {(sidebarOpen || isDrawer) && (
              <div className="px-2 pt-1 pb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/80 tracking-tight">
                <span>Assessoria & B2B</span>
                <ChevronDown className="size-2.5 opacity-60" />
              </div>
            )}

            <button
              onClick={() => { setActiveTab("consultoria"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "consultoria"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Consultoria Empresarial"
            >
              <Building2 className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Consultoria Empresarial</span>}
            </button>

            <button
              onClick={() => { setActiveTab("inovacao"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "inovacao"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Patentes & Startups Tech"
            >
              <Rocket className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Patentes & Startups</span>}
            </button>

            <button
              onClick={() => { setActiveTab("compliance"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "compliance"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Compliance & LGPD"
            >
              <ShieldCheck className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Compliance & LGPD</span>}
            </button>
          </div>

          {/* GRUPO 4: GESTÃO & CONTA */}
          <div className="space-y-0.5">
            {(sidebarOpen || isDrawer) && (
              <div className="px-2 pt-1 pb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/80 tracking-tight">
                <span>Gestão</span>
                <ChevronDown className="size-2.5 opacity-60" />
              </div>
            )}

            <button
              onClick={() => { setActiveTab("plans"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`group flex items-center justify-between py-1.75 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "plans"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-foreground/90 bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:text-primary"
              }`}
              title="Proteção de Marcas"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Crown className={`size-3.5 shrink-0 transition-colors ${activeTab === "plans" ? "text-primary-foreground" : "text-primary"}`} />
                {(sidebarOpen || isDrawer) && <span className="font-semibold truncate">Proteção de Marcas</span>}
              </div>
              {(sidebarOpen || isDrawer) && (
                <ChevronRight className={`size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${activeTab === "plans" ? "text-primary-foreground/80" : "text-primary/70 group-hover:text-primary"}`} />
              )}
            </button>

            <button
              onClick={() => { setActiveTab("profile"); if (isDrawer) setMobileDrawerOpen(false); }}
              className={`flex items-center gap-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                (sidebarOpen || isDrawer) ? "ml-2.5 w-[calc(100%-10px)] px-2.5" : "w-full justify-center px-2"
              } ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
              title="Minha Conta"
            >
              <User className="size-3.5 shrink-0 opacity-90" />
              {(sidebarOpen || isDrawer) && <span>Minha Conta</span>}
            </button>
          </div>
        </div>

        {/* LINEAR PROMO / TELEMETRY CARD (Bottom Feature Widget) */}
        {(sidebarOpen || isDrawer) && (
          <div
            onClick={() => { setActiveTab("plans"); if (isDrawer) setMobileDrawerOpen(false); }}
            className="m-2 p-3 rounded-xl bg-card/90 border border-primary/25 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer group shadow-sm backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-primary font-bold flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Radar INPI</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary flex items-center gap-0.5 transition-colors">
                <span>Planos</span>
                <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
              <span>Assessoria & Telemetria</span>
              <ArrowRight className="size-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-[10.5px] text-muted-foreground leading-tight mt-1">
              Varredura de colidências na RPI ativa.
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Row */}
      {sidebarOpen ? (
        <div className="p-2.5 border-t border-border/70 bg-card/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-7 border border-border shrink-0 rounded-lg">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-lg">
                {profile?.name?.charAt(0).toUpperCase() || "D"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold truncate text-foreground leading-tight">
                {profile?.name || "DG Parceiro"}
              </div>
              <div className="text-[9.5px] text-muted-foreground truncate leading-tight">
                {profile?.email}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive size-7 rounded-md"
            title="Sair"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div className="p-2 border-t border-border/70 flex flex-col items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive size-8 rounded-md"
            title="Sair"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <aside className={`sticky top-0 h-screen shrink-0 transition-all duration-300 ${sidebarOpen ? "w-60" : "w-14"}`}>
          {renderSidebarNavigation(false)}
        </aside>
      )}

      {/* ── Main Layout Body ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
                <SheetTrigger
                  render={
                    <Button variant="ghost" size="icon-xs" className="size-8 rounded-lg">
                      <Menu className="size-4" />
                    </Button>
                  }
                />
                <SheetContent side="left" className="p-0 w-64">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navegação</SheetTitle>
                  </SheetHeader>
                  {renderSidebarNavigation(true)}
                </SheetContent>
              </Sheet>
            )}
          </div>

            <div className="flex items-center gap-2">
                {/* Botão de Busca Rápida / Command Palette */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCommandPaletteOpen(true)}
                  className="hidden md:flex items-center gap-2.5 text-xs text-muted-foreground border-border/70 bg-card/60 h-8 pl-2.5 pr-1.5 rounded-lg hover:text-foreground"
                >
                  <Search className="size-3.5 shrink-0" />
                  <span>Buscar processo ou comando...</span>
                  <div className="flex items-center gap-0.5 font-mono text-[10px] bg-muted border border-border/80 px-1.5 py-0.5 rounded text-muted-foreground ml-1">
                    <span>⌘</span>
                    <span className="text-[9px] text-muted-foreground/80">+</span>
                    <span>K</span>
                  </div>
                </Button>

                {/* Central de Notificações dos Processos */}
                <NotificationsPopover
                  onSelectProcesso={(num) => {
                    setInjectedQuery({ processo: num });
                    setActiveTab("consultas-processo");
                  }}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />

                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={toggleTheme}
                  className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                  title="Alternar Tema"
                >
                  {isDark ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4" />}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" className="relative size-8 rounded-full p-0">
                        <Avatar className="size-8 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {profile?.name?.charAt(0).toUpperCase() || "D"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-xs font-bold leading-none">{profile?.name}</p>
                        <p className="text-[11px] leading-none text-muted-foreground">{profile?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab("profile")} className="text-xs">
                      <User className="mr-2 size-3.5" />
                      <span>Minha Conta</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("consultas-nome")} className="text-xs">
                      <Search className="mr-2 size-3.5" />
                      <span>Pesquisar Marca no INPI</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("consultas-processo")} className="text-xs">
                      <FileText className="mr-2 size-3.5" />
                      <span>Consultar Processo</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("consultas-figura")} className="text-xs">
                      <Layers className="mr-2 size-3.5" />
                      <span>Elementos Figurativos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("nice")} className="text-xs">
                      <Layers className="mr-2 size-3.5" />
                      <span>Enquadrador Nice</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("naming")} className="text-xs">
                      <Lightbulb className="mr-2 size-3.5" />
                      <span>Gerador de Marcas</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("domains")} className="text-xs">
                      <Globe className="mr-2 size-3.5" />
                      <span>Domínios & @</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("plans")} className="text-xs">
                      <Crown className="mr-2 size-3.5" />
                      <span>Proteção de Marcas</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-xs text-destructive focus:text-destructive">
                      <LogOut className="mr-2 size-3.5" />
                      <span>Encerrar Sessão</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* ── Main Dashboard Content ── */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
              {/* TAB 1: CONSULTAS INPI & TELEMETRIA */}
              {(activeTab === "consultas-nome" || activeTab === "consultas-processo" || activeTab === "consultas-figura" || activeTab === "consultas") && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-border/60 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          <span>
                            {activeTab === "consultas-processo"
                              ? "Consultar Processo"
                              : activeTab === "consultas-figura"
                              ? "Elementos Figurativos"
                              : "Pesquisar Marca no INPI"}
                          </span>
                          <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                            {activeTab === "consultas-processo"
                              ? "Telemetria em Tempo Real"
                              : activeTab === "consultas-figura"
                              ? "Classificação de Viena (CFE)"
                              : "Base Oficial INPI"}
                          </span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activeTab === "consultas-processo"
                            ? "Consulte despachos, prazos legais, titularidade e eventos oficiais de qualquer processo no INPI."
                            : activeTab === "consultas-figura"
                            ? "Consulte códigos de Viena e logotipos com elementos gráficos cadastrados no INPI."
                            : "Pesquise marcas idênticas ou semelhantes em todas as classes Nice e verifique a viabilidade de registro."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ConsultasClient
                    initialQuery={injectedQuery?.query}
                    initialProcesso={injectedQuery?.processo}
                    initialClasse={injectedQuery?.classe}
                    initialSubTab={
                      activeTab === "consultas-processo"
                        ? "processo"
                        : activeTab === "consultas-figura"
                        ? "figura"
                        : "marca"
                    }
                    onSubTabChange={(subTab) => {
                      if (subTab === "processo") setActiveTab("consultas-processo");
                      else if (subTab === "figura") setActiveTab("consultas-figura");
                      else setActiveTab("consultas-nome");
                    }}
                  />
                </div>
              )}

              {/* PÁGINAS DEDICADAS DE FERRAMENTAS INTELIGENTES (PRESERVAÇÃO TOTAL EM MEMÓRIA) */}
              <div
                className={
                  activeTab === "naming" ||
                  activeTab === "logos" ||
                  activeTab === "nice" ||
                  activeTab === "domains"
                    ? "space-y-6 animate-fade-in"
                    : "hidden"
                }
              >
                <div className="border-b border-border/60 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <span>
                          {activeTab === "logos"
                            ? "Estúdio de Logomarcas & Vetorização"
                            : activeTab === "nice"
                            ? "Enquadrador de Classes Nice com IA"
                            : activeTab === "domains"
                            ? "Domínios & Redes Sociais"
                            : "Gerador de Marcas com IA"}
                        </span>
                        <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                          {activeTab === "logos"
                            ? "Vetor SVG & PNG Transparente"
                            : activeTab === "nice"
                            ? "45 Classes LPI"
                            : activeTab === "domains"
                            ? "Disponibilidade Digital"
                            : "Inteligência Estratégica LPI"}
                        </span>
                      </h1>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activeTab === "logos"
                          ? "Crie logomarcas profissionais escaláveis em vetor com paletas nobres e fundo transparente prontas para depósito."
                          : activeTab === "nice"
                          ? "Mapeamento inteligente de classes de produtos e serviços e especificações pré-aprovadas pelo INPI."
                          : activeTab === "domains"
                          ? "Verifique a disponibilidade imediata da sua marca em domínios nacionais (.com.br), internacionais (.com) e redes sociais."
                          : "Crie marcas comerciais exclusivas de alto impacto com análise etimológica, score de distintividade e conformidade com o Art. 124 da LPI."}
                      </p>
                    </div>
                  </div>
                </div>

                <NamingClient
                  initialTab={
                    activeTab === "logos"
                      ? "logos"
                      : activeTab === "nice"
                      ? "nice"
                      : activeTab === "domains"
                      ? "domains"
                      : "naming"
                  }
                  onVerifyTrademark={(marca, classe) => {
                    setInjectedQuery({ query: marca, classe });
                    setActiveTab("consultas-nome");
                  }}
                />
              </div>

              {/* TAB 2: RADAR INPI */}
              {activeTab === "marcas" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-border/60 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          <span>Radar de Colidências & RPI</span>
                          <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                            Monitoramento Ativo
                          </span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Acompanhe despachos semanais da Revista da Propriedade Industrial (RPI) e monitore processos e marcas concorrentes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <MarcasClient />
                </div>
              )}

              {/* TAB: CONSULTORIA EMPRESARIAL */}
              {activeTab === "consultoria" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-border/60 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          <span>Consultoria Empresarial & Governança B2B</span>
                          <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                            Direito Societário & M&A
                          </span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Estruturação de Holdings Patrimoniais Familiares, segregação de riscos operacionais e governança societária.
                        </p>
                      </div>
                    </div>
                  </div>

                  <ConsultoriaClient />
                </div>
              )}

              {/* TAB: COMPLIANCE & LGPD */}
              {activeTab === "compliance" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-border/60 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          <span>Compliance & Adequação Regulatória LGPD</span>
                          <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                            Lei 13.709/2018 & ANPD
                          </span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Raio-X de risco de sanções ANPD, gerador de Políticas de Privacidade oficiais e checklist de conformidade contínua.
                        </p>
                      </div>
                    </div>
                  </div>

                  <ComplianceClient />
                </div>
              )}

              {/* TAB: PATENTES & STARTUPS TECH */}
              {activeTab === "inovacao" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-border/60 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          <span>Patentes & Startups Tech</span>
                          <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                            Inovação & Software INPI
                          </span>
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Proteção de patentes, registro de código-fonte no INPI (Hash SHA-512) e contratos de Vesting para startups.
                        </p>
                      </div>
                    </div>
                  </div>

                  <InovacaoClient />
                </div>
              )}

          {/* TAB 3: SERVIÇOS & PLANOS (CALCULADORA DE PROCESSOS B2B) */}
          {activeTab === "plans" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-border/60 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                      <span>Calculadora de Carteira & Backend Jurídico</span>
                      <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                        Tabela B2B
                      </span>
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monitore a carteira de marcas da sua empresa ou contrate assessoria jurídica sob demanda com honorários exclusivos para parceiros.
                    </p>
                  </div>
                  <div className="text-xs font-mono bg-muted/60 border border-border/70 px-3 py-1.5 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
                    <span className="text-muted-foreground">Monitorando:</span>
                    <span className="font-bold text-foreground">{profile?.marcas_used ?? 0}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-bold text-primary">{profile?.marcas_limit ?? 1}</span>
                    <span className="text-muted-foreground">{(profile?.marcas_limit ?? 1) === 1 ? "marca" : "marcas"}</span>
                  </div>
                </div>
              </div>

              {/* ── CALCULADORA DINÂMICA DE CARTEIRA (RADAR RPI) ── */}
              <div className="rounded-2xl border-2 border-primary/30 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                        Assessoria Integral & Radar RPI
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Proteção Total de Marcas INPI
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-5xl">
                      Assessoria jurídica integral para as marcas cadastradas: você só precisa protocolar o pedido e inserir o número no menu{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("marcas")}
                        className="font-semibold text-primary hover:text-primary/80 transition-colors inline cursor-pointer"
                      >
                        Vigilância RPI
                      </button>
                      . A DG Advocacia assume 100% da condução do processo no INPI — vigilância semanal na RPI contra cópias e colidências, cumprimento de exigências, prazos decenais, manifestação à oposição e defesas administrativas.
                    </p>
                  </div>

                  {/* Preço Calculado */}
                  <div className="flex items-baseline gap-3 bg-background/90 border-2 border-primary/30 p-4 rounded-2xl self-start md:self-auto shadow-sm">
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">Valor do Radar</div>
                      <div className="text-3xl font-extrabold text-foreground tracking-tight flex items-baseline gap-1">
                        <span>R$ {calcTotalPrice.toLocaleString("pt-BR")}</span>
                        <span className="text-xs text-muted-foreground font-normal">/mês</span>
                      </div>
                    </div>
                    {calcProcessos > 3 && (
                      <div className="border-l border-border/60 pl-3">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">Média / Marca</div>
                        <div className="text-sm font-bold text-primary font-mono">
                          R$ {calcUnitPrice.toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controle Interativo: Input Direto + Botões +/- + Slider */}
                <div className="space-y-4 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-mono text-muted-foreground font-medium">
                      Informe ou ajuste a quantidade de marcas:
                    </span>

                    {/* Contador com Botões e Input Direto */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => setCalcProcessos((prev) => Math.max(3, prev - 1))}
                        disabled={calcProcessos <= 3}
                        className="size-8 rounded-lg border-border"
                      >
                        <Minus className="size-3.5" />
                      </Button>

                      <div className="relative">
                        <input
                          type="number"
                          min="3"
                          max="1000"
                          value={calcProcessos}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setCalcProcessos(isNaN(val) ? 3 : Math.max(3, Math.min(1000, val)));
                          }}
                          className="w-20 h-8 text-center text-sm font-bold font-mono bg-background border border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-2 top-2 text-[9px] text-muted-foreground pointer-events-none font-mono">un</span>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => setCalcProcessos((prev) => Math.min(1000, prev + 1))}
                        className="size-8 rounded-lg border-border"
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Slider Horizontal Fluido */}
                  <input
                    type="range"
                    min="3"
                    max="100"
                    step="1"
                    value={calcProcessos}
                    onChange={(e) => setCalcProcessos(Math.max(3, Number(e.target.value)))}
                    className="w-full h-2.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />

                  {/* Atalhos Rápidos */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-muted-foreground">Predefinições:</span>
                    {[3, 5, 10, 20, 50, 100].map((qty) => (
                      <Button
                        key={qty}
                        type="button"
                        variant={calcProcessos === qty ? "default" : "outline"}
                        size="xs"
                        onClick={() => setCalcProcessos(qty)}
                        className="text-[11px] font-mono h-6 px-2.5 rounded-md"
                      >
                        {qty === 3 ? "3 marcas (Base)" : `${qty} marcas`}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Benefícios Inclusos no Radar RPI */}
                <div className="rounded-xl border border-border/70 bg-background/50 p-4 space-y-3">
                  <div className="text-[11px] font-mono uppercase font-bold text-muted-foreground tracking-wider">
                    O que está incluso no seu plano:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-foreground">
                    {/* Fase 1: Concepção */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Gerador de Marcas Ilimitado</span>
                    </div>
                    {/* Fase 2: Atos Oficiais */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Cumprimento de Exigências INPI</span>
                    </div>
                    {/* Fase 3: Viabilidade */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Consultas e Raio-X IA Ilimitados</span>
                    </div>
                    {/* Fase 4: Proteção Ativa */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span><strong>Monitoramento de {calcProcessos} {calcProcessos === 1 ? "marca" : "marcas"}</strong></span>
                    </div>
                    {/* Fase 5: Vigilância */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Varredura Semanal de Toda a RPI</span>
                    </div>
                    {/* Fase 6: Notificações */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Alertas Automáticos no App</span>
                    </div>
                    {/* Fase 7: Governança */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Controle de vigência decenal e prazos</span>
                    </div>
                    {/* Fase 8: Defesa */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Manifestação à Oposição</span>
                    </div>
                    {/* Fase 9: 2ª Instância */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Recurso Administrativo Indeferimento</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Contratação do Plano Calculado */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/50">
                  <div className="text-xs text-muted-foreground">
                    Sem taxa de adesão ou fidelidade &bull; Liberação instantânea via Pix
                  </div>

                  <Button
                    size="lg"
                    onClick={() => handleOpenPixModal({
                      id: `radar_${calcProcessos}_marcas`,
                      name: `Radar RPI Mensal (${calcProcessos} ${calcProcessos === 1 ? "Marca" : "Marcas"})`,
                      price: calcTotalPrice,
                      description: `DG Advocacia - Assinatura Radar RPI para ${calcProcessos} marcas monitoradas`,
                    })}
                    className="group w-full sm:w-auto text-xs font-semibold h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>Contratar Radar para {calcProcessos} {calcProcessos === 1 ? "Marca" : "Marcas"}</span>
                    <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PERFIL & SEGURANÇA */}
          {activeTab === "profile" && (
            <div className="space-y-6 w-full animate-fade-in">
              <div className="border-b border-border/60 pb-4">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Minha Conta & Segurança</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gerencie seus dados cadastrais de titular e credenciais de segurança.
                </p>
              </div>

              {/* Grid 2 Colunas Lado a Lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
                {/* 1. Informações Pessoais / Dados do Titular */}
                <Card className="border-border/70 bg-card/60 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <CardHeader className="pb-3 border-b border-border/60">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <User className="size-4 text-primary" />
                        Dados do Titular
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Suas informações oficiais de contato e qualificação.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <form id="form-profile" onSubmit={handleSaveProfile} className="space-y-4">
                        {profileMsg && (
                          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            profileMsg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold" : "bg-destructive/10 border border-destructive/30 text-destructive"
                          }`}>
                            {profileMsg.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
                            <span>{profileMsg.text}</span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label className="text-xs">Nome Completo</Label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-xs h-9 bg-card/80"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">E-mail Cadastrado</Label>
                          <Input
                            value={editEmail}
                            disabled
                            className="text-xs h-9 bg-muted/40 font-mono opacity-80"
                          />
                        </div>
                      </form>
                    </CardContent>
                  </div>

                  <CardFooter className="pt-2 border-t border-border/40">
                    <Button
                      type="submit"
                      form="form-profile"
                      disabled={profileSaving}
                      className="text-xs font-bold h-9 px-5 w-full sm:w-auto"
                    >
                      {profileSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </CardFooter>
                </Card>

                {/* 2. Alteração de Senha */}
                <Card className="border-border/70 bg-card/60 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <CardHeader className="pb-3 border-b border-border/60">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <KeyRound className="size-4 text-primary" />
                        Alteração de Senha
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Defina uma senha forte para proteção do seu painel.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <form id="form-password" onSubmit={handleChangePassword} className="space-y-4">
                        {passMsg && (
                          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                            passMsg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold" : "bg-destructive/10 border border-destructive/30 text-destructive"
                          }`}>
                            {passMsg.type === "success" ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
                            <span>{passMsg.text}</span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <Label className="text-xs">Nova Senha</Label>
                          <Input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="text-xs h-9 bg-card/80"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs">Confirmar Nova Senha</Label>
                          <Input
                            type="password"
                            placeholder="Repita a nova senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="text-xs h-9 bg-card/80"
                          />
                        </div>
                      </form>
                    </CardContent>
                  </div>

                  <CardFooter className="pt-2 border-t border-border/40">
                    <Button
                      type="submit"
                      form="form-password"
                      disabled={passSaving || !newPassword}
                      className="text-xs font-bold h-9 px-5 w-full sm:w-auto"
                    >
                      {passSaving ? "Atualizando Senha..." : "Atualizar Senha"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── MODAL DE PAGAMENTO PIX INSTANTÂNEO ── */}
      <Dialog open={isPixModalOpen} onOpenChange={setIsPixModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/80 p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <QrCode className="size-5 text-primary" />
              <span>Pagamento Instantâneo via Pix</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedPlan?.name} — R$ {selectedPlan?.price?.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          {pixLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span>Gerando QR Code Pix com o Banco Central...</span>
            </div>
          ) : pixError ? (
            <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs space-y-2">
              <div className="font-bold flex items-center gap-2">
                <AlertCircle className="size-4" />
                <span>Falha ao gerar cobrança</span>
              </div>
              <p>{pixError}</p>
            </div>
          ) : pixSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Pagamento Confirmado!</h3>
              <p className="text-xs text-muted-foreground">
                Seu serviço foi ativado e a assessoria iniciada com sucesso.
              </p>
              <Button onClick={() => setIsPixModalOpen(false)} className="text-xs font-bold mt-2">
                Continuar no Painel
              </Button>
            </div>
          ) : pixData ? (
            <div className="space-y-4">
              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border bg-white text-black shadow-inner">
                {pixData.pixQrCode && (
                  <img
                    src={pixData.pixQrCode.startsWith("data:") ? pixData.pixQrCode : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.pixCode)}`}
                    alt="Pix QR Code"
                    className="size-44 object-contain"
                  />
                )}
                <span className="text-[10px] text-zinc-500 font-mono mt-2">Abra o app do seu banco e escaneie o código</span>
              </div>

              {/* Copia e Cola */}
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Código Pix Copia e Cola:</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={pixData.pixCode}
                    className="text-[11px] font-mono h-9 bg-muted/30"
                  />
                  </div>
                </div>

                <div className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5 pt-1">
                  <Loader2 className="size-3 animate-spin text-primary" />
                  <span>Aguardando confirmação em tempo real...</span>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* ── COMMAND PALETTE GLOBAL (ATALHOS CTRL+K / CTRL+N / CTRL+P) ── */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSearchProcesso={(num) => {
            setInjectedQuery({ processo: num });
            setActiveTab("consultas-processo");
          }}
          onSearchMarca={(termo) => {
            setInjectedQuery({ query: termo });
            setActiveTab("consultas-nome");
          }}
        />

        {/* ── CHAT FLUTUANTE COM IA & TOOL CALLING INPI ── */}
        <FloatingAiChat />
      </div>
    );
  }
