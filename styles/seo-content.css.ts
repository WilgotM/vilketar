import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

export const section = style({
  background: `color-mix(in srgb, ${vars.color.surface} 78%, transparent)`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  boxShadow: vars.shadow.panel,
  margin: `${vars.space["2xl"]} auto ${vars.space["3xl"]}`,
  maxWidth: "48rem",
  padding: `${vars.space["2xl"]} ${vars.space["2xl"]}`,
  textAlign: "left",
  width: `calc(100% - ${vars.space["2xl"]})`,
  "@media": {
    [media.narrow]: {
      borderRadius: vars.radius.lg,
      padding: vars.space.xl,
      width: `calc(100% - ${vars.space.xl})`,
    },
  },
});

export const eyebrow = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.14em",
  lineHeight: vars.lineHeight.tight,
  textTransform: "uppercase",
});

export const title = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "-0.035em",
  lineHeight: vars.lineHeight.tight,
  margin: `${vars.space.sm} 0 ${vars.space.md}`,
  textWrap: "balance",
});

export const subtitle = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "-0.025em",
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const copy = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.body,
  margin: `${vars.space.md} 0 0`,
  textWrap: "pretty",
});

export const linkGrid = style({
  display: "grid",
  gap: vars.space.sm,
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  marginTop: vars.space.xl,
  "@media": {
    [media.narrow]: {
      gridTemplateColumns: "minmax(0, 1fr)",
    },
  },
});

export const linkCard = style({
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.text,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  minHeight: "6rem",
  padding: vars.space.md,
  textDecoration: "none",
  transition: `background ${vars.duration.fast} ${vars.easing.standard}, transform ${vars.duration.fast} ${vars.easing.standard}`,
  selectors: {
    "&:hover": {
      background: vars.color.accentTint,
      transform: "translateY(-2px)",
    },
  },
});

export const linkCardText = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.snug,
});

export const faq = style({
  borderTop: `1px solid ${vars.color.border}`,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  marginTop: vars.space["2xl"],
  paddingTop: vars.space.xl,
});

export const faqItem = style({
  borderBottom: `1px solid ${vars.color.border}`,
  color: vars.color.text,
  paddingBottom: vars.space.sm,
});

export const faqSummary = style({
  cursor: "pointer",
  fontWeight: vars.fontWeight.semibold,
  listStylePosition: "outside",
  padding: `${vars.space.sm} 0`,
});

export const faqAnswer = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.body,
  margin: `0 0 ${vars.space.sm}`,
});

export const inlineLinks = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.lg,
  marginTop: vars.space.xl,
});
