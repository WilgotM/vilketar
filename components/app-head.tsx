import Head from "next/head";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  getAbsoluteUrl,
  getCanonicalUrl,
  SITE_NAME,
} from "../lib/seo";

interface Props {
  canonicalPath?: string;
  description?: string;
  imagePath?: string;
  noindex?: boolean;
  title?: string;
}

export default function AppHead(props: Props) {
  const {
    canonicalPath = "/",
    description = DEFAULT_SEO_DESCRIPTION,
    imagePath = DEFAULT_OG_IMAGE,
    noindex = false,
    title = DEFAULT_SEO_TITLE,
  } = props;
  const canonicalUrl = getCanonicalUrl(canonicalPath);
  const imageUrl = getAbsoluteUrl(imagePath);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: getCanonicalUrl("/"),
    inLanguage: "sv-SE",
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    description,
    image: imageUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "SEK",
    },
  };

  return (
    <Head>
      <title>{title}</title>
      <meta
        name="robots"
        content={noindex ? "noindex,nofollow" : "index,follow"}
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta name="description" content={description} />
      <meta name="application-name" content="VilketÅr" />
      <meta name="apple-mobile-web-app-title" content="VilketÅr" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="sv-SE" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <meta property="og:locale" content="sv_SE" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta
        property="og:image:alt"
        content="VilketÅr - svenskt tidslinjespel"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta
        key="theme-color-light"
        name="theme-color"
        content="#f7efe3"
        media="(prefers-color-scheme: light)"
      />
      <meta
        key="theme-color-dark"
        name="theme-color"
        content="#0c0a09"
        media="(prefers-color-scheme: dark)"
      />
      <meta name="msapplication-TileColor" content="#fffdfa" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <link rel="manifest" href="/manifest.webmanifest?v=20260530" />
      <link
        rel="preload"
        href="/fonts/inter-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/fraunces-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link rel="icon" href="/favicon-32.png?v=20260530" sizes="32x32" />
      <link rel="icon" href="/favicon.svg?v=20260530" type="image/svg+xml" />
      <link
        rel="icon"
        href="/pwa-icon-192.png?v=20260530"
        sizes="192x192"
        type="image/png"
      />
      <link
        rel="icon"
        href="/favicon-light.png?v=20260530"
        media="(prefers-color-scheme: dark)"
        type="image/png"
      />
      <link
        rel="icon"
        href="/favicon-dark.png?v=20260530"
        media="(prefers-color-scheme: light)"
        type="image/png"
      />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260530" />
      <link
        rel="apple-touch-startup-image"
        href="/splash/vilketar-splash-light.png?v=20260530"
        media="(prefers-color-scheme: light) and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/splash/vilketar-splash-dark.png?v=20260530"
        media="(prefers-color-scheme: dark) and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/splash/vilketar-splash-light.png?v=20260530"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/splash/vilketar-splash-dark.png?v=20260530"
        media="(prefers-color-scheme: dark)"
      />
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
