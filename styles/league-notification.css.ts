import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const prompt = style({
  alignItems: "flex-start",
  background: vars.color.surfaceChrome,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.card,
  display: "grid",
  gap: vars.space.lg,
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  padding: vars.space.lg,
  textAlign: "left",
  width: "100%",
  "@media": {
    [media.narrow]: {
      gap: vars.space.md,
      gridTemplateColumns: "auto minmax(0, 1fr)",
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

export const icon = style({
  alignItems: "center",
  background: vars.color.accentSoft,
  border: `${vars.size.borderWidth} solid ${vars.color.accentGlow}`,
  borderRadius: vars.radius.md,
  color: vars.color.accent,
  display: "flex",
  flexShrink: 0,
  height: vars.size.controlHeight,
  justifyContent: "center",
  width: vars.size.controlHeight,
});

export const copy = style({
  display: "grid",
  gap: vars.space.xxs,
  minWidth: 0,
});

export const title = style({
  color: vars.color.text,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
  margin: 0,
});

export const description = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.body,
  margin: 0,
  maxWidth: vars.size.contentWidth,
});

export const actions = style({
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
  gridColumn: "2 / -1",
  marginTop: vars.space.xxs,
  "@media": {
    [media.narrow]: {
      gridColumn: "1 / -1",
    },
  },
});

export const action = style({
  alignItems: "center",
  appearance: "none",
  background: vars.color.accent,
  border: 0,
  borderRadius: vars.radius.pill,
  color: vars.color.accentText,
  cursor: "pointer",
  display: "inline-flex",
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  minHeight: vars.size.controlHeight,
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
  fontSize: vars.fontSize.sm,
  minHeight: vars.size.controlHeight,
  padding: `0 ${vars.space.sm}`,
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
  gridColumn: "2 / -1",
  lineHeight: vars.lineHeight.body,
  margin: 0,
  "@media": {
    [media.narrow]: {
      gridColumn: "1 / -1",
    },
  },
});

export const guide = style({
  background: vars.color.accentTint,
  border: `${vars.size.borderWidth} solid ${vars.color.accentGlow}`,
  borderRadius: vars.radius.md,
  color: vars.color.textMuted,
  display: "grid",
  fontSize: vars.fontSize.sm,
  gap: vars.space.xs,
  gridColumn: "2 / -1",
  lineHeight: vars.lineHeight.body,
  padding: vars.space.md,
  "@media": {
    [media.narrow]: {
      gridColumn: "1 / -1",
    },
  },
});

export const guideStep = style({
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
