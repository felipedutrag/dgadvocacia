import React from "react";

export function SmartDocLogo({ className = "size-4", ...props }: { className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span className={`font-serif font-bold text-primary tracking-wider ${className}`} {...(props as any)}>
      DG
    </span>
  );
}

interface SmartDocBrandProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  badge?: string;
  className?: string;
  showIcon?: boolean;
}

export function SmartDocBrand({ size = "md", badge, className = "", showIcon = false }: SmartDocBrandProps) {
  const dgTextSize =
    size === "xs"
      ? "text-[11px]"
      : size === "sm"
      ? "text-sm"
      : size === "lg"
      ? "text-xl sm:text-2xl"
      : size === "xl"
      ? "text-3xl"
      : "text-base sm:text-lg";

  const advocaciaTextSize =
    size === "xs"
      ? "text-[7px]"
      : size === "sm"
      ? "text-[8px]"
      : size === "lg"
      ? "text-[11px] sm:text-xs"
      : size === "xl"
      ? "text-sm sm:text-base"
      : "text-[9px] sm:text-[10px]";

  const dividerHeight =
    size === "xs"
      ? "h-2.5"
      : size === "sm"
      ? "h-3"
      : size === "lg"
      ? "h-4.5 sm:h-5"
      : size === "xl"
      ? "h-7 sm:h-8"
      : "h-3.5 sm:h-4";

  const badgeSize =
    size === "sm"
      ? "text-[8px] px-1.5 py-0.2"
      : size === "xl"
      ? "text-[10px] px-2.5 py-0.5"
      : "text-[9px] px-1.5 py-0.5";

  return (
    <div className={`inline-flex items-center gap-2 shrink-0 select-none ${className}`}>
      <div className="flex items-center gap-2 leading-none">
        {/* "DG" na cor primária do tema com proporção elegante */}
        <span
          className={`font-serif font-bold ${dgTextSize} tracking-normal text-primary drop-shadow-xs`}
          style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
        >
          DG
        </span>

        {/* Divisor vertical refinado */}
        <div className={`w-[1px] ${dividerHeight} bg-primary/40 dark:bg-primary/30`} />

        {/* "ADVOCACIA" com espaçamento largo moderno */}
        <span className={`font-sans font-medium ${advocaciaTextSize} tracking-[0.24em] text-foreground/80 dark:text-[#94a3b8] uppercase`}>
          ADVOCACIA
        </span>
      </div>

      {badge && (
        <span className={`ml-1 rounded-full border border-primary/30 bg-primary/10 font-mono font-bold text-primary uppercase tracking-widest ${badgeSize}`}>
          {badge}
        </span>
      )}
    </div>
  );
}
