import { globalStyle, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { action } from "./ui.css";

export const shareButton = style([
  action({ fullWidth: true, tone: "primary", withIcon: true }),
  { borderRadius: vars.radius.pill, minHeight: "3.75rem" },
]);

export const overlay = style({
  alignItems: "center",
  background: `color-mix(in srgb, ${vars.color.backdropStrong} 68%, transparent)`,
  backdropFilter: "blur(1rem) saturate(0.85)",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflowY: "auto",
  padding: vars.space.xl,
  position: "fixed",
  WebkitBackdropFilter: "blur(1rem) saturate(0.85)",
  zIndex: 80,
  "@media": {
    [media.narrow]: { padding: vars.space.md },
    "screen and (max-height: 40rem)": {
      alignItems: "flex-start",
      paddingBottom: vars.space.lg,
      paddingTop: vars.space.sm,
    },
  },
});

export const modal = style({
  alignItems: "center",
  background: `linear-gradient(160deg, color-mix(in srgb, ${vars.color.surfaceStrong} 96%, ${vars.color.accentLogo}) 0%, ${vars.color.surfaceStrong} 72%)`,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.xl,
  boxShadow: `${vars.shadow.panel}, inset 0 1px 0 color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
  display: "grid",
  gap: vars.space.xl,
  gridTemplateColumns: "minmax(12rem, 0.9fr) minmax(15rem, 1.1fr)",
  maxWidth: "43rem",
  overflow: "hidden",
  padding: vars.space["3xl"],
  width: "100%",
  "@media": {
    [media.compact]: {
      gap: vars.space.lg,
      gridTemplateColumns: "1fr",
      maxWidth: "27rem",
      padding: vars.space.xl,
    },
    [media.narrow]: { borderRadius: vars.radius.lg, padding: vars.space.lg },
    "screen and (max-height: 40rem)": {
      gap: vars.space.md,
      gridTemplateColumns: "minmax(11rem, 0.8fr) minmax(15rem, 1.2fr)",
      margin: "auto",
      maxWidth: "41rem",
      padding: vars.space.lg,
    },
    "screen and (max-width: 36rem) and (max-height: 40rem)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const diagram = style({
  alignItems: "center",
  alignSelf: "stretch",
  background: `radial-gradient(circle at 35% 35%, ${vars.color.accentSoft}, transparent 55%), ${vars.color.backdrop}`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  minHeight: "15rem",
  overflow: "hidden",
  padding: vars.space.lg,
  "@media": {
    [media.compact]: { minHeight: "10rem" },
    "screen and (max-height: 40rem)": { minHeight: "8.5rem" },
  },
});

export const scoreTicket = style({
  alignItems: "center",
  background: vars.color.surfaceStrong,
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.accentLogo} 45%, ${vars.color.border})`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.card,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  justifyContent: "center",
  minHeight: "7rem",
  padding: vars.space.md,
  textAlign: "center",
});

export const diagramArrow = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
});

export const miniMessage = style({
  alignItems: "flex-start",
  background: vars.color.accentSoft,
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.accentLogo} 32%, ${vars.color.border})`,
  borderRadius: `${vars.radius.md} ${vars.radius.md} ${vars.radius.md} ${vars.radius.sm}`,
  display: "flex",
  flexDirection: "column",
  fontSize: vars.fontSize.xs,
  gap: vars.space.xs,
  lineHeight: vars.lineHeight.snug,
  padding: vars.space.md,
});

export const copy = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const eyebrow = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.11em",
  lineHeight: vars.lineHeight.tight,
  textTransform: "uppercase",
});

export const title = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: "clamp(2rem, 5vw, 3rem)",
  fontWeight: vars.fontWeight.black,
  letterSpacing: "-0.045em",
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const body = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.body,
  margin: 0,
  "@media": { [media.narrow]: { fontSize: vars.fontSize.md } },
});

export const actions = style({
  alignItems: "center",
  display: "flex",
  gap: vars.space.md,
  gridColumn: "2",
  "@media": {
    [media.compact]: { gridColumn: "1", justifyContent: "center" },
    "screen and (max-height: 40rem)": { gridColumn: "2" },
    "screen and (max-width: 36rem) and (max-height: 40rem)": {
      gridColumn: "1",
    },
  },
});

export const primaryButton = style([
  action({ tone: "primary", withIcon: true }),
  { borderRadius: vars.radius.pill, flex: "1 1 auto" },
]);

export const skipButton = style({
  background: "transparent",
  border: 0,
  color: vars.color.textMuted,
  cursor: "pointer",
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.sm}`,
  textDecoration: "underline",
  textDecorationColor: vars.color.borderStrong,
  textUnderlineOffset: vars.space.xxs,
});

