"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { MarcasClient } from "./marcas/marcas-client";
import { ConsultasClient } from "./consultas/consultas-client";
import { NamingClient } from "./naming/naming-client";
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
    "consultas" | "marcas" | "naming" | "logos" | "nice" | "domains" | "cease_desist" | "plans" | "profile"
  >("consultas");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [injectedQuery, setInjectedQuery] = useState<{ query?: string; processo?: string; classe?: string } | null>(null);

  // User & Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // Listener Global de Teclas de Atalho (Ctrl+K / Cmd+K, Ctrl+N, Ctrl+M, Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setActiveTab("naming");
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        setActiveTab("marcas");
      } else if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        setActiveTab("consultas");
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        setActiveTab("plans");
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

  // Calculadora de Processos B2B (Radar RPI - Base R$ 47 até 3 marcas + adicional)
  const [calcProcessos, setCalcProcessos] = useState<number>(3);

  const getRadarPricing = (qty: number) => {
    const count = Math.max(1, qty);
    if (count <= 3) {
      return { total: 47, unit: 47 / count, isBase: true };
    }
    // A partir da 4ª marca: R$ 47 base (cobre 3 marcas) + R$ 15 por marca extra (com desconto para volumes grandes)
    const extra = count - 3;
    let extraRate = 15;
    if (count > 50) extraRate = 9.90;
    else if (count > 20) extraRate = 12.00;
    
    const total = 47 + Math.round(extra * extraRate);
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

      const userProfile: UserProfile = {
        id: user.id,
        name: data?.name || user.user_metadata?.name || user.email?.split("@")[0] || "Parceiro B2B",
        email: user.email || "",
        company_name: data?.company_name || "",
        marcas_limit: data?.marcas_limit ?? 10,
        marcas_used: data?.marcas_used ?? 0,
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
    <div className="flex flex-col h-full justify-between bg-card/60 backdrop-blur-xl border-r border-border/70">
      <div>
        {/* Sidebar Header */}
        <div className="relative flex h-14 items-center border-b border-border/70 px-3">
          {(sidebarOpen || isDrawer) ? (
            <>
              <div className="flex flex-1 items-center justify-center">
                <Link href="/" className="flex items-center justify-center overflow-hidden transition-transform hover:opacity-95">
                  <SmartDocBrand size="md" />
                </Link>
              </div>

              {!isMobile && !isDrawer && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute right-2 text-muted-foreground hover:text-foreground size-7 rounded-md"
                  title="Recolher menu"
                >
                  <ChevronLeft className="size-4" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              {!isMobile && !isDrawer && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setSidebarOpen(true)}
                  className="text-muted-foreground hover:text-foreground size-8 rounded-md"
                  title="Expandir menu"
                >
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          {/* GRUPO 1: PESQUISAS & TELEMETRIA */}
          {(sidebarOpen || isDrawer) && (
            <div className="px-3 pt-1 pb-1 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              INPI & Vigilância
            </div>
          )}

          <button
            onClick={() => { setActiveTab("consultas"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "consultas"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Consultas INPI"
          >
            <Search className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Consultas INPI</span>}
          </button>

          <button
            onClick={() => { setActiveTab("marcas"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "marcas"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Radar RPI"
          >
            <Shield className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Radar RPI</span>}
          </button>

          {/* GRUPO 2: FERRAMENTAS & ESTÚDIO IA */}
          <div className="my-2 border-t border-border/60" />
          {(sidebarOpen || isDrawer) && (
            <div className="px-3 pt-1 pb-1 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Inteligência & Ativos
            </div>
          )}

          <button
            onClick={() => { setActiveTab("naming"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "naming"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Gerador de Nomes"
          >
            <Lightbulb className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Gerador de Nomes</span>}
          </button>

          <button
            onClick={() => { setActiveTab("logos"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "logos"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Criador de Logos"
          >
            <Palette className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Criador de Logos</span>}
          </button>

          <button
            onClick={() => { setActiveTab("nice"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "nice"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Enquadrador Nice"
          >
            <Layers className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Enquadrador Nice</span>}
          </button>

          <button
            onClick={() => { setActiveTab("domains"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "domains"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Domínios & @"
          >
            <Globe className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Domínios & @</span>}
          </button>

          <button
            onClick={() => { setActiveTab("cease_desist"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "cease_desist"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Notificação Extrajudicial"
          >
            <ShieldAlert className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Notificação Extrajudicial</span>}
          </button>

          {/* GRUPO 3: CONTA & PLANOS */}
          <div className="my-2 border-t border-border/60" />
          {(sidebarOpen || isDrawer) && (
            <div className="px-3 pt-1 pb-1 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Gestão & B2B
            </div>
          )}

          <button
            onClick={() => { setActiveTab("plans"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "plans"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Serviços & Planos"
          >
            <Crown className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Serviços & Planos</span>}
          </button>

          <button
            onClick={() => { setActiveTab("profile"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title="Minha Conta"
          >
            <User className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Minha Conta</span>}
          </button>

          {/* Links Legais */}
          <Link
            href="/termos-de-uso"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            title="Termos de Uso"
          >
            <FileText className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Termos de Uso</span>}
          </Link>

          <Link
            href="/politica-de-privacidade"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            title="Política de Privacidade"
          >
            <Lock className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Privacidade</span>}
          </Link>
        </div>
      </div>

      {/* Sidebar Footer (Profile / Logout) */}
      <div className="p-3 border-t border-border/70 space-y-2">
        {(sidebarOpen || isDrawer) && (
          <div className="p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="size-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-[10px] shrink-0">
                {profile?.name?.charAt(0).toUpperCase() || "D"}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-foreground truncate text-[11px]">{profile?.name}</div>
                <div className="text-[9px] text-muted-foreground truncate">{profile?.email}</div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-6 rounded shrink-0"
              title="Sair"
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* ── Desktop Sidebar ── */}
      {!isMobile && (
        <aside className={`sticky top-0 h-screen shrink-0 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
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

            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground capitalize">
                {activeTab === "consultas" && "Pesquisa de Marcas & Viabilidade (INPI)"}
                {activeTab === "marcas" && "Acompanhamento de Protocolos (Radar RPI)"}
                {activeTab === "naming" && "Gerador Estratégico de Nomes Marcários"}
                {activeTab === "logos" && "Criador de Logomarcas & Identidade Visual"}
                {activeTab === "nice" && "Enquadrador Inteligente de Classes Nice (NCL)"}
                {activeTab === "domains" && "Checador de Domínios (.com.br / .com) & Redes Sociais"}
                {activeTab === "cease_desist" && "Gerador de Notificação Extrajudicial (LPI)"}
                {activeTab === "plans" && "Serviços B2B & Assessoria Jurídica"}
                {activeTab === "profile" && "Configurações da Empresa Parceira"}
              </span>
            </div>
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
                    setActiveTab("consultas");
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
                  <DropdownMenuContent className="w-56" align="end">
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
                    <DropdownMenuItem onClick={() => setActiveTab("naming")} className="text-xs">
                      <Lightbulb className="mr-2 size-3.5" />
                      <span>Gerador de Nomes</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("logos")} className="text-xs">
                      <Palette className="mr-2 size-3.5" />
                      <span>Criador de Logos</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("nice")} className="text-xs">
                      <Layers className="mr-2 size-3.5" />
                      <span>Enquadrador Nice</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("domains")} className="text-xs">
                      <Globe className="mr-2 size-3.5" />
                      <span>Domínios & @</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("cease_desist")} className="text-xs">
                      <ShieldAlert className="mr-2 size-3.5" />
                      <span>Notificação Extrajudicial</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("plans")} className="text-xs">
                      <Crown className="mr-2 size-3.5" />
                      <span>Serviços & Pacotes B2B</span>
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
            <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
              {/* TAB 1: CONSULTAS & IA */}
              {activeTab === "consultas" && (
                <ConsultasClient
                  initialQuery={injectedQuery?.query}
                  initialProcesso={injectedQuery?.processo}
                  initialClasse={injectedQuery?.classe}
                />
              )}

              {/* PÁGINAS DEDICADAS DE FERRAMENTAS INTELIGENTES */}
              {activeTab === "naming" && (
                <NamingClient
                  initialTab="naming"
                  onVerifyTrademark={(marca, classe) => {
                    setInjectedQuery({ query: marca, classe });
                    setActiveTab("consultas");
                  }}
                />
              )}

              {activeTab === "logos" && (
                <NamingClient
                  initialTab="logos"
                  onVerifyTrademark={(marca, classe) => {
                    setInjectedQuery({ query: marca, classe });
                    setActiveTab("consultas");
                  }}
                />
              )}

              {activeTab === "nice" && (
                <NamingClient
                  initialTab="nice"
                  onVerifyTrademark={(marca, classe) => {
                    setInjectedQuery({ query: marca, classe });
                    setActiveTab("consultas");
                  }}
                />
              )}

              {activeTab === "domains" && (
                <NamingClient
                  initialTab="domains"
                  onVerifyTrademark={(marca, classe) => {
                    setInjectedQuery({ query: marca, classe });
                    setActiveTab("consultas");
                  }}
                />
              )}

              {activeTab === "cease_desist" && (
                <NamingClient
                  initialTab="cease_desist"
                  onVerifyTrademark={(marca, classe) => {
                    setInjectedQuery({ query: marca, classe });
                    setActiveTab("consultas");
                  }}
                />
              )}

          {/* TAB 2: RADAR INPI */}
          {activeTab === "marcas" && (
            <div className="space-y-6">
              <div className="border-b border-border/60 pb-4">
                <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Acompanhamento de Protocolos & Carteira</span>
                  <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-normal">
                    Radar RPI Automático
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cadastre o número do protocolo do pedido para que a DG Advocacia monitore despachos, prazos e atue no backend jurídico.
                </p>
              </div>
              <MarcasClient />
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
                  <div className="text-xs font-mono bg-muted border border-border/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    Limite Atual: <span className="font-bold text-primary">{profile?.marcas_limit || 10}</span> processos
                  </div>
                </div>
              </div>

              {/* ── CALCULADORA DINÂMICA DE CARTEIRA (RADAR RPI) ── */}
              <div className="rounded-2xl border-2 border-primary/30 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                        Radar RPI Automático
                      </span>
                      <span className="text-xs text-primary font-bold font-mono">
                        Recorrência Mensal
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      Calculadora de Monitoramento da Carteira
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Vigilância ativa semanal na Revista da Propriedade Industrial (RPI) contra cópias e colidências.
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
                        onClick={() => setCalcProcessos((prev) => Math.max(1, prev - 1))}
                        disabled={calcProcessos <= 1}
                        className="size-8 rounded-lg border-border"
                      >
                        <Minus className="size-3.5" />
                      </Button>

                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={calcProcessos}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setCalcProcessos(isNaN(val) ? 1 : Math.max(1, Math.min(1000, val)));
                          }}
                          className="w-20 h-8 text-center text-sm font-bold font-mono bg-background border border-primary/30 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
                    min="1"
                    max="100"
                    step="1"
                    value={calcProcessos}
                    onChange={(e) => setCalcProcessos(Number(e.target.value))}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span><strong>Monitoramento de {calcProcessos} {calcProcessos === 1 ? "marca" : "marcas"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Alertas automáticos no Telegram</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Consultas e Raio-X IA Ilimitados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      <span>Controle de vigência decenal e prazos</span>
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
                    className="w-full sm:w-auto text-xs font-bold h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  >
                    <span>Contratar Radar para {calcProcessos} {calcProcessos === 1 ? "Marca" : "Marcas"} (R$ {calcTotalPrice})</span>
                  </Button>
                </div>
              </div>

              {/* ── SERVIÇOS JURÍDICOS SOB DEMANDA (BACKEND B2B) ── */}
              <div className="space-y-4">
                <div className="border-b border-border/60 pb-2">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Scale className="size-4 text-primary" />
                    <span>Serviços Jurídicos Avulsos (Sob Demanda)</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Contrate a atuação técnica da banca da DG Advocacia para atos específicos dos seus clientes no INPI.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Protocolo de Registro */}
                  <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md font-bold">Depósito INPI</span>
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground">Taxa Única</span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">R$ 490</span>
                        <span className="text-xs text-muted-foreground font-medium">/processo</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        Protocolo completo do pedido com qualificação formal, enquadramento de classes e especificação.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Parecer de Viabilidade IA + Humano</li>
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Peticionamento no e-Marcas</li>
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Acompanhamento do exame formal</li>
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleOpenPixModal({
                        id: "deposito_inpi",
                        name: "Depósito de Marca no INPI",
                        price: 490.00,
                        description: "DG Advocacia - Assessoria Completa para Depósito de Marca no INPI",
                      })}
                      className="mt-5 w-full text-xs h-9 border-border font-bold hover:bg-muted/80 gap-1.5"
                    >
                      <Crown className="size-3.5 text-muted-foreground" />
                      <span>Contratar Depósito (Pix)</span>
                    </Button>
                  </div>

                  {/* 2. Oposição & Manifestação */}
                  <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase border border-border px-2 py-0.5 rounded-md font-bold">Defesa LPI</span>
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground">Peça Técnica</span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">R$ 690</span>
                        <span className="text-xs text-muted-foreground font-medium">/peça</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        Elaboração de Oposição contra marcas colidentes ou Manifestação a Oposição sofrida.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Fundamentação no Art. 124 da LPI</li>
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Assinatura por advogado habilitado</li>
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Protocolo dentro do prazo de 60 dias</li>
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleOpenPixModal({
                        id: "oposicao_manifestacao",
                        name: "Oposição / Manifestação Marcária",
                        price: 690.00,
                        description: "DG Advocacia - Elaboração de Oposição ou Manifestação no INPI",
                      })}
                      className="mt-5 w-full text-xs h-9 border-border font-bold hover:bg-muted/80 gap-1.5"
                    >
                      <ShieldCheck className="size-3.5 text-muted-foreground" />
                      <span>Contratar Defesa (Pix)</span>
                    </Button>
                  </div>

                  {/* 3. Recurso contra Indeferimento */}
                  <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase border border-border px-2 py-0.5 rounded-md font-bold">2ª Instância</span>
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground">Recurso</span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">R$ 890</span>
                        <span className="text-xs text-muted-foreground font-medium">/recurso</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        Peça recursal técnica ao Presidente do INPI para reverter decisão de indeferimento de marca.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Análise das razões do indeferimento</li>
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Jurisprudência consolidada do INPI</li>
                        <li className="flex items-center gap-1.5"><Check className="size-3 text-primary shrink-0" /> Peticionamento tempestivo (60 dias)</li>
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleOpenPixModal({
                        id: "recurso_inpi",
                        name: "Recurso ao Presidente do INPI",
                        price: 890.00,
                        description: "DG Advocacia - Recurso Administrativo contra Indeferimento no INPI",
                      })}
                      className="mt-5 w-full text-xs h-9 border-border font-bold hover:bg-muted/80 gap-1.5"
                    >
                      <Scale className="size-3.5 text-muted-foreground" />
                      <span>Contratar Recurso (Pix)</span>
                    </Button>
                  </div>
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
                    <CardHeader className="pb-3 border-b border-border/40">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <User className="size-4 text-primary" />
                        Dados do Titular
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Suas informações oficiais de contato e qualificação.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
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
                    <CardHeader className="pb-3 border-b border-border/40">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <KeyRound className="size-4 text-primary" />
                        Alteração de Senha
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Defina uma senha forte para proteção do seu painel.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
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
            setActiveTab("consultas");
          }}
          onSearchMarca={(termo) => {
            setInjectedQuery({ query: termo });
            setActiveTab("consultas");
          }}
        />

        {/* ── CHAT FLUTUANTE COM IA & TOOL CALLING INPI ── */}
        <FloatingAiChat />
      </div>
    );
  }
