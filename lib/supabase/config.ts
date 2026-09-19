export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

export const PRODUCTION_SITE_URL = "https://paw-memory404.vercel.app";

function isConfigured(value: string | undefined, placeholder: string) {
  return Boolean(value && value.trim() && !value.includes(placeholder));
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !isConfigured(url, "your-project-ref") ||
    !isConfigured(publishableKey, "your-publishable-key")
  ) {
    return null;
  }

  return {
    url: url!.replace(/\/$/, ""),
    publishableKey: publishableKey!,
  };
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return configuredUrl === PRODUCTION_SITE_URL ? configuredUrl : null;
}
