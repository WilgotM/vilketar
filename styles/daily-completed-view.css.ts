import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { sectionLabel, surface } from "./ui.css";

export const view = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3xl"],
  width: "100%",
  "@media": {
    [media.compact]: {
      gap: vars.space["2xl"],
    },
  },
});

export const summarySection = style([
  surface({ density: "spacious", tone: "chrome" }),
  {
    display: "flex",
    justifyContent: "center",
    width: `min(calc(100% - (${vars.space.xl} * 2)), ${vars.size.contentWidthWide})`,
    "@media": {
      [media.compact]: {
        padding: vars.space.xl,
        width: `min(calc(100% - (${vars.space.md} * 2)), ${vars.size.contentWidthWide})`,
      },
    },
  },
]);

export const timelineSection = style({
  borderTop: `1px solid ${vars.color.border}`,
  display: "grid",
  gap: vars.space.xl,
  paddingTop: vars.space.xl,
  width: "100%",
  vars: {
    [vars.size.cardHeight]: "10rem",
    [vars.size.cardWidth]: "7.5rem",
    [vars.size.datePillHeight]: "1.75rem",
    [vars.size.datePillWidth]: "4.5rem",
    [vars.size.timelineBottomPadding]: "1.75rem",
  },
  "@media": {
    [media.compact]: {
      gap: vars.space.lg,
      vars: {
        [vars.size.cardHeight]: "8.75rem",
        [vars.size.cardWidth]: "6.5625rem",
        [vars.size.timelineBottomPadding]: "1.5rem",
      },
    },
  },
});

export const timelineHeader = style({
  alignItems: "end",
  display: "flex",
  gap: vars.space.lg,
  justifyContent: "space-between",
  margin: "0 auto",
  padding: `0 ${vars.space.xl}`,
  width: `min(100%, ${vars.size.contentWidthWide})`,
});

export const timelineEyebrow = style([
  sectionLabel,
  {
    color: vars.color.accentLogo,
    marginBottom: vars.space.xs,
    textAlign: "left",
  },
]);

export const timelineTitle = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const timelineCount = style([
  sectionLabel,
  {
    color: vars.color.textMuted,
    flex: "0 0 auto",
  },
]);

export const timelineViewport = style({
  maxWidth: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  overscrollBehaviorX: "contain",
  scrollBehavior: "smooth",
  width: "100%",
  WebkitOverflowScrolling: "touch",
  "@media": {
    [media.reduceMotion]: {
      scrollBehavior: "auto",
    },
  },
});
