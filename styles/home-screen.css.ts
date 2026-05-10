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
  display: "flex",
  flexDirection: "column",
  gap: vars.space["3xl"],
  position: "relative",
  width: `min(100%, 28rem)`,
  zIndex: 2,
  "@media": {
    [media.compact]: {
      transform: "translateY(-3.5rem)",
    },
  },
});

export const actions = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  width: "100%",
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
      paddingBottom: `calc(${vars.space.md} + env(safe-area-inset-bottom, 0px))`,
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
