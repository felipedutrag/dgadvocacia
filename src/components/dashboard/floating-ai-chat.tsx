"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Search,
  Shield,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Minimize2,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolUsed?: {
    name: string;
    args: any;
    result: any;
  };
  time: string;
};

export function FloatingAiChat() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou a Dra. Sofia, consultora de IA da DG Advocacia. Posso pesquisar marcas no INPI em tempo real, analisar processos pelo número e calcular riscos de colidência. Como posso ajudar?",
      time: "Agora"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, newMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/inpi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao consultar IA");

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          toolUsed: data.toolUsed,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Desculpe, ocorreu uma instabilidade: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão Flutuante (Canto Inferior Direito) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-4 py-3 rounded-full shadow-2xl transition-all transform hover:scale-105"
        >
          <Bot className="size-5" />
          <span>Consultoria IA (INPI)</span>
        </button>
      )}

      {/* Janela do Chat Flutuante */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-card border border-border/80 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col transition-all overflow-hidden animate-slide-up ${
            expanded ? "w-[90vw] sm:w-[600px] h-[80vh]" : "w-[90vw] sm:w-[400px] h-[520px]"
          }`}
        >
          {/* Header do Chat */}
          <div className="flex items-center justify-between p-3.5 border-b border-border/60 bg-muted/40">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Bot className="size-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span>Dra. Sofia &bull; IA INPI</span>
                  <span className="size-2 rounded-full bg-emerald-500 inline-block"></span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">DG Advocacia &bull; LPI 9.279/96</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setExpanded((prev) => !prev)}
                className="size-7 text-muted-foreground hover:text-foreground"
                title={expanded ? "Reduzir" : "Expandir"}
              >
                {expanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setOpen(false)}
                className="size-7 text-muted-foreground hover:text-foreground"
                title="Fechar"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Bot className="size-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                      : "bg-muted/60 border border-border/60 text-foreground rounded-tl-none space-y-2"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>

                  {/* Badge de Tool Function Acionada */}
                  {m.toolUsed && (
                    <div className="mt-2 p-2 rounded-lg bg-background/80 border border-border/60 text-[10px] font-mono space-y-1">
                      <div className="flex items-center gap-1.5 text-primary font-bold">
                        <Search className="size-3" />
                        <span>Base Oficial do INPI Consultada</span>
                      </div>
                      <div className="text-muted-foreground truncate">
                        Função: {m.toolUsed.name}({JSON.stringify(m.toolUsed.args)})
                      </div>
                    </div>
                  )}

                  <span className={`block text-[9px] font-mono mt-1 ${m.role === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground"}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-muted-foreground animate-pulse">
                <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Bot className="size-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span>Consultando INPI e analisando LPI...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões Rápidas de Prompt */}
          {messages.length <= 2 && (
            <div className="px-3 py-1 flex items-center gap-1.5 overflow-x-auto border-t border-border/40 bg-muted/20">
              <button
                onClick={() => setInput("Pesquise a marca 'NEXUS' na classe 35")}
                className="text-[10px] font-mono whitespace-nowrap bg-background border border-border px-2 py-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                Pesquisar marca NEXUS
              </button>
              <button
                onClick={() => setInput("Como funciona o prazo de 60 dias de oposição?")}
                className="text-[10px] font-mono whitespace-nowrap bg-background border border-border px-2 py-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                Prazo de 60 dias
              </button>
            </div>
          )}

          {/* Formulário de Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border/60 bg-muted/30 flex gap-2">
            <Input
              placeholder="Pergunte sobre uma marca, processo ou artigo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="text-xs h-9 bg-card"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon-xs"
              className="size-9 shrink-0 bg-primary text-primary-foreground font-bold"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
