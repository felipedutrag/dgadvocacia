"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { MarcasClient } from "./marcas/marcas-client";
import { ConsultasClient } from "./consultas/consultas-client";
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
  Sparkles,
  Layers,
  X
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { SmartDocLogo, SmartDocBrand } from "@/components/brand-logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  plan?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const isMobileRaw = useIsBreakpoint("max", 900);
  const isMobile = isMobileRaw ?? false;

  // Layout & Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"consultas" | "marcas" | "plans" | "profile">("consultas");

  // User & Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

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
        name: data?.name || user.user_metadata?.name || user.email?.split("@")[0] || "Cliente",
        email: user.email || "",
        plan: data?.plan || "Plano Start",
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
        <div className="flex h-14 items-center justify-between border-b border-border/70 px-4">
          <Link href="/" className="flex items-center overflow-hidden transition-transform hover:opacity-95">
            {(sidebarOpen || isDrawer) ? (
              <SmartDocBrand size="sm" />
            ) : (
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/25 shadow-xs text-primary">
                <SmartDocLogo className="size-4" />
              </div>
            )}
          </Link>

          {!isMobile && !isDrawer && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground size-7 rounded-md"
            >
              {sidebarOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <button
            onClick={() => { setActiveTab("consultas"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "consultas"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Search className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Consultas INPI & IA</span>}
          </button>

          <button
            onClick={() => { setActiveTab("marcas"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "marcas"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Shield className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Radar INPI</span>}
          </button>

          <button
            onClick={() => { setActiveTab("plans"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "plans"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Crown className="size-4 shrink-0 text-amber-500" />
            {(sidebarOpen || isDrawer) && <span>Serviços & Planos</span>}
          </button>

          <button
            onClick={() => { setActiveTab("profile"); if (isDrawer) setMobileDrawerOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <User className="size-4 shrink-0" />
            {(sidebarOpen || isDrawer) && <span>Minha Conta</span>}
          </button>
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
                {activeTab === "consultas" && "Pesquisa de Marcas & IA"}
                {activeTab === "marcas" && "Radar INPI"}
                {activeTab === "plans" && "Serviços & Assessoria INPI"}
                {activeTab === "profile" && "Configurações da Conta"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                <DropdownMenuItem onClick={() => setActiveTab("plans")} className="text-xs">
                  <Crown className="mr-2 size-3.5 text-amber-500" />
                  <span>Serviços & Planos</span>
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
            <ConsultasClient />
          )}

          {/* TAB 2: RADAR INPI */}
          {activeTab === "marcas" && (
            <div className="space-y-6">
              <div className="border-b border-border/60 pb-4">
                <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Radar INPI</span>
                  <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-normal">
                    Automático
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monitoramento contínuo da Revista da Propriedade Industrial (RPI) para as suas marcas.
                </p>
              </div>
              <MarcasClient />
            </div>
          )}

          {/* TAB 3: SERVIÇOS & PLANOS */}
          {activeTab === "plans" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-border/60 pb-4">
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>Serviços de Assessoria Marcária & Blindagem</span>
                  <span className="font-mono text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold">
                    Assessoria Especializada
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Contrate pacotes de acompanhamento, depósitos e defesas jurídicas no INPI com pagamento instantâneo via Pix.
                </p>
              </div>

              {/* Grid de Serviços */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* 1. Radar Mensal */}
                <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase border border-border px-2 py-0.5 rounded-md font-bold">Radar RPI</span>
                      <span className="font-mono text-[10px] font-semibold text-emerald-500">Recorrência Mensal</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground">R$ 47</span>
                      <span className="text-xs text-muted-foreground font-medium">/mês</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Vigilância ativa semanal na Revista da Propriedade Industrial (RPI) contra cópias.
                    </p>

                    <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Monitoramento de até 3 marcas</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Alertas automáticos no Telegram</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Consultas e Raio-X IA Ilimitados</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Controle de vigência decenal</li>
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleOpenPixModal({
                      id: "radar_mensal",
                      name: "Radar INPI Mensal",
                      price: 47.00,
                      description: "DG Advocacia - Assinatura Radar INPI Mensal",
                    })}
                    className="mt-6 w-full text-xs h-10 border-border font-bold hover:bg-muted/80 gap-1.5"
                  >
                    <Zap className="size-3.5 text-primary" />
                    <span>Contratar Radar (Pix)</span>
                  </Button>
                </div>

                {/* 2. Registro Completo de Marca (Destaque) */}
                <div className="relative flex flex-col justify-between rounded-2xl border-2 border-primary bg-card/80 p-5 shadow-xl shadow-primary/5 backdrop-blur-md">
                  <div className="absolute -top-3 right-4 rounded-full bg-primary px-2.5 py-0.5 font-mono text-[9px] font-bold text-primary-foreground uppercase">
                    Mais Procurado
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md font-bold">Depósito INPI</span>
                      <span className="font-mono text-[10px] font-semibold text-emerald-500">Taxa Única</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground">R$ 497</span>
                      <span className="text-xs text-muted-foreground font-medium">/processo</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Protocolo completo do pedido de registro no INPI com assessoria jurídica e enquadramento Nice.
                    </p>

                    <ul className="mt-5 space-y-2 text-xs text-foreground font-medium">
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> <strong>Parecer de Viabilidade IA + Humano</strong></li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Enquadramento de classes e especificação</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Protocolo oficial do pedido no INPI</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Acompanhamento do exame formal</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleOpenPixModal({
                      id: "registro_marca",
                      name: "Registro de Marca no INPI",
                      price: 497.00,
                      description: "DG Advocacia - Assessoria Completa para Registro de Marca no INPI",
                    })}
                    className="mt-6 w-full text-xs h-10 font-bold gap-1.5"
                  >
                    <Crown className="size-3.5" />
                    <span>Contratar Registro (Pix)</span>
                  </Button>
                </div>

                {/* 3. Defesa & Oposição */}
                <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase border border-border px-2 py-0.5 rounded-md font-bold">Jurídico</span>
                      <span className="font-mono text-[10px] font-semibold text-emerald-500">Avulso</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-foreground">R$ 750</span>
                      <span className="text-xs text-muted-foreground font-medium">/peça</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Elaboração de Oposição a marcas colidentes de terceiros ou Defesa contra oposições sofridas.
                    </p>

                    <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Oposição contra imitação de marca</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Manifestação a Oposição sofrida</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Cumprimento de Exigência do INPI</li>
                      <li className="flex items-center gap-2"><Check className="size-3.5 text-primary shrink-0" /> Recurso contra indeferimento (LPI)</li>
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleOpenPixModal({
                      id: "defesa_oposicao",
                      name: "Defesa / Oposição Marcária",
                      price: 750.00,
                      description: "DG Advocacia - Defesa / Oposição em Processo do INPI",
                    })}
                    className="mt-6 w-full text-xs h-10 border-border font-bold hover:bg-muted/80 gap-1.5"
                  >
                    <ShieldCheck className="size-3.5 text-primary" />
                    <span>Contratar Defesa (Pix)</span>
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
                  <Button
                    onClick={handleCopyPix}
                    className="text-xs font-bold h-9 px-4 gap-1.5 shrink-0"
                  >
                    {copiedPix ? <CheckCheck className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    <span>{copiedPix ? "Copiado!" : "Copiar"}</span>
                  </Button>
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
    </div>
  );
}
