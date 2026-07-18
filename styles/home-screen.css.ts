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
      justifyContent: "flex-start",
      padding: `${vars.space["4xl"]} ${vars.space.lg} ${vars.space.xl}`,
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
      gap: vars.space.xl,
      width: `min(100%, ${vars.size.contentWidth})`,
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
  backdropFilter: "blur(1rem)",
  WebkitBackdropFilter: "blur(1rem)",
  borderRadius: vars.radius.pill,
  boxShadow: vars.shadow.card,
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
    background: vars.color.surfaceRaised,
    border: `1px solid ${vars.color.accentLogo}`,
    color: vars.color.accentLogo,
    selectors: {
      "&:hover": {
        background: vars.color.accentSoft,
      },
    },
  },
]);

export const dailyStatusBadgeUnfinished = style([
  dailyStatusBadge,
  {
    background: vars.color.surfaceRaised,
    border: `1px solid ${vars.color.borderStrong}`,
    color: vars.color.text,
    selectors: {
      "&:hover": {
        background: vars.color.surfaceStrong,
      },
    },
  },
]);

export const calendarButton = style({
  alignItems: "center",
  background: vars.color.surfaceChrome,
  backdropFilter: "blur(1rem)",
  WebkitBackdropFilter: "blur(1rem)",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  boxShadow: vars.shadow.card,
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
      background: vars.color.surfaceRaised,
      borderColor: vars.color.borderStrong,
      boxShadow: vars.shadow.panel,
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
  touchAction: "none",
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

export const calendarDialogDragging = style([
  calendarDialog,
  {
    animation: "none",
  },
]);

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
  // Give the visible handle a generous touch target without changing its appearance.
  selectors: {
    "&::before": {
      content: '""',
      inset: "-0.75rem -1.5rem",
      position: "absolute",
    },
    "&:active": {
      cursor: "grabbing",
    },
  },
  zIndex: 1,
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
      position: "relative",
      bottom: "auto",
      left: "auto",
      marginTop: vars.space["3xl"],
      transform: "none",
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
        display: "none",
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
        display: "none",
      },
    },
  },
]);

export const heroImageVinyl = style([heroImageBase]);

/* ── Year badges ───────────────────────────────────────────── */

const yearBadgeBase = style({
  alignItems: "center",
  borderRadius: "50%",
  background: vars.color.surfaceRaised,
  border: `1px solid ${vars.color.accentLogo}`,
  boxShadow: `0 0 1.75rem ${vars.color.accentGlow}, ${vars.shadow.card}`,
  color: vars.color.accentLogo,
  display: "flex",
  fontFamily: vars.font.body,
  fontSize: "clamp(0.85rem, 1.5vw, 1.25rem)",
  fontWeight: vars.fontWeight.bold,
  height: "clamp(3rem, 5vw, 4.5rem)",
  justifyContent: "center",
  letterSpacing: "0.02em",
  position: "absolute",
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
  color: vars.color.backdropStrong,
  background: vars.color.accentLogo,
  boxShadow: `0 0 0 1px ${vars.color.borderStrong}, ${vars.shadow.card}`,
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
