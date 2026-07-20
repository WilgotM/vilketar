import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const header = style({
  padding: vars.space["3xl"],
  width: "100%",
  "@media": {
    [media.compact]: {
      padding: `${vars.space.md} ${vars.space.xl}`,
    },
    "screen and (max-width: 48rem) and (max-height: 46rem)": {
      padding: `${vars.space.sm} ${vars.space.xl}`,
    },
    [media.shortLandscape]: {
      padding: `${vars.space.sm} ${vars.space.xl}`,
    },
  },
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
  "@media": {
    "screen and (max-width: 48rem) and (max-height: 46rem)": {
      minHeight: "2.75rem",
    },
    [media.shortLandscape]: {
      minHeight: "2.75rem",
    },
  },
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
  background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
  borderRadius: vars.radius.pill,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  color: vars.color.text,
  display: "inline-flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  gap: vars.space.sm,
  left: 0,
  lineHeight: 1,
  height: "2.5rem",
  paddingLeft: vars.space.md,
  paddingRight: vars.space.lg,
  position: "absolute",
  textDecoration: "none",
  top: "50%",
  transform: "translateY(-50%)",
  transition: `all ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
      borderColor: `color-mix(in srgb, ${vars.color.text} 20%, transparent)`,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-50%) scale(1.03)",
    },
    "&:active": {
      transform: "translateY(-50%) scale(0.97)",
    },
  },
  "@media": {
    [media.narrow]: {
      paddingLeft: 0,
      paddingRight: 0,
      justifyContent: "center",
      width: "2.5rem",
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
