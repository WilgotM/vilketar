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
  alignItems: "baseline",
  background: `color-mix(in srgb, ${vars.color.surfaceStrong} 86%, transparent)`,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.pill,
  boxShadow: vars.shadow.panel,
  display: "inline-flex",
  gap: vars.space.xs,
  justifyContent: "center",
  minWidth: "6.75rem",
  padding: `${vars.space.sm} ${vars.space.lg}`,
  pointerEvents: "none",
  position: "absolute",
  right: vars.space["2xl"],
  top: vars.space.xl,
  zIndex: 3,
  "@media": {
    [media.compact]: {
      minWidth: "5.75rem",
      padding: `${vars.space.xs} ${vars.space.md}`,
      right: vars.space.lg,
      top: vars.space.lg,
    },
  },
});

export const scoreValue = style({
  color: vars.color.accent,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
  lineHeight: vars.lineHeight.tight,
  minWidth: "1.4ch",
  textAlign: "right",
  "@media": {
    [media.compact]: {
      fontSize: vars.fontSize.lg,
    },
  },
});

export const scoreLabel = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: vars.lineHeight.tight,
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
