import { Head, Html, Main, NextScript } from "next/document";
import { appThemeClass } from "../styles/theme.css";

const themeInitScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } catch (e) {}
  })();
`;

export default function Document() {
  return (
    <Html className={appThemeClass} lang="sv-SE">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
