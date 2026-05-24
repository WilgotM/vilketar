import { keyframes, style } from "@vanilla-extract/css";
import { media, zIndex } from "./foundation";
import { vars } from "./theme.css";

const rise = keyframes({
  "0%": { opacity: 0, transform: "translate3d(-50%, 1rem, 0) scale(0.98)" },
  "100%": { opacity: 1, transform: "translate3d(-50%, 0, 0) scale(1)" },
});

export const prompt = style({
  animation: `${rise} ${vars.duration.slow} ${vars.easing.emphasized}`,
  background: "rgba(255, 253, 250, 0.98)",
  backdropFilter: "blur(1.5rem)",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  bottom: `calc(${vars.space.lg} + env(safe-area-inset-bottom, 0px))`,
  boxShadow: vars.shadow.panel,
  color: vars.color.text,
  display: "grid",
  gap: vars.space.md,
  left: "50%",
  maxWidth: "28rem",
  padding: vars.space.lg,
  position: "fixed",
  transform: "translateX(-50%)",
  width: `calc(100% - ${vars.space.xl} * 2)`,
  zIndex: zIndex.floating,
  "@media": {
    [media.dark]: {
      background: "rgba(35, 31, 28, 0.98)",
    },
    [media.reduceMotion]: {
      animation: "none",
    },
  },
});

export const topRow = style({
  alignItems: "start",
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
});

export const appIcon = style({
  alignItems: "center",
  background:
    "linear-gradient(145deg, rgba(255, 253, 250, 0.98), rgba(245, 245, 240, 0.86))",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.card,
  color: "#d97706",
  display: "flex",
  height: "3rem",
  justifyContent: "center",
  overflow: "hidden",
  width: "3rem",
  "@media": {
    [media.dark]: {
      background:
        "linear-gradient(145deg, rgba(35, 31, 28, 0.98), rgba(12, 10, 9, 0.9))",
      color: "#fbbf24",
    },
  },
});

export const copy = style({
  display: "grid",
  gap: vars.space.xs,
  minWidth: 0,
});

export const title = style({
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});

export const text = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  lineHeight: vars.lineHeight.body,
  margin: 0,
});

export const closeButton = style({
  appearance: "none",
  alignItems: "center",
  background: "transparent",
  border: 0,
  borderRadius: vars.radius.sm,
  color: vars.color.textMuted,
  cursor: "pointer",
  display: "flex",
  height: "2rem",
  justifyContent: "center",
  padding: 0,
  width: "2rem",
  selectors: {
    "&:focus-visible": {
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
  },
});

export const installButton = style({
  appearance: "none",
  background: vars.color.text,
  border: 0,
  borderRadius: vars.radius.md,
  color: vars.color.backdropStrong,
  cursor: "pointer",
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.bold,
  minHeight: "2.75rem",
  padding: `0 ${vars.space.lg}`,
  selectors: {
    "&:focus-visible": {
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
  },
});

export const steps = style({
  display: "grid",
  gap: vars.space.sm,
});

export const safariBar = style({
  alignItems: "center",
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "minmax(0, 1fr) auto",
  minHeight: "2.75rem",
  padding: vars.space.sm,
});

export const safariUrl = style({
  background: vars.color.accentTint,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: vars.lineHeight.tight,
  overflow: "hidden",
  padding: `${vars.space.sm} ${vars.space.md}`,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const safariShare = style({
  alignItems: "center",
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.accentLogo,
  display: "flex",
  height: "2rem",
  justifyContent: "center",
  width: "2rem",
});

export const step = style({
  alignItems: "center",
  background: vars.color.accentTint,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "2rem minmax(0, 1fr)",
  minHeight: "2.75rem",
  padding: vars.space.sm,
});

export const stepIcon = style({
  alignItems: "center",
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.accentLogo,
  display: "flex",
  height: "2rem",
  justifyContent: "center",
  width: "2rem",
});

export const stepText = style({
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});
