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
    [media.shortWide]: {
      vars: {
        [vars.size.boardStatusWidth]: "27rem",
        [vars.size.cardHeight]: "11rem",
        [vars.size.cardWidth]: "8.25rem",
        [vars.size.deckStackWidth]: "9.25rem",
        [vars.size.deckWidth]: "11.25rem",
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
    [media.shortWide]: {
      flexBasis: "55%",
      gap: vars.space.md,
      paddingTop: vars.space.md,
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
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  justifyContent: "center",
  overflow: "visible",
  pointerEvents: "none",
  zIndex: 3,
  "@media": {
    [media.shortWide]: {
      gap: vars.space.xxs,
    },
  },
});

export const scoreValue = style({
  color: vars.color.text,
  WebkitTextFillColor: vars.color.text,
  display: "block",
  fontFeatureSettings: "normal",
  fontSize: "3.5rem",
  fontWeight: vars.fontWeight.black,
  fontVariantNumeric: "normal",
  lineHeight: "1.2",
  minHeight: "4.2rem",
  overflow: "visible",
  paddingBottom: "0.05em",
  paddingTop: "0.02em",
  textAlign: "center",
  "@media": {
    [media.compact]: {
      fontSize: "3rem",
      minHeight: "3.6rem",
    },
    [media.shortWide]: {
      fontSize: "3rem",
      minHeight: "3.6rem",
    },
  },
});

export const scoreLabel = style({
  color: `color-mix(in srgb, ${vars.color.text} 60%, transparent)`,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.semibold,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  lineHeight: "1",
  display: "inline-flex",
  alignItems: "center",
  "@media": {
    [media.compact]: {
      fontSize: vars.fontSize.xs,
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
    [media.shortWide]: {
      flexBasis: "45%",
      paddingTop: vars.space.md,
    },
  },
});
