export const SITE_NAME = "VilketÅr";
export const DEFAULT_SITE_URL = "https://xn--vilketr-jxa.se";
export const DEFAULT_SEO_TITLE = "VilketÅr - svenskt tidslinjespel";
export const DEFAULT_SEO_DESCRIPTION =
  "Spela VilketÅr, ett svenskt tidslinjespel där du placerar välkända händelser, personer, musik, sport och klassiker i rätt år.";
export const DEFAULT_OG_IMAGE = "/og-image.png";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_SITE_URL;
  }

  return configuredUrl.replace(/\/+$/, "");
}

export function getCanonicalUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function getAbsoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return getCanonicalUrl(path);
}
