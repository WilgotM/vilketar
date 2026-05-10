import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const header = style({
  padding: vars.space["3xl"],
  width: "100%",
});

export const inner = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: vars.size.pageWidth,
  minHeight: vars.size.controlHeight,
  position: "relative",
  width: "100%",
});

export const wordmark = style({
  alignItems: "baseline",
  color: vars.color.text,
  display: "inline-flex",
  fontFamily: vars.font.display,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "-0.04em",
  lineHeight: "0.96",
  textDecoration: "none",
});

export const backLink = style({
  alignItems: "center",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  color: vars.color.textMuted,
  display: "inline-flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  gap: vars.space.xs,
  left: 0,
  lineHeight: 1,
  minHeight: vars.size.controlHeight,
  paddingLeft: vars.space.md,
  paddingRight: vars.space.lg,
  position: "absolute",
  textDecoration: "none",
  top: "50%",
  transform: "translateY(-50%)",
  selectors: {
    "&:hover": {
      borderColor: vars.color.accent,
      color: vars.color.text,
    },
  },
});

export const backText = style({
  "@media": {
    [media.narrow]: {
      display: "none",
    },
  },
});
