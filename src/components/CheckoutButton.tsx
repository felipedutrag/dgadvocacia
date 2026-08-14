"use client";

import React, { useState } from "react";

interface CheckoutButtonProps {
  className?: string;
  label?: string;
}

export default function CheckoutButton({ 
  className = "w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-wider text-[#0B0F19] gold-gradient hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer",
  label = "Registrar Marca - R$ 9,90"
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const redirectUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/?status=sucesso`
        : "";

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: "dgadvocacia",
          redirect_url: redirectUrl,
          items: [
            {
              quantity: 1,
              price: 990, // R$ 9,90 in cents
              description: "Registro de Marca - Serviço"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar o link de checkout. Tente novamente.");
      }

      const data = await response.json();
      
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout inválida retornada pela API.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocorreu um erro ao processar o pagamento.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full sm:w-auto">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${className} ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0B0F19]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processando...
          </span>
        ) : (
          label
        )}
      </button>
      {error && (
        <span className="text-red-400 text-xs mt-2 text-center max-w-xs">
          {error}
        </span>
      )}
    </div>
  );
}
