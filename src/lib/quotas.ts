import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type QuotaFeature = "naming" | "nice" | "domain" | "search" | "processo" | "figura";

export interface QuotaCheckResult {
  allowed: boolean;
  isPaid: boolean;
  usedCount: number;
  userId?: string;
  error?: string;
}

const FEATURE_LABELS: Record<QuotaFeature, string> = {
  naming: "Gerador de Marcas com IA",
  nice: "Enquadrador de Classes Nice",
  domain: "Consulta de Domínios",
  search: "Pesquisa de Anterioridade de Marcas no INPI",
  processo: "Raio-X de Processos do INPI",
  figura: "Pesquisa Figurativa de Viena (CFE)",
};

export async function checkFeatureQuota(feature: QuotaFeature): Promise<QuotaCheckResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Se o usuário não estiver autenticado, exige login
    if (!user) {
      return {
        allowed: false,
        isPaid: false,
        usedCount: 0,
        error: "Faça login na plataforma para utilizar as ferramentas de inteligência marcária."
      };
    }

    const supabaseAdmin = createAdminClient();

    // Busca dados atualizados da tabela profiles diretamente via admin
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("plan, plan_status, is_admin, usage_naming, usage_nice, usage_domain, usage_search, usage_processo, usage_figura")
      .eq("id", user.id)
      .maybeSingle();

    // A tabela PROFILES é a única e soberana fonte da verdade
    const isAdmin = Boolean(profile?.is_admin);
    const plan = (profile?.plan || "").toLowerCase();
    const planStatus = (profile?.plan_status || "").toLowerCase();

    const isPaid = Boolean(
      isAdmin ||
      (plan && plan !== "free" && !plan.includes("gratuito") && planStatus === "active")
    );

    if (isPaid || isAdmin) {
      return {
        allowed: true,
        isPaid: true,
        usedCount: 0,
        userId: user.id
      };
    }

    // Usuário gratuito: limite de 1 uso lendo direto da tabela profiles
    const usageKey = `usage_${feature}` as keyof typeof profile;
    const usedCount = profile ? Number(profile[usageKey] || 0) : 0;

    if (usedCount >= 1) {
      return {
        allowed: false,
        isPaid: false,
        usedCount,
        userId: user.id,
        error: `Você atingiu o limite gratuito de 1 uso de ${FEATURE_LABELS[feature]}. Para continuar utilizando de forma ilimitada,`
      };
    }

    return {
      allowed: true,
      isPaid: false,
      usedCount,
      userId: user.id
    };
  } catch (e: any) {
    console.error(`[QUOTA] Erro ao checar quota para ${feature}:`, e);
    return { allowed: true, isPaid: false, usedCount: 0 };
  }
}

export async function incrementFeatureQuota(feature: QuotaFeature, userId?: string) {
  if (!userId) return;
  try {
    const supabaseAdmin = createAdminClient();
    const usageKey = `usage_${feature}`;

    // 1. Atualiza na tabela profiles
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("usage_naming, usage_nice, usage_domain, usage_search, usage_processo, usage_figura")
      .eq("id", userId)
      .maybeSingle();

    const currentTableUsage = profile ? Number(profile[usageKey as keyof typeof profile] || 0) : 0;
    const newUsage = currentTableUsage + 1;

    await supabaseAdmin
      .from("profiles")
      .update({ [usageKey]: newUsage })
      .eq("id", userId);
  } catch (e) {
    console.warn(`[QUOTA] Falha ao incrementar ${feature} para ${userId}:`, e);
  }
}
