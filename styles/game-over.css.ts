import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { surface } from "./ui.css";

export const gameOver = style({
  alignItems: "center",
  color: vars.color.text,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  width: "100%",
});

export const freePlaySummary = style([
  surface({ density: "spacious", tone: "chrome" }),
  {
    width: `min(calc(100% - (${vars.space.xl} * 2)), ${vars.size.contentWidthWide})`,
    "@media": {
      [media.compact]: {
        padding: vars.space.xl,
      },
      [media.wide]: {
        width: `min(calc(100% - (${vars.space["2xl"]} * 2)), ${vars.size.contentWidthWide})`,
      },
    },
  },
]);

export const dailySummary = freePlaySummary;

export const summaryStack = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xl,
  width: "100%",
});

export const scoresWrapper = style({
  display: "grid",
  gap: vars.space.lg,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  width: "100%",
  "@media": {
    [media.narrow]: { gridTemplateColumns: "minmax(0, 1fr)" },
  },
});

export const completionMessage = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  background: vars.color.accentSoft,
  display: "grid",
  gap: vars.space.xs,
  padding: vars.space.lg,
  textAlign: "center",
});

export const completionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
});

export const completionText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.45,
});

export const buttons = style({
  display: "grid",
  gap: vars.space.lg,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  width: "100%",
  "@media": {
    [media.compact]: {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
});
