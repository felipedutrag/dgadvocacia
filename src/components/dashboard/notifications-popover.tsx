"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type DashboardNotification = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "prazo" | "despacho" | "sucesso" | "info";
  tempo: string;
  lida: boolean;
  processoNumero?: string;
};

interface NotificationsPopoverProps {
  onSelectProcesso?: (numero: string) => void;
  onNavigateTab?: (tab: "consultas" | "marcas" | "naming" | "plans") => void;
}

export function NotificationsPopover({ onSelectProcesso, onNavigateTab }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<DashboardNotification[]>([
    {
      id: "1",
      titulo: "Publicação RPI 2825 Disponível",
      descricao: "A nova Revista da Propriedade Industrial foi sincronizada. 0 colidências detectadas.",
      tipo: "sucesso",
      tempo: "Hoje, 09:30",
      lida: false,
    },
    {
      id: "2",
      titulo: "Controle de Prazo de Oposição",
      descricao: "Processo Nº 934812345 está no 42º dia do prazo legal de 60 dias (Art. 158 LPI).",
      tipo: "prazo",
      tempo: "Há 2 dias",
      lida: false,
      processoNumero: "934812345",
    },
    {
      id: "3",
      titulo: "Radar RPI Ativo",
      descricao: "Todas as marcas da sua carteira estão com telemetria e vigilância contínua ativadas.",
      tipo: "info",
      tempo: "Há 3 dias",
      lida: true,
    },
  ]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.lida).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setOpen((prev) => !prev)}
        className="relative size-8 rounded-lg text-muted-foreground hover:text-foreground"
        title="Central de Notificações"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border/80 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-border/60 bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Atualizações dos Processos</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono font-bold bg-primary text-primary-foreground px-1.5 py-0.2 rounded-full">
                  {unreadCount} novas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-primary hover:underline font-semibold"
              >
                Marcar lidas
              </button>
            )}
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
                <Inbox className="size-8 mx-auto opacity-40" />
                <p>Nenhuma notificação recente.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.processoNumero && onSelectProcesso) {
                      onSelectProcesso(notif.processoNumero);
                      setOpen(false);
                    }
                  }}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-muted/50 ${
                    !notif.lida ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {notif.tipo === "prazo" && (
                      <div className="size-6 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                        <Clock className="size-3.5" />
                      </div>
                    )}
                    {notif.tipo === "sucesso" && (
                      <div className="size-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="size-3.5" />
                      </div>
                    )}
                    {notif.tipo === "despacho" && (
                      <div className="size-6 rounded-md bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                        <AlertTriangle className="size-3.5" />
                      </div>
                    )}
                    {notif.tipo === "info" && (
                      <div className="size-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                        <ShieldCheck className="size-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${!notif.lida ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                        {notif.titulo}
                      </p>
                      <span className="text-[9px] font-mono text-muted-foreground">{notif.tempo}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {notif.descricao}
                    </p>
                    {notif.processoNumero && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-mono text-primary font-semibold pt-0.5">
                        <span>Ver Processo {notif.processoNumero}</span>
                        <ChevronRight className="size-3" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-muted/40 border-t border-border/60 text-center">
            <button
              onClick={() => {
                if (onNavigateTab) onNavigateTab("marcas");
                setOpen(false);
              }}
              className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Acessar Radar INPI Completo</span>
              <ChevronRight className="size-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
