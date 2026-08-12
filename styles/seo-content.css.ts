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

export const copy = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.body,
  margin: `${vars.space.md} 0 0`,
  textWrap: "pretty",
});

export const inlineLinks = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.lg,
  marginTop: vars.space.xl,
});
