import { style } from "@vanilla-extract/css";
import {
  cardBorderVar,
  cardFillVar,
  cardForegroundVar,
  cardMutedVar,
} from "./item-card.css";
import { vars } from "./theme.css";

export const player = style({
  boxSizing: "border-box",
  containerType: "size",
  display: "grid",
  gap: vars.space.sm,
  gridTemplateRows: "minmax(0, 1fr) auto",
  height: "100%",
  padding: vars.space.sm,
  userSelect: "none",
  width: "100%",
  WebkitUserSelect: "none",
  "@container": {
    "(max-height: 10rem)": {
      gap: vars.space.xxs,
      padding: vars.space.xxs,
    },
  },
});

export const artworkFrame = style({
  alignSelf: "center",
  aspectRatio: "1",
  background: `color-mix(in srgb, ${cardBorderVar} 70%, ${cardFillVar})`,
  border: `1px solid color-mix(in srgb, ${cardBorderVar} 82%, transparent)`,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.card,
  height: "100%",
  justifySelf: "center",
  maxWidth: "100%",
  minHeight: 0,
  overflow: "hidden",
  position: "relative",
});

export const artwork = style({
  display: "block",
  height: "100%",
  objectFit: "contain",
  pointerEvents: "none",
  width: "100%",
});

export const artworkFallback = style({
  alignItems: "center",
  background: `radial-gradient(circle at 50% 35%, ${vars.color.accentGlow}, transparent 64%), ${vars.color.surfaceStrong}`,
  display: "flex",
  height: "100%",
  justifyContent: "center",
});

export const fallbackLogo = style({
  borderRadius: vars.radius.sm,
  height: "42%",
  opacity: 0.75,
  width: "auto",
});

export const artworkShade = style({
  background:
    "linear-gradient(180deg, transparent 78%, rgba(0, 0, 0, 0.1) 100%)",
  inset: 0,
  pointerEvents: "none",
  position: "absolute",
});

export const trackRow = style({
  alignItems: "center",
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "2.75rem minmax(0, 1fr)",
  minWidth: 0,
  "@container": {
    "(max-height: 10rem)": {
      gap: vars.space.xxs,
      gridTemplateColumns: "2rem minmax(0, 1fr)",
    },
  },
});

export const listenButton = style({
  alignItems: "center",
  aspectRatio: "1",
  background: "#111111",
  border: 0,
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  padding: "0.1875rem",
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}, opacity ${vars.duration.fast} ${vars.easing.standard}`,
  width: "2.75rem",
  selectors: {
    "&:active:not(:disabled)": { transform: "scale(0.94)" },
    "&:disabled": { cursor: "wait", opacity: 0.45 },
    "&:focus-visible": {
      outline: `${vars.size.outlineWidth} solid ${cardForegroundVar}`,
      outlineOffset: "0.125rem",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
  "@container": {
    "(max-height: 10rem)": {
      padding: "0.125rem",
      width: "2rem",
    },
  },
});

export const playButtonInner = style({
  alignItems: "center",
  background: cardFillVar,
  borderRadius: "50%",
  color: "#111111",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  width: "100%",
});

export const playIcon = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.black,
  lineHeight: 1,
  transform: "translateX(0.05em)",
  "@container": {
    "(max-height: 10rem)": { fontSize: vars.fontSize.xs },
  },
});

export const trackCopy = style({
  display: "grid",
  gap: "0.08rem",
  minWidth: 0,
});

export const trackTitle = style({
  color: cardForegroundVar,
  display: "-webkit-box",
  fontSize: "clamp(0.68rem, 7.5cqw, 0.88rem)",
  fontWeight: vars.fontWeight.black,
  letterSpacing: "-0.025em",
  lineHeight: vars.lineHeight.tight,
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  "@container": {
    "(max-height: 10rem)": {
      fontSize: "0.54rem",
      WebkitLineClamp: 2,
    },
  },
});

export const artist = style({
  color: cardMutedVar,
  fontSize: "clamp(0.58rem, 6cqw, 0.7rem)",
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.snug,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  "@container": {
    "(max-height: 10rem)": { fontSize: "0.46rem" },
  },
});
