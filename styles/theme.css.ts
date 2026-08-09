import {
  assignVars,
  createGlobalThemeContract,
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
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  fontSize: fontSizeScale,
  fontWeight: fontWeightScale,
  lineHeight: lineHeightScale,
  breakpoint: breakpointScale,
  radius: radiusScale,
  size: layoutScale,
  space: spaceScale,
};

const lightTheme = {
  ...sharedTokens,
  color: {
    accent: "#b7791f",
    accentActive: "#996216",
    accentLogo: "#ad701a",
    accentGlow: "rgba(183, 121, 31, 0.16)",
    accentSoft: "rgba(183, 121, 31, 0.08)",
    accentText: "#1e160b",
    accentTint: "rgba(183, 121, 31, 0.04)",
    backdrop: "#f1eee8",
    backdropStrong: "#faf8f3",
    border: "rgba(70, 59, 48, 0.14)",
    borderStrong: "rgba(70, 59, 48, 0.24)",
    chip: "rgba(255, 252, 247, 0.82)",
    chipStrong: "rgba(241, 238, 232, 0.92)",
    danger: "#dc2626",
    dangerSoft: "rgba(220, 38, 38, 0.1)",
    heroGlowA: "rgba(183, 121, 31, 0.045)",
    heroGlowB: "rgba(116, 109, 99, 0.035)",
    heroGlowC: "transparent",
    link: "#242019",
    overlay: "rgba(36, 32, 25, 0.4)",
    pillText: "#1e160b",
    selection: "rgba(183, 121, 31, 0.16)",
    selectionText: "#242019",
    statusNeutral: "rgba(116, 109, 99, 0.06)",
    statusCorrectBorder: "#16a34a",
    statusCorrectFill: "#f0fdf4",
    statusCorrectText: "#14532d",
    statusIncorrectBorder: "#dc2626",
    statusIncorrectFill: "#fef2f2",
    statusIncorrectText: "#7f1d1d",
    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.1)",
    medalBronzeBorder: "#a8715a",
    medalBronzeFill: "#fff7ed",
    medalBronzeText: "#7c2d12",
    medalGoldBorder: "#ca8a04",
    medalGoldFill: "#fefce8",
    medalGoldText: "#854d0e",
    medalSilverBorder: "#a8a29e",
    medalSilverFill: "#f5f5f4",
    medalSilverText: "#44403c",
    surface: "#fbf9f5",
    surfaceChrome: "rgba(251, 249, 245, 0.84)",
    surfaceStrong: "#fffcf7",
    surfaceRaised: "#ffffff",
    text: "#242019",
    textMuted: "#746d63",
    textSubtle: "#c9c2b8",
    timeline: "rgba(70, 59, 48, 0.1)",
  },
  shadow: {
    card: "0 4px 12px rgba(70, 59, 48, 0.1)",
    focus: "0 0 0 2px rgba(183, 121, 31, 0.24)",
    panel: "0 8px 32px rgba(70, 59, 48, 0.14)",
  },
};

const darkTheme = {
  ...sharedTokens,
  color: {
    accent: "#e4ad45",
    accentActive: "#f0c56b",
    accentLogo: "#d59a32",
    accentGlow: "rgba(228, 173, 69, 0.16)",
    accentSoft: "rgba(228, 173, 69, 0.09)",
    accentText: "#1b1409",
    accentTint: "rgba(228, 173, 69, 0.045)",
    backdrop: "#0d0c0a",
    backdropStrong: "#090806",
    border: "rgba(244, 240, 232, 0.1)",
    borderStrong: "rgba(244, 240, 232, 0.2)",
    chip: "rgba(26, 23, 19, 0.84)",
    chipStrong: "rgba(34, 29, 24, 0.92)",
    danger: "#ef4444",
    dangerSoft: "rgba(239, 68, 68, 0.2)",
    heroGlowA: "rgba(228, 173, 69, 0.045)",
    heroGlowB: "rgba(170, 162, 150, 0.025)",
    heroGlowC: "transparent",
    link: "#f4f0e8",
    overlay: "rgba(5, 4, 3, 0.74)",
    pillText: "#1b1409",
    selection: "rgba(228, 173, 69, 0.22)",
    selectionText: "#f4f0e8",
    statusNeutral: "rgba(244, 240, 232, 0.08)",
    statusCorrectBorder: "#22c55e",
    statusCorrectFill: "#065f46",
    statusCorrectText: "#d1fae5",
    statusIncorrectBorder: "#ef4444",
    statusIncorrectFill: "#7f1d1d",
    statusIncorrectText: "#fee2e2",
    success: "#22c55e",
    successSoft: "rgba(34, 197, 94, 0.2)",
    medalBronzeBorder: "#a8715a",
    medalBronzeFill: "#2d1a12",
    medalBronzeText: "#fdba74",
    medalGoldBorder: "#eab308",
    medalGoldFill: "#422006",
    medalGoldText: "#fef08a",
    medalSilverBorder: "#d6d3d1",
    medalSilverFill: "#292524",
    medalSilverText: "#fafaf9",
    surface: "#15120f",
    surfaceChrome: "rgba(21, 18, 15, 0.86)",
    surfaceStrong: "#1a1713",
    surfaceRaised: "#221d18",
    text: "#f4f0e8",
    textMuted: "#aaa296",
    textSubtle: "#6c645a",
    timeline: "rgba(244, 240, 232, 0.12)",
  },
  shadow: {
    card: "0 4px 12px rgba(3, 2, 1, 0.36)",
    focus: "0 0 0 2px rgba(228, 173, 69, 0.3)",
    panel: "0 8px 32px rgba(3, 2, 1, 0.54)",
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
  createContractShape(lightTheme),
  (_value, path) => `wt-${path.join("-")}`,
);

export const appThemeClass = style({
  vars: assignVars(vars, darkTheme),
  colorScheme: "dark",
  minHeight: "100%",
  selectors: {
    '&[data-theme="light"]': {
      vars: assignVars(vars, lightTheme),
      colorScheme: "light",
    },
  },
});

globalStyle("html", {
  background: vars.color.backdropStrong,
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

globalStyle("html[data-pwa-standalone] body", {
  overscrollBehavior: "none",
});

globalStyle("html[data-pwa-standalone] body::before", {
  background: vars.color.backdropStrong,
  content: '""',
  height: "env(safe-area-inset-top, 0px)",
  left: 0,
  pointerEvents: "none",
  position: "fixed",
  right: 0,
  top: 0,
  zIndex: 100,
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
