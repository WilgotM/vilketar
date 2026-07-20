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
    "screen and (max-height: 43rem)": {
      vars: {
        [vars.size.cardHeight]: "10rem",
        [vars.size.cardWidth]: "7.5rem",
        [vars.size.datePillHeight]: "1.75rem",
        [vars.size.datePillWidth]: "4.5rem",
        [vars.size.deckStackWidth]: "8.5rem",
        [vars.size.deckWidth]: "10.5rem",
        [vars.size.timelineBottomPadding]: "1.75rem",
      },
    },
    "screen and (max-height: 36rem)": {
      vars: {
        [vars.size.cardHeight]: "8.75rem",
        [vars.size.cardWidth]: "6.5625rem",
        [vars.size.datePillHeight]: "1.625rem",
        [vars.size.datePillWidth]: "4.25rem",
        [vars.size.deckStackWidth]: "7.25rem",
        [vars.size.deckWidth]: "9rem",
        [vars.size.timelineBottomPadding]: "1.625rem",
      },
    },
    [media.shortLandscape]: {
      flexDirection: "row",
    },
  },
});

export const top = style({
  alignItems: "center",
  display: "flex",
  flex: "0 0 auto",
  flexDirection: "column",
  gap: vars.space.lg,
  justifyContent: "flex-start",
  minHeight: 0,
  paddingTop: vars.space.md,
  position: "relative",
  "@media": {
    [media.compact]: {
      gap: vars.space.md,
    },
    "screen and (max-width: 48rem) and (max-height: 46rem)": {
      gap: vars.space.sm,
      paddingTop: vars.space.sm,
    },
    [media.shortWide]: {
      gap: vars.space.sm,
      paddingTop: vars.space.sm,
    },
    "screen and (max-height: 43rem)": {
      gap: vars.space.sm,
      paddingTop: vars.space.sm,
    },
    [media.shortLandscape]: {
      flex: "0 0 38%",
      justifyContent: "center",
      paddingTop: 0,
    },
  },
});

export const topGameOver = style({
  flexBasis: "68%",
  justifyContent: "center",
  paddingBottom: vars.space.lg,
  paddingTop: vars.space.lg,
  "@media": {
    [media.compact]: {
      flexBasis: "70%",
      gap: vars.space.md,
      paddingBottom: vars.space.sm,
      paddingTop: vars.space.sm,
    },
    [media.shortWide]: {
      flexBasis: "64%",
    },
  },
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
  minWidth: "4rem",
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
  display: "block",
  fontFamily: vars.font.display,
  fontFeatureSettings: "normal",
  fontSize: "3.5rem",
  fontVariantNumeric: "normal",
  fontWeight: vars.fontWeight.black,
  lineHeight: "1",
  minWidth: "1.6ch",
  overflow: "visible",
  textAlign: "center",
  "@media": {
    [media.compact]: {
      fontSize: "3rem",
    },
    "screen and (max-width: 48rem) and (max-height: 46rem)": {
      fontSize: "2.5rem",
    },
    [media.shortWide]: {
      fontSize: "3rem",
    },
    "screen and (max-height: 43rem)": {
      fontSize: "2.5rem",
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
    "screen and (max-width: 48rem) and (max-height: 46rem)": {
      fontSize: "0.625rem",
    },
  },
});

export const bottom = style({
  alignItems: "safe center",
  display: "flex",
  flex: "1 1 0",
  minHeight: 0,
  overflowX: "auto",
  overflowY: "hidden",
  paddingTop: vars.space.md,
  position: "relative",
  width: "100%",
  "@media": {
    [media.shortWide]: {
      paddingTop: vars.space.sm,
    },
    "screen and (max-height: 43rem)": {
      paddingTop: vars.space.sm,
    },
    "screen and (max-width: 48rem) and (max-height: 46rem)": {
      paddingTop: vars.space.xs,
    },
    [media.shortLandscape]: {
      paddingTop: 0,
    },
  },
});

export const bottomGameOver = style({
  flexBasis: "32%",
  paddingTop: vars.space.sm,
  vars: {
    [vars.size.cardHeight]: "10rem",
    [vars.size.cardWidth]: "7.5rem",
    [vars.size.datePillHeight]: "1.75rem",
    [vars.size.datePillWidth]: "4.5rem",
    [vars.size.timelineBottomPadding]: "1.75rem",
  },
  "@media": {
    [media.compact]: {
      flexBasis: "30%",
      vars: {
        [vars.size.cardHeight]: "8.75rem",
        [vars.size.cardWidth]: "6.5625rem",
        [vars.size.timelineBottomPadding]: "1.5rem",
      },
    },
    [media.shortWide]: {
      flexBasis: "36%",
    },
  },
});
