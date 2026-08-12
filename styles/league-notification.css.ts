import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const prompt = style({
  background: `linear-gradient(145deg, color-mix(in srgb, ${vars.color.surfaceStrong} 96%, ${vars.color.accentLogo}) 0%, ${vars.color.surfaceChrome} 72%)`,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.card,
  display: "grid",
  gap: vars.space.md,
  padding: vars.space.lg,
  textAlign: "left",
  width: "100%",
  "@media": {
    [media.narrow]: {
      padding: vars.space.md,
    },
  },
});

export const homePrompt = style([
  prompt,
  {
    alignSelf: "center",
    maxWidth: vars.size.contentWidthWide,
    marginTop: vars.space.xs,
  },
]);

export const leaguePrompt = style([
  prompt,
  {
    marginBottom: vars.space.xl,
  },
]);

export const header = style({
  alignItems: "center",
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "auto minmax(0, 1fr)",
});

export const icon = style({
  alignItems: "center",
  background: vars.color.accentSoft,
  border: `${vars.size.borderWidth} solid ${vars.color.accentGlow}`,
  borderRadius: vars.radius.md,
  color: vars.color.accent,
  display: "flex",
  flexShrink: 0,
  height: vars.space["4xl"],
  justifyContent: "center",
  width: vars.space["4xl"],
});

export const copy = style({
  display: "grid",
  gap: vars.space.xxs,
  minWidth: 0,
});

export const title = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "-0.02em",
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});

export const description = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  lineHeight: vars.lineHeight.body,
  margin: 0,
  maxWidth: vars.size.contentWidth,
});

export const actions = style({
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
});

export const homeActions = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
});

export const homePrimaryAction = style({
  width: "100%",
});

export const action = style({
  alignItems: "center",
  appearance: "none",
  background: vars.color.accent,
  border: 0,
  borderRadius: vars.radius.md,
  color: vars.color.accentText,
  cursor: "pointer",
  display: "inline-flex",
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  minHeight: vars.space["5xl"],
  padding: `0 ${vars.space.lg}`,
  selectors: {
    "&:hover": { background: vars.color.accentActive },
    "&:focus-visible": {
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
    "&:disabled": {
      cursor: "wait",
      opacity: 0.65,
    },
  },
});

export const secondaryAction = style([
  action,
  {
    background: vars.color.surfaceStrong,
    border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
    color: vars.color.text,
    selectors: {
      "&:hover": { background: vars.color.accentTint },
    },
  },
]);

export const dismissAction = style({
  alignItems: "center",
  appearance: "none",
  background: "transparent",
  border: 0,
  color: vars.color.textMuted,
  cursor: "pointer",
  display: "inline-flex",
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  justifyContent: "center",
  minHeight: vars.space["5xl"],
  padding: `0 ${vars.space.md}`,
  selectors: {
    "&:hover": { color: vars.color.text },
    "&:focus-visible": {
      borderRadius: vars.radius.sm,
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
  },
});

export const feedback = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.body,
  margin: 0,
});

export const guide = style({
  background: vars.color.accentTint,
  border: `${vars.size.borderWidth} solid ${vars.color.accentGlow}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  display: "grid",
  fontSize: vars.fontSize.control,
  gap: vars.space.xs,
  lineHeight: vars.lineHeight.body,
  padding: vars.space.md,
});

export const guideStep = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.sm,
  margin: 0,
});

export const guideNumber = style({
  alignItems: "center",
  background: vars.color.accent,
  borderRadius: vars.radius.pill,
  color: vars.color.accentText,
  display: "inline-flex",
  flexShrink: 0,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  height: vars.space.lg,
  justifyContent: "center",
  width: vars.space.lg,
});
