import { keyframes, style } from "@vanilla-extract/css";
import { media } from "./foundation";
import { vars } from "./theme.css";
import { action, actionContent, actionIcon, actionLabel } from "./ui.css";

const swedishFlagDrift = keyframes({
  "0%, 100%": { backgroundPosition: "0% 50%, 50% 50%, 50% 50%, 0% 50%" },
  "50%": { backgroundPosition: "100% 50%, 50% 50%, 50% 50%, 100% 50%" },
});

const swedishFlagShine = keyframes({
  "0%, 100%": { opacity: 0.28, transform: "translateX(-110%) skewX(-14deg)" },
  "18%": { opacity: 0.68 },
  "50%": { opacity: 0.42, transform: "translateX(125%) skewX(-14deg)" },
  "68%": { opacity: 0.7 },
});

export const button = action({ tone: "primary" });

export const fullWidth = style({
  width: "100%",
});

export const minimal = style({
  background: vars.color.surfaceChrome,
  border: `1px solid ${vars.color.border}`,
  boxShadow: "none",
  color: vars.color.text,
  selectors: {
    "&:active": {
      opacity: 0.7,
      transform: "scale(0.98)",
    },
  },
});

export const withTrailingIcon = style({
  justifyContent: "space-between",
});

export const swedishClassics = style({
  background:
    "radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.32) 0%, transparent 32%), linear-gradient(90deg, transparent 0 28%, rgba(255, 217, 64, 0.98) 28% 41%, transparent 41% 100%), linear-gradient(180deg, transparent 0 34%, rgba(255, 217, 64, 0.98) 34% 57%, transparent 57% 100%), linear-gradient(120deg, #0052a3 0%, #006eba 42%, #004783 100%)",
  backgroundSize: "220% 100%, 100% 100%, 100% 100%, 220% 100%",
  borderColor: "rgba(255, 217, 64, 0.88)",
  boxShadow:
    "0 8px 24px rgba(0, 88, 160, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -10px 24px rgba(0, 33, 79, 0.24)",
  color: "#ffffff",
  isolation: "isolate",
  overflow: "hidden",
  position: "relative",
  textShadow: "0 1px 4px rgba(0, 25, 70, 0.56)",
  animation: `${swedishFlagDrift} 7s ease-in-out infinite`,
  selectors: {
    "&::after": {
      background:
        "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.06) 18%, rgba(255, 255, 255, 0.44) 42%, rgba(255, 255, 255, 0.72) 50%, rgba(255, 255, 255, 0.38) 58%, rgba(255, 255, 255, 0.04) 82%, transparent 100%)",
      bottom: "-35%",
      content: '""',
      filter: "blur(0.18rem)",
      left: "-16%",
      mixBlendMode: "screen",
      opacity: 0.46,
      pointerEvents: "none",
      position: "absolute",
      top: "-35%",
      transform: "translateX(-110%) skewX(-14deg)",
      width: "58%",
      zIndex: 0,
      animation: `${swedishFlagShine} 6.8s ease-in-out infinite`,
    },
    "&:hover": {
      background:
        "radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.38) 0%, transparent 34%), linear-gradient(90deg, transparent 0 28%, #ffe36f 28% 41%, transparent 41% 100%), linear-gradient(180deg, transparent 0 34%, #ffe36f 34% 57%, transparent 57% 100%), linear-gradient(120deg, #0060b8 0%, #1681cf 42%, #004f94 100%)",
      borderColor: "#ffe36f",
      boxShadow:
        "0 10px 28px rgba(0, 102, 190, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.34), inset 0 -10px 24px rgba(0, 33, 79, 0.2)",
      color: "#ffffff",
    },
  },
  "@media": {
    [media.reduceMotion]: {
      animation: "none",
      selectors: {
        "&::after": {
          animation: "none",
          opacity: 0.24,
          transform: "translateX(28%) skewX(-14deg)",
        },
      },
    },
  },
});

export const content = actionContent;

export const label = style([
  actionLabel,
  {
    position: "relative",
    zIndex: 1,
  },
]);

export const icon = style([
  actionIcon,
  {
    position: "relative",
    zIndex: 1,
  },
]);
