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
  "@media": {
    [media.narrow]: {
      fontSize: "1.625rem",
    },
    "screen and (max-width: 22.5rem)": {
      fontSize: "1.25rem",
    },
  },
});

export const backLink = style({
  alignItems: "center",
  appearance: "none",
  background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
  borderRadius: vars.radius.md,
  boxShadow:
    "inset 0 1px 0 color-mix(in srgb, currentColor 10%, transparent), 0 6px 18px rgba(0, 0, 0, 0.18)",
  color: vars.color.text,
  display: "inline-flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  justifyContent: "center",
  left: 0,
  lineHeight: 1,
  height: "2.75rem",
  padding: 0,
  position: "absolute",
  textDecoration: "none",
  top: "50%",
  transform: "translateY(-50%)",
  transition: `background ${vars.duration.normal} ${vars.easing.ios}, border-color ${vars.duration.normal} ${vars.easing.ios}, box-shadow ${vars.duration.normal} ${vars.easing.ios}, transform ${vars.duration.fast} ${vars.easing.ios}`,
  width: "2.75rem",
  selectors: {
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
      borderColor: `color-mix(in srgb, ${vars.color.text} 20%, transparent)`,
      boxShadow:
        "inset 0 1px 0 color-mix(in srgb, currentColor 14%, transparent), 0 8px 22px rgba(0, 0, 0, 0.22)",
      transform: "translateY(calc(-50% - 1px))",
    },
    "&:focus-visible": {
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
    "&:active": {
      boxShadow:
        "inset 0 1px 4px rgba(0, 0, 0, 0.2), 0 3px 10px rgba(0, 0, 0, 0.16)",
      transform: "translateY(-50%) scale(0.96)",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

export const backText = style({
  display: "none",
});
