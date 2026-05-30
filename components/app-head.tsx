import Head from "next/head";

interface Props {
  title?: string;
}

export default function AppHead(props: Props) {
  const { title = "VilketÅr" } = props;

  return (
    <Head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <meta
        name="description"
        content="Ett svenskt tidslinjespel byggt på Wikimedia-data."
      />
      <meta name="application-name" content="VilketÅr" />
      <meta name="apple-mobile-web-app-title" content="VilketÅr" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="format-detection" content="telephone=no" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Placera svenska och historiska händelser i rätt år."
      />
      <meta
        name="theme-color"
        content="#f7efe3"
        media="(prefers-color-scheme: light)"
      />
      <meta
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
    </Head>
  );
}