export const coachLayer = style({
  inset: 0,
  pointerEvents: "none",
  position: "fixed",
  zIndex: 80,
});

export const spotlight = style({
  border: `${vars.space.xxs} solid ${vars.color.accentLogo}`,
  borderRadius: vars.radius.pill,
  boxShadow: `0 0 0 100vmax color-mix(in srgb, ${vars.color.backdropStrong} 72%, transparent), 0 0 0 ${vars.space.xs} ${vars.color.accentSoft}, 0 0 2.5rem color-mix(in srgb, ${vars.color.accentLogo} 38%, transparent)`,
  position: "fixed",
});

export const coachCard = style({
  alignItems: "center",
  background: vars.color.surfaceChrome,
  backdropFilter: "blur(1.25rem)",
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.panel,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  maxWidth: "18rem",
  padding: `${vars.space.md} ${vars.space.xl} ${vars.space.lg}`,
  position: "fixed",
  textAlign: "center",
  translate: "-50% -100%",
  width: "calc(100% - 2rem)",
  WebkitBackdropFilter: "blur(1.25rem)",
});

export const coachEyebrow = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
});

export const coachArrow = style({
  alignItems: "center",
  background: vars.color.accentLogo,
  borderRadius: vars.radius.pill,
  bottom: "-1.2rem",
  color: vars.color.accentText,
  display: "flex",
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.black,
  height: "2.4rem",
  justifyContent: "center",
  position: "absolute",
  width: "2.4rem",
});

export const copiedToast = style({
  alignItems: "center",
  background: `color-mix(in srgb, ${vars.color.surfaceStrong} 92%, transparent)`,
  backdropFilter: "blur(2rem) saturate(1.1)",
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.success} 42%, ${vars.color.borderStrong})`,
  borderRadius: vars.radius.pill,
  boxShadow: vars.shadow.panel,
  display: "grid",
  gap: vars.space.md,
  gridTemplateColumns: "auto minmax(0, 1fr)",
  left: "50%",
  maxWidth: "22rem",
  padding: `${vars.space.md} ${vars.space.xl}`,
  position: "fixed",
  top: `max(${vars.space.xl}, env(safe-area-inset-top))`,
  // Motion controls `transform` while the toast is entering and leaving. Use
  // the individual transform property so it remains centred throughout.
  translate: "-50% 0",
  width: "calc(100% - 2rem)",
  WebkitBackdropFilter: "blur(2rem) saturate(1.1)",
  zIndex: 90,
});

globalStyle(`${shareButton} svg, ${primaryButton} svg`, {
  fill: "none",
  height: "1.25rem",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
  width: "1.25rem",
});

globalStyle(`${shareButton} span`, { flex: 1, textAlign: "center" });
globalStyle(`${shareButton}::after`, {
  content: '""',
  height: "1.25rem",
  width: "1.25rem",
});
globalStyle(`${scoreTicket} span`, {
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.black,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});
globalStyle(`${scoreTicket} strong`, {
  color: vars.color.text,
  fontSize: vars.fontSize.lg,
});
globalStyle(`${scoreTicket} small`, {
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
});

globalStyle(`${coachCard} strong`, {
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
});

globalStyle(`${coachCard} > span:not(:first-child):not(:last-child)`, {
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});

globalStyle(`${copiedToast} > span`, {
  alignItems: "center",
  background: vars.color.success,
  borderRadius: vars.radius.pill,
  color: vars.color.accentText,
  display: "flex",
  fontWeight: vars.fontWeight.black,
  height: vars.space["3xl"],
  justifyContent: "center",
  width: vars.space["3xl"],
});

globalStyle(`${copiedToast} strong, ${copiedToast} small`, {
  display: "block",
});
globalStyle(`${copiedToast} strong`, {
  color: vars.color.text,
  fontSize: vars.fontSize.base,
});
globalStyle(`${copiedToast} small`, {
  color: vars.color.textMuted,
  fontSize: vars.fontSize.sm,
});
