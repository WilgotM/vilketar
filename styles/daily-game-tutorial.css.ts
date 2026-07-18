import { keyframes, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

const markerGlow = keyframes({
  "0%, 100%": { boxShadow: `0 0 0 ${vars.space.xxs} ${vars.color.accentSoft}` },
  "50%": { boxShadow: `0 0 0 ${vars.space.sm} ${vars.color.accentSoft}` },
});

export const root = style({
  inset: 0,
  pointerEvents: "none",
  position: "absolute",
  zIndex: 60,
});

export const introOverlay = style({
  alignItems: "center",
  background: `color-mix(in srgb, ${vars.color.backdropStrong} 62%, transparent)`,
  backdropFilter: "blur(1rem) saturate(0.85)",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  padding: vars.space.xl,
  pointerEvents: "auto",
  position: "absolute",
  WebkitBackdropFilter: "blur(1rem) saturate(0.85)",
  "@media": {
    [media.narrow]: { padding: vars.space.md },
    "screen and (max-height: 40rem)": {
      alignItems: "flex-start",
      overflowY: "auto",
      paddingBottom: vars.space.lg,
      paddingTop: vars.space.sm,
    },
  },
});

export const introCard = style({
  alignItems: "center",
  background: `linear-gradient(160deg, color-mix(in srgb, ${vars.color.surfaceStrong} 96%, ${vars.color.accentLogo}) 0%, ${vars.color.surfaceStrong} 72%)`,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.xl,
  boxShadow: `${vars.shadow.panel}, inset 0 1px 0 color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
  display: "grid",
  gap: vars.space.xl,
  gridTemplateColumns: "minmax(10rem, 0.85fr) minmax(14rem, 1.15fr)",
  maxWidth: "43rem",
  overflow: "hidden",
  padding: vars.space["3xl"],
  position: "relative",
  width: "100%",
  "@media": {
    [media.compact]: {
      gap: vars.space.lg,
      gridTemplateColumns: "1fr",
      maxWidth: "27rem",
      padding: vars.space.xl,
    },
    [media.narrow]: {
      borderRadius: vars.radius.lg,
      padding: vars.space.lg,
    },
    "screen and (max-height: 40rem)": {
      gap: vars.space.md,
      gridTemplateColumns: "minmax(8rem, 0.75fr) minmax(13rem, 1.25fr)",
      margin: "auto",
      maxWidth: "39rem",
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
  background: `radial-gradient(circle at 50% 18%, ${vars.color.accentSoft}, transparent 55%), ${vars.color.backdrop}`,
  border: `${vars.size.borderWidth} solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "17rem",
  overflow: "hidden",
  padding: vars.space.lg,
  position: "relative",
  "@media": {
    [media.compact]: { minHeight: "12rem" },
    "screen and (max-height: 40rem)": { minHeight: "10rem" },
  },
});

export const diagramDeck = style({
  height: "6.25rem",
  position: "relative",
  width: "5rem",
});

const diagramCardBase = style({
  borderRadius: vars.radius.sm,
  height: "5.75rem",
  left: "0.625rem",
  position: "absolute",
  top: 0,
  width: "3.75rem",
});

export const diagramBackCard = style([
  diagramCardBase,
  {
    background: `linear-gradient(145deg, ${vars.color.accentLogo}, color-mix(in srgb, ${vars.color.accentLogo} 55%, ${vars.color.accent}))`,
    boxShadow: vars.shadow.card,
    transform: "rotate(6deg) translate(0.4rem, 0.3rem)",
  },
]);

export const diagramCard = style([
  diagramCardBase,
  {
    alignItems: "center",
    background: vars.color.surfaceStrong,
    border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
    boxShadow: vars.shadow.card,
    display: "flex",
    justifyContent: "center",
  },
]);

export const diagramCardMark = style({
  alignItems: "center",
  background: vars.color.accent,
  borderRadius: vars.radius.pill,
  color: vars.color.accentText,
  display: "flex",
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
  height: vars.space["3xl"],
  justifyContent: "center",
  width: vars.space["3xl"],
});

export const diagramArrow = style({
  fill: "none",
  height: "2.75rem",
  marginBottom: vars.space.sm,
  marginTop: vars.space.xs,
  stroke: vars.color.accentLogo,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 3,
  width: "1.75rem",
  "@media": {
    [media.reduceMotion]: { animation: "none" },
    "screen and (max-height: 40rem)": { height: "1.75rem" },
  },
});

export const diagramTimeline = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  position: "relative",
  width: "100%",
  selectors: {
    "&::before": {
      background: vars.color.timeline,
      content: '""',
      height: vars.size.timelineThickness,
      left: vars.space.sm,
      position: "absolute",
      right: vars.space.sm,
      top: "50%",
    },
  },
});

export const diagramYear = style({
  background: vars.color.accent,
  borderRadius: vars.radius.pill,
  color: vars.color.accentText,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.bold,
  padding: `${vars.space.xs} ${vars.space.md}`,
  position: "relative",
  zIndex: 1,
});

export const diagramGap = style({
  animation: `${markerGlow} 1.4s ease-in-out infinite`,
  background: vars.color.accentLogo,
  borderRadius: vars.radius.pill,
  height: vars.space["3xl"],
  marginLeft: vars.space.lg,
  marginRight: vars.space.lg,
  position: "relative",
  width: vars.space.xs,
  zIndex: 1,
  "@media": { [media.reduceMotion]: { animation: "none" } },
});

export const introCopy = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const introTitle = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: "clamp(2rem, 5vw, 3.25rem)",
  fontWeight: vars.fontWeight.black,
  letterSpacing: "-0.045em",
  lineHeight: vars.lineHeight.tight,
  margin: 0,
});

