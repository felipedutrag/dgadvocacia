import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type QuotaFeature = "naming" | "nice" | "domain";

export interface QuotaCheckResult {
  allowed: boolean;
  isPaid: boolean;
  usedCount: number;
  userId?: string;
  error?: string;
}

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, plan_status, marcas_limit")
      .eq("id", user.id)
      .maybeSingle();

    const userMeta = user.user_metadata || {};
    const isPaid = Boolean(
      (profile?.plan && profile.plan !== "free" && !profile.plan.toLowerCase().includes("gratuito") && profile.plan_status === "active") ||
      userMeta.plan_status === "active"
    );

    // Usuário pago tem acesso ilimitado
    if (isPaid) {
      return {
        allowed: true,
        isPaid: true,
        usedCount: 0,
        userId: user.id
      };
    }

    // Usuário gratuito: limite de 1 uso
    const usageKey = `usage_${feature}`;
    const usedCount = Number(userMeta[usageKey] || 0);

    if (usedCount >= 1) {
      const featureNames: Record<QuotaFeature, string> = {
        naming: "Gerador de Marcas com IA",
        nice: "Enquadrador de Classes Nice",
        domain: "Consulta de Domínios"
      };
      return {
        allowed: false,
        isPaid: false,
        usedCount,
        userId: user.id,
        error: `Você atingiu o limite gratuito de 1 uso do ${featureNames[feature]}. Assine um dos nossos planos para desbloquear o uso ilimitado.`
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
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (!user) return;

    const userMeta = user.user_metadata || {};
    const usageKey = `usage_${feature}`;
    const currentUsage = Number(userMeta[usageKey] || 0);

    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...userMeta,
        [usageKey]: currentUsage + 1
      }
    });
  } catch (e) {
    console.warn(`[QUOTA] Falha ao incrementar ${feature} para ${userId}:`, e);
  }
}
