// 사이트 절대 URL — sitemap/robots/metadataBase 공통.
// 우선순위: NEXT_PUBLIC_SITE_URL > Vercel preview URL > 프로덕션 기본값.

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "https://dayflow.app";
}
