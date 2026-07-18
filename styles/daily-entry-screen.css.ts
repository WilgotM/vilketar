import { globalStyle, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import {
  action,
  screenTitle,
  sectionLabel,
  stage as stageBase,
} from "./ui.css";

export const screen = style({
  display: "flex",
  height: "100%",
  justifyContent: "center",
  minHeight: 0,
  width: "100%",
  overflow: "visible",
});

export const stage = style([
  stageBase,
  {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
]);

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xl,
  width: `min(100%, ${vars.size.contentWidthWide})`,
  height: "100%",
  justifyContent: "center",
  margin: "0 auto",
  padding: `clamp(${vars.space.lg}, 4vh, ${vars.space["3xl"]}) 0 ${vars.space.xl}`,
  "@media": {
    [media.compact]: {
      gap: vars.space.md,
      justifyContent: "flex-start",
      paddingTop: vars.space.xl,
      paddingBottom: vars.space.xs,
    },
  },
});

export const dailyLabel = style([
  sectionLabel,
  {
    color: vars.color.text,
  },
]);

export const themeText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.md,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: 1.35,
  textAlign: "center",
});

export const statusText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.45,
  margin: 0,
  textAlign: "center",
});

export const score = style({
  display: "flex",
  justifyContent: "center",
});

export const welcomeHeader = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: vars.space.sm,
  marginTop: 0,
  "@media": {
    [media.compact]: {
      marginTop: vars.space.sm,
      gap: vars.space.xs,
    },
  },
});

export const iconWrapper = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "4.25rem",
  height: "4.25rem",
  borderRadius: vars.radius.xl,
  background: vars.color.accentSoft,
  border: `1px solid color-mix(in srgb, ${vars.color.accentLogo} 42%, transparent)`,
  color: vars.color.accentLogo,
  boxShadow: `0 0 2.5rem ${vars.color.accentGlow}, inset 0 1px 0 color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
  marginBottom: vars.space.xs,
  "@media": {
    [media.compact]: {
      width: "3.25rem",
      height: "3.25rem",
      borderRadius: "0.85rem",
      marginBottom: 0,
    },
  },
});

export const iconGlow = style({
  display: "none",
});

export const dateBadge = style({
  background: vars.color.accentSoft,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.accentLogo,
  borderRadius: vars.radius.pill,
  padding: `${vars.space.xs} ${vars.space.md}`,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xxs,
});

export const iosTitle = style([
  screenTitle,
  {
    "@media": {
      [media.compact]: {
        fontSize: vars.fontSize.xl,
      },
    },
  },
]);

export const iosSubtitle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.body,
  maxWidth: "24rem",
  margin: 0,
  textWrap: "balance",
  "@media": {
    [media.compact]: {
      fontSize: vars.fontSize.sm,
      lineHeight: vars.lineHeight.snug,
    },
  },
});

export const subtitleHighlight = style({
  color: vars.color.text,
  fontWeight: vars.fontWeight.bold,
});

export const buttonContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  width: "100%",
  marginTop: "auto",
});

export const iosWhiteButton = style([
  action({ fullWidth: true, tone: "primary" }),
  {
    minHeight: "3.75rem",
    borderRadius: vars.radius.pill,
    fontSize: vars.fontSize.md,
    selectors: {
      "&:active:not(:disabled)": {
        transform: "scale(0.96)",
      },
    },
  },
]);

export const buttonArrow = style({
  marginLeft: vars.space.xs,
  display: "inline-block",
  transition: "transform 0.15s ease",
});

export const iosFooterText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  textAlign: "center",
  margin: 0,
  opacity: 0.8,
});

globalStyle(`${iconWrapper} svg`, {
  "@media": {
    [media.compact]: {
      width: "1.75rem",
      height: "1.75rem",
    },
  },
});
