import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { modalCard, overlay as overlayBase } from "./ui.css";

const stripBase = style({
  alignItems: "center",
  background: `color-mix(in srgb, ${vars.color.surfaceChrome} 82%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.pill,
  color: vars.color.text,
  display: "flex",
  fontFamily: vars.font.body,
  gap: vars.space.sm,
  justifyContent: "center",
  margin: `${vars.space.sm} auto 0`,
  maxWidth: `calc(100% - ${vars.space.md})`,
  minHeight: vars.size.chipHeight,
  padding: `${vars.space.xxs} ${vars.space.sm}`,
  "@media": {
    [media.compact]: {
      marginTop: vars.space.xs,
      minHeight: "2rem",
    },
    "screen and (max-height: 36rem)": {
      marginTop: vars.space.xxs,
      minHeight: "1.75rem",
      paddingBottom: vars.space.hairline,
      paddingTop: vars.space.hairline,
    },
  },
});

export const strip = style([
  stripBase,
  {
    appearance: "none",
    cursor: "pointer",
    outline: "none",
    transition: `background ${vars.duration.fast} ${vars.easing.standard}, border-color ${vars.duration.fast} ${vars.easing.standard}, transform ${vars.duration.fast} ${vars.easing.standard}`,
    selectors: {
      "&:hover": {
        background: vars.color.surfaceChrome,
        borderColor: vars.color.borderStrong,
      },
      "&:active": {
        transform: "scale(0.98)",
      },
      "&:focus-visible": {
        borderColor: vars.color.accentLogo,
        boxShadow: vars.shadow.focus,
      },
    },
    "@media": {
      [media.reduceMotion]: {
        transitionDuration: vars.duration.instant,
        selectors: {
          "&:active": {
            transform: "none",
          },
        },
      },
    },
  },
]);

export const emptyStrip = style([
  stripBase,
  {
    color: vars.color.textMuted,
  },
]);

export const emptyText = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.tight,
  paddingRight: vars.space.xs,
  whiteSpace: "nowrap",
});

export const stripLabel = style({
  color: vars.color.accentLogo,
  flex: "0 0 auto",
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.08em",
  lineHeight: vars.lineHeight.tight,
  paddingLeft: vars.space.xs,
  textTransform: "uppercase",
  "@media": {
    [media.shortLandscape]: {
      display: "none",
    },
    "screen and (max-width: 23rem)": {
      display: "none",
    },
  },
});

export const inlineScores = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.xs,
  minWidth: 0,
});

export const inlineScore = style({
  alignItems: "baseline",
  background: vars.color.chipStrong,
  borderRadius: vars.radius.pill,
  display: "inline-flex",
  flex: "0 1 auto",
  gap: vars.space.xxs,
  maxWidth: "9rem",
  minWidth: 0,
  padding: `${vars.space.xxs} ${vars.space.sm}`,
  "@media": {
    [media.compact]: {
      maxWidth: "6.75rem",
    },
    "screen and (max-width: 23rem)": {
      maxWidth: "6rem",
    },
  },
});

export const inlineName = style({
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  lineHeight: vars.lineHeight.tight,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const inlinePoints = style({
  color: vars.color.text,
  flex: "0 0 auto",
  fontSize: vars.fontSize.sm,
  fontVariantNumeric: "tabular-nums",
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
});

export const moreCount = style({
  color: vars.color.textMuted,
  flex: "0 0 auto",
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: vars.lineHeight.tight,
  paddingRight: vars.space.xs,
});

export const overlay = style([
  overlayBase,
  {
    padding: vars.space.lg,
  },
]);

export const modal = style([
  modalCard,
  {
    gap: vars.space.lg,
    maxHeight: "min(36rem, calc(100dvh - 2rem))",
    overflow: "hidden",
    padding: vars.space.xl,
    width: `min(100%, ${vars.size.modalWidth})`,
    "@media": {
      [media.compact]: {
        padding: vars.space.lg,
      },
    },
  },
]);

export const modalHeader = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.lg,
  justifyContent: "space-between",
});

export const eyebrow = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.12em",
  lineHeight: vars.lineHeight.tight,
  marginBottom: vars.space.xxs,
  textTransform: "uppercase",
});

export const modalTitle = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
  letterSpacing: "-0.03em",
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const playedCount = style({
  background: vars.color.accentSoft,
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.accentLogo} 28%, transparent)`,
  borderRadius: vars.radius.pill,
  color: vars.color.accentLogo,
  flex: "0 0 auto",
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  padding: `${vars.space.xs} ${vars.space.sm}`,
});

export const scoreList = style({
  display: "grid",
  gap: vars.space.xs,
  listStyle: "none",
  margin: 0,
  minHeight: 0,
  overflowY: "auto",
  overscrollBehavior: "contain",
  padding: 0,
});

export const scoreRow = style({
  alignItems: "center",
  background: vars.color.backdropStrong,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "1.5rem 2.5rem minmax(0, 1fr) auto",
  minHeight: "3.5rem",
  padding: vars.space.sm,
});

export const rank = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  fontVariantNumeric: "tabular-nums",
  fontWeight: vars.fontWeight.bold,
  textAlign: "center",
});

export const avatar = style({
  alignItems: "center",
  background: vars.color.accentSoft,
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.accentLogo} 28%, transparent)`,
  borderRadius: vars.radius.pill,
  color: vars.color.accentLogo,
  display: "flex",
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.black,
  height: "2.5rem",
  justifyContent: "center",
  overflow: "hidden",
  width: "2.5rem",
});

export const avatarImage = style({
  height: "100%",
  objectFit: "cover",
  width: "100%",
});

export const person = style({
  display: "grid",
  gap: vars.space.hairline,
  minWidth: 0,
});

export const personName = style({
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const leagueNames = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  lineHeight: vars.lineHeight.snug,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const score = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.lg,
  fontVariantNumeric: "tabular-nums",
  fontWeight: vars.fontWeight.black,
  lineHeight: vars.lineHeight.tight,
  paddingRight: vars.space.xs,
});

export const closeButton = style({
  appearance: "none",
  background: vars.color.text,
  border: "none",
  borderRadius: vars.radius.md,
  color: vars.color.backdropStrong,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.bold,
  minHeight: vars.size.controlHeight,
  outline: "none",
  padding: `${vars.space.sm} ${vars.space.lg}`,
  transition: `opacity ${vars.duration.fast} ${vars.easing.standard}, transform ${vars.duration.fast} ${vars.easing.standard}`,
  width: "100%",
  selectors: {
    "&:hover": { opacity: 0.9 },
    "&:active": { transform: "scale(0.98)" },
    "&:focus-visible": { boxShadow: vars.shadow.focus },
  },
  "@media": {
    [media.reduceMotion]: {
      transitionDuration: vars.duration.instant,
      selectors: { "&:active": { transform: "none" } },
    },
  },
});
