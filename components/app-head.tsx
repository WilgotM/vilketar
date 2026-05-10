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
        name="description"
        content="Ett svenskt tidslinjespel byggt på Wikimedia-data."
      />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Placera svenska och historiska händelser i rätt år."
      />
      <meta name="theme-color" content="#f7efe3" />
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
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
    </Head>
  );
}