export const introBody = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.body,
  margin: 0,
  maxWidth: "30rem",
  "@media": {
    [media.narrow]: { fontSize: vars.fontSize.md },
  },
});

export const introActions = style({
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

export const skipIntroButton = style({
  background: "transparent",
  border: 0,
  color: vars.color.textMuted,
  cursor: "pointer",
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  minHeight: vars.size.controlHeight,
  padding: `${vars.space.md} ${vars.space.lg}`,
  textDecoration: "underline",
  textDecorationColor: vars.color.borderStrong,
  textUnderlineOffset: vars.space.xxs,
});

export const coachCard = style({
  background: vars.color.surfaceChrome,
  backdropFilter: "blur(1.25rem) saturate(1.25)",
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.panel,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  maxWidth: "19rem",
  padding: vars.space.lg,
  pointerEvents: "none",
  position: "absolute",
  right: `max(${vars.space.lg}, env(safe-area-inset-right))`,
  top: vars.space.md,
  WebkitBackdropFilter: "blur(1.25rem) saturate(1.25)",
  width: "calc(100% - 2rem)",
  "@media": {
    [media.compact]: {
      left: "50%",
      maxWidth: "25rem",
      right: "auto",
      top: vars.space.sm,
      transform: "translateX(-50%)",
    },
    "screen and (max-height: 36rem)": {
      gap: vars.space.xxs,
      maxWidth: "22rem",
      padding: vars.space.md,
    },
  },
});

export const coachHeader = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
});

export const stepCount = style({
  color: vars.color.accentLogo,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});

export const skipCoachButton = style({
  background: "transparent",
  border: 0,
  color: vars.color.textMuted,
  cursor: "pointer",
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.semibold,
  margin: `calc(${vars.space.sm} * -1)`,
  padding: vars.space.sm,
  pointerEvents: "auto",
  textDecoration: "underline",
  textDecorationColor: vars.color.border,
  textUnderlineOffset: vars.space.xxs,
});

export const coachTitle = style({
  color: vars.color.text,
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
  letterSpacing: "-0.025em",
  lineHeight: vars.lineHeight.tight,
  "@media": {
    "screen and (max-height: 36rem)": { fontSize: vars.fontSize.lg },
  },
});

export const coachBody = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.snug,
  "@media": {
    "screen and (max-height: 36rem)": { fontSize: vars.fontSize.sm },
  },
});

export const deckHighlight = style({
  border: `${vars.space.xxs} solid ${vars.color.accentLogo}`,
  borderRadius: vars.radius.lg,
  boxShadow: `0 0 0 ${vars.space.xs} ${vars.color.accentSoft}, 0 0 2.5rem color-mix(in srgb, ${vars.color.accentLogo} 30%, transparent)`,
  pointerEvents: "none",
  position: "absolute",
});

export const dragHand = style({
  color: vars.color.accentLogo,
  filter: "drop-shadow(0 0.4rem 0.8rem rgba(0, 0, 0, 0.28))",
  height: "3.625rem",
  marginLeft: "-1.375rem",
  marginTop: "-1.8125rem",
  pointerEvents: "none",
  position: "absolute",
  transformOrigin: "50% 20%",
  width: "2.75rem",
});

export const handSvg = style({
  fill: vars.color.surfaceStrong,
  height: "100%",
  overflow: "visible",
  stroke: "currentColor",
  strokeLinejoin: "round",
  strokeWidth: 2,
  width: "100%",
});

export const handPulse = style({
  background: vars.color.accentSoft,
  border: `${vars.size.borderWidth} solid ${vars.color.accentLogo}`,
  borderRadius: vars.radius.pill,
  height: vars.space["3xl"],
  left: "50%",
  position: "absolute",
  top: vars.space.xs,
  transform: "translate(-50%, -50%)",
  width: vars.space["3xl"],
});

export const dropMarker = style({
  animation: `${markerGlow} 1.4s ease-in-out infinite`,
  background: vars.color.accentLogo,
  border: `${vars.size.borderWidth} solid ${vars.color.surfaceStrong}`,
  borderRadius: vars.radius.pill,
  height: "4.5rem",
  marginLeft: `calc(${vars.space.xxs} * -0.5)`,
  marginTop: "-2.25rem",
  pointerEvents: "none",
  position: "absolute",
  transformOrigin: "center",
  width: vars.space.xxs,
  "@media": {
    [media.reduceMotion]: { animation: "none" },
    "screen and (max-height: 40rem)": { height: "3rem", marginTop: "-1.5rem" },
  },
});

export const successCard = style({
  alignItems: "center",
  background: vars.color.surfaceChrome,
  backdropFilter: "blur(1.25rem)",
  border: `${vars.size.borderWidth} solid color-mix(in srgb, ${vars.color.success} 45%, ${vars.color.borderStrong})`,
  borderRadius: vars.radius.pill,
  boxShadow: vars.shadow.panel,
  color: vars.color.text,
  display: "flex",
  fontFamily: vars.font.display,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.black,
  gap: vars.space.md,
  left: "50%",
  padding: `${vars.space.md} ${vars.space.xl}`,
  position: "absolute",
  top: "50%",
  WebkitBackdropFilter: "blur(1.25rem)",
  whiteSpace: "nowrap",
});

export const successIcon = style({
  alignItems: "center",
  background: vars.color.success,
  borderRadius: vars.radius.pill,
  color: vars.color.accentText,
  display: "flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.md,
  height: vars.space["3xl"],
  justifyContent: "center",
  width: vars.space["3xl"],
});
