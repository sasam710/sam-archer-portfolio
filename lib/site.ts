export const PRODUCTION_SITE_URL = "https://sam-archer.vercel.app";

export function resolveSiteUrl(value: string | undefined): string {
  const configured = value?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return PRODUCTION_SITE_URL;
}

export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
