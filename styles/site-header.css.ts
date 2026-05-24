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
  appearance: "none",
  background: vars.color.surfaceChrome,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.15)",
  color: vars.color.text,
  display: "inline-flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  gap: vars.space.sm,
  left: 0,
  lineHeight: 1,
  minHeight: "2.5rem",
  paddingLeft: vars.space.md,
  paddingRight: vars.space.lg,
  position: "absolute",
  textDecoration: "none",
  top: "50%",
  transform: "translateY(-50%)",
  transition: `all ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&:hover": {
      background: vars.color.surfaceStrong,
      borderColor: vars.color.accent,
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.25)",
      color: vars.color.accent,
      transform: "translateY(-50%) scale(1.03)",
    },
    "&:active": {
      transform: "translateY(-50%) scale(0.97)",
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
