import {
  assignVars,
  createGlobalThemeContract,
  globalFontFace,
  globalStyle,
  style,
} from "@vanilla-extract/css";
import {
  breakpointScale,
  durationScale,
  easingScale,
  fontSizeScale,
  fontWeightScale,
  layoutScale,
  lineHeightScale,
  radiusScale,
  spaceScale,
} from "./foundation";

const sharedTokens = {
  duration: durationScale,
  easing: easingScale,
  font: {
    body: '"Inter", "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif',
    display: '"Fraunces", "Iowan Old Style", Georgia, serif',
  },
  fontSize: fontSizeScale,
  fontWeight: fontWeightScale,
  lineHeight: lineHeightScale,
  breakpoint: breakpointScale,
  radius: radiusScale,
  size: layoutScale,
  space: spaceScale,
};

const deepBlueTheme = {
  ...sharedTokens,
  color: {
    accent: "#F5B731",
    accentActive: "#e5a820",
    accentSoft: "rgba(245, 183, 49, 0.15)",
    accentText: "#0f1b36",
    accentTint: "rgba(245, 183, 49, 0.10)",
    backdrop: "#0c1a36",
    backdropStrong: "#0a1428",
    border: "rgba(255, 255, 255, 0.12)",
    borderStrong: "rgba(255, 255, 255, 0.24)",
    chip: "rgba(20, 40, 80, 0.84)",
    chipStrong: "rgba(30, 55, 100, 0.92)",
    danger: "#cb8f84",
    dangerSoft: "rgba(85, 47, 42, 0.84)",
    heroGlowA: "rgba(245, 183, 49, 0.08)",
    heroGlowB: "rgba(68, 130, 200, 0.08)",
    heroGlowC: "rgba(140, 80, 180, 0.06)",
    link: "rgba(255, 255, 255, 0.85)",
    overlay: "rgba(4, 8, 24, 0.72)",
    pillText: "#0f1b36",
    selection: "rgba(245, 183, 49, 0.2)",
    selectionText: "#ffffff",
    statusNeutral: "rgba(200, 210, 230, 0.56)",
    statusCorrectBorder: "#64886a",
    statusCorrectFill: "#7da982",
    statusIncorrectBorder: "#9f6861",
    statusIncorrectFill: "#bf837b",
    success: "#8dbb90",
    successSoft: "rgba(44, 78, 48, 0.88)",
    medalBronzeBorder: "rgba(185, 147, 112, 0.54)",
    medalBronzeFill: "rgba(88, 66, 51, 0.92)",
    medalBronzeText: "rgba(229, 193, 161, 0.94)",
    medalGoldBorder: "rgba(201, 171, 86, 0.58)",
    medalGoldFill: "rgba(88, 76, 36, 0.92)",
    medalGoldText: "rgba(241, 226, 168, 0.96)",
    medalSilverBorder: "rgba(146, 164, 183, 0.52)",
    medalSilverFill: "rgba(58, 69, 82, 0.92)",
    medalSilverText: "rgba(224, 232, 240, 0.94)",
    surface: "rgba(16, 32, 64, 0.76)",
    surfaceChrome: "rgba(20, 40, 76, 0.90)",
    surfaceStrong: "rgba(14, 28, 56, 0.94)",
    text: "#ffffff",
    textMuted: "rgba(200, 210, 230, 0.72)",
    textSubtle: "rgba(200, 210, 230, 0.42)",
    timeline: "rgba(200, 210, 230, 0.18)",
  },
  shadow: {
    card: "0 1rem 2rem rgba(0, 0, 0, 0.36)",
    focus: "0 0 0 0.1875rem rgba(245, 183, 49, 0.24)",
    panel: "0 1.25rem 3rem rgba(0, 0, 0, 0.32)",
  },
};

function createContractShape<T extends Record<string, unknown>>(
  value: T,
): {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? ReturnType<typeof createContractShape<T[K]>>
    : null;
} {
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      typeof entry === "object" && entry !== null
        ? createContractShape(entry as Record<string, unknown>)
        : null,
    ]),
  ) as {
    [K in keyof T]: T[K] extends Record<string, unknown>
      ? ReturnType<typeof createContractShape<T[K]>>
      : null;
  };
}

export const vars = createGlobalThemeContract(
  createContractShape(deepBlueTheme),
  (_value, path) => `wt-${path.join("-")}`,
);

globalFontFace("Inter", {
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400 800",
  src: 'url("/fonts/inter-latin.woff2") format("woff2")',
});

globalFontFace("Fraunces", {
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "700 800",
  src: 'url("/fonts/fraunces-latin.woff2") format("woff2")',
});

export const appThemeClass = style({
  vars: assignVars(vars, deepBlueTheme),
  colorScheme: "dark",
  minHeight: "100%",
});

const pageBackground = `radial-gradient(circle at 20% 20%, rgba(245, 183, 49, 0.06) 0%, transparent 40%), radial-gradient(circle at 80% 15%, rgba(68, 130, 200, 0.06) 0%, transparent 35%), radial-gradient(circle at 50% 90%, rgba(140, 80, 180, 0.04) 0%, transparent 40%), linear-gradient(180deg, #0e1e44 0%, #0c1a36 40%, #0a1428 100%)`;

globalStyle("html", {
  background: pageBackground,
  color: vars.color.text,
  fontSize: "100%",
  minHeight: "100%",
  scrollBehavior: "smooth",
});

globalStyle("body", {
  margin: 0,
  minHeight: "100%",
  background: "transparent",
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontFeatureSettings: '"ss01" 1, "cv03" 1, "cv11" 1',
  fontOpticalSizing: "auto",
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.body,
  overflowX: "hidden",
  textRendering: "optimizeLegibility",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  overscrollBehaviorY: "contain",
});

globalStyle("html, body, #__next", {
  width: "100%",
  minHeight: "100%",
});

globalStyle("#__next", {
  isolation: "isolate",
});

globalStyle("a", {
  color: vars.color.link,
  textDecorationColor: "color-mix(in srgb, currentColor 30%, transparent)",
  textUnderlineOffset: spaceScale.xxs,
  transition: `color ${vars.duration.fast} ${vars.easing.standard}, text-decoration-color ${vars.duration.fast} ${vars.easing.standard}`,
});

globalStyle("a:hover", {
  color: vars.color.link,
  textDecorationColor: "currentColor",
});

globalStyle("button, input, select, textarea", {
  font: "inherit",
});

globalStyle("*", {
  boxSizing: "border-box",
  WebkitTapHighlightColor: "transparent",
});

globalStyle("img", {
  display: "block",
  maxWidth: "100%",
});

globalStyle(".gamePageNoSelect, .gamePageNoSelect *", {
  userSelect: "none",
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
});

globalStyle(".gamePageNoSelect", {
  overflow: "hidden",
});

globalStyle("::selection", {
  backgroundColor: vars.color.selection,
  color: vars.color.selectionText,
});
