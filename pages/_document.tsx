import { Head, Html, Main, NextScript } from "next/document";
import { appThemeClass } from "../styles/theme.css";

export default function Document() {
  return (
    <Html className={appThemeClass}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
