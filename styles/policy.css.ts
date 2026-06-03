import { style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

const glassSurface = {
  background: `linear-gradient(145deg, color-mix(in srgb, ${vars.color.backdropStrong} 60%, transparent), color-mix(in srgb, ${vars.color.backdrop} 40%, transparent))`,
  backdropFilter: "blur(2rem) saturate(1.2)",
  WebkitBackdropFilter: "blur(2rem) saturate(1.2)",
  border: `1px solid color-mix(in srgb, ${vars.color.text} 10%, transparent)`,
  boxShadow:
    "0 1.25rem 3.5rem rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
};

export const screen = style({
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  maxWidth: "46rem",
  width: "100%",
  paddingBottom: vars.space["5xl"],
  paddingTop: vars.space["2xl"],
  paddingLeft: vars.space.xl,
  paddingRight: vars.space.xl,
  "@media": {
    [media.narrow]: {
      paddingTop: vars.space.lg,
      paddingLeft: vars.space.md,
      paddingRight: vars.space.md,
      paddingBottom: vars.space["3xl"],
    },
  },
});

export const panel = style({
  ...glassSurface,
  borderRadius: vars.radius.md,
  padding: vars.space["2xl"],
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  "@media": {
    [media.narrow]: {
      padding: vars.space.lg,
      gap: vars.space.md,
    },
  },
});

export const title = style({
  fontFamily: vars.font.body,
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.tight,
  margin: 0,
  color: vars.color.text,
});

export const subtitle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
  marginTop: `calc(-1 * ${vars.space.md})`,
  marginBottom: vars.space.sm,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.snug,
  marginTop: vars.space.xl,
  marginBottom: vars.space.xs,
  color: vars.color.text,
  selectors: {
    "&:first-of-type": {
      marginTop: vars.space.xs,
    },
  },
});

export const text = style({
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  margin: `0 0 ${vars.space.md}`,
  selectors: {
    "&:last-child": {
      marginBottom: 0,
    },
  },
});

export const list = style({
  margin: `0 0 ${vars.space.md}`,
  paddingLeft: vars.space.xl,
});

export const listItem = style({
  color: vars.color.text,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  marginBottom: vars.space.xs,
});
