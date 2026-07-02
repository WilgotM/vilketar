import { keyframes, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";

const float1 = keyframes({
  "0%, 100%": { transform: "rotate(-8deg) translateY(0)" },
  "50%": { transform: "rotate(-8deg) translateY(-8px)" },
});

const float2 = keyframes({
  "0%, 100%": { transform: "rotate(6deg) translateY(0)" },
  "50%": { transform: "rotate(6deg) translateY(-10px)" },
});

const float3 = keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: "translateY(-6px)" },
});

const float4 = keyframes({
  "0%, 100%": { transform: "rotate(4deg) translateY(0)" },
  "50%": { transform: "rotate(4deg) translateY(-9px)" },
});

const overlayIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const overlayOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const sheetIn = keyframes({
  from: { transform: "translateY(110%)" },
  to: { transform: "translateY(0)" },
});

const sheetOut = keyframes({
  from: { transform: "translateY(0)" },
  to: { transform: "translateY(110%)" },
});

const homeStageIn = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(1.35rem) scale(0.97)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
});

const homeStageInCompact = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(-2.15rem) scale(0.97)",
  },
  to: {
    opacity: 1,
    transform: "translateY(-3.5rem) scale(1)",
  },
});

const actionRise = keyframes({
  from: {
    opacity: 0,
    transform: "translateY(0.85rem) scale(0.98)",
  },
  to: {
    opacity: 1,
    transform: "translateY(0) scale(1)",
  },
});

export const home = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "100%",
  overflow: "hidden",
  position: "relative",
});

export const wrapper = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginLeft: "auto",
  marginRight: "auto",
  minHeight: "100dvh",
  padding: `0 ${vars.space.xl}`,
  position: "relative",
  textAlign: "center",
  width: "100%",
  "@media": {
    [media.compact]: {
      padding: `0 ${vars.space.lg}`,
      paddingBottom: vars.space["2xl"],
    },
  },
});

export const stage = style({
  alignItems: "center",
  animation: `${homeStageIn} ${vars.duration.cinematic} ${vars.easing.ios} both`,
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3xl"],
  position: "relative",
  width: `min(100%, 28rem)`,
  zIndex: 2,
  "@media": {
    [media.compact]: {
      animation: `${homeStageInCompact} ${vars.duration.cinematic} ${vars.easing.ios} both`,
      transform: "translateY(-3.5rem)",
    },
    [media.reduceMotion]: {
      animation: "none",
    },
  },
});

export const actions = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: "100%",
});

export const dailyActionRow = style({
  animation: `${actionRise} ${vars.duration.slower} ${vars.easing.ios} 100ms both`,
  display: "flex",
  gap: vars.space.sm,
  width: "100%",
  "@media": {
    [media.reduceMotion]: {
      animation: "none",
    },
  },
});

export const actionItem = style({
  animation: `${actionRise} ${vars.duration.slower} ${vars.easing.ios} both`,
  selectors: {
    "&:nth-child(2)": {
      animationDelay: "160ms",
    },
    "&:nth-child(3)": {
      animationDelay: "220ms",
    },
    "&:nth-child(4)": {
      animationDelay: "280ms",
    },
  },
  "@media": {
    [media.reduceMotion]: {
      animation: "none",
    },
  },
});

export const dailyActionSlot = style({
  flex: "1 1 auto",
  isolation: "isolate",
  minWidth: 0,
  overflow: "visible",
  position: "relative",
});

export const dailyAction = style({
  position: "relative",
  width: "100%",
  zIndex: 1,
});

