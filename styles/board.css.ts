import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const wrapper = style({
  color: vars.color.text,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  overflow: "hidden",
  position: "relative",
  width: "100%",
  "@media": {
    [media.wide]: {
      vars: {
        [vars.size.boardStatusWidth]: "31rem",
        [vars.size.cardHeight]: "14rem",
        [vars.size.cardWidth]: "10.5rem",
        [vars.size.deckStackWidth]: "11.75rem",
        [vars.size.deckWidth]: "14.25rem",
      },
    },
  },
});

export const top = style({
  alignItems: "center",
  display: "flex",
  flex: "0 0 52%",
  flexDirection: "column",
  gap: vars.space.xl,
  justifyContent: "flex-end",
  minHeight: 0,
  paddingTop: vars.space.xl,
  position: "relative",
  "@media": {
    [media.compact]: {
      flexBasis: "50%",
      gap: vars.space.lg,
    },
  },
});

export const topGameOver = style({
  justifyContent: "center",
  paddingBottom: vars.space.lg,
  paddingTop: vars.space.lg,
});

export const statusArea = style({
  position: "relative",
  width: `min(100%, ${vars.size.boardStatusWidth})`,
});

export const statusLayer = style({
  display: "flex",
  justifyContent: "center",
  width: "100%",
});

export const scoreBadge = style({
  alignItems: "center",
  background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
  borderRadius: vars.radius.pill,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  display: "inline-flex",
  gap: "0.25rem",
  justifyContent: "center",
  padding: "0.375rem 0.875rem",
  pointerEvents: "none",
  position: "absolute",
  right: vars.space["2xl"],
  top: vars.space.xl,
  zIndex: 3,
  height: "2.125rem",
  "@media": {
    [media.compact]: {
      padding: "0.25rem 0.6875rem",
      right: vars.space.lg,
      top: vars.space.lg,
      height: "1.875rem",
    },
  },
});

export const scoreValue = style({
  color: vars.color.accent,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.bold,
  lineHeight: "1",
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
  display: "inline-flex",
  alignItems: "center",
  "@media": {
    [media.compact]: {
      fontSize: vars.fontSize.base,
    },
  },
});

export const scoreLabel = style({
  color: `color-mix(in srgb, ${vars.color.text} 60%, transparent)`,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.medium,
  lineHeight: "1",
  display: "inline-flex",
  alignItems: "center",
  "@media": {
    [media.compact]: {
      fontSize: vars.fontSize.sm,
    },
  },
});

export const bottom = style({
  alignItems: "flex-start",
  display: "flex",
  flex: "0 0 48%",
  minHeight: 0,
  overflowX: "auto",
  overflowY: "hidden",
  paddingTop: vars.space.lg,
  position: "relative",
  width: "100%",
  "@media": {
    [media.compact]: {
      flexBasis: "50%",
    },
  },
});
