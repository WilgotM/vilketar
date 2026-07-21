import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const toggle = style({
  alignItems: "center",
  appearance: "none",
  background: `color-mix(in srgb, ${vars.color.surfaceStrong} 88%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow:
    "inset 0 1px 0 color-mix(in srgb, currentColor 8%, transparent), 0 6px 18px rgba(0, 0, 0, 0.18)",
  color: vars.color.text,
  cursor: "pointer",
  display: "flex",
  gap: vars.space.sm,
  height: "2.75rem",
  padding: `${vars.space.xs} ${vars.space.sm} ${vars.space.xs} ${vars.space.md}`,
  transition: `background ${vars.duration.normal} ${vars.easing.ios}, border-color ${vars.duration.normal} ${vars.easing.ios}, box-shadow ${vars.duration.normal} ${vars.easing.ios}, transform ${vars.duration.fast} ${vars.easing.ios}`,
  zIndex: 8,
  selectors: {
    "&:hover": {
      borderColor: `color-mix(in srgb, ${vars.color.accent} 48%, ${vars.color.border})`,
      boxShadow:
        "inset 0 1px 0 color-mix(in srgb, currentColor 12%, transparent), 0 8px 22px rgba(0, 0, 0, 0.22)",
      transform: "translateY(-1px)",
    },
    "&:focus-visible": {
      boxShadow: vars.shadow.focus,
      outline: "none",
    },
    "&:active": { transform: "translateY(0) scale(0.98)" },
  },
  "@media": {
    [media.narrow]: {
      gap: vars.space.xs,
      padding: `${vars.space.xs} ${vars.space.sm}`,
    },
    "screen and (max-width: 22.5rem)": {
      gap: vars.space.xxs,
      padding: vars.space.xs,
    },
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

export const enabled = style({
  background: `color-mix(in srgb, ${vars.color.accent} 13%, ${vars.color.surfaceStrong})`,
  borderColor: `color-mix(in srgb, ${vars.color.accent} 58%, ${vars.color.border})`,
});

export const boardPlacement = style({
  position: "fixed",
  right: `max(${vars.space["3xl"]}, calc((100vw - ${vars.size.pageWidth}) / 2))`,
  top: `calc(${vars.space["3xl"]} + (${vars.size.controlHeight} - 2.75rem) / 2)`,
  "@media": {
    [media.compact]: {
      right: vars.space.xl,
      top: `calc(${vars.space.md} + (${vars.size.controlHeight} - 2.75rem) / 2)`,
    },
    [media.narrow]: {
      right: vars.space.xl,
      top: `calc(${vars.space.md} + (${vars.size.controlHeight} - 2.75rem) / 2)`,
    },
    "screen and (max-width: 48rem) and (max-height: 46rem)": {
      top: vars.space.sm,
    },
    [media.shortLandscape]: {
      right: vars.space.xl,
      top: `calc(${vars.space.sm} + (${vars.size.controlHeight} - 2.75rem) / 2)`,
    },
  },
});

export const iconWrap = style({
  alignItems: "center",
  display: "flex",
  height: "1.5rem",
  justifyContent: "center",
  position: "relative",
  width: "1.5rem",
  "@media": {
    [media.narrow]: {
      display: "none",
    },
  },
});

export const icon = style({
  fill: "none",
  height: "1.25rem",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
  width: "1.25rem",
});

export const playMark = style({
  alignItems: "center",
  background: vars.color.accent,
  borderRadius: vars.radius.pill,
  bottom: "-0.1rem",
  color: vars.color.accentText,
  display: "flex",
  fontSize: "0.4rem",
  height: "0.75rem",
  justifyContent: "center",
  position: "absolute",
  right: "-0.2rem",
  width: "0.75rem",
});

export const copy = style({
  display: "flex",
  flexDirection: "column",
  lineHeight: 1,
  textAlign: "left",
});

export const label = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.02em",
});

export const state = style({
  color: vars.color.textMuted,
  fontSize: "0.625rem",
  fontWeight: vars.fontWeight.semibold,
  marginTop: vars.space.xxs,
  "@media": {
    [media.compact]: { display: "none" },
  },
});

export const switchTrack = style({
  background: `color-mix(in srgb, ${vars.color.text} 16%, transparent)`,
  borderRadius: vars.radius.pill,
  display: "block",
  height: "1.25rem",
  padding: "0.125rem",
  transition: `background ${vars.duration.fast} ${vars.easing.standard}`,
  width: "2.15rem",
  selectors: {
    [`${enabled} &`]: { background: vars.color.accent },
  },
});

export const switchThumb = style({
  background: vars.color.text,
  borderRadius: "50%",
  boxShadow: vars.shadow.card,
  display: "block",
  height: "1rem",
  transform: "translateX(0)",
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}`,
  width: "1rem",
  selectors: {
    [`${enabled} &`]: { transform: "translateX(0.9rem)" },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});
