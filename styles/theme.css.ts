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
    accent: "#1c1917",
    accentActive: "#292524",
    accentLogo: "#d97706",
    accentSoft: "rgba(217, 119, 6, 0.05)",
    accentText: "#fffdfa",
    accentTint: "rgba(217, 119, 6, 0.03)",
    backdrop: "#f5f5f0",
    backdropStrong: "#fffdfa",
    border: "rgba(120, 113, 108, 0.15)",
    borderStrong: "rgba(120, 113, 108, 0.25)",
    chip: "rgba(255, 255, 255, 0.8)",
    chipStrong: "rgba(245, 245, 240, 0.9)",
    danger: "#dc2626",
    dangerSoft: "rgba(220, 38, 38, 0.1)",
    heroGlowA: "rgba(217, 119, 6, 0.04)",
    heroGlowB: "rgba(120, 113, 108, 0.04)",
    heroGlowC: "transparent",
    link: "#1c1917",
    overlay: "rgba(28, 25, 23, 0.4)",
    pillText: "#fffdfa",
    selection: "rgba(217, 119, 6, 0.1)",
    selectionText: "#1c1917",
    statusNeutral: "rgba(120, 113, 108, 0.05)",
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
    surface: "#fffdfa",
    surfaceChrome: "rgba(255, 253, 250, 0.8)",
    surfaceStrong: "#fffdfa",
    text: "#1c1917",
    textMuted: "#78716c",
    textSubtle: "#d6d3d1",
    timeline: "rgba(120, 113, 108, 0.1)",
  },
  shadow: {
    card: "0 4px 12px rgba(120, 113, 108, 0.12)",
    focus: "0 0 0 2px rgba(217, 119, 6, 0.2)",
    panel: "0 8px 32px rgba(120, 113, 108, 0.15)",
  },
};

const darkTheme = {
  ...sharedTokens,
  color: {
    accent: "#fffdfa",
    accentActive: "#f5f5f0",
    accentLogo: "#fbbf24",
    accentSoft: "rgba(251, 191, 36, 0.1)",
    accentText: "#0c0a09",
    accentTint: "rgba(251, 191, 36, 0.05)",
    backdrop: "#000000",
    backdropStrong: "#0a0a0a",
    border: "rgba(250, 250, 245, 0.12)",
    borderStrong: "rgba(250, 250, 245, 0.25)",
    chip: "rgba(23, 20, 18, 0.8)",
    chipStrong: "rgba(35, 31, 28, 0.9)",
    danger: "#ef4444",
    dangerSoft: "rgba(239, 68, 68, 0.2)",
    heroGlowA: "rgba(255, 255, 255, 0.06)",
    heroGlowB: "rgba(255, 255, 255, 0.03)",
    heroGlowC: "transparent",
    link: "#fffdfa",
    overlay: "rgba(0, 0, 0, 0.7)",
    pillText: "#0c0a09",
    selection: "rgba(251, 191, 36, 0.2)",
    selectionText: "#fffdfa",
    statusNeutral: "rgba(250, 250, 245, 0.1)",
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
    surface: "#171412",
    surfaceChrome: "rgba(23, 20, 18, 0.8)",
    surfaceStrong: "#231f1c",
    text: "#fffdfa",
    textMuted: "#a8a29e",
    textSubtle: "#57534e",
    timeline: "rgba(250, 250, 245, 0.15)",
  },
  shadow: {
    card: "0 4px 12px rgba(0, 0, 0, 0.4)",
    focus: "0 0 0 2px rgba(251, 191, 36, 0.3)",
    panel: "0 8px 32px rgba(0, 0, 0, 0.6)",
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
