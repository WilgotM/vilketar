import { keyframes, style } from "@vanilla-extract/css";
import { media, zIndex } from "./foundation";
import { vars } from "./theme.css";

const statusIn = keyframes({
  from: { opacity: 0, transform: "translate(-50%, -0.5rem)" },
  to: { opacity: 1, transform: "translate(-50%, 0)" },
});

export const status = style({
  alignItems: "center",
  animation: `${statusIn} ${vars.duration.normal} ${vars.easing.emphasized}`,
  backdropFilter: "blur(1rem)",
  WebkitBackdropFilter: "blur(1rem)",
  background: vars.color.surfaceChrome,
  border: `${vars.size.borderWidth} solid ${vars.color.borderStrong}`,
  borderRadius: vars.radius.pill,
  boxShadow: vars.shadow.card,
  color: vars.color.text,
  display: "inline-flex",
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.control,
  fontWeight: vars.fontWeight.semibold,
  gap: vars.space.sm,
  left: "50%",
  minHeight: "2.25rem",
  padding: `0 ${vars.space.lg}`,
  pointerEvents: "none",
  position: "fixed",
  top: `calc(env(safe-area-inset-top, 0px) + ${vars.space["4xl"]})`,
  transform: "translateX(-50%)",
  whiteSpace: "nowrap",
  zIndex: zIndex.overlay,
  "@media": {
    [media.compact]: {
      top: `calc(env(safe-area-inset-top, 0px) + ${vars.space["5xl"]})`,
    },
    [media.reduceMotion]: {
      animation: "none",
    },
  },
});

export const dot = style({
  background: vars.color.accentLogo,
  borderRadius: vars.radius.pill,
  boxShadow: `0 0 0 ${vars.space.xxs} ${vars.color.accentSoft}`,
  height: vars.space.sm,
  width: vars.space.sm,
});