const dailyStatusBadge = style({
  alignItems: "center",
  backdropFilter: "blur(20px) saturate(1.45)",
  WebkitBackdropFilter: "blur(20px) saturate(1.45)",
  borderRadius: vars.radius.pill,
  boxShadow:
    "0 0.55rem 1.35rem rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.42)",
  display: "inline-flex",
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  justifyContent: "center",
  letterSpacing: 0,
  lineHeight: vars.lineHeight.snug,
  minHeight: "1.65rem",
  padding: `0 ${vars.space.md}`,
  position: "absolute",
  right: vars.space.lg,
  textDecoration: "none",
  top: "-1.05rem",
  transition: `background ${vars.duration.fast} ${vars.easing.standard}, border-color ${vars.duration.fast} ${vars.easing.standard}, transform ${vars.duration.fast} ${vars.easing.standard}`,
  zIndex: 20,
  selectors: {
    "&:hover": {
      transform: "translateY(-0.0625rem)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
});

export const dailyStatusBadgeNew = style([
  dailyStatusBadge,
  {
    background:
      "linear-gradient(180deg, rgba(34, 197, 94, 0.7), rgba(21, 128, 61, 0.48))",
    border: "1px solid rgba(187, 247, 208, 0.72)",
    color: "#ecfdf5",
    textShadow: "0 1px 0 rgba(0, 0, 0, 0.28)",
    selectors: {
      "&:hover": {
        background:
          "linear-gradient(180deg, rgba(34, 197, 94, 0.82), rgba(21, 128, 61, 0.58))",
        borderColor: "rgba(220, 252, 231, 0.86)",
      },
    },
  },
]);

export const dailyStatusBadgeUnfinished = style([
  dailyStatusBadge,
  {
    background:
      "linear-gradient(180deg, rgba(59, 130, 246, 0.72), rgba(29, 78, 216, 0.5))",
    border: "1px solid rgba(191, 219, 254, 0.76)",
    color: "#eff6ff",
    textShadow: "0 1px 0 rgba(0, 0, 0, 0.3)",
    selectors: {
      "&:hover": {
        background:
          "linear-gradient(180deg, rgba(59, 130, 246, 0.84), rgba(29, 78, 216, 0.6))",
        borderColor: "rgba(219, 234, 254, 0.9)",
      },
    },
  },
]);

export const calendarButton = style({
  alignItems: "center",
  background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
  borderRadius: vars.radius.sm,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
  color: vars.color.text,
  display: "inline-flex",
  flex: "0 0 auto",
  height: vars.size.controlHeight,
  justifyContent: "center",
  textDecoration: "none",
  transition: `all ${vars.duration.fast} ${vars.easing.standard}`,
  width: vars.size.controlHeight,
  selectors: {
    "&:hover": {
      background: `color-mix(in srgb, ${vars.color.text} 12%, transparent)`,
      borderColor: `color-mix(in srgb, ${vars.color.text} 20%, transparent)`,
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
    },
    "&:active": {
      opacity: 0.8,
      transform: "scale(0.96)",
    },
  },
});

export const calendarOverlay = style({
  alignItems: "flex-end",
  animation: `${overlayIn} ${vars.duration.normal} ${vars.easing.standard}`,
  background: vars.color.overlay,
  display: "flex",
  inset: 0,
  justifyContent: "center",
  padding: vars.space.lg,
  paddingBottom: 0,
  position: "fixed",
  zIndex: 30,
  "@media": {
    [media.wide]: {
      alignItems: "center",
      paddingBottom: vars.space.lg,
    },
  },
});

export const calendarOverlayClosing = style([
  calendarOverlay,
  {
    animation: `${overlayOut} ${vars.duration.normal} ${vars.easing.standard} forwards`,
  },
]);

export const calendarDialog = style({
  animation: `${sheetIn} ${vars.duration.slow} ${vars.easing.emphasized}`,
  background: vars.color.surfaceStrong,
  border: `1px solid ${vars.color.borderStrong}`,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: vars.radius.lg,
  borderTopRightRadius: vars.radius.lg,
  boxShadow: vars.shadow.panel,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  maxHeight: "calc(100dvh - 1rem)",
  overflow: "auto",
  padding: `${vars.space["2xl"]} ${vars.space.lg} ${vars.space.lg}`,
  position: "relative",
  transition: `transform ${vars.duration.normal} ${vars.easing.emphasized}`,
  width: "min(100%, 32rem)",
  "@media": {
    [media.wide]: {
      borderRadius: vars.radius.lg,
      maxHeight: "calc(100dvh - 3rem)",
      width: "min(100%, 34rem)",
    },
    [media.compact]: {
      paddingBottom: `calc(${vars.space.lg} + env(safe-area-inset-bottom, 0px))`,
    },
  },
});

export const calendarDialogClosing = style([
  calendarDialog,
  {
    animation: `${sheetOut} ${vars.duration.normal} ${vars.easing.emphasized} forwards`,
  },
]);

export const calendarHandle = style({
  background: vars.color.textSubtle,
  border: 0,
  borderRadius: vars.radius.pill,
  cursor: "grab",
  height: "0.3125rem",
  left: "50%",
  padding: 0,
  position: "absolute",
  top: vars.space.sm,
  transform: "translateX(-50%)",
  touchAction: "none",
  WebkitTapHighlightColor: "transparent",
  width: "3rem",
  zIndex: 1,
  selectors: {
    "&:active": {
      cursor: "grabbing",
    },
  },
});

export const footer = style({
  bottom: 0,
  left: "50%",
  marginTop: 0,
  paddingBottom: `calc(${vars.space.lg} + env(safe-area-inset-bottom, 0px))`,
  paddingLeft: vars.space.xl,
  paddingRight: vars.space.xl,
  position: "fixed",
  transform: "translateX(-50%)",
  width: `min(100%, ${vars.size.pageWidth})`,
  zIndex: 2,
  "@media": {
    [media.compact]: {
      paddingBottom: `calc(${vars.space["2xl"]} + env(safe-area-inset-bottom, 0px))`,
      paddingLeft: vars.space.lg,
      paddingRight: vars.space.lg,
      width: "100%",
    },
  },
});

export const about = style({});
export const githubButtonSlot = style({});

/* ── Decorative hero images ─────────────────────────────────── */

export const heroDecorations = style({
  inset: 0,
  margin: "0 auto",
  maxWidth: "1440px",
  pointerEvents: "none",
  position: "absolute",
  zIndex: 1,
});

const heroItemBase = style({
  position: "absolute",
  "@media": {
    [media.reduceMotion]: {
      animation: "none !important",
    },
  },
});

const heroImageBase = style({
  borderRadius: "0.75rem",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  height: "auto",
  objectFit: "cover",
  width: "100%",
});

/* City / polaroid — top left */
export const heroItemCity = style([
  heroItemBase,
  {
    animation: `${float1} 6s ease-in-out infinite`,
    left: "12%",
    top: "10%",
    transform: "rotate(-8deg)",
    width: "clamp(140px, 22vw, 340px)",
    "@media": {
      [media.compact]: {
        left: "0%",
        top: "2%",
        width: "clamp(130px, 38vw, 170px)",
      },
    },
  },
]);

export const heroImageCity = style([
  heroImageBase,
  {
    borderRadius: "0.25rem",
    boxShadow:
      "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 0 6px rgba(255,255,255,0.9)",
  },
]);

/* Astronaut — top right */
export const heroItemAstronaut = style([
  heroItemBase,
  {
    animation: `${float2} 7s ease-in-out infinite`,
    right: "10%",
    top: "8%",
    transform: "rotate(6deg)",
    width: "clamp(140px, 20vw, 320px)",
    "@media": {
      [media.compact]: {
        right: "-2%",
        top: "0%",
        width: "clamp(120px, 35vw, 160px)",
      },
    },
  },
]);

export const heroImageAstronaut = style([
  heroImageBase,
  {
    borderRadius: "1rem",
  },
]);

/* Radio — bottom left */
export const heroItemRadio = style([
  heroItemBase,
  {
    animation: `${float3} 8s ease-in-out infinite`,
    bottom: "16%",
    left: "10%",
    width: "clamp(140px, 22vw, 340px)",
    "@media": {
      [media.compact]: {
        bottom: "13%",
        left: "-2%",
        width: "clamp(130px, 38vw, 170px)",
      },
    },
  },
]);

export const heroImageRadio = style([
  heroImageBase,
  {
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
  },
]);

/* Vinyl — bottom right */
export const heroItemVinyl = style([
  heroItemBase,
  {
    animation: `${float4} 7.5s ease-in-out infinite`,
    bottom: "14%",
    right: "8%",
    transform: "rotate(4deg)",
    width: "clamp(150px, 24vw, 360px)",
    "@media": {
      [media.compact]: {
        bottom: "11%",
        right: "-4%",
        width: "clamp(140px, 40vw, 180px)",
      },
    },
  },
]);

export const heroImageVinyl = style([heroImageBase]);

/* ── Year badges ───────────────────────────────────────────── */

const yearBadgeBase = style({
  alignItems: "center",
  borderRadius: "50%",
  boxShadow:
    "0 8px 16px rgba(0, 0, 0, 0.3), inset 0 -4px 8px rgba(0, 0, 0, 0.2), inset 0 4px 8px rgba(255, 255, 255, 0.4)",
  color: "#fff",
  display: "flex",
  fontFamily: vars.font.body,
  fontSize: "clamp(0.85rem, 1.5vw, 1.25rem)",
  fontWeight: vars.fontWeight.bold,
  height: "clamp(3rem, 5vw, 4.5rem)",
  justifyContent: "center",
  letterSpacing: "0.02em",
  position: "absolute",
  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  width: "clamp(3rem, 5vw, 4.5rem)",
  zIndex: 3,
  "@media": {
    [media.compact]: {
      fontSize: "0.75rem",
      height: "2.5rem",
      width: "2.5rem",
    },
  },
});

export const yearBadge1949 = style([
  yearBadgeBase,
  {
    background:
      "radial-gradient(circle at 30% 30%, #ffd466 0%, #f5b731 40%, #c88c0b 100%)",
    right: "-1rem",
    top: "10%",
    "@media": {
      [media.compact]: {
        right: "-0.5rem",
        top: "5%",
      },
    },
  },
]);

export const yearBadge1969 = style([
  yearBadgeBase,
  {
    background:
      "radial-gradient(circle at 30% 30%, #ff8cc0 0%, #e85d9c 40%, #b8306c 100%)",
    left: "-1.5rem",
    top: "20%",
    "@media": {
      [media.compact]: {
        left: "-1rem",
        top: "15%",
      },
    },
  },
]);

export const yearBadge1962 = style([
  yearBadgeBase,
  {
    background:
      "radial-gradient(circle at 30% 30%, #c482de 0%, #9b59b6 40%, #6f2d8a 100%)",
    bottom: "10%",
    right: "-1.5rem",
    "@media": {
      [media.compact]: {
        bottom: "5%",
        right: "-1rem",
      },
    },
  },
]);

export const yearBadge1974 = style([
  yearBadgeBase,
  {
    background:
      "radial-gradient(circle at 30% 30%, #7ee082 0%, #4caf50 40%, #2e7a31 100%)",
    bottom: "20%",
    left: "-1rem",
    "@media": {
      [media.compact]: {
        bottom: "15%",
        left: "-0.5rem",
      },
    },
  },
]);

/* ── Scattered small decorations (dots, shapes) ────────────── */

export const scatterDots = style({
  inset: 0,
  pointerEvents: "none",
  position: "absolute",
  zIndex: 0,
});

export const dot = style({
  borderRadius: "50%",
  position: "absolute",
});

/* ── iOS 18 Profile Button Styles ──────────────────────────── */

export const profileButtonWrapper = style({
  height: "44px", // Touch target size
  position: "absolute",
  left: vars.space.md,
  top: vars.space.md,
  width: "44px",
  zIndex: 100, // Ensure it's above hero decorations
  "@media": {
    [media.compact]: {
      left: vars.space.sm,
      top: vars.space.sm,
    },
  },
});

export const profileButton = style({
  alignItems: "center",
  background: "transparent",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  padding: 0,
  textDecoration: "none",
  width: "100%",
  height: "100%",
  outline: "none",
});

export const profileAvatar = style({
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: vars.fontWeight.bold,
  fontSize: vars.fontSize.sm,
  color: "#ffffff",
  background: "linear-gradient(135deg, #E85D9C 0%, #9B59B6 100%)", // Vibrant brand matching gradient
  boxShadow: `0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 0 1px color-mix(in srgb, ${vars.color.text} 15%, transparent)`,
  position: "relative",
});

export const profileAvatarImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "50%",
});

export const profileAvatarShine = style({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.08) 100%)",
  pointerEvents: "none",
  borderRadius: "50%",
});
