import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const player = style({
  alignItems: "center",
  background: vars.color.surfaceChrome,
  border: `1px solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.md,
  boxSizing: "border-box",
  boxShadow: vars.shadow.panel,
  display: "grid",
  gap: vars.space.xs,
  gridTemplateColumns: "auto minmax(0, 1fr)",
  margin: "auto",
  padding: vars.space.xs,
  width: "100%",
});

export const playButton = style({
  alignItems: "center",
  background: vars.color.accentLogo,
  border: 0,
  borderRadius: "50%",
  color: vars.color.accentText,
  cursor: "pointer",
  display: "flex",
  height: "2.25rem",
  justifyContent: "center",
  padding: 0,
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}, opacity ${vars.duration.fast} ${vars.easing.standard}`,
  width: "2.25rem",
  selectors: {
    "&:active:not(:disabled)": { transform: "scale(0.94)" },
    "&:disabled": { cursor: "wait", opacity: 0.55 },
  },
});

export const playIcon = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  transform: "translateX(0.06em)",
});

export const copy = style({
  display: "grid",
  gap: vars.space.xxs,
  minWidth: 0,
});

export const label = style({
  color: vars.color.text,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
});

export const progressTrack = style({
  background: vars.color.border,
  borderRadius: vars.radius.pill,
  height: "0.3rem",
  overflow: "hidden",
});

export const progressFill = style({
  background: vars.color.accentLogo,
  display: "block",
  height: "100%",
  transformOrigin: "left center",
  transition: "transform 120ms linear",
  width: "100%",
});

export const time = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  fontVariantNumeric: "tabular-nums",
});

export const attribution = style({
  color: vars.color.textMuted,
  fontSize: "0.6rem",
  gridColumn: "1 / -1",
  textAlign: "center",
});
