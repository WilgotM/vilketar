import { globalStyle, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { sectionLabel, stage as stageBase } from "./ui.css";

export const screen = style({
  display: "flex",
  height: "100%",
  justifyContent: "center",
  minHeight: 0,
  width: "100%",
  overflow: "hidden", // Completely lock scrolling
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
  paddingBottom: vars.space.xl,
  "@media": {
    [media.compact]: {
      gap: vars.space.sm, // Tight gap between elements
      paddingTop: vars.space.xl, // Give ample room for calendar icon glow to prevent clipping
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

// Premium iOS welcome layout styles:
export const welcomeHeader = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: vars.space.sm,
  marginTop: vars.space.lg,
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
  width: "4.75rem",
  height: "4.75rem",
  borderRadius: "1.25rem", // smooth iOS squircle
  background: `linear-gradient(135deg, ${vars.color.accentLogo} 0%, #f59e0b 100%)`,
  color: "#ffffff",
  boxShadow:
    "0 12px 28px rgba(217, 119, 6, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.35)",
  marginBottom: vars.space.xs,
  "@media": {
    [media.compact]: {
      width: "3.25rem", // Smaller compact icon container
      height: "3.25rem",
      borderRadius: "0.85rem",
      marginBottom: 0,
    },
  },
});

export const iconGlow = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "1.25rem",
  background: vars.color.accentLogo,
  filter: "blur(14px)",
  opacity: 0.3,
  zIndex: -1,
});

export const dateBadge = style({
  background: vars.color.accentSoft,
  border: `1px solid ${vars.color.border}`,
  color: vars.color.accentLogo,
  borderRadius: vars.radius.pill,
  padding: `${vars.space.xs} ${vars.space.md}`,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xxs,
});

export const iosTitle = style({
  fontFamily: vars.font.display,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.black,
  color: vars.color.text,
  margin: 0,
  letterSpacing: "-0.03em",
  lineHeight: vars.lineHeight.tight,
  "@media": {
    [media.compact]: {
      fontSize: "1.35rem", // More compact title size
    },
  },
});

export const iosSubtitle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.body,
  maxWidth: "24rem",
  margin: 0,
  textWrap: "balance",
  "@media": {
    [media.compact]: {
      fontSize: "0.8rem", // More compact subtitle description
      lineHeight: 1.25,
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

export const iosWhiteButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: "3.75rem", // Large height for premium iOS action button feel
  background: "#ffffff", // Pure white button background
  color: "#000000", // High contrast black text
  border: "none",
  borderRadius: vars.radius.pill, // Oval/pill shape
  fontSize: vars.fontSize.md, // Slightly larger, clear font size
  fontWeight: vars.fontWeight.bold, // Bold weight for premium readability
  cursor: "pointer",
  boxShadow:
    "0 10px 30px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(255, 255, 255, 0.2)",
  transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
  outline: "none",
  selectors: {
    "&:hover:not(:disabled)": {
      background: "#f4f4f5", // Smooth iOS system off-white
      boxShadow:
        "0 14px 36px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(255, 255, 255, 0.2)",
    },
    "&:active:not(:disabled)": {
      background: "#e4e4e7", // Smooth iOS system active gray
      transform: "scale(0.96)",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.4,
      background: "rgba(255, 255, 255, 0.6)",
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
});

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
